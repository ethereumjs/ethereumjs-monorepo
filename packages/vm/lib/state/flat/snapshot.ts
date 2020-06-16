import { LevelUp } from 'levelup'
import { keccak256, KECCAK256_NULL, KECCAK256_RLP } from 'ethereumjs-util'
import Account from 'ethereumjs-account'
import * as rlp from 'rlp'
import { DB } from './db'
import { Nibbles, bufferToNibbles } from './util'
import { EmptyNode } from './stackTrie'

import BN = require('bn.js')

const ACCOUNT_PREFIX: Buffer = Buffer.from('00', 'hex')
const STORAGE_PREFIX: Buffer = Buffer.from('11', 'hex')
const CODE_PREFIX: Buffer = Buffer.from('22', 'hex')
const CHECKPOINT_PREFIX: Buffer = Buffer.from('33', 'hex')

export interface StorageSlot {
  key: Buffer
  value: Buffer
}

export class Snapshot {
  _db: DB
  _checkpointIndex: number

  constructor(db?: LevelUp) {
    this._db = new DB(db)
    this._checkpointIndex = 0
  }

  async putAccount(address: Buffer, value: Buffer): Promise<void> {
    // Assume account addr hasn't been hashed
    const key = Buffer.concat([ ACCOUNT_PREFIX, keccak256(address) ])
    await this._db.put(key, value)
  }

  async getAccount(address: Buffer): Promise<Buffer | null> {
    const key = Buffer.concat([ ACCOUNT_PREFIX, keccak256(address) ])
    return this._db.get(key)
  }

  async delAccount(address: Buffer): Promise<void> {
    const key = Buffer.concat([ ACCOUNT_PREFIX, keccak256(address) ])
    return this._db.del(key)
  }

  /**
   * Deletes not only the account itself, but also the code
   * and any storage items if available.
   */
  async clearAccount(address: Buffer): Promise<void> {
    const rawAccount = await this.getAccount(address)
    if (!rawAccount) return

    await this.delAccount(address)

    const account = new Account(rawAccount)
    if (!account.codeHash.equals(KECCAK256_NULL)) {
      await this.delCode(account.codeHash)
    }

    await this.clearAccountStorage(address)
  }

  async putStorageSlot(address: Buffer, slot: Buffer, value: Buffer): Promise<void> {
    const key = Buffer.concat([ STORAGE_PREFIX, keccak256(address), keccak256(slot) ])
    await this._db.put(key, value)
  }

  async getStorageSlot(address: Buffer, slot: Buffer): Promise<Buffer | null> {
    const key = Buffer.concat([ STORAGE_PREFIX, keccak256(address), keccak256(slot) ])
    return this._db.get(key)
  }


  async delStorageSlot(address: Buffer, slot: Buffer): Promise<void> {
    const key = Buffer.concat([ STORAGE_PREFIX, keccak256(address), keccak256(slot) ])
    await this._db.del(key)
  }

  async clearAccountStorage(address: Buffer): Promise<void> {
    const prefix = Buffer.concat([STORAGE_PREFIX, keccak256(address)])
    await this._db.delByPrefix(prefix, true)
  }

  async putCode(address: Buffer, code: Buffer): Promise<void> {
    const codeHash = keccak256(code)
    if (codeHash.equals(KECCAK256_NULL)) {
      return
    }

    const key = Buffer.concat([ CODE_PREFIX, keccak256(code) ])
    await this._db.put(key, code)

    // Update account's codeHash field
    const rawAccount = await this.getAccount(address)
    if (!rawAccount) throw new Error('Creating code for inexistent account')
    const account = new Account(rawAccount)
    account.codeHash = codeHash
    await this.putAccount(address, account.serialize())
  }

  async getCode(address: Buffer): Promise<Buffer | null> {
    const rawAccount = await this.getAccount(address)
    if (!rawAccount) return null
    const account = new Account(rawAccount)
    if (account.codeHash.equals(KECCAK256_NULL)) {
      return Buffer.alloc(0)
    }

    const key = Buffer.concat([ CODE_PREFIX, account.codeHash ])
    return this._db.get(key)
  }

  async delCode(codeHash: Buffer): Promise<void> {
    const key = Buffer.concat([ CODE_PREFIX, codeHash ])
    return this._db.del(key)
  }

  getAccounts(): NodeJS.ReadableStream {
    const prefix = ACCOUNT_PREFIX
    return this._db.byPrefix(prefix)
  }

  getStorageSlots(address: Buffer): NodeJS.ReadableStream {
    const prefix = Buffer.concat([ STORAGE_PREFIX, keccak256(address) ])
    return this._db.byPrefix(prefix)
  }

  async merkleize(): Promise<Buffer> {
    // Merkleize all the storage tries in the db
    const storageRoots: { [k: string]: Buffer } = await this._merkleizeStorageTries()

    return new Promise((resolve, reject) => {
      let root = new EmptyNode()
      const stream = this.getAccounts()
        .on('data', (data: any) => {
          const key = data.key.slice(ACCOUNT_PREFIX.length)
          // Update the account's stateRoot field if there exist
          // storage slots for that account in the db (i.e. not EoA).
          // TODO: Can probably cache stateRoot and re-compute storage
          // trie root only if the storage trie has been touched.
          const storageRoot = storageRoots[key.toString('hex')]
          let value = data.value
          if (storageRoot !== undefined) {
            const acc = new Account(data.value)
            acc.stateRoot = storageRoot
            value = acc.serialize()
          }
          root = root.insert(bufferToNibbles(key), value)
        })
        .on('error', (err: any) => reject(err))
        .on('end', () => resolve(root.hash()))
    })
  }

  /**
   * Returns the root for all the storage tries stored
   * in the db. Helper function for ``merkleize``.
   * @private
   */
  async _merkleizeStorageTries(): Promise<{ [k: string]: Buffer }> {
    return new Promise((resolve, reject) => {
      const tries: any = {}
      const prefix = Buffer.concat([ STORAGE_PREFIX ])
      this._db.byPrefix(prefix)
        .on('data', (data: any) => {
          const hashedAddr = data.key.slice(STORAGE_PREFIX.length, STORAGE_PREFIX.length + 32)
          const hashedAddrS = hashedAddr.toString('hex')
          if (!tries[hashedAddrS]) {
            tries[hashedAddrS] = new EmptyNode()
          }
          const slotKey = data.key.slice(STORAGE_PREFIX.length + 32)
          tries[hashedAddrS] = tries[hashedAddrS].insert(bufferToNibbles(slotKey), data.value)
        })
        .on('error', (err: any) => reject(err))
        .on('end', () => {
          const roots: any = {}
          for (let k in tries) {
            roots[k] = tries[k].hash()
          }
          resolve(roots)
        })
    })
  }

  checkpoint(): void {
    const prefix = Buffer.concat([ CHECKPOINT_PREFIX, new BN(this._checkpointIndex).toArrayLike(Buffer, 'be', 2) ])
    this._db = new DB(this._db._leveldb, prefix, this._db)
    this._checkpointIndex++
  }

  async commit(): Promise<void> {
    if (!this._db._parent) {
      throw new Error('No outstanding checkpoints to revert')
    }
    const db = this._db
    this._db = db._parent as DB
    await db.merge()
    this._checkpointIndex--
  }

  async revert(): Promise<void> {
    if (!this._db._parent) {
      throw new Error('No outstanding checkpoints to revert')
    }
    const db = this._db
    this._db = db._parent as DB
    await db.clear()
    this._checkpointIndex--
  }
}
