import type { WorkerPeerSnapshot } from '@ethereumjs/devp2p'
import { bytesToHex } from '@ethereumjs/util'

import { copyBalTailRange } from '../persist/balTailArchive.ts'
import type { SnapPivotStore } from '../persist/snapStore.ts'
import { seederFromWorkerStatus } from './ethySeederSchedule.ts'
import { MACRO_GENERATION_GRID_BLOCKS } from './swarmGenerationPolicy.ts'
import { pickUsableEthySeeder } from './syncSourceSelector.ts'

export type ShadowPivotSession = {
  stateRootHex: string
  targetPivotBlock: bigint
  balBlocksCopied: number
  seederPeerId: string
  bucketsBitmask: number
  bucketsDone: number
  accountsComplete: boolean
  stage: 'bal-copy' | 'await-accounts' | 'ready-to-flip' | 'done'
}

/** True when every bucket bit required by the seeder mask is downloaded into shadow storage. */
export function shadowEthySeedMaskSatisfied(
  mask: number,
  bucketsDone: ReadonlySet<number>,
): boolean {
  for (let b = 0; b < 16; b++) {
    if ((mask & (1 << b)) === 0) continue
    if (!bucketsDone.has(b)) return false
  }
  return true
}

export function pickShadowEthySeeder(
  peers: readonly WorkerPeerSnapshot[],
  head: bigint,
  localPivot: bigint,
):
  | { peerId: string; stateRootHex: string; basePivotBlock: bigint; bucketsBitmask: number }
  | undefined {
  const seeders: Array<{
    peerId: string
    seeder: import('./syncSourceSelector.ts').EthySeederView
    bucketsBitmask: number
  }> = []
  const roots = new Map<string, Uint8Array>()
  const masks = new Map<string, number>()
  for (const p of peers) {
    const st = p.ethyStatus
    if (st === undefined) continue
    const desc = seederFromWorkerStatus(p.id, st)
    if (desc === undefined) continue
    roots.set(p.id, desc.basePivotRoot)
    masks.set(p.id, desc.bucketsBitmask)
    seeders.push({
      peerId: p.id,
      seeder: {
        bucketsBitmask: desc.bucketsBitmask,
        basePivotBlock: desc.basePivotBlock,
        balEarliestBlock: desc.balEarliestBlock,
      },
      bucketsBitmask: desc.bucketsBitmask,
    })
  }
  const pick = pickUsableEthySeeder(seeders, head, 'auto')
  if (pick === undefined) return undefined
  if (pick.seeder.basePivotBlock < localPivot + MACRO_GENERATION_GRID_BLOCKS) return undefined
  const root = roots.get(pick.peerId)
  if (root === undefined) return undefined
  const hex = bytesToHex(root)
  const bitmask = masks.get(pick.peerId) ?? pick.seeder.bucketsBitmask
  return {
    peerId: pick.peerId,
    stateRootHex: hex,
    basePivotBlock: pick.seeder.basePivotBlock,
    bucketsBitmask: bitmask,
  }
}

export function startShadowBalTailCopy(opts: {
  snapStore: SnapPivotStore
  sourceStateRootHex: string
  shadowStateRootHex: string
  fromBlock: bigint
  throughBlock: bigint
}): number {
  opts.snapStore.beginShadowPivot(opts.shadowStateRootHex)
  const fromDir = opts.snapStore.pivotDirForRoot(opts.sourceStateRootHex)
  const toDir = opts.snapStore.pivotDirForRoot(opts.shadowStateRootHex)
  return copyBalTailRange(fromDir, toDir, opts.fromBlock, opts.throughBlock)
}

export function advanceShadowPivotSession(opts: {
  snapStore: SnapPivotStore
  session: ShadowPivotSession
}): ShadowPivotSession {
  if (opts.session.stage === 'bal-copy') {
    opts.session.stage = 'await-accounts'
  }
  if (
    opts.session.stage === 'await-accounts' &&
    opts.session.accountsComplete &&
    opts.snapStore.shadowPivotHasPivotMeta(opts.session.stateRootHex)
  ) {
    opts.session.stage = 'ready-to-flip'
  }
  return opts.session
}
