import type { EthyPhase, PivotBridgingProgress, SnapBucket } from '../spine/types.ts'
import { planResumeStart } from './resumeCoordinator.ts'
import { type SnapResumeSaved, decideSnapResume } from './resumePolicy.ts'

/**
 * Classification of local on-disk pivot/state before a live network head is known.
 *
 * - `cold`: no usable saved state (or `--fresh` / discarded early partial snap).
 * - `partial-accounts`: `baseSyncComplete` is false and `< 16` account buckets are done.
 * - `partial-contracts`: `baseSyncComplete` is false and all `16` account buckets are done
 *   (bytecode/storage sync was interrupted before base sync completed).
 * - `base-complete`: `baseSyncComplete` is true (all accounts, code, and storage done;
 *   only post-pivot BAL catch-up / live head verification remains).
 */
export type DiskResumeKind = 'cold' | 'partial-accounts' | 'partial-contracts' | 'base-complete'

/** Gap threshold for warning when a completed base state sits unserved in BAL catch-up. */
export const BAL_CATCHUP_STALE_WARN_GAP = 20_000n

/** Stall duration with connected head peers before warning about pruned historical BALs. */
export const BAL_CATCHUP_STALE_WARN_MS = 60_000

/** Classify a synchronous startup `peekActive()` snapshot before disk hydrate completes. */
export function classifySavedDiskState(
  saved: SnapResumeSaved | undefined,
  fresh: boolean,
): DiskResumeKind {
  if (fresh || saved === undefined) return 'cold'
  if (saved.baseSyncComplete) return 'base-complete'
  if (saved.bucketsDoneCount >= 16) return 'partial-contracts'
  return 'partial-accounts'
}

/**
 * Authoritative classification after disk journals are replayed into memory.
 * Only an explicit `baseSyncComplete === true` counts as `base-complete` so an
 * interrupted bytecode/storage pass is never skipped.
 */
export function classifyHydratedDiskState(
  peek: SnapResumeSaved,
  buckets: readonly SnapBucket[],
): DiskResumeKind {
  if (peek.baseSyncComplete) return 'base-complete'
  const doneCount = buckets.filter((b) => b.status === 'done').length
  return doneCount >= 16 ? 'partial-contracts' : 'partial-accounts'
}

/**
 * Highest strictly network-observed chain head (`> 0n`).
 * Never falls back to local disk `lastVerifiedBlockNumber` or `pivotBlockNumber`.
 */
export function resolveLiveNetworkHead(opts: {
  bestPeerHead?: bigint
  clOptimisticBlockNumber?: bigint
  pendingResumeHead?: bigint
  peerLatestBlocks?: readonly (bigint | undefined)[]
  ethyLatestBlocks?: readonly (bigint | undefined)[]
}): bigint | undefined {
  let best: bigint | undefined
  const consider = (v: bigint | undefined) => {
    if (v === undefined || v <= 0n) return
    if (best === undefined || v > best) best = v
  }
  consider(opts.bestPeerHead)
  consider(opts.clOptimisticBlockNumber)
  consider(opts.pendingResumeHead)
  if (opts.peerLatestBlocks !== undefined) {
    for (const v of opts.peerLatestBlocks) consider(v)
  }
  if (opts.ethyLatestBlocks !== undefined) {
    for (const v of opts.ethyLatestBlocks) consider(v)
  }
  return best
}

export type PostHydrationPlan = {
  /** Always `P2P_WARMUP` until a live network head confirms gap / freshness. */
  phase: 'P2P_WARMUP'
  handoffCatchup: boolean
  /** True when a live network head is already known and resume transition can run immediately. */
  readyForHeadTransition: boolean
}

/**
 * Decide initial post-hydrate state before a live network head has been processed.
 * Never enters `HEAD_FOLLOWING` or `SNAP_SYNCING` on disk state alone.
 */
export function planPostHydration(opts: {
  kind: DiskResumeKind
  liveNetworkHead: bigint | undefined
}): PostHydrationPlan {
  return {
    phase: 'P2P_WARMUP',
    handoffCatchup: opts.kind === 'base-complete',
    readyForHeadTransition: opts.liveNetworkHead !== undefined && opts.liveNetworkHead > 0n,
  }
}

export type NetworkHeadResumeAction =
  | { action: 'anchor-fresh' }
  | { action: 'anchor-ethy'; peerId: string; targetPivot: bigint; savedPivot: bigint }
  | { action: 'enter-head-following'; targetHead: bigint }
  | { action: 'enter-bal-catchup'; fromBlock: bigint; targetHead: bigint; gap: bigint }
  | { action: 'resume-snap'; startSnap: true; startBal: true; drainContracts: true }
  | {
      action: 'bridge-pivot'
      startSnap: false
      startBal: true
      pivotBridging: PivotBridgingProgress
      drainContractsOnRelease: true
    }
  | { action: 'reset-stale'; savedPivot: bigint; gap: bigint }

/**
 * Deterministic transition from hydrated disk state once a live network head `#H` is observed.
 */
export function planNetworkHeadResume(opts: {
  kind: DiskResumeKind
  localVerifiedBlock: bigint | undefined
  pivotBlock: bigint | undefined
  bucketsDoneCount: number
  liveHead: bigint
  ethyBalTail: boolean
  ethyAnchorPeerId?: string
  ethyAnchorPivot?: bigint
}): NetworkHeadResumeAction {
  if (opts.kind === 'cold') {
    return { action: 'anchor-fresh' }
  }
  if (opts.kind === 'base-complete') {
    const local = opts.localVerifiedBlock ?? opts.pivotBlock ?? 0n
    if (opts.liveHead <= local) {
      return { action: 'enter-head-following', targetHead: opts.liveHead }
    }
    return {
      action: 'enter-bal-catchup',
      fromBlock: local + 1n,
      targetHead: opts.liveHead,
      gap: opts.liveHead - local,
    }
  }
  // partial-accounts or partial-contracts
  const pivot = opts.pivotBlock
  if (pivot === undefined) {
    return { action: 'anchor-fresh' }
  }
  const decision = decideSnapResume({
    fresh: false,
    saved: {
      pivotBlockNumber: pivot,
      baseSyncComplete: false,
      bucketsDoneCount: opts.bucketsDoneCount,
    },
    head: opts.liveHead,
    ethyBalTail: opts.ethyBalTail,
  })
  if (decision === 'reset-stale') {
    if (
      opts.ethyAnchorPeerId !== undefined &&
      opts.ethyAnchorPivot !== undefined &&
      opts.ethyAnchorPivot > pivot
    ) {
      return {
        action: 'anchor-ethy',
        peerId: opts.ethyAnchorPeerId,
        targetPivot: opts.ethyAnchorPivot,
        savedPivot: pivot,
      }
    }
    const gap = opts.liveHead > pivot ? opts.liveHead - pivot : 0n
    return { action: 'reset-stale', savedPivot: pivot, gap }
  }
  const plan = planResumeStart(decision, pivot, opts.liveHead)
  if (plan.pivotBridging !== undefined) {
    return {
      action: 'bridge-pivot',
      startSnap: false,
      startBal: true,
      pivotBridging: plan.pivotBridging,
      drainContractsOnRelease: true,
    }
  }
  return {
    action: 'resume-snap',
    startSnap: true,
    startBal: true,
    drainContracts: true,
  }
}

/**
 * True when a node in `HEAD_FOLLOWING` fell far enough behind a newly reported
 * network head (laptop sleep or lagging first peer) to re-enter `BAL_CATCHUP`.
 */
export function shouldReenterBalCatchUp(opts: {
  phase: EthyPhase
  localVerifiedBlock: bigint | undefined
  liveHead: bigint | undefined
  wakeGapBlocks: bigint
}): boolean {
  if (opts.phase !== 'HEAD_FOLLOWING') return false
  if (opts.localVerifiedBlock === undefined || opts.liveHead === undefined) return false
  return opts.liveHead > opts.localVerifiedBlock + opts.wakeGapBlocks
}
