import type { EthyPhase } from '../spine/types.ts'
import { MACRO_GENERATION_GRID_BLOCKS, SOFT_REFRESH_AGE_BLOCKS } from './swarmGenerationPolicy.ts'

export type ShadowRefreshMode = 'idle' | 'ethy-shadow' | 'snap-mint' | 'waiting-election'

const MIN_FREE_BYTES = 2n * 1024n * 1024n * 1024n

export function shouldStartShadowRefresh(opts: {
  phase: EthyPhase
  freeBytes: bigint
  pivotBytes: bigint
  head: bigint
  localPivot: bigint
  balEarliest: bigint
  enabled: boolean
}): boolean {
  if (!opts.enabled) return false
  if (opts.phase !== 'HEAD_FOLLOWING') return false
  const needFree = opts.pivotBytes * 2n
  const minFree = needFree > MIN_FREE_BYTES ? needFree : MIN_FREE_BYTES
  if (opts.freeBytes < minFree) return false
  const age = opts.head > opts.localPivot ? opts.head - opts.localPivot : 0n
  const balGap = opts.balEarliest > opts.localPivot + 1n
  return age >= SOFT_REFRESH_AGE_BLOCKS || balGap
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
