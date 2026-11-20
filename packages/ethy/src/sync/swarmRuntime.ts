import * as fs from 'node:fs'
import * as os from 'node:os'

import type { Devp2pWorkerClient } from '@ethereumjs/devp2p'
import type { WorkerPeerSnapshot } from '@ethereumjs/devp2p'

import { readBalTailManifest } from '../persist/balTailArchive.ts'
import type { SnapPivotStore } from '../persist/snapStore.ts'
import type { EthySpine, SpineSwarmSnapshot } from '../spine/types.ts'
import { seederFromWorkerStatus } from './ethySeederSchedule.ts'
import { pickShadowRefreshMode, shouldStartShadowRefresh } from './shadowRefresh.ts'
import {
  type MinterAnnouncement,
  computeElectionDelayMs,
  electionWeight,
  evaluateMinterSuppression,
  freshestCompletedEthyPivot,
  macroGenerationBlock,
} from './swarmGenerationPolicy.ts'

export function minHealPruneBlock(
  snapStore: SnapPivotStore | undefined,
  newPivotBlock: bigint,
  shadowRefreshDisabled: boolean,
): bigint {
  if (snapStore === undefined) return newPivotBlock
  return snapStore.healPruneCapForPivotStep(newPivotBlock, shadowRefreshDisabled)
}

export function refreshSpineSwarmTelemetry(opts: {
  spine: EthySpine
  snapStore?: SnapPivotStore
  shadowRefreshEnabled: boolean
  nodeId?: Uint8Array
  processStartedAtMs: number
  peers: readonly WorkerPeerSnapshot[]
  electionHandle?: GenerationElectionHandle
}): void {
  const { spine, snapStore } = opts
  const head = spine.bestPeerHead ?? spine.headBlockNumber ?? spine.pivotBlockNumber ?? 0n
  const localPivot = spine.pivotBlockNumber ?? 0n
  const snap: SpineSwarmSnapshot = spine.swarm ?? {}
  snap.generationAgeBlocks = head > localPivot ? head - localPivot : 0n
  const pivotDir = snapStore?.activePivotRootDir()
  if (pivotDir !== undefined) {
    const man = readBalTailManifest(pivotDir)
    if (man !== undefined) {
      snap.balTailEarliest = man.earliest
      snap.balTailLatest = man.latest
      snap.balTailContiguous = man.earliest <= localPivot + 1n
    }
  }
  const pivotBytes = snapStore?.estimateActivePivotBytes() ?? 0n
  const balEarliest = snap.balTailEarliest ?? localPivot + 1n
  let freeBytes = 8n * 1024n * 1024n * 1024n
  try {
    const st = fs.statfsSync(snapStore?.dataRoot() ?? os.tmpdir())
    freeBytes = BigInt(st.bavail) * BigInt(st.bsize)
  } catch {
    // ignore
  }
  const shadow = spine.swarm?.shadowRefresh ?? { mode: 'idle' as const }
  if (
    shouldStartShadowRefresh({
      phase: spine.phase,
      freeBytes,
      pivotBytes,
      head,
      localPivot,
      balEarliest,
      enabled: opts.shadowRefreshEnabled,
    })
  ) {
    const seeders = opts.peers
      .map((p) => {
        const st = p.ethyStatus
        if (st === undefined) return undefined
        return seederFromWorkerStatus(p.id, st)
      })
      .filter((s): s is NonNullable<typeof s> => s !== undefined)
    const freshest = freshestCompletedEthyPivot(
      seeders.map((s) => ({
        basePivotBlock: s.basePivotBlock,
        bucketsBitmask: s.bucketsBitmask,
      })),
    )
    const announcements = buildMinterAnnouncements(opts.peers)
    const gen = macroGenerationBlock(head)
    const suppression = evaluateMinterSuppression({
      nowMs: Date.now(),
      generationBlock: gen,
      announcements,
    })
    const electionDelayElapsed =
      opts.electionHandle !== undefined && Date.now() >= opts.electionHandle.deadlineMs
    shadow.mode = pickShadowRefreshMode({
      localPivot,
      freshestSwarmPivot: freshest,
      swarmUsable: freshest !== undefined && freshest > localPivot,
      electionSuppressed: suppression.state === 'suppressed',
      electionDelayElapsed,
    })
    if (suppression.suppressorPeerId !== undefined) {
      shadow.suppressedByPeerId = suppression.suppressorPeerId
    }
    if (opts.electionHandle !== undefined) {
      shadow.electionDeadlineMs = opts.electionHandle.deadlineMs
    }
    shadow.targetBlock = macroGenerationBlock(head + 1024n)
  } else {
    shadow.mode = 'idle'
  }
  snap.shadowRefresh = shadow
  spine.swarm = snap
}

function buildMinterAnnouncements(peers: readonly WorkerPeerSnapshot[]): MinterAnnouncement[] {
  const out: MinterAnnouncement[] = []
  for (const p of peers) {
    const st = p.ethyStatus
    if (st === undefined) continue
    const mask = st.bucketsBitmask.startsWith('0x')
      ? Number.parseInt(st.bucketsBitmask, 16)
      : Number.parseInt(st.bucketsBitmask, 10)
    out.push({
      peerId: p.id,
      basePivotBlock: BigInt(st.basePivotBlock),
      bucketsBitmask: mask,
      connected: true,
      headerVerified: st.latestBlockHash !== undefined && st.latestBlockHash.length > 0,
    })
  }
  return out
}

export type GenerationElectionHandle = {
  generationBlock: bigint
  deadlineMs: number
}

export function armGenerationElection(opts: {
  spine: EthySpine
  nodeId: Uint8Array
  bestHead: bigint
  knownActiveEthyPeers: number
  publicEndpoint: boolean
  snapPeerCount: number
  uptimeMs: number
}): GenerationElectionHandle | undefined {
  if (opts.spine.phase !== 'HEAD_FOLLOWING') return undefined
  const localPivot = opts.spine.pivotBlockNumber ?? 0n
  if (opts.bestHead <= localPivot) return undefined
  const gen = macroGenerationBlock(opts.bestHead)
  const w = electionWeight({
    publicEndpoint: opts.publicEndpoint,
    uptimeMs: opts.uptimeMs,
    snapPeerCount: opts.snapPeerCount,
    knownActiveEthyPeers: opts.knownActiveEthyPeers,
  })
  const delay = computeElectionDelayMs({
    nodeId: opts.nodeId,
    generationBlock: gen,
    knownActiveEthyPeers: opts.knownActiveEthyPeers,
    weight: w,
  })
  return { generationBlock: gen, deadlineMs: Date.now() + delay }
}

/** True once the hash-lottery delay for the current macro-generation has elapsed. */
export function electionDelayElapsed(
  handle: GenerationElectionHandle | undefined,
  nowMs = Date.now(),
): boolean {
  return handle !== undefined && nowMs >= handle.deadlineMs
}

export function tickGenerationElection(
  _client: Devp2pWorkerClient,
  spine: EthySpine,
  handle: GenerationElectionHandle | undefined,
): boolean {
  if (spine.phase !== 'HEAD_FOLLOWING') return false
  return electionDelayElapsed(handle)
}
