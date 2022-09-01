import { MemoryLevel } from 'memory-level'

import type { BatchDBOp, DB } from '@ethereumjs/trie'
import type { AbstractLevel } from 'abstract-level'

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
    leveldb?: AbstractLevel<string | Buffer | Uint8Array, string | Buffer, string | Buffer>
  ) {
    this._leveldb = leveldb ?? new MemoryLevel(ENCODING_OPTS)
  }

  /**
   * @inheritDoc
   */
  async get(key: Buffer): Promise<Buffer | null> {
    let value = null
    try {
      value = await this._leveldb.get(key, ENCODING_OPTS)
    } catch (error: any) {
      // https://github.com/Level/abstract-level/blob/915ad1317694d0ce8c580b5ab85d81e1e78a3137/abstract-level.js#L309
      // This should be `true` if the error came from LevelDB
      // so we can check for `NOT true` to identify any non-404 errors
      if (error.notFound !== true) {
        throw error
      }
    }
    return value as Buffer | null
  }

  /**
   * @inheritDoc
   */
  async put(key: Buffer, val: Buffer): Promise<void> {
    await this._leveldb.put(key, val, ENCODING_OPTS)
  }

  /**
   * @inheritDoc
   */
  async del(key: Buffer): Promise<void> {
    await this._leveldb.del(key, ENCODING_OPTS)
  }

  /**
   * @inheritDoc
   */
  async batch(opStack: BatchDBOp[]): Promise<void> {
    await this._leveldb.batch(opStack, ENCODING_OPTS)
  }

  /**
   * @inheritDoc
   */
  copy(): DB {
    return new LevelDB(this._leveldb)
  }
}
