// Utility helpers to convert access lists from the byte format and JSON format and vice versa

import { bytesToHex, hexToBytes, setLengthLeft } from '@ethereumjs/util'
import type { AccessList, AccessListBytes } from '../types.ts'

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
