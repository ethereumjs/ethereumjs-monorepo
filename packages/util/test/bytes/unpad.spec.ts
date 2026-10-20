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

describe('[Util/Bytes]: unpadBytes', () => {
  it('removes padding from a Uint8Array', () => {
    const bytes = hexToBytes('0x0000000006600')
    const r = unpadBytes(bytes)
    assert.deepEqual(r, hexToBytes('0x6600'))
  })
  it('throws if input is not a Uint8Array', () => {
    assert.throws(function () {
      // @ts-expect-error -- This syntax is not allowed when 'erasableSyntaxOnly' is enabled.
      unpadBytes((<unknown>'0000000006600') as Uint8Array)
    })
  })
  it('unpad 0x0', () => {
    const bytes = hexToBytes('0x0')
    assert.deepEqual(bytes, new Uint8Array([0]), 'hexToBytes("0x0") should return [0]')

    const unpadded = unpadBytes(bytes)
    assert.deepEqual(unpadded, new Uint8Array(0), 'unpadBytes should return empty array for 0x0')
    assert.strictEqual(unpadded.length, 0, 'unpadded result should have length 0')

    const result = unpadBytes(hexToBytes('0x0'))
    assert.deepEqual(
      result,
      new Uint8Array(0),
      'unpadBytes(hexToBytes("0x0")) should return empty array',
    )
    assert.strictEqual(bytesToHex(result), '0x', 'empty bytes should convert to "0x" hex string')
  })
})

describe('[Util/Bytes]: unpadArray', () => {
  it('removes padding from an Array', () => {
    const arr = [0, 0, 0, 1]
    const r = unpadArray(arr)
    assert.deepEqual(r, [1])
  })
  it('throws if input is not an Array', () => {
    assert.throws(function () {
      unpadArray(toBytes([0, 0, 0, 1]) as unknown as number[])
    })
  })
})

describe('[Util/Bytes]: unpadHex', () => {
  it('removes padding from a hex prefixed string', () => {
    const str = '0x0000000006600'
    const r = unpadHex(str)
    assert.strictEqual(r, '0x6600')
  })
  it('throws if input is not hex-prefixed', () => {
    assert.throws(function () {
      unpadHex('0000000006600' as any)
    })
  })
})
