import * as Legacy from './legacy.ts'

import { EthereumJSErrorWithoutCode } from '@ethereumjs/util'
import type { AccessList, EIP2930CompatibleTx } from '../types.ts'
import { accessListBytesToJSON } from '../util/access.ts'

/**
 * The amount of gas paid for the data in this tx
 */
export function getDataGas(tx: EIP2930CompatibleTx): bigint {
  return Legacy.getDataGas(tx) + getAccessListDataGas(tx)
}

/**
 * Returns the access list of the tx in JSON format.
 *
 * For frozen txs the result is computed once, frozen (the tx cannot change
 * anymore, so neither can its JSON representation) and cached, and repeated
 * calls return the same frozen object. For non-frozen txs a fresh (mutable)
 * copy is returned on every call, since the underlying access list bytes
 * could still change.
 */
export function getAccessListJSON(tx: EIP2930CompatibleTx): AccessList {
  if (tx.cache.accessListJSON !== undefined) {
    return tx.cache.accessListJSON
  }

  const accessListJSON = accessListBytesToJSON(tx.accessList)

  if (Object.isFrozen(tx)) {
    for (const item of accessListJSON) {
      Object.freeze(item.storageKeys)
      Object.freeze(item)
    }
    Object.freeze(accessListJSON)
    tx.cache.accessListJSON = accessListJSON
  }

  return accessListJSON
}

/**
 * Calculates the data gas cost for the access list of a tx
 */
function getAccessListDataGas(tx: EIP2930CompatibleTx): bigint {
  const { common, accessList } = tx
  const accessListStorageKeyCost = common.param('accessListStorageKeyGas')
  const accessListAddressCost = common.param('accessListAddressGas')

  const totalSlots = accessList.reduce((sum, item) => sum + BigInt(item[1].length), 0n)
  const addresses = BigInt(accessList.length)

  let cost = addresses * accessListAddressCost + totalSlots * accessListStorageKeyCost

  // EIP-7981: add floor cost for access list bytes (20 bytes/address + 32 bytes/slot, 4 tokens/byte)
  if (common.isActivatedEIP(7981)) {
    const accessListBytes = addresses * 20n + totalSlots * 32n
    cost += common.param('totalCostFloorPerToken') * accessListBytes * 4n
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
