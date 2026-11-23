import type { DiscoveryMode, NetworkProfile, WorkerPeerSnapshot } from '@ethereumjs/devp2p'

import type {
  EthyPhase,
  EthySpine,
  MachinePlaneStatus,
  MachineSpineSnapshot,
} from '../spine/types.ts'
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
export type PlaneStatus = MachinePlaneStatus
export type EthyServingState =
  | 'serving'
  | 'partial-minting'
  | 'paused-catching-up'
  | 'paused-stale'
  | 'paused-bal-gap'
  | 'off'

export type PlaneDwell = { status: PlaneStatus; sinceMs: number }

export type MachineState = {
  dwell: Partial<Record<PlaneId, PlaneDwell>>
  discoveryBurstStartedMs?: number
  transitions: string[]
}

export type MachineObservation = {
  nowMs: number
  phase: EthyPhase
  syncTransport: 'unset' | 'snap' | 'ethy'
  syncMode: SyncMode
  shadowRefreshEnabled: boolean
  clDisabled: boolean
  healthyEthPeers: number
  ethySessionPeers: number
  snapDiscoveryHold: boolean
  ethySwarmActive: boolean
  generationAgeBlocks: bigint
  balTailContiguous: boolean
  bucketsMask: number
  shadowMode?: 'idle' | 'ethy-shadow' | 'snap-mint' | 'waiting-election'
  shadowProgressPct?: number
  shadowMintBucket?: number
  electionDeadlineMs?: number
  electionSuppressed: boolean
  hasUsableEthyGNew: boolean
  degradedStall: boolean
  dwell: Partial<Record<PlaneId, PlaneDwell>>
  discoveryBurstStartedMs?: number
}

export type MachinePlan = {
  mode: MachineOperatingMode
  modeReason: string
  planes: Record<PlaneId, PlaneStatus>
  profile: NetworkProfile
  vipTarget: number
  nextEventSummary: string
  servingEthy: EthyServingState
}

export const ETHY_PREWARM_LEAD_MS = 900_000
export const SNAP_PREWARM_LEAD_MS = 180_000
export const DISCOVERY_PREWARM_BURST_MS = 300_000
export const BLOCK_MS = 12_000
export const MIN_PLANE_DWELL_DISCOVERY_MS = 30_000
export const MIN_PLANE_DWELL_SNAP_MS = 60_000
export const MACHINE_TRANSITION_LOG_CAP = 24

const BUDGETS: Record<
  MachineOperatingMode,
  { maxPeers: number; vipTarget: number; minEthy: number; maxInbound: number }
> = {
  'boot-warmup': { maxPeers: 20, vipTarget: 10, minEthy: 4, maxInbound: 4 },
  'cold-snap-sync': { maxPeers: 20, vipTarget: 10, minEthy: 4, maxInbound: 4 },
  'cold-ethy-sync': { maxPeers: 20, vipTarget: 6, minEthy: 4, maxInbound: 4 },
  'bal-catchup': { maxPeers: 8, vipTarget: 4, minEthy: 2, maxInbound: 2 },
  'live-calm': { maxPeers: 6, vipTarget: 3, minEthy: 2, maxInbound: 2 },
  'shadow-ethy-refresh': { maxPeers: 8, vipTarget: 4, minEthy: 4, maxInbound: 2 },
  'prewarm-snap-mint': { maxPeers: 10, vipTarget: 5, minEthy: 2, maxInbound: 4 },
  'shadow-snap-mint': { maxPeers: 10, vipTarget: 5, minEthy: 2, maxInbound: 4 },
  'prewarm-ethy': { maxPeers: 12, vipTarget: 6, minEthy: 2, maxInbound: 4 },
  'degraded-recovery': { maxPeers: 12, vipTarget: 6, minEthy: 2, maxInbound: 4 },
}

function deriveMode(obs: MachineObservation): { mode: MachineOperatingMode; reason: string } {
  if (obs.phase === 'BOOTING' || obs.phase === 'P2P_WARMUP') {
    return { mode: 'boot-warmup', reason: obs.phase }
  }
  if (obs.degradedStall || obs.healthyEthPeers === 0) {
    return {
      mode: 'degraded-recovery',
      reason: obs.degradedStall ? 'BAL catch-up stalled' : 'no healthy eth peers',
    }
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
    if (
      obs.shadowMode === 'waiting-election' &&
      obs.electionDeadlineMs !== undefined &&
      !obs.electionSuppressed &&
      obs.electionDeadlineMs - obs.nowMs <= SNAP_PREWARM_LEAD_MS
    ) {
      return { mode: 'prewarm-snap-mint', reason: 'election snap pre-warm' }
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
  if (obs.bucketsMask === 0) return 'off'
  if (mode === 'bal-catchup' || obs.phase === 'BAL_CATCHUP') return 'paused-catching-up'
  if (!obs.balTailContiguous) return 'paused-bal-gap'
  if (obs.generationAgeBlocks > HARD_PREFER_SNAP_AGE_BLOCKS && obs.shadowMode !== 'snap-mint') {
    return 'paused-stale'
  }
  if (obs.bucketsMask < 0xffff) return 'partial-minting'
  return 'serving'
}

function snapPlaneStatus(mode: MachineOperatingMode, obs: MachineObservation): PlaneStatus {
  if (mode === 'cold-snap-sync' || mode === 'shadow-snap-mint') return 'active'
  if (mode === 'prewarm-snap-mint') return 'prewarming'
  if (mode === 'boot-warmup') return obs.syncMode === 'ethy' ? 'off' : 'prewarming'
  if (
    mode === 'degraded-recovery' &&
    obs.phase === 'SNAP_SYNCING' &&
    obs.syncTransport !== 'ethy'
  ) {
    return 'prewarming'
  }
  return 'off'
}

function discoveryPlane(
  mode: MachineOperatingMode,
  obs: MachineObservation,
  vipTarget: number,
): PlaneStatus {
  if (mode === 'degraded-recovery' || mode === 'boot-warmup') return 'active'
  if (mode === 'prewarm-ethy' || mode === 'prewarm-snap-mint') {
    const burstExpired =
      obs.discoveryBurstStartedMs !== undefined &&
      obs.nowMs - obs.discoveryBurstStartedMs >= DISCOVERY_PREWARM_BURST_MS
    return burstExpired ? 'standby' : 'prewarming'
  }
  if (mode === 'cold-snap-sync' || mode === 'cold-ethy-sync') {
    return obs.snapDiscoveryHold || obs.ethySwarmActive ? 'standby' : 'active'
  }
  if (obs.healthyEthPeers < Math.max(1, vipTarget - 1)) return 'active'
  return mode === 'live-calm' || mode === 'bal-catchup' ? 'off' : 'standby'
}

function withDwell(
  dwell: PlaneDwell | undefined,
  next: PlaneStatus,
  nowMs: number,
  minDwellMs: number,
  bypass: boolean,
): PlaneStatus {
  if (dwell === undefined || dwell.status === next || bypass) return next
  return nowMs - dwell.sinceMs < minDwellMs ? dwell.status : next
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
    const min = Math.ceil(Math.max(0, obs.electionDeadlineMs - obs.nowMs) / 60_000)
    return min > 0 ? `SNAP pre-warm in ${min}m` : 'Waiting election'
  }
  if (mode === 'prewarm-ethy') {
    const softMs = Number(SOFT_REFRESH_AGE_BLOCKS - obs.generationAgeBlocks) * BLOCK_MS
    if (softMs > 0) return `ETHY pre-warm in ${Math.ceil(softMs / 60_000)}m`
  }
  if (obs.shadowMode === 'waiting-election' && obs.electionDeadlineMs !== undefined) {
    const sec = Math.max(0, Math.ceil((obs.electionDeadlineMs - obs.nowMs) / 1000))
    return `Waiting election (${sec}s)`
  }
  const softMs = Number(SOFT_REFRESH_AGE_BLOCKS - obs.generationAgeBlocks) * BLOCK_MS
  if (softMs > 0 && mode === 'live-calm') {
    return `Gen ${obs.generationAgeBlocks}/${SOFT_REFRESH_AGE_BLOCKS} blk · ~${(softMs / 3_600_000).toFixed(1)}h`
  }
  if (ethyServe === 'paused-bal-gap') return 'BAL gap — refresh queued'
  return mode === 'bal-catchup' ? 'Catching up' : 'Live'
}

export function evaluateMachinePlan(obs: MachineObservation): MachinePlan {
  const { mode, reason } = deriveMode(obs)
  const budget = BUDGETS[mode]
  const servingEthy = ethyServing(obs, mode)
  const emergency = mode === 'degraded-recovery'

  const discStatus = withDwell(
    obs.dwell.discovery,
    discoveryPlane(mode, obs, budget.vipTarget),
    obs.nowMs,
    MIN_PLANE_DWELL_DISCOVERY_MS,
    emergency,
  )
  const snapStatus = withDwell(
    obs.dwell.snap,
    snapPlaneStatus(mode, obs),
    obs.nowMs,
    MIN_PLANE_DWELL_SNAP_MS,
    emergency,
  )

  const includeSnap = snapStatus === 'active' || snapStatus === 'prewarming'
  const includeEthy = !(obs.syncMode === 'snap' && obs.bucketsMask === 0)
  const capabilities = ['eth69', 'eth70', 'eth71', 'eth72']
  if (includeEthy) capabilities.push('ethy0')
  if (includeSnap) capabilities.push('snap1')

  const discoveryMode: DiscoveryMode =
    discStatus === 'off' ? 'off' : discStatus === 'standby' ? 'quiet' : 'active'
  const ethyDiscoveryTag = servingEthy === 'serving' || servingEthy === 'partial-minting'

  const ethyStatus: PlaneStatus = !includeEthy
    ? 'off'
    : mode === 'bal-catchup'
      ? 'standby'
      : mode === 'prewarm-ethy'
        ? 'prewarming'
        : mode === 'cold-ethy-sync' || mode === 'shadow-ethy-refresh' || servingEthy === 'serving'
          ? 'active'
          : 'standby'

  const clStatus: PlaneStatus =
    obs.clDisabled || obs.phase === 'BOOTING'
      ? 'off'
      : mode === 'live-calm' || mode === 'boot-warmup'
        ? 'active'
        : 'standby'

  return {
    mode,
    modeReason: reason,
    vipTarget: budget.vipTarget,
    nextEventSummary: scheduleSummary(mode, obs, servingEthy),
    servingEthy,
    planes: {
      eth: 'active',
      ethy: ethyStatus,
      snap: snapStatus,
      discovery: discStatus,
      cl: clStatus,
    },
    profile: {
      capabilities,
      maxPeers: budget.maxPeers,
      maxInboundPeers: budget.maxInbound,
      discoveryLowWaterMark: Math.max(1, budget.maxPeers - 4),
      minEthyPeers: includeEthy ? budget.minEthy : 0,
      discoveryMode,
      ethyDiscoveryTag,
      preferEthyDiscovery: mode === 'prewarm-ethy',
    },
  }
}

export function createMachineState(): MachineState {
  return { dwell: {}, transitions: [] }
}

/** Pure stateful step: evaluates plan, updates dwell/burst timers, and returns spine snapshot. */
export function stepMachineOrchestrator(
  prev: MachineState,
  obs: Omit<MachineObservation, 'dwell' | 'discoveryBurstStartedMs'>,
): { plan: MachinePlan; nextState: MachineState; snapshot: MachineSpineSnapshot } {
  const plan = evaluateMachinePlan({
    ...obs,
    dwell: prev.dwell,
    discoveryBurstStartedMs: prev.discoveryBurstStartedMs,
  })
  const dwell: Partial<Record<PlaneId, PlaneDwell>> = { ...prev.dwell }
  const transitions = [...prev.transitions]
  for (const id of ['eth', 'ethy', 'snap', 'discovery', 'cl'] as const) {
    const next = plan.planes[id]
    const prior = prev.dwell[id]
    if (prior?.status !== next) {
      if (prior !== undefined) {
        transitions.push(
          `${new Date(obs.nowMs).toISOString().slice(11, 19)} ${id} ${prior.status}→${next}`,
        )
        if (transitions.length > MACHINE_TRANSITION_LOG_CAP) transitions.shift()
      }
      dwell[id] = { status: next, sinceMs: obs.nowMs }
    }
  }
  const inPrewarm = plan.mode === 'prewarm-ethy' || plan.mode === 'prewarm-snap-mint'
  const discoveryBurstStartedMs =
    plan.planes.discovery === 'prewarming' && prev.dwell.discovery?.status !== 'prewarming'
      ? obs.nowMs
      : inPrewarm
        ? prev.discoveryBurstStartedMs
        : undefined

  return {
    plan,
    nextState: { dwell, discoveryBurstStartedMs, transitions },
    snapshot: {
      mode: plan.mode,
      modeReason: plan.modeReason,
      nextEventSummary: plan.nextEventSummary,
      planes: plan.planes,
      servingEthy: plan.servingEthy,
      ethyDiscoveryTag: plan.profile.ethyDiscoveryTag,
      transitions,
      vipTarget: plan.vipTarget,
      discoveryMode: plan.profile.discoveryMode,
    },
  }
}

export function bootNetworkProfile(syncMode: SyncMode = 'auto'): NetworkProfile {
  const capabilities = ['eth69', 'eth70', 'eth71', 'eth72']
  if (syncMode !== 'snap') capabilities.push('ethy0')
  if (syncMode !== 'ethy') capabilities.push('snap1')
  const budget = BUDGETS['boot-warmup']
  return {
    capabilities,
    maxPeers: budget.maxPeers,
    maxInboundPeers: budget.maxInbound,
    discoveryLowWaterMark: Math.max(1, budget.maxPeers - 4),
    minEthyPeers: syncMode === 'snap' ? 0 : budget.minEthy,
    discoveryMode: 'active',
    ethyDiscoveryTag: false,
    preferEthyDiscovery: false,
  }
}

export function buildMachineObservation(opts: {
  spine: EthySpine
  peerSnapshots: WorkerPeerSnapshot[]
  syncMode: SyncMode
  shadowRefreshEnabled: boolean
  clDisabled?: boolean
  nowMs: number
  snapDiscoveryHold: boolean
  ethySwarmActive: boolean
  degradedStall: boolean
  hasUsableEthyGNew: boolean
  dwell?: Partial<Record<PlaneId, PlaneDwell>>
  discoveryBurstStartedMs?: number
}): MachineObservation {
  const shadow = opts.spine.swarm?.shadowRefresh
  return {
    nowMs: opts.nowMs,
    phase: opts.spine.phase,
    syncTransport: opts.spine.syncTransport ?? 'unset',
    syncMode: opts.syncMode,
    shadowRefreshEnabled: opts.shadowRefreshEnabled,
    clDisabled: opts.clDisabled ?? false,
    healthyEthPeers: opts.peerSnapshots.filter((p) => p.bestHash !== undefined).length,
    ethySessionPeers: opts.peerSnapshots.filter((p) => p.ethySession === true).length,
    snapDiscoveryHold: opts.snapDiscoveryHold,
    ethySwarmActive: opts.ethySwarmActive,
    generationAgeBlocks: opts.spine.swarm?.generationAgeBlocks ?? 0n,
    balTailContiguous: opts.spine.swarm?.balTailContiguous !== false,
    bucketsMask: opts.spine.ethyBucketsBitmask ?? 0,
    shadowMode: shadow?.mode,
    shadowProgressPct: shadow?.progressPct,
    shadowMintBucket: shadow?.mintBucket,
    electionDeadlineMs: shadow?.electionDeadlineMs,
    electionSuppressed:
      shadow?.suppressionState !== 'clear' && shadow?.suppressionState !== undefined,
    hasUsableEthyGNew: opts.hasUsableEthyGNew,
    degradedStall: opts.degradedStall,
    dwell: opts.dwell ?? {},
    discoveryBurstStartedMs: opts.discoveryBurstStartedMs,
  }
}

export function machinePlanesOff(plan: MachinePlan): { snapOff: boolean; discoveryOff: boolean } {
  return {
    snapOff: plan.planes.snap === 'off',
    discoveryOff: plan.planes.discovery === 'off' || plan.profile.discoveryMode === 'off',
  }
}
