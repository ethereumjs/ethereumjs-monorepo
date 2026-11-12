import {
  Account,
  Address,
  BINARY_ACCOUNT_SIZE,
  EthereumJSErrorWithoutCode,
  KECCAK256_NULL,
  KECCAK256_RLP,
  accountToBinaryAccount,
  binaryAccountToAccount,
  bytesToHex,
  bytesToUnprefixedHex,
  createAddressFromString,
  equalsBytes,
  hexToBigInt,
  hexToBytes,
  setLengthLeft,
  unprefixedHexToBytes,
} from '@ethereumjs/util'
import type { BinaryAccount } from '@ethereumjs/util'
import { keccak_256 } from '@noble/hashes/sha3.js'

import { BinaryAccountArena } from './binaryAccountArena.ts'
import { OriginalStorageCache } from './cache/originalStorageCache.ts'
import { consumeBAL as consumeBALUtil, mergeBALs } from './consumeBAL.ts'
import { modifyAccountFields } from './util.ts'

import type {
  AccountFields,
  Common,
  ConsumeBALOptions,
  StateManagerInterface,
} from '@ethereumjs/common'
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
/** Max in-memory code blobs retained after cold disk hydrate (Ethy restart path). */
const MAX_COLD_CODE_CACHE = 256
/** Max cold-hydrated storage keys retained after disk lookup (Ethy restart path). */
const MAX_COLD_STORAGE_CACHE = 4096

function accountShardIndex(key: string): number {
  return Number.parseInt(key.slice(0, 2), 16)
}

function createOverlayAccountShards(): Array<Map<string, Uint8Array | undefined>> {
  return Array.from({ length: ACCOUNT_SHARD_COUNT }, () => new Map())
}

function createSlotShards(): Array<Map<string, number>> {
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
  /** Root: hex key → arena slot. Child: overlay binary copies / tombstones. */
  private readonly _slotShards?: Array<Map<string, number>>
  private readonly _overlayAccountShards: Array<Map<string, Uint8Array | undefined>>
  private readonly _arena?: BinaryAccountArena
  private readonly _maxResidentAccounts?: number
  private readonly _coldAccountLookup?: (accountHash: Uint8Array) => Uint8Array | undefined
  private readonly _coldCodeLookup?: (codeHash: Uint8Array) => Uint8Array | undefined
  private readonly _coldStorageLookup?: (
    accountHash: Uint8Array,
    slotHash: Uint8Array,
  ) => Uint8Array | undefined
  /** Overlay keys written on a shallow copy (including tombstones). */
  private readonly _localAccountKeys = new Set<string>()
  private _logicalAccountCount = 0
  private _residentCount = 0
  private readonly _tombstones = new Set<string>()
  private readonly _pinnedKeys = new Set<string>()
  private readonly _unpinnedKeys = new Set<string>()
  private readonly _storage = new Map<string, Uint8Array>()
  private readonly _storageTombstones = new Set<string>()
  private readonly _code = new Map<string, Uint8Array>()
  private readonly _coldHydratedCodeKeys = new Set<string>()
  private readonly _coldHydratedStorageKeys = new Set<string>()
  private readonly _hashToAddress = new Map<string, Address>()
  private readonly _deltaStack: DeltaFrame[] = []
  private readonly _overlayFrames: DeltaFrame[] = []
  private readonly _keccak: (data: Uint8Array) => Uint8Array

  constructor(opts: FlatStateManagerOpts = {}, parent?: FlatStateManager) {
    this.common = opts.common ?? parent?.common
    this._parent = parent
    this._keccak = this.common?.customCrypto.keccak256 ?? keccak_256
    this.originalStorageCache = new OriginalStorageCache(this.getStorage.bind(this))
    if (parent === undefined) {
      this._slotShards = createSlotShards()
      this._arena = new BinaryAccountArena()
      this._maxResidentAccounts = opts.maxResidentAccounts
      this._coldAccountLookup = opts.coldAccountLookup
      this._coldCodeLookup = opts.coldCodeLookup
      this._coldStorageLookup = opts.coldStorageLookup
    }
    this._overlayAccountShards = createOverlayAccountShards()
  }

  private slotShard(key: string): Map<string, number> {
    return this._slotShards![accountShardIndex(key)]!
  }

  private overlayShard(key: string): Map<string, Uint8Array | undefined> {
    return this._overlayAccountShards[accountShardIndex(key)]!
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

  private pinKey(key: string): void {
    if (this._parent !== undefined) return
    this._pinnedKeys.delete(key)
    this._pinnedKeys.add(key)
    this._unpinnedKeys.delete(key)
    if (
      this._coldAccountLookup !== undefined &&
      this._maxResidentAccounts !== undefined &&
      this._maxResidentAccounts >= 64 &&
      this._pinnedKeys.size > Math.floor(this._maxResidentAccounts * 0.85)
    ) {
      const oldest = this._pinnedKeys.keys().next().value as string | undefined
      if (oldest !== undefined && oldest !== key) {
        this._pinnedKeys.delete(oldest)
        if (this._slotShards !== undefined && this.slotShard(oldest).has(oldest)) {
          this._unpinnedKeys.add(oldest)
        }
      }
    }
  }

  private readBinaryAccountKey(key: string): Uint8Array | undefined {
    if (this._parent !== undefined) {
      const shard = this.overlayShard(key)
      if (shard.has(key)) {
        const v = shard.get(key)
        return v === undefined ? undefined : new Uint8Array(v)
      }
      return this._parent.readBinaryAccountKey(key)
    }
    if (this._tombstones.has(key)) return undefined
    const slot = this.slotShard(key).get(key)
    if (slot !== undefined) {
      return this._arena!.copyOutOwned(slot)
    }
    if (this._coldAccountLookup !== undefined) {
      const hashBytes = unprefixedHexToBytes(key)
      const cold = this._coldAccountLookup(hashBytes)
      if (cold !== undefined && cold.length === BINARY_ACCOUNT_SIZE) {
        this.promoteColdToResident(key, cold)
        return new Uint8Array(cold)
      }
    }
    return undefined
  }

  private promoteColdToResident(key: string, binary: Uint8Array): void {
    if (this._slotShards === undefined) return
    const shard = this.slotShard(key)
    if (shard.has(key)) return
    const slot = this._arena!.alloc()
    this._arena!.write(slot, binary)
    shard.set(key, slot)
    this._residentCount++
    if (!this._pinnedKeys.has(key)) {
      this._unpinnedKeys.add(key)
    }
    this.maybeEvictResidents(key)
  }

  private assignOverlayAccountShard(key: string, binary: Uint8Array | undefined): void {
    this._localAccountKeys.add(key)
    const shard = this.overlayShard(key)
    if (binary === undefined) {
      shard.set(key, undefined)
    } else {
      shard.set(key, new Uint8Array(binary))
    }
  }

  private assignRootAccountShard(
    key: string,
    binary: Uint8Array | undefined,
    snapIngest: boolean,
  ): void {
    const shard = this.slotShard(key)
    const hadSlot = shard.has(key)
    if (binary === undefined) {
      if (hadSlot) {
        const slot = shard.get(key)!
        this._arena!.release(slot)
        shard.delete(key)
        this._residentCount--
        this._logicalAccountCount--
      }
      this._unpinnedKeys.delete(key)
      this._tombstones.add(key)
      return
    }
    this._tombstones.delete(key)
    let slot = shard.get(key)
    if (slot === undefined) {
      slot = this._arena!.alloc()
      shard.set(key, slot)
      this._residentCount++
      if (!this._pinnedKeys.has(key)) {
        this._unpinnedKeys.add(key)
      }
      if (snapIngest) {
        this._logicalAccountCount++
      }
    }
    this._arena!.write(slot, binary)
    if (snapIngest) {
      this.maybeEvictResidents()
    }
  }

  private maybeEvictResidents(exemptKey?: string): void {
    if (
      this._maxResidentAccounts === undefined ||
      this._deltaStack.length > 0 ||
      this._slotShards === undefined ||
      this._unpinnedKeys.size === 0
    ) {
      return
    }
    while (this._residentCount > this._maxResidentAccounts && this._unpinnedKeys.size > 0) {
      if (!this.evictOneUnpinned(exemptKey)) break
    }
  }

  private evictOneUnpinned(exemptKey?: string): boolean {
    if (this._slotShards === undefined || this._residentCount === 0) return false
    for (const key of this._unpinnedKeys) {
      if (this._pinnedKeys.has(key)) {
        this._unpinnedKeys.delete(key)
        continue
      }
      if (exemptKey !== undefined && key === exemptKey) continue
      this._unpinnedKeys.delete(key)
      const shard = this.slotShard(key)
      const slot = shard.get(key)
      if (slot !== undefined) {
        shard.delete(key)
        this._arena!.release(slot)
        this._residentCount--
        return true
      }
    }
    return false
  }

  private writeBinaryAccountKey(
    key: string,
    binary: Uint8Array | undefined,
    snapIngest: boolean,
  ): void {
    const frame = this.topFrame()
    if (frame !== undefined && !frame.accounts.has(key)) {
      const prior = this.readBinaryAccountKey(key)
      frame.accounts.set(key, prior === undefined ? undefined : new Uint8Array(prior))
    }
    if (this._parent !== undefined) {
      this.assignOverlayAccountShard(key, binary)
      return
    }
    if (binary !== undefined && !snapIngest) {
      const had = this.slotShard(key).has(key) || this._tombstones.has(key)
      if (!had) {
        this._logicalAccountCount++
      }
      this._tombstones.delete(key)
    }
    this.assignRootAccountShard(key, binary, snapIngest)
  }

  private writeAccountKey(key: string, account: Account | undefined): void {
    if (account === undefined) {
      this.writeBinaryAccountKey(key, undefined, false)
      return
    }
    this.pinKey(key)
    this.writeBinaryAccountKey(key, accountToBinaryAccount(account), false)
  }

  private readAccountKey(key: string): Account | undefined {
    const binary = this.readBinaryAccountKey(key)
    if (binary === undefined) return undefined
    return binaryAccountToAccount(binary)
  }

  private trimColdStorageCacheIfNeeded(): void {
    while (this._coldHydratedStorageKeys.size > MAX_COLD_STORAGE_CACHE) {
      const oldest = this._coldHydratedStorageKeys.keys().next().value as string | undefined
      if (oldest === undefined) break
      this._coldHydratedStorageKeys.delete(oldest)
      this._storage.delete(oldest)
    }
  }

  private hydrateStorageFromCold(key: string): Uint8Array | undefined {
    if (this._parent !== undefined || this._coldStorageLookup === undefined) return undefined
    const sep = key.indexOf(':')
    if (sep !== 64) return undefined
    const accountHashHex = key.slice(0, sep)
    const slotHashHex = key.slice(sep + 1)
    if (accountHashHex.length !== 64 || slotHashHex.length !== 64) return undefined
    const accountHash = unprefixedHexToBytes(accountHashHex)
    const slotHash = unprefixedHexToBytes(slotHashHex)
    const cold = this._coldStorageLookup(accountHash, slotHash)
    if (cold === undefined) return undefined
    const owned = new Uint8Array(cold)
    if (owned.length === 0) return owned
    this._storage.set(key, owned)
    this._coldHydratedStorageKeys.add(key)
    this.trimColdStorageCacheIfNeeded()
    return owned
  }

  private readStorageKey(key: string): Uint8Array | undefined {
    if (this._storageTombstones.has(key)) {
      return undefined
    }
    if (this._storage.has(key)) {
      return this._storage.get(key)
    }
    if (this._parent !== undefined) {
      return this._parent.readStorageKey(key)
    }
    return this.hydrateStorageFromCold(key)
  }

  private writeStorageKey(key: string, value: Uint8Array | undefined): void {
    const frame = this.topFrame()
    if (frame !== undefined && !frame.storage.has(key)) {
      frame.storage.set(key, this.readStorageKey(key))
    }
    if (value === undefined || value.length === 0) {
      this._storage.delete(key)
      this._coldHydratedStorageKeys.delete(key)
      if (this._parent !== undefined || this._coldStorageLookup !== undefined) {
        this._storageTombstones.add(key)
      }
    } else {
      this._storage.set(key, value)
      this._coldHydratedStorageKeys.delete(key)
      this._storageTombstones.delete(key)
    }
  }

  private trimColdCodeCacheIfNeeded(): void {
    while (this._coldHydratedCodeKeys.size > MAX_COLD_CODE_CACHE) {
      const oldest = this._coldHydratedCodeKeys.keys().next().value as string | undefined
      if (oldest === undefined) break
      this._coldHydratedCodeKeys.delete(oldest)
      this._code.delete(oldest)
    }
  }

  private hydrateCodeFromCold(hashBytes: Uint8Array, key: string): Uint8Array | undefined {
    if (this._parent !== undefined || this._coldCodeLookup === undefined) return undefined
    const cold = this._coldCodeLookup(hashBytes)
    if (cold === undefined) return undefined
    const owned = new Uint8Array(cold)
    this._code.set(key, owned)
    this._coldHydratedCodeKeys.add(key)
    this.trimColdCodeCacheIfNeeded()
    return owned
  }

  private readCodeKey(key: string): Uint8Array | undefined {
    if (this._code.has(key)) {
      return this._code.get(key)
    }
    if (this._parent !== undefined) {
      return this._parent.readCodeKey(key)
    }
    const hashBytes = unprefixedHexToBytes(key)
    return this.hydrateCodeFromCold(hashBytes, key)
  }

  private writeCodeKey(key: string, value: Uint8Array | undefined): void {
    const frame = this.topFrame()
    if (frame !== undefined && !frame.code.has(key)) {
      frame.code.set(key, this.readCodeKey(key))
    }
    if (value === undefined) {
      this._code.delete(key)
      this._coldHydratedCodeKeys.delete(key)
    } else {
      this._code.set(key, value)
      this._coldHydratedCodeKeys.delete(key)
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
    const key = this.accountHashHex(address)
    this._pinnedKeys.delete(key)
    await this.putAccount(address, undefined)
  }

  async modifyAccountFields(address: Address, accountFields: AccountFields): Promise<void> {
    this.pinKey(this.accountHashHex(address))
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
    this.pinKey(this.accountHashHex(address))
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
        this.assignOverlayAccountShard(k, v)
      }
      for (const [k, v] of frame.storage) {
        if (v === undefined) {
          this._storage.delete(k)
          if (this._parent !== undefined || this._coldStorageLookup !== undefined) {
            this._storageTombstones.add(k)
          }
        } else {
          this._storage.set(k, v)
          this._storageTombstones.delete(k)
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
      this.writeBinaryAccountKey(k, v, false)
    }
    for (const [k, v] of frame.storage) {
      if (v === undefined) {
        this._storage.delete(k)
        if (this._parent !== undefined || this._coldStorageLookup !== undefined) {
          this._storageTombstones.add(k)
        }
      } else {
        this._storage.set(k, v)
        this._storageTombstones.delete(k)
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

  /**
   * Overlay-only write set for sandbox microscopes ({@link FlatStateManager.shallowCopy} children).
   * Root managers return empty lists — no parent or disk scan.
   */
  overlayMutations(): {
    storage: { key: string; value?: Uint8Array }[]
    accounts: { key: string }[]
  } {
    if (this._parent === undefined) {
      return { storage: [], accounts: [] }
    }
    const storage: { key: string; value?: Uint8Array }[] = []
    for (const [key, value] of this._storage) {
      storage.push({ key, value })
    }
    for (const key of this._storageTombstones) {
      if (!this._storage.has(key)) {
        storage.push({ key, value: undefined })
      }
    }
    const accountKeys = new Set<string>()
    for (const shard of this._overlayAccountShards) {
      for (const key of shard.keys()) {
        accountKeys.add(key)
      }
    }
    for (const key of this._localAccountKeys) {
      accountKeys.add(key)
    }
    const accounts = [...accountKeys].map((key) => ({ key }))
    return { storage, accounts }
  }

  async consumeBAL(
    bal: BALJSONBlockAccessList,
    optsOrExpectedStateRoot?: Uint8Array | ConsumeBALOptions,
  ): Promise<void> {
    const opts =
      optsOrExpectedStateRoot instanceof Uint8Array
        ? { expectedStateRoot: optsOrExpectedStateRoot }
        : (optsOrExpectedStateRoot ?? {})
    if (opts.expectedStateRoot !== undefined || this._parent !== undefined) {
      return consumeBALUtil(this, bal, optsOrExpectedStateRoot)
    }
    const shouldApply = opts.shouldApplyAccount
    for (const acc of bal) {
      if (
        acc.balanceChanges.length === 0 &&
        acc.nonceChanges.length === 0 &&
        acc.codeChanges.length === 0 &&
        acc.storageChanges.length === 0
      ) {
        continue
      }
      const address = createAddressFromString(acc.address)
      if (shouldApply !== undefined && !shouldApply(address)) {
        continue
      }
      const ah = this.accountHashHex(address)
      this._hashToAddress.set(ah, address)

      const lastBalanceChange = acc.balanceChanges.at(-1)
      const balance =
        lastBalanceChange?.postBalance !== undefined
          ? hexToBigInt(lastBalanceChange.postBalance)
          : undefined
      const lastNonceChange = acc.nonceChanges.at(-1)
      const nonce =
        lastNonceChange?.postNonce !== undefined
          ? hexToBigInt(lastNonceChange.postNonce)
          : undefined
      const codeHex = acc.codeChanges.at(-1)?.newCode
      let newCodeHash: Uint8Array | undefined
      if (codeHex !== undefined) {
        const codeBytes = hexToBytes(codeHex)
        newCodeHash = this._keccak(codeBytes)
        this.writeCodeKey(bytesToUnprefixedHex(newCodeHash), codeBytes)
      }

      if (
        balance !== undefined ||
        nonce !== undefined ||
        newCodeHash !== undefined ||
        acc.storageChanges.length === 0
      ) {
        this.pinKey(ah)
        const existingAccount = this.readAccountKey(ah)
        const finalBalance = balance ?? existingAccount?.balance ?? 0n
        const finalNonce = nonce ?? existingAccount?.nonce ?? 0n
        const finalCodeHash = newCodeHash ?? existingAccount?.codeHash ?? KECCAK256_NULL
        const finalStorageRoot = existingAccount?.storageRoot ?? KECCAK256_RLP
        if (
          finalBalance === 0n &&
          finalNonce === 0n &&
          equalsBytes(finalCodeHash, KECCAK256_NULL) &&
          acc.storageChanges.length === 0
        ) {
          this._pinnedKeys.delete(ah)
          this.writeBinaryAccountKey(ah, undefined, false)
          continue
        }
        this.writeBinaryAccountKey(
          ah,
          accountToBinaryAccount(
            new Account(finalNonce, finalBalance, finalStorageRoot, finalCodeHash),
          ),
          false,
        )
      } else if (this._coldAccountLookup === undefined && !this.slotShard(ah).has(ah)) {
        this.pinKey(ah)
        this.writeBinaryAccountKey(ah, accountToBinaryAccount(new Account()), false)
      }

      for (const storage of acc.storageChanges) {
        const lastSlot = storage.slotChanges.at(-1)
        if (lastSlot === undefined) continue
        const slotKey = setLengthLeft(hexToBytes(storage.slot), 32)
        const slotVal = setLengthLeft(hexToBytes(lastSlot.postValue), 32)
        const sk = this.storageKey(ah, this.slotHashHex(slotKey))
        this.writeStorageKey(sk, slotVal.length === 0 ? undefined : slotVal)
      }
    }
  }

  async consumeBALBatch(
    accessLists: BALJSONBlockAccessList[],
    optsOrExpectedStateRoot?: Uint8Array | ConsumeBALOptions,
  ): Promise<void> {
    if (accessLists.length === 0) return
    if (accessLists.length === 1) {
      return this.consumeBAL(accessLists[0]!, optsOrExpectedStateRoot)
    }
    const merged = mergeBALs(accessLists)
    return this.consumeBAL(merged, optsOrExpectedStateRoot)
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
      const binary = accountToBinaryAccount(account)
      this.ingestSnapBinaryKey(key, accountHash, binary)
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
      this.ingestSnapBinaryKey(key, accountHash, binaryAccount)
    }
    if (this._parent === undefined) {
      this.maybeEvictResidents()
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
      const body = slab.subarray(offset + 32, offset + SNAP_BINARY_ACCOUNT_SLAB_RECORD_SIZE)
      this.ingestSnapBinaryKey(key, accountHash, body)
    }
    if (this._parent === undefined) {
      this.maybeEvictResidents()
    }
  }

  private ingestSnapBinaryKey(key: string, _accountHash: Uint8Array, binary: Uint8Array): void {
    const frame = this.topFrame()
    if (frame !== undefined && !frame.accounts.has(key)) {
      const prior = this.readBinaryAccountKey(key)
      frame.accounts.set(key, prior === undefined ? undefined : new Uint8Array(prior))
    }
    if (this._parent !== undefined) {
      this.assignOverlayAccountShard(key, binary)
      return
    }
    const shard = this.slotShard(key)
    const hadSlot = shard.has(key)
    if (!hadSlot && !this._tombstones.has(key)) {
      this._logicalAccountCount++
    }
    this._tombstones.delete(key)
    let slot = shard.get(key)
    if (slot === undefined) {
      slot = this._arena!.alloc()
      shard.set(key, slot)
      this._residentCount++
      if (!this._pinnedKeys.has(key)) {
        this._unpinnedKeys.add(key)
      }
    }
    this._arena!.write(slot, binary)
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

  /** Storage slot value keyed by `accountHash` (32B) and `slotHash` (32B), including cold disk hydrate. */
  getStorageByHash(accountHash: Uint8Array, slotHash: Uint8Array): Uint8Array | undefined {
    const sk = this.storageKey(this.accountHashKey(accountHash), bytesToUnprefixedHex(slotHash))
    return this.readStorageKey(sk)
  }

  /** Logical account total (includes cold-only snap rows). */
  accountCount(): number {
    if (this._parent === undefined) {
      return this._logicalAccountCount
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

  /** Hot resident accounts in arena pages (root only). */
  residentAccountCount(): number {
    if (this._slotShards === undefined) {
      return this._parent?.residentAccountCount() ?? 0
    }
    return this._residentCount
  }

  /** Set logical synced total after tail resume (does not double-count tail warmup). */
  setSyncedAccountCount(count: number): void {
    if (this._parent !== undefined) {
      this._parent.setSyncedAccountCount(count)
      return
    }
    this._logicalAccountCount = count
  }

  /** Reset all in-memory accounts, storage, and code when discarding a stale snap pivot. */
  clearAccountsAndStorage(): void {
    if (this._parent !== undefined) {
      this._parent.clearAccountsAndStorage()
      return
    }
    if (this._slotShards !== undefined && this._arena !== undefined) {
      for (const shard of this._slotShards) {
        for (const slot of shard.values()) {
          this._arena.release(slot)
        }
        shard.clear()
      }
    }
    for (const shard of this._overlayAccountShards) shard.clear()
    this._residentCount = 0
    this._logicalAccountCount = 0
    this._tombstones.clear()
    this._pinnedKeys.clear()
    this._unpinnedKeys.clear()
    this._hashToAddress.clear()
    this._storage.clear()
    this._storageTombstones.clear()
    this._code.clear()
    this._coldHydratedCodeKeys.clear()
    this._coldHydratedStorageKeys.clear()
    this._deltaStack.length = 0
    this._overlayFrames.length = 0
    this.originalStorageCache.clear()
  }

  /** Evict unpinned residents down to `maxKeep` (memory watchdog). Returns slots freed. */
  trimUnpinnedResident(maxKeep: number): number {
    if (this._slotShards === undefined || this._maxResidentAccounts === undefined) return 0
    let freed = 0
    while (this._residentCount > maxKeep) {
      if (!this.evictOneUnpinned()) break
      freed++
    }
    return freed
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

    const collectRoot = (sm: FlatStateManager) => {
      if (sm._slotShards === undefined) return
      for (const shard of sm._slotShards) {
        for (const [k, slot] of shard) {
          if (seen.has(k)) continue
          seen.add(k)
          const hashBytes = unprefixedHexToBytes(k)
          const hashHex = bytesToHex(hashBytes)
          if (prefix.length > 0 && !hashHex.toLowerCase().includes(prefix)) continue
          const binary = sm._arena!.copyOutOwned(slot)
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
    }

    const collectOverlay = (sm: FlatStateManager) => {
      for (const shard of sm._overlayAccountShards) {
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
      if (sm._parent !== undefined) {
        collectOverlay(sm._parent)
        collectRoot(sm._parent)
      }
    }

    if (this._parent === undefined) {
      collectRoot(this)
    } else {
      collectOverlay(this)
    }

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
