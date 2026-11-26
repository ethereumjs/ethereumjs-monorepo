import {
  Account,
  Address,
  type BALInput,
  BINARY_ACCOUNT_SIZE,
  EthereumJSErrorWithoutCode,
  KECCAK256_NULL,
  KECCAK256_RLP,
  accountToBinaryAccount,
  binaryAccountToAccount,
  bytesToBigInt,
  bytesToHex,
  bytesToUnprefixedHex,
  createAddressFromString,
  decodeBALToBinary,
  equalsBytes,
  getBinaryAccountBalance,
  getBinaryAccountCodeHash,
  getBinaryAccountNonce,
  getBinaryAccountStorageRoot,
  hexToBigInt,
  hexToBytes,
  mergeBALsBinary,
  setBinaryAccountBalance,
  setBinaryAccountCodeHash,
  setBinaryAccountNonce,
  setBinaryAccountStorageRoot,
  setLengthLeft,
  unprefixedHexToBytes,
} from '@ethereumjs/util'
import type { BinaryAccount, CompactBinaryBAL } from '@ethereumjs/util'
import { keccak_256 } from '@noble/hashes/sha3.js'

import { BinaryAccountArena } from './binaryAccountArena.ts'
import { OriginalStorageCache } from './cache/originalStorageCache.ts'
import {
  consumeBALBatch as consumeBALBatchUtil,
  consumeBAL as consumeBALUtil,
} from './consumeBAL.ts'
import { modifyAccountFields } from './util.ts'

import type {
  AccountFields,
  Common,
  ConsumeBALOptions,
  StateManagerInterface,
} from '@ethereumjs/common'
import type { PrefixedHexString } from '@ethereumjs/util'
import {
  type AccountMissResult,
  type CodeMissResult,
  StateMissUnavailableError,
  type StateResolutionPolicy,
  type StorageMissResult,
} from './stateMiss.ts'
import type { FlatStateManagerOpts } from './types.ts'

const DEFAULT_CLOSED_BUCKETS_MASK = 0xffff
const MAX_PROVEN_EMPTY_ACCOUNTS = 65_536
const MAX_PROVEN_EMPTY_STORAGE = 262_144

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
  private readonly _coldAccountBatchLookup?: (
    accountHashes: Uint8Array[],
  ) => Promise<Map<string, Uint8Array | undefined>>
  private readonly _batchColdMisses = new Set<string>()
  private readonly _binaryAccountScratch = new Uint8Array(BINARY_ACCOUNT_SIZE)
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
  private _closedBucketsMask: number
  private _resolutionPolicy: StateResolutionPolicy
  private readonly _resolveAccountMiss?: (
    accountHash: Uint8Array,
    policy: StateResolutionPolicy,
  ) => Promise<AccountMissResult>
  private readonly _resolveStorageMiss?: (
    accountHash: Uint8Array,
    slotHash: Uint8Array,
    policy: StateResolutionPolicy,
  ) => Promise<StorageMissResult>
  private readonly _resolveCodeMiss?: (
    codeHash: Uint8Array,
    policy: StateResolutionPolicy,
  ) => Promise<CodeMissResult>
  private readonly _provenEmptyAccounts = new Set<string>()
  private readonly _provenEmptyAccountOrder: string[] = []
  private readonly _provenEmptyStorage = new Set<string>()
  private readonly _provenEmptyStorageOrder: string[] = []
  private readonly _accountMissInflight = new Map<string, Promise<AccountMissResult>>()
  private readonly _storageMissInflight = new Map<string, Promise<StorageMissResult>>()
  private readonly _codeMissInflight = new Map<string, Promise<CodeMissResult>>()

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
      this._coldAccountBatchLookup = opts.coldAccountBatchLookup
      this._coldCodeLookup = opts.coldCodeLookup
      this._coldStorageLookup = opts.coldStorageLookup
      this._closedBucketsMask = opts.closedBucketsMask ?? DEFAULT_CLOSED_BUCKETS_MASK
      this._resolveAccountMiss = opts.resolveAccountMiss
      this._resolveStorageMiss = opts.resolveStorageMiss
      this._resolveCodeMiss = opts.resolveCodeMiss
    } else {
      this._closedBucketsMask = parent._closedBucketsMask
      this._resolveAccountMiss = undefined
      this._resolveStorageMiss = undefined
      this._resolveCodeMiss = undefined
    }
    this._resolutionPolicy = opts.resolutionPolicy ?? parent?._resolutionPolicy ?? 'full'
    this._overlayAccountShards = createOverlayAccountShards()
  }

  /** Root manager (mask, hooks, proven-empty tombstones). */
  root(): FlatStateManager {
    let cur: FlatStateManager = this
    while (cur._parent !== undefined) cur = cur._parent
    return cur
  }

  effectivePolicy(): StateResolutionPolicy {
    return this._resolutionPolicy
  }

  closedBucketsMask(): number {
    return this.root()._closedBucketsMask
  }

  setClosedBucketsMask(mask: number): void {
    if (this._parent !== undefined) {
      this.root().setClosedBucketsMask(mask)
      return
    }
    this._closedBucketsMask = mask & 0xffff
  }

  markBucketClosed(bucketIndex: number): void {
    if (bucketIndex < 0 || bucketIndex > 15) return
    if (this._parent !== undefined) {
      this.root().markBucketClosed(bucketIndex)
      return
    }
    this._closedBucketsMask |= 1 << bucketIndex
  }

  private bucketClosedForHash(accountHash: Uint8Array): boolean {
    if (accountHash.length === 0) return true
    const bucket = accountHash[0]! >> 4
    return (this.closedBucketsMask() & (1 << bucket)) !== 0
  }

  private isProvenEmptyAccountKey(key: string): boolean {
    return this.root()._provenEmptyAccounts.has(key)
  }

  private isProvenEmptyStorageKey(storageKey: string): boolean {
    return this.root()._provenEmptyStorage.has(storageKey)
  }

  markAccountEmpty(accountHash: Uint8Array): void {
    if (this._parent !== undefined) {
      this.root().markAccountEmpty(accountHash)
      return
    }
    const key = this.accountHashKey(accountHash)
    this.touchProvenEmpty(
      this._provenEmptyAccounts,
      this._provenEmptyAccountOrder,
      key,
      MAX_PROVEN_EMPTY_ACCOUNTS,
    )
  }

  markStorageEmpty(accountHash: Uint8Array, slotHash: Uint8Array): void {
    if (this._parent !== undefined) {
      this.root().markStorageEmpty(accountHash, slotHash)
      return
    }
    const sk = this.storageKey(this.accountHashKey(accountHash), bytesToUnprefixedHex(slotHash))
    this.touchProvenEmpty(
      this._provenEmptyStorage,
      this._provenEmptyStorageOrder,
      sk,
      MAX_PROVEN_EMPTY_STORAGE,
    )
  }

  private touchProvenEmpty(set: Set<string>, order: string[], key: string, cap: number): void {
    if (set.has(key)) return
    set.add(key)
    order.push(key)
    while (order.length > cap) {
      const drop = order.shift()
      if (drop !== undefined) set.delete(drop)
    }
  }

  private hasAccountTombstone(key: string): boolean {
    let cur: FlatStateManager | undefined = this
    while (cur !== undefined) {
      if (cur._tombstones.has(key)) return true
      cur = cur._parent
    }
    return false
  }

  private hasStorageTombstone(storageKey: string): boolean {
    let cur: FlatStateManager | undefined = this
    while (cur !== undefined) {
      if (cur._storageTombstones.has(storageKey)) return true
      cur = cur._parent
    }
    return false
  }

  private async coalesceAccountMiss(
    accountHash: Uint8Array,
    policy: StateResolutionPolicy,
  ): Promise<AccountMissResult> {
    const root = this.root()
    const inflightKey = `${policy}:${this.accountHashKey(accountHash)}`
    const existing = root._accountMissInflight.get(inflightKey)
    if (existing !== undefined) return existing
    const resolver = root._resolveAccountMiss
    if (resolver === undefined) return undefined
    const flight = resolver(accountHash, policy).finally(() => {
      root._accountMissInflight.delete(inflightKey)
    })
    root._accountMissInflight.set(inflightKey, flight)
    return flight
  }

  private async coalesceStorageMiss(
    accountHash: Uint8Array,
    slotHash: Uint8Array,
    policy: StateResolutionPolicy,
  ): Promise<StorageMissResult> {
    const root = this.root()
    const sk = this.storageKey(this.accountHashKey(accountHash), bytesToUnprefixedHex(slotHash))
    const inflightKey = `${policy}:${sk}`
    const existing = root._storageMissInflight.get(inflightKey)
    if (existing !== undefined) return existing
    const resolver = root._resolveStorageMiss
    if (resolver === undefined) return undefined
    const flight = resolver(accountHash, slotHash, policy).finally(() => {
      root._storageMissInflight.delete(inflightKey)
    })
    root._storageMissInflight.set(inflightKey, flight)
    return flight
  }

  private async coalesceCodeMiss(
    codeHash: Uint8Array,
    policy: StateResolutionPolicy,
  ): Promise<CodeMissResult> {
    const root = this.root()
    const inflightKey = `${policy}:${bytesToUnprefixedHex(codeHash)}`
    const existing = root._codeMissInflight.get(inflightKey)
    if (existing !== undefined) return existing
    const resolver = root._resolveCodeMiss
    if (resolver === undefined) return undefined
    const flight = resolver(codeHash, policy).finally(() => {
      root._codeMissInflight.delete(inflightKey)
    })
    root._codeMissInflight.set(inflightKey, flight)
    return flight
  }

  private commitResolvedAccountBinary(key: string, binary: Uint8Array): void {
    this.root().writeBinaryAccountKey(key, binary, false)
  }

  private commitResolvedStorage(storageKey: string, value: Uint8Array): void {
    this.root().writeStorageKey(storageKey, value)
  }

  private commitResolvedCode(codeHashHex: string, code: Uint8Array): void {
    this.root().writeCodeKey(codeHashHex, code)
  }

  private clearProvenEmptyAccount(key: string): void {
    const root = this.root()
    if (root._provenEmptyAccounts.delete(key)) {
      const idx = root._provenEmptyAccountOrder.indexOf(key)
      if (idx >= 0) root._provenEmptyAccountOrder.splice(idx, 1)
    }
  }

  private clearProvenEmptyStorage(storageKey: string): void {
    const root = this.root()
    if (root._provenEmptyStorage.delete(storageKey)) {
      const idx = root._provenEmptyStorageOrder.indexOf(storageKey)
      if (idx >= 0) root._provenEmptyStorageOrder.splice(idx, 1)
    }
  }

  private async resolveAccountIfMissing(key: string, accountHash: Uint8Array): Promise<void> {
    if (this.readAccountKey(key) !== undefined) return
    if (this.hasAccountTombstone(key)) return
    const root = this.root()
    if (root.bucketClosedForHash(accountHash)) return
    if (root.isProvenEmptyAccountKey(key)) return
    const policy = this.effectivePolicy()
    if (policy === 'local-only') {
      throw new StateMissUnavailableError('account', accountHash)
    }
    const result = await this.coalesceAccountMiss(accountHash, policy)
    if (result === undefined) {
      throw new StateMissUnavailableError('account', accountHash)
    }
    if (result === 'empty') {
      root.markAccountEmpty(accountHash)
      return
    }
    if (result.length !== BINARY_ACCOUNT_SIZE) {
      throw new StateMissUnavailableError(
        'account',
        accountHash,
        'invalid account bytes from resolver',
      )
    }
    this.clearProvenEmptyAccount(key)
    this.commitResolvedAccountBinary(key, result)
  }

  private async resolveStorageIfMissing(
    accountHash: Uint8Array,
    slotHash: Uint8Array,
    storageKey: string,
  ): Promise<void> {
    if (this.readStorageKey(storageKey) !== undefined) return
    if (this.hasStorageTombstone(storageKey)) return
    const root = this.root()
    if (root.bucketClosedForHash(accountHash)) return
    if (root.isProvenEmptyStorageKey(storageKey)) return
    const policy = this.effectivePolicy()
    if (policy === 'local-only') {
      throw new StateMissUnavailableError('storage', slotHash)
    }
    const result = await this.coalesceStorageMiss(accountHash, slotHash, policy)
    if (result === undefined) {
      throw new StateMissUnavailableError('storage', slotHash)
    }
    if (result === 'empty') {
      root.markStorageEmpty(accountHash, slotHash)
      return
    }
    this.clearProvenEmptyStorage(storageKey)
    this.commitResolvedStorage(storageKey, result)
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
    if (this._batchColdMisses.has(key)) {
      return undefined
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
    const key = this.accountHashHex(address)
    const hit = this.readAccountKey(key)
    if (hit !== undefined) return hit
    const accountHash = this._keccak(address.bytes)
    await this.resolveAccountIfMissing(key, accountHash)
    return this.readAccountKey(key)
  }

  async putAccount(address: Address, account?: Account): Promise<void> {
    const key = this.accountHashHex(address)
    this._hashToAddress.set(key, address)
    if (this._parent === undefined && account !== undefined) {
      this.clearProvenEmptyAccount(key)
    }
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
    const hit = this.readCodeKey(codeHashHex)
    if (hit !== undefined) return hit
    const accountHash = this._keccak(address.bytes)
    if (this.root().bucketClosedForHash(accountHash)) {
      return new Uint8Array(0)
    }
    const policy = this.effectivePolicy()
    if (policy === 'local-only') {
      throw new StateMissUnavailableError('code', account.codeHash)
    }
    const resolved = await this.coalesceCodeMiss(account.codeHash, policy)
    if (resolved === undefined) {
      throw new StateMissUnavailableError('code', account.codeHash)
    }
    this.commitResolvedCode(codeHashHex, resolved)
    return resolved
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
    const accountHash = this._keccak(address.bytes)
    const ah = this.accountHashHex(address)
    const slotHash = unprefixedHexToBytes(this.slotHashHex(key))
    const sk = this.storageKey(ah, this.slotHashHex(key))
    const hit = this.readStorageKey(sk)
    if (hit !== undefined) return hit
    if (this.root().bucketClosedForHash(accountHash)) {
      return new Uint8Array(0)
    }
    if (equalsBytes(account.storageRoot, KECCAK256_RLP)) {
      return new Uint8Array(0)
    }
    if (this.root().isProvenEmptyStorageKey(sk)) {
      return new Uint8Array(0)
    }
    await this.resolveStorageIfMissing(accountHash, slotHash, sk)
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
    if (this._parent === undefined) {
      if (value.length === 0) {
        const accountHash = this._keccak(address.bytes)
        const slotHash = unprefixedHexToBytes(this.slotHashHex(key))
        this.markStorageEmpty(accountHash, slotHash)
      } else {
        this.clearProvenEmptyStorage(sk)
      }
    }
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

  shallowCopy(
    downlevelCachesOrOpts?: boolean | { resolutionPolicy?: StateResolutionPolicy },
  ): StateManagerInterface {
    if (
      typeof downlevelCachesOrOpts === 'object' &&
      downlevelCachesOrOpts !== null &&
      'resolutionPolicy' in downlevelCachesOrOpts
    ) {
      return new FlatStateManager(
        { common: this.common, resolutionPolicy: downlevelCachesOrOpts.resolutionPolicy },
        this,
      )
    }
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

  /** Prefetch cold journal rows into the resident arena (hash keys are unprefixed hex). */
  hydrateColdAccountsBatch(entries: Iterable<[string, Uint8Array | undefined]>): void {
    for (const [key, binary] of entries) {
      if (binary === undefined || binary.length !== BINARY_ACCOUNT_SIZE) {
        this._batchColdMisses.add(key)
        continue
      }
      this.promoteColdToResident(key, binary)
    }
  }

  private async prefetchColdHashes(hashes: Uint8Array[]): Promise<void> {
    if (this._coldAccountBatchLookup === undefined || hashes.length === 0) return
    const resolved = await this._coldAccountBatchLookup(hashes)
    for (const [key, binary] of resolved) {
      if (binary === undefined) {
        this._batchColdMisses.add(key)
      } else {
        this.promoteColdToResident(key, binary)
      }
    }
  }

  private async applyCompactBinaryBAL(
    compact: CompactBinaryBAL,
    shouldApply?: (address: Address) => boolean,
  ): Promise<void> {
    if (compact.length === 0) return
    const prepared: Array<{
      acc: CompactBinaryBAL[number]
      address: Address
      ah: string
      needsAccountRead: boolean
    }> = []
    const coldHashes: Uint8Array[] = []
    const seenCold = new Set<string>()

    for (const acc of compact) {
      const address = new Address(acc.address)
      if (shouldApply !== undefined && !shouldApply(address)) continue
      const ahBytes = this._keccak(acc.address)
      const ah = bytesToUnprefixedHex(ahBytes)
      const needsAccountRead =
        acc.balance !== undefined ||
        acc.nonce !== undefined ||
        acc.code !== undefined ||
        acc.storageChanges.length === 0
      prepared.push({ acc, address, ah, needsAccountRead })
      if (
        needsAccountRead &&
        this._coldAccountBatchLookup !== undefined &&
        !this.slotShard(ah).has(ah) &&
        !this._batchColdMisses.has(ah) &&
        !seenCold.has(ah)
      ) {
        seenCold.add(ah)
        coldHashes.push(ahBytes)
      }
    }

    try {
      await this.prefetchColdHashes(coldHashes)
      const scratch = this._binaryAccountScratch
      for (const { acc, address, ah, needsAccountRead } of prepared) {
        this._hashToAddress.set(ah, address)

        let newCodeHash: Uint8Array | undefined
        if (acc.code !== undefined) {
          if (acc.code.length === 0) {
            newCodeHash = KECCAK256_NULL
          } else {
            newCodeHash = this._keccak(acc.code)
            this.writeCodeKey(bytesToUnprefixedHex(newCodeHash), acc.code)
          }
        }

        const balance =
          acc.balance !== undefined
            ? acc.balance.length === 0
              ? 0n
              : bytesToBigInt(acc.balance)
            : undefined
        const nonce =
          acc.nonce !== undefined
            ? acc.nonce.length === 0
              ? 0n
              : bytesToBigInt(acc.nonce)
            : undefined

        if (needsAccountRead) {
          this.pinKey(ah)
          const existingBinary = this.readBinaryAccountKey(ah)
          const finalBalance =
            balance ?? (existingBinary ? getBinaryAccountBalance(existingBinary) : 0n)
          const finalNonce = nonce ?? (existingBinary ? getBinaryAccountNonce(existingBinary) : 0n)
          const finalCodeHash =
            newCodeHash ??
            (existingBinary ? getBinaryAccountCodeHash(existingBinary) : KECCAK256_NULL)
          const finalStorageRoot = existingBinary
            ? getBinaryAccountStorageRoot(existingBinary)
            : KECCAK256_RLP
          if (
            finalBalance === 0n &&
            finalNonce === 0n &&
            equalsBytes(finalCodeHash, KECCAK256_NULL) &&
            acc.storageChanges.length === 0
          ) {
            this._pinnedKeys.delete(ah)
            this.markAccountEmpty(unprefixedHexToBytes(ah))
            this.writeBinaryAccountKey(ah, undefined, false)
            continue
          }
          setBinaryAccountNonce(scratch, finalNonce)
          setBinaryAccountBalance(scratch, finalBalance)
          setBinaryAccountStorageRoot(scratch, finalStorageRoot)
          setBinaryAccountCodeHash(scratch, finalCodeHash)
          this.clearProvenEmptyAccount(ah)
          this.writeBinaryAccountKey(ah, new Uint8Array(scratch), false)
        } else if (this._coldAccountLookup === undefined && !this.slotShard(ah).has(ah)) {
          this.pinKey(ah)
          this.clearProvenEmptyAccount(ah)
          this.writeBinaryAccountKey(ah, accountToBinaryAccount(new Account()), false)
        }

        for (const [slotKey, slotVal] of acc.storageChanges) {
          const slotKey32 = setLengthLeft(slotKey, 32)
          const slotHashHex = this.slotHashHex(slotKey32)
          const sk = this.storageKey(ah, slotHashHex)
          if (slotVal.length === 0) {
            this.markStorageEmpty(unprefixedHexToBytes(ah), unprefixedHexToBytes(slotHashHex))
          } else {
            this.clearProvenEmptyStorage(sk)
          }
          this.writeStorageKey(sk, slotVal.length === 0 ? undefined : setLengthLeft(slotVal, 32))
        }
      }
    } finally {
      this._batchColdMisses.clear()
    }
  }

  async consumeBAL(
    bal: BALInput,
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
    const compact = decodeBALToBinary(bal)
    await this.applyCompactBinaryBAL(compact, shouldApply)
  }

  async consumeBALBatch(
    accessLists: BALInput[],
    optsOrExpectedStateRoot?: Uint8Array | ConsumeBALOptions,
  ): Promise<void> {
    if (accessLists.length === 0) return
    const opts =
      optsOrExpectedStateRoot instanceof Uint8Array
        ? { expectedStateRoot: optsOrExpectedStateRoot }
        : (optsOrExpectedStateRoot ?? {})
    if (opts.expectedStateRoot !== undefined || this._parent !== undefined) {
      return consumeBALBatchUtil(this, accessLists, optsOrExpectedStateRoot)
    }
    if (accessLists.length === 1) {
      return this.consumeBAL(accessLists[0]!, optsOrExpectedStateRoot)
    }
    const compact = mergeBALsBinary(accessLists)
    await this.applyCompactBinaryBAL(compact, opts.shouldApplyAccount)
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
    this._provenEmptyAccounts.clear()
    this._provenEmptyAccountOrder.length = 0
    this._provenEmptyStorage.clear()
    this._provenEmptyStorageOrder.length = 0
    this._accountMissInflight.clear()
    this._storageMissInflight.clear()
    this._codeMissInflight.clear()
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
