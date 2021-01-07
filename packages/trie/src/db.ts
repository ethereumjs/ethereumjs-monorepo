import { LevelUp } from 'levelup'
const level = require('level-mem')

export const ENCODING_OPTS = { keyEncoding: 'binary', valueEncoding: 'binary' }

export type Checkpoint = {
  root: Buffer
  revertOps: BatchDBOp[]
}

export type BatchDBOp = PutBatch | DelBatch
export interface PutBatch {
  type: 'put'
  key: Buffer
  value: Buffer
}
export interface DelBatch {
  type: 'del'
  key: Buffer
}

/**
 * DB is a thin wrapper around the underlying levelup db,
 * which validates inputs and sets encoding type.
 */
export class DB {
  public checkpoints: Checkpoint[]

  _leveldb: LevelUp

  /**
   * Initialize a DB instance. If `leveldb` is not provided, DB
   * defaults to an [in-memory store](https://github.com/Level/memdown).
   * @param leveldb - An abstract-leveldown compliant store
   */
  constructor(leveldb?: LevelUp) {
    // Roots of trie at the moment of checkpoint
    this.checkpoints = []

    this._leveldb = leveldb || level()
  }

  /**
   * Is the DB during a checkpoint phase?
   */
  get isCheckpoint() {
    return this.checkpoints.length > 0
  }

  /**
   * Adds a new checkpoint to the stack
   * @param root
   */
  checkpoint(root: Buffer) {
    this.checkpoints.push({ root, revertOps: [] })
  }

  /**
   * Commits the latest checkpoint
   */
  commit() {
    const { root, revertOps } = this.checkpoints.pop()!
    // On nested checkpoints put the revertOps on the parent
    // stack in case there is a revert
    if (this.isCheckpoint) {
      this.checkpoints[this.checkpoints.length - 1].revertOps.concat(revertOps)
    }
    return root
  }

  /**
   * Reverts the latest checkpoint
   */
  async revert() {
    const { root, revertOps } = this.checkpoints.pop()!
    await this.batch(revertOps.reverse())
    return root
  }

  private addCPRevertOperation(op: BatchDBOp) {
    this.checkpoints[this.checkpoints.length - 1].revertOps.push(op)
  }

  /**
   * Retrieves a raw value from leveldb.
   * @param key
   * @returns A Promise that resolves to `Buffer` if a value is found or `null` if no value is found.
   */
  async get(key: Buffer): Promise<Buffer | null> {
    let value = null
    try {
      value = await this._leveldb.get(key, ENCODING_OPTS)
    } catch (error) {
      if (error.notFound) {
        // not found, returning null
      } else {
        throw error
      }
    }
    return value
  }

  /**
   * Writes a value directly to leveldb.
   * @param key The key as a `Buffer`
   * @param value The value to be stored
   */
  async put(key: Buffer, val: Buffer): Promise<void> {
    const revertOps: BatchDBOp[] = []
    // In CP mode check for an old value to be put
    // on the revert ops stack
    if (this.isCheckpoint) {
      const oldValue = await this.get(key)
      if (oldValue !== null) {
        revertOps.push({
          type: 'put',
          key: key,
          value: oldValue,
        })
      }
    }
    await this._leveldb.put(key, val, ENCODING_OPTS)
    // In CP mode add del to the revert ops stack
    if (this.isCheckpoint) {
      revertOps.push({
        type: 'del',
        key: key,
      })
      for (const revertOp of revertOps) {
        this.addCPRevertOperation(revertOp)
      }
    }
  }

  /**
   * Removes a raw value in the underlying leveldb.
   * @param keys
   */
  async del(key: Buffer): Promise<void> {
    const revertOps: BatchDBOp[] = []
    // In CP mode check for an old value to be put
    // on the revert ops stack
    if (this.isCheckpoint) {
      const oldValue = await this.get(key)
      if (oldValue !== null) {
        revertOps.push({
          type: 'put',
          key: key,
          value: oldValue,
        })
      }
    }
    await this._leveldb.del(key, ENCODING_OPTS)
    if (this.isCheckpoint) {
      for (const revertOp of revertOps) {
        this.addCPRevertOperation(revertOp)
      }
    }
  }

  /**
   * Performs a batch operation on db.
   * @param opStack A stack of levelup operations
   */
  async batch(opStack: BatchDBOp[]): Promise<void> {
    if (this.isCheckpoint) {
      for (const op of opStack) {
        if (op.type === 'put') {
          await this.put(op.key, op.value)
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        } else if (op.type === 'del') {
          await this.del(op.key)
        }
      }
    } else {
      await this._leveldb.batch(opStack, ENCODING_OPTS)
    }
  }

  /**
   * Returns a copy of the DB instance, with a reference
   * to the **same** underlying leveldb instance.
   */
  copy(): DB {
    return new DB(this._leveldb)
  }
}
