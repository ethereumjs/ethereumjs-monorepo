import { pathKeyHex } from './pathKey.ts'

import type { BinaryPathBatchOp, BinaryPathNodeStore } from './types.ts'

/** In-memory path store with 256-way sharding on `pathKey[1]`. */
export class InMemoryBinaryPathStore implements BinaryPathNodeStore {
  private readonly _shards: Map<string, Uint8Array>[]

  constructor() {
    this._shards = Array.from({ length: 256 }, () => new Map())
  }

  private _shard(pathKey: Uint8Array): Map<string, Uint8Array> {
    return this._shards[pathKey[1] ?? 0]!
  }

  async getNode(pathKey: Uint8Array): Promise<Uint8Array | null> {
    const hit = this._shard(pathKey).get(pathKeyHex(pathKey))
    return hit ?? null
  }

  async putNode(pathKey: Uint8Array, bytes: Uint8Array): Promise<void> {
    const owned = new Uint8Array(bytes.length)
    owned.set(bytes)
    this._shard(pathKey).set(pathKeyHex(pathKey), owned)
  }

  async deleteNode(pathKey: Uint8Array): Promise<void> {
    this._shard(pathKey).delete(pathKeyHex(pathKey))
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
