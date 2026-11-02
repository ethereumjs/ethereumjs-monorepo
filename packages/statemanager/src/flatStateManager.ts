import {
  Account,
  Address,
  BINARY_ACCOUNT_SIZE,
  EthereumJSErrorWithoutCode,
  KECCAK256_NULL,
  accountToBinaryAccount,
  binaryAccountToAccount,
  bytesToHex,
  bytesToUnprefixedHex,
  equalsBytes,
  unprefixedHexToBytes,
} from '@ethereumjs/util'
import type { BinaryAccount } from '@ethereumjs/util'
import { keccak_256 } from '@noble/hashes/sha3.js'

import { OriginalStorageCache } from './cache/originalStorageCache.ts'
import { consumeBAL as consumeBALUtil } from './consumeBAL.ts'
import { modifyAccountFields } from './util.ts'

import type { AccountFields, Common, StateManagerInterface } from '@ethereumjs/common'
import type { BALJSONBlockAccessList, PrefixedHexString } from '@ethereumjs/util'
import type { FlatStateManagerOpts } from './types.ts'

export type FlatAccountSample = {
  accountHash: Uint8Array
  address?: Address
  account: Account
}

type DeltaFrame = {
  accounts: Map<string, Uint8Array | undefined>
  storage: Map<string, Uint8Array | undefined>
  code: Map<string, Uint8Array | undefined>
}

/** Bytes per row in a verified snap account slab (`32` hash + `104` binary). */
export const SNAP_BINARY_ACCOUNT_SLAB_RECORD_SIZE = 32 + BINARY_ACCOUNT_SIZE

const ACCOUNT_SHARD_COUNT = 256

function accountShardIndex(key: string): number {
  return Number.parseInt(key.slice(0, 2), 16)
}

function createAccountShards(): Array<Map<string, Uint8Array | undefined>> {
  return Array.from({ length: ACCOUNT_SHARD_COUNT }, () => new Map())
}

/**
 * Hash-keyed in-memory state for snap sync and flat BAL application.
 * Implements {@link @ethereumjs/common!StateManagerInterface} without Merkle roots.
 */
export class FlatStateManager implements StateManagerInterface {
  public readonly common?: Common
  public originalStorageCache: OriginalStorageCache

  private readonly _parent?: FlatStateManager
  private readonly _accountShards = createAccountShards()
  /** Overlay keys written on a shallow copy (including tombstones). */
  private readonly _localAccountKeys = new Set<string>()
  private _liveAccountCount = 0
  private readonly _storage = new Map<string, Uint8Array>()
  private readonly _code = new Map<string, Uint8Array>()
  private readonly _hashToAddress = new Map<string, Address>()
  private readonly _deltaStack: DeltaFrame[] = []
  private readonly _overlayFrames: DeltaFrame[] = []
  private readonly _keccak: (data: Uint8Array) => Uint8Array

  constructor(opts: FlatStateManagerOpts = {}, parent?: FlatStateManager) {
    this.common = opts.common ?? parent?.common
    this._parent = parent
    this._keccak = this.common?.customCrypto.keccak256 ?? keccak_256
    this.originalStorageCache = new OriginalStorageCache(this.getStorage.bind(this))
  }

  private accountShard(key: string): Map<string, Uint8Array | undefined> {
    return this._accountShards[accountShardIndex(key)]!
  }

  private accountHashHex(address: Address): string {
    return bytesToUnprefixedHex(this._keccak(address.bytes))
  }

  private accountHashKey(hash: Uint8Array): string {
    return bytesToUnprefixedHex(hash)
  }

  private storageKey(accountHashHex: string, slotHashHex: string): string {
    return `${accountHashHex}:${slotHashHex}`
  }

  private slotHashHex(rawSlot: Uint8Array): string {
    return bytesToUnprefixedHex(this._keccak(rawSlot))
  }

  private topFrame(): DeltaFrame | undefined {
    if (this._parent !== undefined) {
      return this._overlayFrames[this._overlayFrames.length - 1]
    }
    return this._deltaStack[this._deltaStack.length - 1]
  }

  private readBinaryAccountKey(key: string): Uint8Array | undefined {
    const shard = this.accountShard(key)
    if (shard.has(key)) {
      return shard.get(key)
    }
    if (this._parent !== undefined) {
      return this._parent.readBinaryAccountKey(key)
    }
    return undefined
  }

  private assignAccountShard(key: string, binary: Uint8Array | undefined): void {
    if (this._parent !== undefined) {
      this._localAccountKeys.add(key)
      const shard = this.accountShard(key)
      if (binary === undefined) {
        shard.set(key, undefined)
      } else {
        shard.set(key, binary)
      }
      return
    }
    const shard = this.accountShard(key)
    const hadLive = shard.has(key) && shard.get(key) !== undefined
    if (binary === undefined) {
      if (shard.has(key) && shard.get(key) !== undefined) {
        this._liveAccountCount--
      }
      shard.delete(key)
      return
    }
    if (!hadLive) {
      this._liveAccountCount++
    }
    shard.set(key, binary)
  }

  private readAccountKey(key: string): Account | undefined {
    const binary = this.readBinaryAccountKey(key)
    if (binary === undefined) return undefined
    return binaryAccountToAccount(binary)
  }

  private writeBinaryAccountKey(key: string, binary: Uint8Array | undefined): void {
    const frame = this.topFrame()
    if (frame !== undefined && !frame.accounts.has(key)) {
      frame.accounts.set(key, this.readBinaryAccountKey(key))
    }
    this.assignAccountShard(key, binary)
  }

  private writeAccountKey(key: string, account: Account | undefined): void {
    if (account === undefined) {
      this.writeBinaryAccountKey(key, undefined)
      return
    }
    this.writeBinaryAccountKey(key, accountToBinaryAccount(account))
  }

  private readStorageKey(key: string): Uint8Array | undefined {
    if (this._storage.has(key)) {
      return this._storage.get(key)
    }
    if (this._parent !== undefined) {
      return this._parent.readStorageKey(key)
    }
    return undefined
  }

  private writeStorageKey(key: string, value: Uint8Array | undefined): void {
    const frame = this.topFrame()
    if (frame !== undefined && !frame.storage.has(key)) {
      frame.storage.set(key, this.readStorageKey(key))
    }
    if (value === undefined || value.length === 0) {
      this._storage.delete(key)
    } else {
      this._storage.set(key, value)
    }
  }

  private readCodeKey(key: string): Uint8Array | undefined {
    if (this._code.has(key)) {
      return this._code.get(key)
    }
    if (this._parent !== undefined) {
      return this._parent.readCodeKey(key)
    }
    return undefined
  }

  private writeCodeKey(key: string, value: Uint8Array | undefined): void {
    const frame = this.topFrame()
    if (frame !== undefined && !frame.code.has(key)) {
      frame.code.set(key, this.readCodeKey(key))
    }
    if (value === undefined) {
      this._code.delete(key)
    } else {
      this._code.set(key, value)
    }
  }

  async getAccount(address: Address): Promise<Account | undefined> {
    return this.readAccountKey(this.accountHashHex(address))
  }

  async putAccount(address: Address, account?: Account): Promise<void> {
    const key = this.accountHashHex(address)
    this._hashToAddress.set(key, address)
    this.writeAccountKey(key, account)
  }

  async deleteAccount(address: Address): Promise<void> {
    await this.putAccount(address, undefined)
  }

  async modifyAccountFields(address: Address, accountFields: AccountFields): Promise<void> {
    await modifyAccountFields(this, address, accountFields)
  }

  async getCode(address: Address): Promise<Uint8Array> {
    const account = await this.getAccount(address)
    if (account === undefined || equalsBytes(account.codeHash, KECCAK256_NULL)) {
      return new Uint8Array(0)
    }
    const codeHashHex = bytesToUnprefixedHex(account.codeHash)
    return this.readCodeKey(codeHashHex) ?? new Uint8Array(0)
  }

  async putCode(address: Address, value: Uint8Array): Promise<void> {
    const codeHash = this._keccak(value)
    const codeHashHex = bytesToUnprefixedHex(codeHash)
    this.writeCodeKey(codeHashHex, value)
    if ((await this.getAccount(address)) === undefined) {
      await this.putAccount(address, new Account())
    }
    await this.modifyAccountFields(address, { codeHash })
  }

  async getCodeSize(address: Address): Promise<number> {
    return (await this.getCode(address)).length
  }

  async getStorage(address: Address, key: Uint8Array): Promise<Uint8Array> {
    if (key.length !== 32) {
      throw EthereumJSErrorWithoutCode('Storage key must be 32 bytes long')
    }
    const account = await this.getAccount(address)
    if (account === undefined) {
      return new Uint8Array(0)
    }
    const ah = this.accountHashHex(address)
    const sk = this.storageKey(ah, this.slotHashHex(key))
    return this.readStorageKey(sk) ?? new Uint8Array(0)
  }

  async putStorage(address: Address, key: Uint8Array, value: Uint8Array): Promise<void> {
    if (key.length !== 32) {
      throw EthereumJSErrorWithoutCode('Storage key must be 32 bytes long')
    }
    if (value.length > 32) {
      throw EthereumJSErrorWithoutCode('Storage value cannot be longer than 32 bytes')
    }
    const account = await this.getAccount(address)
    if (account === undefined) {
      throw EthereumJSErrorWithoutCode('putStorage() called on non-existing account')
    }
    const ah = this.accountHashHex(address)
    const sk = this.storageKey(ah, this.slotHashHex(key))
    this.writeStorageKey(sk, value.length === 0 ? undefined : value)
  }

  async clearStorage(address: Address): Promise<void> {
    const ah = this.accountHashHex(address)
    const prefix = `${ah}:`
    for (const key of [...this._storage.keys()]) {
      if (key.startsWith(prefix)) {
        this.writeStorageKey(key, undefined)
      }
    }
    if (this._parent !== undefined) {
      // Parent slots remain; only clear local overlay keys (already done)
    }
  }

  async checkpoint(): Promise<void> {
    if (this._parent !== undefined) {
      this._overlayFrames.push({ accounts: new Map(), storage: new Map(), code: new Map() })
      return
    }
    this._deltaStack.push({ accounts: new Map(), storage: new Map(), code: new Map() })
  }

  async commit(): Promise<void> {
    if (this._parent !== undefined) {
      if (this._overlayFrames.length === 0) return
      this._overlayFrames.pop()
      return
    }
    if (this._deltaStack.length === 0) return
    this._deltaStack.pop()
  }

  async revert(): Promise<void> {
    if (this._parent !== undefined) {
      if (this._overlayFrames.length === 0) return
      const frame = this._overlayFrames.pop()!
      for (const [k, v] of frame.accounts) {
        this.assignAccountShard(k, v)
      }
      for (const [k, v] of frame.storage) {
        if (v === undefined) {
          this._storage.delete(k)
        } else {
          this._storage.set(k, v)
        }
      }
      for (const [k, v] of frame.code) {
        if (v === undefined) {
          this._code.delete(k)
        } else {
          this._code.set(k, v)
        }
      }
      return
    }
    if (this._deltaStack.length === 0) return
    const frame = this._deltaStack.pop()!
    for (const [k, v] of frame.accounts) {
      this.assignAccountShard(k, v)
    }
    for (const [k, v] of frame.storage) {
      if (v === undefined) {
        this._storage.delete(k)
      } else {
        this._storage.set(k, v)
      }
    }
    for (const [k, v] of frame.code) {
      if (v === undefined) {
        this._code.delete(k)
      } else {
        this._code.set(k, v)
      }
    }
  }

  async flush(): Promise<void> {}

  clearCaches(): void {
    this.originalStorageCache.clear()
  }

  shallowCopy(): StateManagerInterface {
    return new FlatStateManager({ common: this.common }, this)
  }

  async consumeBAL(bal: BALJSONBlockAccessList, expectedStateRoot?: Uint8Array): Promise<void> {
    return consumeBALUtil(this, bal, expectedStateRoot)
  }

  getStateRoot(): Promise<Uint8Array> {
    throw EthereumJSErrorWithoutCode('Method not implemented.')
  }

  setStateRoot(): Promise<void> {
    throw EthereumJSErrorWithoutCode('Method not implemented.')
  }

  hasStateRoot(): Promise<boolean> {
    throw EthereumJSErrorWithoutCode('Method not implemented.')
  }

  /** Lookup by 32-byte account hash (snap sync). */
  getAccountByHash(accountHash: Uint8Array): Account | undefined {
    return this.readAccountKey(this.accountHashKey(accountHash))
  }

  putSnapAccountsBatch(
    entries: Array<{ accountHash: Uint8Array; account: Account; address?: Address }>,
  ): void {
    for (const { accountHash, account, address } of entries) {
      const key = this.accountHashKey(accountHash)
      if (address !== undefined) {
        this._hashToAddress.set(key, address)
      }
      this.writeAccountKey(key, account)
    }
  }

  /** Batch-ingest snap accounts already encoded as 104-byte binary records. */
  putSnapBinaryAccountsBatch(
    entries: Array<{ accountHash: Uint8Array; binaryAccount: BinaryAccount; address?: Address }>,
  ): void {
    for (const { accountHash, binaryAccount, address } of entries) {
      if (binaryAccount.length !== BINARY_ACCOUNT_SIZE) {
        throw EthereumJSErrorWithoutCode(
          `binaryAccount must be ${BINARY_ACCOUNT_SIZE} bytes, got ${binaryAccount.length}`,
        )
      }
      const key = this.accountHashKey(accountHash)
      if (address !== undefined) {
        this._hashToAddress.set(key, address)
      }
      const owned = new Uint8Array(BINARY_ACCOUNT_SIZE)
      owned.set(binaryAccount.subarray(0, BINARY_ACCOUNT_SIZE))
      this.writeBinaryAccountKey(key, owned)
    }
  }

  /**
   * Ingest a contiguous slab of verified snap rows (`32`-byte hash + `104`-byte binary each).
   */
  putSnapBinaryAccountsFromSlab(slab: Uint8Array): void {
    if (slab.length % SNAP_BINARY_ACCOUNT_SLAB_RECORD_SIZE !== 0) {
      throw EthereumJSErrorWithoutCode(
        `snap account slab length must be a multiple of ${SNAP_BINARY_ACCOUNT_SLAB_RECORD_SIZE}, got ${slab.length}`,
      )
    }
    for (let offset = 0; offset < slab.length; offset += SNAP_BINARY_ACCOUNT_SLAB_RECORD_SIZE) {
      const accountHash = slab.subarray(offset, offset + 32)
      const key = this.accountHashKey(accountHash)
      const owned = new Uint8Array(BINARY_ACCOUNT_SIZE)
      owned.set(slab.subarray(offset + 32, offset + SNAP_BINARY_ACCOUNT_SLAB_RECORD_SIZE))
      this.writeBinaryAccountKey(key, owned)
    }
  }

  /** Lookup by account hash without materializing an {@link Account}. */
  getBinaryAccountByHash(accountHash: Uint8Array): BinaryAccount | undefined {
    return this.readBinaryAccountKey(this.accountHashKey(accountHash))
  }

  putSnapStorageBatch(
    accountHash: Uint8Array,
    slots: Array<{ slotHash: Uint8Array; value: Uint8Array }>,
  ): void {
    const ah = this.accountHashKey(accountHash)
    for (const { slotHash, value } of slots) {
      const sk = this.storageKey(ah, bytesToUnprefixedHex(slotHash))
      this.writeStorageKey(sk, value)
    }
  }

  putCodeByHash(codeHash: Uint8Array, code: Uint8Array): void {
    this.writeCodeKey(bytesToUnprefixedHex(codeHash), code)
  }

  /** Bytecode blob keyed by snap `codeHash` (32 bytes). */
  getCodeByHash(codeHash: Uint8Array): Uint8Array | undefined {
    return this.readCodeKey(bytesToUnprefixedHex(codeHash))
  }

  accountCount(): number {
    if (this._parent === undefined) {
      return this._liveAccountCount
    }
    let n = this._parent.accountCount()
    for (const key of this._localAccountKeys) {
      const parentVisible = this._parent.readBinaryAccountKey(key) !== undefined
      const selfVisible = this.readBinaryAccountKey(key) !== undefined
      if (parentVisible && !selfVisible) n--
      else if (!parentVisible && selfVisible) n++
    }
    return n
  }

  sampleAccounts(opts?: {
    prefixHex?: string
    limit?: number
    sortByBalanceDesc?: boolean
  }): FlatAccountSample[] {
    const limit = opts?.limit ?? 20
    const prefix = opts?.prefixHex?.toLowerCase().replace(/^0x/, '') ?? ''
    const samples: FlatAccountSample[] = []
    const seen = new Set<string>()

    const collect = (sm: FlatStateManager) => {
      for (const shard of sm._accountShards) {
        for (const [k, binary] of shard) {
          if (binary === undefined || seen.has(k)) continue
          seen.add(k)
          const hashBytes = unprefixedHexToBytes(k)
          const hashHex = bytesToHex(hashBytes)
          if (prefix.length > 0 && !hashHex.toLowerCase().includes(prefix)) continue
          const account = binaryAccountToAccount(binary)
          samples.push({
            accountHash: hashBytes,
            address: sm._hashToAddress.get(k) ?? this._hashToAddress.get(k),
            account,
          })
          if (opts?.sortByBalanceDesc !== true && samples.length >= limit) {
            return
          }
        }
      }
      if (sm._parent !== undefined) collect(sm._parent)
    }
    collect(this)

    if (opts?.sortByBalanceDesc === true) {
      samples.sort((a, b) => (a.account.balance > b.account.balance ? -1 : 1))
    }
    return samples.slice(0, limit)
  }
}

/** Create a {@link FlatStateManager} for snap sync or lab execution. */
export function createFlatStateManager(opts: FlatStateManagerOpts = {}): FlatStateManager {
  return new FlatStateManager(opts)
}
