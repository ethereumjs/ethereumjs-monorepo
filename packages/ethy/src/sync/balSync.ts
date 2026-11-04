import { createBlockHeaderFromBytesArray } from '@ethereumjs/block'
import { type ChainConfig, Common } from '@ethereumjs/common'
import type { Devp2pWorkerClient } from '@ethereumjs/devp2p'
import { RLP } from '@ethereumjs/rlp'
import type { FlatStateManager } from '@ethereumjs/statemanager'
import {
  type Address,
  type BALJSONBlockAccessList,
  createBlockLevelAccessListFromRLP,
  equalsBytes,
} from '@ethereumjs/util'

import { compareBytes32 } from '../spine/buckets.ts'
import { setPhase } from '../spine/createSpine.ts'
import type { EthySpine, SnapBucket } from '../spine/types.ts'
import type { SnapAccountSynchronizer } from './accountSync.ts'
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
export const LAPTOP_WAKE_BLOCK_GAP = 2n

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
  const codeDone = codeSync === undefined || codeSync.pendingDone()
  return bucketsDone && codeDone
}

/** Enter BAL catch-up or head follow after snap base sync completes. */
export function tryEnterBalCatchUp(
  spine: EthySpine,
  accountSync: SnapAccountSynchronizer | undefined,
  codeSync: SnapCodeAndStorageSynchronizer | undefined,
  bestPeerHead: bigint,
): boolean {
  if (spine.phase !== 'SNAP_SYNCING') return false
  if (accountSync !== undefined && !spine.snapBuckets.every((b) => b.status === 'done')) {
    return false
  }
  if (!snapSyncStagesDone(spine, codeSync)) return false
  const pivot = spine.pivotBlockNumber
  if (pivot === undefined) return false

  spine.lastVerifiedBlockNumber = spine.lastVerifiedBlockNumber ?? pivot
  spine.headBlockNumber = spine.lastVerifiedBlockNumber
  spine.headStateRoot = spine.pivotStateRoot

  const gap = bestPeerHead > pivot ? bestPeerHead - pivot : 0n
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
    fromBlock: pivot + 1n,
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
  noteVerifiedBlock?: (blockNumber: bigint) => void
  onSyncedToHead?: (head: bigint) => void
  onPivotStep?: (newPivot: VerifiedBalBlock) => void
  onBalBlockBuffered?: (entry: VerifiedBalBlock) => void
}

type HeadCatchUp = {
  peerId: string
  ethVersion: number
  targetHead: bigint
  inFlight?: InFlightBlockBundle
}

/** Streams and verifies `eth/71` blocks from pivot+1 through catch-up and live head (WP-04k). */
export class BalChainStreamer {
  private readonly opts: HeadFollowerOpts
  private timer?: ReturnType<typeof setInterval>
  private catchUp?: HeadCatchUp
  private readonly buffered: VerifiedBalBlock[] = []
  private appliedBalLog: VerifiedBalBlock[] = []
  private lastTipProbeAt = 0

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
  }

  stop(): void {
    if (this.timer !== undefined) clearInterval(this.timer)
    this.timer = undefined
    this.catchUp = undefined
  }

  handleEthMessage(msg: { peerId: string; code: number; payload: Uint8Array }): boolean {
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
        this.catchUp.inFlight = undefined
        this.catchUp = undefined
      }
      return true
    }
    if (result === 'progress') return true
    void this.finishCatchUpBlock()
    return true
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
      syncBuckets: snapStreaming ? spine.snapBuckets : undefined,
      deferStateApply: snapStreaming,
    })
    const fields =
      bundle.headerRlp !== undefined
        ? headFieldsFromHeaderRlp(bundle.headerRlp, this.opts.chain, this.opts.hardfork)
        : null
    if (fields !== null) {
      spine.headBlockNumber = fields.number
      spine.headStateRoot = fields.stateRoot
      spine.currentSlot = Number(fields.number)
      if (spine.bestPeerHead === undefined || fields.number > spine.bestPeerHead) {
        spine.bestPeerHead = fields.number
      }
      if (snapStreaming) {
        const entry: VerifiedBalBlock = {
          blockNumber: fields.number,
          blockHash: bundle.hash ?? new Uint8Array(32),
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
    for (const block of window) {
      let balJson: BALJSONBlockAccessList | undefined
      if (block.balRlp !== undefined && block.balRlp.length > 0) {
        const applied = await applyBlockBal(
          this.opts.stateManager,
          block.headerRlp,
          block.balRlp,
          this.opts.chain,
          this.opts.hardfork,
          syncBuckets,
        )
        balJson = applied.balJson
        if (balJson !== undefined) {
          block.balJson = balJson
          this.opts.onBalApplied?.(balJson)
        }
      }
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
    const pivot = spine.pivotBlockNumber
    if (pivot === undefined || spine.pivotStateRoot === undefined) return
    if (this.buffered.length < Number(PIVOT_STEP_BLOCKS)) return
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
    if (
      this.catchUp?.inFlight !== undefined &&
      now - this.catchUp.inFlight.startedAt >= BUNDLE_IN_FLIGHT_TIMEOUT_MS
    ) {
      this.catchUp.inFlight = undefined
      this.catchUp = undefined
    }
    if (this.catchUp?.inFlight !== undefined) return
    const tip = this.downloadTip(spine)
    if (tip === undefined) return
    const peer = this.opts.pickEthPeer()
    if (peer?.latestBlock === undefined) return
    const peerHead = BigInt(peer.latestBlock)
    if (this.catchUp === undefined || this.catchUp.targetHead < peerHead) {
      this.catchUp = {
        peerId: peer.id,
        ethVersion: peer.ethVersion,
        targetHead: peerHead,
      }
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
        this.catchUp = {
          peerId: peer.id,
          ethVersion: peer.ethVersion,
          targetHead: next,
          inFlight: startBlockBundleByNumber(this.opts.getClient(), peer.id, peer.ethVersion, next),
        }
        return
      }
      this.catchUp = undefined
      return
    }
    const next = tip + 1n
    if (next > this.catchUp.targetHead) return
    this.lastTipProbeAt = now
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
