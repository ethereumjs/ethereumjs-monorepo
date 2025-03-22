import * as Legacy from './legacy.ts'

import type { Common } from '@ethereumjs/common'
import { EthereumJSErrorWithoutCode, bytesToHex, hexToBytes, setLengthLeft } from '@ethereumjs/util'
import type { AccessList, AccessListBytes, AccessListItem, EIP2930CompatibleTx } from '../types.ts'

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

  let slots = 0
  for (let index = 0; index < accessList.length; index++) {
    const item = accessList[index]
    const storageSlots = item[1]
    slots += storageSlots.length
  }

  const addresses = accessList.length
  return addresses * Number(accessListAddressCost) + slots * Number(accessListStorageKeyCost)
}

/**
 * Verifies an access list. Throws if invalid.
 * @param accessList
 */
export function verifyAccessList(accessList: AccessListBytes) {
  for (let key = 0; key < accessList.length; key++) {
    const accessListItem = accessList[key]
    const address = accessListItem[0]
    const storageSlots = accessListItem[1]
    if (accessListItem.length > 2) {
      throw EthereumJSErrorWithoutCode(
        'Access list item cannot have more than 2 elements. It can only have an address, and an array of storage slots.',
      )
    }
    if (address.length !== 20) {
      throw EthereumJSErrorWithoutCode(
        'Invalid EIP-2930 transaction: address length should be 20 bytes',
      )
    }
    for (let storageSlot = 0; storageSlot < storageSlots.length; storageSlot++) {
      if (storageSlots[storageSlot].length !== 32) {
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
  const accessListJSON: AccessList = []
  for (let index = 0; index < accessList.length; index++) {
    const item = accessList[index]
    const JSONItem: AccessListItem = {
      address: bytesToHex(setLengthLeft(item[0], 20)),
      storageKeys: [],
    }
    const storageSlots = item[1]
    for (let slot = 0; slot < storageSlots.length; slot++) {
      const storageSlot = storageSlots[slot]
      JSONItem.storageKeys.push(bytesToHex(setLengthLeft(storageSlot, 32)))
    }
    accessListJSON.push(JSONItem)
  }
  return accessListJSON
}

/**
 * Converts an access list in JSON to a bytes format
 * @param accessList
 * @returns bytes format of the access list
 */
export function accessListJSONToBytes(accessList: AccessList): AccessListBytes {
  const accessListBytes: AccessListBytes = []
  for (let i = 0; i < accessList.length; i++) {
    const item: AccessListItem = accessList[i]
    const addressBytes = hexToBytes(item.address)
    const storageItems: Uint8Array[] = []
    for (let index = 0; index < item.storageKeys.length; index++) {
      storageItems.push(hexToBytes(item.storageKeys[index]))
    }
    accessListBytes.push([addressBytes, storageItems])
  }
  return accessListBytes
}
