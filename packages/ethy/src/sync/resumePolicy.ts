/** Max blocks between saved pivot and network head before discarding partial snap (D-062). */
export const SNAP_RESUME_MAX_GAP = 90n

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
