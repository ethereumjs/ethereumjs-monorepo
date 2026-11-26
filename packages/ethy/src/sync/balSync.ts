import { createBlockHeaderFromBytesArray } from '@ethereumjs/block'
import { type ChainConfig, Common } from '@ethereumjs/common'
import type { Devp2pWorkerClient } from '@ethereumjs/devp2p'
import { RLP } from '@ethereumjs/rlp'
import { type FlatStateManager, consumeBALBatch } from '@ethereumjs/statemanager'
import {
  type Address,
  type BALJSONBlockAccessList,
  createBlockLevelAccessListFromRLP,
  equalsBytes,
} from '@ethereumjs/util'

import { ethyKeccak256 } from '../crypto/keccak.ts'
import type { ETHEconomyDataManager } from '../economy/economyDataManager.ts'
import type { BalTailBatchEntry } from '../persist/balTailArchive.ts'
import { compareBytes32 } from '../spine/buckets.ts'
import { raiseBestPeerHead } from '../spine/chainHead.ts'
import { setPhase } from '../spine/createSpine.ts'
import type { EthySpine, SnapBucket } from '../spine/types.ts'
import type { SnapAccountSynchronizer } from './accountSync.ts'
import {
  type BalBatchMode,
  type InFlightBalBatch,
  type VerifiedBalBatchBlock,
  advanceBalBatchEthMessage,
  balGapBlocks,
  materializeBalBatch,
  noteBalCatchUpPeerSuccess,
  pickBalCatchUpPeer,
  planBalBatch,
  restBalCatchUpPeer,
  shouldUseBalBatch,
  startBalBatch,
} from './balBatch.ts'
import {
  MAX_FLIGHTS_PER_PEER,
  MAX_READY_BAL_BATCHES,
  balPipelineActive,
  countHealthyBalCatchUpPeers,
  highestReadyBlock,
  maxConcurrentBalFlights,
  nextBalFlightStartBlock,
  nextOccupiedRangeStart,
  occupiedBalBlockRanges,
  rangeKey,
} from './balPipeline.ts'
import {
  type InFlightBlockBundle,
  advanceBlockBundleEthMessage,
  finalizeBlockBundle,
  headFieldsFromHeaderRlp,
  startBlockBundleByNumber,
} from './blockBundle.ts'
import { nextCanonicalPivotBlock } from './canonicalPivotGrid.ts'
import type { SnapCodeAndStorageSynchronizer } from './codeAndStorageSync.ts'
import { accountHashFromAddress, isAccountHashSynced } from './syncedAccountHash.ts'

export const PIVOT_HEAL_BLOCK_GAP = 64n
export const PIVOT_STEP_BLOCKS = 32n
export const SAFE_HEAD_MARGIN = 2n
export const HEAD_FOLLOW_POLL_MS = 5_000
export const TIP_POLL_MS = 4_000
export const BUNDLE_IN_FLIGHT_TIMEOUT_MS = 10_000
export const LAPTOP_WAKE_BLOCK_GAP = 16n

function balBatchEnabled(spine: EthySpine): boolean {
  if (spine.phase === 'BAL_CATCHUP') return true
  if (spine.pivotBridging !== undefined) return true
  if (spine.phase === 'HEAD_FOLLOWING') return true
  return false
}

export type VerifiedBalBlock = {
  blockNumber: bigint
  blockHash: Uint8Array
  stateRoot: Uint8Array
  headerRlp: Uint8Array
  balRlp?: Uint8Array
  balJson?: BALJSONBlockAccessList
}

export function shouldApplySyncedAccount(address: Address, buckets: SnapBucket[]): boolean {
  const hash = accountHashFromAddress(address.toString())
  return isAccountHashSynced(hash, buckets)
}

export async function applySyncedBalDiff(
  stateManager: FlatStateManager,
  balJson: BALJSONBlockAccessList,
  buckets: SnapBucket[],
): Promise<void> {
  await stateManager.consumeBAL(balJson, {
    shouldApplyAccount: (address) => shouldApplySyncedAccount(address, buckets),
  })
}

function balJsonForBlock(block: VerifiedBalBlock): BALJSONBlockAccessList | undefined {
  if (block.balJson !== undefined) return block.balJson
  if (block.balRlp === undefined || block.balRlp.length === 0) return undefined
  return createBlockLevelAccessListFromRLP(block.balRlp).toJSON()
}

/** Re-apply BAL deltas for accounts in a late snap slab after pivot moved forward (WP-04k). */
export async function replayAppliedBalBlocksForSlab(
  blocks: VerifiedBalBlock[],
  stateManager: FlatStateManager,
  buckets: SnapBucket[],
  origin: Uint8Array,
  lastKey: Uint8Array,
): Promise<void> {
  const inRange = (hash: Uint8Array) =>
    compareBytes32(hash, origin) >= 0 && compareBytes32(hash, lastKey) <= 0
  for (const block of blocks) {
    const balJson = balJsonForBlock(block)
    if (balJson === undefined) continue
    await stateManager.consumeBAL(balJson, {
      shouldApplyAccount: (address) => {
        if (!shouldApplySyncedAccount(address, buckets)) return false
        const hash = accountHashFromAddress(address.toString())
        return inRange(hash)
      },
    })
  }
}

export function pushBalWindow(
  spine: EthySpine,
  blockNumber: bigint,
  balJson?: BALJSONBlockAccessList,
  stateRoot?: Uint8Array,
): void {
  for (const entry of spine.balWindow) {
    delete entry.balJson
  }
  spine.balWindow.unshift({
    blockNumber,
    accountCount: balJson?.length ?? 0,
    balJson,
    stateRoot: stateRoot !== undefined ? new Uint8Array(stateRoot) : undefined,
  })
  if (spine.balWindow.length > 64) {
    spine.balWindow.length = 64
  }
}

export function extractBlockAccessListHashFromHeaderRlp(
  headerRlp: Uint8Array,
  chain: ChainConfig,
  hardfork: string,
): Uint8Array | null {
  const common = new Common({ chain, hardfork })
  try {
    const raw = RLP.decode(headerRlp)
    const header = createBlockHeaderFromBytesArray(raw as never, {
      common,
      skipConsensusFormatValidation: true,
    })
    const balHash = header.blockAccessListHash
    return balHash !== undefined && balHash.length > 0 ? balHash : null
  } catch {
    return null
  }
}

export async function applyBlockBal(
  stateManager: FlatStateManager,
  headerRlp: Uint8Array,
  balRlp: Uint8Array | undefined,
  chain: ChainConfig,
  hardfork: string,
  syncBuckets?: SnapBucket[],
): Promise<{ ok: boolean; applied: boolean; balJson?: BALJSONBlockAccessList; reason?: string }> {
  const common = new Common({ chain, hardfork })
  const raw = headerRlp instanceof Uint8Array ? RLP.decode(headerRlp) : headerRlp
  let header
  try {
    header = createBlockHeaderFromBytesArray(raw as never, {
      common,
      skipConsensusFormatValidation: true,
    })
  } catch {
    return { ok: true, applied: false, reason: 'header parse skipped' }
  }
  const balHash = header.blockAccessListHash
  if (balHash === undefined || balHash.length === 0) {
    return { ok: true, applied: false }
  }
  if (balRlp === undefined || balRlp.length === 0) {
    return { ok: true, applied: false, reason: 'missing BAL (fallback)' }
  }
  const bal = createBlockLevelAccessListFromRLP(balRlp)
  if (!equalsBytes(bal.hash(), balHash)) {
    return { ok: false, applied: false, reason: 'BAL hash mismatch' }
  }
  const balJson = bal.toJSON()
  if (syncBuckets !== undefined) {
    await applySyncedBalDiff(stateManager, balJson, syncBuckets)
  } else {
    await stateManager.consumeBAL(balJson)
  }
  return { ok: true, applied: true, balJson }
}

function snapSyncStagesDone(
  spine: EthySpine,
  codeSync: SnapCodeAndStorageSynchronizer | undefined,
): boolean {
  const bucketsDone = spine.snapBuckets.every((b) => b.status === 'done')
  const codeDone =
    spine.syncTransport === 'ethy' || codeSync === undefined || codeSync.pendingDone()
  return bucketsDone && codeDone
}

/** Enter BAL catch-up or head follow after snap base sync completes. */
export function tryEnterBalCatchUp(
  spine: EthySpine,
  accountSync: SnapAccountSynchronizer | undefined,
  codeSync: SnapCodeAndStorageSynchronizer | undefined,
  bestPeerHead: bigint,
): boolean {
  if (spine.phase !== 'SNAP_SYNCING' && spine.phase !== 'BAL_CATCHUP') return false
  if (accountSync !== undefined && !spine.snapBuckets.every((b) => b.status === 'done')) {
    return false
  }
  if (!snapSyncStagesDone(spine, codeSync)) return false
  const pivot = spine.pivotBlockNumber
  if (pivot === undefined) return false

  const startAfter =
    spine.lastVerifiedBlockNumber !== undefined && spine.lastVerifiedBlockNumber > pivot
      ? spine.lastVerifiedBlockNumber
      : pivot
  spine.lastVerifiedBlockNumber = startAfter
  spine.headBlockNumber = startAfter
  spine.headStateRoot = spine.pivotStateRoot

  const gap = bestPeerHead > startAfter ? bestPeerHead - startAfter : 0n
  const total = Number(gap)
  if (total <= 0) {
    setPhase(spine, 'HEAD_FOLLOWING')
    spine.balCatchUp = undefined
    spine.lastVerifiedBlockNumber = bestPeerHead
    spine.headBlockNumber = bestPeerHead
    return true
  }

  setPhase(spine, 'BAL_CATCHUP')
  spine.balCatchUp = {
    fromBlock: startAfter + 1n,
    applied: 0,
    total,
  }
  return true
}

/** @deprecated alias for tests — prefer tryEnterBalCatchUp */
export function tryEnterHeadFollowing(
  spine: EthySpine,
  accountSync: SnapAccountSynchronizer | undefined,
  codeSync: SnapCodeAndStorageSynchronizer | undefined,
): boolean {
  const head = spine.bestPeerHead ?? spine.headBlockNumber ?? spine.pivotBlockNumber ?? 0n
  return tryEnterBalCatchUp(spine, accountSync, codeSync, head)
}

export type HeadFollowerOpts = {
  spine: EthySpine
  stateManager: FlatStateManager
  chain: ChainConfig
  hardfork: string
  getClient: () => Devp2pWorkerClient
  sendEthMessage: (peerId: string, code: number, payload: Uint8Array) => void
  pickEthPeer: () => { id: string; ethVersion: number; latestBlock?: number } | undefined
  putServableBlock: (bundle: {
    number: bigint
    hash: Uint8Array
    headerRlp: Uint8Array
    bodyRlp: Uint8Array
    receiptsEth69Rlp: Uint8Array
    balRlp?: Uint8Array
  }) => void
  onBalApplied?: (
    balJson: BALJSONBlockAccessList,
    meta?: { blockNumber?: bigint; stateRoot?: Uint8Array },
  ) => void
  appendHealBal?: (blockNumber: bigint, balRlp: Uint8Array) => void
  appendHealBundle?: (entry: VerifiedBalBlock) => void
  appendBalTailBatch?: (entries: BalTailBatchEntry[]) => void
  noteVerifiedBlock?: (blockNumber: bigint) => void
  onSyncedToHead?: (head: bigint) => void
  onPivotStep?: (newPivot: VerifiedBalBlock) => void
  onBalBlockBuffered?: (entry: VerifiedBalBlock) => void
  /** WP-05b: cross-check EL block hash against consensus light client. */
  onVerifiedExecutionHeader?: (blockNumber: bigint, blockHash: Uint8Array) => void
  onDiagnostic?: (severity: 'info' | 'warn' | 'error', message: string, peerId?: string) => void
  economy?: ETHEconomyDataManager
  onRpcBundle?: (note: import('../rpc/types.ts').RpcBundleNote) => void
}

type ReadyBalBatch = {
  startBlock: bigint
  blocks: VerifiedBalBatchBlock[]
  mode: BalBatchMode
  peerId: string
  ethVersion: number
}

type BalCatchUpPipeline = {
  nextCommitBlock: bigint
  inFlight: Map<string, InFlightBalBatch>
  ready: Map<string, ReadyBalBatch>
  draining: boolean
  committing?: { startBlock: bigint; blockCount: number }
}

type HeadCatchUp = {
  peerId: string
  ethVersion: number
  targetHead: bigint
  probingNextTip?: boolean
  inFlight?: InFlightBlockBundle
  batchInFlight?: InFlightBalBatch
  pipeline?: BalCatchUpPipeline
}

/** Streams and verifies `eth/71` blocks from pivot+1 through catch-up and live head (WP-04k). */
export class BalChainStreamer {
  private readonly opts: HeadFollowerOpts
  private timer?: ReturnType<typeof setInterval>
  private catchUp?: HeadCatchUp
  private readonly buffered: VerifiedBalBlock[] = []
  private appliedBalLog: VerifiedBalBlock[] = []
  private lastTipProbeAt = 0
  private readonly peerRestUntil = new Map<string, number>()
  private readonly peerFailureStreak = new Map<string, number>()
  private verifiedTipHash?: Uint8Array
  private lastBatchAppliedAt = 0
  private readonly nextEthRequestId = { value: 1 }

  constructor(opts: HeadFollowerOpts) {
    this.opts = opts
  }

  start(): void {
    if (this.timer !== undefined) return
    this.lastTipProbeAt = Date.now()
    const pollMs = this.opts.spine.phase === 'SNAP_SYNCING' ? TIP_POLL_MS : HEAD_FOLLOW_POLL_MS
    this.timer = setInterval(() => {
      void this.tick()
    }, pollMs)
    this.timer.unref?.()
    queueMicrotask(() => {
      void this.tick()
    })
  }

  stop(): void {
    if (this.timer !== undefined) clearInterval(this.timer)
    this.timer = undefined
    this.catchUp = undefined
  }

  /** Wake follower when consensus or P2P reports a newer execution head (WP-07g). */
  noteChainHead(blockNumber: bigint): void {
    const { spine } = this.opts
    if (blockNumber <= 0n) return
    raiseBestPeerHead(spine, blockNumber)
    growBalCatchUpTarget(spine, blockNumber)
    if (
      spine.phase !== 'SNAP_SYNCING' &&
      spine.phase !== 'BAL_CATCHUP' &&
      spine.phase !== 'HEAD_FOLLOWING'
    ) {
      return
    }
    void this.tick()
  }

  /** Clear buffered BAL blocks and in-flight fetches when resetting to a fresh pivot. */
  resetForFreshPivot(): void {
    this.catchUp = undefined
    this.verifiedTipHash = undefined
    this.buffered.length = 0
    this.appliedBalLog.length = 0
  }

  /** Restore persisted unapplied heal bundles after disk hydrate (WP-06d). */
  restoreBuffered(blocks: VerifiedBalBlock[]): void {
    if (blocks.length === 0) return
    const { spine } = this.opts
    this.buffered.length = 0
    for (const block of blocks) {
      this.buffered.push({ ...block })
    }
    spine.streamedBalCount = blocks.length
    spine.bufferedBalCount = blocks.length
    const last = blocks[blocks.length - 1]!
    this.verifiedTipHash = last.blockHash
    spine.headBlockNumber = last.blockNumber
    spine.headStateRoot = last.stateRoot
    // Never call raiseBestPeerHead from disk heal bundles: bestPeerHead is strictly network-observed.
    void this.maybePivotStep()
  }

  handleEthMessage(msg: { peerId: string; code: number; payload: Uint8Array }): boolean {
    const pipeline = this.catchUp?.pipeline
    if (pipeline !== undefined && pipeline.inFlight.size > 0) {
      let handled = false
      for (const [key, batch] of pipeline.inFlight) {
        if (msg.peerId !== batch.peerId) continue
        // Only the head-of-line flight anchors directly to `this.verifiedTipHash`;
        // lookahead flights verify internal parent continuity on arrival and cross-batch
        // continuity against `this.verifiedTipHash` in `drainBalPipeline()` at commit time.
        const expectedParentHash =
          batch.startBlock === pipeline.nextCommitBlock && pipeline.committing === undefined
            ? this.verifiedTipHash
            : undefined
        const result = advanceBalBatchEthMessage(
          this.opts.chain,
          batch,
          msg,
          (peerId, code, payload) => {
            this.opts.sendEthMessage(peerId, code, payload)
          },
          expectedParentHash,
          this.nextEthRequestId,
        )
        if (result === 'ignore') continue
        handled = true
        if (result === 'failed') {
          restBalCatchUpPeer(this.peerRestUntil, batch.peerId, Date.now(), this.peerFailureStreak)
          this.opts.onDiagnostic?.(
            'warn',
            `BAL pipeline batch failed at stage=${batch.stage} start=#${batch.startBlock.toString()}`,
            batch.peerId,
          )
          if (batch.startBlock === pipeline.nextCommitBlock) {
            this.verifiedTipHash = undefined
          }
          pipeline.inFlight.delete(key)
          this.syncPipelineTelemetry()
          queueMicrotask(() => this.tick())
          return true
        }
        if (result === 'progress') return true
        const materialized = materializeBalBatch(batch, {
          keccak256Fn: ethyKeccak256,
          includeBalJson: batch.mode === 'full',
        })
        pipeline.inFlight.delete(key)
        this.syncPipelineTelemetry()
        if (!materialized.ok) {
          restBalCatchUpPeer(this.peerRestUntil, batch.peerId, Date.now(), this.peerFailureStreak)
          this.opts.onDiagnostic?.(
            'warn',
            `BAL pipeline batch rejected (${materialized.reason}) start=#${batch.startBlock.toString()}`,
            batch.peerId,
          )
          if (batch.startBlock === pipeline.nextCommitBlock) {
            this.verifiedTipHash = undefined
          }
          queueMicrotask(() => this.tick())
          return true
        }
        noteBalCatchUpPeerSuccess(this.peerFailureStreak, batch.peerId)
        pipeline.ready.set(key, {
          startBlock: batch.startBlock,
          blocks: materialized.blocks,
          mode: batch.mode,
          peerId: batch.peerId,
          ethVersion: batch.ethVersion,
        })
        void this.drainBalPipeline()
        // Refill freed pipeline slot right away while commit drains in parallel.
        queueMicrotask(() => this.tick())
        return true
      }
      if (handled) return true
    }
    const batch = this.catchUp?.batchInFlight
    if (batch !== undefined) {
      const result = advanceBalBatchEthMessage(
        this.opts.chain,
        batch,
        msg,
        (peerId, code, payload) => {
          this.opts.sendEthMessage(peerId, code, payload)
        },
        this.verifiedTipHash,
        this.nextEthRequestId,
      )
      if (result === 'ignore') return false
      if (result === 'failed') {
        restBalCatchUpPeer(this.peerRestUntil, batch.peerId, Date.now(), this.peerFailureStreak)
        this.opts.onDiagnostic?.(
          'warn',
          `BAL batch failed at stage=${batch.stage} start=#${batch.startBlock.toString()}`,
          batch.peerId,
        )
        this.verifiedTipHash = undefined
        this.catchUp!.batchInFlight = undefined
        queueMicrotask(() => this.tick())
        return true
      }
      if (result === 'progress') return true
      void this.finishBalBatch()
      return true
    }
    const inFlight = this.catchUp?.inFlight
    if (inFlight === undefined) return false
    const result = advanceBlockBundleEthMessage(
      this.opts.chain,
      inFlight,
      msg,
      (peerId, code, payload) => {
        this.opts.sendEthMessage(peerId, code, payload)
      },
    )
    if (result === 'ignore') return false
    if (result === 'failed') {
      if (this.catchUp !== undefined) {
        const probe = this.catchUp.probingNextTip === true && inFlight.stage === 'headers'
        if (probe) {
          this.catchUp = undefined
        } else {
          restBalCatchUpPeer(this.peerRestUntil, this.catchUp.peerId)
          this.catchUp.inFlight = undefined
          this.catchUp.probingNextTip = undefined
          queueMicrotask(() => this.tick())
        }
      }
      return true
    }
    if (result === 'progress') return true
    void this.finishCatchUpBlock()
    return true
  }

  private recordBatchRate(blockCount: number): void {
    const now = Date.now()
    if (this.lastBatchAppliedAt > 0 && blockCount > 0) {
      const dt = (now - this.lastBatchAppliedAt) / 1000
      if (dt > 0) {
        const rate = blockCount / dt
        if (this.opts.spine.balCatchUp !== undefined) {
          this.opts.spine.balCatchUp.blocksPerSec = rate
        }
        if (this.opts.spine.pivotBridging !== undefined) {
          this.opts.spine.pivotBridging.blocksPerSec = rate
        }
      }
    }
    this.lastBatchAppliedAt = now
  }

  private async finishBalBatch(): Promise<void> {
    const seq = this.catchUp
    const batch = seq?.batchInFlight
    if (seq === undefined || batch === undefined) return
    const materialized = materializeBalBatch(batch, {
      keccak256Fn: ethyKeccak256,
      includeBalJson: batch.mode === 'full',
    })
    if (!materialized.ok) {
      restBalCatchUpPeer(this.peerRestUntil, batch.peerId, Date.now(), this.peerFailureStreak)
      this.opts.onDiagnostic?.(
        'warn',
        `BAL batch rejected (${materialized.reason}) start=#${batch.startBlock.toString()}`,
        batch.peerId,
      )
      this.verifiedTipHash = undefined
      seq.batchInFlight = undefined
      queueMicrotask(() => this.tick())
      return
    }
    noteBalCatchUpPeerSuccess(this.peerFailureStreak, batch.peerId)
    seq.batchInFlight = undefined
    await this.applyVerifiedBalBatchBlocks(seq, batch, materialized.blocks)
  }

  private syncPipelineTelemetry(): void {
    const pipe = this.catchUp?.pipeline
    if (pipe === undefined || this.opts.spine.balCatchUp === undefined) return
    this.opts.spine.balCatchUp.balFlightsInAir = pipe.inFlight.size
  }

  private ensureBalPipeline(seq: HeadCatchUp, nextCommit: bigint): BalCatchUpPipeline {
    if (seq.pipeline === undefined) {
      seq.pipeline = {
        nextCommitBlock: nextCommit,
        inFlight: new Map(),
        ready: new Map(),
        draining: false,
      }
    }
    return seq.pipeline
  }

  private dispatchBalFlights(seq: HeadCatchUp, nextBlock: bigint, _gap: bigint): void {
    const { spine } = this.opts
    const pipe = this.ensureBalPipeline(seq, seq.pipeline?.nextCommitBlock ?? nextBlock)
    const maxK = maxConcurrentBalFlights(countHealthyBalCatchUpPeers(spine, this.peerRestUntil))
    const maxReady = highestReadyBlock(readyAsRanges(pipe.ready))
    const inFlightByPeer = new Map<string, number>()
    for (const flight of pipe.inFlight.values()) {
      inFlightByPeer.set(flight.peerId, (inFlightByPeer.get(flight.peerId) ?? 0) + 1)
    }
    while (pipe.inFlight.size < maxK) {
      const ranges = occupiedBalBlockRanges(
        pipe.inFlight.values(),
        readyAsRanges(pipe.ready),
        pipe.committing,
      )
      const start = nextBalFlightStartBlock(pipe.nextCommitBlock, seq.targetHead, ranges)
      if (start === undefined) break
      // Always allow dispatching missing head-of-line / gap ranges before buffered ready
      // batches even when `ready` is at capacity, preventing head-of-line deadlock when a
      // fast peer fills `ready` while a slow peer times out on `nextCommitBlock`.
      const isHoleFill = maxReady !== undefined && start < maxReady
      if (pipe.ready.size >= MAX_READY_BAL_BATCHES && !isHoleFill) break
      const localGap = balGapBlocks(start - 1n, seq.targetHead)
      const plan = planBalBatch(start, seq.targetHead, localGap)
      if (plan === undefined || plan.mode !== 'fast') break
      const nextOccupied = nextOccupiedRangeStart(start, ranges)
      const count =
        nextOccupied !== undefined && nextOccupied > start
          ? Math.min(plan.count, Number(nextOccupied - start))
          : plan.count
      if (count <= 0) break
      const peerOpts = { inFlightByPeer, maxPerPeer: MAX_FLIGHTS_PER_PEER }
      const batchPeer =
        pickBalCatchUpPeer(
          spine,
          this.peerRestUntil,
          start + BigInt(count - 1),
          undefined,
          peerOpts,
        ) ?? pickBalCatchUpPeer(spine, this.peerRestUntil, start, undefined, peerOpts)
      if (batchPeer === undefined) break
      const batch = startBalBatch(
        this.opts.sendEthMessage,
        batchPeer.id,
        batchPeer.ethVersion,
        start,
        count,
        plan.mode,
        this.nextEthRequestId,
      )
      pipe.inFlight.set(rangeKey(start), batch)
      inFlightByPeer.set(batchPeer.id, (inFlightByPeer.get(batchPeer.id) ?? 0) + 1)
    }
    this.syncPipelineTelemetry()
    if (pipe.ready.has(rangeKey(pipe.nextCommitBlock)) && !pipe.draining) {
      void this.drainBalPipeline()
    }
  }

  private async drainBalPipeline(): Promise<void> {
    const seq = this.catchUp
    const pipe = seq?.pipeline
    if (seq === undefined || pipe === undefined || pipe.draining) return
    pipe.draining = true
    let stateChanged = false
    try {
      for (;;) {
        if (this.catchUp !== seq || seq.pipeline !== pipe) break
        const key = rangeKey(pipe.nextCommitBlock)
        const ready = pipe.ready.get(key)
        if (ready === undefined) break
        pipe.ready.delete(key)
        stateChanged = true
        if (
          this.verifiedTipHash !== undefined &&
          ready.blocks.length > 0 &&
          !equalsBytes(ready.blocks[0]!.header.parentHash, this.verifiedTipHash)
        ) {
          // Cross-batch parentHash mismatch (reorg or inconsistent lookahead peer):
          // rest peer, clear buffered lookahead, and re-sync cleanly from nextCommitBlock.
          restBalCatchUpPeer(this.peerRestUntil, ready.peerId, Date.now(), this.peerFailureStreak)
          this.opts.onDiagnostic?.(
            'warn',
            `BAL pipeline parentHash mismatch at #${ready.startBlock.toString()} — resetting lookahead`,
            ready.peerId,
          )
          this.verifiedTipHash = undefined
          pipe.inFlight.clear()
          pipe.ready.clear()
          break
        }
        pipe.committing = { startBlock: ready.startBlock, blockCount: ready.blocks.length }
        const batch: InFlightBalBatch = {
          peerId: ready.peerId,
          ethVersion: ready.ethVersion,
          startBlock: ready.startBlock,
          count: ready.blocks.length,
          mode: ready.mode,
          stage: 'bal',
          startedAt: Date.now(),
          headerRequestId: 0,
        }
        try {
          await this.applyVerifiedBalBatchBlocks(seq, batch, ready.blocks)
        } catch (err) {
          const msg = err instanceof Error ? err.message : String(err)
          restBalCatchUpPeer(this.peerRestUntil, ready.peerId, Date.now(), this.peerFailureStreak)
          this.opts.onDiagnostic?.(
            'warn',
            `BAL pipeline commit failed at #${ready.startBlock.toString()}: ${msg}`,
            ready.peerId,
          )
          this.verifiedTipHash = undefined
          pipe.inFlight.clear()
          pipe.ready.clear()
          break
        }
        pipe.committing = undefined
        if (this.catchUp !== seq || seq.pipeline !== pipe) break
        pipe.nextCommitBlock += BigInt(ready.blocks.length)
        // Drop any stale buffered ready batches strictly behind the new commit anchor.
        for (const [readyKey, entry] of pipe.ready) {
          if (entry.startBlock < pipe.nextCommitBlock) {
            pipe.ready.delete(readyKey)
          }
        }
        this.syncPipelineTelemetry()
      }
    } finally {
      pipe.committing = undefined
      pipe.draining = false
      this.syncPipelineTelemetry()
      if (stateChanged) {
        queueMicrotask(() => this.tick())
      }
    }
  }

  private async applyVerifiedBalBatchBlocks(
    seq: HeadCatchUp,
    batch: InFlightBalBatch,
    blocks: VerifiedBalBatchBlock[],
  ): Promise<void> {
    const { spine } = this.opts
    const snapStreaming = spine.phase === 'SNAP_SYNCING'
    const persistHeal = true
    const batchBalRlp = blocks
      .map((b) => b.balRlp)
      .filter((r): r is Uint8Array => r !== undefined && r.length > 0)
    const balTailBatch: BalTailBatchEntry[] = []

    if (!snapStreaming && batchBalRlp.length > 0) {
      await this.opts.stateManager.consumeBALBatch(batchBalRlp)
    }

    for (let i = 0; i < blocks.length; i++) {
      const row = blocks[i]!
      const bundle: InFlightBlockBundle = {
        peerId: batch.peerId,
        ethVersion: batch.ethVersion,
        blockNumber: row.header.number,
        hash: row.header.hash,
        headerRlp: row.header.headerRlp,
        bodyRlp: row.bodyRlp,
        receiptsEth69Rlp: row.receiptsEth69Rlp,
        balRlp: row.balRlp,
        stage: 'bal',
        startedAt: batch.startedAt,
      }
      if (
        batch.mode === 'full' &&
        row.bodyRlp !== undefined &&
        row.receiptsEth69Rlp !== undefined
      ) {
        await finalizeBlockBundle({
          spine,
          stateManager: this.opts.stateManager,
          chain: this.opts.chain,
          hardfork: this.opts.hardfork,
          bundle,
          putServableBlock: (b) => this.opts.putServableBlock(b),
          onBalApplied: undefined,
          appendHealBal: this.opts.appendHealBal,
          appendHealBundle: this.opts.appendHealBundle,
          syncBuckets: snapStreaming ? spine.snapBuckets : undefined,
          deferStateApply: true,
          persistHeal,
          economy: this.opts.economy,
          preDecodedBalJson: row.balJson,
          onRpcBundle: this.opts.onRpcBundle,
        })
      } else {
        const note = {
          blockNumber: row.header.number,
          headerRlp: row.header.headerRlp,
          balJson: row.balJson,
        }
        if (row.balRlp !== undefined && row.balRlp.length > 0) {
          if (batch.mode === 'fast') {
            balTailBatch.push({
              blockNumber: row.header.number,
              headerRlp: row.header.headerRlp,
              balRlp: row.balRlp,
            })
          } else {
            this.opts.appendHealBundle?.({
              blockNumber: row.header.number,
              blockHash: row.header.hash,
              stateRoot: row.header.stateRoot,
              headerRlp: row.header.headerRlp,
              balRlp: row.balRlp,
            })
          }
        }
        const nearHead = seq.targetHead <= row.header.number + 64n
        if (nearHead) {
          this.opts.economy?.noteBundle({ ...note, balRlp: row.balRlp })
          this.opts.onRpcBundle?.(note)
        }
      }
      this.opts.onVerifiedExecutionHeader?.(row.header.number, row.header.hash)
      if (snapStreaming) {
        const entry: VerifiedBalBlock = {
          blockNumber: row.header.number,
          blockHash: row.header.hash,
          stateRoot: row.header.stateRoot,
          headerRlp: row.header.headerRlp,
          balRlp: row.balRlp,
          balJson: row.balJson,
        }
        this.buffered.push(entry)
        spine.streamedBalCount = (spine.streamedBalCount ?? 0) + 1
        spine.bufferedBalCount = this.buffered.length
        this.opts.onBalBlockBuffered?.(entry)
      } else {
        const nearHeadForWindow = seq.targetHead <= row.header.number + 64n
        if (nearHeadForWindow) {
          pushBalWindow(spine, row.header.number, row.balJson, row.header.stateRoot)
        }
        spine.appliedBalCount = (spine.appliedBalCount ?? 0) + 1
        if (row.balJson !== undefined) {
          this.opts.onBalApplied?.(row.balJson, {
            blockNumber: row.header.number,
            stateRoot: row.header.stateRoot,
          })
        }
      }
      if (spine.pivotBridging !== undefined) {
        spine.pivotBridging = {
          ...spine.pivotBridging,
          currentBlock: row.header.number,
        }
      }
      spine.headBlockNumber = row.header.number
      spine.headStateRoot = row.header.stateRoot
    }

    if (balTailBatch.length > 0) {
      if (this.opts.appendBalTailBatch !== undefined) {
        this.opts.appendBalTailBatch(balTailBatch)
      } else if (this.opts.appendHealBundle !== undefined) {
        for (const row of blocks) {
          if (row.balRlp !== undefined && row.balRlp.length > 0) {
            this.opts.appendHealBundle({
              blockNumber: row.header.number,
              blockHash: row.header.hash,
              stateRoot: row.header.stateRoot,
              headerRlp: row.header.headerRlp,
              balRlp: row.balRlp,
            })
          }
        }
      }
    }
    const last = blocks[blocks.length - 1]!
    this.verifiedTipHash = last.header.hash
    if (!snapStreaming) {
      spine.lastVerifiedBlockNumber = last.header.number
      this.opts.noteVerifiedBlock?.(last.header.number)
      if (spine.balCatchUp !== undefined) {
        spine.balCatchUp.applied = Math.min(
          spine.balCatchUp.total,
          spine.balCatchUp.applied + blocks.length,
        )
      }
    }
    this.recordBatchRate(blocks.length)
    if (snapStreaming) {
      await this.maybePivotStep()
      const tip = this.downloadTip(spine)
      if (tip !== undefined && tip < seq.targetHead) {
        void this.tick()
      } else {
        this.catchUp = undefined
      }
      return
    }
    const tip = this.verifiedTip(spine)
    const effectiveTarget =
      spine.bestPeerHead !== undefined && spine.bestPeerHead > seq.targetHead
        ? spine.bestPeerHead
        : seq.targetHead
    growBalCatchUpTarget(spine, effectiveTarget)
    if (tip !== undefined && tip >= effectiveTarget) {
      setPhase(spine, 'HEAD_FOLLOWING')
      spine.balCatchUp = undefined
      this.opts.onSyncedToHead?.(effectiveTarget)
      this.catchUp = undefined
      seq.pipeline = undefined
      return
    }
    if (tip !== undefined && tip < effectiveTarget) {
      seq.targetHead = effectiveTarget
      if (seq.pipeline === undefined) {
        queueMicrotask(() => this.tick())
      }
    } else {
      this.catchUp = undefined
    }
  }

  private verifiedTip(spine: EthySpine): bigint | undefined {
    return spine.lastVerifiedBlockNumber ?? spine.headBlockNumber ?? spine.pivotBlockNumber
  }

  private downloadTip(spine: EthySpine): bigint | undefined {
    const lastBuffered = this.buffered[this.buffered.length - 1]?.blockNumber
    if (lastBuffered !== undefined) return lastBuffered
    if (spine.phase === 'SNAP_SYNCING') {
      return spine.pivotBlockNumber ?? spine.lastVerifiedBlockNumber
    }
    return this.verifiedTip(spine)
  }

  private async finishCatchUpBlock(): Promise<void> {
    const seq = this.catchUp
    const bundle = seq?.inFlight
    if (seq === undefined || bundle === undefined) return
    const { spine } = this.opts
    const snapStreaming = spine.phase === 'SNAP_SYNCING'
    await finalizeBlockBundle({
      spine,
      stateManager: this.opts.stateManager,
      chain: this.opts.chain,
      hardfork: this.opts.hardfork,
      bundle,
      putServableBlock: (b) => this.opts.putServableBlock(b),
      onBalApplied: snapStreaming ? undefined : this.opts.onBalApplied,
      appendHealBal: this.opts.appendHealBal,
      appendHealBundle: this.opts.appendHealBundle,
      syncBuckets: snapStreaming ? spine.snapBuckets : undefined,
      deferStateApply: snapStreaming,
      persistHeal: true,
      economy: this.opts.economy,
      onRpcBundle: this.opts.onRpcBundle,
    })
    const fields =
      bundle.headerRlp !== undefined
        ? headFieldsFromHeaderRlp(bundle.headerRlp, this.opts.chain, this.opts.hardfork)
        : null
    if (fields !== null) {
      spine.headBlockNumber = fields.number
      spine.headStateRoot = fields.stateRoot
      raiseBestPeerHead(spine, fields.number)
      const blockHash = bundle.hash ?? new Uint8Array(32)
      if (bundle.hash !== undefined) {
        this.verifiedTipHash = bundle.hash
      }
      this.opts.onVerifiedExecutionHeader?.(fields.number, blockHash)
      if (snapStreaming) {
        const entry: VerifiedBalBlock = {
          blockNumber: fields.number,
          blockHash,
          stateRoot: fields.stateRoot,
          headerRlp: bundle.headerRlp!,
          balRlp: bundle.balRlp,
        }
        this.buffered.push(entry)
        spine.streamedBalCount = (spine.streamedBalCount ?? 0) + 1
        spine.bufferedBalCount = this.buffered.length
        this.opts.onBalBlockBuffered?.(entry)
        await this.maybePivotStep()
      } else {
        spine.lastVerifiedBlockNumber = fields.number
        this.opts.noteVerifiedBlock?.(fields.number)
        if (spine.balCatchUp !== undefined) {
          spine.balCatchUp.applied = Math.min(spine.balCatchUp.total, spine.balCatchUp.applied + 1)
        }
        spine.appliedBalCount = (spine.appliedBalCount ?? 0) + 1
      }
    }
    seq.inFlight = undefined
    if (snapStreaming || this.opts.spine.phase === 'SNAP_SYNCING') {
      const tip = this.downloadTip(this.opts.spine)
      if (tip !== undefined && tip < seq.targetHead) {
        void this.tick()
      } else {
        this.catchUp = undefined
      }
      return
    }
    const tip = this.verifiedTip(this.opts.spine)
    const effectiveTarget =
      this.opts.spine.bestPeerHead !== undefined && this.opts.spine.bestPeerHead > seq.targetHead
        ? this.opts.spine.bestPeerHead
        : seq.targetHead
    growBalCatchUpTarget(this.opts.spine, effectiveTarget)
    if (tip !== undefined && tip >= effectiveTarget) {
      setPhase(this.opts.spine, 'HEAD_FOLLOWING')
      this.opts.spine.balCatchUp = undefined
      this.opts.onSyncedToHead?.(effectiveTarget)
      this.catchUp = undefined
      return
    }
    if (tip !== undefined && tip < effectiveTarget) {
      seq.targetHead = effectiveTarget
      void this.tick()
    } else {
      this.catchUp = undefined
    }
  }

  private async applyBufferedWindow(
    window: VerifiedBalBlock[],
    syncBuckets: SnapBucket[] | undefined,
  ): Promise<void> {
    const { spine } = this.opts
    if (window.length === 0) return
    const balLists: BALJSONBlockAccessList[] = []
    for (const block of window) {
      const balJson = block.balJson ?? balJsonForBlock(block)
      if (balJson !== undefined) {
        block.balJson = balJson
        balLists.push(balJson)
      }
    }
    if (balLists.length > 0) {
      await this.opts.stateManager.consumeBALBatch(balLists, {
        shouldApplyAccount:
          syncBuckets !== undefined
            ? (address) => shouldApplySyncedAccount(address, syncBuckets)
            : undefined,
      })
      for (const block of window) {
        if (block.balJson !== undefined) {
          this.opts.onBalApplied?.(block.balJson, {
            blockNumber: block.blockNumber,
            stateRoot: block.stateRoot,
          })
        }
      }
    }
    for (const block of window) {
      const balJson = block.balJson
      pushBalWindow(spine, block.blockNumber, balJson ?? [], block.stateRoot)
      spine.appliedBalCount = (spine.appliedBalCount ?? 0) + 1
      this.appliedBalLog.push({ ...block })
      if (this.appliedBalLog.length > 64) {
        this.appliedBalLog.shift()
      }
    }
    const newTip = window[window.length - 1]!
    spine.pivotBlockNumber = newTip.blockNumber
    spine.pivotStateRoot = newTip.stateRoot
    spine.lastVerifiedBlockNumber = newTip.blockNumber
    spine.bufferedBalCount = this.buffered.length
    this.opts.noteVerifiedBlock?.(newTip.blockNumber)
    this.opts.onPivotStep?.(newTip)
  }

  private async maybePivotStep(): Promise<void> {
    const { spine } = this.opts
    if (spine.phase !== 'SNAP_SYNCING') return
    while (this.buffered.length > 0) {
      const pivot = spine.pivotBlockNumber
      if (pivot === undefined || spine.pivotStateRoot === undefined) return
      const first = this.buffered[0]?.blockNumber
      const last = this.buffered[this.buffered.length - 1]?.blockNumber
      if (first === undefined || last === undefined) return
      const targetBlock = nextCanonicalPivotBlock(pivot, last)
      if (targetBlock === undefined) return
      const best =
        spine.bestPeerHead !== undefined && spine.bestPeerHead > last ? spine.bestPeerHead : last
      if (first !== pivot + 1n || last < targetBlock) return
      if (targetBlock > best - SAFE_HEAD_MARGIN) return

      const stepCount = Number(targetBlock - pivot)
      if (this.buffered.length < stepCount) return
      const window = this.buffered.splice(0, stepCount)
      spine.pivotStepsCompleted = (spine.pivotStepsCompleted ?? 0) + 1
      await this.applyBufferedWindow(window, spine.snapBuckets)
      // Advance Connected Peers' known latestBlock to at least targetBlock once we have verified
      // that targetBlock + SAFE_HEAD_MARGIN is already live on the network, so snap schedulers
      // don't skip peers between Geth's 32-block BLOCK_RANGE_UPDATE broadcasts.
      for (const p of spine.peers.values()) {
        if (p.hasHead === true && (p.latestBlock === undefined || p.latestBlock < targetBlock)) {
          p.latestBlock = targetBlock
        }
      }
    }
  }

  /** Apply any remaining buffered BALs when `SNAP_SYNCING` base sync finishes ("The Big Flip"). */
  async flushBufferedBlocks(): Promise<void> {
    if (this.buffered.length === 0) return
    const window = this.buffered.splice(0, this.buffered.length)
    await this.applyBufferedWindow(window, undefined)
  }

  /** BAL blocks applied during snap for late in-flight snap range replies. */
  appliedBlocksSince(pivotBlock: bigint): VerifiedBalBlock[] {
    return this.appliedBalLog.filter((b) => b.blockNumber > pivotBlock)
  }

  private tick(): void {
    const { spine } = this.opts
    if (
      spine.phase !== 'BAL_CATCHUP' &&
      spine.phase !== 'HEAD_FOLLOWING' &&
      spine.phase !== 'SNAP_SYNCING'
    ) {
      return
    }
    const now = Date.now()
    const pipe = this.catchUp?.pipeline
    if (pipe !== undefined) {
      for (const [key, flight] of pipe.inFlight) {
        const dropped = !spine.peers.has(flight.peerId)
        const timedOut = now - flight.startedAt >= BUNDLE_IN_FLIGHT_TIMEOUT_MS
        if (dropped || timedOut) {
          restBalCatchUpPeer(this.peerRestUntil, flight.peerId, now, this.peerFailureStreak)
          this.opts.onDiagnostic?.(
            'warn',
            `BAL pipeline flight ${dropped ? 'dropped' : 'timed out'} at stage=${flight.stage} start=#${flight.startBlock.toString()}`,
            flight.peerId,
          )
          pipe.inFlight.delete(key)
        }
      }
      this.syncPipelineTelemetry()
      if (pipe.ready.has(rangeKey(pipe.nextCommitBlock)) && !pipe.draining) {
        void this.drainBalPipeline()
      }
    }
    const batch = this.catchUp?.batchInFlight
    if (
      batch !== undefined &&
      (!spine.peers.has(batch.peerId) || now - batch.startedAt >= BUNDLE_IN_FLIGHT_TIMEOUT_MS)
    ) {
      restBalCatchUpPeer(this.peerRestUntil, batch.peerId, now, this.peerFailureStreak)
      this.opts.onDiagnostic?.(
        'warn',
        `BAL batch timed out at stage=${batch.stage} start=#${batch.startBlock.toString()}`,
        batch.peerId,
      )
      this.catchUp!.batchInFlight = undefined
    }
    if (
      this.catchUp?.inFlight !== undefined &&
      (!spine.peers.has(this.catchUp.inFlight.peerId) ||
        now - this.catchUp.inFlight.startedAt >= BUNDLE_IN_FLIGHT_TIMEOUT_MS)
    ) {
      restBalCatchUpPeer(this.peerRestUntil, this.catchUp.peerId, now, this.peerFailureStreak)
      this.catchUp.inFlight = undefined
    }
    if (this.catchUp?.inFlight !== undefined || this.catchUp?.batchInFlight !== undefined) {
      return
    }
    const tip = this.downloadTip(spine)
    if (tip === undefined) return
    const peer = this.opts.pickEthPeer()
    const bestKnownHead =
      peer?.latestBlock !== undefined
        ? spine.bestPeerHead !== undefined && spine.bestPeerHead > BigInt(peer.latestBlock)
          ? spine.bestPeerHead
          : BigInt(peer.latestBlock)
        : spine.bestPeerHead
    if (peer === undefined || bestKnownHead === undefined) return
    const peerHead = bestKnownHead
    growBalCatchUpTarget(spine, peerHead)
    const peerRow = spine.peers.get(peer.id)
    const fallbackAllowed =
      spine.peers.size === 0 ||
      (peerRow !== undefined &&
        (this.peerRestUntil.get(peer.id) ?? 0) <= now &&
        peerRow.ethySession !== true)
    const catchUpPeer =
      pickBalCatchUpPeer(spine, this.peerRestUntil, tip + 1n) ??
      pickBalCatchUpPeer(spine, this.peerRestUntil) ??
      (fallbackAllowed
        ? {
            id: peer.id,
            ethVersion: peer.ethVersion,
            latestBlock: peerHead,
          }
        : undefined)
    if (catchUpPeer === undefined) return
    if (this.catchUp === undefined) {
      this.catchUp = {
        peerId: catchUpPeer.id,
        ethVersion: catchUpPeer.ethVersion,
        targetHead: peerHead,
      }
    } else {
      if (this.catchUp.targetHead < peerHead) {
        this.catchUp.targetHead = peerHead
      }
      this.catchUp.peerId = catchUpPeer.id
      this.catchUp.ethVersion = catchUpPeer.ethVersion
    }
    if (peerHead <= tip) {
      const pipe = this.catchUp.pipeline
      if (pipe !== undefined && (pipe.inFlight.size > 0 || pipe.ready.size > 0 || pipe.draining)) {
        return
      }
      if (spine.phase === 'BAL_CATCHUP') {
        setPhase(spine, 'HEAD_FOLLOWING')
        spine.balCatchUp = undefined
        this.opts.onSyncedToHead?.(tip)
      }
      if (spine.phase === 'SNAP_SYNCING') {
        void this.maybePivotStep()
      }
      if (
        spine.phase === 'HEAD_FOLLOWING' &&
        spine.balWindow.length === 0 &&
        this.verifiedTipHash === undefined &&
        tip > 0n
      ) {
        this.lastTipProbeAt = now
        const seedPeer = pickBalCatchUpPeer(this.opts.spine, this.peerRestUntil, tip) ?? peer
        this.catchUp = {
          peerId: seedPeer.id,
          ethVersion: seedPeer.ethVersion,
          targetHead: tip,
          probingNextTip: true,
          inFlight: startBlockBundleByNumber(
            this.opts.getClient(),
            seedPeer.id,
            seedPeer.ethVersion,
            tip,
          ),
        }
        return
      }
      // Because Geth/Nethermind only send BLOCK_RANGE_UPDATE every 32 blocks (~6.4m),
      // probe tip + 1n periodically to discover newly mined 12s blocks live.
      if (now - this.lastTipProbeAt >= TIP_POLL_MS) {
        this.lastTipProbeAt = now
        const next = tip + 1n
        const probePeer = pickBalCatchUpPeer(this.opts.spine, this.peerRestUntil, next) ?? peer
        this.catchUp = {
          peerId: probePeer.id,
          ethVersion: probePeer.ethVersion,
          targetHead: next,
          probingNextTip: true,
          inFlight: startBlockBundleByNumber(
            this.opts.getClient(),
            probePeer.id,
            probePeer.ethVersion,
            next,
          ),
        }
        return
      }
      this.catchUp = undefined
      return
    }
    const next = tip + 1n
    if (next > this.catchUp.targetHead) return
    this.lastTipProbeAt = now
    const gap = balGapBlocks(tip, this.catchUp.targetHead)
    const batchPlan =
      balBatchEnabled(spine) && shouldUseBalBatch(gap)
        ? planBalBatch(next, this.catchUp.targetHead, gap)
        : undefined
    const existingPipeline = this.catchUp.pipeline
    if (
      batchPlan !== undefined &&
      balPipelineActive(spine.phase, next, this.catchUp.targetHead, gap) &&
      batchPlan.mode === 'fast'
    ) {
      this.dispatchBalFlights(this.catchUp, next, gap)
      return
    }
    if (existingPipeline !== undefined) {
      // Wait for any in-flight / ready / committing fast-pipeline batches to finish draining
      // cleanly before handing off to the 64-block 'full' serving tail or single-block mode.
      if (
        existingPipeline.inFlight.size > 0 ||
        existingPipeline.ready.size > 0 ||
        existingPipeline.draining
      ) {
        if (
          existingPipeline.ready.has(rangeKey(existingPipeline.nextCommitBlock)) &&
          !existingPipeline.draining
        ) {
          void this.drainBalPipeline()
        }
        return
      }
      this.catchUp.pipeline = undefined
    }
    if (batchPlan !== undefined) {
      const batchPeer =
        pickBalCatchUpPeer(spine, this.peerRestUntil, next + BigInt(batchPlan.count - 1)) ??
        pickBalCatchUpPeer(spine, this.peerRestUntil, next) ??
        ({
          id: this.catchUp.peerId,
          ethVersion: this.catchUp.ethVersion,
          latestBlock: this.catchUp.targetHead,
        } as const)
      this.catchUp.peerId = batchPeer.id
      this.catchUp.ethVersion = batchPeer.ethVersion
      this.catchUp.batchInFlight = startBalBatch(
        this.opts.sendEthMessage,
        batchPeer.id,
        batchPeer.ethVersion,
        next,
        batchPlan.count,
        batchPlan.mode,
        this.nextEthRequestId,
      )
      return
    }
    this.catchUp.inFlight = startBlockBundleByNumber(
      this.opts.getClient(),
      this.catchUp.peerId,
      this.catchUp.ethVersion,
      next,
    )
  }
}

function readyAsRanges(
  ready: Map<string, ReadyBalBatch>,
): Array<{ startBlock: bigint; blockCount: number }> {
  return [...ready.values()].map((r) => ({
    startBlock: r.startBlock,
    blockCount: r.blocks.length,
  }))
}

/** @deprecated alias — prefer {@link BalChainStreamer} */
export const HeadBlockFollower = BalChainStreamer

/** Extend `spine.balCatchUp.total` monotonically when network head rises during catch-up. */
export function growBalCatchUpTarget(spine: EthySpine, liveHead: bigint): void {
  if (spine.phase !== 'BAL_CATCHUP' || spine.balCatchUp === undefined) return
  if (liveHead < spine.balCatchUp.fromBlock) return
  const needed = Number(liveHead - spine.balCatchUp.fromBlock + 1n)
  if (needed > spine.balCatchUp.total) {
    spine.balCatchUp.total = needed
  }
}

/** Re-seed catch-up after laptop wake or handoff gap. Requires a network-observed head (> 0n). */
export function seedBalCatchUp(spine: EthySpine, bestPeerHead: bigint): void {
  if (bestPeerHead <= 0n) return
  const last = spine.lastVerifiedBlockNumber ?? spine.pivotBlockNumber
  if (last === undefined) return
  if (bestPeerHead <= last) {
    setPhase(spine, 'HEAD_FOLLOWING')
    spine.balCatchUp = undefined
    return
  }
  const total = Number(bestPeerHead - last)
  setPhase(spine, 'BAL_CATCHUP')
  spine.balCatchUp = {
    fromBlock: last + 1n,
    applied: 0,
    total,
  }
}
