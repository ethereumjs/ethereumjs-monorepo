import { getAccessListDataGasEIP2930 } from '../util.ts'

import * as Legacy from './legacy.ts'

import type { EIP7702CompatibleTx } from '../types.ts'

/**
 * The amount of gas paid for the data in this tx
 */
export function getDataGas(tx: EIP7702CompatibleTx): bigint {
  const eip2930Cost = BigInt(getAccessListDataGasEIP2930(tx.accessList, tx.common))
  const eip7702Cost = BigInt(
    tx.authorizationList.length * Number(tx.common.param('perEmptyAccountCost')),
  )
  return Legacy.getDataGas(tx, eip2930Cost + eip7702Cost)
}
