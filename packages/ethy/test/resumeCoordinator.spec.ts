import { assert, describe, it } from 'vitest'

import {
  notePivotBridgingProgress,
  planResumeStart,
  shouldReleaseSnapBridge,
} from '../src/sync/resumeCoordinator.ts'
import { BRIDGE_UNPAUSE_GAP, MAX_BAL_BRIDGE_BLOCKS } from '../src/sync/resumePolicy.ts'

describe('[Ethy/Sync]: resume coordinator', () => {
  it('planResumeStart starts snap and BAL on resume-snap', () => {
    const plan = planResumeStart('resume-snap', 100n, 150n)
    assert.isTrue(plan.startSnap)
    assert.isTrue(plan.startBal)
    assert.isUndefined(plan.pivotBridging)
  })

  it('planResumeStart bridge-pivot holds snap until target is reachable', () => {
    const plan = planResumeStart('bridge-pivot', 100n, 500n)
    assert.isFalse(plan.startSnap)
    assert.isTrue(plan.startBal)
    assert.isDefined(plan.pivotBridging)
    assert.equal(plan.pivotBridging!.fromBlock, 100n)
    assert.equal(plan.pivotBridging!.targetBlock, 500n - 16n)
  })

  it('shouldReleaseSnapBridge opens snap inside the live window', () => {
    const pivot = 1_000n
    assert.isFalse(shouldReleaseSnapBridge(pivot + MAX_BAL_BRIDGE_BLOCKS, pivot))
    assert.isTrue(shouldReleaseSnapBridge(pivot + BRIDGE_UNPAUSE_GAP, pivot))
  })

  it('notePivotBridgingProgress updates current block', () => {
    const next = notePivotBridgingProgress(
      { fromBlock: 10n, currentBlock: 10n, targetBlock: 100n },
      25n,
    )
    assert.equal(next.currentBlock, 25n)
  })
})
