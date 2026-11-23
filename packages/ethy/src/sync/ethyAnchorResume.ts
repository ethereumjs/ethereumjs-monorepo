import type { WorkerPeerSnapshot } from '@ethereumjs/devp2p'

import { seederFromWorkerStatus } from './ethySeederSchedule.ts'
import type { SyncMode } from './syncSourceSelector.ts'
import { isFreshEthyPreemptCandidate, pickUsableEthySeeder } from './syncSourceSelector.ts'

export type EthyAnchorPick = {
  peerId: string
  basePivotBlock: bigint
}

/** Fresh usable ETHY/0 anchor when saved snap is reset-stale but swarm can serve (WP-11b). */
export function pickEthyAnchorForStaleResume(
  peers: readonly WorkerPeerSnapshot[],
  head: bigint,
  savedPivot: bigint,
  syncMode: SyncMode,
): EthyAnchorPick | undefined {
  const seeders: Array<{
    peerId: string
    seeder: import('./syncSourceSelector.ts').EthySeederView
  }> = []
  for (const p of peers) {
    const st = p.ethyStatus
    if (st === undefined) continue
    const desc = seederFromWorkerStatus(p.id, st)
    if (desc === undefined) continue
    seeders.push({
      peerId: p.id,
      seeder: {
        bucketsBitmask: desc.bucketsBitmask,
        basePivotBlock: desc.basePivotBlock,
        balEarliestBlock: desc.balEarliestBlock,
      },
    })
  }
  const pick = pickUsableEthySeeder(seeders, head, syncMode)
  if (pick === undefined) return undefined
  if (pick.seeder.basePivotBlock <= savedPivot) return undefined
  if (!isFreshEthyPreemptCandidate(pick.seeder, head)) return undefined
  return { peerId: pick.peerId, basePivotBlock: pick.seeder.basePivotBlock }
}
