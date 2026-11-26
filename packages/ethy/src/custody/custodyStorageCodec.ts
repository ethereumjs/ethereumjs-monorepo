import { bytesToBigInt, equalsBytes } from '@ethereumjs/util'
import { keccak_256 } from '@noble/hashes/sha3.js'

/** 64-byte ETHY/0 storage slab row: `slotHash || value`. */
export const STORAGE_SLAB_STRIDE = 64

export function ethyWireKind(field: unknown): number {
  if (typeof field === 'number') return field
  if (field instanceof Uint8Array) {
    if (field.length === 0) return 0
    try {
      return Number(bytesToBigInt(field))
    } catch {
      return field[0] ?? 0
    }
  }
  return 0
}

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
  if (ethyWireKind(decoded[1]) !== 0) return []
  const pairs = decoded[2]
  if (!Array.isArray(pairs)) return []
  const out: Array<[Uint8Array, Uint8Array]> = []
  for (const row of pairs) {
    if (row instanceof Uint8Array && row.length > 0) {
      out.push([keccak_256(row), row])
      continue
    }
    if (!Array.isArray(row) || row.length < 2) continue
    const h = row[0]
    const c = row[1]
    if (h instanceof Uint8Array && c instanceof Uint8Array) {
      out.push([h, c])
    }
  }
  return out
}

export type Kind2StorageEntry = {
  accountHash: Uint8Array
  storageRoot: Uint8Array
  slotsSlab64B: Uint8Array
}

export function parseProvenStorageKind2Entries(decoded: unknown[]): Kind2StorageEntry[] {
  if (ethyWireKind(decoded[1]) !== 2) return []
  const rows = decoded[2]
  if (!Array.isArray(rows)) return []
  const out: Kind2StorageEntry[] = []
  for (const row of rows) {
    if (!Array.isArray(row) || row.length < 3) continue
    const accountHash = row[0]
    const storageRoot = row[1]
    const slab = row[2]
    if (
      accountHash instanceof Uint8Array &&
      accountHash.length === 32 &&
      storageRoot instanceof Uint8Array &&
      storageRoot.length === 32 &&
      slab instanceof Uint8Array
    ) {
      out.push({ accountHash, storageRoot, slotsSlab64B: slab })
    }
  }
  return out
}

export function storageSlotsFromKindSlab(
  slab: Uint8Array,
): Array<{ slotHash: Uint8Array; value: Uint8Array }> {
  const out: Array<{ slotHash: Uint8Array; value: Uint8Array }> = []
  for (let off = 0; off + STORAGE_SLAB_STRIDE <= slab.length; off += STORAGE_SLAB_STRIDE) {
    out.push({
      slotHash: slab.subarray(off, off + 32),
      value: new Uint8Array(slab.subarray(off + 32, off + STORAGE_SLAB_STRIDE)),
    })
  }
  return out
}
