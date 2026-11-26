import { equalsBytes } from '@ethereumjs/util'

import { ethyKeccak256 } from '../crypto/keccak.ts'
import { CANONICAL_PIVOT_GRID_BLOCKS } from '../sync/blockCalendar.ts'
import { BucketSubtreeTrie } from './bucketSubtreeTrie.ts'
import {
  type BucketRootCandidates,
  assembleRootBranch,
  encodeRootBranch,
  noteSubtreeRootCandidate,
} from './rootBranchAssembler.ts'

export type VerifiedAnchor = {
  anchorBlock: bigint
  stateRoot: Uint8Array
  rootNodeRlp: Uint8Array
  slots: Uint8Array[]
}

/** In-process coordinator for live custody subtree tries (WP-16f). */
export class SubtreeCustodyRegistry {
  private readonly _tries = new Map<number, BucketSubtreeTrie>()
  private readonly _verified = new Map<string, VerifiedAnchor>()
  private _trieBitmask = 0
  private readonly _candidates: BucketRootCandidates = new Map()
  private readonly _localPeerIdHex: string

  constructor(localPeerIdHex: string, buckets: readonly number[]) {
    this._localPeerIdHex = localPeerIdHex
    for (const b of buckets) {
      this._tries.set(b, BucketSubtreeTrie.forTestBucket(b))
    }
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

  noteLocalSubtreeRoot(anchorBlock: bigint, bucket: number): void {
    const trie = this._tries.get(bucket)
    if (trie === undefined) return
    const slot = trie.branchSlotReference()
    if (slot.length === 32) {
      noteSubtreeRootCandidate(this._candidates, bucket, this._localPeerIdHex, slot)
    }
    const anchorKey = `${anchorBlock}:${bucket}`
    void anchorKey
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
    const asm = assembleRootBranch(this._candidates, stateRoot, ethyKeccak256)
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
