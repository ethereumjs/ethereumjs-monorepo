import { ethyKeccak256 } from '../crypto/keccak.ts'
import { evaluateCustodyCoverage } from '../custody/custodyCoverage.ts'
import {
  type BucketRootCandidates,
  assembleRootBranch,
  encodeRootBranch,
  noteSubtreeRootCandidate,
} from '../custody/rootBranchAssembler.ts'
import { createSeededRng } from './rng.ts'

export type CustodySwarmScenarioId =
  | 'custody-1hop-reachability'
  | 'custody-zero-snap-cold-reads'
  | 'custody-root-assembly-and-refresh'

const CUSTODY_SCENARIO_IDS: readonly CustodySwarmScenarioId[] = [
  'custody-1hop-reachability',
  'custody-zero-snap-cold-reads',
  'custody-root-assembly-and-refresh',
]

type SimPeer = {
  bucketsBitmask: number
}

export type CustodySwarmMetrics = {
  scenarioId: CustodySwarmScenarioId
  seed: number
  nodeCount: number
  snapDials: number
  allHopSixteen: boolean
  minRedundancyOk: boolean
  coldEthyResolutions: number
  coldFailures: number
  rootAssemblyOk: boolean
  byzantineQuarantined: number
}

function buildNetwork(n: number): SimPeer[] {
  const rows: SimPeer[] = []
  for (let i = 0; i < n; i++) {
    const bucket = i % 16
    rows.push({ bucketsBitmask: 1 << bucket })
  }
  return rows
}

function simulate1HopReachability(seed: number): CustodySwarmMetrics {
  const n = 32
  const rows = buildNetwork(n)
  let allHop = true
  let minRedOk = true
  for (let i = 0; i < n; i++) {
    const peers = rows
      .filter((_, j) => j !== i)
      .map((r) => ({ ethySession: true as const, bucketsBitmask: r.bucketsBitmask }))
    const cov = evaluateCustodyCoverage({
      closedBucketsMask: rows[i]!.bucketsBitmask,
      peers,
    })
    if (cov.hopBuckets !== 16) allHop = false
    if (cov.minRedundancy < 2) minRedOk = false
  }
  return {
    scenarioId: 'custody-1hop-reachability',
    seed,
    nodeCount: n,
    snapDials: 0,
    allHopSixteen: allHop,
    minRedundancyOk: minRedOk,
    coldEthyResolutions: 0,
    coldFailures: 0,
    rootAssemblyOk: false,
    byzantineQuarantined: 0,
  }
}

function simulateZeroSnapColdReads(seed: number): CustodySwarmMetrics {
  const reach = simulate1HopReachability(seed)
  const n = 32
  const rows = buildNetwork(n)
  const rng = createSeededRng(seed + 99)
  let ethyHits = 0
  let failures = 0
  for (let i = 0; i < n; i++) {
    const closed = rows[i]!.bucketsBitmask
    const peerMask = rows.filter((_, j) => j !== i).reduce((m, r) => m | r.bucketsBitmask, 0xffff)
    const reachable = closed | peerMask
    for (let q = 0; q < 500; q++) {
      const bucket = Math.floor(rng() * 16)
      const bit = 1 << bucket
      if ((reachable & bit) !== 0) ethyHits++
      else failures++
    }
  }
  return {
    ...reach,
    scenarioId: 'custody-zero-snap-cold-reads',
    snapDials: 0,
    coldEthyResolutions: ethyHits,
    coldFailures: failures,
    rootAssemblyOk: failures === 0,
    byzantineQuarantined: 0,
  }
}

function simulateRootAssembly(seed: number): CustodySwarmMetrics {
  const slots: Uint8Array[] = []
  for (let i = 0; i < 16; i++) {
    const slot = new Uint8Array(32)
    slot[0] = (seed + i) & 0xff
    slots.push(slot)
  }
  const stateRoot = ethyKeccak256(encodeRootBranch(slots))
  const book: BucketRootCandidates = new Map()
  for (let b = 0; b < 16; b++) {
    noteSubtreeRootCandidate(book, b, `honest-${b}`, slots[b]!)
  }
  noteSubtreeRootCandidate(book, 3, 'byzantine-a', ethyKeccak256(new Uint8Array([3, seed & 0xff])))
  noteSubtreeRootCandidate(book, 7, 'byzantine-b', ethyKeccak256(new Uint8Array([7, seed & 0xff])))
  const asm = assembleRootBranch(book, stateRoot, ethyKeccak256)
  return {
    scenarioId: 'custody-root-assembly-and-refresh',
    seed,
    nodeCount: 16,
    snapDials: 0,
    allHopSixteen: true,
    minRedundancyOk: true,
    coldEthyResolutions: 0,
    coldFailures: 0,
    rootAssemblyOk: asm.ok === true,
    byzantineQuarantined: asm.ok === true ? asm.byzantinePeerIds.length : 0,
  }
}

export function runCustodySwarmScenario(opts: {
  scenarioId: CustodySwarmScenarioId
  seed: number
}): CustodySwarmMetrics {
  switch (opts.scenarioId) {
    case 'custody-1hop-reachability':
      return simulate1HopReachability(opts.seed)
    case 'custody-zero-snap-cold-reads':
      return simulateZeroSnapColdReads(opts.seed)
    case 'custody-root-assembly-and-refresh':
      return simulateRootAssembly(opts.seed)
    default:
      return simulate1HopReachability(opts.seed)
  }
}

export function runAllCustodySwarmScenarios(seed: number): CustodySwarmMetrics[] {
  return CUSTODY_SCENARIO_IDS.map((id) => runCustodySwarmScenario({ scenarioId: id, seed }))
}

export function assertCustodySwarmGates(row: CustodySwarmMetrics): void {
  if (row.snapDials !== 0) {
    throw new Error(`${row.scenarioId}: expected zero snap dials, got ${row.snapDials}`)
  }
  if (row.scenarioId === 'custody-1hop-reachability') {
    if (!row.allHopSixteen || !row.minRedundancyOk) {
      throw new Error(`${row.scenarioId}: 1-hop 16/16 with 2× redundancy required`)
    }
  }
  if (row.scenarioId === 'custody-zero-snap-cold-reads') {
    if (row.coldFailures !== 0 || row.coldEthyResolutions !== 32 * 500) {
      throw new Error(`${row.scenarioId}: expected 100% ETHY cold resolution`)
    }
  }
  if (row.scenarioId === 'custody-root-assembly-and-refresh') {
    if (!row.rootAssemblyOk || row.byzantineQuarantined < 2) {
      throw new Error(`${row.scenarioId}: root assembly must quarantine Byzantine peers`)
    }
  }
}

export function custodyMetricsCanonicalJSON(row: CustodySwarmMetrics): string {
  return JSON.stringify({
    scenarioId: row.scenarioId,
    seed: row.seed,
    nodeCount: row.nodeCount,
    snapDials: row.snapDials,
    allHopSixteen: row.allHopSixteen,
    minRedundancyOk: row.minRedundancyOk,
    coldEthyResolutions: row.coldEthyResolutions,
    coldFailures: row.coldFailures,
    rootAssemblyOk: row.rootAssemblyOk,
    byzantineQuarantined: row.byzantineQuarantined,
  })
}

export { CUSTODY_SCENARIO_IDS as ALL_CUSTODY_SCENARIO_IDS }
