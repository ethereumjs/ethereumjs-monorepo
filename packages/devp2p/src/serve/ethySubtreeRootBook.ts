import { bytesToInt } from '@ethereumjs/util'

export type SubtreeRootEntry = { bucketIndex: number; subtreeRootHash: Uint8Array }

const MAX_ANCHOR_RING = 16

function validateEntries(entries: unknown): SubtreeRootEntry[] | undefined {
  if (!Array.isArray(entries) || entries.length === 0 || entries.length > 16) return undefined
  const out: SubtreeRootEntry[] = []
  let lastBucket = -1
  for (const row of entries) {
    if (!Array.isArray(row) || row.length < 2) return undefined
    const bucketRaw = row[0]
    const hash = row[1]
    if (!(bucketRaw instanceof Uint8Array) || !(hash instanceof Uint8Array)) return undefined
    const bucketIndex = bytesToInt(bucketRaw)
    if (bucketIndex < 0 || bucketIndex > 15 || bucketIndex <= lastBucket) return undefined
    lastBucket = bucketIndex
    if (hash.length !== 0 && hash.length !== 32) return undefined
    out.push({ bucketIndex, subtreeRootHash: hash.length === 32 ? hash : new Uint8Array(32) })
  }
  return out
}

/** Bounded ring of `(anchorBlock, bucket -> hash)` for `0x0d`/`0x0e`. */
export class EthySubtreeRootBook {
  private readonly _byAnchor = new Map<string, Map<number, Uint8Array>>()
  private readonly _anchorOrder: bigint[] = []

  ingest(anchorBlock: bigint, entries: unknown): boolean {
    const parsed = validateEntries(entries)
    if (parsed === undefined) return false
    const key = anchorBlock.toString()
    let map = this._byAnchor.get(key)
    if (map === undefined) {
      map = new Map()
      this._byAnchor.set(key, map)
      this._anchorOrder.push(anchorBlock)
      while (this._anchorOrder.length > MAX_ANCHOR_RING) {
        const old = this._anchorOrder.shift()
        if (old !== undefined) this._byAnchor.delete(old.toString())
      }
    }
    for (const e of parsed) {
      map.set(e.bucketIndex, e.subtreeRootHash)
    }
    return true
  }

  lookup(anchorBlock: bigint, bucketsBitmask: number): SubtreeRootEntry[] {
    const map = this._byAnchor.get(anchorBlock.toString())
    if (map === undefined) return []
    const out: SubtreeRootEntry[] = []
    for (let b = 0; b < 16; b++) {
      if (bucketsBitmask !== 0 && (bucketsBitmask & (1 << b)) === 0) continue
      const h = map.get(b)
      if (h !== undefined) out.push({ bucketIndex: b, subtreeRootHash: h })
    }
    return out
  }
}

export function parseSubtreeRootEntries(entries: unknown): SubtreeRootEntry[] | undefined {
  return validateEntries(entries)
}
