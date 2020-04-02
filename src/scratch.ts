import { DB, ENCODING_OPTS } from './db'

/**
 * An in-memory wrap over `DB` with an upstream DB
 * which will be queried when a key is not found
 * in the in-memory scratch. This class is used to implement
 * checkpointing functionality in CheckpointTrie.
 */
export class ScratchDB extends DB {
  private _upstream: DB

  constructor(upstreamDB: DB) {
    super()
    this._upstream = upstreamDB
  }

  /**
   * Similar to `DB.get`, but first searches in-memory
   * scratch DB, if key not found, searches upstream DB.
   */
  async get(key: Buffer): Promise<Buffer | null> {
    let value = null
    try {
      value = await this._leveldb.get(key, ENCODING_OPTS)
      if (!value && this._upstream._leveldb) {
        value = await this._upstream._leveldb.get(key)
      }
    } catch (error) {
      if (error.notFound) {
        console.log('not found')
        // throw error
      } else {
        throw error
      }
    }
    return value
  }

  copy(): ScratchDB {
    const scratch = new ScratchDB(this._upstream)
    scratch._leveldb = this._leveldb
    return scratch
  }
}
