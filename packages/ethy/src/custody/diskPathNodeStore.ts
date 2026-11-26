import * as fs from 'node:fs/promises'
import * as path from 'node:path'

import type { BinaryPathBatchOp, BinaryPathNodeStore } from '@ethereumjs/mpt'
import { bytesToUnprefixedHex } from '@ethereumjs/util'

const DEFAULT_CACHE = 4096

/** Disk-backed `BinaryPathNodeStore` with O(1) bounded LRU hot cache (WP-16f). */
export class DiskPathNodeStore implements BinaryPathNodeStore {
  private readonly _rootDir: string
  private readonly _cache = new Map<string, Uint8Array>()
  private readonly _createdDirs = new Set<string>()
  private readonly _maxCache: number

  constructor(rootDir: string, maxCache = DEFAULT_CACHE) {
    this._rootDir = rootDir
    this._maxCache = Math.max(1, maxCache)
  }

  private _filePath(pathKey: Uint8Array): string {
    const shard = (pathKey[1] ?? 0).toString(16).padStart(2, '0')
    const hex = bytesToUnprefixedHex(pathKey)
    return path.join(this._rootDir, shard, `${hex}.bin`)
  }

  private _remember(hex: string, bytes: Uint8Array): void {
    const owned = new Uint8Array(bytes.length)
    owned.set(bytes)
    this._cache.delete(hex)
    this._cache.set(hex, owned)
    while (this._cache.size > this._maxCache) {
      const oldest = this._cache.keys().next().value
      if (oldest === undefined) break
      this._cache.delete(oldest)
    }
  }

  async getNode(pathKey: Uint8Array): Promise<Uint8Array | null> {
    const hex = bytesToUnprefixedHex(pathKey)
    const hit = this._cache.get(hex)
    if (hit !== undefined) {
      // Refresh LRU recency in O(1)
      this._cache.delete(hex)
      this._cache.set(hex, hit)
      return new Uint8Array(hit)
    }
    try {
      const raw = await fs.readFile(this._filePath(pathKey))
      this._remember(hex, raw)
      return new Uint8Array(raw)
    } catch {
      return null
    }
  }

  async putNode(pathKey: Uint8Array, bytes: Uint8Array): Promise<void> {
    const file = this._filePath(pathKey)
    const dir = path.dirname(file)
    if (!this._createdDirs.has(dir)) {
      await fs.mkdir(dir, { recursive: true })
      this._createdDirs.add(dir)
    }
    await fs.writeFile(file, bytes)
    this._remember(bytesToUnprefixedHex(pathKey), bytes)
  }

  async deleteNode(pathKey: Uint8Array): Promise<void> {
    const hex = bytesToUnprefixedHex(pathKey)
    this._cache.delete(hex)
    try {
      await fs.unlink(this._filePath(pathKey))
    } catch {
      /* already absent */
    }
  }

  async applyBatch(ops: BinaryPathBatchOp[]): Promise<void> {
    for (const op of ops) {
      if (op.type === 'put') {
        await this.putNode(op.pathKey, op.bytes)
      } else {
        await this.deleteNode(op.pathKey)
      }
    }
  }
}
