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

describe('[Util/Bytes]: bytesToHex', () => {
  it('should convert a Uint8Array to a prefixed hex string', () => {
    const bytes = hexToBytes('0x5b9ac8')
    const hex = bytesToHex(bytes)
    assert.strictEqual(hex, '0x5b9ac8')
  })
  it('empty Uint8Array', () => {
    const bytes = new Uint8Array()
    const hex = bytesToHex(bytes)
    assert.strictEqual(hex, '0x')
  })
})

describe('[Util/Bytes]: bytesToInt', () => {
  it('should convert an int to hex', () => {
    const bytes = hexToBytes('0x5b9ac8')
    const i = bytesToInt(bytes)
    assert.strictEqual(i, 6003400)
    assert.strictEqual(bytesToInt(new Uint8Array()), 0)
  })
  it('should convert empty input to 0', () => {
    assert.strictEqual(bytesToInt(new Uint8Array()), 0)
  })
})

describe('[Util/Bytes]: fromSigned', () => {
  it('should convert an unsigned (negative) Uint8Array to a signed number', () => {
    const neg = '-452312848583266388373324160190187140051835877600158453279131187530910662656'
    const bytes = new Uint8Array(32)
    bytes[0] = 255

    assert.strictEqual(fromSigned(bytes).toString(), neg)
  })
  it('should convert an unsigned (positive) Uint8Array to a signed number', () => {
    const neg = '452312848583266388373324160190187140051835877600158453279131187530910662656'
    const bytes = new Uint8Array(32)
    bytes[0] = 1

    assert.strictEqual(fromSigned(bytes).toString(), neg)
  })
})

describe('[Util/Bytes]: toUnsigned', () => {
  it('should convert a signed (negative) number to unsigned', () => {
    const neg = '-452312848583266388373324160190187140051835877600158453279131187530910662656'
    const hex = '0xff00000000000000000000000000000000000000000000000000000000000000'
    const num = BigInt(neg)

    assert.strictEqual(bytesToHex(toUnsigned(num)), hex)
  })

  it('should convert a signed (positive) number to unsigned', () => {
    const neg = '452312848583266388373324160190187140051835877600158453279131187530910662656'
    const hex = '0x0100000000000000000000000000000000000000000000000000000000000000'
    const num = BigInt(neg)

    assert.strictEqual(bytesToHex(toUnsigned(num)), hex)
  })
})

describe('[Util/Bytes]: hex prefix', () => {
  const string = 'd658a4b8247c14868f3c512fa5cbb6e458e4a989'
  it('should add', () => {
    assert.strictEqual(addHexPrefix(string), '0x' + string)
  })
})
