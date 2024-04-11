import { assert, describe, it } from 'vitest'

import {
  TypeOutput,
  bigIntToBytes,
  bigIntToHex,
  bytesToBigInt,
  bytesToHex,
  intToBytes,
  intToHex,
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
    let result
    result = toType(num, TypeOutput.Number)
    assert.strictEqual(result, num)

    result = toType(num, TypeOutput.BigInt)
    assert.equal(result, BigInt(num))

    result = toType(num, TypeOutput.Uint8Array)
    assert.deepEqual(result, intToBytes(num))

    result = toType(num, TypeOutput.PrefixedHexString)
    assert.strictEqual(result, bytesToHex(bigIntToBytes(BigInt(num))))

    assert.throws(() => {
      const num = Number.MAX_SAFE_INTEGER + 1
      toType(num, TypeOutput.BigInt)
    }, /^The provided number is greater than MAX_SAFE_INTEGER \(please use an alternative input type\)$/)
  })

  it('from BigInt', () => {
    const num = BigInt(1000)
    let result
    result = toType(num, TypeOutput.Number)
    assert.strictEqual(result, Number(num))

    result = toType(num, TypeOutput.BigInt)
    assert.equal(result, num)

    result = toType(num, TypeOutput.Uint8Array)
    assert.deepEqual(result, bigIntToBytes(num))

    result = toType(num, TypeOutput.PrefixedHexString)
    assert.strictEqual(result, bytesToHex(bigIntToBytes(num)))

    const num2 = BigInt(Number.MAX_SAFE_INTEGER) + BigInt(1)
    assert.throws(() => {
      toType(num2, TypeOutput.Number)
    }, /^The provided number is greater than MAX_SAFE_INTEGER \(please use an alternative output type\)$/)
  })
  it('from Uint8Array', () => {
    const num = intToBytes(1000)
    let result

    result = toType(num, TypeOutput.Number)
    assert.deepEqual(intToBytes(result), num)

    result = toType(num, TypeOutput.BigInt)
    assert.equal(result, bytesToBigInt(num))

    result = toType(num, TypeOutput.Uint8Array)
    assert.deepEqual(result, num)

    result = toType(num, TypeOutput.PrefixedHexString)
    assert.strictEqual(result, bytesToHex(num))
  })
  it('from PrefixedHexString', () => {
    const num = intToHex(1000)
    let result

    result = toType(num, TypeOutput.Number)
    assert.strictEqual(intToHex(result), num)

    result = toType(num, TypeOutput.BigInt)
    assert.strictEqual(bigIntToHex(result), num)

    result = toType(num, TypeOutput.Uint8Array)
    assert.deepEqual(result, toBytes(num))

    assert.throws(() => {
      toType('1', TypeOutput.Number)
    }, /^A string must be provided with a 0x-prefix, given: 1$/)
  })
})
