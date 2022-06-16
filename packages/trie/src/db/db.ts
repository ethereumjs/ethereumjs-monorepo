// eslint-disable-next-line implicit-dependencies/no-implicit
import { AbstractLevel } from 'abstract-level'
import { MemoryLevel } from 'memory-level'
import { BatchDBOp, DB } from '../types'

export const ENCODING_OPTS = { keyEncoding: 'buffer', valueEncoding: 'buffer' }

/**
 * LevelDB is a thin wrapper around the underlying levelup db,
 * which validates inputs and sets encoding type.
 */
export class LevelDB implements DB {
  _leveldb: AbstractLevel<string | Buffer | Uint8Array, string | Buffer, string | Buffer>

  /**
   * Initialize a DB instance. If `leveldb` is not provided, DB
   * defaults to an [in-memory store](https://github.com/Level/memdown).
   * @param leveldb - An abstract-leveldown compliant store
   */
  constructor(
    leveldb?: AbstractLevel<string | Buffer | Uint8Array, string | Buffer, string | Buffer> | null
  ) {
    this._leveldb = leveldb ?? new MemoryLevel(ENCODING_OPTS)
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
    return value as Buffer
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
