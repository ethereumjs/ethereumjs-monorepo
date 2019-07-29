import { DB, ENCODING_OPTS } from './db'
import { asyncFirstSeries } from './util/async'

/**
 * An in-memory wrap over `DB` with an upstream DB
 * which will be queried when a key is not found
 * in the in-memory scratch. This class is used to implement
 * checkpointing functionality in CheckpointTrie.
 */
export class ScratchDB extends DB {
  private _upstream: DB

  constructor (upstreamDB: DB) {
    super()
    this._upstream = upstreamDB
  }

  /**
   * Similar to `DB.get`, but first searches in-memory
   * scratch DB, if key not found, searches upstream DB.
   */
  get (key: Buffer, cb: Function) {
    const getDBs = this._upstream._leveldb ? [this._leveldb, this._upstream._leveldb] : [this._leveldb]
    const dbGet = (db: any, cb2: Function) => {
      db.get(key, ENCODING_OPTS, (err: Error, v: Buffer | null) => {
        if (err || !v) {
          cb2(null, null)
        } else {
          cb2(null, v)
        }
      })
    }

    asyncFirstSeries(getDBs, dbGet, cb)
  }

  copy (): ScratchDB {
    const scratch = new ScratchDB(this._upstream)
    scratch._leveldb = this._leveldb
    return scratch
  }
}
