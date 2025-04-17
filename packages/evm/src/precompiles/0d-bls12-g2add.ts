import { bytesToHex } from '@ethereumjs/util'

import { EVMError, EVMErrorMessages } from '../errors.ts'
import type { EVM } from '../evm.ts'
import { EvmErrorResult, OOGResult } from '../evm.ts'

import { leading16ZeroBytesCheck } from './bls12_381/index.ts'
import { getPrecompileName } from './index.ts'
import { equalityLengthCheck, gasLimitCheck } from './util.ts'

import type { ExecResult } from '../types.ts'
import type { PrecompileInput } from './types.ts'

export async function precompile0d(opts: PrecompileInput): Promise<ExecResult> {
  const pName = getPrecompileName('0e')
  const bls = (opts._EVM as EVM)['_bls']!

  // note: the gas used is constant; even if the input is incorrect.
  const gasUsed = opts.common.param('bls12381G2AddGas') ?? BigInt(0)
  if (!gasLimitCheck(opts, gasUsed, pName)) {
    return OOGResult(opts.gasLimit)
  }

  if (!equalityLengthCheck(opts, 512, pName)) {
    return EvmErrorResult(
      new EVMError(EVMErrorMessages.BLS_12_381_INVALID_INPUT_LENGTH),
      opts.gasLimit,
    )
  }

  // check if some parts of input are zero bytes.
  const zeroByteRanges = [
    [0, 16],
    [64, 80],
    [128, 144],
    [192, 208],
    [256, 272],
    [320, 336],
    [384, 400],
    [448, 464],
  ]
  if (!leading16ZeroBytesCheck(opts, zeroByteRanges, pName)) {
    return EvmErrorResult(
      new EVMError(EVMErrorMessages.BLS_12_381_POINT_NOT_ON_CURVE),
      opts.gasLimit,
    )
  }

  // TODO: verify that point is on G2

  let returnValue
  try {
    returnValue = bls.addG2(opts.data)
  } catch (e: any) {
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
