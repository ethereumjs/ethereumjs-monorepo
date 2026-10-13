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

describe('[Util/Bytes]: intToBytes and intToHex', () => {
  const errorCases = [
    'test',
    Infinity,
    -Infinity,
    NaN,
    undefined,
    null,
    -1,
    1.05,
    {},
    true,
    false,
    [],
    () => {},
    Number.MAX_SAFE_INTEGER + 1,
  ]
  it('intToBytes should throw on wrong input', () => {
    for (const value of errorCases) {
      // @ts-expect-error -- Testing wrong input
      assert.throws(() => intToBytes(value), undefined, undefined, `throws on ${value}`)
    }
  })

  it('intToHex should throw on wrong input', () => {
    for (const value of errorCases) {
      // @ts-expect-error -- Testing wrong input
      assert.throws(() => intToHex(value), undefined, undefined, `throws on ${value}`)
    }
  })

  it('pass on correct input', () => {
    assert.strictEqual(intToHex(0), '0x0', 'correctly converts 0 to a hex string')
    assert.strictEqual(intToHex(1), '0x1', 'correctly converts 1 to a hex string')
  })

  it('pass on correct input', () => {
    assert.deepEqual(intToBytes(0), hexToBytes('0x00'), 'correctly converts 0 to a Uint8Array')
    assert.deepEqual(intToBytes(1), hexToBytes('0x01'), 'correctly converts 1 to a Uint8Array')
  })
})

describe('[Util/Bytes]: validateNoLeadingZeroes', () => {
  const noLeadingZeroes = {
    a: hexToBytes('0x123'),
  }
  const noLeadingZeroBytes = {
    a: hexToBytes('0x01'),
  }
  const leadingZeroBytes = {
    a: hexToBytes('0x001'),
  }
  const onlyZeroes = {
    a: hexToBytes('0x0'),
  }
  const emptyBuffer = {
    a: hexToBytes('0x'),
  }

  const undefinedValue = {
    a: undefined,
  }

  it('pass on correct input', () => {
    assert.doesNotThrow(
      () => validateNoLeadingZeroes(noLeadingZeroes),
      'does not throw when no leading zeroes',
    )
    assert.doesNotThrow(
      () => validateNoLeadingZeroes(emptyBuffer),
      'does not throw with empty buffer',
    )
    assert.doesNotThrow(
      () => validateNoLeadingZeroes(undefinedValue),
      'does not throw when undefined passed in',
    )
    assert.doesNotThrow(
      () => validateNoLeadingZeroes(noLeadingZeroBytes),
      'does not throw when value has leading zero bytes',
    )
  })

  it('throws on wrong input', () => {
    assert.throws(
      () => validateNoLeadingZeroes(leadingZeroBytes),
      undefined,
      undefined,
      'throws when value has leading zero bytes',
    )
    assert.throws(
      () => validateNoLeadingZeroes(onlyZeroes),
      undefined,
      undefined,
      'throws when value has only zeroes',
    )
  })
})
