import type { Transaction, TransactionType } from '../types.js'

type TypedTransactionEIP1559 =
  | Transaction[TransactionType.BlobEIP4844]
  | Transaction[TransactionType.FeeMarketEIP1559]

export function getUpfrontCost(this: TypedTransactionEIP1559, baseFee: bigint): bigint {
  const prio = this.maxPriorityFeePerGas
  const maxBase = this.maxFeePerGas - baseFee
  const inclusionFeePerGas = prio < maxBase ? prio : maxBase
  const gasPrice = inclusionFeePerGas + baseFee
  return this.gasLimit * gasPrice + this.value
}
