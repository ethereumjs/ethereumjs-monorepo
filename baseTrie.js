const assert = require('assert'),
  levelup = require('levelup'),
  memdown = require('memdown'),
  async = require('async'),
  rlp = require('rlp'),
  semaphore = require('semaphore'),
  TrieNode = require('./trieNode'),
  ReadStream = require('./readStream'),
  matchingNibbleLength = require('./util').matchingNibbleLength,
  doKeysMatch = require('./util').doKeysMatch,
  callTogether = require('./util').callTogether,
  asyncFirstSeries = require('./util').asyncFirstSeries;

const EMPTY_RLP_HASH_ST = '56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421';
const EMPTY_RLP_HASH = new Buffer(EMPTY_RLP_HASH_ST, 'hex');

module.exports = Trie;


function Trie(db, root) {

  this.EMPTY_TRIE_ROOT = EMPTY_RLP_HASH;

  this.sem = semaphore(1);

  // setup dbs
  this._db = db || levelup('', { db: memdown });
  this._getDBs = [this._db];
  this._putDBs = [this._db];

  Object.defineProperty(this, 'root', {
    set: function(value) {
      if (value) {
        if (!Buffer.isBuffer(value) && typeof value === 'string') {
          value = new Buffer(value, 'hex');
        }
        assert(value.length === 32, 'Invalid root length. Roots are 32 bytes');
      } else {
        value = EMPTY_RLP_HASH;
      }
      this._root = value;
    },
    get: function() {
      return this._root;
    }
  });

  this.root = root;
};

/**
 * Gets a value given a key
 * @method get
 * @param {String} key - the key to search for
 */
Trie.prototype.get = function(key, cb) {
  var self = this;

  self._findPath(key, function(err, node, remainder, stack) {
    var value = null;
    if (node && remainder.length === 0) {
      value = node.value;
    }
    cb(err, value);
  });
};

/**
 * Stores a key value
 * @method put
 * @param {Buffer|String} key
 * @param {Buffer|String} Value
 */
Trie.prototype.put = function(key, value, cb) {
  var self = this;

  if (!value) {
    self.del(key, cb);
  } else {
    cb = callTogether(cb, self.sem.leave);

    self.sem.take(function() {
      if (self.root.toString('hex') !== EMPTY_RLP_HASH_ST) {
        // first try to find the give key or its nearst node
        self._findPath(key, function(err, foundValue, keyRemainder, stack) {
          if (err) return cb(err);
          // then update
          self._updateNode(key, value, keyRemainder, stack, cb);
        });
      } else {
        // if no root initialize this trie
        self._createInitialNode(key, value, cb);
      }
    });
  }
};

// deletes a value
Trie.prototype.del = function(key, cb) {
  var self = this;
  cb = callTogether(cb, self.sem.leave);

  self.sem.take(function() {
    self._findPath(key, function(err, foundValue, keyRemainder, stack) {
      if (err) return cb(err);
      if (foundValue) {
        self._deleteNode(key, stack, cb);
      } else {
        cb();
      }
    });
  });
};

// retrieves a node from dbs by hash
Trie.prototype._lookupNode = function(node, cb) {
  var self = this;

  function dbGet(db, cb) {
    db.get(node, {
      keyEncoding: 'binary',
      valueEncoding: 'binary'
    }, function(err, foundNode) {
      // console.log('GET DB#'+(db === self._db ? 'DB':'SCRATCH'), 'node:', node.toString('hex'), foundNode ? 'HIT' : 'MISS')
      if (err || !foundNode) {
        cb(null, null);
      } else {
        foundNode = rlp.decode(foundNode);
        cb(null, new TrieNode(foundNode));
      }
    });
  }

  if (TrieNode.isRawNode(node)) {
    cb(new TrieNode(node));
  } else {
    asyncFirstSeries(this._getDBs, dbGet, function(err, result){
      if (!result) console.log('READ FAILED:', node.toString('hex'))
      cb(result);
    });
  }
};

// writes a single node to dbs
Trie.prototype._putNode = function(node, cb) {
  var self = this;
  var hash = node.hash();
  var serialized = node.serialize();

  function dbPut(db, cb) {
    // console.log('PUT DB#'+(db === self._db ? 'DB':'SCRATCH'), 'node:', hash.toString('hex'))
    db.put(hash, serialized, {
      keyEncoding: 'binary',
      valueEncoding: 'binary',
    }, cb);  
  }
  
  async.each(this._putDBs, dbPut, cb);
};

// writes many nodes to db
Trie.prototype._batchNodes = function(opStack, cb) {
  var self = this;

  function dbBatch(db, cb) {
    // console.log('BATCH-'+opStack.length, 'DB#'+(db === self._db ? 'DB':'SCRATCH'))
    // opStack.forEach(function(op){
    //   console.log('  -'+op.type.toUpperCase(), 'key:', op.key.toString('hex'))
    // })
    db.batch(opStack, {
      keyEncoding: 'binary',
      valueEncoding: 'binary'
    }, cb);  
  }
  
  async.each(this._putDBs, dbBatch, cb);
};

/**
 * Trys to find a path to the node for the given key.
 * It returns a `stack` of nodes to the closet node.
 * @method _findPath
 * @param {String|Buffer} - key - the search key
 * @param {Function} - cb - the callback function. Its is given the following
 * arguments
 *  - err - any errors encontered
 *  - node - the last node found
 *  - keyRemainder - the remaining key nibbles not accounted for
 *  - stack - an array of nodes that forms the path to node we are searching for
 */

Trie.prototype._findPath = function(targetKey, cb) {
  var self = this;
  var root = self.root;
  var stack = [];
  targetKey = TrieNode.stringToNibbles(targetKey);

  this._walkTrie(root, processNode, cb);

  function processNode(root, node, keyProgress, walkController) {

    var nodeKey = node.key || [];
    var keyRemainder = targetKey.slice(matchingNibbleLength(keyProgress, targetKey));
    var matchingLen = matchingNibbleLength(keyRemainder, nodeKey);

    stack.push(node);

    if (node.type === 'branch') {
      
      if (keyRemainder.length === 0) {
        // we exhausted the key without finding a node
        walkController.return(null, node, [], stack);
      } else {
        var branchIndex = keyRemainder[0];
        var branchNode = node.getValue(branchIndex);
        if (!branchNode) {
          // there are no more nodes to find and we didn't find the key
          walkController.return(null, null, keyRemainder, stack);
        } else {
          // node found, continuing search
          walkController.only(branchIndex);
        }
      }

    } else if (node.type === 'leaf') {
      
      if (doKeysMatch(keyRemainder, nodeKey)) {
        // keys match, return node with empty key
        walkController.return(null, node, [], stack);
      } else {
        // reached leaf but keys dont match
        walkController.return(null, null, keyRemainder, stack);
      }

    } else if (node.type === 'extention') {
      
      if (matchingLen !== nodeKey.length) {
        // keys dont match, fail
        walkController.return(null, null, keyRemainder, stack);
      } else {
        // keys match, continue search
        walkController.next();
      }

    }
  }

};

/*
 * Finds all nodes that store k,v values
 */
Trie.prototype._findNode = function(key, root, stack, cb){
  this._findPath(key, function(){
    cb.apply(null, arguments)
  })
}

/*
 * Finds all nodes that store k,v values
 */
Trie.prototype._findValueNodes = function(onFound, cb) {
  this._walkTrie(this.root, function (root, node, key, walkController) {
    var nodeKey = node.key || [];
    var fullKey = key.concat(node.key)
    if (node.type === 'leaf') {
      // found leaf node!
      onFound(root, node, fullKey, walkController.next)
    } else if (node.type === 'branch' && node.value) {
      // found branch with value
      onFound(root, node, fullKey, walkController.next)
    } else {
      // keep looking for value nodes
      walkController.next();
    }
  }, cb)
};

/*
 * Finds all nodes that are stored directly in the db
 * (some nodes are stored raw inside other nodes)
 */
Trie.prototype._findDbNodes = function(onFound, cb) {
  this._walkTrie(this.root, function (root, node, key, walkController) {
    if (TrieNode.isRawNode(root)) {
      walkController.next();
    } else {
      onFound(root, node, key, walkController.next);
    }
  }, cb);
}

/** 
 * Updates a node
 * @method _updateNode
 * @param {Buffer} key
 * @param {Buffer| String} value
 * @param {Array} keyRemainder
 * @param {Array} stack -
 * @param {Function} cb - the callback
 */
Trie.prototype._updateNode = function(key, value, keyRemainder, stack, cb) {
  var toSave = [],
    lastNode = stack.pop();

  // add the new nodes
  key = TrieNode.stringToNibbles(key);
  if (lastNode.type === 'branch') {
    stack.push(lastNode);
    if (keyRemainder !== 0) {
      // add an extention to a branch node
      keyRemainder.shift();
      // create a new leaf
      var newLeaf = new TrieNode('leaf', keyRemainder, value);
      stack.push(newLeaf);
    } else {
      lastNode.value = value;
    }
  } else if (lastNode.type === 'leaf' && keyRemainder.length === 0) {
    // just updating a found value
    lastNode.value = value;
    stack.push(lastNode);
  } else {
    // create a branch node
    var lastKey = lastNode.key,
      matchingLength = matchingNibbleLength(lastKey, keyRemainder),
      newBranchNode = new TrieNode('branch');

    // create a new extention node
    if (matchingLength !== 0) {
      var newKey = lastNode.key.slice(0, matchingLength),
        newExtNode = new TrieNode('extention', newKey, value);
      stack.push(newExtNode);
      lastKey.splice(0, matchingLength);
      keyRemainder.splice(0, matchingLength);
    }

    stack.push(newBranchNode);

    if (lastKey.length !== 0) {
      var branchKey = lastKey.shift();
      if (lastKey.length !== 0 || lastNode.type === 'leaf') {
        // shriking extention or leaf
        lastNode.key = lastKey;
        var formatedNode = this._formatNode(lastNode, false, toSave);
        newBranchNode.setValue(branchKey, formatedNode);
      } else {
        // remove extention or attaching 
        this._formatNode(lastNode, false, true, toSave);
        newBranchNode.setValue(branchKey, lastNode.value);
      }
    } else {
      newBranchNode.value = lastNode.value;
    }

    if (keyRemainder.length !== 0) {
      keyRemainder.shift();
      // add a leaf node to the new branch node
      var newLeafNode = new TrieNode('leaf', keyRemainder, value);
      stack.push(newLeafNode);
    } else {
      newBranchNode.value = value;
    }
  }

  this._saveStack(key, stack, toSave, cb);
};

// walk tree

Trie.prototype._walkTrie = function(root, onNode, onDone) {
  var self = this;
  root = root || self.root;
  onDone = onDone || function(){};
  var aborted = false;
  var returnValues = [];

  if (root === EMPTY_RLP_HASH_ST) return onDone()

  self._lookupNode(root, function(node){
    processNode(root, node, null, function(err){
      if (err) return onDone(err);
      onDone.apply(null, returnValues);
    })
  });

  function processNode(root, node, key, cb) {
    if (!node) return cb();
    if (aborted) return cb();
    var stopped = false;
    key = key || [];
    var nodeKey = node.key;

    var walkController = {
      stop: function(){
        stopped = true;
        cb();
      },
      // end all traversal and return values to the onDone cb
      return: function(){
        aborted = true;
        returnValues = arguments;
        cb();
      },
      next: function(){
        if (aborted) return cb();
        if (stopped) return cb();
        var children = node.getChildren();
        async.forEachOf(children, function(data, index, cb){
          var keyExtension = data[0];
          var childRoot = data[1];
          var childKey = key.concat(keyExtension);
          self._lookupNode(childRoot, function(node){
            processNode(childRoot, node, childKey, cb);
          });
        }, cb)
      },
      only: function(childIndex){
        var childRoot = node.getValue(childIndex);
        self._lookupNode(childRoot, function(node){
          var childKey = key.slice();
          childKey.push(childIndex);
          processNode(childRoot, node, childKey, cb);
        });
      },
    }

    onNode(root, node, key, walkController);
  }

};

/**
 * saves a stack
 * @method _saveStack
 * @param {Array} key - the key. Should follow the stack
 * @param {Array} stack - a stack of nodes to the value given by the key
 * @param {Array} opStack - a stack of levelup operations to commit at the end of this funciton
 * @param {Function} cb
 */
Trie.prototype._saveStack = function(key, stack, opStack, cb) {
  var lastRoot;

  // update nodes
  while (stack.length) {
    var node = stack.pop();
    if (node.type === 'leaf') {
      key.splice(key.length - node.key.length);
    } else if (node.type === 'extention') {
      key.splice(key.length - node.key.length);
      if (lastRoot) {
        node.value = lastRoot;
      }
    } else if (node.type === 'branch') {
      if (lastRoot) {
        var branchKey = key.pop();
        node.setValue(branchKey, lastRoot);
      }
    }
    lastRoot = this._formatNode(node, stack.length === 0, opStack);
  }

  if (lastRoot) {
    this.root = lastRoot;
  }

  this._batchNodes(opStack, cb);
};

Trie.prototype._deleteNode = function(key, stack, cb) {
  
  function processBranchNode(key, branchKey, branchNode, parentNode, stack) {
    // branchNode is the node ON the branch node not THE branch node
    var branchNodeKey = branchNode.key;
    if (!parentNode || parentNode.type === 'branch') {
      // branch->?
      if (parentNode) stack.push(parentNode);

      if (branchNode.type === 'branch') {
        // create an extention node
        // branch->extention->branch
        var extentionNode = new TrieNode('extention', [branchKey], null);
        stack.push(extentionNode);
        key.push(branchKey);
      } else {
        // branch key is an extention or a leaf
        // branch->(leaf or extention)
        branchNodeKey.unshift(branchKey);
        branchNode.key = branchNodeKey;

        // hackery. This is equvilant to array.concat; except we need keep the 
        // rerfance to the `key` that was passed in. 
        branchNodeKey.unshift(0);
        branchNodeKey.unshift(key.length);
        key.splice.apply(key, branchNodeKey);

      }
      stack.push(branchNode);
    } else {
      // parent is a extention
      var parentKey = parentNode.key;
      if (branchNode.type === 'branch') {
        // ext->branch
        parentKey.push(branchKey);
        key.push(branchKey);
        parentNode.key = parentKey;
        stack.push(parentNode);
      } else {
        // branch node is an leaf or extention and parent node is an exstention
        // add two keys together
        // dont push the parent node
        branchNodeKey.unshift(branchKey);
        key = key.concat(branchNodeKey);
        parentKey = parentKey.concat(branchNodeKey);
        branchNode.key = parentKey;
      }
      stack.push(branchNode);
    }

    return key;
  }

  var lastNode = stack.pop(),
    parentNode = stack.pop(),
    opStack = [],
    self = this;

  if (!Array.isArray(key)) {
    // convert key to nibbles
    key = TrieNode.stringToNibbles(key);
  }

  if (!parentNode) {
    // the root here has to be a leaf.
    this.root = EMPTY_RLP_HASH;
    cb();
  } else {
    if (lastNode.type === 'branch') {
      lastNode.value = null;
    } else {
      // the lastNode has to be a leaf if its not a branch. And a leaf's parent
      // if it has one must be a branch.
      var lastNodeKey = lastNode.key;
      key.splice(key.length - lastNodeKey.length);
      // delete the value
      this._formatNode(lastNode, false, true, opStack);
      parentNode.setValue(key.pop(), null);
      lastNode = parentNode;
      parentNode = stack.pop();
    }

    // nodes on the branch
    var branchNodes = [];
    // count the number of nodes on the branch
    lastNode.raw.forEach(function(node, i) {
      var val = lastNode.getValue(i);
      if (val) branchNodes.push([i, val]);
    });

    // if there is only one branch node left, collapse the branch node
    if (branchNodes.length === 1) {
      // add the one remaing branch node to node above it
      var branchNode = branchNodes[0][1],
        branchNodeKey = branchNodes[0][0];

      // look up node
      this._lookupNode(branchNode, function(foundNode) {
        key = processBranchNode(key, branchNodeKey, foundNode, parentNode, stack, opStack);
        self._saveStack(key, stack, opStack, cb);
      });

    } else {
      // simple removing a leaf and recaluclation the stack
      if (parentNode) {
        stack.push(parentNode);
      }
      stack.push(lastNode);
      self._saveStack(key, stack, opStack, cb);
    }
  }
};

// Creates the initial node from an empty tree
Trie.prototype._createInitialNode = function(key, value, cb) {
  var newNode = new TrieNode('leaf', key, value);
  this.root = newNode.hash();
  this._putNode(newNode, cb);
};

// formats node to be saved by levelup.batch.
// returns either the hash that will be used key or the rawNode
Trie.prototype._formatNode = function(node, topLevel, remove, opStack) {

  if (arguments.length === 3) {
    opStack = remove;
    remove = false;
  }

  var rlpNode = node.serialize();
  if (rlpNode.length >= 32 || topLevel) {
    var hashRoot = node.hash();

    if (remove && this.isCheckpoint) {
      opStack.push({
        type: 'del',
        key: hashRoot
      });
    } else {
      opStack.push({
        type: 'put',
        key: hashRoot,
        value: rlpNode
      });
    }
    return hashRoot;
  }
  return node.raw;
};

// creates a readstream
Trie.prototype.createReadStream = function() {
  return new ReadStream(this);
};

// creates a new trie with a shared cache
Trie.prototype.copy = function() {
  var trie = new Trie(this._db, this.root);
  return trie;
};

/**
 * runs a `hash` of command
 * @method batch
 * @param {Object} ops
 * @param {Function} cb
 */
Trie.prototype.batch = function(ops, cb) {
  var self = this;

  async.eachSeries(ops, function(op, cb2) {
    if(op.type === 'put'){
      self.put(op.key, op.value, cb2);
    }else if(op.type === 'del'){
      self.del(op.key, cb2);
    }else{
      cb2();
    }
  }, cb);
};

/**
 * Checks if a given root exists
 * @method checkRoot
 * @param {Buffer} root
 * @param {Function} cb
 */
Trie.prototype.checkRoot = function(root, cb) {
  this._lookupNode(root, function(value) {
    cb(!!value)
  });
};
