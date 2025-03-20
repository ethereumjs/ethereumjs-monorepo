import { getAccessListDataGasEIP2930 } from '../util.ts'

import * as Legacy from './legacy.ts'

import type { EIP2930CompatibleTx } from '../types.ts'

/**
 * The amount of gas paid for the data in this tx
 */
export function getDataGas(tx: EIP2930CompatibleTx): bigint {
  return Legacy.getDataGas(tx, BigInt(getAccessListDataGasEIP2930(tx.accessList, tx.common)))
}
