import { padToEven } from '../internal.ts'
import type { PrefixedHexString } from '../types.ts'
import type { BALStorageKeyHex } from './types.ts'

export function stripLeadingZeros(bytes: Uint8Array): Uint8Array {
  let first = bytes[0]
  while (bytes.length > 0 && first.toString() === '0') {
    bytes = bytes.slice(1)
    first = bytes[0]
  }
  return bytes
}

export function padToEvenHex(hex: PrefixedHexString): PrefixedHexString {
  return `0x${padToEven(hex.slice(2))}`
}

/**
 * Normalizes a storage key hex string to ensure consistent even-length representation.
 * - "0x" (empty bytes) is kept as is
 * - "0x0" becomes "0x00"
 * - Any odd-length hex is padded to even (e.g., "0x1" → "0x01")
 */
export function normalizeStorageKeyHex(hex: PrefixedHexString): BALStorageKeyHex {
  const stripped = hex.slice(2)
  // Empty string "0x" stays as is
  if (stripped === '') {
    return '0x' as BALStorageKeyHex
  }
  // Pad to even length (handles "0x0" → "0x00", "0x1" → "0x01", etc.)
  return `0x${padToEven(stripped)}` as BALStorageKeyHex
}

/**
 * Normalizes a hex string for canonical RLP encoding.
 * In RLP, the integer 0 must be encoded as empty bytes (0x80), not as a single zero byte (0x00).
 * This function converts hex strings representing zero to empty Uint8Array.
 */
export function normalizeHexForRLP(hex: PrefixedHexString): PrefixedHexString | Uint8Array {
  // Strip 0x prefix and all leading zeros
  const stripped = hex.slice(2).replace(/^0+/, '')
  if (stripped === '') {
    // Value is zero - return empty array for canonical RLP encoding
    return Uint8Array.from([])
  }
  return hex
}
