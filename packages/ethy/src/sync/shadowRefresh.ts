import type { EthyPhase } from '../spine/types.ts'
import { MACRO_GENERATION_GRID_BLOCKS, SOFT_REFRESH_AGE_BLOCKS } from './swarmGenerationPolicy.ts'

export type ShadowRefreshMode = 'idle' | 'ethy-shadow' | 'snap-mint' | 'waiting-election'

export type ShadowRefreshBlockReason = 'disabled' | 'phase' | 'fresh' | 'low-disk'

export type ShadowRefreshEligibility = {
  eligible: boolean
  blockedReason?: ShadowRefreshBlockReason
  freeBytes: bigint
  requiredFreeBytes: bigint
}

export const MIN_FREE_BYTES = 2n * 1024n * 1024n * 1024n
export const SHADOW_HEADROOM_MARGIN_BYTES = 2n * 1024n * 1024n * 1024n

/**
 * Required free filesystem bytes for a background shadow pivot refresh.
 *
 * The active pivot is already on disk (already subtracted from `freeBytes`), and a
 * shadow refresh writes one new `accounts/` + `bal-tail/` pivot before atomic flip,
 * so starting needs `pivotBytes + 2 GiB` (min `2 GiB`). While a shadow refresh is
 * already writing to disk, only the `2 GiB` emergency floor is enforced so it does
 * not abort itself mid-sync as it consumes the space reserved for it.
 */
export function requiredShadowFreeBytes(pivotBytes: bigint, inProgress = false): bigint {
  if (inProgress) return MIN_FREE_BYTES
  const need = pivotBytes + SHADOW_HEADROOM_MARGIN_BYTES
  return need > MIN_FREE_BYTES ? need : MIN_FREE_BYTES
}

export function evaluateShadowRefreshEligibility(opts: {
  phase: EthyPhase
  freeBytes: bigint
  pivotBytes: bigint
  head: bigint
  localPivot: bigint
  balEarliest: bigint
  enabled: boolean
  inProgress?: boolean
}): ShadowRefreshEligibility {
  const requiredFreeBytes = requiredShadowFreeBytes(opts.pivotBytes, opts.inProgress === true)
  if (!opts.enabled) {
    return {
      eligible: false,
      blockedReason: 'disabled',
      freeBytes: opts.freeBytes,
      requiredFreeBytes,
    }
  }
  if (opts.phase !== 'HEAD_FOLLOWING') {
    return {
      eligible: false,
      blockedReason: 'phase',
      freeBytes: opts.freeBytes,
      requiredFreeBytes,
    }
  }
  const age = opts.head > opts.localPivot ? opts.head - opts.localPivot : 0n
  const balGap = opts.balEarliest > opts.localPivot + 1n
  const needed = age >= SOFT_REFRESH_AGE_BLOCKS || balGap
  if (!needed) {
    return {
      eligible: false,
      blockedReason: 'fresh',
      freeBytes: opts.freeBytes,
      requiredFreeBytes,
    }
  }
  if (opts.freeBytes < requiredFreeBytes) {
    return {
      eligible: false,
      blockedReason: 'low-disk',
      freeBytes: opts.freeBytes,
      requiredFreeBytes,
    }
  }
  return {
    eligible: true,
    freeBytes: opts.freeBytes,
    requiredFreeBytes,
  }
}

export function shouldStartShadowRefresh(opts: {
  phase: EthyPhase
  freeBytes: bigint
  pivotBytes: bigint
  head: bigint
  localPivot: bigint
  balEarliest: bigint
  enabled: boolean
  inProgress?: boolean
}): boolean {
  return evaluateShadowRefreshEligibility(opts).eligible
}

export function pickShadowRefreshMode(opts: {
  localPivot: bigint
  freshestSwarmPivot: bigint | undefined
  swarmUsable: boolean
  electionSuppressed: boolean
  electionDelayElapsed: boolean
}): ShadowRefreshMode {
  if (
    opts.freshestSwarmPivot !== undefined &&
    opts.swarmUsable &&
    opts.freshestSwarmPivot >= opts.localPivot + MACRO_GENERATION_GRID_BLOCKS
  ) {
    return 'ethy-shadow'
  }
  if (opts.electionSuppressed) return 'waiting-election'
  if (opts.electionDelayElapsed) return 'snap-mint'
  return 'waiting-election'
}
