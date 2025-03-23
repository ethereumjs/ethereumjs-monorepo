import * as Legacy from './legacy.ts'

import type { Common } from '@ethereumjs/common'
import { EthereumJSErrorWithoutCode, bytesToHex, hexToBytes, setLengthLeft } from '@ethereumjs/util'
import type { AccessList, AccessListBytes, EIP2930CompatibleTx } from '../types.ts'

/**
 * The amount of gas paid for the data in this tx
 */
export function getDataGas(tx: EIP2930CompatibleTx): bigint {
  return Legacy.getDataGas(tx, BigInt(getAccessListDataGas(tx.accessList, tx.common)))
}

/**
 * Calculates the intrinsic data gas cost for a given access list
 * @param accessList
 * @param common
 * @returns
 */
export function getAccessListDataGas(accessList: AccessListBytes, common: Common): number {
  const accessListStorageKeyCost = common.param('accessListStorageKeyGas')
  const accessListAddressCost = common.param('accessListAddressGas')

  const totalSlots = accessList.reduce((sum, item) => sum + item[1].length, 0)
  const addresses = accessList.length

  return addresses * Number(accessListAddressCost) + totalSlots * Number(accessListStorageKeyCost)
}

/**
 * Verifies an access list. Throws if invalid.
 * @param accessList
 */
export function verifyAccessList(accessList: AccessListBytes) {
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

// Utility helpers to convert access lists from the byte format and JSON format and vice versa

/**
 * Converts an access list in bytes to a JSON format
 * @param accessList
 * @returns JSON format of the access list
 */
export function accessListBytesToJSON(accessList: AccessListBytes): AccessList {
  return accessList.map(([address, storageSlots]) => ({
    address: bytesToHex(setLengthLeft(address, 20)),
    storageKeys: storageSlots.map((slot) => bytesToHex(setLengthLeft(slot, 32))),
  }))
}

/**
 * Converts an access list in JSON to a bytes format
 * @param accessList
 * @returns bytes format of the access list
 */
export function accessListJSONToBytes(accessList: AccessList): AccessListBytes {
  return accessList.map((item) => [
    hexToBytes(item.address),
    item.storageKeys.map((key) => hexToBytes(key)),
  ])
}
