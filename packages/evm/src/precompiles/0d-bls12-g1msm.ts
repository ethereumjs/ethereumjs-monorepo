import { bytesToHex } from '@ethereumjs/util'

import { EvmErrorResult, OOGResult } from '../evm.js'
import { ERROR, EvmError } from '../exceptions.js'

import { gasCheck, moduloLengthCheck, msmGasUsed, zeroByteCheck } from './bls12_381/index.js'
import { BLS12_381_FromG1Point, BLS12_381_ToFrPoint, BLS12_381_ToG1Point } from './bls12_381/mcl.js'

import type { ExecResult } from '../types.js'
import type { PrecompileInput } from './types.js'

export async function precompile0d(opts: PrecompileInput): Promise<ExecResult> {
  const mcl = (<any>opts._EVM)._mcl!

  const inputData = opts.data

  if (inputData.length === 0) {
    if (opts._debug !== undefined) {
      opts._debug(`BLS12G1MSM (0x0d) failed: Empty input`)
    }
    return EvmErrorResult(new EvmError(ERROR.BLS_12_381_INPUT_EMPTY), opts.gasLimit) // follow Geths implementation
  }

  // TODO: Double-check respectively confirm that this order is really correct that the gas check
  // on this eventually to be "floored" pair number should happen before the input length modulo
  // validation (same for g2msm)
  const numPairs = Math.floor(inputData.length / 160)
  const gasUsedPerPair = opts.common.paramByEIP('gasPrices', 'Bls12381G1MulGas', 2537) ?? BigInt(0)
  const gasUsed = msmGasUsed(numPairs, gasUsedPerPair)

  if (!gasCheck(opts, gasUsed, 'BLS12G1MSM (0x0d)')) {
    return OOGResult(opts.gasLimit)
  }

  if (inputData.length % 160 !== 0) {
    if (opts._debug !== undefined) {
      opts._debug(`BLS12G1MSM (0x0d) failed: Invalid input length length=${inputData.length}`)
    }
    return EvmErrorResult(new EvmError(ERROR.BLS_12_381_INVALID_INPUT_LENGTH), opts.gasLimit)
  }
  if (!moduloLengthCheck(opts, 160, 'BLS12G1MSM (0x0d)')) {
    return EvmErrorResult(new EvmError(ERROR.BLS_12_381_INVALID_INPUT_LENGTH), opts.gasLimit)
  }

  // prepare pairing list and check for mandatory zero bytes
  const zeroByteRanges = [
    [0, 16],
    [64, 80],
  ]

  const G1Array = []
  const FrArray = []

  for (let k = 0; k < numPairs; k++) {
    // zero bytes check
    const pairStart = 160 * k
    if (!zeroByteCheck(opts, zeroByteRanges, 'BLS12G1MSM (0x0d)', pairStart)) {
      return EvmErrorResult(new EvmError(ERROR.BLS_12_381_POINT_NOT_ON_CURVE), opts.gasLimit)
    }

    let G1
    try {
      G1 = BLS12_381_ToG1Point(opts.data.subarray(pairStart, pairStart + 128), mcl)
    } catch (e: any) {
      if (opts._debug !== undefined) {
        opts._debug(`BLS12G1MSM (0x0d) failed: ${e.message}`)
      }
      return EvmErrorResult(e, opts.gasLimit)
    }
    const Fr = BLS12_381_ToFrPoint(opts.data.subarray(pairStart + 128, pairStart + 160), mcl)

    G1Array.push(G1)
    FrArray.push(Fr)
  }

  const result = mcl.mulVec(G1Array, FrArray)

  const returnValue = BLS12_381_FromG1Point(result)

  if (opts._debug !== undefined) {
    opts._debug(`BLS12G1MSM (0x0d) return value=${bytesToHex(returnValue)}`)
  }

  return {
    executionGasUsed: gasUsed,
    returnValue,
  }
}
