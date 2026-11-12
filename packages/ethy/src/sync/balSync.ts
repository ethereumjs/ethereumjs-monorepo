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

import type { ETHEconomyDataManager } from '../economy/economyDataManager.ts'
import { compareBytes32 } from '../spine/buckets.ts'
import { raiseBestPeerHead } from '../spine/chainHead.ts'
import { setPhase } from '../spine/createSpine.ts'
import type { EthySpine, SnapBucket } from '../spine/types.ts'
import type { SnapAccountSynchronizer } from './accountSync.ts'
import {
  type InFlightBalBatch,
  advanceBalBatchEthMessage,
  balGapBlocks,
  materializeBalBatch,
  pickBalCatchUpPeer,
  planBalBatch,
  restBalCatchUpPeer,
  shouldUseBalBatch,
  startBalBatch,
} from './balBatch.ts'
import {
  type InFlightBlockBundle,
  advanceBlockBundleEthMessage,
  finalizeBlockBundle,
  headFieldsFromHeaderRlp,
  startBlockBundleByNumber,
} from './blockBundle.ts'
import type { SnapCodeAndStorageSynchronizer } from './codeAndStorageSync.ts'
import { accountHashFromAddress, isAccountHashSynced } from './syncedAccountHash.ts'

export const PIVOT_HEAL_BLOCK_GAP = 64n
export const PIVOT_STEP_BLOCKS = 16n
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
): void {
  for (const entry of spine.balWindow) {
    delete entry.balJson
  }
  spine.balWindow.unshift({
    blockNumber,
    accountCount: balJson?.length ?? 0,
    balJson,
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
  onBalApplied?: (balJson: BALJSONBlockAccessList) => void
  appendHealBal?: (blockNumber: bigint, balRlp: Uint8Array) => void
  appendHealBundle?: (entry: VerifiedBalBlock) => void
  noteVerifiedBlock?: (blockNumber: bigint) => void
  onSyncedToHead?: (head: bigint) => void
  onPivotStep?: (newPivot: VerifiedBalBlock) => void
  onBalBlockBuffered?: (entry: VerifiedBalBlock) => void
  /** WP-05b: cross-check EL block hash against consensus light client. */
  onVerifiedExecutionHeader?: (blockNumber: bigint, blockHash: Uint8Array) => void
  economy?: ETHEconomyDataManager
  onRpcBundle?: (note: import('../rpc/types.ts').RpcBundleNote) => void
}

type HeadCatchUp = {
  peerId: string
  ethVersion: number
  targetHead: bigint
  probingNextTip?: boolean
  inFlight?: InFlightBlockBundle
  batchInFlight?: InFlightBalBatch
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
  private verifiedTipHash?: Uint8Array
  private lastBatchAppliedAt = 0

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
    if (
      spine.phase !== 'SNAP_SYNCING' &&
      spine.phase !== 'BAL_CATCHUP' &&
      spine.phase !== 'HEAD_FOLLOWING'
    ) {
      return
    }
    raiseBestPeerHead(spine, blockNumber)
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
    raiseBestPeerHead(spine, last.blockNumber)
    void this.maybePivotStep()
  }

  handleEthMessage(msg: { peerId: string; code: number; payload: Uint8Array }): boolean {
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
      )
      if (result === 'ignore') return false
      if (result === 'failed') {
        restBalCatchUpPeer(this.peerRestUntil, batch.peerId)
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
    const materialized = materializeBalBatch(batch)
    if (!materialized.ok) {
      restBalCatchUpPeer(this.peerRestUntil, batch.peerId)
      seq.batchInFlight = undefined
      queueMicrotask(() => this.tick())
      return
    }
    const { spine } = this.opts
    const snapStreaming = spine.phase === 'SNAP_SYNCING'
    const persistHeal = snapStreaming
    const blocks = materialized.blocks
    const batchBalJson = blocks
      .map((b) => b.balJson)
      .filter((j): j is BALJSONBlockAccessList => j !== undefined)

    if (!snapStreaming && batchBalJson.length > 0) {
      await this.opts.stateManager.consumeBALBatch(batchBalJson)
      for (const balJson of batchBalJson) {
        this.opts.onBalApplied?.(balJson)
      }
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
          this.opts.appendHealBundle?.({
            blockNumber: row.header.number,
            blockHash: row.header.hash,
            stateRoot: row.header.stateRoot,
            headerRlp: row.header.headerRlp,
            balRlp: row.balRlp,
          })
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
        pushBalWindow(spine, row.header.number, row.balJson)
        spine.appliedBalCount = (spine.appliedBalCount ?? 0) + 1
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
    seq.batchInFlight = undefined
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
    if (tip !== undefined && tip >= seq.targetHead) {
      setPhase(spine, 'HEAD_FOLLOWING')
      spine.balCatchUp = undefined
      this.opts.onSyncedToHead?.(seq.targetHead)
      this.catchUp = undefined
      return
    }
    if (tip !== undefined && tip < seq.targetHead) {
      void this.tick()
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
      persistHeal: snapStreaming,
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
    if (tip !== undefined && tip >= seq.targetHead) {
      setPhase(this.opts.spine, 'HEAD_FOLLOWING')
      this.opts.spine.balCatchUp = undefined
      this.opts.onSyncedToHead?.(seq.targetHead)
      this.catchUp = undefined
      return
    }
    if (tip !== undefined && tip < seq.targetHead) {
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
      for (const balJson of balLists) {
        this.opts.onBalApplied?.(balJson)
      }
    }
    for (const block of window) {
      const balJson = block.balJson
      pushBalWindow(spine, block.blockNumber, balJson ?? [])
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
    while (this.buffered.length >= Number(PIVOT_STEP_BLOCKS)) {
      const pivot = spine.pivotBlockNumber
      if (pivot === undefined || spine.pivotStateRoot === undefined) return
      const first = this.buffered[0]?.blockNumber
      const last = this.buffered[this.buffered.length - 1]?.blockNumber
      if (first === undefined || last === undefined) return
      const targetBlock = pivot + PIVOT_STEP_BLOCKS
      const best =
        spine.bestPeerHead !== undefined && spine.bestPeerHead > last ? spine.bestPeerHead : last
      if (first !== pivot + 1n || last < targetBlock) return
      if (targetBlock > best - SAFE_HEAD_MARGIN) return

      const window = this.buffered.splice(0, Number(PIVOT_STEP_BLOCKS))
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
    const batch = this.catchUp?.batchInFlight
    if (
      batch !== undefined &&
      (!spine.peers.has(batch.peerId) || now - batch.startedAt >= BUNDLE_IN_FLIGHT_TIMEOUT_MS)
    ) {
      restBalCatchUpPeer(this.peerRestUntil, batch.peerId)
      this.catchUp!.batchInFlight = undefined
    }
    if (
      this.catchUp?.inFlight !== undefined &&
      (!spine.peers.has(this.catchUp.inFlight.peerId) ||
        now - this.catchUp.inFlight.startedAt >= BUNDLE_IN_FLIGHT_TIMEOUT_MS)
    ) {
      restBalCatchUpPeer(this.peerRestUntil, this.catchUp.peerId)
      this.catchUp.inFlight = undefined
    }
    if (this.catchUp?.inFlight !== undefined || this.catchUp?.batchInFlight !== undefined) return
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
    const catchUpPeer = pickBalCatchUpPeer(spine, this.peerRestUntil, tip + 1n) ??
      pickBalCatchUpPeer(spine, this.peerRestUntil) ?? {
        id: peer.id,
        ethVersion: peer.ethVersion,
        latestBlock: peerHead,
      }
    if (this.catchUp === undefined || this.catchUp.targetHead < peerHead) {
      this.catchUp = {
        peerId: catchUpPeer.id,
        ethVersion: catchUpPeer.ethVersion,
        targetHead: peerHead,
      }
    } else {
      this.catchUp.peerId = catchUpPeer.id
      this.catchUp.ethVersion = catchUpPeer.ethVersion
    }
    if (peerHead <= tip) {
      if (spine.phase === 'BAL_CATCHUP') {
        setPhase(spine, 'HEAD_FOLLOWING')
        spine.balCatchUp = undefined
        this.opts.onSyncedToHead?.(tip)
      }
      if (spine.phase === 'SNAP_SYNCING') {
        void this.maybePivotStep()
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

/** @deprecated alias — prefer {@link BalChainStreamer} */
export const HeadBlockFollower = BalChainStreamer

/** Re-seed catch-up after laptop wake or handoff gap. */
export function seedBalCatchUp(spine: EthySpine, bestPeerHead: bigint): void {
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
