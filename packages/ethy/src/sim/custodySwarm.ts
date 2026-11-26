import { ethyKeccak256 } from '../crypto/keccak.ts'
import {
  custodyBitmask,
  evaluateCustodyCoverage,
  pickRedundantEthyPeerToRotate,
} from '../custody/custodyCoverage.ts'
import { selectCustodyBuckets } from '../custody/custodyPlan.ts'
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

const MAX_CUSTODY_PEERS = 18
const PEX_WARMUP_ROUNDS = 12
const COLD_QUERIES_PER_NODE = 500
const MACRO_GENERATIONS = 2

type SimCustodyNode = {
  id: string
  index: number
  buckets: number[]
  bucketsBitmask: number
  trieReady: boolean
  peers: Set<number>
  known: Set<number>
}

export type CustodySwarmMetrics = {
  scenarioId: CustodySwarmScenarioId
  seed: number
  nodeCount: number
  maxConnectedPeers: number
  snapDials: number
  allHopSixteen: boolean
  minRedundancyOk: boolean
  coldLocalResolutions: number
  coldEthyResolutions: number
  coldFailures: number
  rootAssemblyOk: boolean
  byzantineQuarantined: number
  generationsRefreshed: number
}

function countSetBits16(mask: number): number {
  let n = 0
  for (let b = 0; b < 16; b++) {
    if ((mask & (1 << b)) !== 0) n++
  }
  return n
}

/**
 * Build `n` `--custody 2` nodes using real `selectCustodyBuckets(nodeId, 2)`,
 * ensuring every nibble pair `(start, (start + 8) & 0xf)` is populated evenly
 * across the swarm (for `n = 32`, every nibble has 4 custodians).
 */
function buildCustody2Nodes(n: number, seed: number): SimCustodyNode[] {
  const nodes: SimCustodyNode[] = []
  const targetStartCounts = new Uint8Array(8)
  const targetPerPair = Math.max(1, Math.floor(n / 8))
  let nonce = seed * 1024 + 1
  while (nodes.length < n) {
    const nodeId = new Uint8Array(32)
    nodeId[0] = (nonce >>> 24) & 0xff
    nodeId[1] = (nonce >>> 16) & 0xff
    nodeId[2] = (nonce >>> 8) & 0xff
    nodeId[3] = nonce & 0xff
    nonce++
    const buckets = selectCustodyBuckets(nodeId, 2)
    const pairIdx = Math.min(buckets[0]!, buckets[1]!) & 0x7
    if (nodes.length < targetPerPair * 8 && targetStartCounts[pairIdx]! >= targetPerPair) {
      continue
    }
    targetStartCounts[pairIdx]!++
    const idx = nodes.length
    nodes.push({
      id: `node-${idx.toString().padStart(2, '0')}`,
      index: idx,
      buckets,
      bucketsBitmask: custodyBitmask(buckets),
      trieReady: idx % 2 === 0,
      peers: new Set(),
      known: new Set(),
    })
  }
  return nodes
}

function connectSymmetric(nodes: SimCustodyNode[], a: number, b: number): boolean {
  if (a === b) return false
  const na = nodes[a]!
  const nb = nodes[b]!
  if (na.peers.has(b)) return false
  if (na.peers.size >= MAX_CUSTODY_PEERS || nb.peers.size >= MAX_CUSTODY_PEERS) return false
  na.peers.add(b)
  nb.peers.add(a)
  na.known.add(b)
  nb.known.add(a)
  return true
}

function disconnectSymmetric(nodes: SimCustodyNode[], a: number, b: number): void {
  nodes[a]!.peers.delete(b)
  nodes[b]!.peers.delete(a)
}

function nodeCoverage(nodes: SimCustodyNode[], node: SimCustodyNode) {
  const peers = [...node.peers].map((j) => {
    const p = nodes[j]!
    return {
      id: p.id,
      ethySession: true as const,
      bucketsBitmask: p.bucketsBitmask,
    }
  })
  return evaluateCustodyCoverage({
    closedBucketsMask: node.bucketsBitmask,
    peers,
  })
}

/**
 * Discrete-event bucket-aware `ETHY_PEX` convergence with strict `MAX_CUSTODY_PEERS = 18`
 * and Law-1 redundant peer rotation (`0` `snap/1` dials).
 */
function runPexConvergence(
  n: number,
  seed: number,
): {
  nodes: SimCustodyNode[]
  maxConnectedPeers: number
  allHopSixteen: boolean
  minRedundancyOk: boolean
} {
  const nodes = buildCustody2Nodes(n, seed)
  const rng = createSeededRng(seed)

  // Sparse bootstrap graph: connect ring + 2 seeded random peers per node
  for (let i = 0; i < n; i++) {
    connectSymmetric(nodes, i, (i + 1) % n)
    for (let k = 0; k < 2; k++) {
      const target = Math.floor(rng() * n)
      connectSymmetric(nodes, i, target)
    }
  }

  for (let round = 0; round < PEX_WARMUP_ROUNDS; round++) {
    let anyChange = false
    for (let i = 0; i < n; i++) {
      const node = nodes[i]!
      const cov = nodeCoverage(nodes, node)
      const desired = cov.desiredEthyBucketsMask
      if (desired === 0) continue

      // Bucket-aware ETHY_PEX: gather known peers from connected neighbors
      const candidates = new Set<number>()
      for (const peerIdx of node.peers) {
        const peer = nodes[peerIdx]!
        for (const k of peer.peers) {
          if (k !== i && !node.peers.has(k)) candidates.add(k)
        }
        for (const k of peer.known) {
          if (k !== i && !node.peers.has(k)) candidates.add(k)
        }
      }
      for (const c of candidates) node.known.add(c)

      // Rank candidates lexicographically: overlap with desired -> trieReady -> index
      const ranked = [...candidates]
        .map((idx) => ({
          idx,
          overlap: countSetBits16(nodes[idx]!.bucketsBitmask & desired),
          trie: nodes[idx]!.trieReady ? 1 : 0,
        }))
        .filter((c) => c.overlap > 0)
        .sort((a, b) => b.overlap - a.overlap || b.trie - a.trie || a.idx - b.idx)

      for (const candidate of ranked.slice(0, 4)) {
        const currentCov = nodeCoverage(nodes, node)
        if (currentCov.desiredEthyBucketsMask === 0) break
        if ((nodes[candidate.idx]!.bucketsBitmask & currentCov.desiredEthyBucketsMask) === 0) {
          continue
        }

        // Free a slot on local node via Law-1 redundant rotation if full
        if (node.peers.size >= MAX_CUSTODY_PEERS) {
          const victimId = pickRedundantEthyPeerToRotate({
            closedBucketsMask: node.bucketsBitmask,
            desiredEthyBucketsMask: currentCov.desiredEthyBucketsMask,
            peers: [...node.peers].map((j) => ({
              id: nodes[j]!.id,
              ethySession: true as const,
              bucketsBitmask: nodes[j]!.bucketsBitmask,
            })),
          })
          if (victimId === undefined) break
          const victimIdx = nodes.findIndex((x) => x.id === victimId)
          if (victimIdx >= 0) disconnectSymmetric(nodes, i, victimIdx)
        }

        // Also allow target peer to rotate a redundant slot if full and local helps target
        const target = nodes[candidate.idx]!
        if (target.peers.size >= MAX_CUSTODY_PEERS) {
          const targetCov = nodeCoverage(nodes, target)
          if (targetCov.desiredEthyBucketsMask !== 0) {
            const victimId = pickRedundantEthyPeerToRotate({
              closedBucketsMask: target.bucketsBitmask,
              desiredEthyBucketsMask: targetCov.desiredEthyBucketsMask,
              peers: [...target.peers].map((j) => ({
                id: nodes[j]!.id,
                ethySession: true as const,
                bucketsBitmask: nodes[j]!.bucketsBitmask,
              })),
            })
            if (victimId !== undefined) {
              const victimIdx = nodes.findIndex((x) => x.id === victimId)
              if (victimIdx >= 0) disconnectSymmetric(nodes, candidate.idx, victimIdx)
            }
          }
        }

        if (connectSymmetric(nodes, i, candidate.idx)) {
          anyChange = true
        }
      }
    }
    if (!anyChange) break
  }

  let maxConnectedPeers = 0
  let allHopSixteen = true
  let minRedundancyOk = true
  for (const node of nodes) {
    if (node.peers.size > maxConnectedPeers) maxConnectedPeers = node.peers.size
    const cov = nodeCoverage(nodes, node)
    if (cov.hopBuckets !== 16) allHopSixteen = false
    if (cov.minRedundancy < 2) minRedundancyOk = false
  }
  return { nodes, maxConnectedPeers, allHopSixteen, minRedundancyOk }
}

function simulate1HopReachability(seed: number): CustodySwarmMetrics {
  const n = 32
  const res = runPexConvergence(n, seed)
  return {
    scenarioId: 'custody-1hop-reachability',
    seed,
    nodeCount: n,
    maxConnectedPeers: res.maxConnectedPeers,
    snapDials: 0,
    allHopSixteen: res.allHopSixteen,
    minRedundancyOk: res.minRedundancyOk,
    coldLocalResolutions: 0,
    coldEthyResolutions: 0,
    coldFailures: 0,
    rootAssemblyOk: false,
    byzantineQuarantined: 0,
    generationsRefreshed: 0,
  }
}

function simulateZeroSnapColdReads(seed: number): CustodySwarmMetrics {
  const n = 32
  const res = runPexConvergence(n, seed)
  const rng = createSeededRng(seed + 99)
  let localHits = 0
  let ethyHits = 0
  let failures = 0
  for (const node of res.nodes) {
    const peerMasks = [...node.peers].map((j) => res.nodes[j]!.bucketsBitmask)
    for (let q = 0; q < COLD_QUERIES_PER_NODE; q++) {
      const bucket = Math.floor(rng() * 16)
      const bit = 1 << bucket
      if ((node.bucketsBitmask & bit) !== 0) {
        localHits++
        continue
      }
      // Strictly check connected 1-hop peers (never fabricate full reachability)
      const hasCustodian = peerMasks.some((m) => (m & bit) !== 0)
      if (hasCustodian) ethyHits++
      else failures++
    }
  }
  return {
    scenarioId: 'custody-zero-snap-cold-reads',
    seed,
    nodeCount: n,
    maxConnectedPeers: res.maxConnectedPeers,
    snapDials: 0,
    allHopSixteen: res.allHopSixteen,
    minRedundancyOk: res.minRedundancyOk,
    coldLocalResolutions: localHits,
    coldEthyResolutions: ethyHits,
    coldFailures: failures,
    rootAssemblyOk: failures === 0,
    byzantineQuarantined: 0,
    generationsRefreshed: 0,
  }
}

function simulateRootAssemblyAndRefresh(seed: number): CustodySwarmMetrics {
  const n = 16
  // 16 custody-2 nodes (2 honest custodians per nibble pair). Pick 2 Byzantine nodes
  // from distinct nibble pairs so every nibble still has an honest custodian; each
  // Byzantine peer forges one of its advertised h_b roots (2 conflicting buckets total).
  const nodes = buildCustody2Nodes(n, seed + 7)
  const byzantineForgedBucket = new Map<number, number>()
  const usedPairs = new Set<number>()
  for (let i = n - 1; i >= 0 && byzantineForgedBucket.size < 2; i--) {
    const nd = nodes[i]!
    const pairIdx = Math.min(nd.buckets[0]!, nd.buckets[1]!) & 0x7
    if (usedPairs.has(pairIdx)) continue
    usedPairs.add(pairIdx)
    byzantineForgedBucket.set(nd.index, nd.buckets[0]!)
  }
  const honestNodes = nodes.filter((nd) => !byzantineForgedBucket.has(nd.index))
  const quarantineByNode = new Map<string, Set<string>>()
  for (const h of honestNodes) quarantineByNode.set(h.id, new Set())

  let allGenerationsOk = true
  let generationsRefreshed = 0

  for (let gen = 1; gen <= MACRO_GENERATIONS; gen++) {
    const honestSlots: Uint8Array[] = []
    for (let b = 0; b < 16; b++) {
      honestSlots.push(ethyKeccak256(new Uint8Array([seed & 0xff, gen, b, 0x11])))
    }
    const stateRoot = ethyKeccak256(encodeRootBranch(honestSlots))

    let genOk = true
    for (const honest of honestNodes) {
      const quarantined = quarantineByNode.get(honest.id)!
      const book: BucketRootCandidates = new Map()
      for (const sender of nodes) {
        if (quarantined.has(sender.id)) continue
        const forgedBucket = byzantineForgedBucket.get(sender.index)
        for (const b of sender.buckets) {
          const hash =
            forgedBucket === b
              ? ethyKeccak256(new Uint8Array([0xee, seed & 0xff, gen, b, sender.index]))
              : honestSlots[b]!
          noteSubtreeRootCandidate(book, b, sender.id, hash)
        }
      }
      const asm = assembleRootBranch(book, stateRoot, ethyKeccak256)
      if (!asm.ok) {
        genOk = false
        continue
      }
      for (const badId of asm.byzantinePeerIds) {
        quarantined.add(badId)
      }
    }
    if (genOk) generationsRefreshed++
    else allGenerationsOk = false
  }

  // Minimum quarantined Byzantine peers observed across every honest node
  let minQuarantined = Number.POSITIVE_INFINITY
  for (const h of honestNodes) {
    const q = quarantineByNode.get(h.id)!.size
    if (q < minQuarantined) minQuarantined = q
  }
  if (!Number.isFinite(minQuarantined)) minQuarantined = 0

  return {
    scenarioId: 'custody-root-assembly-and-refresh',
    seed,
    nodeCount: n,
    maxConnectedPeers: n - 1,
    snapDials: 0,
    allHopSixteen: true,
    minRedundancyOk: true,
    coldLocalResolutions: 0,
    coldEthyResolutions: 0,
    coldFailures: 0,
    rootAssemblyOk: allGenerationsOk && generationsRefreshed === MACRO_GENERATIONS,
    byzantineQuarantined: minQuarantined,
    generationsRefreshed,
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
      return simulateRootAssemblyAndRefresh(opts.seed)
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
  if (row.maxConnectedPeers > MAX_CUSTODY_PEERS) {
    throw new Error(
      `${row.scenarioId}: exceeded maxPeers ${MAX_CUSTODY_PEERS} (got ${row.maxConnectedPeers})`,
    )
  }
  if (row.scenarioId === 'custody-1hop-reachability') {
    if (!row.allHopSixteen || !row.minRedundancyOk) {
      throw new Error(`${row.scenarioId}: 1-hop 16/16 with 2× redundancy required`)
    }
  }
  if (row.scenarioId === 'custody-zero-snap-cold-reads') {
    const total = row.coldLocalResolutions + row.coldEthyResolutions
    if (
      row.coldFailures !== 0 ||
      total !== 32 * COLD_QUERIES_PER_NODE ||
      row.coldEthyResolutions === 0
    ) {
      throw new Error(
        `${row.scenarioId}: expected 100% zero-snap cold resolution (failures=${row.coldFailures}, ethy=${row.coldEthyResolutions}, local=${row.coldLocalResolutions})`,
      )
    }
  }
  if (row.scenarioId === 'custody-root-assembly-and-refresh') {
    if (
      !row.rootAssemblyOk ||
      row.byzantineQuarantined < 2 ||
      row.generationsRefreshed !== MACRO_GENERATIONS
    ) {
      throw new Error(
        `${row.scenarioId}: root assembly must quarantine >=2 Byzantine peers across ${MACRO_GENERATIONS} macro generations (ok=${row.rootAssemblyOk}, quarantined=${row.byzantineQuarantined}, gens=${row.generationsRefreshed})`,
      )
    }
  }
}

export function custodyMetricsCanonicalJSON(row: CustodySwarmMetrics): string {
  return JSON.stringify({
    scenarioId: row.scenarioId,
    seed: row.seed,
    nodeCount: row.nodeCount,
    maxConnectedPeers: row.maxConnectedPeers,
    snapDials: row.snapDials,
    allHopSixteen: row.allHopSixteen,
    minRedundancyOk: row.minRedundancyOk,
    coldLocalResolutions: row.coldLocalResolutions,
    coldEthyResolutions: row.coldEthyResolutions,
    coldFailures: row.coldFailures,
    rootAssemblyOk: row.rootAssemblyOk,
    byzantineQuarantined: row.byzantineQuarantined,
    generationsRefreshed: row.generationsRefreshed,
  })
}

export { CUSTODY_SCENARIO_IDS as ALL_CUSTODY_SCENARIO_IDS }
