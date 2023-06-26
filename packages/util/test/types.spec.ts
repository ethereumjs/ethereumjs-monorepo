import { bytesToHex } from 'ethereum-cryptography/utils'
import { assert, describe, it } from 'vitest'

import {
  TypeOutput,
  bigIntToBytes,
  bigIntToHex,
  bytesToBigInt,
  intToBytes,
  intToPrefixedHexString,
  toBytes,
  toType,
} from '../src/index.js'

describe('toType', () => {
  it('from null and undefined', () => {
    assert.equal(toType(null, TypeOutput.Number), null)
    assert.equal(toType(null, TypeOutput.BigInt), null)
    assert.equal(toType(null, TypeOutput.Uint8Array), null)
    assert.equal(toType(null, TypeOutput.PrefixedHexString), null)
    assert.equal(toType(undefined, TypeOutput.Number), undefined)
    assert.equal(toType(undefined, TypeOutput.BigInt), undefined)
    assert.equal(toType(undefined, TypeOutput.Uint8Array), undefined)
    assert.equal(toType(undefined, TypeOutput.PrefixedHexString), undefined)
  })
  it('from Number', () => {
    const num = 1000
    it('should convert to Number', () => {
      const result = toType(num, TypeOutput.Number)
      assert.strictEqual(result, num)
    })
    it('should convert to BigInt', () => {
      const result = toType(num, TypeOutput.BigInt)
      assert.equal(result, BigInt(num))
    })
    it('should convert to Uint8Array', () => {
      const result = toType(num, TypeOutput.Uint8Array)
      assert.deepEqual(result, intToBytes(num))
    })
    it('should convert to PrefixedHexString', () => {
      const result = toType(num, TypeOutput.PrefixedHexString)
      assert.strictEqual(result, bytesToHex(bigIntToBytes(BigInt(num))))
    })
    it('should throw an error if greater than MAX_SAFE_INTEGER', () => {
      assert.throws(() => {
        const num = Number.MAX_SAFE_INTEGER + 1
        toType(num, TypeOutput.BigInt)
      }, /^Error: The provided number is greater than MAX_SAFE_INTEGER \(please use an alternative input type\)$/)
    })
  })
  it('from BigInt', () => {
    const num = BigInt(1000)
    it('should convert to Number', () => {
      const result = toType(num, TypeOutput.Number)
      assert.strictEqual(result, Number(num))
    })
    it('should convert to BigInt', () => {
      const result = toType(num, TypeOutput.BigInt)
      assert.equal(result, num)
    })
    it('should convert to Uint8Array', () => {
      const result = toType(num, TypeOutput.Uint8Array)
      assert.deepEqual(result, bigIntToBytes(num))
    })
    it('should convert to PrefixedHexString', () => {
      const result = toType(num, TypeOutput.PrefixedHexString)
      assert.strictEqual(result, bytesToHex(bigIntToBytes(num)))
    })
    it('should throw an error if converting to Number and greater than MAX_SAFE_INTEGER', () => {
      const num = BigInt(Number.MAX_SAFE_INTEGER) + BigInt(1)
      assert.throws(() => {
        toType(num, TypeOutput.Number)
      }, /^Error: The provided number is greater than MAX_SAFE_INTEGER \(please use an alternative output type\)$/)
    })
  })
  it('from Uint8Array', () => {
    const num = intToBytes(1000)
    it('should convert to Number', () => {
      const result = toType(num, TypeOutput.Number)
      assert.deepEqual(intToBytes(result), num)
    })
    it('should convert to BigInt', () => {
      const result = toType(num, TypeOutput.BigInt)
      assert.equal(result, bytesToBigInt(num))
    })
    it('should convert to Uint8Array', () => {
      const result = toType(num, TypeOutput.Uint8Array)
      assert.deepEqual(result, num)
    })
    it('should convert to PrefixedHexString', () => {
      const result = toType(num, TypeOutput.PrefixedHexString)
      assert.strictEqual(result, bytesToHex(num))
    })
  })
  it('from PrefixedHexString', () => {
    const num = intToPrefixedHexString(1000)
    it('should convert to Number', () => {
      const result = toType(num, TypeOutput.Number)
      assert.strictEqual(intToPrefixedHexString(result), num)
    })
    it('should convert to BigInt', () => {
      const result = toType(num, TypeOutput.BigInt)
      assert.strictEqual(bigIntToHex(result), num)
    })
    it('should convert to Uint8Array', () => {
      const result = toType(num, TypeOutput.Uint8Array)
      assert.deepEqual(result, toBytes(num))
    })
    it('should throw an error if is not 0x-prefixed', () => {
      assert.throws(() => {
        toType('1', TypeOutput.Number)
      }, /^Error: A string must be provided with a 0x-prefix, given: 1$/)
    })
  })
})
