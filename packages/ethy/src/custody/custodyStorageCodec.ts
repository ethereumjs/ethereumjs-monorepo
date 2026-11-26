import { equalsBytes } from '@ethereumjs/util'

/** 64-byte ETHY/0 storage slab row: `slotHash || value`. */
export const STORAGE_SLAB_STRIDE = 64

export function findSlotInKind1Slab(
  slab: Uint8Array,
  slotHash: Uint8Array,
): Uint8Array | undefined {
  for (let off = 0; off + STORAGE_SLAB_STRIDE <= slab.length; off += STORAGE_SLAB_STRIDE) {
    if (equalsBytes(slab.subarray(off, off + 32), slotHash)) {
      return slab.subarray(off + 32, off + STORAGE_SLAB_STRIDE)
    }
  }
  return undefined
}

export function parseProvenCodePairs(
  decoded: unknown[],
): Array<[codeHash: Uint8Array, code: Uint8Array]> {
  if (Number(decoded[1]) !== 0) return []
  const pairs = decoded[2]
  if (!Array.isArray(pairs)) return []
  const out: Array<[Uint8Array, Uint8Array]> = []
  for (const row of pairs) {
    if (!Array.isArray(row) || row.length < 2) continue
    const h = row[0]
    const c = row[1]
    if (h instanceof Uint8Array && c instanceof Uint8Array) {
      out.push([h, c])
    }
  }
  return out
}
