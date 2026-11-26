import { setPhase } from '../spine/createSpine.ts'
import type { EthySpine } from '../spine/types.ts'
import { seedBalCatchUp } from '../sync/balSync.ts'
import { onboardingBalStartBlock } from '../sync/blockCalendar.ts'

export function custodyFastPathEnabled(opts: {
  snapBootstrap: boolean
  baseSyncComplete: boolean
}): boolean {
  if (opts.snapBootstrap) return false
  return !opts.baseSyncComplete
}

/** Pivot block for the rolling BAL onboarding window (WP-16d). */
export function custodyOnboardingPivotBlock(head: bigint): bigint {
  const start = onboardingBalStartBlock(head)
  return start > 0n ? start - 1n : 0n
}

/**
 * After the onboarding pivot is anchored, catch up BALs through the network head
 * and transition toward `HEAD_FOLLOWING` without snap base sync.
 */
export function beginCustodyBalOnboarding(spine: EthySpine, head: bigint): void {
  const pivot = spine.pivotBlockNumber
  if (pivot === undefined) return
  const windowStart = onboardingBalStartBlock(head)
  const anchor = pivot >= windowStart ? pivot : windowStart
  spine.lastVerifiedBlockNumber = anchor
  spine.headBlockNumber = anchor
  spine.headStateRoot = spine.pivotStateRoot
  seedBalCatchUp(spine, head)
  if (spine.phase === 'BAL_CATCHUP') {
    spine.syncTransport = spine.syncTransport === 'unset' ? 'ethy' : spine.syncTransport
    return
  }
  if (spine.phase !== 'HEAD_FOLLOWING') {
    setPhase(spine, 'HEAD_FOLLOWING')
  }
}

/** OR mask of assigned custody buckets for ETHY PEX steering. */
export function desiredCustodyBucketsMask(
  buckets: readonly number[] | undefined,
): number | undefined {
  if (buckets === undefined || buckets.length === 0) return undefined
  let mask = 0
  for (const b of buckets) {
    if (b >= 0 && b <= 15) mask |= 1 << b
  }
  return mask === 0 ? undefined : mask
}
