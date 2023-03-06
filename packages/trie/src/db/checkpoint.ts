import { bytesToHex, hexStringToBytes } from '@ethereumjs/util'

import type { BatchDBOp, Checkpoint, DB } from '../types'

/**
 * DB is a thin wrapper around the underlying levelup db,
 * which validates inputs and sets encoding type.
 */
export class CheckpointDB implements DB {
  public checkpoints: Checkpoint[]
  public db: DB

  /**
   * Initialize a DB instance.
   */
  constructor(db: DB) {
    this.db = db
    // Roots of trie at the moment of checkpoint
    this.checkpoints = []
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
      // dump everything into the current (higher level) cache
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
    // Lookup the value in our cache. We return the latest checkpointed value (which should be the value on disk)
    for (let index = this.checkpoints.length - 1; index >= 0; index--) {
      const value = this.checkpoints[index].keyValueMap.get(bytesToHex(key))
      if (value !== undefined) {
        return value
      }
    }
    // Nothing has been found in cache, look up from disk

    const value = await this.db.get(key)
    if (this.hasCheckpoints()) {
      // Since we are a checkpoint, put this value in cache, so future `get` calls will not look the key up again from disk.
      this.checkpoints[this.checkpoints.length - 1].keyValueMap.set(bytesToHex(key), value)
    }

    return value
  }

  /**
   * @inheritDoc
   */
  async put(key: Uint8Array, val: Uint8Array): Promise<void> {
    if (this.hasCheckpoints()) {
      // put value in cache
      this.checkpoints[this.checkpoints.length - 1].keyValueMap.set(bytesToHex(key), val)
    } else {
      await this.db.put(key, val)
    }
  }

  /**
   * @inheritDoc
   */
  async del(key: Uint8Array): Promise<void> {
    if (this.hasCheckpoints()) {
      // delete the value in the current cache
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

  /**
   * @inheritDoc
   */
  copy(): CheckpointDB {
    return new CheckpointDB(this.db)
  }
}
