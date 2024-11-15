import { LegacyGasMarketInterface } from '../types.js'

export function getUpfrontCost(tx: LegacyGasMarketInterface): bigint {
  return tx.gasLimit * tx.gasPrice + tx.value
}
