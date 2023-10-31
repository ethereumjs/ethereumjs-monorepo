import { assert, describe, it } from 'vitest'

import { formatBigDecimal } from '../src/index.js'

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
      assert.equal(formatBigDecimal(numerator, denominator, decimalFactor), expectedString)
    })
  }
})
