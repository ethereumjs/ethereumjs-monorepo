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
 * @param accessList - The access list in bytes format
 * @param common - The common instance containing chain parameters
 * @returns The total gas cost for the access list
 */
export function getAccessListDataGas(accessList: AccessListBytes, common: Common): number {
  const accessListStorageKeyCost = common.param('accessListStorageKeyGas')
  const accessListAddressCost = common.param('accessListAddressGas')

  const totalSlots = accessList.reduce((acc, item) => acc + item[1].length, 0)
  const totalAddresses = accessList.length

  return (
    totalAddresses * Number(accessListAddressCost) + totalSlots * Number(accessListStorageKeyCost)
  )
}

/**
 * Validates a single access list item
 * @param item - The access list item to validate
 */
function validateAccessListItem(item: AccessListBytes[number]) {
  const [address, storageSlots] = item

  if (item.length > 2) {
    throw EthereumJSErrorWithoutCode(
      'Invalid EIP-2930 transaction: access list item cannot have more than 2 elements. It can only have an address and an array of storage slots.',
    )
  }

  if (address.length !== 20) {
    throw EthereumJSErrorWithoutCode(
      'Invalid EIP-2930 transaction: address length should be 20 bytes',
    )
  }

  for (const storageSlot of storageSlots) {
    if (storageSlot.length !== 32) {
      throw EthereumJSErrorWithoutCode(
        'Invalid EIP-2930 transaction: storage slot length should be 32 bytes',
      )
    }
  }
}

/**
 * Verifies an access list. Throws if invalid.
 * @param accessList - The access list to verify
 */
export function verifyAccessList(accessList: AccessListBytes) {
  if (accessList.length === 0) {
    throw EthereumJSErrorWithoutCode('Invalid EIP-2930 transaction: access list is empty')
  }

  for (const item of accessList) {
    validateAccessListItem(item)
  }
}

/**
 * Converts an access list in bytes to a JSON format
 * @param accessList - The access list in bytes format
 * @returns The access list in JSON format
 */
export function accessListBytesToJSON(accessList: AccessListBytes): AccessList {
  return accessList.map(([address, storageSlots]) => ({
    address: bytesToHex(setLengthLeft(address, 20)),
    storageKeys: storageSlots.map((slot) => bytesToHex(setLengthLeft(slot, 32))),
  }))
}

/**
 * Converts an access list in JSON to a bytes format
 * @param accessList - The access list in JSON format
 * @returns The access list in bytes format
 */
export function accessListJSONToBytes(accessList: AccessList): AccessListBytes {
  const requiredFields = ['address', 'storageKeys'] as const

  return accessList.map((item) => {
    // Validate all required fields are present
    for (const field of requiredFields) {
      if (item[field] === undefined) {
        throw EthereumJSErrorWithoutCode(`EIP-2930 access list invalid: ${field} is not defined`)
      }
    }

    return [hexToBytes(item.address), item.storageKeys.map((key) => hexToBytes(key))]
  })
}
