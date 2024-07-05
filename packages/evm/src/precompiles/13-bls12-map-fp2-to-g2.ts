import { bytesToHex } from '@ethereumjs/util'

import { EvmErrorResult, OOGResult } from '../evm.js'
import { ERROR, EvmError } from '../exceptions.js'

import { equalityLengthCheck, gasCheck, leading16ZeroBytesCheck } from './bls12_381/index.js'

import type { EVMBLSInterface, ExecResult } from '../types.js'
import type { PrecompileInput } from './types.js'

export async function precompile13(opts: PrecompileInput): Promise<ExecResult> {
  const bls = (<any>opts._EVM)._bls! as EVMBLSInterface

  // note: the gas used is constant; even if the input is incorrect.
  const gasUsed = opts.common.paramByEIP('gasPrices', 'Bls12381MapG2Gas', 2537) ?? BigInt(0)
  if (!gasCheck(opts, gasUsed, 'BLS12MAPFP2TOG2 (0x13)')) {
    return OOGResult(opts.gasLimit)
  }

  if (!equalityLengthCheck(opts, 128, 'BLS12MAPFP2TOG2 (0x13)')) {
    return EvmErrorResult(new EvmError(ERROR.BLS_12_381_INVALID_INPUT_LENGTH), opts.gasLimit)
  }

  // check if some parts of input are zero bytes.
  const zeroByteRanges = [
    [0, 16],
    [64, 80],
  ]
  if (!leading16ZeroBytesCheck(opts, zeroByteRanges, 'BLS12MAPFP2TOG2 (0x13)')) {
    return EvmErrorResult(new EvmError(ERROR.BLS_12_381_POINT_NOT_ON_CURVE), opts.gasLimit)
  }

  let returnValue
  try {
    returnValue = bls.mapFP2toG2(opts.data)
  } catch (e: any) {
    if (opts._debug !== undefined) {
      opts._debug(`BLS12MAPFP2TOG2 (0x13) failed: ${e.message}`)
    }
    return EvmErrorResult(e, opts.gasLimit)
  }

  if (opts._debug !== undefined) {
    opts._debug(`BLS12MAPFP2TOG2 (0x13) return value=${bytesToHex(returnValue)}`)
  }

  return {
    executionGasUsed: gasUsed,
    returnValue,
  }
}
