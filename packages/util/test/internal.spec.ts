import { assert, describe, it } from 'vitest'

import {
  arrayContainsArray,
  bytesToUtf8,
  fromAscii,
  fromUtf8,
  getBinarySize,
  getKeys,
  isHexPrefixed,
  isHexString,
  padToEven,
  stripHexPrefix,
  toAscii,
  utf8ToBytes,
} from '../src/index.js'

const buf = utf8ToBytes('hello')

describe('internal', () => {
  it('isHexPrefixed', () => {
    assert.equal(isHexPrefixed('0xabc'), true)
    assert.equal(isHexPrefixed('abc'), false)
  })
  it('stripHexPrefix', () => {
    assert.equal(stripHexPrefix('0xabc'), 'abc')
    assert.equal(stripHexPrefix('abc'), 'abc')
  })
  it('padToEven', () => {
    assert.equal(padToEven('123'), '0123')
    assert.equal(padToEven('1234'), '1234')
  })
  it('getBinarySize', () => {
    assert.equal(getBinarySize('hello'), buf.byteLength)
  })
  it('arrayContainsArray', () => {
    assert.equal(arrayContainsArray([1, 2, 3], [1, 2]), true)
    assert.equal(arrayContainsArray([1, 2, 3], [4, 5]), false)
    assert.equal(arrayContainsArray([1, 2, 3], [3, 5], true), true)
    assert.equal(arrayContainsArray([1, 2, 3], [4, 5], true), false)
  })
  it('toAscii', () => {
    assert.equal(toAscii(bytesToUtf8(buf)), '\x00\x00\x00')
  })
  it('getKeys', () => {
    assert.deepEqual(
      getKeys(
        [
          { a: '1', b: '2' },
          { a: '3', b: '4' },
        ],
        'a'
      ),
      ['1', '3']
    )
    assert.deepEqual(
      getKeys(
        [
          { a: '', b: '2' },
          { a: '3', b: '4' },
        ],
        'a',
        true
      ),
      ['', '3']
    )
  })
  it('isHexString', () => {
    assert.equal(isHexString('0x0000000000000000000000000000000000000000'), true)
    assert.equal(isHexString('123'), false)
  })

  describe('isHexPrefixed', () => {
    it('should return true for hex-prefixed string', () => {
      assert.isTrue(isHexPrefixed('0x123'))
    })

    it('should return false for non-hex-prefixed string', () => {
      assert.isFalse(isHexPrefixed('123'))
    })
  })

  describe('padToEven', () => {
    it('should pad odd-length string to even', () => {
      assert.equal(padToEven('123'), '0123')
    })

    it('should not pad even-length string', () => {
      assert.equal(padToEven('1234'), '1234')
    })
  })

  describe('getBinarySize', () => {
    it('should return the correct binary size of a string', () => {
      assert.equal(getBinarySize('Hello, World!'), 13)
    })
  })

  describe('arrayContainsArray', () => {
    it('should return true when the first array contains all elements of the second', () => {
      assert.isTrue(arrayContainsArray([1, 2, 3, 4, 5], [3, 4]))
    })

    it('should return false when the first array does not contain all elements of the second', () => {
      assert.isFalse(arrayContainsArray([1, 2, 3, 4, 5], [6, 7]))
    })
  })

  describe('fromUtf8', () => {
    it('should convert a UTF-8 string to a hex string', () => {
      assert.equal(fromUtf8('Hello, World!'), '0x48656c6c6f2c20576f726c6421')
    })
  })

  describe('fromAscii', () => {
    it('should convert an ASCII string to a hex string', () => {
      assert.equal(fromAscii('Hello, World!'), '0x48656c6c6f2c20576f726c6421')
    })
  })

  describe('getKeys', () => {
    it('should extract keys from an array of objects', () => {
      const input = [
        { a: '1', b: '2' },
        { a: '3', b: '4' },
      ]
      assert.deepEqual(getKeys(input, 'a'), ['1', '3'])
    })
  })
})
