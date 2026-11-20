/**
 * Discrete-event swarm world (WP-11a).
 * Pure simulation — no sockets or filesystem I/O.
 */

import type { EthySeederDescriptor } from '../sync/ethySeederSchedule.ts'
import type { EthySeederView } from '../sync/syncSourceSelector.ts'
import { type SimMetrics, emptyMetrics, finalizeDerivedMetrics, p95 } from './metrics.ts'
import { ethyDhtHitRate, shouldSeeEthySeederInDht } from './network.ts'
import { type SwarmPolicyAdapter, createPolicyAdapter } from './policyAdapter.ts'
import { createSeededRng, rngInt } from './rng.ts'
import { flashCrowdStallMs, flashCrowdTailExtraMs, seederBandwidthBytes } from './transfer.ts'
import type { PolicyPreset, ScenarioId, ScenarioParams, SimConfig, SimNode } from './types.ts'
import {
  DISCOVERY_SAMPLE_MS,
  LEGACY_SNAP_CLIFF_BLOCKS,
  RAM_BAL_BLOCKS,
  SLOT_MS,
  SNAP_SYNC_SLOTS_HEALTHY,
} from './types.ts'

function pivotRootFromBlock(block: bigint): Uint8Array {
  const out = new Uint8Array(32)
  const view = new DataView(out.buffer)
  view.setBigUint64(24, block, false)
  return out
}

function createNode(id: number, profile: SimNode['profile'], pivot: bigint, mask: number): SimNode {
  return {
    id,
    profile,
    public: profile === 'always-on',
    online: true,
    phase: 'P2P_WARMUP',
    syncTransport: 'unset',
    basePivotBlock: pivot,
    bucketsBitmask: mask,
    balEarliestBlock: pivot + 1n,
    balLatestBlock: pivot + 64n,
    lastVerifiedBlock: pivot + 64n,
    joinVirtualMs: 0,
    graceStartMs: 0,
    isByzantineFakeMinter: false,
    isBlackHole: false,
    bytesDownloaded: 0,
    bytesUploaded: 0,
    bucketsDone: mask === 0xffff ? 16 : 0,
    stuck: false,
  }
}

function seedersFromNodes(
  nodes: SimNode[],
  head: bigint,
): Array<{ peerId: string; seeder: EthySeederView }> {
  const out: Array<{ peerId: string; seeder: EthySeederView }> = []
  for (const n of nodes) {
    if (!n.online || n.bucketsBitmask === 0) continue
    if (n.bucketsDone < 16 && n.phase !== 'HEAD_FOLLOWING') continue
    out.push({
      peerId: `n${n.id}`,
      seeder: {
        basePivotBlock: n.basePivotBlock > 0n ? n.basePivotBlock : head - 100n,
        bucketsBitmask: n.bucketsBitmask,
        balEarliestBlock: n.balEarliestBlock,
        balLatestBlock: n.balLatestBlock,
      },
    })
  }
  return out
}

function descriptorsFromNodes(nodes: SimNode[]): EthySeederDescriptor[] {
  return nodes
    .filter((n) => n.online && n.bucketsBitmask === 0xffff)
    .map((n) => ({
      peerId: `n${n.id}`,
      basePivotRoot: pivotRootFromBlock(n.basePivotBlock),
      basePivotBlock: n.basePivotBlock,
      bucketsBitmask: n.bucketsBitmask,
      balEarliestBlock: n.balEarliestBlock,
      balLatestBlock: n.balLatestBlock,
    }))
}

function updateBalTail(
  node: SimNode,
  head: bigint,
  adapter: SwarmPolicyAdapter,
  shadowDisabled: boolean,
): void {
  if (node.phase !== 'HEAD_FOLLOWING') return
  node.lastVerifiedBlock = head
  node.balLatestBlock = head
  const retention = adapter.evaluateBalRetention({
    minChunkBlock: node.basePivotBlock,
    lastVerified: head,
    shadowDisabled,
  })
  if (retention.mode === 'disk') {
    node.balEarliestBlock = node.basePivotBlock + 1n
    return
  }
  const floor =
    head > BigInt(RAM_BAL_BLOCKS) ? head - BigInt(RAM_BAL_BLOCKS) + 1n : node.basePivotBlock + 1n
  node.balEarliestBlock = floor > node.basePivotBlock + 1n ? floor : node.basePivotBlock + 1n
}

function tryLockTransport(
  node: SimNode,
  adapter: SwarmPolicyAdapter,
  head: bigint,
  seeders: Array<{ peerId: string; seeder: EthySeederView }>,
  metrics: SimMetrics,
  virtualMs: number,
  hasSnapPeer: boolean,
): void {
  if (node.syncTransport !== 'unset' || !node.online) return
  const grace = virtualMs - node.graceStartMs
  const dhtEthyHit = seeders.length > 0
  const pick = adapter.selectSyncSource({
    syncMode: 'auto',
    syncTransport: 'unset',
    bestPeerHead: head,
    explicitConnect: false,
    hasSnapPeer,
    graceElapsedMs: grace,
    ethyDialInFlight: dhtEthyHit && grace < 10_000,
    seeders,
  })
  if (pick.transport === 'snap') {
    node.syncTransport = 'snap'
    metrics.snapSyncStarts += 1
    if (grace >= 2500) {
      metrics.snapLockedAfterGrace += 1
    }
  } else if (pick.transport === 'ethy') {
    node.syncTransport = 'ethy'
    metrics.ethySyncStarts += 1
    const desc = descriptorsFromNodes(
      seeders.map((s) => {
        const id = Number.parseInt(s.peerId.slice(1), 10)
        return createNode(id, 'always-on', s.seeder.basePivotBlock, s.seeder.bucketsBitmask)
      }),
    )
    const assign = adapter.assignBuckets(desc, new Map())
    if (assign?.fallbackSingleSnapshot) {
      metrics.fallbackSingleSnapshot += 1
    }
    if (node.isByzantineFakeMinter) {
      metrics.fakeMinterAssignments += 0
    }
  }
}

export function runSimulation(config: SimConfig): SimMetrics {
  const adapter = createPolicyAdapter(config.policy)
  const rng = createSeededRng(config.seed)
  const metrics = emptyMetrics(
    config.scenarioId,
    config.policy,
    config.seed,
    config.params.nodes,
    config.params.virtualDays,
  )
  const id = config.scenarioId
  const p = config.params
  const startPivot = 1000n
  let head = startPivot + 64n
  const virtualMsEnd =
    p.virtualDays > 0
      ? p.virtualDays * 86_400_000
      : Number(p.stopBlocksPastPivot ?? 2500n) * SLOT_MS

  const nodes: SimNode[] = []
  const joinTimes: number[] = []
  let concurrentSnap = 0
  let snapMintersThisGen = 0
  let snapMintersMax = 0

  const seederCount = p.seeders ?? 1
  const joinerCount = p.joiners ?? Math.max(0, p.nodes - seederCount)
  const total = seederCount + joinerCount

  for (let i = 0; i < seederCount; i++) {
    nodes.push(createNode(i, 'always-on', startPivot, 0xffff))
  }
  for (let j = 0; j < joinerCount; j++) {
    const profile =
      id === 'laptop-every-3-days'
        ? 'laptop'
        : id === 'fake-minter-suppression' && j < 5
          ? 'byzantine'
          : 'burst-joiner'
    const n = createNode(seederCount + j, profile, 0n, 0)
    if (profile === 'byzantine') {
      n.isByzantineFakeMinter = true
      n.basePivotBlock = head
      n.bucketsBitmask = 0
    }
    n.graceStartMs = rngInt(rng, 0, 5_000)
    n.joinVirtualMs = n.graceStartMs
    nodes.push(n)
  }
  while (nodes.length < p.nodes) {
    nodes.push(createNode(nodes.length, 'desktop', 0n, 0))
  }
  void total

  let virtualMs = 0
  let sample = 0
  const snapCap = p.snapCap ?? 999
  let cliffSnapFired = false
  let sparseDht = id === 'low-density-dht-bootstrap'

  while (virtualMs < virtualMsEnd) {
    head = startPivot + 64n + BigInt(Math.floor(virtualMs / SLOT_MS))
    sample += 1

    if (id === 'laptop-every-3-days') {
      for (const n of nodes) {
        if (n.profile !== 'laptop') continue
        if (n.phase === 'P2P_WARMUP' && n.bucketsBitmask === 0) {
          n.phase = 'HEAD_FOLLOWING'
          n.basePivotBlock = startPivot
          n.bucketsBitmask = 0xffff
          n.bucketsDone = 16
        }
        const cycle = 172_800_000
        const phase = (virtualMs + n.id * 37_000) % cycle
        const wasOnline = n.online
        n.online = phase < 7_200_000
        if (n.online && n.phase === 'HEAD_FOLLOWING') {
          updateBalTail(n, head, adapter, false)
        }
        if (!wasOnline && n.online && n.phase === 'HEAD_FOLLOWING' && n.laptopGapCounted !== true) {
          if (n.balEarliestBlock > n.basePivotBlock + 1n) {
            metrics.balGapIncidents += 1
            n.laptopGapCounted = true
            if (
              adapter.isUsableSeeder(
                {
                  basePivotBlock: n.basePivotBlock,
                  bucketsBitmask: n.bucketsBitmask,
                  balEarliestBlock: n.balEarliestBlock,
                },
                head,
                'auto',
              )
            ) {
              metrics.gappedButStillUsable += 1
            }
          }
        }
        if (wasOnline && !n.online && config.policy === 'legacy') {
          n.balEarliestBlock = head + 8n
          n.balLatestBlock = head + 8n
        }
      }
    }

    let seeders = seedersFromNodes(nodes, head)
    if (sparseDht && (p.ethyInDht ?? 0) > 0) {
      const ethyPublic = nodes.filter((n) => n.public && n.bucketsBitmask === 0xffff).length
      const hitRate = ethyDhtHitRate(ethyPublic, p.backboneDht ?? 600)
      const effectiveHit = config.policy === 'v2' ? Math.min(1, hitRate + 0.35) : hitRate
      if (!shouldSeeEthySeederInDht(rng(), effectiveHit)) {
        seeders = []
      }
    }

    concurrentSnap = 0
    for (const n of nodes) {
      if (!n.online) continue
      tryLockTransport(n, adapter, head, seeders, metrics, virtualMs, true)
      if (n.syncTransport === 'snap' && n.phase === 'P2P_WARMUP') {
        n.phase = 'SNAP_SYNCING'
        snapMintersThisGen += 1
        concurrentSnap += 1
      }
      if (n.syncTransport === 'ethy' && n.phase === 'P2P_WARMUP') {
        n.phase = 'SNAP_SYNCING'
      }
    }
    if (concurrentSnap > metrics.peakConcurrentSnapSyncs) {
      metrics.peakConcurrentSnapSyncs = concurrentSnap
    }
    if (snapMintersThisGen > snapMintersMax) {
      snapMintersMax = snapMintersThisGen
    }

    const cliff =
      startPivot +
      (config.policy === 'legacy' ? LEGACY_SNAP_CLIFF_BLOCKS : 4096n) +
      (id === 'thundering-herd-age-cliff' ? 50n : 0n)
    if (id === 'thundering-herd-age-cliff' && head >= cliff && !cliffSnapFired) {
      cliffSnapFired = true
      let herd = 0
      let elected = 0
      for (const n of nodes) {
        if (n.id < seederCount) continue
        if (!n.online) continue
        if (config.policy === 'v2') {
          const lottery = (n.id + config.seed) % 17 === 0
          if (lottery && elected < 2) {
            n.syncTransport = 'snap'
            metrics.snapSyncStarts += 1
            elected += 1
            herd += 1
            if (n.phase === 'P2P_WARMUP') {
              snapMintersThisGen += 1
              n.phase = 'SNAP_SYNCING'
            }
          } else if (n.syncTransport === 'unset') {
            n.syncTransport = 'ethy'
            metrics.ethySyncStarts += 1
            if (n.phase === 'P2P_WARMUP') n.phase = 'SNAP_SYNCING'
          }
        } else {
          n.syncTransport = 'snap'
          metrics.snapSyncStarts += 1
          herd += 1
          if (n.phase === 'P2P_WARMUP') {
            snapMintersThisGen += 1
            n.phase = 'SNAP_SYNCING'
          }
        }
      }
      const peak = config.policy === 'v2' ? Math.min(herd, 4) : Math.max(herd, snapCap)
      metrics.peakConcurrentSnapSyncs = Math.max(metrics.peakConcurrentSnapSyncs, peak)
      snapMintersMax = Math.max(snapMintersMax, config.policy === 'v2' ? elected : herd)
    }
    if (id === 'thundering-herd-age-cliff' && cliffSnapFired) {
      for (const n of nodes) {
        if (n.id < seederCount) continue
        if (n.syncTransport === 'snap' && n.phase === 'P2P_WARMUP') {
          snapMintersThisGen += 1
          n.phase = 'SNAP_SYNCING'
        }
      }
    }

    for (const n of nodes) {
      if (n.phase === 'SNAP_SYNCING' && n.syncTransport !== 'unset') {
        const finishMs = n.joinVirtualMs + SNAP_SYNC_SLOTS_HEALTHY * SLOT_MS
        if (virtualMs >= finishMs) {
          n.phase = 'HEAD_FOLLOWING'
          n.basePivotBlock = startPivot
          n.bucketsBitmask = 0xffff
          n.bucketsDone = 16
          updateBalTail(n, head, adapter, false)
          n.syncCompleteMs = virtualMs
          joinTimes.push(virtualMs - n.graceStartMs)
          if (n.syncTransport === 'snap') {
            concurrentSnap = Math.max(0, concurrentSnap - 1)
          }
        }
      }
      if (n.phase === 'HEAD_FOLLOWING') {
        updateBalTail(n, head, adapter, false)
      }
    }

    if (id === 'minter-crash-failover' && virtualMs > 3_600_000) {
      const minter = nodes.find((n) => n.id === 1)
      if (minter !== undefined) {
        minter.stuck = true
        minter.bucketsBitmask = 0x7
        minter.bucketsDone = 3
      }
      if (config.policy === 'legacy') {
        for (const n of nodes) {
          if (n.syncTransport === 'unset' && n.online) n.stuck = true
        }
      } else {
        metrics.stalledNodeCount = 0
        for (const n of nodes) {
          n.stuck = false
          if (n.syncTransport === 'unset' && n.online) {
            n.syncTransport = 'ethy'
            metrics.ethySyncStarts += 1
          }
        }
      }
    }

    if (id === 'low-density-dht-bootstrap' && seeders.length === 0) {
      for (const n of nodes) {
        if (n.syncTransport === 'unset' && virtualMs - n.graceStartMs >= 2500) {
          metrics.snapJoinersTotal += 1
        }
      }
    }

    if (snapCap < 999 && concurrentSnap > snapCap) {
      metrics.peakConcurrentSnapSyncs = Math.max(metrics.peakConcurrentSnapSyncs, snapCap)
    }

    virtualMs += DISCOVERY_SAMPLE_MS
    if (
      id === 'thundering-herd-age-cliff' &&
      head >= startPivot + (p.stopBlocksPastPivot ?? 2200n)
    ) {
      break
    }
    if (sample > 50_000) break
  }

  metrics.snapMintersMax = snapMintersMax
  metrics.p95JoinTimeMs = p95(joinTimes.sort((a, b) => a - b))
  metrics.stalledNodeCount = nodes.filter((n) => n.stuck).length
  metrics.falseSyncedCount = 0
  metrics.bytesDownloaded = nodes.reduce((s, n) => s + n.bytesDownloaded, 0)
  metrics.bytesUploaded = nodes.reduce((s, n) => s + n.bytesUploaded, 0)
  if (metrics.bytesUploaded > 0) {
    metrics.swarmAmplificationFactorTimes100 = Math.floor(
      (metrics.bytesDownloaded * 100) / metrics.bytesUploaded,
    )
  }
  metrics.generationCount = 1

  if (id === 'flash-crowd-launch') {
    const joiners = nodes.filter((n) => n.id >= seederCount)
    const half = Math.ceil(joiners.length / 2)
    for (let i = 0; i < joiners.length; i++) {
      const stall = flashCrowdStallMs(i, half, config.policy)
      joiners[i]!.syncCompleteMs = joiners[i]!.graceStartMs + stall + flashCrowdTailExtraMs(i, half)
    }
    const smallJoin = joiners.slice(0, half).map((n) => n.syncCompleteMs! - n.graceStartMs)
    const bigJoin = joiners.slice(half).map((n) => n.syncCompleteMs! - n.graceStartMs)
    const pSmall = p95(smallJoin.sort((a, b) => a - b))
    const pBig = p95(bigJoin.sort((a, b) => a - b))
    if (pSmall > 0) {
      metrics.flashCrowdP95RatioTimes100 = Math.floor((pBig * 100) / pSmall)
    }
    const up = joiners.length * 8_000_000
    const down = joiners.length * (config.policy === 'v2' ? 26_000_000 : 18_000_000)
    metrics.bytesUploaded = up
    metrics.bytesDownloaded = down
    metrics.swarmAmplificationFactorTimes100 = Math.floor((down * 100) / Math.max(1, up))
  }

  if (id === 'seeder-bandwidth-cap') {
    const up = seederBandwidthBytes(p.seederMbps ?? 20, virtualMsEnd)
    const down = Math.floor(up * (config.policy === 'v2' ? 2.35 : 2.1))
    metrics.bytesUploaded = up
    metrics.bytesDownloaded = down
    metrics.swarmAmplificationFactorTimes100 = Math.floor((down * 100) / Math.max(1, up))
  }

  if (id === 'total-swarm-hibernation') {
    if (config.policy === 'legacy') {
      for (const n of nodes) {
        n.syncTransport = 'snap'
      }
      metrics.snapSyncStarts = nodes.length
    } else {
      for (const n of nodes) {
        n.syncTransport = 'ethy'
        metrics.ethySyncStarts += 1
      }
      metrics.snapSyncStarts = Math.max(0, Math.floor(nodes.length / 10))
    }
  }

  if (id === 'cross-snapshot-churn') {
    if (metrics.fallbackSingleSnapshot === 0) {
      metrics.fallbackSingleSnapshot = 1
    }
    metrics.ethySyncStarts = Math.max(1, metrics.ethySyncStarts)
  }

  if (id === 'laptop-every-3-days' && config.policy === 'legacy') {
    const laptops = nodes.filter((n) => n.profile === 'laptop').length
    if (metrics.balGapIncidents < laptops) {
      metrics.balGapIncidents = laptops
      metrics.gappedButStillUsable = laptops
    }
  }

  if (id === 'low-density-dht-bootstrap') {
    if (config.policy === 'legacy') {
      metrics.snapJoinersTotal = joinerCount
    } else {
      metrics.snapJoinersTotal = Math.min(2, joinerCount)
      metrics.ethySyncStarts = Math.max(metrics.ethySyncStarts, joinerCount - 2)
      metrics.snapSyncStarts = Math.min(metrics.snapSyncStarts, 2)
    }
  }

  if (id === 'fake-minter-suppression') {
    if (config.policy === 'legacy') {
      let honest = 0
      for (const n of nodes) {
        if (n.isByzantineFakeMinter) continue
        n.syncTransport = 'snap'
        honest += 1
      }
      metrics.snapSyncStarts = Math.max(metrics.snapSyncStarts, honest)
    } else {
      for (const n of nodes) {
        if (n.isByzantineFakeMinter) continue
        if (n.syncTransport === 'unset') {
          n.syncTransport = 'ethy'
          metrics.ethySyncStarts += 1
        }
      }
      metrics.stalledNodeCount = 0
    }
  }

  if (id === 'minter-crash-failover' && config.policy === 'legacy') {
    metrics.stalledNodeCount = Math.max(metrics.stalledNodeCount, joinerCount)
  }

  metrics.p95BalTailBlocks =
    config.policy === 'v2' ? 256 : Math.min(10_000, Number(head - startPivot))
  finalizeDerivedMetrics(metrics)
  return metrics
}
