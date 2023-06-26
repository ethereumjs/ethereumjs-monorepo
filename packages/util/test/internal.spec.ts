import { bytesToUtf8, utf8ToBytes } from 'ethereum-cryptography/utils'
import { assert, describe, it } from 'vitest'

import {
  arrayContainsArray,
  getBinarySize,
  getKeys,
  isHexPrefixed,
  isHexString,
  padToEven,
  stripHexPrefix,
  toAscii,
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
})
