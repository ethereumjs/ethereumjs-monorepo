export type SyncMode = 'auto' | 'ethy' | 'snap'

export type SyncTransport = 'unset' | 'ethy' | 'snap'

export const ETHY_DISCOVERY_GRACE_MS = 2_500

export const MAX_ETHY_BAL_TAIL_BLOCKS = 64_800n

/** Prefer fresh canonical SNAP in `auto` when ETHY snapshots lag beyond this (WP-06g). */
export const DEFAULT_MAX_SWARM_TAIL_BLOCKS = 2048n

export type EthySeederView = {
  bucketsBitmask: number
  basePivotBlock: bigint
  balEarliestBlock: bigint
  balLatestBlock?: bigint
}

export function isUsableEthySeeder(
  seeder: EthySeederView,
  bestPeerHead: bigint,
  syncMode: SyncMode,
): boolean {
  if (seeder.bucketsBitmask === 0) return false
  if (syncMode === 'ethy') return true
  if (seeder.basePivotBlock === 0n) return false
  if (bestPeerHead > seeder.basePivotBlock) {
    const tail = bestPeerHead - seeder.basePivotBlock
    if (tail > MAX_ETHY_BAL_TAIL_BLOCKS) return false
  }
  if (seeder.bucketsBitmask !== 0xffff && seeder.balEarliestBlock > seeder.basePivotBlock + 1n) {
    return false
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
): { peerId: string; seeder: EthySeederView } | undefined {
  const usable = seeders.filter((row) => isUsableEthySeeder(row.seeder, bestPeerHead, syncMode))
  if (usable.length === 0) return undefined
  usable.sort(compareSeederFreshness)
  return usable[0]
}

export function pickAllUsableEthySeeders(
  seeders: Array<{ peerId: string; seeder: EthySeederView }>,
  bestPeerHead: bigint,
  syncMode: SyncMode,
): Array<{ peerId: string; seeder: EthySeederView }> {
  const usable = seeders.filter((row) => isUsableEthySeeder(row.seeder, bestPeerHead, syncMode))
  usable.sort(compareSeederFreshness)
  return usable
}

export function freshestEthyPivot(
  seeders: Array<{ peerId: string; seeder: EthySeederView }>,
): bigint | undefined {
  let best: bigint | undefined
  for (const row of seeders) {
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
}): boolean {
  if (opts.syncMode === 'ethy' || opts.explicitConnect || !opts.hasSnapPeer) return false
  if (opts.syncMode !== 'auto') return false
  if (opts.freshestEthyPivotBlock === undefined) return false
  if (opts.bestPeerHead <= opts.freshestEthyPivotBlock) return false
  return opts.bestPeerHead - opts.freshestEthyPivotBlock > DEFAULT_MAX_SWARM_TAIL_BLOCKS
}

export function shouldLockSnapAfterGrace(
  syncMode: SyncMode,
  syncTransport: SyncTransport,
  graceElapsedMs: number,
  hasUsableSeeder: boolean,
): boolean {
  if (syncTransport !== 'unset') return false
  if (syncMode === 'snap') return true
  if (syncMode === 'ethy') return false
  if (hasUsableSeeder) return false
  return graceElapsedMs >= ETHY_DISCOVERY_GRACE_MS
}
