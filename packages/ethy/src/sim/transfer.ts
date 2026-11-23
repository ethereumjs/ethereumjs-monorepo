/** Upload/download timing helpers (WP-11a). */

import type { PolicyPreset } from './types.ts'

/** Per-joiner completion stall from bucket striping (legacy sequential vs v2 rarest-first). */
export function flashCrowdStallMs(joinerIndex: number, half: number, policy: PolicyPreset): number {
  return policy === 'legacy' ? joinerIndex * 45_000 : joinerIndex * 12_000
}

export function flashCrowdTailExtraMs(joinerIndex: number, half: number): number {
  return joinerIndex >= half ? 400_000 : 80_000
}

export function seederBandwidthBytes(megabitsPerSec: number, virtualMs: number): number {
  return megabitsPerSec * 125_000 * Math.max(1, virtualMs)
}
