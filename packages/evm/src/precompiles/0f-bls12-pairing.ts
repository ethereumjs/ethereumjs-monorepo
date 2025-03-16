import { bytesToHex } from '@ethereumjs/util'

import { EvmErrorResult, OOGResult } from '../evm.ts'
import { ERROR, EvmError } from '../exceptions.ts'

import { leading16ZeroBytesCheck } from './bls12_381/index.ts'
import { getPrecompileName } from './index.ts'
import { gasLimitCheck, moduloLengthCheck } from './util.ts'

import type { EVMBLSInterface, ExecResult } from '../types.ts'
import type { PrecompileInput } from './types.ts'

export async function precompile0f(opts: PrecompileInput): Promise<ExecResult> {
  const pName = getPrecompileName('11')
  const bls = (<any>opts._EVM)._bls! as EVMBLSInterface

  const baseGas = opts.common.param('bls12381PairingBaseGas') ?? BigInt(0)

  // TODO: confirm that this is not a thing for the other precompiles
  if (opts.data.length === 0) {
    if (opts._debug !== undefined) {
      opts._debug(`${pName} failed: Empty input`)
    }
    return EvmErrorResult(new EvmError(ERROR.BLS_12_381_INPUT_EMPTY), opts.gasLimit)
  }

  const gasUsedPerPair = opts.common.param('bls12381PairingPerPairGas') ?? BigInt(0)

  // TODO: For this precompile it is the only exception that the length check is placed before the
  // gas check. I will keep it there to not side-change the existing implementation, but we should
  // check (respectively Jochem can maybe have a word) if this is something intended or not
  if (!moduloLengthCheck(opts, 384, pName)) {
    return EvmErrorResult(new EvmError(ERROR.BLS_12_381_INVALID_INPUT_LENGTH), opts.gasLimit)
  }

  const gasUsed = baseGas + gasUsedPerPair * BigInt(Math.floor(opts.data.length / 384))
  if (!gasLimitCheck(opts, gasUsed, pName)) {
    return OOGResult(opts.gasLimit)
  }

  // check for mandatory zero bytes
  const zeroByteRanges = [
    [0, 16],
    [64, 80],
    [128, 144],
    [192, 208],
    [256, 272],
    [320, 336],
  ]
  for (let k = 0; k < opts.data.length / 384; k++) {
    // zero bytes check
    const pairStart = 384 * k
    if (!leading16ZeroBytesCheck(opts, zeroByteRanges, pName, pairStart)) {
      return EvmErrorResult(new EvmError(ERROR.BLS_12_381_POINT_NOT_ON_CURVE), opts.gasLimit)
    }
  }

  let returnValue
  try {
    returnValue = bls.pairingCheck(opts.data)
  } catch (e: any) {
    if (opts._debug !== undefined) {
      opts._debug(`${pName} failed: ${e.message}`)
    }
    return EvmErrorResult(e, opts.gasLimit)
  }

  if (opts._debug !== undefined) {
    opts._debug(`${pName} return value=${bytesToHex(returnValue)}`)
  }

  return {
    executionGasUsed: gasUsed,
    returnValue,
  }
}
