import { RLP } from '@ethereumjs/rlp'
import { EthereumJSErrorWithoutCode, bytesToUnprefixedHex, equalsBytes } from '@ethereumjs/util'
import { keccak_256 } from '@noble/hashes/sha3.js'

import { PathBackedTrie } from './pathBackedTrie.ts'
import { compareKeysLex, packPath } from './pathKey.ts'
import {
  createMultiProof as buildMultiProof,
  createProof as buildProof,
  createRangeBoundaryProof as buildRangeProof,
} from './proofs.ts'
import { AnchorSnapshotRing } from './snapshots.ts'
import { InMemoryBinaryPathStore } from './store.ts'

import type { Proof } from '../types.ts'
import type { BinaryPathMPTOpts } from './types.ts'

export type BinaryPathBatchEntry = { key: Uint8Array; value: Uint8Array | null }

/**
 * Path-keyed Merkle Patricia trie — consensus-compatible roots and proofs, in-place path persistence.
 */
export class BinaryPathMPT {
  readonly EMPTY_TRIE_ROOT: Uint8Array
  private readonly _trie: PathBackedTrie
  private readonly _anchors: AnchorSnapshotRing
  private readonly _leaves: BinaryPathMPTOpts['leaves']
  private readonly _keccak: (data: Uint8Array) => Uint8Array

  constructor(opts: BinaryPathMPTOpts = {}) {
    this._keccak = opts.keccak256 ?? keccak_256
    this.EMPTY_TRIE_ROOT = this._keccak(RLP.encode(new Uint8Array(0)))
    this._anchors = new AnchorSnapshotRing(opts.maxAnchorSnapshots ?? 4)
    this._leaves = opts.leaves
    const store = opts.store ?? new InMemoryBinaryPathStore()
    this._trie = new PathBackedTrie(store, this._keccak, opts.prefixNibbles ?? [], this._anchors)
  }

  static async buildFromSortedStream(
    entries:
      | Iterable<{ key: Uint8Array; value: Uint8Array }>
      | AsyncIterable<{ key: Uint8Array; value: Uint8Array }>,
    opts?: BinaryPathMPTOpts,
  ): Promise<BinaryPathMPT> {
    const trie = new BinaryPathMPT(opts)
    const batch: BinaryPathBatchEntry[] = []
    if (Symbol.asyncIterator in Object(entries)) {
      for await (const row of entries as AsyncIterable<{ key: Uint8Array; value: Uint8Array }>) {
        batch.push({ key: row.key, value: row.value })
      }
    } else {
      for (const row of entries as Iterable<{ key: Uint8Array; value: Uint8Array }>) {
        batch.push({ key: row.key, value: row.value })
      }
    }
    batch.sort((a, b) => compareKeysLex(a.key, b.key))
    for (let i = 1; i < batch.length; i++) {
      if (compareKeysLex(batch[i - 1]!.key, batch[i]!.key) === 0) {
        throw EthereumJSErrorWithoutCode('Duplicate keys in sorted stream')
      }
    }
    await trie.applyBatch(batch)
    return trie
  }

  root(): Uint8Array {
    return this._trie.root()
  }

  branchSlotReference(): Uint8Array {
    if (equalsBytes(this._trie.root(), this.EMPTY_TRIE_ROOT)) {
      return new Uint8Array(0)
    }
    const rlp = this._trie.lastRootRlp
    if (rlp === null) {
      return this._trie.root()
    }
    if (rlp.length < 32) {
      return rlp
    }
    return this._trie.root()
  }

  async get(key: Uint8Array): Promise<Uint8Array | null> {
    this._trie.assertKeyMatchesPrefix(key)
    return this._trie.get(key, false)
  }

  async put(key: Uint8Array, value: Uint8Array): Promise<void> {
    this._guardLeavesWritable()
    this._trie.assertKeyMatchesPrefix(key)
    if (value.length === 0) {
      await this.del(key)
      return
    }
    await this._trie.put(key, value)
    if (equalsBytes(this._trie.root(), this.EMPTY_TRIE_ROOT)) {
      await this._trie.clearPathStore()
    }
  }

  async del(key: Uint8Array): Promise<void> {
    this._guardLeavesWritable()
    this._trie.assertKeyMatchesPrefix(key)
    await this._trie.del(key)
    if (equalsBytes(this._trie.root(), this.EMPTY_TRIE_ROOT)) {
      await this._trie.clearPathStore()
    }
  }

  async applyBatch(mutations: ReadonlyArray<BinaryPathBatchEntry>): Promise<Uint8Array> {
    this._guardLeavesWritable()
    const sorted = mutations.slice().sort((a, b) => compareKeysLex(a.key, b.key))
    const dedup = new Map<string, BinaryPathBatchEntry>()
    for (const m of sorted) {
      dedup.set(bytesToUnprefixedHex(m.key), m)
    }
    for (const m of dedup.values()) {
      this._trie.assertKeyMatchesPrefix(m.key)
      if (m.value === null || m.value.length === 0) {
        await this._trie.del(m.key)
      } else {
        await this._trie.put(m.key, m.value)
      }
    }
    if (equalsBytes(this._trie.root(), this.EMPTY_TRIE_ROOT)) {
      await this._trie.clearPathStore()
    }
    return this.root()
  }

  captureAnchor(anchorId: string | bigint): Uint8Array {
    const root = this.root()
    this._anchors.capture(anchorId, root)
    return root
  }

  releaseAnchor(anchorId: string | bigint): void {
    this._anchors.release(anchorId)
  }

  async createProof(key: Uint8Array, anchorId?: string | bigint): Promise<Proof> {
    return buildProof(this, key, anchorId)
  }

  async createMultiProof(keys: Uint8Array[], anchorId?: string | bigint): Promise<Proof> {
    return buildMultiProof(this, keys, anchorId)
  }

  async createRangeBoundaryProof(
    originHash32: Uint8Array,
    lastHash32: Uint8Array,
    anchorId?: string | bigint,
  ): Promise<Proof> {
    return buildRangeProof(this, originHash32, lastHash32, anchorId)
  }

  /** @internal */
  get _inner(): PathBackedTrie {
    return this._trie
  }

  /** @internal */
  get _anchorRing(): AnchorSnapshotRing {
    return this._anchors
  }

  private _guardLeavesWritable(): void {
    if (
      this._leaves !== undefined &&
      (this._leaves.put === undefined || this._leaves.del === undefined)
    ) {
      throw EthereumJSErrorWithoutCode('External leaf store is read-only')
    }
  }
}

export function createBinaryPathMPT(opts?: BinaryPathMPTOpts): BinaryPathMPT {
  return new BinaryPathMPT(opts)
}
