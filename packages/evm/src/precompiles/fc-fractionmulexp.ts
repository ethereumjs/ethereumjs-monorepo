import { bigIntToBuffer, bufferToBigInt, setLengthLeft } from '@ethereumjs/util'

import { OOGResult } from '../evm'
import { ERROR, EvmError } from '../exceptions'

import type { ExecResult } from '../evm'
import type { PrecompileInput } from './types'

const assert = require('assert')

export function precompileFcFractionMulExp(opts: PrecompileInput): ExecResult {
  const gasUsed = BigInt(1050)
  assert(opts.data)

  if (opts.gasLimit < gasUsed) {
    return OOGResult(opts.gasLimit)
  }

  const aNumerator = bufferToBigInt(opts.data.slice(0, 32))
  const aDenominator = bufferToBigInt(opts.data.slice(32, 64))
  const bNumerator = bufferToBigInt(opts.data.slice(64, 96))
  const bDenominator = bufferToBigInt(opts.data.slice(96, 128))
  const exponent = bufferToBigInt(opts.data.slice(128, 160))
  const decimals = bufferToBigInt(opts.data.slice(160, 192))

  if (aDenominator === BigInt(0) || bDenominator === BigInt(0)) {
    return {
      returnValue: Buffer.alloc(0),
      executionGasUsed: opts.gasLimit,
      exceptionError: new EvmError(ERROR.REVERT),
    }
  }

  const numeratorExp = aNumerator * bNumerator ** exponent
  const denominatorExp = aDenominator * bDenominator ** exponent

  const decimalAdjustment = BigInt(10) ** decimals

  const numeratorDecimalAdjusted = (numeratorExp * decimalAdjustment) / denominatorExp
  const denominatorDecimalAdjusted = decimalAdjustment

  const numeratorBuf = bigIntToBuffer(numeratorDecimalAdjusted)
  const denominatorBuf = bigIntToBuffer(denominatorDecimalAdjusted)

  const numeratorPadded = setLengthLeft(numeratorBuf, 32)
  const denominatorPadded = setLengthLeft(denominatorBuf, 32)

  const returnValue = Buffer.concat([numeratorPadded, denominatorPadded])

  return { returnValue, executionGasUsed: gasUsed }
}
