export type SyncMode = 'auto' | 'ethy' | 'snap'

export type SyncTransport = 'unset' | 'ethy' | 'snap'

export const ETHY_DISCOVERY_GRACE_MS = 2_500

export const MAX_ETHY_BAL_TAIL_BLOCKS = 64_800n

export type EthySeederView = {
  bucketsBitmask: number
  basePivotBlock: bigint
  balEarliestBlock: bigint
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

export function pickUsableEthySeeder(
  seeders: Array<{ peerId: string; seeder: EthySeederView }>,
  bestPeerHead: bigint,
  syncMode: SyncMode,
): { peerId: string; seeder: EthySeederView } | undefined {
  for (const row of seeders) {
    if (isUsableEthySeeder(row.seeder, bestPeerHead, syncMode)) return row
  }
  return undefined
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
