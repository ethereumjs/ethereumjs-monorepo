import { BaseTransaction } from '../baseTransaction.js'
import { type TypedTransaction } from '../types.js'
import { AccessLists } from '../util.js'

import type { Transaction, TransactionType } from '../types.js'

type TypedTransactionEIP2930 = Exclude<TypedTransaction, Transaction[TransactionType.Legacy]>

/**
 * The amount of gas paid for the data in this tx
 */
export function getDataFee(this: TypedTransactionEIP2930): bigint {
  if (this['cache'].dataFee && this['cache'].dataFee.hardfork === this.common.hardfork()) {
    return this['cache'].dataFee.value
  }

  let cost = BaseTransaction.prototype.getDataFee.bind(this)()
  cost += BigInt(AccessLists.getDataFeeEIP2930(this.accessList, this.common))

  if (Object.isFrozen(this)) {
    this['cache'].dataFee = {
      value: cost,
      hardfork: this.common.hardfork(),
    }
  }

  return cost
}
