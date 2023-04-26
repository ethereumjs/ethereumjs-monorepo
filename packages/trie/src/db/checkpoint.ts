import { bytesToHex, hexStringToBytes } from '@ethereumjs/util'

import type { BatchDBOp, Checkpoint, CheckpointDBOpts, DB } from '../types'
import type LRUCache from 'lru-cache'

const LRU = require('lru-cache')

/**
 * DB is a thin wrapper around the underlying levelup db,
 * which validates inputs and sets encoding type.
 */
export class CheckpointDB implements DB {
  public checkpoints: Checkpoint[]
  public db: DB
  public readonly cacheSize: number

  protected _cache?: LRUCache<string, Uint8Array | null>

  _stats = {
    cache: {
      reads: 0,
      hits: 0,
      writes: 0,
    },
    db: {
      reads: 0,
      hits: 0,
      writes: 0,
    },
  }

  /**
   * Initialize a DB instance.
   */
  constructor(opts: CheckpointDBOpts) {
    this.db = opts.db
    this.cacheSize = opts.cacheSize ?? 0
    // Roots of trie at the moment of checkpoint
    this.checkpoints = []

    if (this.cacheSize > 0) {
      this._cache = new LRU({
        max: this.cacheSize,
        updateAgeOnGet: true,
      })
    }
  }

  /**
   * Flush the checkpoints and use the given checkpoints instead.
   * @param {Checkpoint[]} checkpoints
   */
  setCheckpoints(checkpoints: Checkpoint[]) {
    this.checkpoints = []

    for (let i = 0; i < checkpoints.length; i++) {
      this.checkpoints.push({
        root: checkpoints[i].root,
        keyValueMap: new Map(checkpoints[i].keyValueMap),
      })
    }
  }

  /**
   * Is the DB during a checkpoint phase?
   */
  hasCheckpoints() {
    return this.checkpoints.length > 0
  }

  /**
   * Adds a new checkpoint to the stack
   * @param root
   */
  checkpoint(root: Uint8Array) {
    this.checkpoints.push({ keyValueMap: new Map<string, Uint8Array>(), root })
  }

  /**
   * Commits the latest checkpoint
   */
  async commit() {
    const { keyValueMap } = this.checkpoints.pop()!
    if (!this.hasCheckpoints()) {
      // This was the final checkpoint, we should now commit and flush everything to disk
      const batchOp: BatchDBOp[] = []
      for (const [key, value] of keyValueMap.entries()) {
        if (value === null) {
          batchOp.push({
            type: 'del',
            key: hexStringToBytes(key),
          })
        } else {
          batchOp.push({
            type: 'put',
            key: hexStringToBytes(key),
            value,
          })
        }
      }
      await this.batch(batchOp)
    } else {
      // dump everything into the current (higher level) diff cache
      const currentKeyValueMap = this.checkpoints[this.checkpoints.length - 1].keyValueMap
      for (const [key, value] of keyValueMap.entries()) {
        currentKeyValueMap.set(key, value)
      }
    }
  }

  /**
   * Reverts the latest checkpoint
   */
  async revert() {
    const { root } = this.checkpoints.pop()!
    return root
  }

  /**
   * @inheritDoc
   */
  async get(key: Uint8Array): Promise<Uint8Array | null> {
    const keyHex = bytesToHex(key)
    if (this._cache !== undefined) {
      const value = this._cache.get(keyHex)
      this._stats.cache.reads += 1
      if (value !== undefined) {
        this._stats.cache.hits += 1
        return value
      }
    }

    // Lookup the value in our diff cache. We return the latest checkpointed value (which should be the value on disk)
    for (let index = this.checkpoints.length - 1; index >= 0; index--) {
      const value = this.checkpoints[index].keyValueMap.get(bytesToHex(key))
      if (value !== undefined) {
        return value
      }
    }
    // Nothing has been found in diff cache, look up from disk
    const value = await this.db.get(key)
    this._stats.db.reads += 1
    if (value !== null) {
      this._stats.db.hits += 1
    }
    this._cache?.set(keyHex, value)
    if (this.hasCheckpoints()) {
      // Since we are a checkpoint, put this value in diff cache,
      // so future `get` calls will not look the key up again from disk.
      this.checkpoints[this.checkpoints.length - 1].keyValueMap.set(bytesToHex(key), value)
    }

    return value
  }

  /**
   * @inheritDoc
   */
  async put(key: Uint8Array, value: Uint8Array): Promise<void> {
    const keyHex = bytesToHex(key)
    if (this._cache !== undefined) {
      this._cache.set(keyHex, value)
      this._stats.cache.writes += 1
    }
    if (this.hasCheckpoints()) {
      // put value in diff cache
      this.checkpoints[this.checkpoints.length - 1].keyValueMap.set(bytesToHex(key), value)
    } else {
      await this.db.put(key, value)
      this._stats.db.writes += 1
    }
  }

  /**
   * @inheritDoc
   */
  async del(key: Uint8Array): Promise<void> {
    const keyHex = bytesToHex(key)
    if (this._cache !== undefined) {
      this._cache.set(keyHex, null)
      this._stats.cache.writes += 1
    }
    if (this.hasCheckpoints()) {
      // delete the value in the current diff cache
      this.checkpoints[this.checkpoints.length - 1].keyValueMap.set(bytesToHex(key), null)
    } else {
      // delete the value on disk
      await this.db.del(key)
    }
  }

  /**
   * @inheritDoc
   */
  async batch(opStack: BatchDBOp[]): Promise<void> {
    if (this.hasCheckpoints()) {
      for (const op of opStack) {
        if (op.type === 'put') {
          await this.put(op.key, op.value)
        } else if (op.type === 'del') {
          await this.del(op.key)
        }
      }
    } else {
      await this.db.batch(opStack)
    }
  }

  stats(reset = true) {
    const stats = { ...this._stats, size: this._cache?.length ?? 0 }
    if (reset) {
      this._stats = {
        cache: {
          reads: 0,
          hits: 0,
          writes: 0,
        },
        db: {
          reads: 0,
          hits: 0,
          writes: 0,
        },
      }
    }
    return stats
  }

  /**
   * @inheritDoc
   */
  copy(): CheckpointDB {
    return new CheckpointDB({ db: this.db, cacheSize: this.cacheSize })
  }
}
