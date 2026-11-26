import type { DiscoveryMode, NetworkProfile, WorkerPeerSnapshot } from '@ethereumjs/devp2p'

import {
  assignedBucketsClosed,
  custodyBitmask,
  custodyPeersFromSpine,
  evaluateCustodyCoverage,
} from '../custody/custodyCoverage.ts'
import type {
  EthyPhase,
  EthySpine,
  MachinePlaneStatus,
  MachineSpineSnapshot,
  SnapDormancyReason,
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
  | 'custody-bal-warmup'
  | 'custody-sync'
  | 'custody-live-calm'
  | 'full-backfill'

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
  /** Mount dial `snap/1` when the reconciler would prewarm snap (WP-16d). */
  snapBootstrap: boolean
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
  shadowBlockedReason?: 'low-disk'
  shadowFreeBytes?: bigint
  shadowRequiredFreeBytes?: bigint
  electionDeadlineMs?: number
  electionSuppressed: boolean
  hasUsableEthyGNew: boolean
  degradedStall: boolean
  dwell: Partial<Record<PlaneId, PlaneDwell>>
  discoveryBurstStartedMs?: number
  custodyActive?: boolean
  custodyCount?: number
  assignedBucketsMask?: number
  closedBucketsMask?: number
  connectedSwarmBucketsMask?: number
  desiredEthyBucketsMask?: number
  uncoveredBucketsMask?: number
  hopBuckets?: number
  minRedundancy?: number
  custodyBalOnboarding?: boolean
  subtreeApplyMs?: number
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
  'custody-bal-warmup': { maxPeers: 20, vipTarget: 8, minEthy: 6, maxInbound: 4 },
  'custody-sync': { maxPeers: 20, vipTarget: 8, minEthy: 6, maxInbound: 4 },
  'custody-live-calm': { maxPeers: 20, vipTarget: 6, minEthy: 6, maxInbound: 4 },
  'full-backfill': { maxPeers: 20, vipTarget: 10, minEthy: 6, maxInbound: 4 },
}

const CUSTODY_MODES = new Set<MachineOperatingMode>([
  'custody-bal-warmup',
  'custody-sync',
  'custody-live-calm',
  'full-backfill',
])

function isCustodyMode(mode: MachineOperatingMode): boolean {
  return CUSTODY_MODES.has(mode)
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
  if (obs.custodyActive === true) {
    if (obs.phase === 'BAL_CATCHUP' || obs.custodyBalOnboarding === true) {
      return { mode: 'custody-bal-warmup', reason: 'custody BAL window' }
    }
    if (obs.phase === 'HEAD_FOLLOWING') {
      const closed = obs.closedBucketsMask ?? 0
      const assigned = obs.assignedBucketsMask ?? 0
      if (obs.custodyCount === 16 && closed !== 0xffff) {
        return { mode: 'full-backfill', reason: 'full custody backfill' }
      }
      if (!assignedBucketsClosed(assigned, closed)) {
        return { mode: 'custody-sync', reason: 'background custody sync' }
      }
      return { mode: 'custody-live-calm', reason: 'custody live steady' }
    }
  }
  if (obs.phase === 'BAL_CATCHUP') {
    return { mode: 'bal-catchup', reason: 'historical BAL catch-up' }
  }
  const allowSnapShadow =
    obs.shadowRefreshEnabled && (obs.custodyActive !== true || obs.snapBootstrap === true)
  if (obs.phase === 'HEAD_FOLLOWING' && allowSnapShadow) {
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
  if (mode === 'full-backfill' && (obs.snapBootstrap || obs.syncMode === 'snap')) return 'active'
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
  if (isCustodyMode(mode)) {
    const hop = obs.hopBuckets ?? 0
    const minRed = obs.minRedundancy ?? 0
    if (hop < 16 || minRed < 2) return 'active'
    return 'standby'
  }
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

function formatGibInt(bytes: bigint): string {
  const gib = Number(bytes) / (1024 * 1024 * 1024)
  return gib >= 10 ? String(Math.round(gib)) : gib.toFixed(1)
}

function scheduleSummary(
  mode: MachineOperatingMode,
  obs: MachineObservation,
  ethyServe: EthyServingState,
): string {
  if (!obs.shadowRefreshEnabled && mode === 'live-calm') return 'Off (--no-shadow-refresh)'
  if (mode === 'shadow-ethy-refresh') {
    return obs.shadowProgressPct !== undefined
      ? `Shadow ETHY ${Math.round(obs.shadowProgressPct)}%`
      : 'Shadow ETHY (starting)'
  }
  if (mode === 'shadow-snap-mint') {
    return obs.shadowMintBucket !== undefined
      ? `SNAP Mint ${obs.shadowMintBucket}/16`
      : 'SNAP Mint (starting)'
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
  if (obs.shadowBlockedReason === 'low-disk') {
    const detail =
      obs.shadowFreeBytes !== undefined && obs.shadowRequiredFreeBytes !== undefined
        ? ` (${formatGibInt(obs.shadowFreeBytes)}/${formatGibInt(obs.shadowRequiredFreeBytes)} GB)`
        : ''
    return ethyServe === 'paused-bal-gap'
      ? `BAL gap — low disk${detail}`
      : `Refresh paused — low disk${detail}`
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

  const snapWanted = snapStatus === 'active' || snapStatus === 'prewarming'
  let includeSnap = snapWanted && (obs.snapBootstrap || obs.syncMode === 'snap')
  if (mode === 'custody-live-calm' || mode === 'custody-sync' || mode === 'custody-bal-warmup') {
    includeSnap = false
  }
  if (mode === 'full-backfill' && (obs.closedBucketsMask ?? 0) === 0xffff) {
    includeSnap = false
  }
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
      : mode === 'live-calm' ||
          mode === 'custody-live-calm' ||
          mode === 'custody-sync' ||
          mode === 'boot-warmup'
        ? 'active'
        : 'standby'

  const resolvedSnap: PlaneStatus = includeSnap ? snapStatus : 'off'
  const desiredMask =
    obs.custodyActive === true && includeEthy ? (obs.desiredEthyBucketsMask ?? 0) : undefined

  return {
    mode,
    modeReason: reason,
    vipTarget: budget.vipTarget,
    nextEventSummary: scheduleSummary(mode, obs, servingEthy),
    servingEthy,
    planes: {
      eth: 'active',
      ethy: ethyStatus,
      snap: resolvedSnap,
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
      preferEthyDiscovery: mode === 'prewarm-ethy' || isCustodyMode(mode),
      desiredEthyBucketsMask: desiredMask,
    },
  }
}

export function snapDormancyReason(
  plan: MachinePlan,
  obs: Pick<MachineObservation, 'snapBootstrap' | 'closedBucketsMask' | 'custodyCount'>,
): SnapDormancyReason {
  if (plan.profile.capabilities.includes('snap1')) return 'bootstrap-active'
  if (obs.custodyCount === 16 && (obs.closedBucketsMask ?? 0) === 0xffff) {
    return 'dropped-after-close'
  }
  return 'default-off'
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

  const dormancy = snapDormancyReason(plan, {
    snapBootstrap: obs.snapBootstrap,
    closedBucketsMask: obs.closedBucketsMask,
    custodyCount: obs.custodyCount,
  })

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
      desiredEthyBucketsMask: plan.profile.desiredEthyBucketsMask,
      uncoveredBucketsMask: obs.uncoveredBucketsMask,
      hopBuckets: obs.hopBuckets,
      snapDormancyReason: dormancy,
      subtreeApplyMs: obs.subtreeApplyMs,
    },
  }
}

export function bootNetworkProfile(
  syncMode: SyncMode = 'auto',
  snapBootstrap = false,
): NetworkProfile {
  const capabilities = ['eth69', 'eth70', 'eth71', 'eth72']
  if (syncMode !== 'snap') capabilities.push('ethy0')
  if (syncMode !== 'ethy' && snapBootstrap) capabilities.push('snap1')
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
  snapBootstrap?: boolean
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
  const buckets = opts.spine.custodyBuckets
  const custodyActive = buckets !== undefined && buckets.length > 0 && opts.syncMode !== 'snap'
  const closedBucketsMask = opts.spine.closedBucketsMask ?? 0
  const assignedBucketsMask = buckets !== undefined ? custodyBitmask(buckets) : 0
  const coverage =
    custodyActive === true
      ? evaluateCustodyCoverage({
          closedBucketsMask,
          peers: custodyPeersFromSpine(opts.spine.peers.values()),
        })
      : undefined
  return {
    nowMs: opts.nowMs,
    phase: opts.spine.phase,
    syncTransport: opts.spine.syncTransport ?? 'unset',
    syncMode: opts.syncMode,
    snapBootstrap: opts.snapBootstrap === true,
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
    shadowBlockedReason: shadow?.blockedReason,
    shadowFreeBytes: shadow?.freeBytes,
    shadowRequiredFreeBytes: shadow?.requiredFreeBytes,
    electionDeadlineMs: shadow?.electionDeadlineMs,
    electionSuppressed:
      shadow?.suppressionState !== 'clear' && shadow?.suppressionState !== undefined,
    hasUsableEthyGNew: opts.hasUsableEthyGNew,
    degradedStall: opts.degradedStall,
    dwell: opts.dwell ?? {},
    discoveryBurstStartedMs: opts.discoveryBurstStartedMs,
    custodyActive,
    custodyCount: buckets?.length ?? opts.spine.custodyBuckets?.length,
    assignedBucketsMask,
    closedBucketsMask,
    connectedSwarmBucketsMask: coverage?.connectedSwarmBucketsMask,
    desiredEthyBucketsMask: coverage?.desiredEthyBucketsMask,
    uncoveredBucketsMask: coverage?.uncoveredBucketsMask,
    hopBuckets: coverage?.hopBuckets,
    minRedundancy: coverage?.minRedundancy,
    custodyBalOnboarding: opts.spine.custodyBalOnboarding,
    subtreeApplyMs: opts.spine.subtreeApplyMs,
  }
}

export function machinePlanesOff(plan: MachinePlan): { snapOff: boolean; discoveryOff: boolean } {
  return {
    snapOff: plan.planes.snap === 'off',
    discoveryOff: plan.planes.discovery === 'off' || plan.profile.discoveryMode === 'off',
  }
}
