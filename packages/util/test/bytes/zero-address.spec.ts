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

describe('[Util/Bytes]: zero address', () => {
  it('zeroAddress() returns 20 zero bytes', () => {
    assert.strictEqual(zeroAddress(), '0x0000000000000000000000000000000000000000')
  })
})

describe('[Util/Bytes]: is zero address', () => {
  it('isZeroAddress() returns true for canonical zero', () => {
    assert.strictEqual(isZeroAddress('0x0000000000000000000000000000000000000000'), true)
  })

  it('isZeroAddress() returns false for non-zero address', () => {
    const nonZeroAddress = '0x2f015c60e0be116b1f0cd534704db9c92118fb6a'
    assert.strictEqual(isZeroAddress(nonZeroAddress), false)
  })

  it('isZeroAddress() returns false without 0x prefix', () => {
    assert.strictEqual(isZeroAddress('0000000000000000000000000000000000000000'), false)
  })
})
