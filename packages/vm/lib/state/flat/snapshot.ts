import { LevelUp } from 'levelup'
import { keccak256, KECCAK256_NULL, KECCAK256_RLP } from 'ethereumjs-util'
import { DB } from './db'
import { Nibbles, bufferToNibbles } from './util'
import { EmptyNode } from './stackTrie'

import BN = require('bn.js')

const ACCOUNT_PREFIX: Buffer = Buffer.from('00', 'hex')
const STORAGE_PREFIX: Buffer = Buffer.from('11', 'hex')
const CODE_PREFIX: Buffer = Buffer.from('22', 'hex')

export interface StorageSlot {
  key: Buffer
  value: Buffer
}

export class Snapshot {
  _db: DB

  constructor(db?: LevelUp) {
    this._db = new DB(db)
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

  async putStorageSlot(address: Buffer, slot: Buffer, value: Buffer): Promise<void> {
    const key = Buffer.concat([ STORAGE_PREFIX, keccak256(address), keccak256(slot) ])
    await this._db.put(key, value)
  }

  async getStorageSlot(address: Buffer, slot: Buffer): Promise<Buffer | null> {
    const key = Buffer.concat([ STORAGE_PREFIX, keccak256(address), keccak256(slot) ])
    return this._db.get(key)
  }

  async putCode(code: Buffer): Promise<void> {
    const codeHash = keccak256(code)
    if (codeHash.equals(KECCAK256_NULL)) {
      return
    }

    const key = Buffer.concat([ CODE_PREFIX, keccak256(code) ])
    await this._db.put(key, code)
  }

  async getCode(codeHash: Buffer): Promise<Buffer | null> {
    if (codeHash.equals(KECCAK256_NULL)) {
      return Buffer.alloc(0)
    }

    const key = Buffer.concat([ CODE_PREFIX, codeHash ])
    return this._db.get(key)
  }

  getAccounts(): void {
    const prefix = ACCOUNT_PREFIX
    this._db.byPrefix(prefix)
      .on('data', (data: any) => { console.log('ondata', data) })
      .on('error', (err: any) => { console.log('onerr', err) })
      .on('close', () => { console.log('closed') })
      .on('end', () => { console.log('stream ended') })
  }

  getStorageSlots(address: Buffer): void {//Promise<StorageSlot[]> {
    const prefix = Buffer.concat([ STORAGE_PREFIX, keccak256(address) ])
    this._db.byPrefix(prefix)
      .on('data', (data: any) => { console.log('ondata', data) })
      .on('error', (err: any) => { console.log('onerr', err) })
      .on('close', () => { console.log('closed') })
      .on('end', () => { console.log('stream ended') })
  }

  async merkleize(): Promise<Buffer> {
    // Iterate all accounts
    //   Merklize all storage slots of given account
    //   Hash account
    return Buffer.alloc(0)
  }

  merkleizeList(leaves: Buffer[][]): Buffer {
    let root = new EmptyNode()

    for (let kv of leaves) {
      const key = bufferToNibbles(kv[0])
      root = root.insert(key, kv[1])
    }

    return root.hash()
  }

  checkpoint(): void {
  }

  commit(): void {
  }

  revert(): void {
  }
}
