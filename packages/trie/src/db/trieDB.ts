import { bytesToPrefixedHexString, hexStringToBytes } from '@ethereumjs/util'
import { debug } from 'debug'
import { bytesToHex } from 'ethereum-cryptography/utils'
import { MemoryLevel } from 'memory-level'
import { keccak256 } from 'ethereum-cryptography/keccak'
import type { AbstractLevel } from 'abstract-level'
import type { Debugger } from 'debug'
import { HashFunction } from '../types'

export type BatchDBOp = PutBatch | DelBatch

export interface PutBatch {
  type: 'put'
  key: Uint8Array
  value: Uint8Array
}

export interface DelBatch {
  type: 'del'
  key: Uint8Array
}

export interface DB {
  /**
   * Retrieves a raw value from leveldb.
   * @param key
   * @returns A Promise that resolves to `Uint8Array` if a value is found or `null` if no value is found.
   */
  get(key: Uint8Array): Promise<Uint8Array | null>

  /**
   * Writes a value directly to leveldb.
   * @param key The key as a `Uint8Array`
   * @param value The value to be stored
   */
  put(key: Uint8Array, val: Uint8Array): Promise<void>

  /**
   * Removes a raw value in the underlying leveldb.
   * @param keys
   */
  del(key: Uint8Array): Promise<void>

  /**
   * Performs a batch operation on db.
   * @param opStack A stack of levelup operations
   */
  batch(opStack: BatchDBOp[]): Promise<void>

  /**
   * Returns a copy of the DB instance, with a reference
   * to the **same** underlying leveldb instance.
   */
  copy(): Promise<DB>
}
export class TrieDatabase implements DB {
  static async create(
    options: {
      db?: AbstractLevel<string, string>
      debug?: Debugger
    } = {}
  ): Promise<TrieDatabase> {
    const db = new TrieDatabase(options)
    await db.db.open()
    return db
  }
  private readonly db: AbstractLevel<string, string>
  private readonly debug: Debugger
  keyIterator: typeof this.db.keys

  constructor(options: { db?: AbstractLevel<string, string>; _debug?: Debugger } = {}) {
    this.db = options.db ?? (new MemoryLevel() as AbstractLevel<string, string>)
    this.keyIterator = this.db.keys
    this.debug = options._debug ? options._debug.extend('db') : debug('trie:db')
  }
  async get(key: Uint8Array, debug: Debugger = this.debug): Promise<Uint8Array | null> {
    debug = debug.extend('get')
    debug(`key: ${bytesToPrefixedHexString(key)}`)
    try {
      const value = await this.db.get(bytesToHex(key))
      debug(`value: ${value}`)
      return hexStringToBytes(value)
    } catch (error: any) {
      debug(`value: ${error.message}`)
      return null
    }
  }
  async put(key: Uint8Array, value: Uint8Array, debug: Debugger = this.debug): Promise<void> {
    debug = debug.extend('db_put')
    debug(`key: ${bytesToPrefixedHexString(key)}`)
    debug(`value: ${bytesToPrefixedHexString(value)}`)
    await this.db.put(bytesToHex(key), bytesToPrefixedHexString(value))
  }
  async del(key: Uint8Array, debug: Debugger = this.debug): Promise<void> {
    debug.extend('db_del')(bytesToHex(key))
    await this.db.del(bytesToHex(key))
  }
  async batch(
    operations: { type: 'put' | 'del'; key: Uint8Array; value?: Uint8Array }[],
    debug: Debugger = this.debug
  ): Promise<void> {
    debug.extend('db_batch')(Object.fromEntries(operations.map((op) => op.type).entries()))
    const batch = this.db.batch()
    for (const op of operations) {
      if (op.type === 'put' && op.value) {
        batch.put(bytesToHex(op.key), bytesToHex(op.value))
      } else {
        batch.del(bytesToHex(op.key))
      }
    }
    await batch.write()
  }
  async copy(): Promise<TrieDatabase> {
    const dbCopy = new MemoryLevel() as AbstractLevel<string, string>
    for await (const [key, value] of this.db.iterator()) {
      await dbCopy.put(key, value)
    }
    return TrieDatabase.create({ db: dbCopy, debug: this.debug })
  }
  async open(): Promise<void> {
    await this.db.open()
    this.debug('DB opened')
  }
  async keys(): Promise<Uint8Array[]> {
    const keys = []
    for await (const key of this.db.keys()) {
      keys.push(hexStringToBytes(key))
    }
    return keys
  }
  async values(): Promise<Uint8Array[]> {
    const values = []
    for await (const value of this.db.values()) {
      values.push(hexStringToBytes(value))
    }
    return values
  }
  async editKeys(callback?: (key: string) => Promise<any>): Promise<any[]> {
    const edits = []
    for await (const key of this.db.keys()) {
      if (callback) {
        edits.push(callback(key))
      }
    }
    return Promise.allSettled(edits)
  }
  async close(): Promise<void> {
    await this.db.close()
    this.debug('DB closed')
  }
}

export class ProofDatabase extends TrieDatabase {
  proof: Map<Uint8Array, Uint8Array>
  hash: HashFunction
  constructor(options: {
    proof: Uint8Array[]
    db?: AbstractLevel<string, string>
    debug?: Debugger
    hashFunction?: HashFunction
  }) {
    super(options)
    this.hash = options.hashFunction ?? keccak256
    this.proof = new Map(options.proof.map((node) => [this.hash(node), node]))
  }
}
