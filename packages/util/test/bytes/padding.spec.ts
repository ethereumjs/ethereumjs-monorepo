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

describe('[Util/Bytes]: setLengthLeft', () => {
  it('lefts pad a Uint8Array', () => {
    const bytes = new Uint8Array([9, 9])
    const padded = setLengthLeft(bytes, 3)
    assert.strictEqual(bytesToHex(padded), '0x000909')
  })
  it('throws by default when input exceeds target length', () => {
    const bytes = new Uint8Array([9, 0, 9])
    assert.throws(function () {
      setLengthLeft(bytes, 2)
    }, /Input length 3 exceeds target length 2/)
  })
  it('lefts truncate a Uint8Array when allowTruncate is true', () => {
    const bytes = new Uint8Array([9, 0, 9])
    const padded = setLengthLeft(bytes, 2, { allowTruncate: true })
    assert.strictEqual(bytesToHex(padded), '0x0009')
  })
  it('throws if input is not a Uint8Array', () => {
    assert.throws(function () {
      // @ts-expect-error -- This syntax is not allowed when 'erasableSyntaxOnly' is enabled.
      setLengthLeft((<unknown>[9, 9]) as Uint8Array, 3)
    })
  })
})

describe('[Util/Bytes]: setLengthRight', () => {
  it('rights pad a Uint8Array', () => {
    const bytes = new Uint8Array([9, 9])
    const padded = setLengthRight(bytes, 3)
    assert.strictEqual(bytesToHex(padded), '0x090900')
  })
  it('throws by default when input exceeds target length', () => {
    const bytes = new Uint8Array([9, 0, 9])
    assert.throws(function () {
      setLengthRight(bytes, 2)
    }, /Input length 3 exceeds target length 2/)
  })
  it('rights truncate a Uint8Array when allowTruncate is true', () => {
    const bytes = new Uint8Array([9, 0, 9])
    const padded = setLengthRight(bytes, 2, { allowTruncate: true })
    assert.strictEqual(bytesToHex(padded), '0x0900')
  })
  it('throws if input is not a Uint8Array', () => {
    assert.throws(function () {
      // @ts-expect-error -- This syntax is not allowed when 'erasableSyntaxOnly' is enabled.
      setLengthRight((<unknown>[9, 9]) as Uint8Array, 3)
    })
  })
})
