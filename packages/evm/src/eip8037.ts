import { BIGINT_0, BIGINT_1 } from '@ethereumjs/util'

import type { Common } from '@ethereumjs/common'

const TARGET_STATE_GROWTH_PER_YEAR = BigInt(107_374_182_400) // 100 * 1024^3
const CPSB_SCALE_NUMERATOR = BigInt(2_628_000)
const CPSB_DENOMINATOR = BigInt(2) * TARGET_STATE_GROWTH_PER_YEAR
const CPSB_OFFSET = BigInt(9_578)
const CPSB_SIGNIFICANT_BITS = 5

function bitLength(n: bigint): number {
  if (n <= BIGINT_0) return 0
  return n.toString(2).length
}

/**
 * EIP-8037 CPSB (cost per state byte), parametric in the block gas limit.
 *
 *   raw      = ceil(gasLimit * 2_628_000 / (2 * 107_374_182_400))
 *   shifted  = raw + 9578
 *   shift    = max(bitLength(shifted) - 5, 0)        // top-5-bit quantization
 *   rounded  = (shifted >> shift) << shift
 *   cpsb     = rounded <= 9578 ? 1 : rounded - 9578
 *
 * At the spec reference gas limit of 96M this returns 1174.
 */
export function computeCostPerStateByte(blockGasLimit: bigint): bigint {
  const numerator = blockGasLimit * CPSB_SCALE_NUMERATOR
  // ceil division
  const raw = (numerator + CPSB_DENOMINATOR - BIGINT_1) / CPSB_DENOMINATOR
  const shifted = raw + CPSB_OFFSET
  const shift = Math.max(bitLength(shifted) - CPSB_SIGNIFICANT_BITS, 0)
  const rounded = (shifted >> BigInt(shift)) << BigInt(shift)
  if (rounded <= CPSB_OFFSET) return BIGINT_1
  return rounded - CPSB_OFFSET
}

/**
 * Returns the active CPSB to use for charges.
 * - If EIP-8037 is active and a block gas limit is supplied, the parametric
 *   formula is used.
 * - Otherwise falls back to the static `costPerStateByte` common parameter.
 */
export function activeCostPerStateByte(common: Common, blockGasLimit?: bigint): bigint {
  if (common.isActivatedEIP(8037) && blockGasLimit !== undefined && blockGasLimit > BIGINT_0) {
    return computeCostPerStateByte(blockGasLimit)
  }
  return common.param('costPerStateByte')
}
