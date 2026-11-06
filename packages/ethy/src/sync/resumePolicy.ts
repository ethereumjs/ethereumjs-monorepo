import type { PeerTelemetry, SyncTransport } from '../spine/types.ts'
import { MAX_ETHY_BAL_TAIL_BLOCKS } from './syncSourceSelector.ts'

/** Max blocks between saved pivot and network head for immediate snap+BAL resume (D-062). */
export const SNAP_RESUME_MAX_GAP = 90n

/** Max gap bridged via `eth/71` BALs before resuming `snap/1` (D-091, ~3 hours). */
export const MAX_BAL_BRIDGE_BLOCKS = 900n

/** Resume `snap/1` once the pivot is this close to the live head during bridge mode. */
export const BRIDGE_UNPAUSE_GAP = 64n

/** Do not wipe a bridging pivot while BAL progress is younger than this. */
export const BAL_BRIDGE_PROGRESS_GUARD_MS = 20_000

export function bridgeCap(ethyBalTail: boolean): bigint {
  return ethyBalTail ? MAX_ETHY_BAL_TAIL_BLOCKS : MAX_BAL_BRIDGE_BLOCKS
}

export function savedPivotExceedsResumeGap(
  head: bigint,
  pivot: bigint,
  ethyBalTail = false,
): boolean {
  const cap = bridgeCap(ethyBalTail)
  return head > pivot && head - pivot > cap
}

/** No account progress and no serving snap peer before a far-behind pivot is replaced. */
export const SNAP_UNSERVED_PIVOT_MS = 20_000

/**
 * Replace a snap pivot that peers are not serving and that is already too far
 * behind the best reported head.
 */
export function shouldRefreshStaleSnapPivot(opts: {
  phase: string
  handoffCatchup: boolean
  pivotBridging: boolean
  pivotBlock: bigint | undefined
  headBlock: bigint | undefined
  servingSnapPeers: number
  msSinceProgress: number
  msSinceBalProgress: number
  ethyBalTail?: boolean
}): boolean {
  if (opts.handoffCatchup || opts.phase !== 'SNAP_SYNCING') return false
  if (opts.pivotBridging) return false
  if (opts.msSinceBalProgress < BAL_BRIDGE_PROGRESS_GUARD_MS) return false
  if (opts.pivotBlock === undefined || opts.headBlock === undefined) return false
  if (opts.servingSnapPeers > 0) return false
  if (opts.msSinceProgress < SNAP_UNSERVED_PIVOT_MS) return false
  return savedPivotExceedsResumeGap(opts.headBlock, opts.pivotBlock, opts.ethyBalTail === true)
}

export function shouldUnpauseSnapBridge(head: bigint, pivot: bigint): boolean {
  if (head <= pivot) return true
  return head - pivot <= BRIDGE_UNPAUSE_GAP
}

export type SnapResumeSaved = {
  pivotBlockNumber: bigint
  baseSyncComplete: boolean
  bucketsDoneCount: number
  lastVerifiedBlockNumber?: bigint
}

export type SnapResumeDecision =
  | 'anchor-fresh'
  | 'wait-for-head'
  | 'resume-snap'
  | 'bridge-pivot'
  | 'reset-stale'
  | 'handoff-catchup'

export function decideSnapResume(opts: {
  fresh: boolean
  saved: SnapResumeSaved | undefined
  head: bigint | undefined
  ethyBalTail?: boolean
}): SnapResumeDecision {
  if (opts.fresh || opts.saved === undefined) return 'anchor-fresh'
  if (opts.saved.baseSyncComplete) return 'handoff-catchup'
  if (opts.head === undefined) return 'wait-for-head'
  const gap = opts.head - opts.saved.pivotBlockNumber
  if (gap <= SNAP_RESUME_MAX_GAP) return 'resume-snap'
  const cap = bridgeCap(opts.ethyBalTail === true)
  if (gap <= cap) return 'bridge-pivot'
  return 'reset-stale'
}

export function snapResumeProgressPct(saved: SnapResumeSaved | undefined): number {
  if (saved === undefined) return 0
  return Math.round((saved.bucketsDoneCount / 16) * 100)
}

/**
 * Do not anchor a live pivot from a peer while saved snap on disk has not been
 * replayed into spine/state (WP-04a / WP-04c). Live pivot first would call
 * `activatePivot` and can prune journals before `loadInto` finishes.
 */
export function shouldDeferLivePivotRequest(opts: {
  fresh: boolean
  diskHydrated: boolean
  spinePivotBlockNumber: bigint | undefined
  saved: SnapResumeSaved | undefined
}): boolean {
  if (opts.fresh) return false
  if (opts.spinePivotBlockNumber !== undefined) return false
  if (opts.saved === undefined) return false
  return !opts.diskHydrated
}

/** Start account/code snap sync only after disk journals are replayed (WP-04e). */
export function shouldEnsureSnapSync(opts: {
  pivotStateRoot: Uint8Array | undefined
  diskHydrated: boolean
  handoffCatchup: boolean
}): boolean {
  if (opts.pivotStateRoot === undefined) return false
  if (opts.handoffCatchup) return false
  return opts.diskHydrated
}

/** Whether an ETHY/0 peer can serve BALs to bridge `pivot+1 .. head-16` (WP-06d). */
export function ethyBalTailAvailable(
  pivot: bigint,
  head: bigint,
  peers: Iterable<PeerTelemetry>,
  syncTransport?: SyncTransport,
): boolean {
  const needFrom = pivot + 1n
  const needTo = head > 16n ? head - 16n : head
  if (needTo < needFrom) return false
  for (const p of peers) {
    const st = p.ethyStatus
    if (st === undefined) continue
    const earliest = BigInt(st.balEarliestBlock)
    const latest = BigInt(st.balLatestBlock)
    if (earliest <= needFrom && latest >= needTo) return true
  }
  if (syncTransport === 'ethy') {
    for (const p of peers) {
      const st = p.ethyStatus
      if (st === undefined || st.bucketsBitmask === '0') continue
      const earliest = BigInt(st.balEarliestBlock)
      if (earliest <= needFrom) return true
    }
  }
  return false
}
