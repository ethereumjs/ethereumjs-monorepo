import { Capability } from '../../types.js'

import type { LegacyGasMarketInterface } from '../../types.js'

export function getUpfrontCost(tx: LegacyGasMarketInterface): bigint {
  if (!tx.activeCapabilities.includes(Capability.LegacyGasMarket)) {
    throw new Error('Tx does not support legacy gas market')
  }
  return tx.gasLimit * tx.gasPrice + tx.value
}

export function getEffectivePriorityFee(
  tx: LegacyGasMarketInterface,
  baseFee: bigint | undefined,
): bigint {
  if (!tx.activeCapabilities.includes(Capability.LegacyGasMarket)) {
    throw new Error('Tx does not support legacy gas market')
  }
  if (baseFee !== undefined && baseFee > tx.gasPrice) {
    throw new Error('Tx cannot pay baseFee')
  }

  if (baseFee === undefined) {
    return tx.gasPrice
  }

  return tx.gasPrice - baseFee
}
