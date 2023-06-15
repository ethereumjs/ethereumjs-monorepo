import { bytesToPrefixedHexString, hexStringToBytes } from '@ethereumjs/util'
import { debug } from 'debug'
import { keccak256 } from 'ethereum-cryptography/keccak'
import { bytesToHex } from 'ethereum-cryptography/utils'
import { MemoryLevel } from 'memory-level'

import type { DB, HashFunction } from '../types'
import type { EncodingOpts } from '@ethereumjs/util'
import type { AbstractKeyIterator, AbstractLevel } from 'abstract-level'
import type { Debugger } from 'debug'

export class TrieDatabase implements DB {
  static async create(
    options: {
      db?: AbstractLevel<string | Uint8Array, string | Uint8Array, string | Uint8Array>
      debug?: Debugger
    } = {}
  ): Promise<TrieDatabase> {
    const db = new TrieDatabase(options)
    await db.db.open()
    return db
  }
  private readonly db: AbstractLevel<string | Uint8Array, string | Uint8Array, string | Uint8Array>
  private readonly debug: Debugger
  keyIterator: () => AbstractKeyIterator<
    AbstractLevel<string | Uint8Array, string | Uint8Array, string | Uint8Array>,
    string | Uint8Array
  >

  constructor(
    options: {
      db?: AbstractLevel<string | Uint8Array, string | Uint8Array, string | Uint8Array>
      _debug?: Debugger
    } = {}
  ) {
    this.db =
      options.db ??
      (new MemoryLevel() as AbstractLevel<
        string | Uint8Array,
        string | Uint8Array,
        string | Uint8Array
      >)
    this.keyIterator = this.db.keys
    this.debug = options._debug ? options._debug.extend('db') : debug('trie:db')
  }
  stats(): any {}
  async get(
    key: Uint8Array,
    opts?: EncodingOpts,
    debug: Debugger = this.debug
  ): Promise<Uint8Array | undefined> {
    debug = debug.extend('get')
    debug(`key: ${bytesToPrefixedHexString(key)}`)
    try {
      const value = await this.db.get(bytesToHex(key))
      debug(`value: ${value}`)
      return value instanceof Uint8Array ? value : hexStringToBytes(value)
    } catch (error: any) {
      debug(`value: ${error.message}`)
      return undefined
    }
  }
  async put(
    key: Uint8Array,
    value: Uint8Array,
    opts?: EncodingOpts,
    debug: Debugger = this.debug
  ): Promise<void> {
    debug = debug.extend('put')
    debug(`key: ${bytesToPrefixedHexString(key)}`)
    await this.db.put(bytesToHex(key), bytesToPrefixedHexString(value))
  }
  async del(key: Uint8Array, opts?: EncodingOpts, debug: Debugger = this.debug): Promise<void> {
    debug.extend('del')(bytesToHex(key))
    await this.db.del(bytesToHex(key))
  }
  async batch(
    operations: { type: 'put' | 'del'; key: Uint8Array; value?: Uint8Array }[],
    debug: Debugger = this.debug
  ): Promise<void> {
    debug = debug.extend('batch')
    debug(`operations: ${operations.length}`)
    const batch = this.db.batch()
    for (const [opIdx, op] of operations.entries()) {
      debug(`${opIdx + 1} / ${operations.length}: --`)
      if (op.type === 'put' && op.value) {
        batch.put(bytesToHex(op.key), bytesToHex(op.value))
      } else {
        batch.del(bytesToHex(op.key))
      }
    }
    await batch.write()
  }
  async copy(): Promise<TrieDatabase> {
    const dbCopy = new MemoryLevel() as AbstractLevel<
      string | Uint8Array,
      string | Uint8Array,
      string | Uint8Array
    >
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
      keys.push(key instanceof Uint8Array ? key : hexStringToBytes(key))
    }
    return keys
  }
  async values(): Promise<Uint8Array[]> {
    const values = []
    for await (const value of this.db.values()) {
      values.push(value instanceof Uint8Array ? value : hexStringToBytes(value))
    }
    return values
  }
  async editKeys(callback?: (key: string) => Promise<any>): Promise<any[]> {
    const edits = []
    for await (const key of this.db.keys()) {
      if (callback) {
        edits.push(callback(key instanceof Uint8Array ? bytesToPrefixedHexString(key) : key))
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
    db?: AbstractLevel<string | Uint8Array, string | Uint8Array, string | Uint8Array>
    debug?: Debugger
    hashFunction?: HashFunction
  }) {
    super(options)
    this.hash = options.hashFunction ?? keccak256
    this.proof = new Map(options.proof.map((node) => [this.hash(node), node]))
  }
}
