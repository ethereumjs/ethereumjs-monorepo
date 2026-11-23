import { assert, describe, it } from 'vitest'

import { createSpine, setPhase } from '../src/spine/createSpine.ts'
import {
  ETHY_PREWARM_LEAD_MS,
  SNAP_PREWARM_LEAD_MS,
  buildMachineObservation,
  evaluateMachinePlan,
  machinePlanesOff,
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
  spine.serving = { blocksStored: 90, earliestBlock: '11999000', latestBlock: '12000000' } as never
  return buildMachineObservation({
    spine,
    peerSnapshots: [],
    syncMode: 'auto',
    shadowRefreshEnabled: true,
    nowMs,
    snapDiscoveryHold: false,
    ethySwarmActive: false,
    degradedStall: false,
    dwell: {},
    vipTarget: 3,
    hasUsableEthyGNew: false,
    uptimeMs: 600_000,
  })
}

describe('machineOrchestrator', () => {
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

  it('pre-warm ethy opens discovery inside T-15m of soft refresh', () => {
    const now = Date.now()
    const leadBlocks = BigInt(Math.floor(ETHY_PREWARM_LEAD_MS / 12_000))
    const age = SOFT_REFRESH_AGE_BLOCKS - leadBlocks + 5n
    const obs: MachineObservation = {
      ...calmHeadFollowingObs(now),
      generationAgeBlocks: age,
      healthyEthPeers: 4,
      ethySessionPeers: 1,
      hasUsableEthyGNew: false,
    }
    const plan = evaluateMachinePlan(obs)
    assert.equal(plan.mode, 'prewarm-ethy')
    assert.equal(plan.planes.discovery.status, 'prewarming')
    assert.equal(plan.profile.discoveryMode, 'active')
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
    assert.equal(plan.serving.ethy, 'paused-bal-gap')
    assert.equal(plan.profile.ethyDiscoveryTag, false)
  })

  it('prewarm-snap-mint inside T-3m of election deadline', () => {
    const now = Date.now()
    const obs: MachineObservation = {
      ...calmHeadFollowingObs(now),
      healthyEthPeers: 4,
      shadowMode: 'waiting-election',
      electionDeadlineMs: now + SNAP_PREWARM_LEAD_MS - 5_000,
      electionSuppressed: false,
    }
    const plan = evaluateMachinePlan(obs)
    assert.equal(plan.mode, 'prewarm-snap-mint')
    assert.equal(plan.planes.snap.status, 'prewarming')
  })

  it('degraded-recovery bypasses dwell on discovery', () => {
    const now = Date.now()
    const obs: MachineObservation = {
      ...calmHeadFollowingObs(now),
      healthyEthPeers: 0,
      dwell: { discovery: { status: 'off', sinceMs: now - 1_000 } },
    }
    const plan = evaluateMachinePlan(obs)
    assert.equal(plan.mode, 'degraded-recovery')
    assert.notEqual(plan.planes.discovery.status, 'off')
  })
})
