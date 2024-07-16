import { equalsBytes, short } from '@ethereumjs/util'

import { BLS_GAS_DISCOUNT_PAIRS } from './constants.js'

import type { PrecompileInput } from '../types.js'

const ZERO_BYTES_16 = new Uint8Array(16)

/**
 * Checks that the gas used remain under the gas limit.
 *
 * @param opts
 * @param gasUsed
 * @param pName
 * @returns
 */
export const gasCheck = (opts: PrecompileInput, gasUsed: bigint, pName: string) => {
  if (opts._debug !== undefined) {
    opts._debug(
      `Run ${pName} precompile data=${short(opts.data)} length=${opts.data.length} gasLimit=${
        opts.gasLimit
      } gasUsed=${gasUsed}`
    )
  }
  if (opts.gasLimit < gasUsed) {
    if (opts._debug !== undefined) {
      opts._debug(`${pName} failed: OOG`)
    }
    return false
  }
  return true
}

/**
 * Calculates the gas used for the MSM precompiles based on the number of pairs and
 * calculating in some discount in relation to the number of pairs.
 *
 * @param numPairs
 * @param gasUsedPerPair
 * @returns
 */
export const msmGasUsed = (numPairs: number, gasUsedPerPair: bigint) => {
  const gasDiscountMax = BLS_GAS_DISCOUNT_PAIRS[BLS_GAS_DISCOUNT_PAIRS.length - 1][1]
  let gasDiscountMultiplier

  if (numPairs <= BLS_GAS_DISCOUNT_PAIRS.length) {
    if (numPairs === 0) {
      gasDiscountMultiplier = 0 // this implicitly sets gasUsed to 0 as per the EIP.
    } else {
      gasDiscountMultiplier = BLS_GAS_DISCOUNT_PAIRS[numPairs - 1][1]
    }
  } else {
    gasDiscountMultiplier = gasDiscountMax
  }
  // (numPairs * multiplication_cost * discount) / multiplier
  return (BigInt(numPairs) * gasUsedPerPair * BigInt(gasDiscountMultiplier)) / BigInt(1000)
}

/**
 * Checks that the length of the provided data is equal to `length`.
 *
 * @param opts
 * @param length
 * @param pName
 * @returns
 */
export const equalityLengthCheck = (opts: PrecompileInput, length: number, pName: string) => {
  if (opts.data.length !== length) {
    if (opts._debug !== undefined) {
      opts._debug(
        `${pName} failed: Invalid input length length=${opts.data.length} (expected: ${length})`
      )
    }
    return false
  }
  return true
}

/**
 * Checks that the total length of the provided data input can be subdivided into k equal parts
 * with `length` (without leaving some remainder bytes).
 *
 * @param opts
 * @param length
 * @param pName
 * @returns
 */
export const moduloLengthCheck = (opts: PrecompileInput, length: number, pName: string) => {
  if (opts.data.length % length !== 0) {
    if (opts._debug !== undefined) {
      opts._debug(
        `${pName} failed: Invalid input length length=${opts.data.length} (expected: ${length}*k bytes)`
      )
    }
    return false
  }
  return true
}

/**
 * BLS-specific zero check to check that the top 16 bytes of a 64 byte field element provided
 * are always zero (see EIP notes on field element encoding).
 *
 * Zero byte ranges are expected to be passed in the following format (and so each referencing
 * 16-byte ranges):
 *
 * ```ts
 * const zeroByteRanges = [
 *   [0, 16],
 *   [64, 80],
 *   [128, 144]
 *
 * ]
 * ```
 *
 * @param opts
 * @param zeroByteRanges
 * @param pName
 * @param pairStart
 * @returns
 */
export const leading16ZeroBytesCheck = (
  opts: PrecompileInput,
  zeroByteRanges: number[][],
  pName: string,
  pairStart = 0
) => {
  for (const index in zeroByteRanges) {
    const slicedBuffer = opts.data.subarray(
      zeroByteRanges[index][0] + pairStart,
      zeroByteRanges[index][1] + pairStart
    )
    if (!(equalsBytes(slicedBuffer, ZERO_BYTES_16) === true)) {
      if (opts._debug !== undefined) {
        opts._debug(`${pName} failed: Point not on curve`)
      }
      return false
    }
  }
  return true
}
