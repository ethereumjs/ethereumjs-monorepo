import type { Common } from '@ethereumjs/common'

/**
 * EIP-8037 cost-per-state-byte. Under the v7 fixtures the value is a flat
 * constant (1530, sourced from the `costPerStateByte` common parameter)
 * rather than the earlier draft's block-gas-limit-derived value. The helper
 * is kept so callers don't need to know whether the value is constant or
 * derived; a future spec revision could re-introduce a derivation here.
 */
export function activeCostPerStateByte(common: Common, _blockGasLimit?: bigint): bigint {
  return common.param('costPerStateByte')
}
