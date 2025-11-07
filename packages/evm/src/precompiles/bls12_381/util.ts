import { equalsBytes } from '@ethereumjs/util'

import type { PrecompileInput } from '../types.ts'

const ZERO_BYTES_16 = new Uint8Array(16)

/**
 * Calculates the gas used for the MSM precompiles based on the number of pairs and
 * calculating in some discount in relation to the number of pairs.
 *
 * @param numPairs - Number of pairings provided to the precompile
 * @param gasUsedPerPair - Base gas cost per pairing
 * @param discountTable - Discount table (pair count -> multiplier)
 * @returns Total gas to charge after applying the discount table
 */
export const msmGasUsed = (
  numPairs: number,
  gasUsedPerPair: bigint,
  discountTable: [number, number][],
) => {
  const gasDiscountMax = discountTable[discountTable.length - 1][1]
  let gasDiscountMultiplier

  if (numPairs <= discountTable.length) {
    if (numPairs === 0) {
      gasDiscountMultiplier = 0 // this implicitly sets gasUsed to 0 as per the EIP.
    } else {
      gasDiscountMultiplier = discountTable[numPairs - 1][1]
    }
  } else {
    gasDiscountMultiplier = gasDiscountMax
  }
  // (numPairs * multiplication_cost * discount) / multiplier
  return (BigInt(numPairs) * gasUsedPerPair * BigInt(gasDiscountMultiplier)) / BigInt(1000)
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
 * @param opts - Precompile input wrapper containing the data to inspect
 * @param zeroByteRanges - Ranges (as [start, end]) within which bytes must be zero
 * @param pName - Human readable precompile name for logging
 * @param pairStart - Optional offset into the data when iterating through pairs
 * @returns `true` if every specified range contains only zero bytes
 */
export const leading16ZeroBytesCheck = (
  opts: PrecompileInput,
  zeroByteRanges: number[][],
  pName: string,
  pairStart = 0,
) => {
  for (const index in zeroByteRanges) {
    const slicedBuffer = opts.data.subarray(
      zeroByteRanges[index][0] + pairStart,
      zeroByteRanges[index][1] + pairStart,
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
