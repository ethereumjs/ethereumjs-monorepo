import { bytesToUnprefixedHex, equalsBytes } from '@ethereumjs/util'

import type { ExternalLeafStore } from '@ethereumjs/mpt'

function compareKeysLex(a: Uint8Array, b: Uint8Array): number {
  const len = Math.min(a.length, b.length)
  for (let i = 0; i < len; i++) {
    if (a[i]! < b[i]!) return -1
    if (a[i]! > b[i]!) return 1
  }
  return a.length - b.length
}

/** Sorted in-memory slab with write overlay for live BAL updates (WP-16f). */
export class SlabOverlayLeafStore implements ExternalLeafStore {
  private readonly _base = new Map<string, Uint8Array>()
  private readonly _overlay = new Map<string, Uint8Array | null>()
  private readonly _sortedKeys: Uint8Array[] = []

  constructor(initial?: ReadonlyArray<{ key: Uint8Array; value: Uint8Array }>) {
    if (initial !== undefined) {
      const rows = initial.slice().sort((a, b) => compareKeysLex(a.key, b.key))
      for (const row of rows) {
        const hex = bytesToUnprefixedHex(row.key)
        this._base.set(hex, new Uint8Array(row.value))
        this._sortedKeys.push(new Uint8Array(row.key))
      }
    }
  }

  sealedSortedRows(): Array<{ key: Uint8Array; value: Uint8Array }> {
    const out: Array<{ key: Uint8Array; value: Uint8Array }> = []
    for (const key of this._sortedKeys) {
      const hex = bytesToUnprefixedHex(key)
      const ov = this._overlay.get(hex)
      if (ov === null) continue
      const val = ov ?? this._base.get(hex)
      if (val !== undefined) out.push({ key: new Uint8Array(key), value: new Uint8Array(val) })
    }
    for (const [hex, val] of this._overlay) {
      if (val === null || this._base.has(hex)) continue
      out.push({ key: hexTo32(hex), value: new Uint8Array(val) })
    }
    out.sort((a, b) => compareKeysLex(a.key, b.key))
    return out
  }

  async get(keyHash32: Uint8Array): Promise<Uint8Array | null | undefined> {
    const hex = bytesToUnprefixedHex(keyHash32)
    const ov = this._overlay.get(hex)
    if (ov === null) return null
    if (ov !== undefined) return ov
    return this._base.get(hex) ?? null
  }

  async put(keyHash32: Uint8Array, valueRlp: Uint8Array): Promise<void> {
    const hex = bytesToUnprefixedHex(keyHash32)
    this._overlay.set(hex, new Uint8Array(valueRlp))
  }

  async del(keyHash32: Uint8Array): Promise<void> {
    this._overlay.set(bytesToUnprefixedHex(keyHash32), null)
  }
}

function hexTo32(hex: string): Uint8Array {
  const out = new Uint8Array(32)
  const raw = hex.length % 2 === 0 ? hex : `0${hex}`
  for (let i = 0; i < 32; i++) {
    const off = i * 2
    if (off + 2 <= raw.length) out[i] = Number.parseInt(raw.slice(off, off + 2), 16)
  }
  return out
}

export function findLeafInSortedSlab(keys: readonly Uint8Array[], target: Uint8Array): number {
  let lo = 0
  let hi = keys.length - 1
  while (lo <= hi) {
    const mid = (lo + hi) >> 1
    const cmp = compareKeysLex(keys[mid]!, target)
    if (cmp === 0) return mid
    if (cmp < 0) lo = mid + 1
    else hi = mid - 1
  }
  return -1
}
