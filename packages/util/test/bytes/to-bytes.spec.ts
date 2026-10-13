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

describe('[Util/Bytes]: toBytes', () => {
  it('toBytes() coerces supported input types', () => {
    // Uint8Array
    assert.isTrue(equalsBytes(toBytes(new Uint8Array(0)), new Uint8Array()))
    // Array
    assert.isTrue(equalsBytes(toBytes([]), new Uint8Array()))
    // String
    assert.isTrue(equalsBytes(toBytes('0x11'), Uint8Array.from([17])))
    assert.strictEqual(bytesToHex(toBytes('0x1234')), '0x1234')
    assert.isTrue(equalsBytes(toBytes('0x'), Uint8Array.from([])))
    // Number
    assert.isTrue(equalsBytes(toBytes(1), Uint8Array.from([1])))
    // null
    assert.isTrue(equalsBytes(toBytes(null), new Uint8Array(0)))
    // undefined
    assert.deepEqual(toBytes(undefined), new Uint8Array(0))
    // BigInt
    assert.deepEqual(toBytes(BigInt(1)), Uint8Array.from([1]))
    // 'toArray'
    assert.deepEqual(
      toBytes({
        toBytes(): any {
          return Uint8Array.from([1])
        },
      }),
      Uint8Array.from([1]),
    )
  })
  it('toBytes() throws on unsupported inputs', () => {
    assert.throws(function () {
      toBytes({ test: 1 } as any)
    })
    assert.throws(function () {
      toBytes(BigInt(-10))
    })
  })

  it('toBytes() rejects non-prefixed hex strings', () => {
    // @ts-expect-error -- Testing wrong input
    assert.throws(() => toBytes('11'), '11')
    // @ts-expect-error -- Testing wrong input
    assert.throws(() => toBytes(''))
    assert.throws(() => toBytes('0xR'), '0xR')
  })

  it('toBytes() uses TransformableToBytes.toBytes() (i.e. provides a toBytes method)', () => {
    const str = '0x2f015c60e0be116b1f0cd534704db9c92118fb6a'
    const address = createAddressFromString(str)
    const addressBytes = toBytes(address)
    assert.deepEqual(addressBytes, address.toBytes())
  })
})
