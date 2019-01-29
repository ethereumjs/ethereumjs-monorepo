const assert = require('assert')
const utils = require('ethereumjs-util')

const BYTE_SIZE = 256

module.exports = class Bloom {
  /**
   * Represents a Bloom
   * @constructor
   * @param {Buffer} bitvector
   */
  constructor (bitvector) {
    if (!bitvector) {
      this.bitvector = utils.zeros(BYTE_SIZE)
    } else {
      assert(bitvector.length === BYTE_SIZE, 'bitvectors must be 2048 bits long')
      this.bitvector = bitvector
    }
  }

  /**
   * adds an element to a bit vector of a 64 byte bloom filter
   * @method add
   * @param {Buffer} e the element to add
   */
  add (e) {
    e = utils.keccak256(e)
    var mask = 2047 // binary 11111111111

    for (var i = 0; i < 3; i++) {
      var first2bytes = e.readUInt16BE(i * 2)
      var loc = mask & first2bytes
      var byteLoc = loc >> 3
      var bitLoc = 1 << loc % 8
      this.bitvector[BYTE_SIZE - byteLoc - 1] |= bitLoc
    }
  }

  /**
   * checks if an element is in the bloom
   * @method check
   * @param {Buffer} e the element to check
   * @returns {boolean} Returns {@code true} if the element is in the bloom
   */
  check (e) {
    e = utils.keccak256(e)
    var mask = 2047 // binary 11111111111
    var match = true

    for (var i = 0; i < 3 && match; i++) {
      var first2bytes = e.readUInt16BE(i * 2)
      var loc = mask & first2bytes
      var byteLoc = loc >> 3
      var bitLoc = 1 << loc % 8
      match = (this.bitvector[BYTE_SIZE - byteLoc - 1] & bitLoc)
    }

    return Boolean(match)
  }

  /**
   * checks if multiple topics are in a bloom
   * @method multiCheck
   * @param {Buffer} topics
   * @returns {boolean} Returns {@code true} if every topic is in the bloom
   */
  multiCheck (topics) {
    var self = this
    return topics.every(function (t) {
      return self.check(t)
    })
  }

  /**
   * bitwise or blooms together
   * @method or
   * @param {Bloom} bloom
   */
  or (bloom) {
    if (bloom) {
      for (var i = 0; i <= BYTE_SIZE; i++) {
        this.bitvector[i] = this.bitvector[i] | bloom.bitvector[i]
      }
    }
  }
}
