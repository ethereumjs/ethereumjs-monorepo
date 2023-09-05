import { BaseTransaction } from '../baseTransaction.js'
import { AccessLists } from '../util.js'

import type { EIP2930CompatibleTxInterface } from '../types.js'

/**
 * The amount of gas paid for the data in this tx
 */
export function getDataFee(tx: EIP2930CompatibleTxInterface): bigint {
  if (tx.cache.dataFee && tx.cache.dataFee.hardfork === tx.common.hardfork()) {
    return tx.cache.dataFee.value
  }

  let cost = BaseTransaction.prototype.getDataFee.bind(tx)()
  cost += BigInt(AccessLists.getDataFeeEIP2930(tx.accessList, tx.common))

  if (Object.isFrozen(tx)) {
    tx.cache.dataFee = {
      value: cost,
      hardfork: tx.common.hardfork(),
    }
  }

  return cost
}
