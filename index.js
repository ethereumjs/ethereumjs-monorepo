const SHA3 = require('sha3'),
  assert = require('assert'),
  rlp = require('rlp'),
  bignum = require('bignum');

//the max interger that this VM can handle
exports.MAX_INTEGER = bignum('ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff', 16);

//hex string of SHA3-256 hash of `null`
exports.SHA3_NULL = 'c5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470';

var TWO_POW256 = exports.TWO_POW256 = bignum('115792089237316195423570985008687907853269984665640564039457584007913129639936');

//SHA3-256 hash of the rlp of []
exports.SHA3_RLP_ARRAY = '1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347';

//SHA3-256 hash of the rlp of `null`
exports.SHA3_RLP = '56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421';

/**
 * Returns a buffer filled with 0s
 * @method zeros
 * @param {Integer} bytes  the number of bytes the buffer should be
 * @return {Buffer}
 */
exports.zeros = function(bytes) {
  var buf = new Buffer(bytes);
  buf.fill(0);
  return buf;
};


exports.sha3 = function(a) {
  var h = new SHA3.SHA3Hash(256);
  if (a) {
    h.update(a);
  }
  return new Buffer(h.digest('hex'), 'hex');
};

/**
 * Trims leading zeros from a buffer or an array
 * @method unpad
 * @param {Buffer|Array|String}
 * @return {Buffer|Array|String}
 */
exports.unpad = function(a) {
  var first = a[0];
  while (!first && a.length > 0) {
    a = a.slice(1);
    first = a[0];
  }
  return a;
};

/**
 * pads an array of buffer with leading zeros till it has `length` bytes
 * @method pad
 * @param {Buffer|Array} array
 * @param {Integer}  length the number of bytes the output should be
 * @return {Buffer|Array}
 */
exports.pad = function(array, length){
  var buf = new Buffer(length);

  if (array.length !== length) {
    buf.fill(0);
    for (var i = 0; i < array.length; i++) {
      buf[length - array.length + i] = array[i];
    }
  } else {
    buf = array;
  }

  return buf;
};

/**
 * Converts an integer into a hex string
 * @method intToHex
 * @param {Number}
 * @return {String}
 */
exports.intToHex = function(i) {
  assert(i % 1 === 0, 'number is not a interger');
  assert(i >= 0, 'number must be positive');
  var hex = i.toString(16);
  if (hex.length % 2) {
    hex = '0' + hex;
  }
  return hex;
};

/**
 * Converts an integer to a buffer
 * @method intToBuffer
 * @param {Number}
 * @return {Buffer}
 */
exports.intToBuffer = function(i) {
  var hex = exports.intToHex(i);
  return new Buffer(hex, 'hex');
};

/**
 * Converts a buffer to an Interger
 * @method bufferToInt
 * @param {Buffer}
 * @return {Number}
 */
exports.bufferToInt = function(buf) {
  if(buf.length === 0){
    return 0;
  }
  return parseInt(buf.toString('hex'), 16);
};

/**
 * interpets a buffer as a signed integer and returns a bignum
 * @method fromSigned
 * @param {Buffer} num
 * @return {Bignum}
 */
exports.fromSigned = function(num) {
  if (num.length === 32 && num[0] >= 128) {
    return  bignum.fromBuffer(num).sub(TWO_POW256);
  } else {
    return bignum.fromBuffer(num);
  }
};

/**
 * Converts a bignum to an unsigned interger and returns it as a buffer
 * @method toUnsigned
 * @param {Bignum} num
 * @return {Buffer}
 */
exports.toUnsigned = function(num) {
  if (num.lt(0)) {
    return num.add(TWO_POW256).toBuffer();
  } else {
    return num.toBuffer();
  }
};

/**
 * Returns the ethereum address of a given public key
 * @method pubToAddress
 * @param {Buffer}
 * @return {Buffer}
 */
exports.pubToAddress = function(pubKey) {

  var hash = new SHA3.SHA3Hash(256);

  hash.update(pubKey.slice(1));
  return new Buffer(hash.digest('hex').slice(-40), 'hex');
};

/**
 * Generates a new address
 * @method generateAddress
 * @param {Buffer} from the address which is creating this new address
 * @param {Buffer} nonce the nonce of the from account
 */
exports.generateAddress = function(from, nonce) {

  nonce = bignum.fromBuffer(nonce).sub(1).toBuffer();
  if(nonce.toString('hex') === '00'){
    nonce = 0;
  }
  var hash = new SHA3.SHA3Hash(256);
  hash.update(rlp.encode([new Buffer(from, 'hex'), nonce]));

  return  new Buffer(hash.digest('hex').slice(24), 'hex');
};

/**
 * defines properties on a `Object`
 * @method defineProperties
 * @param {Object} self the `Object` to define properties on
 * @param {Array} fields an array fields to define
 */
exports.defineProperties = function(self, fields) {

  fields.forEach(function(field, i) {
    if (!field.name) {
      field = {
        name: field
      };
    }

    Object.defineProperty(self, field.name, {
      enumerable: true,
      configurable: true,
      get: function() {
        return this.raw[i];
      },
      set: function(v) {
        if (!Buffer.isBuffer(v)) {
          if (typeof v === 'string') {
            v = new Buffer(v, 'hex');
          } else if (v !== null) {
            v = exports.intToBuffer(v);
          }
        }

        if (field.length) {
          assert(field.length === v.length, 'The field ' + field.name + 'must have byte length of ' + field.length);
        }

        this.raw[i] = v;
      }
    });
  });
};

/**
 * Validate defined fields
 * @method validate
 * @param {Array} fields
 * @param {Object} data
 */
exports.validate = function(fields, data) {
  var i = 0;
  fields.forEach(function(f) {
    if (f.name && f.length) {
      assert(data[i].length === f.length, 'invalid data for field: ' + f.name + ' needs length:' + f.length + 'got length: ' + data[i].length);
    }
    i++;
  });
};

/**
 * Print a Buffer Array
 * @method printBA
 * @param {Buffer|Array}
 */
exports.printBA = function(ba) {
  if (Buffer.isBuffer(ba)) {
    if (ba.length === 0) {
      console.log('new Buffer(0)');
    } else {
      console.log('new Buffer(\'' + ba.toString('hex') + '\', \'hex\')');
    }
  } else if (ba instanceof Array) {
    console.log('[');
    for (var i = 0; i < ba.length; i++) {
      exports.printBA(ba[i]);
      console.log(',');
    }
    console.log(']');
  } else {
    console.log(ba);
  }
};

/**
 * converts a buffer array to JSON
 * @method BAToJSON
 * @param {Buffer|Array}
 */
exports.baToJSON = function(ba) {
  if (Buffer.isBuffer(ba)) {
    return ba.toString('hex');
  } else if (ba instanceof Array) {
    var array = [];
    for (var i = 0; i < ba.length; i++) {
      array.push(exports.baToJSON(ba[i]));
    }
    return array;
  }
};
