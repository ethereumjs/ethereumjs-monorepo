import * as Legacy from './legacy.ts'

import { EthereumJSErrorWithoutCode } from '@ethereumjs/util'
import type { EIP2930CompatibleTx } from '../types.ts'

/**
 * The amount of gas paid for the data in this tx
 */
export function getDataGas(tx: EIP2930CompatibleTx): bigint {
  const eip2930Gas = BigInt(getAccessListDataGas(tx))
  return Legacy.getDataGas(tx) + eip2930Gas
}

/**
 * Calculates the data gas cost for the access list of a tx
 */
function getAccessListDataGas(tx: EIP2930CompatibleTx): number {
  const { common, accessList } = tx
  const accessListStorageKeyCost = common.param('accessListStorageKeyGas')
  const accessListAddressCost = common.param('accessListAddressGas')

  const totalSlots = accessList.reduce((sum, item) => sum + item[1].length, 0)
  const addresses = accessList.length

  let cost =
    addresses * Number(accessListAddressCost) + totalSlots * Number(accessListStorageKeyCost)

  // EIP-7981: add floor cost for access list bytes (20 bytes/address + 32 bytes/slot, 4 tokens/byte)
  if (common.isActivatedEIP(7981)) {
    const accessListBytes = addresses * 20 + totalSlots * 32
    cost += Number(common.param('totalCostFloorPerToken')) * accessListBytes * 4
  }

  return cost
}

/**
 * Verifies an access list. Throws if invalid.
 * @param tx - Transaction whose access list should be validated
 */
export function verifyAccessList(tx: EIP2930CompatibleTx) {
  const accessList = tx.accessList
  for (const accessListItem of accessList) {
    if (accessListItem.length !== 2) {
      throw EthereumJSErrorWithoutCode(
        'Invalid EIP-2930 transaction: access list item should have 2 elements',
      )
    }
    const [address, storageSlots] = accessListItem
    if (address.length !== 20) {
      throw EthereumJSErrorWithoutCode(
        'Invalid EIP-2930 transaction: address length should be 20 bytes',
      )
    }
    for (const slot of storageSlots) {
      if (slot.length !== 32) {
        throw EthereumJSErrorWithoutCode(
          'Invalid EIP-2930 transaction: storage slot length should be 32 bytes',
        )
      }
    }
  }
}
