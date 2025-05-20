import { bytesToHex } from '@ethereumjs/util'

import { EVMError } from '../errors.ts'
import type { EVM } from '../evm.ts'
import { EVMErrorResult, OOGResult } from '../evm.ts'

import { leading16ZeroBytesCheck } from './bls12_381/index.ts'
import { getPrecompileName } from './index.ts'
import { equalityLengthCheck, gasLimitCheck } from './util.ts'

import type { ExecResult } from '../types.ts'
import type { PrecompileInput } from './types.ts'

export async function precompile10(opts: PrecompileInput): Promise<ExecResult> {
  const pName = getPrecompileName('12')
  const bls = (opts._EVM as EVM)['_bls']!

  // note: the gas used is constant; even if the input is incorrect.
  const gasUsed = opts.common.param('bls12381MapG1Gas') ?? BigInt(0)
  if (!gasLimitCheck(opts, gasUsed, pName)) {
    return OOGResult(opts.gasLimit)
  }

  if (!equalityLengthCheck(opts, 64, pName)) {
    return EVMErrorResult(
      new EVMError(EVMError.errorMessages.BLS_12_381_INVALID_INPUT_LENGTH),
      opts.gasLimit,
    )
  }

  // check if some parts of input are zero bytes.
  const zeroByteRanges = [[0, 16]]
  if (!leading16ZeroBytesCheck(opts, zeroByteRanges, pName)) {
    return EVMErrorResult(
      new EVMError(EVMError.errorMessages.BLS_12_381_POINT_NOT_ON_CURVE),
      opts.gasLimit,
    )
  }

  let returnValue
  try {
    returnValue = bls.mapFPtoG1(opts.data)
  } catch (e: any) {
    if (opts._debug !== undefined) {
      opts._debug(`${pName} failed: ${e.message}`)
    }
    return EVMErrorResult(e, opts.gasLimit)
  }

  if (opts._debug !== undefined) {
    opts._debug(`${pName} return value=${bytesToHex(returnValue)}`)
  }

  return {
    executionGasUsed: gasUsed,
    returnValue,
  }
}
