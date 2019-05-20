import * as assert from 'assert'
import { zeros, keccak256 } from 'ethereumjs-util'

const BYTE_SIZE = 256

export default class Bloom {
  bitvector: Buffer

  /**
   * Represents a Bloom
   * @constructor
   * @param {Buffer} bitvector
   */
  constructor (bitvector?: Buffer) {
    if (!bitvector) {
      this.bitvector = zeros(BYTE_SIZE)
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
  add (e: Buffer) {
    assert(Buffer.isBuffer(e), 'Element should be buffer')
    e = keccak256(e)
    const mask = 2047 // binary 11111111111

    for (let i = 0; i < 3; i++) {
      const first2bytes = e.readUInt16BE(i * 2)
      const loc = mask & first2bytes
      const byteLoc = loc >> 3
      const bitLoc = 1 << loc % 8
      this.bitvector[BYTE_SIZE - byteLoc - 1] |= bitLoc
    }
  }

  /**
   * checks if an element is in the bloom
   * @method check
   * @param {Buffer} e the element to check
   * @returns {boolean} Returns {@code true} if the element is in the bloom
   */
  check (e: Buffer): boolean {
    assert(Buffer.isBuffer(e), 'Element should be Buffer')
    e = keccak256(e)
    const mask = 2047 // binary 11111111111
    let match = true

    for (let i = 0; i < 3 && match; i++) {
      const first2bytes = e.readUInt16BE(i * 2)
      const loc = mask & first2bytes
      const byteLoc = loc >> 3
      const bitLoc = 1 << loc % 8
      match = (this.bitvector[BYTE_SIZE - byteLoc - 1] & bitLoc) !== 0
    }

    return Boolean(match)
  }

  /**
   * checks if multiple topics are in a bloom
   * @method multiCheck
   * @param {Buffer[]} topics
   * @returns {boolean} Returns {@code true} if every topic is in the bloom
   */
  multiCheck (topics: Buffer[]): boolean {
    return topics.every((t: Buffer) => this.check(t))
  }

  /**
   * bitwise or blooms together
   * @method or
   * @param {Bloom} bloom
   */
  or (bloom: Bloom) {
    if (bloom) {
      for (let i = 0; i <= BYTE_SIZE; i++) {
        this.bitvector[i] = this.bitvector[i] | bloom.bitvector[i]
      }
    }
  }
}
