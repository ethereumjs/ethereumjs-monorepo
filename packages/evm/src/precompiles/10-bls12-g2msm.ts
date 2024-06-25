import { bytesToHex } from '@ethereumjs/util'

import { EvmErrorResult, OOGResult } from '../evm.js'
import { ERROR, EvmError } from '../exceptions.js'

import {
  BLS_GAS_DISCOUNT_PAIRS,
  gasCheck,
  moduloLengthCheck,
  zeroByteCheck,
} from './bls12_381/index.js'
import { BLS12_381_FromG2Point, BLS12_381_ToFrPoint, BLS12_381_ToG2Point } from './bls12_381/mcl.js'

import type { ExecResult } from '../types.js'
import type { PrecompileInput } from './types.js'

export async function precompile10(opts: PrecompileInput): Promise<ExecResult> {
  const mcl = (<any>opts._EVM)._mcl!

  const inputData = opts.data

  if (inputData.length === 0) {
    if (opts._debug !== undefined) {
      opts._debug(`BLS12G2MSM (0x10) failed: Empty input`)
    }
    return EvmErrorResult(new EvmError(ERROR.BLS_12_381_INPUT_EMPTY), opts.gasLimit) // follow Geths implementation
  }

  const numPairs = Math.floor(inputData.length / 288)

  const gasUsedPerPair = opts.common.paramByEIP('gasPrices', 'Bls12381G2MulGas', 2537) ?? BigInt(0)
  const gasDiscountArray = BLS_GAS_DISCOUNT_PAIRS
  const gasDiscountMax = gasDiscountArray[gasDiscountArray.length - 1][1]
  let gasDiscountMultiplier

  if (numPairs <= gasDiscountArray.length) {
    if (numPairs === 0) {
      gasDiscountMultiplier = 0 // this implicitly sets gasUsed to 0 as per the EIP.
    } else {
      gasDiscountMultiplier = gasDiscountArray[numPairs - 1][1]
    }
  } else {
    gasDiscountMultiplier = gasDiscountMax
  }

  const gasUsed = (gasUsedPerPair * BigInt(numPairs) * BigInt(gasDiscountMultiplier)) / BigInt(1000)
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

  const G2Array = []
  const FrArray = []

  for (let k = 0; k < inputData.length / 288; k++) {
    // zero bytes check
    const pairStart = 288 * k
    if (!zeroByteCheck(opts, zeroByteRanges, 'BLS12G2MSM (0x10)', pairStart)) {
      return EvmErrorResult(new EvmError(ERROR.BLS_12_381_POINT_NOT_ON_CURVE), opts.gasLimit)
    }

    let G2
    try {
      G2 = BLS12_381_ToG2Point(opts.data.subarray(pairStart, pairStart + 256), mcl)
    } catch (e: any) {
      if (opts._debug !== undefined) {
        opts._debug(`BLS12G2MSM (0x10) failed: ${e.message}`)
      }
      return EvmErrorResult(e, opts.gasLimit)
    }
    const Fr = BLS12_381_ToFrPoint(opts.data.subarray(pairStart + 256, pairStart + 288), mcl)

    G2Array.push(G2)
    FrArray.push(Fr)
  }

  const result = mcl.mulVec(G2Array, FrArray)

  const returnValue = BLS12_381_FromG2Point(result)

  if (opts._debug !== undefined) {
    opts._debug(`BLS12G2MSM (0x10) return value=${bytesToHex(returnValue)}`)
  }

  return {
    executionGasUsed: gasUsed,
    returnValue,
  }
}
