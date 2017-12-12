const Buffer = require('safe-buffer').Buffer
const assert = require('assert')
const utils = require('ethereumjs-util')
const byteSize = 256

/**
 * Represents a Bloom
 * @constructor
 * @param {Buffer} bitvector
 */
var Bloom = module.exports = function (bitvector) {
  if (!bitvector) {
    this.bitvector = utils.zeros(byteSize)
  } else {
    assert(bitvector.length === byteSize, 'bitvectors must be 2048 bits long')
    this.bitvector = bitvector
  }
}

/**
 * adds an element to a bit vector of a 64 byte bloom filter
 * @method add
 * @param {Buffer} element
 */
Bloom.prototype.add = function (e) {
  e = utils.sha3(e)
  var mask = 2047 // binary 11111111111

  for (var i = 0; i < 3; i++) {
    var first2bytes = e.readUInt16BE(i * 2)
    var loc = mask & first2bytes
    var byteLoc = loc >> 3
    var bitLoc = 1 << loc % 8
    this.bitvector[byteSize - byteLoc - 1] |= bitLoc
  }
}

/**
 * checks if an element is in the blooom
 * @method check
 * @param {Buffer} element
 */
Bloom.prototype.check = function (e) {
  e = utils.sha3(e)
  var mask = 511 // binary 111111111
  var match = true

  for (var i = 0; i < 3 && match; i++) {
    var first2bytes = e.readUInt16BE(i * 2)
    var loc = mask & first2bytes
    var byteLoc = loc >> 3
    var bitLoc = 1 << loc % 8
    match = (this.bitvector[byteSize - byteLoc - 1] & bitLoc)
  }

  return Boolean(match)
}

/**
 * checks if multple topics are in a bloom
 * @method check
 * @param {Buffer} element
 */
Bloom.prototype.multiCheck = function (topics) {
  var self = this
  return topics.every(function (t) {
    if (!Buffer.isBuffer(t)) {
      t = Buffer.from(t, 'hex')
    }
    return self.check(t)
  })
}

/**
 * bitwise or blooms together
 * @method or
 * @param {Bloom} bloom
 */
Bloom.prototype.or = function (bloom) {
  if (bloom) {
    for (var i = 0; i <= byteSize; i++) {
      this.bitvector[i] = this.bitvector[i] | bloom.bitvector[i]
    }
  }
}
