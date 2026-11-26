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
  private readonly _storageOpenOrder: string[] = []
  private readonly _storageBaseDir: string | undefined

  private constructor(bucket: number, account: BinaryPathMPT, dataDir?: string) {
    this.bucket = bucket
    this._account = account
    this._storageBaseDir =
      dataDir !== undefined ? `${dataDir}/tries/${bucket.toString(16)}/storage` : undefined
  }

  static create(opts: BucketSubtreeTrieOpts): BucketSubtreeTrie {
    const store = resolveAccountStore(opts)
    const account = new BinaryPathMPT({
      prefixNibbles: [opts.bucket],
      keccak256: ethyKeccak256,
      store,
      leaves: opts.leaves,
      maxAnchorSnapshots: opts.maxAnchorSnapshots ?? 4,
    })
    return new BucketSubtreeTrie(opts.bucket, account, opts.dataDir)
  }

  static async fromSortedLeaves(
    opts: BucketSubtreeTrieOpts & {
      rows:
        | AsyncIterable<{ key: Uint8Array; value: Uint8Array }>
        | { key: Uint8Array; value: Uint8Array }[]
    },
  ): Promise<BucketSubtreeTrie> {
    const store = resolveAccountStore(opts)
    const account = await BinaryPathMPT.buildFromSortedStream(opts.rows, {
      prefixNibbles: [opts.bucket],
      keccak256: ethyKeccak256,
      store,
      leaves: opts.leaves,
      maxAnchorSnapshots: opts.maxAnchorSnapshots ?? 4,
    })
    return new BucketSubtreeTrie(opts.bucket, account, opts.dataDir)
  }

  static async reopen(opts: BucketSubtreeTrieOpts): Promise<BucketSubtreeTrie> {
    const store = resolveAccountStore(opts)
    const account = await BinaryPathMPT.open({
      store,
      prefixNibbles: [opts.bucket],
      keccak256: ethyKeccak256,
      leaves: opts.leaves,
      maxAnchorSnapshots: opts.maxAnchorSnapshots ?? 4,
    })
    return new BucketSubtreeTrie(opts.bucket, account, opts.dataDir)
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
    return this._account.captureAnchor(anchorId)
  }

  releaseAnchor(anchorId: string | bigint): void {
    this._account.releaseAnchor(anchorId)
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

  private async _openStorageTrie(accountHash: Uint8Array): Promise<BinaryPathMPT> {
    const hex = bytesToUnprefixedHex(accountHash)
    let trie = this._storage.get(hex)
    if (trie !== undefined) {
      const idx = this._storageOpenOrder.indexOf(hex)
      if (idx >= 0) {
        this._storageOpenOrder.splice(idx, 1)
        this._storageOpenOrder.push(hex)
      }
      return trie
    }
    if (this._storageBaseDir !== undefined) {
      trie = await BinaryPathMPT.open({
        store: new DiskPathNodeStore(`${this._storageBaseDir}/${hex}/nodes`),
        keccak256: ethyKeccak256,
        maxAnchorSnapshots: 4,
      })
    } else {
      trie = new BinaryPathMPT({
        keccak256: ethyKeccak256,
        store: new InMemoryBinaryPathStore(),
        maxAnchorSnapshots: 4,
      })
    }
    this._storage.set(hex, trie)
    this._storageOpenOrder.push(hex)
    while (this._storageOpenOrder.length > MAX_HOT_STORAGE_TRIES) {
      const evict = this._storageOpenOrder.shift()
      if (evict !== undefined) this._storage.delete(evict)
    }
    return trie
  }

  async storageRootFor(accountHash: Uint8Array): Promise<Uint8Array> {
    const hex = bytesToUnprefixedHex(accountHash)
    const trie = this._storage.get(hex)
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
    if (equalsBytes(root, trie.EMPTY_TRIE_ROOT)) {
      this._storage.delete(bytesToUnprefixedHex(accountHash))
    }
    return root
  }

  getStorageTrie(accountHash: Uint8Array): BinaryPathMPT | undefined {
    return this._storage.get(bytesToUnprefixedHex(accountHash))
  }
}
