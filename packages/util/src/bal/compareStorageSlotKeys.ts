import { hexToBytes } from '../bytes.ts'
import type { PrefixedHexString } from '../types.ts'

/**
 * Lexicographic compare for BAL storage keys by numeric value (uint256).
 *
 * Keys may appear in minimal big-endian form (leading zeros stripped for JSON/RLP
 * scalars). Compare as 32-byte big-endian integers so ordering matches go-ethereum's
 * fixed-length `common.Hash` lex order.
 */
export function compareStorageSlotKeys(
  a: PrefixedHexString | Uint8Array,
  b: PrefixedHexString | Uint8Array,
): number {
  const aBytes = a instanceof Uint8Array ? a : hexToBytes(a)
  const bBytes = b instanceof Uint8Array ? b : hexToBytes(b)
  const paddedA = new Uint8Array(32)
  const paddedB = new Uint8Array(32)
  paddedA.set(aBytes, 32 - aBytes.length)
  paddedB.set(bBytes, 32 - bBytes.length)
  for (let i = 0; i < 32; i++) {
    if (paddedA[i] < paddedB[i]) return -1
    if (paddedA[i] > paddedB[i]) return 1
  }
  return 0
}
