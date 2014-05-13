var assert = require('assert'),
  Sha3 = require('sha3'),
  async = require('async'),
  rlp = require('rlp'),
  TrieNode = require('./trieNode'),
  internals = {};

exports = module.exports = internals.Trie = function(db, root) {
  assert(this.constructor === internals.Trie, 'Trie must be instantiated using new');
  this.root = root;
  this.db = db;
};

/*
 * Gets a value given a key
 * @method get
 * @param {String} key - the key to search for
 */
internals.Trie.prototype.get = function(key, cb) {
  this._findNode(key, this.root, [], function(err, node, remainder, stack) {
    var value = null;
    if (node) {
      value = node.getValue();
    }
    cb(err, value);
  });
};

/*
 * Stores a key value
 * @method put
 * @param {Buffer|String} key
 * @param {Buffer|String} Value
 */
internals.Trie.prototype.put = function(key, value, cb) {
  var self = this;

  if (this.root) {
    //first try to find the give key or its nearst node
    this._findNode(key, this.root, [], function(err, foundValue, keyRemainder, stack) {
      if (err) {
        cb(err);
      } else {
        //then update
        self._updateNode(key, value, keyRemainder, stack, cb);
      }
    });
  } else {
    //if no root initialize this trie
    this._createNewNode(key, value, cb);
  }
};

//todo
internals.Trie.prototype.del = function(key, cb) {
  var self = this;

  this._findNode(key, this.root, [], function(err, foundValue, keyRemainder, stack) {
    if (err) {
      cb(err);
    } else if (foundValue) {
      self._deleteNode(key, stack, cb);
    } else {
      cb();
    }
  });
};

/*
 * Trys to find a node, given a key it will find the closest node to that key
 * and return to the callback a `stack` of nodes to the closet node
 * @method _findNode
 * @param {String|Buffer} - key - the search key
 * @param {String|Buffer} - root - the root node
 * @param {Function} - cb - the callback function. Its is given the following
 * arguments
 *  - err - any errors encontered
 *  - value - the value of the last node found
 *  - remainder - the remaining key nibbles not accounted for
 *  - stack - an array of nodes that forms the path to node we are searching for
 */
internals.Trie.prototype._findNode = function(key, root, stack, cb) {
  var self = this;

  //parse the node and gets the next node if any to parse
  function processNode(rawNode) {
    var node = new TrieNode(rawNode);
    stack.push(node);
    if (node.type == 'branch') {
      //branch
      if (key.length === 0) {
        cb(null, node, [], stack, cb);
      } else {
        var branchNode = node.getValue(key[0]);
        if (!branchNode) {
          //there is no more nodes to find
          cb(null, node, key, stack);
        } else {
          key.shift();
          self._findNode(key, branchNode, stack, cb);
        }
      }
    } else {
      var nodeKey = node.getKey(),
        matchingLen = internals.matchingNibbleLength(nodeKey, key),
        keyRemainder = key.slice(matchingLen);

      if (node.type == 'leaf') {
        if (keyRemainder.length !== 0 || key.length != nodeKey.length) {
          //we did not find the key
          node = null;
        } else {
          key = [];
        }
        cb(null, node, key, stack);

      } else if (node.type == 'extention') {
        if (matchingLen != nodeKey.length) {
          //we did not find the key
          cb(null, node, key, stack);
        } else {
          self._findNode(keyRemainder, node.getValue(), stack, cb);
        }
      }
    }
  }

  if (!Array.isArray(key)) {
    //convert key to nibbles
    key = TrieNode.stringToNibbles(key);
  }

  if (!Array.isArray(stack)) {
    stack = [];
  }

  if (!Array.isArray(root) && !Buffer.isBuffer(root)) {
    root = new Buffer(root, 'hex');
  }

  if (root.length == 32) {
    //resovle hash to node
    this.db.get(root, {
      encoding: 'binary'
    }, function(err, foundNode) {
      if (err) {
        cb(err, foundNode, key, stack);
      } else {
        processNode(rlp.decode(foundNode));
      }
    });
  } else {
    processNode(root);
  }
};

/* Updates a node
 * @method _updateNode
 * @param {Buffer} key
 * @param {Buffer| String} value
 * @param {Array} keyRemainder
 * @param {Array} stack -
 * @param {Function} cb - the callback
 */
internals.Trie.prototype._updateNode = function(key, value, keyRemainder, stack, cb) {

  function formatNode(node, topLevel, toSaveStack) {
    var rlpNode = rlp.encode(node.raw);
    if (rlpNode.length >= 32 || topLevel) {
      //create a hash of the node
      var hash = new Sha3.SHA3Hash(256);
      hash.update(rlpNode);
      //no way to get a buffer directly from the hash :(
      var hashRoot = new Buffer(hash.digest('hex'), 'hex');
      toSaveStack.push({
        type: 'put',
        key: hashRoot,
        value: rlpNode
      });
      return hashRoot;
    }
    return node.raw;
  }

  var self = this,
    toSave = [],
    lastNode = stack.pop();

  //add the new nodes
  key = TrieNode.stringToNibbles(key);
  if (lastNode.type == "branch") {
    stack.push(lastNode);
    if (keyRemainder !== 0) {
      //add an extention to a branch node
      keyRemainder.shift();
      //create a new leaf
      var newLeaf = new TrieNode('leaf', keyRemainder, value );
      stack.push(newLeaf);
    } else {
      lastNode.setValue(value);
    }
  } else if (lastNode.type === 'leaf' && keyRemainder.length === 0) {
    //just updating a found value
    lastNode.setValue(value);
    stack.push(lastNode);
  } else {
    //if extension; create a branch node
    var lastKey = lastNode.getKey(),
      matchingLength = internals.matchingNibbleLength(lastNode.getKey(), keyRemainder),
      newBranchNode = new TrieNode('branch');

    //create a new extention node
    if (matchingLength !== 0) {
      var newKey = lastNode.getKey().slice(0, matchingLength),
        newExtNode = new TrieNode('extention', newKey, value);
      stack.push(newExtNode);
      lastKey.splice(0, matchingLength);
      keyRemainder.splice(0, matchingLength);
    }

    if (lastKey.length !== 0) {
      var branchKey = lastKey.shift();
      lastNode.setKey(lastKey);
      var formatedNode = formatNode(lastNode, false, toSave);
      newBranchNode.setValue(branchKey, formatedNode);
    } else {
      newBranchNode.setValue(lastNode.getValue());
    }

    stack.push(newBranchNode);

    if (keyRemainder.length !== 0) {
      keyRemainder.shift();
      //add a leaf node to the new branch node
      var leafNode = [internals.nibblesToBuffer(internals.addHexPrefix(keyRemainder, true)), value];
      stack.push(new TrieNode(leafNode));
    } else {
      newBranchNode.setValue(value);
    }
  }

  var lastRoot;
  //update nodes
  while (stack.length) {
    var node = stack.pop();
    if (node.type == 'leaf') {
      key.splice(key.length - node.getKey().length);
    } else if (node.type == 'extention') {
      key.splice(key.length - node.getKey.length);
      //TODO check it there is a lastRoot; for delete
      node.setValue(lastRoot);
    } else if (node.type == 'branch') {
      if (lastRoot) {
        var branchKey = key.pop();
        node.setValue(branchKey, lastRoot);
      }
    }
    var lastRoot = formatNode(node, stack.length === 0, toSave);
  }

  this.root = lastRoot.toString('hex');
  this.db.batch(toSave, {
    encoding: 'binary'
  }, cb);
};

internals.Trie.prototype._deleteNode = function(key, stack, cb) {
  var lastNode = stack.pop(),
    lastNodeType = internals.getNodeType(lastNode),
    parentNode = stack.pop(),
    parentNodeType = null;

  if (parentNode) {
    parentNodeType = internals.getNodeType(parentNode);
  }

  function processBranchNode(key, branchKey, branchNode, parentNode, stack) {
    //branchNode is the node ON the branch node not THE branch node
    var branchNodeType = internals.getNodeType(branchNode);
    var parentNodeType = internals.getNodeType(parentNode);
    if (parentNodeType === "branch") {

      stack.push(parentNode);
      if (branchNodeType === "branch") {
        //create an extention node
        var extentionKey = internals.addHexPrefix([branchKey], false);
        var extentionNode = [internals.nibblesToBuffer(extentionKey), null];
        stack.push(extentionNode);
        stack.push(branchNode);
        key.push(branchKey);
      } else {
        //branch key is an extention or a leaf
        var rawBranchNodeKey = TrieNode.stringToNibbles(branchNode[1]);
        var terminator = internals.isTerminator(rawBranchNodeKey);
        var branchNodeKey = internals.removeHexPrefix(rawBranchNodeKey);
        branchNodeKey.unshift(branchKey);
        key = key.concat(branchNodeKey);
        //re-encode the branch node key
        var encodedKey = internals.addHexPrefix(branchNodeKey, terminator);
        encodedKey = internals.nibblesToBuffer(encodedKey);
        branchNode[1] = encodedKey;
        stack.push(branchNode);
      }
    } else {
      //parent is a extention
      if (branchNodeType === "branch") {
        var rawParentKey = TrieNode.stringToNibbles(parentKey[1]);
        var parentKey = internals.removeHexPrefix(rawParentKey);
        parentKey.push(branchKey);
        var encodedKey = internals.addHexPrefix(parentKey, false);
        encodedKey = internals.nibbleToBuffer(encodedKey);

        parentNode[1] = encodedKey;
        key.push(branchKey);
        stack.push(parentNode);
        stack.push(branchNode);


      } else {
        //branch node is an leaf or extention and parent node is an exstention
        //add two keys together
        //dont push the parent node
        var rawParentKey = TrieNode.stringToNibbles(parentKey[1]);
        var parentKey = internals.removeHexPrefix(rawParentKey);

        var rawBranchNodeKey = TrieNode.stringToNibbles(branchNode[1]);
        var terminator = internals.isTerminator(rawBranchNodeKey);
        var branchNodeKey = internals.removeHexPrefix(rawBranchNodeKey);

        branchNodeKey.unshift(branchKey);
        parentKey = parentKey.concat(branchNodeKey);

        var encodedKey = internals.addHexPrefix(parentKey, terminator);
        encodedKey = internals.nibbleToBuffer(encodedKey);

        branchNode[0] = encodedKey;
        stack.push(branchNode);
      }
    }
  }

  //deleting
  if (!parentNode) {
    this.db.del(this.root, cb);
    this.root = null;

  } else if (lastNodeType == "branch" || (lastNodeType == "leaf" && parentNodeType == "branch")) {
    if (lastNodeType == "branch") {
      lastNode[16] = null;
    } else {
      var rawLastNodeKey = internals.removeHexPrefix(lastNode);
      key.splice(rawLastNodeKey.length);
      parentNode[key.pop()] = null;
      lastNode = parentNode;
      parentNode = stack.pop();
    }

    //nodes on the branch
    var branchNodes = [];
    //count the number of nodes on the branch
    lastNode.forEach(function(node, i) {
      if (node !== null && node !== undefined && !(node.length === 0 && node[0] === 0)) {
        branchNodes.push([i, node]);
      }
    });

    //if there is only one branch node left, collapse the branch node
    if (branchNodes.length == 1) {
      //add the one remaing branch node to node above it
      var branchNode = branchNodes[0][1];
      var branchNodeKey = branchNodeKey[0][0];
      //check to see if we need to resolve the following
      if (Buffer.isBuffer(branchNode) && branchNode.length === 32) {
        this.db.get(branchNode, {
          encoding: 'binary'
        }, function(err, foundNode) {
          if (err) {
            cb(err);
          } else {
            processBranchNode(key, branchNodeKey, rlp.decode(foundNode), parentNode, stack);
            cb(stack);
          }
        });
      } else {
        processBranchNode(key, branchNodeKey, branchNode, parentNode, stack);
        cb(stack);
      }
    } else {
      stack.push(lastNode);
    }
  }
};

//Creates the initail node
internals.Trie.prototype._createNewNode = function(key, value, cb) {
  //convert to nibbles
  var nibbleKey = TrieNode.stringToNibbles(key);
  //add  hex prefix
  internals.addHexPrefix(nibbleKey, true);
  //convert to buffer for storage
  nibbleKey = internals.nibblesToBuffer(nibbleKey);
  //rlp encode 
  var rlpNode = rlp.encode([nibbleKey, value]);
  //create the hash key
  var hash = new Sha3.SHA3Hash(256);
  hash.update(rlpNode);
  //no way to get a buffer directly from the hash :(
  var key = hash.digest('hex');
  key = new Buffer(key, 'hex');
  this.root = key;
  //save
  this.db.put(key, rlpNode, {
    encoding: 'binary'
  }, cb);
};

/**
 * @param {Array} dataArr
 * @returns {Buffer} - returns buffer of encoded data
 * hexPrefix
 **/
internals.addHexPrefix = function(key, terminator) {
  //odd
  if (key.length % 2) {
    key.unshift(1);
    //even
  } else {
    key.unshift(0);
    key.unshift(0);
  }

  if (terminator) {
    key[0] += 2;
  }
  return key;
};

internals.removeHexPrefix = function(val) {
  if (val[0] % 2) {
    val = val.slice(1);
  } else {
    val = val.slice(2);
  }
  return val;
};

/*
 * Detrimines if a key has Arnold Schwarzenegger in it.
 * @method isTerminator
 * @param {Array} key - an hexprefixed array of nibbles
 */
internals.isTerminator = function(key) {
  return key[0] > 1;
};


/*
 * Converts a  nibble array into a buffer
 * @method nibblesToBuffer
 * @param arr
 */
internals.nibblesToBuffer = function(arr) {
  var buf = new Buffer(arr.length / 2);
  for (var i = 0; i < buf.length; i++) {
    var q = i * 2;
    buf[i] = (arr[q] << 4) + arr[++q];
  }
  return buf;
};

/*
 * Returns the number of in order matching nibbles of two give nibble arrayes
 * @method matchingNibbleLength
 * @param {Array} nib1
 * @param {Array} nib2
 */
internals.matchingNibbleLength = function(nib1, nib2) {
  var i = 0;
  while (nib1[i] === nib2[i] && nib1.length > i) {
    i++;
  }
  return i;
};

/*
 * Determines the node type
 * Returns the following
 * - leaf - if teh node is a leaf
 * - branch - if the node is a branch
 * - extention - if the node is an extention
 * - unkown - if somehting fucked up
 */
internals.getNodeType = function(node) {
  if (Buffer.isBuffer(node) || typeof node == 'string' || node instanceof String) {
    return 'unkown';
  } else if (node.length == 17) {
    return 'branch';
  } else if (node.length == 2) {
    var key = TrieNode.stringToNibbles(node[0]);
    if (internals.isTerminator(key)) {
      return 'leaf';
    }
    return 'extention';
  }
};
