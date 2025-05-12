import { assert, describe, it } from 'vitest'

import {
  TypeOutput,
  bigIntToBytes,
  bigIntToHex,
  bytesToBigInt,
  bytesToHex,
  hexToBytes,
  intToBytes,
  intToHex,
  toType,
} from '../src/index.ts'

describe('toType', () => {
  it('from null and undefined', () => {
    assert.strictEqual(toType(null, TypeOutput.Number), null)
    assert.strictEqual(toType(null, TypeOutput.BigInt), null)
    assert.strictEqual(toType(null, TypeOutput.Uint8Array), null)
    assert.strictEqual(toType(null, TypeOutput.PrefixedHexString), null)
    assert.strictEqual(toType(undefined, TypeOutput.Number), undefined)
    assert.strictEqual(toType(undefined, TypeOutput.BigInt), undefined)
    assert.strictEqual(toType(undefined, TypeOutput.Uint8Array), undefined)
    assert.strictEqual(toType(undefined, TypeOutput.PrefixedHexString), undefined)
  })
  it('from Number', () => {
    const num = 1000
    let result
    result = toType(num, TypeOutput.Number)
    assert.strictEqual(result, num)

    result = toType(num, TypeOutput.BigInt)
    assert.strictEqual(result, BigInt(num))

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
    assert.strictEqual(result, num)

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
    assert.strictEqual(result, bytesToBigInt(num))

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
    assert.deepEqual(result, hexToBytes(num))

    assert.throws(() => {
      //@ts-expect-error -- Testing invalid input
      toType('1', TypeOutput.Number)
    }, /^A string must be provided with a 0x-prefix, given: 1$/)
  })
})
