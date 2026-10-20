import { activeCostPerStateByte } from './eip8037.ts'

import type { Common } from '@ethereumjs/common'

/**
 * EIP-8037 (and future state-gas EIPs) resolved once per hardfork / EIP set.
 */
export interface StateGasAccountant {
  readonly active: boolean
  costPerStateByte(blockGasLimit?: bigint): bigint
}

export class LegacyStateGasAccountant implements StateGasAccountant {
  readonly active = false

  costPerStateByte(_blockGasLimit?: bigint): bigint {
    return 0n
  }
}

export class EIP8037StateGasAccountant implements StateGasAccountant {
  readonly active = true
  private common: Common

  constructor(common: Common) {
    this.common = common
  }

  costPerStateByte(blockGasLimit?: bigint): bigint {
    return activeCostPerStateByte(this.common, blockGasLimit)
  }
}

export function createStateGasAccountant(common: Common): StateGasAccountant {
  if (common.isActivatedEIP(8037)) {
    return new EIP8037StateGasAccountant(common)
  }
  return new LegacyStateGasAccountant()
}
