import * as fs from 'node:fs'
import * as os from 'node:os'

import type { Devp2pWorkerClient } from '@ethereumjs/devp2p'
import type { WorkerPeerSnapshot } from '@ethereumjs/devp2p'

import { readBalTailManifest } from '../persist/balTailArchive.ts'
import type { SnapPivotStore } from '../persist/snapStore.ts'
import type { EthySpine, SpineSwarmSnapshot } from '../spine/types.ts'
import { seederFromWorkerStatus } from './ethySeederSchedule.ts'
import { type MinterHeaderBook, minterHeaderMatchesStatus } from './minterHeaderBook.ts'
import {
  type MinterLivenessBook,
  minterLastServeAt,
  minterZeroMaskSince,
  noteMinterStatus,
} from './minterLiveness.ts'
import { pickShadowRefreshMode, shouldStartShadowRefresh } from './shadowRefresh.ts'
import {
  type MinterAnnouncement,
  type MinterSuppressionState,
  backupElectionStaggerMs,
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
  minterLiveness?: MinterLivenessBook
  minterHeaders?: MinterHeaderBook
  bestVerifiedHead?: bigint
  nowMs?: number
}): void {
  const nowMs = opts.nowMs ?? Date.now()
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
    const gen = macroGenerationBlock(head)
    const bestVerifiedHead = opts.bestVerifiedHead ?? head
    const announcements = buildMinterAnnouncements({
      peers: opts.peers,
      book: opts.minterLiveness,
      headerBook: opts.minterHeaders,
      generationBlock: gen,
      bestVerifiedHead,
      nowMs,
    })
    const suppression = evaluateMinterSuppression({
      nowMs,
      generationBlock: gen,
      bestVerifiedHead,
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
    shadow.suppressionState = suppression.state
    if (suppression.suppressorPeerId !== undefined) {
      shadow.suppressedByPeerId = suppression.suppressorPeerId
    } else {
      shadow.suppressedByPeerId = undefined
    }
    if (suppression.stalledPeerIds.length > 0) {
      shadow.stalledMinterPeerIds = suppression.stalledPeerIds
    } else {
      shadow.stalledMinterPeerIds = undefined
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

export function buildMinterAnnouncements(opts: {
  peers: readonly WorkerPeerSnapshot[]
  book?: MinterLivenessBook
  headerBook?: MinterHeaderBook
  generationBlock?: bigint
  bestVerifiedHead?: bigint
  nowMs?: number
}): MinterAnnouncement[] {
  const nowMs = opts.nowMs ?? Date.now()
  const out: MinterAnnouncement[] = []
  const gen = opts.generationBlock ?? 0n
  for (const p of opts.peers) {
    const st = p.ethyStatus
    if (st === undefined) continue
    const mask = st.bucketsBitmask.startsWith('0x')
      ? Number.parseInt(st.bucketsBitmask, 16)
      : Number.parseInt(st.bucketsBitmask, 10)
    const basePivotBlock = BigInt(st.basePivotBlock)
    if (opts.book !== undefined && opts.generationBlock !== undefined) {
      noteMinterStatus(opts.book, p.id, basePivotBlock, mask, gen, nowMs)
    }
    const id = p.id.toLowerCase()
    const headerTrusted =
      minterHeaderMatchesStatus(opts.headerBook, p.id, basePivotBlock, st.basePivotStateRoot) ||
      (opts.bestVerifiedHead !== undefined &&
        basePivotBlock <= opts.bestVerifiedHead &&
        st.latestBlockHash !== undefined &&
        st.latestBlockHash.length > 0)
    out.push({
      peerId: p.id,
      basePivotBlock,
      bucketsBitmask: mask,
      pexOnly: p.ethySession !== true,
      connected: p.ethySession === true,
      headerVerified: headerTrusted,
      lastServeAtMs: opts.book !== undefined ? minterLastServeAt(opts.book, id) : undefined,
      firstZeroMaskAtMs: opts.book !== undefined ? minterZeroMaskSince(opts.book, id) : undefined,
    })
  }
  return out
}

export type GenerationElectionHandle = {
  generationBlock: bigint
  deadlineMs: number
  backupStaggerApplied?: boolean
  suppressionWasActive?: boolean
}

/** Arm once per macro-generation; keep deadline across telemetry ticks (WP-11b). */
export function ensureGenerationElectionArmed(
  prev: GenerationElectionHandle | undefined,
  next: GenerationElectionHandle | undefined,
): GenerationElectionHandle | undefined {
  if (next === undefined) return prev
  if (prev === undefined || prev.generationBlock !== next.generationBlock) {
    return next
  }
  return {
    ...next,
    deadlineMs: Math.max(prev.deadlineMs, next.deadlineMs),
    backupStaggerApplied: prev.backupStaggerApplied,
    suppressionWasActive: prev.suppressionWasActive,
  }
}

/** When suppression lifts after a blocked lottery window, add backup stagger once. */
export function applyBackupElectionStaggerOnSuppressionLift(opts: {
  handle: GenerationElectionHandle
  nodeId: Uint8Array
  suppressionState: MinterSuppressionState
  nowMs: number
}): GenerationElectionHandle {
  const { handle, suppressionState, nowMs } = opts
  if (suppressionState === 'suppressed') {
    return { ...handle, suppressionWasActive: true }
  }
  if (
    handle.suppressionWasActive === true &&
    nowMs >= handle.deadlineMs &&
    handle.backupStaggerApplied !== true
  ) {
    const stagger = backupElectionStaggerMs(opts.nodeId, handle.generationBlock)
    return {
      ...handle,
      deadlineMs: nowMs + stagger,
      backupStaggerApplied: true,
      suppressionWasActive: false,
    }
  }
  if (suppressionState === 'clear' || suppressionState === 'stalled') {
    return { ...handle, suppressionWasActive: false }
  }
  return handle
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
