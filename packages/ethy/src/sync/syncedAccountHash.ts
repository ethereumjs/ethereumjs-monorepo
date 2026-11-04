import { ethyKeccak256 } from '../crypto/keccak.ts'
import { compareBytes32 } from '../spine/buckets.ts'
import type { SnapBucket } from '../spine/types.ts'

/** Whether `accountHash` is already covered by finished snap work (WP-04k). */
export function isAccountHashSynced(accountHash: Uint8Array, buckets: SnapBucket[]): boolean {
  const bucketIndex = accountHash[0]! >> 4
  const bucket = buckets[bucketIndex]
  if (bucket === undefined) return false
  if (bucket.status === 'done') return true
  const cursors = bucket.subRanges
  if (cursors === undefined || cursors.length === 0) return false
  for (const cursor of cursors) {
    if (cursorCoversHashInCursor(cursor, accountHash)) return false
  }
  return true
}

function cursorCoversHashInCursor(
  cursor: { origin: Uint8Array; limit: Uint8Array },
  accountHash: Uint8Array,
): boolean {
  return (
    compareBytes32(accountHash, cursor.origin) >= 0 &&
    compareBytes32(accountHash, cursor.limit) <= 0
  )
}

export function accountHashFromAddress(addressHex: string): Uint8Array {
  const body = addressHex.startsWith('0x') ? addressHex.slice(2) : addressHex
  const bytes = new Uint8Array(20)
  for (let i = 0; i < 20; i++) {
    bytes[i] = parseInt(body.slice(i * 2, i * 2 + 2), 16)
  }
  return ethyKeccak256(bytes)
}
