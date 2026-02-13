import { hexToBigInt } from '../bytes.ts'
import { padToEven } from '../internal.ts'
import type { PrefixedHexString } from '../types.ts'
import type {
  BALAccessIndexNumber,
  BALBalanceHex,
  BALNonceHex,
  BALRawBalanceChange,
  BALRawNonceChange,
  BALRawSlotChanges,
  BALRawStorageChange,
  BALStorageKeyHex,
} from './types.ts'

/**
 * Removes leading zero bytes from a byte array.
 * Used to produce minimal-length representations for canonical encoding.
 *
 * @param bytes - Input byte array (may be mutated via slice)
 * @returns New Uint8Array with leading zeros removed
 */
export function stripLeadingZeros(bytes: Uint8Array): Uint8Array {
  let first = bytes[0]
  while (bytes.length > 0 && first.toString() === '0') {
    bytes = bytes.slice(1)
    first = bytes[0]
  }
  return bytes
}

/**
 * Pads a hex string to even length by prepending a single "0" when needed.
 * Ensures consistent two-character nibbles (e.g. "0x1" → "0x01").
 *
 * @param hex - Hex string with optional "0x" prefix
 * @returns Same hex with even length after the prefix
 */
export function padToEvenHex(hex: PrefixedHexString): PrefixedHexString {
  return `0x${padToEven(hex.slice(2))}`
}

/**
 * Normalizes a storage key hex string to even-length representation for consistency.
 * Empty "0x" is kept as is; "0x0" becomes "0x00"; odd-length hex is padded (e.g. "0x1" → "0x01").
 *
 * @param hex - Storage key as prefixed hex string
 * @returns Normalized key as {@link BALStorageKeyHex}
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
 * In RLP, zero must be encoded as empty bytes (0x80), not a single zero byte (0x00);
 * this function converts hex strings representing zero to an empty Uint8Array.
 *
 * @param hex - Value as prefixed hex string
 * @returns Same hex string, or empty Uint8Array when the value is zero
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

/**
 * Normalizes BAL storage write changes for canonical RLP encoding.
 * Sorts slots lexicographically and sorts per-slot changes by access index.
 * Storage keys are normalized with {@link normalizeHexForRLP} (zero → empty bytes).
 *
 * @param changes - BAL storage write changes keyed by storage slot hex
 * @returns Sorted array of [slot, changes] pairs suitable for RLP encoding
 */
export function normalizeStorageChanges(
  changes: Record<BALStorageKeyHex, BALRawStorageChange[]>,
): BALRawSlotChanges[] {
  return Object.entries(changes)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([slot, changes]) => [
      normalizeHexForRLP(slot as PrefixedHexString),
      changes.sort((a, b) => a[0] - b[0]),
    ]) as BALRawSlotChanges[]
}

/**
 * Normalizes and sorts storage read keys for canonical encoding.
 * Keys are normalized with {@link normalizeHexForRLP} and sorted numerically by value.
 *
 * @param reads - Set of storage slot hex keys that were read
 * @returns Sorted array of normalized storage key hex strings
 */
export function normalizeStorageReads(reads: Set<BALStorageKeyHex>): BALStorageKeyHex[] {
  return Array.from(reads)
    .map(normalizeHexForRLP)
    .sort((a, b) =>
      Number(hexToBigInt(a as PrefixedHexString) - hexToBigInt(b as PrefixedHexString)),
    ) as BALStorageKeyHex[]
}

/**
 * Converts balance changes from a Map to an array of [index, balance] pairs.
 * Order follows map iteration; use with a consistently ordered map for canonical output.
 *
 * @param changes - Map from block access index to post-balance hex
 * @returns Array of {@link BALRawBalanceChange} tuples
 */
export function normalizeBalanceChanges(
  changes: Map<BALAccessIndexNumber, BALBalanceHex>,
): BALRawBalanceChange[] {
  return Array.from(changes.entries()).map(([index, balance]) => [
    index,
    balance,
  ]) as BALRawBalanceChange[]
}

/**
 * Converts nonce changes from a Map to an array of [index, nonce] pairs.
 * Order follows map iteration; use with a consistently ordered map for canonical output.
 *
 * @param changes - Map from block access index to post-nonce hex
 * @returns Array of {@link BALRawNonceChange} tuples
 */
export function normalizeNonceChanges(
  changes: Map<BALAccessIndexNumber, BALNonceHex>,
): BALRawNonceChange[] {
  return Array.from(changes.entries()).map(([index, nonce]) => [
    index,
    nonce,
  ]) as BALRawNonceChange[]
}
