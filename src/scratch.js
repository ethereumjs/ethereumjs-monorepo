const DB = require('./db')
const { asyncFirstSeries } = require('./util/async')

const ENCODING_OPTS = { keyEncoding: 'binary', valueEncoding: 'binary' }

/**
 * An in-memory wrap over `DB` with an upstream DB
 * which will be queried when a key is not found
 * in the in-memory scratch. This class is used to implement
 * checkpointing functionality in CheckpointTrie.
 */
module.exports = class ScratchDB extends DB {
  constructor (upstreamDB) {
    super()
    this._upstream = upstreamDB
  }

  /**
   * Similar to `DB.get`, but first searches in-memory
   * scratch DB, if key not found, searches upstream DB.
   */
  get (key, cb) {
    const getDBs = this._upstream._leveldb ? [this._leveldb, this._upstream._leveldb] : [this._leveldb]
    const dbGet = (db, cb2) => {
      db.get(key, ENCODING_OPTS, (err, v) => {
        if (err || !v) {
          cb2(null, null)
        } else {
          cb2(null, v)
        }
      })
    }

    asyncFirstSeries(getDBs, dbGet, cb)
  }

  copy () {
    const scratch = new ScratchDB(this._upstream)
    scratch._leveldb = this._leveldb
    return scratch
  }
}
