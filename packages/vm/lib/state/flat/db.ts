import { LevelUp } from 'levelup'
import BN = require('bn.js')
const level = require('level-mem')
const levelWS = require('level-ws')

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

export interface Tuple {
  key: Buffer
  value: Buffer
}

/**
 * DB is a thin wrapper around the underlying levelup db,
 * which validates inputs and sets encoding type.
 */
export class DB {
  _leveldb: LevelUp
  _prefix: Buffer
  _parent?: DB
  _deleted: Set<string>
  _deletedPrefixes: Set<string>

  /**
   * Initialize a DB instance. If `leveldb` is not provided, DB
   * defaults to an [in-memory store](https://github.com/Level/memdown).
   * @param {Object} [leveldb] - An abstract-leveldown compliant store
   */
  constructor(leveldb?: LevelUp, prefix?: Buffer, _parent?: DB) {
    this._leveldb = leveldb || level()
    this._parent = _parent
    this._prefix = prefix || Buffer.alloc(0)
    // Used for committing deleted objects
    this._deleted = new Set()
    // Same as for above but for when using `.delByPrefix`
    this._deletedPrefixes = new Set()
  }

  /**
   * Retrieves a raw value from leveldb.
   * @param {Buffer} key
   * @returns {Promise} - Promise resolves with `Buffer` if a value is found or `null` if no value is found.
   */
  async get(key: Buffer): Promise<Buffer | null> {
    // Try getting value from current layer
    let res = await this._get(Buffer.concat([ this._prefix, key]))
    if (!res && this._parent) {
      const skey = key.toString('hex')
      // If key has been deleted don't go to lower layer
      if (this._deleted.has(skey)) {
        return null
      }
      // Make sure a key prefix matching this key hasn't been
      // marked as deleted
      for (const deletedPrefix of Array.from(this._deletedPrefixes)) {
        if (skey.startsWith(deletedPrefix)) {
          return null
        }
      }
      // Fetch value from lower layer
      res = await this._parent.get(key)
    }
    return res
  }

  async _get(key: Buffer): Promise<Buffer | null> {
    let value = null
    try {
      value = await this._leveldb.get(key, ENCODING_OPTS)
    } catch (error) {
      if (error.notFound) {
        // not found, returning null
      } else {
        throw error
      }
    } finally {
      return value
    }
  }

  /**
   * Writes a value directly to leveldb.
   * @param {Buffer} key The key as a `Buffer`
   * @param {Buffer} value The value to be stored
   * @returns {Promise}
   */
  async put(key: Buffer, val: Buffer): Promise<void> {
    // If item was inserted again after deletion we shouldn't
    // mark it as deleted.
    if (this._parent && this._deleted.has(key.toString('hex'))) {
      this._deleted.delete(key.toString('hex'))
    }
    key = Buffer.concat([ this._prefix, key ])
    await this._leveldb.put(key, val, ENCODING_OPTS)
  }

  /**
   * Removes a raw value in the underlying leveldb.
   * @param {Buffer} key
   * @returns {Promise}
   */
  async del(key: Buffer): Promise<void> {
    if (this._parent) {
      this._deleted.add(key.toString('hex'))
    }
    key = Buffer.concat([ this._prefix, key])
    await this._leveldb.del(key, ENCODING_OPTS)
  }

  /**
   * Performs a batch operation on db.
   * @param {Array} opStack A stack of levelup operations
   * @returns {Promise}
   */
  /*async batch(opStack: BatchDBOp[]): Promise<void> {
    // TODO: Prepend prefix to keys
    // TODO: Handle marking items as deleted
    // TODO: probably better not to use batch
    await this._leveldb.batch(opStack, ENCODING_OPTS)
  }*/

  /**
   * Returns a readable stream for all
   * kv pairs where key starts with `prefix`.
   */
  byPrefix(prefix: Buffer): NodeJS.ReadableStream {
    const gt = prefix
    // TODO: check length hasn't changed after incrementing
    const lt = new BN(prefix).addn(1).toBuffer()
    // TODO: remove prefix from keys
    return this._leveldb.createReadStream({ gt, lt })
  }

  async delByPrefix(prefix: Buffer): Promise<void> {
    return new Promise((resolve, reject) => {
      // If this is a checkpointing layer, mark prefix as deleted
      // so we can apply on merge
      if (this._parent) {
        this._deletedPrefixes.add(prefix.toString('hex'))
      }
      const gt = Buffer.concat([this._prefix, prefix])
      const lt = new BN(gt).addn(1).toBuffer()
      const ws = levelWS(this._leveldb)
      this._leveldb.createKeyStream({ gt, lt })
        .on('data', (key: Buffer) => ws.write({ type: 'del', key }))
        .on('error', (err: any) => {
          ws.destroy(err)
          reject(err)
        })
        .on('end', () => {
          ws.end()
          resolve()
        })
    })
  }

  async clear(): Promise<void> {
    return new Promise((resolve, reject) => {
      let gt = this._prefix
      const lt = new BN(gt).addn(1).toBuffer()
      // TODO: update levelup to get .clear()
      //await this._leveldb.clear({ gt, lt })
      const ws = levelWS(this._leveldb)
      this._leveldb.createKeyStream({ gt, lt })
        .on('data', (key: Buffer) => ws.write({ type: 'del', key }))
        .on('error', (err: any) => {
          ws.destroy(err)
          reject(err)
        })
        .on('end', () => {
          ws.end()
          resolve()
        })
    })
  }

  /*
   * Writes all prefixed keys to parent
   * and removes the prefixed versions.
   */
  async merge(): Promise<void> {
    return new Promise(async (resolve, reject) => {
      if (!this._parent) {
        reject(new Error('DB has no parent to merge into'))
      }
      const ws = levelWS(this._leveldb)

      // First clear prefixes marked as deleted.
      // This is done first because new values might
      // have been inserted into that prefix after `.delByPrefix`
      // which should correctly be merged into lower layer.
      for (const deletedPrefix of Array.from(this._deletedPrefixes)) {
        await this._parent!.delByPrefix(Buffer.from(deletedPrefix, 'hex'))
      }

      // Handle individual objects marked as deleted
      for (const hexKey of Array.from(this._deleted)) {
        this._parent!._deleted.add(hexKey)
        const parentKey = Buffer.concat([this._parent!._prefix, Buffer.from(hexKey, 'hex')])
        ws.write({ type: 'del', key: parentKey })
      }

      // We then merge every other change, namely insertions and modifications
      const gt = this._prefix
      const lt = new BN(gt).addn(1).toBuffer()
      this._leveldb.createReadStream({ gt, lt })
        .on('data', (data: any) => {
          const shortKey = data.key.slice(this._prefix.length)
          const parentKey = Buffer.concat([this._parent!._prefix, shortKey])
          ws.write({ type: 'put', key: parentKey, value: data.value })
          ws.write({ type: 'del', key: data.key })
        })
        .on('error', (err: Error) => {
          ws.destroy(err)
          reject(err)
        })
        .on('end', () => {
          ws.end()
          resolve()
        })
    })
  }

  /**
   * Returns a copy of the DB instance, with a reference
   * to the **same** underlying leveldb instance.
   */
  copy(): DB {
    return new DB(this._leveldb)
  }
}
