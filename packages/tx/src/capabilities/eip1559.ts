import type { EIP1559CompatibleTxInterface } from '../types.js'

export function getUpfrontCost(tx: EIP1559CompatibleTxInterface, baseFee: bigint): bigint {
  const prio = tx.maxPriorityFeePerGas
  const maxBase = tx.maxFeePerGas - baseFee
  const inclusionFeePerGas = prio < maxBase ? prio : maxBase
  const gasPrice = inclusionFeePerGas + baseFee
  return tx.gasLimit * gasPrice + tx.value
}
