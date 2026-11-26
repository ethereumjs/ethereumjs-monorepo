import { equalsBytes } from '@ethereumjs/util'

import { ownedPathKey, pathKeyHex } from './pathKey.ts'

export type AnchorId = string | bigint

type AnchorEntry = {
  id: AnchorId
  root: Uint8Array
  diff: Map<string, Uint8Array | null>
}

/** Reverse-diff anchor ring for historical proof reads. */
export class AnchorSnapshotRing {
  private readonly _max: number
  private readonly _anchors: AnchorEntry[] = []
  private readonly _activeDiffKeys = new Set<string>()

  constructor(maxAnchors: number) {
    this._max = maxAnchors
  }

  capture(anchorId: AnchorId, root: Uint8Array): void {
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

  noteOverwrite(pathKey: Uint8Array, previous: Uint8Array | null) {
    const hex = pathKeyHex(pathKey)
    for (const anchor of this._anchors) {
      if (anchor.diff.has(hex)) continue
      if (previous === null) {
        anchor.diff.set(hex, null)
      } else {
        const copy = new Uint8Array(previous.length)
        copy.set(previous)
        anchor.diff.set(hex, copy)
      }
    }
  }

  overlayGet(pathKey: Uint8Array, anchorId: AnchorId, live: Uint8Array | null): Uint8Array | null {
    const anchor = this._anchors.find((a) => a.id === anchorId)
    if (!anchor) return live
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
