import type { PivotBridgingProgress } from '../spine/types.ts'
import { type SnapResumeDecision, shouldUnpauseSnapBridge } from './resumePolicy.ts'

export type ResumeStartPlan = {
  startSnap: boolean
  startBal: boolean
  pivotBridging?: PivotBridgingProgress
}

const BRIDGE_HEAD_MARGIN = 16n

/**
 * Turn a snap resume decision into which sync engines to start (WP-06d).
 * Does not perform network I/O.
 */
export function planResumeStart(
  decision: SnapResumeDecision,
  pivot: bigint,
  head: bigint,
): ResumeStartPlan {
  if (decision === 'handoff-catchup') {
    return { startSnap: false, startBal: true }
  }
  if (decision === 'resume-snap') {
    return { startSnap: true, startBal: true }
  }
  if (decision === 'bridge-pivot') {
    let targetBlock = head > BRIDGE_HEAD_MARGIN ? head - BRIDGE_HEAD_MARGIN : head
    if (targetBlock < pivot) targetBlock = pivot
    if (targetBlock <= pivot) {
      return { startSnap: true, startBal: true }
    }
    return {
      startSnap: false,
      startBal: true,
      pivotBridging: {
        fromBlock: pivot,
        currentBlock: pivot,
        targetBlock,
      },
    }
  }
  return { startSnap: false, startBal: false }
}

export function shouldReleaseSnapBridge(head: bigint, pivot: bigint): boolean {
  return shouldUnpauseSnapBridge(head, pivot)
}

export function notePivotBridgingProgress(
  bridging: PivotBridgingProgress,
  pivotBlock: bigint,
): PivotBridgingProgress {
  return { ...bridging, currentBlock: pivotBlock }
}
