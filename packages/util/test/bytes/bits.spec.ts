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

describe('[Util/Bytes]: matchingBitsLength', () => {
  it('returns 0 when both arrays are empty', () => {
    const bits1: number[] = []
    const bits2: number[] = []
    assert.strictEqual(matchingBitsLength(bits1, bits2), 0)
  })

  it('returns 0 when one of the arrays is empty', () => {
    const bits1: number[] = [1, 0, 1, 1, 0, 0, 1, 1] // Example bits
    const bits2: number[] = []
    assert.strictEqual(matchingBitsLength(bits1, bits2), 0)
  })

  it('returns 0 when arrays have no matching bits in the first byte', () => {
    // 0xff = 11111111, 0x7f = 01111111: first bit mismatches.
    const bits1: number[] = [1, 1, 1, 1, 1, 1, 1, 1] // 0xff
    const bits2: number[] = [0, 1, 1, 1, 1, 1, 1, 1] // 0x7f
    assert.strictEqual(matchingBitsLength(bits1, bits2), 0)
  })

  it('returns correct count for partially matching bits in the first byte', () => {
    // 0xff = 11111111, 0xf0 = 11110000:
    // The first four bits match, then the 5th bit mismatches.
    const bits1: number[] = [1, 1, 1, 1, 1, 1, 1, 1] // 0xff
    const bits2: number[] = [1, 1, 1, 1, 0, 0, 0, 0] // 0xf0
    assert.strictEqual(matchingBitsLength(bits1, bits2), 4)
  })

  it('handles arrays with matching bits across multiple bytes', () => {
    // First byte: 0xaa (10101010) matches exactly.
    // Second byte: 0xff (11111111) vs 0xf0 (11110000) match for the first 4 bits.
    // Total matching bits: 8 (from the first byte) + 4 = 12.
    const bits1: number[] = [
      1,
      0,
      1,
      0,
      1,
      0,
      1,
      0, // 0xaa
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1, // 0xff
    ]
    const bits2: number[] = [
      1,
      0,
      1,
      0,
      1,
      0,
      1,
      0, // 0xaa
      1,
      1,
      1,
      1,
      0,
      0,
      0,
      0, // 0xf0
    ]
    assert.strictEqual(matchingBitsLength(bits1, bits2), 12)
  })

  it('handles arrays with same elements but different lengths', () => {
    // The first three bytes match exactly (3 * 8 = 24 bits), even if the second array is longer.
    const bits1: number[] = [
      0,
      0,
      0,
      1,
      0,
      0,
      1,
      0, // 0x12
      0,
      0,
      1,
      1,
      0,
      1,
      0,
      0, // 0x34
      0,
      1,
      0,
      1,
      0,
      1,
      1,
      0, // 0x56
    ]
    const bits2: number[] = [
      0,
      0,
      0,
      1,
      0,
      0,
      1,
      0, // 0x12
      0,
      0,
      1,
      1,
      0,
      1,
      0,
      0, // 0x34
      0,
      1,
      0,
      1,
      0,
      1,
      1,
      0, // 0x56
      0,
      1,
      1,
      1,
      1,
      0,
      0,
      0, // 0x78 (extra)
    ]
    assert.strictEqual(matchingBitsLength(bits1, bits2), 24)
  })

  it('handles arrays with matching bits at the start then mismatch mid-byte', () => {
    // First two bytes match fully (16 bits).
    // Third byte: 0x56 = 01010110, 0x00 = 00000000.
    // Bit-by-bit in the third byte: the most significant bit (bit 7) is 0 in both, then bit 6: 1 vs 0 (mismatch).
    // Total matching bits: 16 (first two bytes) + 1 (first bit of third byte) = 17.
    const bits1: number[] = [
      0,
      0,
      0,
      1,
      0,
      0,
      1,
      0, // 0x12
      0,
      0,
      1,
      1,
      0,
      1,
      0,
      0, // 0x34
      0,
      1,
      0,
      1,
      0,
      1,
      1,
      0, // 0x56
    ]
    const bits2: number[] = [
      0,
      0,
      0,
      1,
      0,
      0,
      1,
      0, // 0x12
      0,
      0,
      1,
      1,
      0,
      1,
      0,
      0, // 0x34
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0, // 0x00
    ]
    assert.strictEqual(matchingBitsLength(bits1, bits2), 17)
  })

  it('handles arrays with a large number of elements', () => {
    const length = 100000 * 8 // Convert to bits
    const arr1: number[] = []
    const arr2: number[] = []
    for (let i = 0; i < length; i++) {
      arr1.push(i % 2) // Alternating 0,1 pattern
      arr2.push(i % 2) // Same pattern
    }
    // Each bit matches exactly.
    assert.strictEqual(matchingBitsLength(arr1, arr2), length)
  })
})

describe('[Util/Bytes]: bytesToBits', () => {
  it('returns an empty array for an empty Uint8Array', () => {
    const input = new Uint8Array([])
    const expected: number[] = []
    assert.deepEqual(bytesToBits(input), expected)
  })

  it('convert 0x00 to eight 0 bits', () => {
    const input = new Uint8Array([0x00])
    const expected = [0, 0, 0, 0, 0, 0, 0, 0]
    assert.deepEqual(bytesToBits(input), expected)
  })

  it('convert 0xFF to eight 1 bits', () => {
    const input = new Uint8Array([0xff])
    const expected = [1, 1, 1, 1, 1, 1, 1, 1]
    assert.deepEqual(bytesToBits(input), expected)
  })

  it('convert 0x80 (10000000) to bits', () => {
    const input = new Uint8Array([0x80])
    const expected = [1, 0, 0, 0, 0, 0, 0, 0]
    assert.deepEqual(bytesToBits(input), expected)
  })

  it('convert multiple bytes to bits', () => {
    // 0xAA = 10101010 and 0x55 = 01010101
    const input = new Uint8Array([0xaa, 0x55])
    const expected = [
      1,
      0,
      1,
      0,
      1,
      0,
      1,
      0, // for 0xAA
      0,
      1,
      0,
      1,
      0,
      1,
      0,
      1, // for 0x55
    ]
    assert.deepEqual(bytesToBits(input), expected)
  })
})

describe('[Util/Bytes]: bitsToBytes', () => {
  it('returns an empty Uint8Array for an empty bits array', () => {
    const input: number[] = []
    const expected = new Uint8Array([])
    assert.deepEqual(bitsToBytes(input), expected)
  })

  it('convert eight 0 bits to 0x00', () => {
    const input = [0, 0, 0, 0, 0, 0, 0, 0]
    const expected = new Uint8Array([0x00])
    assert.deepEqual(bitsToBytes(input), expected)
  })

  it('convert eight 1 bits to 0xFF', () => {
    const input = [1, 1, 1, 1, 1, 1, 1, 1]
    const expected = new Uint8Array([0xff])
    assert.deepEqual(bitsToBytes(input), expected)
  })

  it('convert bits representing 0x80 to a byte', () => {
    const input = [1, 0, 0, 0, 0, 0, 0, 0]
    const expected = new Uint8Array([0x80])
    assert.deepEqual(bitsToBytes(input), expected)
  })

  it('convert multiple groups of 8 bits to bytes', () => {
    // 0xAA = 10101010 and 0x55 = 01010101
    const input = [
      1,
      0,
      1,
      0,
      1,
      0,
      1,
      0, // for 0xAA
      0,
      1,
      0,
      1,
      0,
      1,
      0,
      1, // for 0x55
    ]
    const expected = new Uint8Array([0xaa, 0x55])
    assert.deepEqual(bitsToBytes(input), expected)
  })

  it('convert a non-multiple-of-8 bit array, padding the last byte', () => {
    // 110 (3 bits) should be stored as 0b11000000 in a single byte (0xC0)
    const input = [1, 1, 0]
    const expected = new Uint8Array([0b11000000]) // Expect padding with zeros
    assert.deepEqual(bitsToBytes(input), expected)
  })
})

describe('[Util/Bytes]: Round-trip conversion from bytes to bits', () => {
  it('converts bytes to bits and back to the original bytes', () => {
    const original = new Uint8Array([0x12, 0x34, 0x56, 0x78])
    const bits = bytesToBits(original)
    const result = bitsToBytes(bits)
    assert.deepEqual(result, original)
  })
})

describe('[Util/Bytes]: equalsBits', () => {
  it('returns true for two empty bit arrays', () => {
    const bits1: number[] = []
    const bits2: number[] = []
    assert.isTrue(equalsBits(bits1, bits2))
  })

  it('returns true for two identical bit arrays', () => {
    const bits1 = [1, 0, 1, 1, 0, 1]
    const bits2 = [1, 0, 1, 1, 0, 1]
    assert.isTrue(equalsBits(bits1, bits2))
  })

  it('returns false for arrays with different lengths', () => {
    const bits1 = [1, 0, 1]
    const bits2 = [1, 0, 1, 0]
    assert.isFalse(equalsBits(bits1, bits2))
  })

  it('returns false if the arrays differ in at least one element', () => {
    const bits1 = [1, 0, 1, 1]
    const bits2 = [1, 1, 1, 1]
    assert.isFalse(equalsBits(bits1, bits2))
  })
})
