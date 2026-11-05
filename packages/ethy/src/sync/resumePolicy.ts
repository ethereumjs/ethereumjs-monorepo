/** Max blocks between saved pivot and network head before discarding partial snap (D-062). */
export const SNAP_RESUME_MAX_GAP = 90n

export function savedPivotExceedsResumeGap(head: bigint, pivot: bigint): boolean {
  return head > pivot && head - pivot > SNAP_RESUME_MAX_GAP
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
  pivotBlock: bigint | undefined
  headBlock: bigint | undefined
  servingSnapPeers: number
  msSinceProgress: number
}): boolean {
  if (opts.handoffCatchup || opts.phase !== 'SNAP_SYNCING') return false
  if (opts.pivotBlock === undefined || opts.headBlock === undefined) return false
  if (opts.servingSnapPeers > 0) return false
  if (opts.msSinceProgress < SNAP_UNSERVED_PIVOT_MS) return false
  return savedPivotExceedsResumeGap(opts.headBlock, opts.pivotBlock)
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
  | 'reset-stale'
  | 'handoff-catchup'

export function decideSnapResume(opts: {
  fresh: boolean
  saved: SnapResumeSaved | undefined
  head: bigint | undefined
}): SnapResumeDecision {
  if (opts.fresh || opts.saved === undefined) return 'anchor-fresh'
  if (opts.saved.baseSyncComplete) return 'handoff-catchup'
  if (opts.head === undefined) return 'wait-for-head'
  const gap = opts.head - opts.saved.pivotBlockNumber
  if (gap <= SNAP_RESUME_MAX_GAP) return 'resume-snap'
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
