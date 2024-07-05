import { bytesToHex } from '@ethereumjs/util'

import { EvmErrorResult, OOGResult } from '../evm.js'
import { ERROR, EvmError } from '../exceptions.js'

import {
  gasCheck,
  leading16ZeroBytesCheck,
  moduloLengthCheck,
  msmGasUsed,
} from './bls12_381/index.js'

import type { EVMBLSInterface, ExecResult } from '../types.js'
import type { PrecompileInput } from './types.js'

export async function precompile10(opts: PrecompileInput): Promise<ExecResult> {
  const bls = (<any>opts._EVM)._bls! as EVMBLSInterface

  if (opts.data.length === 0) {
    if (opts._debug !== undefined) {
      opts._debug(`BLS12G2MSM (0x10) failed: Empty input`)
    }
    return EvmErrorResult(new EvmError(ERROR.BLS_12_381_INPUT_EMPTY), opts.gasLimit) // follow Geths implementation
  }

  const numPairs = Math.floor(opts.data.length / 288)
  const gasUsedPerPair = opts.common.paramByEIP('gasPrices', 'Bls12381G2MulGas', 2537) ?? BigInt(0)
  const gasUsed = msmGasUsed(numPairs, gasUsedPerPair)

  if (!gasCheck(opts, gasUsed, 'BLS12G2MSM (0x10)')) {
    return OOGResult(opts.gasLimit)
  }

  if (!moduloLengthCheck(opts, 288, 'BLS12G2MSM (0x10)')) {
    return EvmErrorResult(new EvmError(ERROR.BLS_12_381_INVALID_INPUT_LENGTH), opts.gasLimit)
  }

  // prepare pairing list and check for mandatory zero bytes
  const zeroByteRanges = [
    [0, 16],
    [64, 80],
    [128, 144],
    [192, 208],
  ]

  for (let k = 0; k < numPairs; k++) {
    // zero bytes check
    const pairStart = 288 * k
    if (!leading16ZeroBytesCheck(opts, zeroByteRanges, 'BLS12G2MSM (0x10)', pairStart)) {
      return EvmErrorResult(new EvmError(ERROR.BLS_12_381_POINT_NOT_ON_CURVE), opts.gasLimit)
    }
  }

  let returnValue
  try {
    returnValue = bls.msmG2(opts.data)
  } catch (e: any) {
    if (opts._debug !== undefined) {
      opts._debug(`BLS12G2MSM (0x10) failed: ${e.message}`)
    }
    return EvmErrorResult(e, opts.gasLimit)
  }

  if (opts._debug !== undefined) {
    opts._debug(`BLS12G2MSM (0x10) return value=${bytesToHex(returnValue)}`)
  }

  return {
    executionGasUsed: gasUsed,
    returnValue,
  }
}
