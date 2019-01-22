const level = require('level-mem')

const ENCODING_OPTS = { keyEncoding: 'binary', valueEncoding: 'binary' }

/**
 * DB is a thin wrapper around the underlying levelup db,
 * which validates inputs and sets encoding type.
 */
module.exports = class DB {
  /**
   * Initialize a DB instance. If `leveldb` is not provided, DB
   * defaults to an [in-memory store](https://github.com/Level/memdown).
   * @param {Object} [leveldb] - An abstract-leveldown compliant store
   */
  constructor (leveldb) {
    this._leveldb = leveldb || level()
  }

  /**
   * Retrieves a raw value from leveldb.
   * @param {Buffer} key
   * @param {Function} cb A callback `Function`, which is given the arguments
   * `err` - for errors that may have occured
   * and `value` - the found value in a `Buffer` or if no value was found `null`.
   */
  get (key, cb) {
    if (!Buffer.isBuffer(key)) throw new Error('Invalid input: expected buffer')

    this._leveldb.get(key, ENCODING_OPTS, (err, v) => {
      if (err || !v) {
        cb(null, null)
      } else {
        cb(null, v)
      }
    })
  }

  /**
   * Writes a value directly to leveldb.
   * @param {Buffer} key The key as a `Buffer` or `String`
   * @param {Buffer} value The value to be stored
   * @param {Function} cb A callback `Function`, which is given the argument
   * `err` - for errors that may have occured
   */
  put (key, val, cb) {
    if (!Buffer.isBuffer(key)) throw new Error('Invalid input: expected buffer')
    if (!Buffer.isBuffer(val)) throw new Error('Invalid input: expected buffer')

    this._leveldb.put(key, val, ENCODING_OPTS, cb)
  }

  /**
   * Removes a raw value in the underlying leveldb.
   * @param {Buffer} key
   * @param {Function} cb A callback `Function`, which is given the argument
   * `err` - for errors that may have occured
   */
  del (key, cb) {
    if (!Buffer.isBuffer(key)) throw new Error('Invalid input: expected buffer')

    this._leveldb.del(key, ENCODING_OPTS, cb)
  }

  /**
   * Performs a batch operation on db.
   * @param {Array} opStack A stack of levelup operations
   * @param {Function} cb A callback `Function`, which is given the argument
   * `err` - for errors that may have occured
   */
  batch (opStack, cb) {
    if (!Array.isArray(opStack)) throw new Error('Invalid input: expected buffer')

    this._leveldb.batch(opStack, ENCODING_OPTS, cb)
  }

  /**
   * Returns a copy of the DB instance, with a reference
   * to the **same** underlying leveldb instance.
   */
  copy () {
    return new DB(this._leveldb)
  }
}
