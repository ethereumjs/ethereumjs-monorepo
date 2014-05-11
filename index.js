var assert = require('assert'),
  Sha3 = require('sha3'),
  async = require('async'),
  rlp = require('rlp'),
  internals = {};

exports = module.exports = internals.Trie = function (db, root) {
  assert(this.constructor === internals.Trie, 'Trie must be instantiated using new');
  this.root = root;
  this.db = db;
};

internals.Trie.prototype.put = function (key, value, cb) {
  var self = this;
  if (this.root) {
    this._findNode(key, this.root, [], function (err, foundValue, keyRemainder, stack) {
      if (err) {
        cb(err);
      } else {
        self._updateNode(key, value, keyRemainder, stack, cb);
      }
    });
  } else {
    this._createNewNode(key, value, cb);
  }
};

internals.Trie.prototype._updateNode = function (key, value, keyRemainder, stack, cb) {
  function formatNode(node, topLevel, toSaveStack) {
    var rlpNode = rlp.encode(node);
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
    return node;
  }

  var self = this,
    toSave = [],
    lastNode = stack.pop(),
    lastNodeType = internals.getNodeType(lastNode);

  key = internals.stringToNibbles(key);
  //node found! update that node.
  if (lastNodeType == "branch") {
    if (keyRemainder !== 0) {
      //add an extention to a branch node
      keyRemainder.shift();
      var perfixedKey = internals.nibblesToBuffer(internals.addHexPrefix(keyRemainder, true));
      stack.push(lastNode);
      //create a new leaf
      stack.push([perfixedKey, value]);
    } else {
      lastNode[16] = value;
      stack.push(lastNode);
    }
  } else if(lastNodeType === 'leaf' &&  keyRemainder.length === 0 ){
    //just updating a found value
    lastNode[1] = value; 
    stack.push(lastNode);
  }else {
    //extension
    //if terminator
    var rawLastKey = internals.stringToNibbles(lastNode[0]);
    var lastKey = internals.removeHexPrefix(rawLastKey);
    var matchingLength = internals.matchingNibbleLength(lastKey, keyRemainder);
    var terminator = internals.isTerminator(lastKey);
    var newNode = Array.apply(null, Array(17));

    //trim the current extension node
    if (matchingLength !== 0) {
      var newKey = lastKey.slice(0, matchingLength),
        newExtNode = [internals.nibblesToBuffer(internals.addHexPrefix(newKey, false)), value];

      stack.push(newExtNode);
      lastKey.splice(0, matchingLength);
      keyRemainder.splice(0, matchingLength);
    }

    if (lastKey.length !== 0) {
      var branchKey = lastKey.shift();
      lastNode[0] = internals.nibblesToBuffer(internals.addHexPrefix(lastKey, terminator));
      var formatedNode = formatNode(lastNode,false, toSave);
      newNode[branchKey] = formatedNode;
    } else {
      newNode[16] = lastNode[1];
    }

    stack.push(newNode);

    if (keyRemainder.length !== 0) {
      keyRemainder.shift();
      //add a leaf node to the new branch node
      var leafNode = [internals.nibblesToBuffer(internals.addHexPrefix(keyRemainder, true)), value];
      stack.push(leafNode);
    } else {
      newNode[16] = value;
    }
  }

  var lastRoot;
  //update nodes
  while (stack.length) {
    var node = stack.pop();
    var nodeType = internals.getNodeType(node);
    if (nodeType == 'leaf') {
      var nodeKey = internals.removeHexPrefix(internals.stringToNibbles(node[0]));
      key.splice(key.length - nodeKey.length);
    } else if (nodeType == 'extention') {
      //remove the used key nibbles
      var extKey = internals.removeHexPrefix(internals.stringToNibbles(node[0]));
      key.splice(key.length - extKey.length);
      node[1] = lastRoot;
    } else if (nodeType == 'branch') {
      if (lastRoot) {
        var branchKey = key.pop();
        node[branchKey] = lastRoot;
      }
    }
    var lastRoot = formatNode(node, stack.length === 0, toSave);
  }

  this.root = lastRoot.toString('hex');
  this.db.batch(toSave, {
    encoding: 'binary'
  }, cb);
};

/*
 * Gets a value given a key
 * @method get
 * @param {String} key - the key to search for
 */
internals.Trie.prototype.get = function (key, cb) {
  this._findNode(key, this.root, [], function (err, node, remainder, stack) {
    var value = null;
    if (remainder.length === 0) {
      var nodeType = internals.getNodeType(node);
      if (nodeType === 'branch') {
        value = node[16];
      } else {
        value = node[1];
      }
    }
    cb(err, value);
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
internals.Trie.prototype._findNode = function (key, root, stack, cb) {

  function processNode(node) {
    stack.push(node);
    var nodeType = internals.getNodeType(node);
    if (nodeType == 'branch') {
      //branch
      if (key.length === 0) {
        cb(null, node, [], stack, cb);
      } else {

        var firstNib = key[0],
          branchNode = node[firstNib];
        if (branchNode.toString('hex') == '00') {
          //there is no more nodes to find
          cb(null, node, key, stack);
        } else {
          key.shift();
          self._findNode(key, branchNode, stack, cb);
        }
      }
    } else {
      var rawNodeKey = internals.stringToNibbles(node[0]);
      var nodeKey = internals.removeHexPrefix(rawNodeKey);
      var matchingLen = internals.matchingNibbleLength(nodeKey, key);
      var keyRemainder = key.slice(matchingLen);

      if (nodeType == 'leaf') {
        if (keyRemainder.length !== 0 || key.length != nodeKey.length) {
          //we did not find the key
          cb(null, node, key, stack);
        } else {
          //we did find a key
          cb(null, node, [], stack);
        }

      } else if (nodeType == 'extention') {
        //ext
        if (matchingLen != nodeKey.length) {
          //we did not find the key
          cb(null, node, key, stack);
        } else {
          self._findNode(keyRemainder, node[1], stack, cb);
        }
      }
    }
  }

  var self = this;

  if (!Array.isArray(key)) {
    //convert key to nibbles
    key = internals.stringToNibbles(key);
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
    }, function (err, foundNode) {
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

internals.Trie.prototype._createNewNode = function (key, value, cb) {
  //convert to nibbles
  var nibbleKey = internals.stringToNibbles(key);
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

//todo
internals.Trie.prototype.del = function (key, cb) {
  var self = this;
  this._findNode(key, this.root, [], function (err, foundValue, keyRemainder, stack) {
    if (err) {
      cb(err);
    } else if (foundValue) {
      self._updateNode(key, value, keyRemainder, stack, true, cb);
    } else {
      cb();
    }
  });
};

/**
 *
 * @param {Array} dataArr
 * @returns {Buffer} - returns buffer of encoded data
 * hexPrefix
 **/
internals.addHexPrefix = function (key, terminator) {
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

internals.removeHexPrefix = function (val) {
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
internals.isTerminator = function (key) {
  return key[0] > 1;
};

internals.stringToNibbles = function (key) {
  var bkey = new Buffer(key);
  var nibbles = [];

  for (var i = 0; i < bkey.length; i++) {
    q = i * 2;
    nibbles[q] = bkey[i] >> 4;
    ++q;
    nibbles[q] = bkey[i] % 16;
  }
  return nibbles;
};

internals.nibblesToBuffer = function (arr) {
  var buf = new Buffer(arr.length / 2);
  for (var i = 0; i < buf.length; i++) {
    var q = i * 2;
    buf[i] = (arr[q] << 4) + arr[++q];
  }
  return buf;
};

internals.matchingNibbleLength = function (nib1, nib2) {
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
internals.getNodeType = function (node) {
  if (Buffer.isBuffer(node) || typeof node == 'string' || node instanceof String) {
    return 'unkown';
  } else if (node.length == 17) {
    return 'branch';
  } else if (node.length == 2) {
    var key = internals.stringToNibbles(node[0]);
    if (internals.isTerminator(key)) {
      return 'leaf';
    }
    return 'extention';
  }
};
