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
import { iterateSubtreeSlabRows } from './subtreeSlabBuild.ts'

export type VerifiedAnchor = {
  anchorBlock: bigint
  stateRoot: Uint8Array
  rootNodeRlp: Uint8Array
  slots: Uint8Array[]
}

export type SubtreeCustodyRegistryOpts = {
  localPeerIdHex: string
  buckets: readonly number[]
  dataDir?: string
  snapStore?: SnapPivotStore
  snapBootstrap?: boolean
  snapRootBranchRlp?: Uint8Array
}

/** In-process coordinator for live custody subtree tries (WP-16f). */
export class SubtreeCustodyRegistry {
  private readonly _tries = new Map<number, BucketSubtreeTrie>()
  private readonly _verified = new Map<string, VerifiedAnchor>()
  private readonly _builtFromSlab = new Set<number>()
  private readonly _pendingBals: Array<{ blockNumber: bigint; bal: BALInput }> = []
  private _trieBitmask = 0
  private readonly _candidates: BucketRootCandidates = new Map()
  private readonly _localPeerIdHex: string
  private readonly _dataDir?: string
  private readonly _snapStore?: SnapPivotStore
  private readonly _snapBootstrap: boolean
  private _snapRootBranchRlp?: Uint8Array

  constructor(opts: SubtreeCustodyRegistryOpts) {
    this._localPeerIdHex = opts.localPeerIdHex
    this._dataDir = opts.dataDir
    this._snapStore = opts.snapStore
    this._snapBootstrap = opts.snapBootstrap === true
    this._snapRootBranchRlp = opts.snapRootBranchRlp
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

  static forTests(localPeerIdHex: string, buckets: readonly number[]): SubtreeCustodyRegistry {
    return new SubtreeCustodyRegistry({ localPeerIdHex, buckets })
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

  scheduleBuildFromSlabs(bucket: number): void {
    if (this._builtFromSlab.has(bucket) || this._snapStore === undefined) return
    enqueueProtocol(() => this._buildFromSlabs(bucket))
  }

  private async _buildFromSlabs(bucket: number): Promise<void> {
    if (this._builtFromSlab.has(bucket)) return
    const store = this._snapStore
    if (store === undefined) return

    const leaves = new SlabOverlayLeafStore()
    const rows: Array<{ key: Uint8Array; value: Uint8Array }> = []
    for (const row of iterateSubtreeSlabRows(store, bucket)) {
      rows.push(row)
      await leaves.put(row.key, row.value)
    }
    rows.sort((a, b) => {
      for (let i = 0; i < 32; i++) {
        if (a.key[i]! !== b.key[i]!) return a.key[i]! - b.key[i]!
      }
      return 0
    })

    const rebuilt = await BucketSubtreeTrie.fromSortedLeaves({
      bucket,
      dataDir: this._dataDir,
      leaves,
      rows,
    })
    this._tries.set(bucket, rebuilt)
    this._builtFromSlab.add(bucket)

    const pending = this._pendingBals.splice(0)
    for (const p of pending) {
      await this.applyVerifiedBal(p.blockNumber, p.bal)
    }
    this._noteAllLocalCandidates()
  }

  private _noteAllLocalCandidates(): void {
    for (const [b, trie] of this._tries) {
      const slot = trie.branchSlotReference()
      if (slot.length === 32) {
        noteSubtreeRootCandidate(this._candidates, b, this._localPeerIdHex, slot)
      }
      void b
    }
  }

  async applyVerifiedBal(blockNumber: bigint, bal: BALInput): Promise<void> {
    const awaitingSlab = [...this._tries.keys()].some((b) => !this._builtFromSlab.has(b))
    if (awaitingSlab && this._snapStore !== undefined) {
      this._pendingBals.push({ blockNumber, bal })
      return
    }
    for (const [b, trie] of this._tries) {
      await applyBalToBucketSubtree(trie, bal, this._snapStore)
      const slot = trie.branchSlotReference()
      if (slot.length === 32) {
        noteSubtreeRootCandidate(this._candidates, b, this._localPeerIdHex, slot)
      }
      void b
    }
    if (blockNumber % CANONICAL_PIVOT_GRID_BLOCKS === 0n) {
      void blockNumber
    }
  }

  notePeerSubtreeRoot(
    anchorBlock: bigint,
    bucket: number,
    peerIdHex: string,
    subtreeRootHash: Uint8Array,
  ): void {
    noteSubtreeRootCandidate(this._candidates, bucket, peerIdHex, subtreeRootHash)
    void anchorBlock
  }

  async verifyAnchor(
    anchorBlock: bigint,
    stateRoot: Uint8Array,
  ): Promise<VerifiedAnchor | undefined> {
    if (anchorBlock % CANONICAL_PIVOT_GRID_BLOCKS !== 0n) return undefined
    this.seedCandidatesFromLocalTries(anchorBlock)
    const snapRlp = this._snapBootstrap ? this._snapRootBranchRlp : undefined
    const asm = assembleRootBranch(this._candidates, stateRoot, ethyKeccak256, snapRlp)
    if (!asm.ok) return undefined
    const rec: VerifiedAnchor = {
      anchorBlock,
      stateRoot: new Uint8Array(stateRoot),
      rootNodeRlp: asm.rootNodeRlp,
      slots: asm.slots,
    }
    this._verified.set(anchorBlock.toString(), rec)
    for (let b = 0; b < 16; b++) {
      const trie = this._tries.get(b)
      if (trie === undefined) continue
      const local = trie.branchSlotReference()
      const proven = asm.slots[b]!
      const match =
        local.length === proven.length && (local.length === 0 || equalsBytes(local, proven))
      this.setArmedBucket(b, match)
    }
    return rec
  }

  verifiedAnchor(anchorBlock: bigint): VerifiedAnchor | undefined {
    return this._verified.get(anchorBlock.toString())
  }

  seedCandidatesFromLocalTries(anchorBlock: bigint): void {
    for (const [b, trie] of this._tries) {
      const slot = trie.branchSlotReference()
      if (slot.length === 32) {
        noteSubtreeRootCandidate(this._candidates, b, this._localPeerIdHex, slot)
      }
      trie.captureAnchor(anchorBlock)
      void b
    }
  }

  localSubtreeGossipEntries(
    anchorBlock: bigint,
  ): Array<{ bucketIndex: number; subtreeRootHash: Uint8Array }> {
    this.seedCandidatesFromLocalTries(anchorBlock)
    const out: Array<{ bucketIndex: number; subtreeRootHash: Uint8Array }> = []
    for (const [b, trie] of this._tries) {
      const slot = trie.branchSlotReference()
      if (slot.length !== 32) continue
      out.push({ bucketIndex: b, subtreeRootHash: new Uint8Array(slot) })
      void b
    }
    return out
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
