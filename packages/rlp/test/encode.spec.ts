import { assert, describe, it } from 'vitest'

import { RLP, utils } from '../src/index.ts'

import { bytesToUtf8 } from './utils.ts'

const { bytesToHex, hexToBytes } = utils

describe('[RLP]: encode (string)', () => {
  it('returns single byte when input is one byte below 0x7f', () => {
    const encodedSelf = RLP.encode('a')
    assert.deepEqual(bytesToUtf8(encodedSelf), 'a')
  })

  it('prefixes string length 0–55 with 0x80+len plus data', () => {
    const encodedDog = RLP.encode('dog')
    assert.deepEqual(4, encodedDog.length)
    assert.deepEqual(encodedDog[0], 131)
    assert.deepEqual(encodedDog[1], 100)
    assert.deepEqual(encodedDog[2], 111)
    assert.deepEqual(encodedDog[3], 103)
  })

  it('prefixes string length >55 with long-string header plus len plus data', () => {
    const encodedLongString = RLP.encode(
      'zoo255zoo255zzzzzzzzzzzzssssssssssssssssssssssssssssssssssssssssssssss', // cspell:disable-line
    )
    assert.deepEqual(72, encodedLongString.length)
    assert.deepEqual(encodedLongString[0], 184)
    assert.deepEqual(encodedLongString[1], 70)
    assert.deepEqual(encodedLongString[2], 122)
    assert.deepEqual(encodedLongString[3], 111)
    assert.deepEqual(encodedLongString[12], 53)
  })
})

describe('[RLP]: encode (list)', () => {
  it('prefixes list length 0–55 with 0xc0+len plus data', () => {
    const encodedArrayOfStrings = RLP.encode(['dog', 'god', 'cat'])
    assert.deepEqual(13, encodedArrayOfStrings.length)
    assert.deepEqual(encodedArrayOfStrings[0], 204)
    assert.deepEqual(encodedArrayOfStrings[1], 131)
    assert.deepEqual(encodedArrayOfStrings[11], 97)
    assert.deepEqual(encodedArrayOfStrings[12], 116)
  })

  it('prefixes list length >55 with long-list header plus len plus data', () => {
    const data = [
      'dog',
      'god',
      'cat',
      'zoo255zoo255zzzzzzzzzzzzssssssssssssssssssssssssssssssssssssssssssssss', // cspell:disable-line
    ]
    const encodedArrayOfStrings = RLP.encode(data)
    const str = bytesToUtf8(encodedArrayOfStrings)
    for (const innerStr of data) {
      assert.include(str, innerStr)
    }
    const expected = hexToBytes(
      'f85483646f6783676f6483636174b8467a6f6f3235357a6f6f3235357a7a7a7a7a7a7a7a7a7a7a7a73737373737373737373737373737373737373737373737373737373737373737373737373737373737373737373', // cspell:disable-line
    )
    assert.deepEqual(encodedArrayOfStrings, expected)
  })
})

describe('[RLP]: encode (BigInt)', () => {
  it('encodes a BigInt value', () => {
    const encoded = RLP.encode(BigInt(3))
    assert.deepEqual(encoded[0], 3)
  })

  it('encodes single-byte BigInt below 0x7f', () => {
    const encodedNumber = RLP.encode(BigInt(15))
    assert.deepEqual(1, encodedNumber.length)
    assert.deepEqual(encodedNumber[0], 15)
  })

  it('encodes multi-byte BigInt with length prefix', () => {
    const encodedNumber = RLP.encode(BigInt(1024))
    assert.deepEqual(3, encodedNumber.length)
    assert.deepEqual(encodedNumber[0], 130)
    assert.deepEqual(encodedNumber[1], 4)
    assert.deepEqual(encodedNumber[2], 0)
  })

  it('encodes BigInt zero as 0x80', () => {
    assert.deepEqual(bytesToHex(RLP.encode(BigInt(0))), '80')
  })
  it('encode() rejects negative BigInt', () => {
    assert.throws(() => RLP.encode(BigInt(-1)))
  })
})

describe('[RLP]: encode (integer)', () => {
  it('encodes single-byte integer below 0x7f', () => {
    const encodedNumber = RLP.encode(15)
    assert.deepEqual(1, encodedNumber.length)
    assert.deepEqual(encodedNumber[0], 15)
  })

  it('encodes multi-byte integer with length prefix', () => {
    const encodedNumber = RLP.encode(1024)
    assert.deepEqual(3, encodedNumber.length)
    assert.deepEqual(encodedNumber[0], 130)
    assert.deepEqual(encodedNumber[1], 4)
    assert.deepEqual(encodedNumber[2], 0)
  })

  it('encode() rejects negative integer', () => {
    assert.throws(() => RLP.encode(-1))
  })

  it('encodes integer zero as 0x80', () => {
    assert.deepEqual(bytesToHex(RLP.encode(0)), '80')
  })

  it('encode() rejects unsupported type', () => {
    assert.throws(() => RLP.encode({} as never))
  })
})

describe('[RLP]: string vs hex encoding', () => {
  it("encode() treats '0x88f' as a UTF-8 string, not hex bytes", () => {
    const withPrefix = RLP.encode('0x88f')
    const without = RLP.encode('88f')
    assert.notDeepEqual(bytesToHex(withPrefix), bytesToHex(without))
    assert.deepEqual(bytesToHex(withPrefix), bytesToHex(RLP.encode('0x88f')))
  })
})
