import {
  KeyEncoding,
  ValueEncoding,
  bytesToUnprefixedHex,
  unprefixedHexToBytes,
} from '@ethereumjs/util'
import { LRUCache } from 'lru-cache'

import type { Checkpoint, CheckpointDBOpts } from '../types.js'
import type { BatchDBOp, DB, EncodingOpts } from '@ethereumjs/util'

/**
 * DB is a thin wrapper around the underlying levelup db,
 * which validates inputs and sets encoding type.
 */
export class CheckpointDB implements DB {
  public checkpoints: Checkpoint[]
  public db: DB<string, string | Uint8Array>
  public readonly cacheSize: number
  private readonly valueEncoding: ValueEncoding

  // Starting with lru-cache v8 undefined and null are not allowed any more
  // as cache values. At the same time our design works well, since undefined
  // indicates for us that we know that the value is not present in the
  // underlying trie database as well (so it carries real value).
  //
  // Solution here seems therefore adequate, other solutions would rather
  // be some not so clean workaround.
  //
  // (note that @ts-ignore doesn't work since stripped on declaration (.d.ts) files)
  protected _cache?: LRUCache<string, Uint8Array>
  // protected _cache?: LRUCache<string, Uint8Array | undefined>

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
    this.valueEncoding = opts.valueEncoding ?? ValueEncoding.String
    // Roots of trie at the moment of checkpoint
    this.checkpoints = []

    if (this.cacheSize > 0) {
      this._cache = new LRUCache({
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
        if (value === undefined) {
          batchOp.push({
            type: 'del',
            key: unprefixedHexToBytes(key),
          })
        } else {
          batchOp.push({
            type: 'put',
            key: unprefixedHexToBytes(key),
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
  async get(key: Uint8Array): Promise<Uint8Array | undefined> {
    const keyHex = bytesToUnprefixedHex(key)
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
      if (this.checkpoints[index].keyValueMap.has(keyHex)) {
        return this.checkpoints[index].keyValueMap.get(keyHex)
      }
    }
    // Nothing has been found in diff cache, look up from disk
    const value = await this.db.get(keyHex, {
      keyEncoding: KeyEncoding.String,
      valueEncoding: this.valueEncoding,
    })
    this._stats.db.reads += 1
    if (value !== undefined) {
      this._stats.db.hits += 1
    }
    const returnValue =
      value !== undefined
        ? value instanceof Uint8Array
          ? value
          : unprefixedHexToBytes(<string>value)
        : undefined
    this._cache?.set(keyHex, returnValue)
    if (this.hasCheckpoints()) {
      // Since we are a checkpoint, put this value in diff cache,
      // so future `get` calls will not look the key up again from disk.
      this.checkpoints[this.checkpoints.length - 1].keyValueMap.set(keyHex, returnValue)
    }

    return returnValue
  }

  /**
   * @inheritDoc
   */
  async put(key: Uint8Array, value: Uint8Array): Promise<void> {
    const keyHex = bytesToUnprefixedHex(key)
    if (this.hasCheckpoints()) {
      // put value in diff cache
      this.checkpoints[this.checkpoints.length - 1].keyValueMap.set(keyHex, value)
    } else {
      const valuePut =
        this.valueEncoding === ValueEncoding.Bytes ? value : bytesToUnprefixedHex(value)
      await this.db.put(keyHex, <any>valuePut, {
        keyEncoding: KeyEncoding.String,
        valueEncoding: this.valueEncoding,
      })
      this._stats.db.writes += 1

      if (this._cache !== undefined) {
        this._cache.set(keyHex, value)
        this._stats.cache.writes += 1
      }
    }
  }

  /**
   * @inheritDoc
   */
  async del(key: Uint8Array): Promise<void> {
    const keyHex = bytesToUnprefixedHex(key)
    if (this.hasCheckpoints()) {
      // delete the value in the current diff cache
      this.checkpoints[this.checkpoints.length - 1].keyValueMap.set(keyHex, undefined)
    } else {
      // delete the value on disk
      await this.db.del(keyHex, {
        keyEncoding: KeyEncoding.String,
      })
      this._stats.db.writes += 1

      if (this._cache !== undefined) {
        this._cache.set(keyHex, undefined)
        this._stats.cache.writes += 1
      }
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
      const convertedOps = opStack.map((op) => {
        const convertedOp: {
          key: string
          value: Uint8Array | string | undefined
          type: 'put' | 'del'
          opts?: EncodingOpts
        } = {
          key: bytesToUnprefixedHex(op.key),
          value: op.type === 'put' ? op.value : undefined,
          type: op.type,
          opts: { ...op.opts, ...{ valueEncoding: this.valueEncoding } },
        }
        this._stats.db.writes += 1
        if (op.type === 'put' && this.valueEncoding === ValueEncoding.String) {
          convertedOp.value = bytesToUnprefixedHex(<Uint8Array>convertedOp.value)
        }
        return convertedOp
      })
      await this.db.batch(<any>convertedOps)
    }
  }

  stats(reset = true) {
    const stats = { ...this._stats, size: this._cache?.size ?? 0 }
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
  shallowCopy(): CheckpointDB {
    return new CheckpointDB({
      db: this.db,
      cacheSize: this.cacheSize,
      valueEncoding: this.valueEncoding,
    })
  }

  open() {
    return Promise.resolve()
  }
}
