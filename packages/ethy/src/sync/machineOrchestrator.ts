import type { DiscoveryMode, NetworkProfile, WorkerPeerSnapshot } from '@ethereumjs/devp2p'

import type { EthyPhase, EthySpine } from '../spine/types.ts'
import { HARD_PREFER_SNAP_AGE_BLOCKS, SOFT_REFRESH_AGE_BLOCKS } from './swarmGenerationPolicy.ts'
import type { SyncMode } from './syncSourceSelector.ts'

export type MachineOperatingMode =
  | 'boot-warmup'
  | 'cold-ethy-sync'
  | 'cold-snap-sync'
  | 'bal-catchup'
  | 'live-calm'
  | 'prewarm-ethy'
  | 'shadow-ethy-refresh'
  | 'prewarm-snap-mint'
  | 'shadow-snap-mint'
  | 'degraded-recovery'

export type PlaneId = 'eth' | 'ethy' | 'snap' | 'discovery' | 'cl'
export type PlaneStatus = 'active' | 'prewarming' | 'standby' | 'off'

export type EthyServingState =
  | 'serving'
  | 'partial-minting'
  | 'paused-catching-up'
  | 'paused-stale'
  | 'paused-bal-gap'
  | 'off'

export type EthServingState = 'serving' | 'warming' | 'paused'

export type PlaneDwell = { status: PlaneStatus; sinceMs: number }

export type MachineObservation = {
  nowMs: number
  phase: EthyPhase
  syncTransport: 'unset' | 'snap' | 'ethy'
  syncMode: 'auto' | 'snap' | 'ethy'
  shadowRefreshEnabled: boolean
  clDisabled: boolean
  uptimeMs: number
  healthyEthPeers: number
  ethySessionPeers: number
  snapSessionPeers: number
  provenSnapPeers: number
  snapDiscoveryHold: boolean
  ethySwarmActive: boolean
  generationAgeBlocks: bigint
  balTailContiguous: boolean
  balTailEarliest?: bigint
  bucketsMask: number
  shadowMode?: 'idle' | 'ethy-shadow' | 'snap-mint' | 'waiting-election'
  shadowProgressPct?: number
  shadowMintBucket?: number
  electionDeadlineMs?: number
  electionSuppressed: boolean
  hasUsableEthyGNew: boolean
  ethyPeerTarget: number
  degradedStall: boolean
  dwell: Partial<Record<PlaneId, PlaneDwell>>
  discoveryBurstStartedMs?: number
  ethBlocksStored: number
  headLagBlocks: bigint
}

export type PlaneRecord = {
  status: PlaneStatus
  targetPeers: number
  activePeers: number
  reason: string
  nextChangeMs?: number
  nextChangeLabel?: string
}

export type MachineSchedule = {
  generationAgeBlocks: bigint
  softRefreshAtBlocks: bigint
  estimatedTimeToSoftRefreshMs?: number
  ethyPrewarmAtMs?: number
  snapPrewarmAtMs?: number
  nextEventSummary: string
}

export type MachinePlan = {
  mode: MachineOperatingMode
  modeReason: string
  planes: Record<PlaneId, PlaneRecord>
  profile: NetworkProfile
  vipTarget: number
  schedule: MachineSchedule
  serving: {
    eth: EthServingState
    ethy: EthyServingState
    snap: 'client-only'
  }
  ethyDiscoveryHonest: boolean
}

export const ETHY_PREWARM_LEAD_MS = 900_000
export const SNAP_PREWARM_LEAD_MS = 180_000
export const DISCOVERY_PREWARM_BURST_MS = 300_000
export const BLOCK_MS = 12_000
export const MIN_PLANE_DWELL_DISCOVERY_MS = 30_000
export const MIN_PLANE_DWELL_SNAP_MS = 60_000

const BASE_CAPS = ['eth69', 'eth70', 'eth71', 'eth72', 'ethy0'] as const

function capsForPhase(includeSnap: boolean, includeEthy: boolean): string[] {
  const caps: string[] = [...BASE_CAPS]
  if (includeEthy) {
    /* ethy0 already in base */
  } else {
    const idx = caps.indexOf('ethy0')
    if (idx >= 0) caps.splice(idx, 1)
  }
  if (includeSnap) caps.push('snap1')
  return caps
}

function peerBudget(mode: MachineOperatingMode): {
  maxPeers: number
  vipTarget: number
  minEthy: number
  maxInbound: number
} {
  switch (mode) {
    case 'boot-warmup':
    case 'cold-snap-sync':
      return { maxPeers: 20, vipTarget: 10, minEthy: 4, maxInbound: 4 }
    case 'cold-ethy-sync':
      return { maxPeers: 20, vipTarget: 6, minEthy: 4, maxInbound: 4 }
    case 'bal-catchup':
      return { maxPeers: 8, vipTarget: 4, minEthy: 2, maxInbound: 2 }
    case 'live-calm':
      return { maxPeers: 6, vipTarget: 3, minEthy: 2, maxInbound: 2 }
    case 'shadow-ethy-refresh':
      return { maxPeers: 8, vipTarget: 4, minEthy: 4, maxInbound: 2 }
    case 'prewarm-snap-mint':
    case 'shadow-snap-mint':
      return { maxPeers: 10, vipTarget: 5, minEthy: 2, maxInbound: 4 }
    case 'prewarm-ethy':
    case 'degraded-recovery':
      return { maxPeers: 12, vipTarget: 6, minEthy: 2, maxInbound: 4 }
    default:
      return { maxPeers: 8, vipTarget: 4, minEthy: 2, maxInbound: 2 }
  }
}

function deriveMode(obs: MachineObservation): { mode: MachineOperatingMode; reason: string } {
  if (obs.degradedStall || obs.healthyEthPeers === 0) {
    return { mode: 'degraded-recovery', reason: 'no healthy eth peers' }
  }
  if (obs.phase === 'BOOTING' || obs.phase === 'P2P_WARMUP') {
    return { mode: 'boot-warmup', reason: obs.phase }
  }
  if (obs.phase === 'SNAP_SYNCING') {
    return obs.syncTransport === 'ethy'
      ? { mode: 'cold-ethy-sync', reason: 'ETHY/0 base sync' }
      : { mode: 'cold-snap-sync', reason: 'SNAP/1 base sync' }
  }
  if (obs.phase === 'BAL_CATCHUP') {
    return { mode: 'bal-catchup', reason: 'historical BAL catch-up' }
  }
  if (obs.phase === 'HEAD_FOLLOWING' && obs.shadowRefreshEnabled) {
    if (obs.shadowMode === 'ethy-shadow') {
      return { mode: 'shadow-ethy-refresh', reason: 'background ETHY shadow refresh' }
    }
    if (obs.shadowMode === 'snap-mint') {
      return { mode: 'shadow-snap-mint', reason: 'background SNAP shadow mint' }
    }
    if (obs.shadowMode === 'waiting-election') {
      const until = obs.electionDeadlineMs
      if (
        until !== undefined &&
        !obs.electionSuppressed &&
        until - obs.nowMs <= SNAP_PREWARM_LEAD_MS
      ) {
        return { mode: 'prewarm-snap-mint', reason: 'election snap pre-warm' }
      }
    }
    const softMs = Number(SOFT_REFRESH_AGE_BLOCKS - obs.generationAgeBlocks) * BLOCK_MS
    if (
      softMs > 0 &&
      softMs <= ETHY_PREWARM_LEAD_MS &&
      obs.ethySessionPeers < 2 &&
      !obs.hasUsableEthyGNew
    ) {
      return { mode: 'prewarm-ethy', reason: 'ETHY pre-warm before soft refresh' }
    }
  }
  return { mode: 'live-calm', reason: 'steady head following' }
}

function ethyServing(obs: MachineObservation, mode: MachineOperatingMode): EthyServingState {
  if (obs.syncMode === 'snap' && obs.bucketsMask === 0) return 'off'
  if (mode === 'bal-catchup' || obs.phase === 'BAL_CATCHUP') return 'paused-catching-up'
  if (!obs.balTailContiguous && obs.bucketsMask > 0) return 'paused-bal-gap'
  if (obs.generationAgeBlocks > HARD_PREFER_SNAP_AGE_BLOCKS && obs.shadowMode !== 'snap-mint') {
    return 'paused-stale'
  }
  if (obs.shadowMode === 'snap-mint' || (obs.bucketsMask > 0 && obs.bucketsMask < 0xffff)) {
    if (obs.bucketsMask > 0 && obs.bucketsMask < 0xffff) return 'partial-minting'
  }
  if (obs.bucketsMask > 0 && obs.balTailContiguous) return 'serving'
  return 'paused-catching-up'
}

function snapPlaneStatus(mode: MachineOperatingMode): PlaneStatus {
  if (mode === 'cold-snap-sync' || mode === 'shadow-snap-mint') return 'active'
  if (mode === 'prewarm-snap-mint' || mode === 'boot-warmup') return 'prewarming'
  return 'off'
}

function discoveryPlane(
  mode: MachineOperatingMode,
  obs: MachineObservation,
): { status: PlaneStatus; mode: DiscoveryMode; reason: string } {
  const burstAge =
    obs.discoveryBurstStartedMs !== undefined
      ? obs.nowMs - obs.discoveryBurstStartedMs
      : DISCOVERY_PREWARM_BURST_MS + 1
  const burstOpen =
    burstAge < DISCOVERY_PREWARM_BURST_MS &&
    (mode === 'prewarm-ethy' || mode === 'prewarm-snap-mint' || mode === 'degraded-recovery')

  if (burstOpen) {
    return { status: 'prewarming', mode: 'active', reason: 'pre-warm burst' }
  }
  if (mode === 'prewarm-ethy' || mode === 'prewarm-snap-mint') {
    return { status: 'prewarming', mode: 'active', reason: `${mode} lead window` }
  }
  if (mode === 'live-calm' || mode === 'bal-catchup') {
    if (obs.healthyEthPeers >= obs.ethyPeerTarget) {
      return { status: 'off', mode: 'off', reason: 'calm steady peers' }
    }
  }
  if (mode === 'cold-snap-sync' || mode === 'cold-ethy-sync') {
    if (obs.snapDiscoveryHold || obs.ethySwarmActive) {
      return { status: 'standby', mode: 'quiet', reason: 'bulk sync hold' }
    }
  }
  if (obs.healthyEthPeers < Math.max(1, peerBudget(mode).vipTarget - 1)) {
    return { status: 'active', mode: 'active', reason: 'below peer target' }
  }
  if (mode === 'live-calm' || mode === 'bal-catchup') {
    return { status: 'off', mode: 'off', reason: 'targets met' }
  }
  return { status: 'standby', mode: 'quiet', reason: 'sync quiet' }
}

function withDwell(
  prev: PlaneStatus | undefined,
  prevSince: number | undefined,
  next: PlaneStatus,
  nowMs: number,
  minDwellMs: number,
  emergency: boolean,
): PlaneStatus {
  if (prev === undefined || prev === next) return next
  if (emergency) return next
  const since = prevSince ?? 0
  if (nowMs - since < minDwellMs) return prev
  return next
}

function scheduleSummary(
  mode: MachineOperatingMode,
  obs: MachineObservation,
  ethyServe: EthyServingState,
): string {
  if (!obs.shadowRefreshEnabled && mode === 'live-calm') return 'Off (--no-shadow-refresh)'
  if (mode === 'shadow-ethy-refresh' && obs.shadowProgressPct !== undefined) {
    return `Shadow ETHY ${Math.round(obs.shadowProgressPct)}%`
  }
  if (mode === 'shadow-snap-mint' && obs.shadowMintBucket !== undefined) {
    return `SNAP Mint ${obs.shadowMintBucket}/16`
  }
  if (mode === 'prewarm-snap-mint' && obs.electionDeadlineMs !== undefined) {
    const sec = Math.max(0, Math.ceil((obs.electionDeadlineMs - obs.nowMs) / 1000))
    return sec > 0 ? `SNAP pre-warm in ${Math.ceil(sec / 60)}m` : 'Waiting election'
  }
  if (mode === 'prewarm-ethy') {
    const softMs = Number(SOFT_REFRESH_AGE_BLOCKS - obs.generationAgeBlocks) * BLOCK_MS
    if (softMs > 0) return `ETHY pre-warm in ${Math.ceil(softMs / 60_000)}m`
  }
  if (obs.shadowMode === 'waiting-election' && obs.electionDeadlineMs !== undefined) {
    const sec = Math.max(0, Math.ceil((obs.electionDeadlineMs - obs.nowMs) / 1000))
    return `Waiting election (${sec}s)`
  }
  const softRemaining = Number(SOFT_REFRESH_AGE_BLOCKS - obs.generationAgeBlocks) * BLOCK_MS
  if (softRemaining > 0 && mode === 'live-calm') {
    return `Gen ${obs.generationAgeBlocks}/${SOFT_REFRESH_AGE_BLOCKS} blk · ~${(softRemaining / 3_600_000).toFixed(1)}h`
  }
  if (ethyServe === 'paused-bal-gap') return 'BAL gap — refresh queued'
  if (mode === 'bal-catchup') return 'Catching up'
  return 'Live'
}

export function evaluateMachinePlan(obs: MachineObservation): MachinePlan {
  const { mode, reason } = deriveMode(obs)
  const budget = peerBudget(mode)
  const ethyServe = ethyServing(obs, mode)
  const snapStatus = snapPlaneStatus(mode)
  const disc = discoveryPlane(mode, obs)

  const emergency = mode === 'degraded-recovery'
  const prevDisc = obs.dwell.discovery?.status
  const discStatus = withDwell(
    prevDisc,
    obs.dwell.discovery?.sinceMs,
    disc.status,
    obs.nowMs,
    MIN_PLANE_DWELL_DISCOVERY_MS,
    emergency,
  )
  const prevSnap = obs.dwell.snap?.status
  const snapStatusDwelled = withDwell(
    prevSnap,
    obs.dwell.snap?.sinceMs,
    snapStatus,
    obs.nowMs,
    MIN_PLANE_DWELL_SNAP_MS,
    emergency,
  )

  const includeSnap = snapStatusDwelled === 'active' || snapStatusDwelled === 'prewarming'
  const ethyOff = ethyServe === 'off'
  const capabilities = capsForPhase(includeSnap, !ethyOff)

  const ethyTag = ethyServe === 'serving' || ethyServe === 'partial-minting'
  const discoveryMode: DiscoveryMode =
    discStatus === 'off' ? 'off' : discStatus === 'standby' ? 'quiet' : disc.mode

  const profile: NetworkProfile = {
    capabilities,
    maxPeers: budget.maxPeers,
    maxInboundPeers: budget.maxInbound,
    discoveryLowWaterMark: Math.max(1, budget.maxPeers - 4),
    minEthyPeers: budget.minEthy,
    discoveryMode,
    ethyDiscoveryTag: ethyTag,
    preferEthyDiscovery: mode === 'prewarm-ethy',
  }

  const schedule: MachineSchedule = {
    generationAgeBlocks: obs.generationAgeBlocks,
    softRefreshAtBlocks: SOFT_REFRESH_AGE_BLOCKS,
    estimatedTimeToSoftRefreshMs:
      obs.generationAgeBlocks < SOFT_REFRESH_AGE_BLOCKS
        ? Number(SOFT_REFRESH_AGE_BLOCKS - obs.generationAgeBlocks) * BLOCK_MS
        : undefined,
    nextEventSummary: scheduleSummary(mode, obs, ethyServe),
  }

  const ethServe: EthServingState =
    obs.ethBlocksStored > 0 && obs.phase === 'HEAD_FOLLOWING' ? 'serving' : 'warming'

  return {
    mode,
    modeReason: reason,
    vipTarget: budget.vipTarget,
    schedule,
    serving: {
      eth: ethServe,
      ethy: ethyServe,
      snap: 'client-only',
    },
    ethyDiscoveryHonest: ethyTag,
    profile,
    planes: {
      eth: {
        status: 'active',
        targetPeers: budget.vipTarget,
        activePeers: obs.healthyEthPeers,
        reason: 'eth/69–72 head & BAL',
      },
      ethy: {
        status:
          mode === 'bal-catchup'
            ? 'standby'
            : ethyOff
              ? 'off'
              : mode === 'prewarm-ethy' || mode === 'shadow-ethy-refresh'
                ? 'active'
                : ethyServe === 'serving'
                  ? 'active'
                  : 'standby',
        targetPeers: budget.minEthy,
        activePeers: obs.ethySessionPeers,
        reason: ethyServe,
      },
      snap: {
        status: snapStatusDwelled,
        targetPeers: includeSnap ? 4 : 0,
        activePeers: obs.snapSessionPeers,
        reason: snapStatusDwelled === 'off' ? 'snap1 not advertised' : 'snap/1 client',
      },
      discovery: {
        status: discStatus,
        targetPeers: budget.vipTarget,
        activePeers: obs.healthyEthPeers,
        reason: disc.reason,
      },
      cl: {
        status:
          obs.clDisabled || obs.phase === 'BOOTING'
            ? 'off'
            : mode === 'live-calm' || mode === 'boot-warmup'
              ? 'active'
              : 'standby',
        targetPeers: 0,
        activePeers: 0,
        reason: obs.clDisabled ? '--no-cl' : mode === 'live-calm' ? '12s slot' : '60s standby',
      },
    },
  }
}

export function bootNetworkProfile(): NetworkProfile {
  return {
    capabilities: ['eth69', 'eth70', 'eth71', 'eth72', 'snap1', 'ethy0'],
    maxPeers: 20,
    maxInboundPeers: 4,
    discoveryLowWaterMark: 4,
    minEthyPeers: 4,
    discoveryMode: 'active',
    ethyDiscoveryTag: false,
    preferEthyDiscovery: false,
  }
}

export const MACHINE_TRANSITION_LOG_CAP = 24

export function buildMachineObservation(opts: {
  spine: EthySpine
  peerSnapshots: WorkerPeerSnapshot[]
  syncMode: SyncMode
  shadowRefreshEnabled: boolean
  nowMs: number
  snapDiscoveryHold: boolean
  ethySwarmActive: boolean
  degradedStall: boolean
  dwell: Partial<Record<PlaneId, PlaneDwell>>
  discoveryBurstStartedMs?: number
  vipTarget: number
  hasUsableEthyGNew: boolean
  uptimeMs: number
}): MachineObservation {
  const healthyEth = opts.peerSnapshots.filter((p) => p.bestHash !== undefined).length
  const ethySessions = opts.peerSnapshots.filter((p) => p.ethySession === true).length
  const snapSessions = opts.peerSnapshots.filter((p) => p.snapSession === true).length
  const provenSnap = opts.peerSnapshots.filter(
    (p) => p.snapSession === true && (opts.spine.peers.get(p.id)?.snapResponsesOk ?? 0) > 0,
  ).length
  const shadow = opts.spine.swarm?.shadowRefresh
  const head = opts.spine.lastVerifiedBlockNumber ?? opts.spine.headBlockNumber ?? 0n
  const chainHead = opts.spine.bestPeerHead ?? head
  const headLag = chainHead > head ? chainHead - head : 0n
  return {
    nowMs: opts.nowMs,
    phase: opts.spine.phase,
    syncTransport: opts.spine.syncTransport ?? 'unset',
    syncMode: opts.syncMode,
    shadowRefreshEnabled: opts.shadowRefreshEnabled,
    clDisabled: opts.spine.clStatus === 'p2p_only',
    uptimeMs: opts.uptimeMs,
    healthyEthPeers: healthyEth,
    ethySessionPeers: ethySessions,
    snapSessionPeers: snapSessions,
    provenSnapPeers: provenSnap,
    snapDiscoveryHold: opts.snapDiscoveryHold,
    ethySwarmActive: opts.ethySwarmActive,
    generationAgeBlocks: opts.spine.swarm?.generationAgeBlocks ?? 0n,
    balTailContiguous: opts.spine.swarm?.balTailContiguous !== false,
    balTailEarliest: opts.spine.swarm?.balTailEarliest,
    bucketsMask: opts.spine.ethyBucketsBitmask ?? 0,
    shadowMode: shadow?.mode,
    shadowProgressPct: shadow?.progressPct,
    shadowMintBucket: shadow?.mintBucket,
    electionDeadlineMs: shadow?.electionDeadlineMs,
    electionSuppressed:
      shadow?.suppressionState !== 'clear' && shadow?.suppressionState !== undefined,
    hasUsableEthyGNew: opts.hasUsableEthyGNew,
    ethyPeerTarget: opts.vipTarget,
    degradedStall: opts.degradedStall,
    dwell: opts.dwell,
    discoveryBurstStartedMs: opts.discoveryBurstStartedMs,
    ethBlocksStored: opts.spine.serving?.blocksStored ?? 0,
    headLagBlocks: headLag,
  }
}

export function machinePlanesOff(plan: MachinePlan): { snapOff: boolean; discoveryOff: boolean } {
  return {
    snapOff: plan.planes.snap.status === 'off',
    discoveryOff: plan.planes.discovery.status === 'off' || plan.profile.discoveryMode === 'off',
  }
}
