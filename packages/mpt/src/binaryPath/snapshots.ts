import { pathKeyHex } from './pathKey.ts'

export type AnchorId = string | bigint

type AnchorEntry = {
  id: AnchorId
  root: Uint8Array
  diff: Map<string, Uint8Array | null>
}

/** Lock-free reverse-diff anchor ring for historical proof reads (`O(mutated paths)` memory). */
export class AnchorSnapshotRing {
  private readonly _max: number
  private readonly _anchors: AnchorEntry[] = []

  constructor(maxAnchors: number) {
    this._max = Math.max(0, maxAnchors)
  }

  hasActiveAnchors(): boolean {
    return this._anchors.length > 0
  }

  size(): number {
    return this._anchors.length
  }

  capture(anchorId: AnchorId, root: Uint8Array): void {
    if (this._max === 0) return
    const existingIdx = this._anchors.findIndex((a) => a.id === anchorId)
    if (existingIdx >= 0) {
      this._anchors.splice(existingIdx, 1)
    }
    const rootCopy = new Uint8Array(root.length)
    rootCopy.set(root)
    this._anchors.push({ id: anchorId, root: rootCopy, diff: new Map() })
    while (this._anchors.length > this._max) {
      this._anchors.shift()
    }
  }

  release(anchorId: AnchorId): void {
    const idx = this._anchors.findIndex((a) => a.id === anchorId)
    if (idx >= 0) {
      this._anchors.splice(idx, 1)
    }
  }

  /** Record the pre-mutation bytes at `pathKey` for every live anchor that has not yet captured it. */
  noteOverwrite(pathKey: Uint8Array, previous: Uint8Array | null): void {
    if (this._anchors.length === 0) return
    const hex = pathKeyHex(pathKey)
    let copied: Uint8Array | null | undefined
    for (const anchor of this._anchors) {
      if (anchor.diff.has(hex)) continue
      if (previous === null) {
        anchor.diff.set(hex, null)
      } else {
        if (copied === undefined) {
          copied = new Uint8Array(previous.length)
          copied.set(previous)
        }
        anchor.diff.set(hex, copied)
      }
    }
  }

  /** Read `pathKey` as of `anchorId` by overlaying the reverse-diff on top of `live`. */
  overlayGet(pathKey: Uint8Array, anchorId: AnchorId, live: Uint8Array | null): Uint8Array | null {
    const anchor = this._anchors.find((a) => a.id === anchorId)
    if (anchor === undefined) return live
    const hex = pathKeyHex(pathKey)
    if (anchor.diff.has(hex)) {
      return anchor.diff.get(hex) ?? null
    }
    return live
  }

  rootFor(anchorId: AnchorId): Uint8Array | undefined {
    return this._anchors.find((a) => a.id === anchorId)?.root
  }
}
