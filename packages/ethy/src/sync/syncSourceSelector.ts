import { HARD_PREFER_SNAP_AGE_BLOCKS, SOFT_REFRESH_AGE_BLOCKS } from './swarmGenerationPolicy.ts'

export type SyncMode = 'auto' | 'ethy' | 'snap'

export type SyncTransport = 'unset' | 'ethy' | 'snap'

export const ETHY_DISCOVERY_GRACE_MS = 2_500
export const ETHY_DISCOVERY_EXTENDED_GRACE_MS = 10_000

export const MAX_ETHY_BAL_TAIL_BLOCKS = 64_800n

/** Prefer fresh canonical SNAP in `auto` when ETHY snapshots lag beyond this (WP-11b). */
export const DEFAULT_MAX_SWARM_TAIL_BLOCKS = HARD_PREFER_SNAP_AGE_BLOCKS

export type EthySeederView = {
  bucketsBitmask: number
  basePivotBlock: bigint
  balEarliestBlock: bigint
  balLatestBlock?: bigint
}

export type IsUsableEthySeederOpts = {
  bridgeCovered?: boolean
}

export function isUsableEthySeeder(
  seeder: EthySeederView,
  bestPeerHead: bigint,
  syncMode: SyncMode,
  opts: IsUsableEthySeederOpts = {},
): boolean {
  if (seeder.bucketsBitmask === 0) return false
  if (syncMode === 'ethy') return true
  if (seeder.basePivotBlock === 0n) return false
  if (bestPeerHead > seeder.basePivotBlock) {
    const tail = bestPeerHead - seeder.basePivotBlock
    if (tail > MAX_ETHY_BAL_TAIL_BLOCKS) return false
  }
  const pivot = seeder.basePivotBlock
  const needBridge = pivot < bestPeerHead
  if (needBridge && seeder.balEarliestBlock > pivot + 1n) {
    if (!opts.bridgeCovered) return false
  }
  return true
}

function compareSeederFreshness(
  a: { peerId: string; seeder: EthySeederView },
  b: { peerId: string; seeder: EthySeederView },
): number {
  if (a.seeder.basePivotBlock === b.seeder.basePivotBlock) return 0
  return a.seeder.basePivotBlock > b.seeder.basePivotBlock ? -1 : 1
}

export function pickUsableEthySeeder(
  seeders: Array<{ peerId: string; seeder: EthySeederView }>,
  bestPeerHead: bigint,
  syncMode: SyncMode,
  bridgeCoveredFor?: (seeder: EthySeederView) => boolean,
): { peerId: string; seeder: EthySeederView } | undefined {
  const usable = seeders.filter((row) =>
    isUsableEthySeeder(row.seeder, bestPeerHead, syncMode, {
      bridgeCovered: bridgeCoveredFor?.(row.seeder),
    }),
  )
  if (usable.length === 0) return undefined
  usable.sort(compareSeederFreshness)
  return usable[0]
}

export function pickAllUsableEthySeeders(
  seeders: Array<{ peerId: string; seeder: EthySeederView }>,
  bestPeerHead: bigint,
  syncMode: SyncMode,
  bridgeCoveredFor?: (seeder: EthySeederView) => boolean,
): Array<{ peerId: string; seeder: EthySeederView }> {
  const usable = seeders.filter((row) =>
    isUsableEthySeeder(row.seeder, bestPeerHead, syncMode, {
      bridgeCovered: bridgeCoveredFor?.(row.seeder),
    }),
  )
  usable.sort(compareSeederFreshness)
  return usable
}

export function freshestEthyPivot(
  seeders: Array<{ peerId: string; seeder: EthySeederView }>,
): bigint | undefined {
  let best: bigint | undefined
  for (const row of seeders) {
    if (row.seeder.bucketsBitmask === 0) continue
    if (row.seeder.basePivotBlock === 0n) continue
    if (best === undefined || row.seeder.basePivotBlock > best) {
      best = row.seeder.basePivotBlock
    }
  }
  return best
}

export function preferCanonicalSnapOverEthy(opts: {
  syncMode: SyncMode
  explicitConnect: boolean
  bestPeerHead: bigint
  freshestEthyPivotBlock: bigint | undefined
  hasSnapPeer: boolean
  inFlightMintVerified?: boolean
}): boolean {
  if (opts.syncMode === 'ethy' || opts.explicitConnect || !opts.hasSnapPeer) return false
  if (opts.syncMode !== 'auto') return false
  if (opts.inFlightMintVerified) return false
  if (opts.freshestEthyPivotBlock === undefined) return false
  if (opts.bestPeerHead <= opts.freshestEthyPivotBlock) return false
  return opts.bestPeerHead - opts.freshestEthyPivotBlock > DEFAULT_MAX_SWARM_TAIL_BLOCKS
}

/** Usable for early SNAP → ETHY preemption when newly connected (WP-11b). */
export function isFreshEthyPreemptCandidate(seeder: EthySeederView, bestPeerHead: bigint): boolean {
  if (seeder.bucketsBitmask === 0) return false
  if (bestPeerHead <= seeder.basePivotBlock) return true
  const age = bestPeerHead - seeder.basePivotBlock
  return age <= SOFT_REFRESH_AGE_BLOCKS
}

export function shouldLockSnapAfterGrace(
  syncMode: SyncMode,
  syncTransport: SyncTransport,
  graceElapsedMs: number,
  hasUsableSeeder: boolean,
  ethyDialInFlight = false,
): boolean {
  if (syncTransport !== 'unset') return false
  if (syncMode === 'snap') return true
  if (syncMode === 'ethy') return false
  if (hasUsableSeeder) return false
  const limit = ethyDialInFlight ? ETHY_DISCOVERY_EXTENDED_GRACE_MS : ETHY_DISCOVERY_GRACE_MS
  return graceElapsedMs >= limit
}
