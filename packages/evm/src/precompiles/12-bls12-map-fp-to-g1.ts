import { bytesToHex } from '@ethereumjs/util'

import { EvmErrorResult, OOGResult } from '../evm.js'
import { ERROR, EvmError } from '../exceptions.js'

import { gasCheck, zeroByteCheck } from './bls12_381/index.js'
import { BLS12_381_FromG1Point, BLS12_381_ToFpPoint } from './bls12_381/mcl.js'

import type { ExecResult } from '../types.js'
import type { PrecompileInput } from './types.js'

export async function precompile12(opts: PrecompileInput): Promise<ExecResult> {
  const mcl = (<any>opts._EVM)._mcl!

  const inputData = opts.data

  // note: the gas used is constant; even if the input is incorrect.
  const gasUsed = opts.common.paramByEIP('gasPrices', 'Bls12381MapG1Gas', 2537) ?? BigInt(0)
  if (!gasCheck(opts, gasUsed, 'BLS12MAPFPTOG1 (0x12)')) {
    return OOGResult(opts.gasLimit)
  }

  if (inputData.length !== 64) {
    if (opts._debug !== undefined) {
      opts._debug(`BLS12MAPFPTOG1 (0x12) failed: Invalid input length length=${inputData.length}`)
    }
    return EvmErrorResult(new EvmError(ERROR.BLS_12_381_INVALID_INPUT_LENGTH), opts.gasLimit)
  }

  // check if some parts of input are zero bytes.
  const zeroByteRanges = [[0, 16]]
  if (!zeroByteCheck(opts, zeroByteRanges, 'BLS12MAPFPTOG1 (0x12)')) {
    return EvmErrorResult(new EvmError(ERROR.BLS_12_381_POINT_NOT_ON_CURVE), opts.gasLimit)
  }

  // convert input to mcl Fp1 point

  let Fp1Point
  try {
    Fp1Point = BLS12_381_ToFpPoint(opts.data.subarray(0, 64), mcl)
  } catch (e: any) {
    if (opts._debug !== undefined) {
      opts._debug(`BLS12MAPFPTOG1 (0x12) failed: ${e.message}`)
    }
    return EvmErrorResult(e, opts.gasLimit)
  }

  // map it to G1
  const result = Fp1Point.mapToG1()

  const returnValue = BLS12_381_FromG1Point(result)

  if (opts._debug !== undefined) {
    opts._debug(`BLS12MAPFPTOG1 (0x12) return value=${bytesToHex(returnValue)}`)
  }

  return {
    executionGasUsed: gasUsed,
    returnValue,
  }
}
