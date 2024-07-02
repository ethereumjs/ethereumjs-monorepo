import { AccessLists } from '../util.js'

import * as Legacy from './legacy.js'

import type { EIP7702CompatibleTx } from '../types.js'

/**
 * The amount of gas paid for the data in this tx
 */
export function getDataFee(tx: EIP7702CompatibleTx): bigint {
  const eip2930Cost = BigInt(AccessLists.getDataFeeEIP2930(tx.accessList, tx.common))
  const eip7702Cost = BigInt(
    tx.authorizationList.length * Number(tx.common.param('gasPrices', 'perAuthBaseCost'))
  )
  return Legacy.getDataFee(tx, eip2930Cost + eip7702Cost)
}
