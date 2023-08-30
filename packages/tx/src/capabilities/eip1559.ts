import type { Transaction, TransactionType } from '../types.js'

type TypedTransactionEIP1559 =
  | Transaction[TransactionType.BlobEIP4844]
  | Transaction[TransactionType.FeeMarketEIP1559]

export function getUpfrontCost(tx: TypedTransactionEIP1559, baseFee: bigint): bigint {
  const prio = tx.maxPriorityFeePerGas
  const maxBase = tx.maxFeePerGas - baseFee
  const inclusionFeePerGas = prio < maxBase ? prio : maxBase
  const gasPrice = inclusionFeePerGas + baseFee
  return tx.gasLimit * gasPrice + tx.value
}
