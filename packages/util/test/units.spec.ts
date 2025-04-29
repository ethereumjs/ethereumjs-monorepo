import { assert, describe, it } from 'vitest'

import { Units, formatBigDecimal } from '../src/index.ts'

describe('formatBigDecimal', function () {
  const testCases: [bigint, bigint, bigint, string][] = [
    [BigInt('103797739275696858'), BigInt('1000000000000000000'), BigInt('100000'), '0.10379'],
    [BigInt('103797739275696858'), BigInt('1000000000000000000'), BigInt('1000'), '0.103'],
    [BigInt('10379773927569685'), BigInt('1000000000000000000'), BigInt('1000'), '0.010'],
    [BigInt('1037977392756968'), BigInt('1000000000000000000'), BigInt('1000'), '0.001'],
    [BigInt('1037977392756968'), BigInt('1000000000000000000'), BigInt('100000'), '0.00103'],
    [BigInt('58200000000000000'), BigInt('1000000000000000000'), BigInt('100000'), '0.05820'],
    [BigInt('111103797739275696858'), BigInt('1000000000000000000'), BigInt('100000'), '111.10379'],
    [BigInt('111103797739275696858'), BigInt('1000000000000000000'), BigInt('1000'), '111.103'],
    [BigInt('1037977392756'), BigInt('1000000000000000000'), BigInt('100000'), '0.00000'],
  ]
  for (const [numerator, denominator, decimalFactor, expectedString] of testCases) {
    it(`format ${numerator} / ${denominator} correctly to ${expectedString}`, () => {
      assert.strictEqual(formatBigDecimal(numerator, denominator, decimalFactor), expectedString)
    })
  }
})

describe('Units', () => {
  describe('ether()', () => {
    it('should convert 1 ether to wei', () => {
      const result = Units.ether(1)
      assert.strictEqual(result, BigInt(10 ** 18))
    })

    it('should convert 0 ether to wei', () => {
      const result = Units.ether(0)
      assert.strictEqual(result, BigInt(0))
    })

    it('should convert a large number of ether to wei', () => {
      const result = Units.ether(1000000)
      assert.strictEqual(result, BigInt(1000000) * BigInt(10 ** 18))
    })

    it('should throw error when a non-integer number is used', () => {
      assert.throws(() => {
        Units.ether(0.5)
      }, 'Input must be an integer number')
    })

    it('should throw error when a negative number is used', () => {
      assert.throws(() => {
        Units.ether(-1)
      }, 'Input must be a positive number')
    })

    it('should convert a bigint amount of ether to wei', () => {
      const result = Units.ether(BigInt(2))
      assert.strictEqual(result, BigInt(2) * BigInt(10 ** 18))
    })
  })

  describe('gwei()', () => {
    it('should convert 1 gwei to wei', () => {
      const result = Units.gwei(1)
      assert.strictEqual(result, BigInt(10 ** 9))
    })

    it('should convert 0 gwei to wei', () => {
      const result = Units.gwei(0)
      assert.strictEqual(result, BigInt(0))
    })

    it('should convert a large number of gwei to wei', () => {
      const result = Units.gwei(1000000)
      assert.strictEqual(result, BigInt(1000000) * BigInt(10 ** 9))
    })

    it('should throw error when a non-integer number is used', () => {
      assert.throws(function () {
        Units.gwei(0.5)
      }, 'Input must be an integer number')
    })

    it('should throw error when a negative number is used', () => {
      assert.throws(() => {
        Units.gwei(-1)
      }, 'Input must be a positive number')
    })

    it('should convert a bigint amount of gwei to wei', () => {
      const result = Units.gwei(BigInt(2))
      assert.strictEqual(result, BigInt(2) * BigInt(10 ** 9))
    })
  })
})
