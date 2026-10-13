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

describe('[Util/Bytes]: bytesToBigInt', () => {
  it('pass on correct input', () => {
    const buf = hexToBytes('0x123')
    assert.strictEqual(BigInt(0x123), bytesToBigInt(buf))
  })
  it('returns 0n for empty Uint8Array', () => {
    assert.strictEqual(bytesToBigInt(new Uint8Array(0)), 0n)
  })
  it('throws if input is not a Uint8Array', () => {
    assert.throws(function () {
      // @ts-expect-error -- Testing invalid input
      bytesToBigInt([1, 2, 3])
    }, /This method only supports Uint8Array/)
  })
  it('does not mutate input when littleEndian is true', () => {
    const bytes = new Uint8Array([0x01, 0x02, 0x03])
    const original = new Uint8Array([0x01, 0x02, 0x03])
    bytesToBigInt(bytes, true)
    assert.deepEqual(bytes, original)
  })
  it('convert littleEndian bytes', () => {
    // 0x030201 in big-endian = 0x010203 in little-endian
    const bytes = new Uint8Array([0x01, 0x02, 0x03])
    assert.strictEqual(bytesToBigInt(bytes, true), BigInt(0x030201))
  })
})

describe('[Util/Bytes]: bigIntToBytes', () => {
  it('pass on correct input', () => {
    const num = BigInt(0x123)
    assert.deepEqual(hexToBytes('0x123'), bigIntToBytes(num))
  })
})

describe('[Util/Bytes]: bigIntToUnpaddedBytes', () => {
  it('equals unpadded buffer value', () => {
    assert.deepEqual(bigIntToUnpaddedBytes(BigInt(0)), Uint8Array.from([]))
    assert.deepEqual(bigIntToUnpaddedBytes(BigInt(100)), hexToBytes('0x64'))
  })
})

describe('[Util/Bytes]: bigIntToAddressBytes', () => {
  const testCases = [
    [
      '0x0aae40965e6800cd9b1f4b05ff21581047e3f91e',
      BigInt('0x0aae40965e6800cd9b1f4b05ff21581047e3f91e'),
      true,
    ],
    [
      '0xe473f7e92ba2490e9fcbbe8bb9c3be3adbb74efc',
      BigInt('0xe473f7e92ba2490e9fcbbe8bb9c3be3adbb74efc'),
      true,
    ],
    [
      '0xae40965e6800cd9b1f4b05ff21581047e3f91e00',
      BigInt('0x0aae40965e6800cd9b1f4b05ff21581047e3f91e00'),
      false,
    ],
  ]

  for (const [addressHex, addressBigInt, isSafe] of testCases) {
    it('convert', () => {
      const addressHexFromBigInt = bytesToHex(bigIntToAddressBytes(addressBigInt as bigint, false))
      assert.strictEqual(
        addressHex,
        addressHexFromBigInt,
        `should correctly convert ${addressBigInt}`,
      )
      if (isSafe === false) {
        assert.throw(() => bigIntToAddressBytes(addressBigInt as bigint))
      }
    })
  }
})

describe('[Util/Bytes]: intToUnpaddedBytes', () => {
  it('equals unpadded buffer value', () => {
    assert.deepEqual(intToUnpaddedBytes(0), Uint8Array.from([]))
    assert.deepEqual(intToUnpaddedBytes(100), hexToBytes('0x64'))
  })
})

describe('[Util/Bytes]: bigIntToHex', () => {
  it('pass on correct input', () => {
    assert.strictEqual(bigIntToHex(BigInt(1)), '0x1')
  })
})
