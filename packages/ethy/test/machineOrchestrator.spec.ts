import { assert, describe, it } from 'vitest'

import { createSpine, setPhase } from '../src/spine/createSpine.ts'
import {
  DISCOVERY_PREWARM_BURST_MS,
  ETHY_PREWARM_LEAD_MS,
  SNAP_PREWARM_LEAD_MS,
  buildMachineObservation,
  createMachineState,
  evaluateMachinePlan,
  machinePlanesOff,
  stepMachineOrchestrator,
} from '../src/sync/machineOrchestrator.ts'
import type { MachineObservation } from '../src/sync/machineOrchestrator.ts'
import { SOFT_REFRESH_AGE_BLOCKS } from '../src/sync/swarmGenerationPolicy.ts'

function calmHeadFollowingObs(nowMs: number): MachineObservation {
  const spine = createSpine('sepolia', 11155111n)
  setPhase(spine, 'HEAD_FOLLOWING')
  spine.ethyBucketsBitmask = 0xffff
  spine.swarm = {
    generationAgeBlocks: 100n,
    balTailContiguous: true,
    shadowRefresh: { mode: 'idle', suppressionState: 'clear' },
  }
  spine.lastVerifiedBlockNumber = 12_000_000n
  return buildMachineObservation({
    spine,
    peerSnapshots: [],
    syncMode: 'auto',
    shadowRefreshEnabled: true,
    nowMs,
    snapDiscoveryHold: false,
    ethySwarmActive: false,
    degradedStall: false,
    hasUsableEthyGNew: false,
  })
}

describe('machineOrchestrator', () => {
  it('cold boot-warmup omits snap1 unless --snap-bootstrap (ethy mode keeps snap off)', () => {
    const now = Date.now()
    const base: MachineObservation = {
      ...calmHeadFollowingObs(now),
      phase: 'P2P_WARMUP',
      healthyEthPeers: 0,
      bucketsMask: 0,
      snapBootstrap: false,
    }
    const autoPlan = evaluateMachinePlan(base)
    assert.equal(autoPlan.mode, 'boot-warmup')
    assert.equal(autoPlan.planes.snap, 'prewarming')
    assert.notInclude(autoPlan.profile.capabilities, 'snap1')
    assert.equal(autoPlan.servingEthy, 'off')

    const bootstrapped = evaluateMachinePlan({ ...base, snapBootstrap: true })
    assert.include(bootstrapped.profile.capabilities, 'snap1')

    const ethyOnlyPlan = evaluateMachinePlan({ ...base, syncMode: 'ethy' })
    assert.equal(ethyOnlyPlan.mode, 'boot-warmup')
    assert.equal(ethyOnlyPlan.planes.snap, 'off')
    assert.notInclude(ethyOnlyPlan.profile.capabilities, 'snap1')
  })

  it('live-calm keeps snap and discovery off when peers are healthy', () => {
    const now = Date.now()
    const obs: MachineObservation = {
      ...calmHeadFollowingObs(now),
      healthyEthPeers: 4,
      ethySessionPeers: 2,
    }
    const plan = evaluateMachinePlan(obs)
    assert.equal(plan.mode, 'live-calm')
    const off = machinePlanesOff(plan)
    assert.equal(off.snapOff, true)
    assert.equal(off.discoveryOff, true)
    assert.notInclude(plan.profile.capabilities, 'snap1')
  })

  it('prewarm-ethy opens discovery burst inside T-15m and caps burst after 5m', () => {
    const t0 = 1_000_000
    const leadBlocks = BigInt(Math.floor(ETHY_PREWARM_LEAD_MS / 12_000))
    const age = SOFT_REFRESH_AGE_BLOCKS - leadBlocks + 5n
    const base = {
      ...calmHeadFollowingObs(t0),
      generationAgeBlocks: age,
      healthyEthPeers: 4,
      ethySessionPeers: 1,
      hasUsableEthyGNew: false,
    }
    const step1 = stepMachineOrchestrator(createMachineState(), base)
    assert.equal(step1.plan.mode, 'prewarm-ethy')
    assert.equal(step1.plan.planes.discovery, 'prewarming')
    assert.equal(step1.plan.profile.discoveryMode, 'active')
    assert.equal(step1.nextState.discoveryBurstStartedMs, t0)

    const step2 = stepMachineOrchestrator(step1.nextState, {
      ...base,
      nowMs: t0 + DISCOVERY_PREWARM_BURST_MS + 1_000,
    })
    assert.equal(step2.plan.planes.discovery, 'standby')
    assert.equal(step2.plan.profile.discoveryMode, 'quiet')
    assert.isAbove(step2.nextState.transitions.length, 0)
  })

  it('paused-bal-gap when mask full but BAL tail gapped', () => {
    const now = Date.now()
    const obs: MachineObservation = {
      ...calmHeadFollowingObs(now),
      balTailContiguous: false,
      bucketsMask: 0xffff,
      healthyEthPeers: 3,
    }
    const plan = evaluateMachinePlan(obs)
    assert.equal(plan.servingEthy, 'paused-bal-gap')
    assert.equal(plan.profile.ethyDiscoveryTag, false)
  })

  it('prewarm-snap-mint inside T-3m of election deadline', () => {
    const now = Date.now()
    const obs: MachineObservation = {
      ...calmHeadFollowingObs(now),
      healthyEthPeers: 4,
      snapBootstrap: true,
      shadowMode: 'waiting-election',
      electionDeadlineMs: now + SNAP_PREWARM_LEAD_MS - 5_000,
      electionSuppressed: false,
    }
    const plan = evaluateMachinePlan(obs)
    assert.equal(plan.mode, 'prewarm-snap-mint')
    assert.equal(plan.planes.snap, 'prewarming')
    assert.include(plan.profile.capabilities, 'snap1')
  })

  it('degraded-recovery post-boot bypasses dwell on discovery', () => {
    const now = Date.now()
    const obs: MachineObservation = {
      ...calmHeadFollowingObs(now),
      healthyEthPeers: 0,
      dwell: { discovery: { status: 'off', sinceMs: now - 1_000 } },
    }
    const plan = evaluateMachinePlan(obs)
    assert.equal(plan.mode, 'degraded-recovery')
    assert.equal(plan.planes.discovery, 'active')
  })

  it('surfaces low-disk block instead of lying BAL gap — refresh queued', () => {
    const now = Date.now()
    const GiB = 1024n * 1024n * 1024n
    const obs: MachineObservation = {
      ...calmHeadFollowingObs(now),
      healthyEthPeers: 4,
      balTailContiguous: false,
      generationAgeBlocks: 100_000n,
      shadowMode: 'idle',
      shadowBlockedReason: 'low-disk',
      shadowFreeBytes: 15n * GiB,
      shadowRequiredFreeBytes: 24n * GiB,
    }
    const plan = evaluateMachinePlan(obs)
    assert.equal(plan.mode, 'live-calm')
    assert.equal(plan.nextEventSummary, 'BAL gap — low disk (15/24 GB)')
  })

  it('shows SNAP Mint (starting) before bucket 0 initializes', () => {
    const now = Date.now()
    const obs: MachineObservation = {
      ...calmHeadFollowingObs(now),
      healthyEthPeers: 4,
      balTailContiguous: false,
      generationAgeBlocks: 100_000n,
      shadowMode: 'snap-mint',
      shadowMintBucket: undefined,
    }
    const plan = evaluateMachinePlan(obs)
    assert.equal(plan.mode, 'shadow-snap-mint')
    assert.equal(plan.nextEventSummary, 'SNAP Mint (starting)')
  })
})
