// Utility helpers to convert access lists from the byte format and JSON format and vice versa

import { bytesToHex, hexToBytes, setLengthLeft } from '@ethereumjs/util'
import type { AccessList, AccessListBytes } from '../types.ts'

/**
 * Converts an access list from bytes to JSON (0x-prefixed hex addresses and storage keys).
 */
export function accessListBytesToJSON(accessList: AccessListBytes): AccessList {
  return accessList.map(([address, storageSlots]) => ({
    address: bytesToHex(setLengthLeft(address, 20)),
    storageKeys: storageSlots.map((slot) => bytesToHex(setLengthLeft(slot, 32))),
  }))
}

/**
 * Converts an access list from JSON to bytes (unpadded address and 32-byte storage keys).
 */
export function accessListJSONToBytes(accessList: AccessList): AccessListBytes {
  return accessList.map((item) => [
    hexToBytes(item.address),
    item.storageKeys.map((key) => hexToBytes(key)),
  ])
}
