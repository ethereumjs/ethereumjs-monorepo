const SHA3 = require('sha3')
const ec = require('elliptic').ec('secp256k1')
const assert = require('assert')
const rlp = require('rlp')
const BN = require('bn.js')

// the max interger that this VM can handle
exports.MAX_INTEGER = new BN('ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff', 16)
exports.TWO_POW256 = new BN('115792089237316195423570985008687907853269984665640564039457584007913129639936')

// hex string of SHA3-256 hash of `null`
exports.SHA3_NULL = 'c5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470'

// SHA3-256 hash of the rlp of []
exports.SHA3_RLP_ARRAY = '1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347'

// SHA3-256 hash of the rlp of `null`
exports.SHA3_RLP = '56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421'

exports.BN = BN
exports.rlp = rlp

/**
 * Returns a buffer filled with 0s
 * @method zeros
 * @param {Integer} bytes  the number of bytes the buffer should be
 * @return {Buffer}
 */
exports.zeros = function (bytes) {
  var buf = new Buffer(bytes)
  buf.fill(0)
  return buf
}

/**
 * pads an array of buffer with leading zeros till it has `length` bytes
 * @method pad
 * @param {Buffer|Array} array
 * @param {Integer}  length the number of bytes the output should be
 * @return {Buffer|Array}
 */
exports.pad = function (msg, length) {
  msg = exports.toBuffer(msg)
  if (msg.length < length) {
    var buf = exports.zeros(length)
    msg.copy(buf, length - msg.length)
    return buf
  }
  return msg.slice(-length)
}

/**
 * Trims leading zeros from a buffer or an array
 * @method unpad
 * @param {Buffer|Array|String}
 * @return {Buffer|Array|String}
 */
exports.unpad = exports.stripZeros = function (a) {
  a = exports.stripHexPrefix(a)
  var first = a[0]
  while (a.length > 0 && first.toString() === '0') {
    a = a.slice(1)
    first = a[0]
  }
  return a
}

exports.toBuffer = function (v) {
  if (!Buffer.isBuffer(v)) {
    if (typeof v === 'string') {
      v = new Buffer(padToEven(exports.stripHexPrefix(v)), 'hex')
    } else if (typeof v === 'number') {
      v = exports.intToBuffer(v)
    } else if (v === null || v === undefined) {
      v = new Buffer([])
    } else if (v.toArray) {
      // converts a BN to a Buffer
      v = new Buffer(v.toArray())
    } else {
      throw new Error('invalid type')
    }
  }
  return v
}

/**
 * Converts an integer into a hex string
 * @method intToHex
 * @param {Number}
 * @return {String}
 */
exports.intToHex = function (i) {
  assert(i % 1 === 0, 'number is not a interger')
  assert(i >= 0, 'number must be positive')
  var hex = i.toString(16)
  if (hex.length % 2) {
    hex = '0' + hex
  }

  return hex
}

/**
 * Converts an integer to a buffer
 * @method intToBuffer
 * @param {Number}
 * @return {Buffer}
 */
exports.intToBuffer = function (i) {
  var hex = exports.intToHex(i)
  return new Buffer(hex, 'hex')
}

/**
 * Converts a buffer to an Interger
 * @method bufferToInt
 * @par[MaÅam {B[M`Êuffer}
 * @return {Number}
 */
exports.bufferToInt = function (buf) {
  buf = exports.toBuffer(buf)
  if (buf.length === 0) {
    return 0
  }

  return parseInt(buf.toString('hex'), 16)
}

/**
 * interpets a buffer as a signed integer and returns a bignum
 * @method fromSigned
 * @param {Buffer} num
 * @return {BN}
 */
exports.fromSigned = function (num) {
  if (num.length === 32 && num[0] >= 128) {
    return new BN(num).sub(exports.TWO_POW256)
  }

  return new BN(num)
}

/**
 * Converts a bignum to an unsigned interger and returns it as a buffer
 * @method toUnsigned
 * @param {Bignum} num
 * @return {Buffer}
 */
exports.toUnsigned = function (num) {
  if (num.cmpn(0) === -1) {
    return new Buffer(num.add(exports.TWO_POW256).toArray())
  }

  return new Buffer(num.toArray())
}

exports.sha3 = function (a, bytes) {
  a = exports.toBuffer(a)
  if (!bytes) bytes = 256

  var h = new SHA3.SHA3Hash(bytes)
  if (a) {
    h.update(a)
  }
  return new Buffer(h.digest('hex'), 'hex')
}

/**
 * Returns the ethereum address of a given public key
 * @method pubToAddress
 * @param {Buffer}
 * @return {Buffer}
 */
exports.pubToAddress = exports.publicToAddress = function (pubKey) {
  pubKey = exports.toBuffer(pubKey)
  var hash = new SHA3.SHA3Hash(256)
  hash.update(pubKey.slice(-64))
  return new Buffer(hash.digest('hex').slice(-40), 'hex')
}

/**
 * Returns the ethereum public key of a given private key
 * @method privateToPublic
 * @param {Buffer} privateKey
 * @return {Buffer}
 */
var privateToPublic = exports.privateToPublic = function (privateKey) {
  privateKey = exports.toBuffer(privateKey)
  privateKey = new BN(privateKey)
  var key = ec.keyFromPrivate(privateKey).getPublic().toJSON()
  return new Buffer(key[0].toArray().concat(key[1].toArray()))
}

/**
 * Returns the ethereum address of a given private key
 * @method privateToAddress
 * @param {Buffer} privateKey
 * @return {Buffer}
 */
exports.privateToAddress = function (privateKey) {
  return exports.publicToAddress(privateToPublic(privateKey))
}

/**
 * Generates a new address
 * @method generateAddress
 * @param {Buffer} from the address which is creating this new address
 * @param {Buffer} nonce the nonce of the from account
 */
exports.generateAddress = function (from, nonce) {
  from = exports.toBuffer(from)
  nonce = new Buffer(new BN(nonce).toArray())

  if (nonce.toString('hex') === '00') {
    nonce = 0
  }

  var hash = exports.sha3(rlp.encode([new Buffer(from, 'hex'), nonce]))
  return hash.slice(12)
}

// Returns a Boolean on whether or not the a sting starts with 0x
exports.isHexPrefixed = function (str) {
  return str.slice(0, 2) === '0x'
}

// Removes 0x from a given String
exports.stripHexPrefix = function (str) {
  if (typeof str !== 'string') {
    return str
  }
  return exports.isHexPrefixed(str) ? str.slice(2) : str
}

// Adds 0x to a given string if it does not already start with 0x
exports.addHexPrefix = function (str) {
  if (typeof str !== 'string') {
    return str
  }
  return exports.isHexPrefixed(str) ? '0x' + str : str
}

/**
 * defines properties on a `Object`
 * @method defineProperties
 * @para[M`Êm {Object} self the `Object` to define properties on
 * @param {Array} fields an array fields to define
 */
exports.defineProperties = function (self, fields, data) {
  self.raw = []
  self._fields = []

  self.toJSON = function (label) {
    if (label) {
      var obj = {}

      for (var prop in this) {
        if (typeof this[prop] !== 'function' && prop !== 'raw' && prop !== '_fields') {
          obj[prop] = this[prop].toString('hex')
        }
      }
      return obj
    }

    return exports.baToJSON(this.raw)
  }

  fields.forEach(function (field, i) {
    self._fields.push(field.name)
    Object.defineProperty(self, field.name, {
      enumerable: true,
      configurable: true,
      get: function () {
        return this.raw[i]
      },
      set: function (v) {
        v = exports.toBuffer(v)

        if (v.toString('hex') === '00' && !field.allowZero) {
          v = new Buffer([])
        }

        if (field.allowLess && field.length) {
          v = exports.stripZeros(v)
          assert(field.length >= v.length)
        } else if (!(field.empty && v.length === 0) && field.length) {
          assert(field.length === v.length, 'The field ' + field.name + 'must have byte length of ' + field.length)
        }

        this.raw[i] = v
      }
    })

    if (field.default) {
      self[field.name] = field.default
    }
  })

  if (data) {
    if (typeof data === 'string') {
      data = new Buffer(exports.stripHexPrefix(data), 'hex')
    }

    if (Buffer.isBuffer(data)) {
      data = rlp.decode(data)
    }

    if (Array.isArray(data)) {
      if (data.length > self._fields.length) {
        throw (new Error('wrong number of fields in data'))
      }

      // make sure all the items are buffers
      data.forEach(function (d, i) {
        self[self._fields[i]] = typeof d === 'string' ? new Buffer(d, 'hex') : d
      })
    } else if (typeof data === 'object') {
      for (var prop in data) {
        if (self._fields.indexOf(prop) !== -1) {
          self[prop] = data[prop]
        }
      }
    } else {
      throw new Error('invalid data')
    }
  }
}

/**
 * Print a Buffer Array
 * @method printBA
 * @param {Buffer|Array}
 */
exports.printBA = function (ba) {
  if (Buffer.isBuffer(ba)) {
    if (ba.length === 0) {
      console.log('new Buffer(0)')
    } else {
      console.log("new Buffer('" + ba.toString('hex') + "', 'hex')")
    }
  } else if (ba instanceof Array) {
    console.log('[')
    for (var i = 0; i < ba.length; i++) {
      exports.printBA(ba[i])
      console.log(',')
    }
    console.log(']')
  } else {
    console.log(ba)
  }
}

/**
 * converts a buffer array to JSON
 * @method BAToJSON
 * @param {Buffer|Array}
 */
exports.baToJSON = function (ba) {
  if (Buffer.isBuffer(ba)) {
    return ba.toString('hex')
  } else if (ba instanceof Array) {
    var array = []
    for (var i = 0; i < ba.length; i++) {
      array.push(exports.baToJSON(ba[i]))
    }
    return array
  }
}

function padToEven (a) {
  if (a.length % 2) a = '0' + a
  return a
}
