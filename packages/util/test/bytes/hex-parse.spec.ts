import { assert, describe, it } from 'vitest'

import {
  addHexPrefix,
  bigIntToAddressBytes,
  bigIntToBytes,
  bigIntToHex,
  bigIntToUnpaddedBytes,
  bitsToBytes,
  bytesToBigInt,
  bytesToBits,
  bytesToHex,
  bytesToInt,
  createAddressFromString,
  equalsBits,
  equalsBytes,
  fromSigned,
  hexToBytes,
  intToBytes,
  intToHex,
  intToUnpaddedBytes,
  isZeroAddress,
  matchingBitsLength,
  matchingBytesLength,
  setLengthLeft,
  setLengthRight,
  short,
  toBytes,
  toUnsigned,
  unpadArray,
  unpadBytes,
  unpadHex,
  unprefixedHexToBytes,
  validateNoLeadingZeroes,
  zeroAddress,
} from '../../src/index.ts'

describe('[Util/Bytes]: hexToBytes', () => {
  it('should throw on non-prefixed strings', () => {
    assert.throws(() => {
      hexToBytes('aabbcc112233' as any)
    })
  })

  it('should throw on invalid hex', () => {
    assert.throws(() => {
      hexToBytes('0xInvalidHexString')
    })
    assert.throws(() => {
      hexToBytes('0xfz')
    })
  })

  it('should convert prefixed hex-strings', () => {
    const converted = hexToBytes('0x1')
    assert.deepEqual(converted, new Uint8Array([1]))
  })
})

describe('[Util/Bytes]: unprefixedHexToBytes', () => {
  it('should throw on prefixed strings', () => {
    assert.throws(() => {
      unprefixedHexToBytes('0xaabbcc112233')
    })
  })
  it('should convert unprefixed hex-strings', () => {
    const converted = unprefixedHexToBytes('1')
    assert.deepEqual(converted, new Uint8Array([1]))
  })
  it('should convert unprefixed hex-strings', () => {
    const converted = unprefixedHexToBytes('11')
    assert.deepEqual(converted, new Uint8Array([17]))
  })
})
