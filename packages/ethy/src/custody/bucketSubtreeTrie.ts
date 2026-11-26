import * as fs from 'node:fs/promises'
import * as path from 'node:path'

import {
  type BinaryPathBatchEntry,
  BinaryPathMPT,
  type BinaryPathNodeStore,
  type ExternalLeafStore,
  InMemoryBinaryPathStore,
} from '@ethereumjs/mpt'
import { bytesToUnprefixedHex, equalsBytes } from '@ethereumjs/util'

import { ethyKeccak256 } from '../crypto/keccak.ts'
import { DiskPathNodeStore } from './diskPathNodeStore.ts'
import { SlabOverlayLeafStore } from './slabLeafStore.ts'

export type BucketSubtreeTrieOpts = {
  bucket: number
  dataDir?: string
  store?: BinaryPathNodeStore
  leaves?: ExternalLeafStore
  maxAnchorSnapshots?: number
}

const MAX_HOT_STORAGE_TRIES = 64

function resolveAccountStore(opts: BucketSubtreeTrieOpts): BinaryPathNodeStore {
  if (opts.store !== undefined) return opts.store
  if (opts.dataDir !== undefined) {
    return new DiskPathNodeStore(`${opts.dataDir}/tries/${opts.bucket.toString(16)}/nodes`)
  }
  return new InMemoryBinaryPathStore()
}

/** Live `1/16th` account + per-contract storage tries for custody bucket `b` (WP-16f). */
export class BucketSubtreeTrie {
  readonly bucket: number
  private readonly _account: BinaryPathMPT
  private readonly _storage = new Map<string, BinaryPathMPT>()
  private readonly _storageBaseDir: string | undefined
  private readonly _maxAnchorSnapshots: number
  private readonly _activeAnchors: Array<string | bigint> = []

  private constructor(
    bucket: number,
    account: BinaryPathMPT,
    maxAnchorSnapshots: number,
    dataDir?: string,
  ) {
    this.bucket = bucket
    this._account = account
    this._maxAnchorSnapshots = maxAnchorSnapshots
    this._storageBaseDir =
      dataDir !== undefined ? `${dataDir}/tries/${bucket.toString(16)}/storage` : undefined
  }

  static create(opts: BucketSubtreeTrieOpts): BucketSubtreeTrie {
    const maxAnchors = opts.maxAnchorSnapshots ?? 4
    const store = resolveAccountStore(opts)
    const account = new BinaryPathMPT({
      prefixNibbles: [opts.bucket],
      keccak256: ethyKeccak256,
      store,
      leaves: opts.leaves,
      maxAnchorSnapshots: maxAnchors,
    })
    return new BucketSubtreeTrie(opts.bucket, account, maxAnchors, opts.dataDir)
  }

  static async fromSortedLeaves(
    opts: BucketSubtreeTrieOpts & {
      rows:
        | AsyncIterable<{ key: Uint8Array; value: Uint8Array }>
        | { key: Uint8Array; value: Uint8Array }[]
    },
  ): Promise<BucketSubtreeTrie> {
    const maxAnchors = opts.maxAnchorSnapshots ?? 4
    const store = resolveAccountStore(opts)
    const account = await BinaryPathMPT.buildFromSortedStream(opts.rows, {
      prefixNibbles: [opts.bucket],
      keccak256: ethyKeccak256,
      store,
      leaves: opts.leaves,
      maxAnchorSnapshots: maxAnchors,
    })
    return new BucketSubtreeTrie(opts.bucket, account, maxAnchors, opts.dataDir)
  }

  static async reopen(opts: BucketSubtreeTrieOpts): Promise<BucketSubtreeTrie> {
    const maxAnchors = opts.maxAnchorSnapshots ?? 4
    const store = resolveAccountStore(opts)
    const account = await BinaryPathMPT.open({
      store,
      prefixNibbles: [opts.bucket],
      keccak256: ethyKeccak256,
      leaves: opts.leaves,
      maxAnchorSnapshots: maxAnchors,
    })
    return new BucketSubtreeTrie(opts.bucket, account, maxAnchors, opts.dataDir)
  }

  static forTestBucket(bucket: number, leaves?: SlabOverlayLeafStore): BucketSubtreeTrie {
    return BucketSubtreeTrie.create({ bucket, leaves: leaves ?? new SlabOverlayLeafStore() })
  }

  accountTrie(): BinaryPathMPT {
    return this._account
  }

  branchSlotReference(): Uint8Array {
    return this._account.branchSlotReference()
  }

  captureAnchor(anchorId: string | bigint): Uint8Array {
    const root = this._account.captureAnchor(anchorId)
    for (const st of this._storage.values()) {
      st.captureAnchor(anchorId)
    }
    const existingIdx = this._activeAnchors.findIndex((id) => id === anchorId)
    if (existingIdx >= 0) {
      this._activeAnchors.splice(existingIdx, 1)
    }
    this._activeAnchors.push(anchorId)
    while (this._activeAnchors.length > this._maxAnchorSnapshots) {
      this._activeAnchors.shift()
    }
    return root
  }

  releaseAnchor(anchorId: string | bigint): void {
    this._account.releaseAnchor(anchorId)
    for (const st of this._storage.values()) {
      st.releaseAnchor(anchorId)
    }
    const idx = this._activeAnchors.findIndex((id) => id === anchorId)
    if (idx >= 0) this._activeAnchors.splice(idx, 1)
  }

  async applyAccountBatch(entries: ReadonlyArray<BinaryPathBatchEntry>): Promise<Uint8Array> {
    const filtered: BinaryPathBatchEntry[] = []
    for (const e of entries) {
      if (e.key.length < 1 || e.key[0]! >> 4 !== this.bucket) continue
      filtered.push(e)
    }
    if (filtered.length === 0) return this.branchSlotReference()
    return this._account.applyBatch(filtered)
  }

  private _touchStorageCache(hex: string, trie: BinaryPathMPT): void {
    this._storage.delete(hex)
    this._storage.set(hex, trie)
    // Only evict when disk-backed AND no live anchor snapshots are pinning reverse-diffs in RAM.
    if (this._storageBaseDir === undefined || this._activeAnchors.length > 0) return
    while (this._storage.size > MAX_HOT_STORAGE_TRIES) {
      const oldest = this._storage.keys().next().value
      if (oldest === undefined) break
      this._storage.delete(oldest)
    }
  }

  private _mirrorActiveAnchors(trie: BinaryPathMPT): void {
    for (const anchorId of this._activeAnchors) {
      trie.captureAnchor(anchorId)
    }
  }

  private _storageNodesDir(hex: string): string | undefined {
    return this._storageBaseDir !== undefined
      ? path.join(this._storageBaseDir, hex, 'nodes')
      : undefined
  }

  private async _diskStorageExists(hex: string): Promise<boolean> {
    const dir = this._storageNodesDir(hex)
    if (dir === undefined) return false
    try {
      await fs.access(path.join(dir, '00', '00.bin'))
      return true
    } catch {
      return false
    }
  }

  private async _openStorageTrie(accountHash: Uint8Array): Promise<BinaryPathMPT> {
    const hex = bytesToUnprefixedHex(accountHash)
    const cached = this._storage.get(hex)
    if (cached !== undefined) {
      this._touchStorageCache(hex, cached)
      return cached
    }
    const dir = this._storageNodesDir(hex)
    const trie =
      dir !== undefined
        ? await BinaryPathMPT.open({
            store: new DiskPathNodeStore(dir),
            keccak256: ethyKeccak256,
            maxAnchorSnapshots: this._maxAnchorSnapshots,
          })
        : new BinaryPathMPT({
            keccak256: ethyKeccak256,
            store: new InMemoryBinaryPathStore(),
            maxAnchorSnapshots: this._maxAnchorSnapshots,
          })
    this._mirrorActiveAnchors(trie)
    this._touchStorageCache(hex, trie)
    return trie
  }

  /**
   * Return an existing per-contract storage trie (checking disk when evicted from RAM cache),
   * or `undefined` if this contract has no tracked storage trie.
   */
  async openExistingStorageTrie(accountHash: Uint8Array): Promise<BinaryPathMPT | undefined> {
    const hex = bytesToUnprefixedHex(accountHash)
    const cached = this._storage.get(hex)
    if (cached !== undefined) {
      this._touchStorageCache(hex, cached)
      return cached
    }
    if (!(await this._diskStorageExists(hex))) return undefined
    return this._openStorageTrie(accountHash)
  }

  async storageRootFor(accountHash: Uint8Array): Promise<Uint8Array> {
    const trie = await this.openExistingStorageTrie(accountHash)
    if (trie === undefined) return this._account.EMPTY_TRIE_ROOT
    const root = trie.root()
    return equalsBytes(root, trie.EMPTY_TRIE_ROOT) ? this._account.EMPTY_TRIE_ROOT : root
  }

  async applyStorageBatch(
    accountHash: Uint8Array,
    mutations: ReadonlyArray<BinaryPathBatchEntry>,
  ): Promise<Uint8Array> {
    if (mutations.length === 0) return this.storageRootFor(accountHash)
    const trie = await this._openStorageTrie(accountHash)
    const root = await trie.applyBatch(mutations)
    if (equalsBytes(root, trie.EMPTY_TRIE_ROOT) && this._activeAnchors.length === 0) {
      this._storage.delete(bytesToUnprefixedHex(accountHash))
    }
    return root
  }

  getStorageTrie(accountHash: Uint8Array): BinaryPathMPT | undefined {
    return this._storage.get(bytesToUnprefixedHex(accountHash))
  }
}
