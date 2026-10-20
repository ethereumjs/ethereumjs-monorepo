import { assert, describe, it } from 'vitest'

import { RLP, utils } from '../src/index.ts'

const { bytesToHex, concatBytes, utf8ToBytes } = utils

describe('[RLP]: stream decode', () => {
  it('decode(stream=true) walks concatenated RLP items', () => {
    const encodedNumber = RLP.encode(1)
    const str = 'This is a string'
    const longString =
      'This is a long string, so we can trigger the prefix when the array length is larger than 55.'
    const encodedString = RLP.encode(str)
    const encodedLongString = RLP.encode(longString)
    const encodedList = RLP.encode([1, 2, 3])
    const bufferStream = concatBytes(encodedNumber, encodedString, encodedLongString, encodedList)
    let decoded = RLP.decode(bufferStream, true)
    assert.deepEqual(bytesToHex(decoded.data as Uint8Array), '01')
    decoded = RLP.decode(decoded.remainder, true)
    assert.deepEqual(decoded.data, utf8ToBytes(str))
    decoded = RLP.decode(decoded.remainder, true)
    assert.deepEqual(decoded.data, utf8ToBytes(longString))
    decoded = RLP.decode(decoded.remainder, true)
    assert.strictEqual(decoded.data.length, 3)
    assert.deepEqual(decoded.data[0], Uint8Array.from([1]))
    assert.deepEqual(decoded.data[1], Uint8Array.from([2]))
    assert.deepEqual(decoded.data[2], Uint8Array.from([3]))
    assert.strictEqual(decoded.remainder.length, 0)
  })
})

describe('[RLP]: recursive typings', () => {
  it('encode() accepts deeply nested list input at compile time', () => {
    type IsType<T, U> = Exclude<T, U> extends never
      ? Exclude<U, T> extends never
        ? true
        : false
      : false
    const assertType = <T, U>(isTrue: IsType<T, U>) => {
      return isTrue
    }
    const a = RLP.encode([[[[[0]]]]])
    assert.isTrue(assertType<typeof a, Uint8Array>(true))
  })
})
