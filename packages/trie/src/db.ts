// eslint-disable-next-line implicit-dependencies/no-implicit
import type { LevelUp } from 'levelup'
const level = require('level-mem')

export const ENCODING_OPTS = { keyEncoding: 'binary', valueEncoding: 'binary' }

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

export interface DB {
  /**
   * Retrieves a raw value from leveldb.
   * @param key
   * @returns A Promise that resolves to `Buffer` if a value is found or `null` if no value is found.
   */
  get(key: Buffer): Promise<Buffer | null>

  /**
   * Writes a value directly to leveldb.
   * @param key The key as a `Buffer`
   * @param value The value to be stored
   */
  put(key: Buffer, val: Buffer): Promise<void>

  /**
   * Removes a raw value in the underlying leveldb.
   * @param keys
   */
  del(key: Buffer): Promise<void>

  /**
   * Performs a batch operation on db.
   * @param opStack A stack of levelup operations
   */
  batch(opStack: BatchDBOp[]): Promise<void>

  /**
   * Returns a copy of the DB instance, with a reference
   * to the **same** underlying leveldb instance.
   */
  copy(): DB
}

/**
 * LevelDB is a thin wrapper around the underlying levelup db,
 * which validates inputs and sets encoding type.
 */
export class LevelDB implements DB {
  _leveldb: LevelUp

  /**
   * Initialize a DB instance. If `leveldb` is not provided, DB
   * defaults to an [in-memory store](https://github.com/Level/memdown).
   * @param leveldb - An abstract-leveldown compliant store
   */
  constructor(leveldb?: LevelUp | null) {
    this._leveldb = leveldb ?? level()
  }

  /**
   * @inheritdoc
   */
  async get(key: Buffer): Promise<Buffer | null> {
    let value = null
    try {
      value = await this._leveldb.get(key, ENCODING_OPTS)
    } catch (error: any) {
      if (error.notFound) {
        // not found, returning null
      } else {
        throw error
      }
    }
    return value
  }

  /**
   * @inheritdoc
   */
  async put(key: Buffer, val: Buffer): Promise<void> {
    await this._leveldb.put(key, val, ENCODING_OPTS)
  }

  /**
   * @inheritdoc
   */
  async del(key: Buffer): Promise<void> {
    await this._leveldb.del(key, ENCODING_OPTS)
  }

  /**
   * @inheritdoc
   */
  async batch(opStack: BatchDBOp[]): Promise<void> {
    await this._leveldb.batch(opStack, ENCODING_OPTS)
  }

  /**
   * @inheritdoc
   */
  copy(): DB {
    return new LevelDB(this._leveldb)
  }
}

export class MemoryDB implements DB {
  _database: Map<string, Buffer>

  constructor(database?: Map<string, Buffer> | null) {
    this._database = database ?? new Map()
  }

  /**
   * @inheritdoc
   */
  async get(key: Buffer): Promise<Buffer | null> {
    const value = this._database.get(key.toString('binary'))

    if (value === undefined) {
      return null
    }

    return value
  }

  /**
   * @inheritdoc
   */
  async put(key: Buffer, val: Buffer): Promise<void> {
    this._database.set(key.toString('binary'), val)
  }

  /**
   * @inheritdoc
   */
  async del(key: Buffer): Promise<void> {
    this._database.delete(key.toString('binary'))
  }

  /**
   * @inheritdoc
   */
  async batch(opStack: BatchDBOp[]): Promise<void> {
    for (const op of opStack) {
      if (op.type === 'del') {
        await this.del(op.key)
      } else if (op.type === 'put') {
        await this.put(op.key, op.value)
      }
    }
  }

  /**
   * @inheritdoc
   */
  copy(): DB {
    return new MemoryDB(this._database)
  }
}
