import type { BALInput } from '@ethereumjs/util'
import { equalsBytes } from '@ethereumjs/util'

import { ethyKeccak256 } from '../crypto/keccak.ts'
import type { SnapPivotStore } from '../persist/snapStore.ts'
import { enqueueProtocol } from '../runtime/lanes.ts'
import { CANONICAL_PIVOT_GRID_BLOCKS } from '../sync/blockCalendar.ts'
import { applyBalToBucketSubtree } from './balSubtreeApply.ts'
import { BucketSubtreeTrie } from './bucketSubtreeTrie.ts'
import {
  type BucketRootCandidates,
  assembleRootBranch,
  encodeRootBranch,
  noteSubtreeRootCandidate,
} from './rootBranchAssembler.ts'
import { SlabOverlayLeafStore } from './slabLeafStore.ts'
import { loadSortedSubtreeSlabRows } from './subtreeSlabBuild.ts'

const MAX_TRACKED_ANCHORS = 16

export type VerifiedAnchor = {
  anchorBlock: bigint
  stateRoot: Uint8Array
  rootNodeRlp: Uint8Array
  slots: Uint8Array[]
  byzantinePeerIds: string[]
}

export type SubtreeCustodyRegistryOpts = {
  localPeerIdHex: string
  buckets: readonly number[]
  dataDir?: string
  snapStore?: SnapPivotStore
  snapBootstrap?: boolean
  snapRootBranchRlp?: Uint8Array
  anchorGridBlocks?: bigint
  onByzantinePeers?: (anchorBlock: bigint, peerIds: string[]) => void
}

/** In-process coordinator for live custody subtree tries (WP-16f). */
export class SubtreeCustodyRegistry {
  private readonly _tries = new Map<number, BucketSubtreeTrie>()
  private readonly _verified = new Map<string, VerifiedAnchor>()
  private readonly _candidatesByAnchor = new Map<string, BucketRootCandidates>()
  private readonly _localSlotByAnchor = new Map<string, Map<number, Uint8Array>>()
  private readonly _builtFromSlab = new Set<number>()
  private readonly _scheduledSlabBuild = new Set<number>()
  private readonly _pendingBalQueue: Array<{ blockNumber: bigint; bal: BALInput }> = []
  private _trieBitmask = 0
  private readonly _localPeerIdHex: string
  private readonly _dataDir?: string
  private readonly _snapStore?: SnapPivotStore
  private readonly _snapBootstrap: boolean
  private readonly _anchorGridBlocks: bigint
  private readonly _onByzantinePeers?: (anchorBlock: bigint, peerIds: string[]) => void
  private _snapRootBranchRlp?: Uint8Array
  private _opChain: Promise<void> = Promise.resolve()

  constructor(opts: SubtreeCustodyRegistryOpts) {
    this._localPeerIdHex = opts.localPeerIdHex
    this._dataDir = opts.dataDir
    this._snapStore = opts.snapStore
    this._snapBootstrap = opts.snapBootstrap === true
    this._snapRootBranchRlp = opts.snapRootBranchRlp
    this._anchorGridBlocks = opts.anchorGridBlocks ?? CANONICAL_PIVOT_GRID_BLOCKS
    this._onByzantinePeers = opts.onByzantinePeers
    for (const b of opts.buckets) {
      this._tries.set(
        b,
        BucketSubtreeTrie.create({
          bucket: b,
          dataDir: opts.dataDir,
          leaves: opts.snapStore !== undefined ? new SlabOverlayLeafStore() : undefined,
        }),
      )
    }
  }

  static forTests(
    localPeerIdHex: string,
    buckets: readonly number[],
    extra?: Partial<SubtreeCustodyRegistryOpts>,
  ): SubtreeCustodyRegistry {
    return new SubtreeCustodyRegistry({ localPeerIdHex, buckets, ...extra })
  }

  setSnapRootBranchRlp(rlp: Uint8Array | undefined): void {
    this._snapRootBranchRlp = rlp
  }

  trie(b: number): BucketSubtreeTrie | undefined {
    return this._tries.get(b)
  }

  trieBucketsBitmask(): number {
    return this._trieBitmask
  }

  setArmedBucket(b: number, armed: boolean): void {
    if (armed) this._trieBitmask |= 1 << b
    else this._trieBitmask &= ~(1 << b)
  }

  private _enqueueOp<T>(fn: () => Promise<T>): Promise<T> {
    const next = this._opChain.then(fn, fn)
    this._opChain = next.then(
      () => undefined,
      () => undefined,
    )
    return next
  }

  private _candidateBook(anchorBlock: bigint): BucketRootCandidates {
    const key = anchorBlock.toString()
    let book = this._candidatesByAnchor.get(key)
    if (book === undefined) {
      book = new Map()
      this._candidatesByAnchor.set(key, book)
      while (this._candidatesByAnchor.size > MAX_TRACKED_ANCHORS) {
        const oldest = this._candidatesByAnchor.keys().next().value
        if (oldest === undefined) break
        this._candidatesByAnchor.delete(oldest)
        this._localSlotByAnchor.delete(oldest)
      }
    }
    return book
  }

  scheduleBuildFromSlabs(bucket: number): void {
    if (
      this._builtFromSlab.has(bucket) ||
      this._scheduledSlabBuild.has(bucket) ||
      this._snapStore === undefined
    ) {
      return
    }
    this._scheduledSlabBuild.add(bucket)
    enqueueProtocol(() => this._enqueueOp(() => this._buildFromSlabs(bucket)))
  }

  private async _buildFromSlabs(bucket: number): Promise<void> {
    if (this._builtFromSlab.has(bucket)) return
    const store = this._snapStore
    if (store === undefined) return

    const rows = await loadSortedSubtreeSlabRows(store, bucket)
    const leaves = new SlabOverlayLeafStore(rows)

    const rebuilt = await BucketSubtreeTrie.fromSortedLeaves({
      bucket,
      dataDir: this._dataDir,
      leaves,
      rows,
    })
    this._tries.set(bucket, rebuilt)
    this._builtFromSlab.add(bucket)

    const allBuilt = [...this._tries.keys()].every((b) => this._builtFromSlab.has(b))
    if (allBuilt && this._pendingBalQueue.length > 0) {
      const pending = this._pendingBalQueue.splice(0)
      for (const p of pending) {
        await this._applyVerifiedBalInternal(p.blockNumber, p.bal)
      }
    }
  }

  private async _applyVerifiedBalInternal(blockNumber: bigint, bal: BALInput): Promise<void> {
    for (const [, trie] of this._tries) {
      await applyBalToBucketSubtree(trie, bal, this._snapStore)
    }
    if (blockNumber % this._anchorGridBlocks === 0n) {
      this.captureLocalAnchor(blockNumber)
    }
  }

  applyVerifiedBal(blockNumber: bigint, bal: BALInput): Promise<void> {
    return this._enqueueOp(async () => {
      const awaitingSlab = [...this._tries.keys()].some((b) => !this._builtFromSlab.has(b))
      if (awaitingSlab && this._snapStore !== undefined) {
        this._pendingBalQueue.push({ blockNumber, bal })
        return
      }
      await this._applyVerifiedBalInternal(blockNumber, bal)
    })
  }

  /**
   * Capture reverse-diff snapshots and record local `h_b` candidates for live `anchorBlock`.
   * Must only be called when the tries are at `anchorBlock`.
   */
  captureLocalAnchor(anchorBlock: bigint): void {
    const key = anchorBlock.toString()
    if (this._localSlotByAnchor.has(key)) return
    const book = this._candidateBook(anchorBlock)
    const localSlots = new Map<number, Uint8Array>()
    for (const [b, trie] of this._tries) {
      trie.captureAnchor(anchorBlock)
      const slot = trie.branchSlotReference()
      if (slot.length === 32 || slot.length === 0) {
        noteSubtreeRootCandidate(book, b, this._localPeerIdHex, slot)
        localSlots.set(b, new Uint8Array(slot))
      }
    }
    this._localSlotByAnchor.set(key, localSlots)
  }

  notePeerSubtreeRoot(
    anchorBlock: bigint,
    bucket: number,
    peerIdHex: string,
    subtreeRootHash: Uint8Array,
  ): void {
    const book = this._candidateBook(anchorBlock)
    noteSubtreeRootCandidate(book, bucket, peerIdHex, subtreeRootHash)
  }

  verifyAnchor(anchorBlock: bigint, stateRoot: Uint8Array): Promise<VerifiedAnchor | undefined> {
    return this._enqueueOp(async () => {
      if (anchorBlock % this._anchorGridBlocks !== 0n) return undefined
      const key = anchorBlock.toString()
      const existing = this._verified.get(key)
      if (existing !== undefined && equalsBytes(existing.stateRoot, stateRoot)) {
        return existing
      }
      // If local tries have not yet captured this anchor and no newer anchor exists, capture now.
      if (!this._localSlotByAnchor.has(key)) {
        let hasNewer = false
        for (const k of this._localSlotByAnchor.keys()) {
          if (BigInt(k) > anchorBlock) {
            hasNewer = true
            break
          }
        }
        if (!hasNewer) {
          this.captureLocalAnchor(anchorBlock)
        }
      }

      const book = this._candidateBook(anchorBlock)
      const snapRlp = this._snapBootstrap ? this._snapRootBranchRlp : undefined
      const asm = assembleRootBranch(book, stateRoot, ethyKeccak256, snapRlp)
      if (!asm.ok) return undefined

      const rec: VerifiedAnchor = {
        anchorBlock,
        stateRoot: new Uint8Array(stateRoot),
        rootNodeRlp: asm.rootNodeRlp,
        slots: asm.slots,
        byzantinePeerIds: asm.byzantinePeerIds,
      }
      this._verified.set(key, rec)
      while (this._verified.size > MAX_TRACKED_ANCHORS) {
        const oldest = this._verified.keys().next().value
        if (oldest === undefined) break
        this._verified.delete(oldest)
      }

      const localSlots = this._localSlotByAnchor.get(key)
      for (let b = 0; b < 16; b++) {
        const trie = this._tries.get(b)
        if (trie === undefined) continue
        const local = localSlots?.get(b) ?? trie.branchSlotReference()
        const proven = asm.slots[b]!
        const match =
          local.length === proven.length && (local.length === 0 || equalsBytes(local, proven))
        this.setArmedBucket(b, match)
      }

      if (asm.byzantinePeerIds.length > 0) {
        this._onByzantinePeers?.(anchorBlock, asm.byzantinePeerIds)
      }
      return rec
    })
  }

  verifiedAnchor(anchorBlock: bigint): VerifiedAnchor | undefined {
    return this._verified.get(anchorBlock.toString())
  }

  /** Return the newest verified anchor with `anchorBlock >= minAnchor`. */
  latestVerifiedAnchorAtOrAbove(minAnchor: bigint): VerifiedAnchor | undefined {
    let best: VerifiedAnchor | undefined
    for (const rec of this._verified.values()) {
      if (rec.anchorBlock < minAnchor) continue
      if (best === undefined || rec.anchorBlock > best.anchorBlock) {
        best = rec
      }
    }
    return best
  }

  localSubtreeGossipEntries(
    anchorBlock: bigint,
  ): Array<{ bucketIndex: number; subtreeRootHash: Uint8Array }> {
    const key = anchorBlock.toString()
    const captured = this._localSlotByAnchor.get(key)
    const out: Array<{ bucketIndex: number; subtreeRootHash: Uint8Array }> = []
    if (captured !== undefined) {
      for (const [b, slot] of captured) {
        if (slot.length !== 32 && slot.length !== 0) continue
        out.push({ bucketIndex: b, subtreeRootHash: new Uint8Array(slot) })
      }
      return out.sort((a, b) => a.bucketIndex - b.bucketIndex)
    }
    for (const [b, trie] of this._tries) {
      const slot = trie.branchSlotReference()
      if (slot.length !== 32 && slot.length !== 0) continue
      out.push({ bucketIndex: b, subtreeRootHash: new Uint8Array(slot) })
    }
    return out.sort((a, b) => a.bucketIndex - b.bucketIndex)
  }

  static slotsFromClassicSubtrees(subtrees: BucketSubtreeTrie[]): Uint8Array[] {
    const slots: Uint8Array[] = []
    for (let n = 0; n < 16; n++) {
      slots.push(subtrees[n]!.branchSlotReference())
    }
    return slots
  }

  static rootRlpFromSlots(slots: Uint8Array[]): Uint8Array {
    return encodeRootBranch(slots)
  }

  static keccakRoot(slots: Uint8Array[]): Uint8Array {
    return ethyKeccak256(encodeRootBranch(slots))
  }
}
