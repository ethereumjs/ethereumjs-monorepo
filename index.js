const SHA3 = require('sha3'),
  assert = require('assert'),
  rlp = require('rlp'),
  bignum = require('bignum');

//the max interger that this VM can handle
exports.MAX_INTEGER = bignum('ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff', 16);

var TWO_POW256 = exports.TWO_POW256 = bignum('115792089237316195423570985008687907853269984665640564039457584007913129639936');

//hex string of SHA3-256 hash of `null`
exports.SHA3_NULL = 'c5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470';


//SHA3-256 hash of the rlp of []
exports.SHA3_RLP_ARRAY = '1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347';

//SHA3-256 hash of the rlp of `null`
exports.SHA3_RLP = '56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421';

var ETH_UNITS = exports.ETH_UNITS = [
  'wei',
  'Kwei',
  'Mwei',
  'Gwei',
  'szabo',
  'finney',
  'ether',
  'grand',
  'Mether',
  'Gether',
  'Tether',
  'Pether',
  'Eether',
  'Zether',
  'Yether',
  'Nether',
  'Dether',
  'Vether',
  'Uether'
];

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

/**
 * pads an array of buffer with leading zeros till it has `length` bytes
 * @method pad
 * @param {Buffer|Array} array
 * @param {Integer}  length the number of bytes the output should be
 * @return {Buffer|Array}
 */
exports.pad = function(msg, length) {
  var buf;
  if (msg.length < length) {
    buf = new Buffer(length);
    buf.fill(0);
    msg.copy(buf, length - msg.length);
    return buf;
  } else {
    return msg.slice(-length);
  }
};

/**
 * Trims leading zeros from a buffer or an array
 * @method unpad
 * @param {Buffer|Array|String}
 * @return {Buffer|Array|String}
 */
exports.unpad = function(a) {
  var first = a[0];
  while (a.length > 0 && first.toString() === '0') {
    a = a.slice(1);
    first = a[0];
  }
  return a;
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
  if (buf.length === 0) {
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
    return bignum.fromBuffer(num).sub(TWO_POW256);
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

exports.sha3 = function(a) {
  var h = new SHA3.SHA3Hash(256);
  if (a) {
    h.update(a);
  }
  return new Buffer(h.digest('hex'), 'hex');
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
  if (nonce.toString('hex') === '00') {
    nonce = 0;
  }
  var hash = new SHA3.SHA3Hash(256);
  hash.update(rlp.encode([new Buffer(from, 'hex'), nonce]));

  return new Buffer(hash.digest('hex').slice(24), 'hex');
};

/**
 * defines properties on a `Object`
 * @method defineProperties
 * @param {Object} self the `Object` to define properties on
 * @param {Array} fields an array fields to define
 */
exports.defineProperties = function(self, fields, data) {

  self.raw = [];
  self._fields = [];

  fields.forEach(function(field, i) {
    self._fields.push(field.name);
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
          } else if (typeof v === 'number') {
            v = exports.intToBuffer(v);
          } else if (v === null) {
            v = new Buffer([]);
          } else if (v.toBuffer) {
            v = v.toBuffer();
          } else {
            throw new Error('invalid type');
          }
        }

        if (!(field.empty && v.length === 0) && field.length) {
          assert(field.length === v.length, 'The field ' + field.name + 'must have byte length of ' + field.length);
        }

        this.raw[i] = v;
      }
    });

    if(field.default){
      self[field.name] = field.default;
    }

  });

  if (data) {
    if (Buffer.isBuffer(data)) {
      data = rlp.decode(data);
    }

    if (Array.isArray(data)) {
      //make sure all the items are buffers
      data.forEach(function(d, i) {
         self[self._fields[i]] = typeof d === 'string' ? new Buffer(d, 'hex') : d;
      });
    } else {
      for (var prop in data) {
        if (self._fields.indexOf(prop) !== -1) {
          self[prop] = data[prop];
        }
      }
    }
  }
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



/// @returns ascii string representation of hex value prefixed with 0x
exports.toAscii = function(hex) {
  // Find termination
  var str = '';
  var i = 0,
    l = hex.length;

  if (hex.substring(0, 2) === '0x')
    i = 2;

  for (; i < l; i += 2) {
    var code = parseInt(hex.substr(i, 2), 16);
    if (code === 0) {
      break;
    }

    str += String.fromCharCode(code);
  }

  return str;
};

/// @returns hex representation (prefixed by 0x) of ascii string
exports.fromAscii = function(str, pad) {
  pad = pad === undefined ? 0 : pad;
  var hex = this.toHex(str);
  while (hex.length < pad * 2) {
    hex += '00';
  }
  return '0x' + hex;
};

/// @returns decimal representaton of hex value prefixed by 0x
exports.toDecimal = function(val) {
  // remove 0x and place 0, if it's required
  val = val.length > 2 ? val.substring(2) : '0';
  return bignum(val, 16).toString(10);
};

// @returns hex representation (prefixed by 0x) of decimal value
exports.fromDecimal = function(val) {
  return '0x' + bignum(val).toString(16);
};

exports.toHex = function(str) {
  var hex = '';
  for (var i = 0; i < str.length; i++) {
    var n = str.charCodeAt(i).toString(16);
    hex += n.length < 2 ? '0' + n : n;
  }

  return hex;
};

/// used to transform value/string to eth string
/// TODO: use BigNumber.js to parse int
exports.toEth = function(str) {
  var val = typeof str === 'string' ? str.indexOf('0x') === 0 ? parseInt(str.substr(2), 16) : parseInt(str) : str;
  var unit = 0;
  var units = ETH_UNITS;
  while (val > 3000 && unit < units.length - 1) {
    val /= 1000;
    unit++;
  }
  var s = val.toString().length < val.toFixed(2).length ? val.toString() : val.toFixed(2);
  var replaceFunction = function($0, $1, $2) {
    return $1 + ',' + $2;
  };

  while (true) {
    var o = s;
    s = s.replace(/(\d)(\d\d\d[\.\,])/, replaceFunction);
    if (o === s)
      break;
  }
  return s + ' ' + units[unit];
};
