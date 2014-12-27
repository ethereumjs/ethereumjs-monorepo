const rlp = require('rlp'),
  Sha3 = require('sha3');

var internals = {};

exports = module.exports = internals.TrieNode = function (type, key, value) {
  if (Array.isArray(type)) {
    //parse raw node
    this.parseNode(type);
  } else {
    this.type = type;
    if (type === 'branch') {
      var values = key;
      this.raw = Array.apply(null, Array(17));
      if (values) {
        values.forEach(function (keyVal) {
          this.set.apply(this, keyVal);
        });
      }
    } else {
      this.raw = Array(2);
      this.setValue(value);
      this.setKey(key);
    }
  }
};

Object.defineProperty(internals.TrieNode.prototype, 'value', {
  get: function () {
    return this.getValue();
  },
  set: function (v) {
    this.setValue(v);
  }
});

Object.defineProperty(internals.TrieNode.prototype, 'key', {
  get: function () {
    return this.getKey();
  },
  set: function (k) {
    this.setKey(k);
  }
});

//parses a raw node
internals.TrieNode.prototype.parseNode = function (rawNode) {
  this.raw = rawNode;
  this.type = internals.getNodeType(rawNode);
};

//sets the value of the node
internals.TrieNode.prototype.setValue = function (key, value) {
  if (this.type !== 'branch') {
    this.raw[1] = key;
  } else {
    if (arguments.length === 1) {
      value = key;
      key = 16;
    }
    this.raw[key] = value;
  }
};

internals.TrieNode.prototype.getValue = function (key) {
  if (this.type === 'branch') {
    if (arguments.length === 0) {
      key = 16;
    }
    var val = this.raw[key];
    if (val !== null && val !== undefined && !(val.length === 0)) {
      return val;
    }
  } else {
    return this.raw[1];
  }
};

internals.TrieNode.prototype.setKey = function (key) {
  if (this.type !== 'branch') {
    if (Buffer.isBuffer(key) || typeof key === 'string') {
      key = internals.stringToNibbles(key);
    } else {
      key = key.slice(0); //copy the key
    }
    key = internals.addHexPrefix(key, this.type === 'leaf');
    this.raw[0] = internals.nibblesToBuffer(key);
  }
};

//returns the key as a nibble
internals.TrieNode.prototype.getKey = function () {
  if (this.type != 'branch') {
    var key = this.raw[0];
    key = internals.removeHexPrefix(internals.stringToNibbles(key));
    return (key);
  }
};

internals.TrieNode.prototype.serialize = function () {
  return rlp.encode(this.raw);
};

internals.TrieNode.prototype.hash = function () {
  
  var hash = new Sha3.SHA3Hash(256);
  hash.update(this.serialize());
  //no way to get a buffer directly from the hash :(
  var key = hash.digest('hex');
  return new Buffer(key, 'hex');
};

internals.TrieNode.prototype.toString = function () {
  var out = this.type;
  out += ': [';
  this.raw.forEach(function (el) {
    if (Buffer.isBuffer(el)) {
      out += el.toString('hex') + ', ';
    } else if (el) {
      out += 'object, ';
    } else {
      out += 'empty, ';
    }
  });
  out = out.slice(0, -2);
  out += ']';
  return out;
};

/**
 * @param {Array} dataArr
 * @returns {Buffer} - returns buffer of encoded data
 * hexPrefix
 **/
internals.addHexPrefix = internals.TrieNode.addHexPrefix = function (key, terminator) {
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

internals.removeHexPrefix = internals.TrieNode.removeHexPrefix = function (val) {
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
internals.isTerminator = internals.TrieNode.isTerminator = function (key) {
  return key[0] > 1;
};

/*
 * Converts a string OR a buffer to a nibble array
 * @method stringToNibbles
 * @param {Buffer| String} key
 */
internals.stringToNibbles = internals.TrieNode.stringToNibbles = function (key) {
  var bkey = new Buffer(key);
  var nibbles = [];

  for (var i = 0; i < bkey.length; i++) {
    var q = i * 2;
    nibbles[q] = bkey[i] >> 4;
    ++q;
    nibbles[q] = bkey[i] % 16;
  }
  return nibbles;
};

/*
 * Converts a  nibble array into a buffer
 * @method nibblesToBuffer
 * @param arr
 */
internals.nibblesToBuffer = internals.TrieNode.nibblesToBuffer = function (arr) {
  var buf = new Buffer(arr.length / 2);
  for (var i = 0; i < buf.length; i++) {
    var q = i * 2;
    buf[i] = (arr[q] << 4) + arr[++q];
  }
  return buf;
};

/*
 * Determines the node type
 * Returns the following
 * - leaf - if teh node is a leaf
 * - branch - if the node is a branch
 * - extention - if the node is an extention
 * - unkown - if somehting fucked up
 */
internals.getNodeType = internals.TrieNode.getNodeType = function (node) {
  if (Buffer.isBuffer(node) || typeof node === 'string' || node instanceof String) {
    return 'unkown';
  } else if (node.length === 17) {
    return 'branch';
  } else if (node.length === 2) {
    var key = internals.stringToNibbles(node[0]);
    if (internals.isTerminator(key)) {
      return 'leaf';
    }
    return 'extention';
  }
};
