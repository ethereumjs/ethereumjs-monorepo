import { computeSnapProgressPct, snapBucketsDoneCount } from '../spine/buckets.ts'
import type { EthySpine } from '../spine/types.ts'
import type {
  EconomySnapshot,
  EthyDomainSnapshots,
  HeadDomainSnapshot,
  NodePulseSnapshot,
  P2pDomainSnapshot,
  SnapDomainSnapshot,
} from './types.ts'

function emptyEconomy(): EconomySnapshot {
  return { hasBlocks: false, topContracts: [], recentBlocks: [] }
}

function clientFamilies(spine: EthySpine): string {
  const families = new Map<string, number>()
  for (const p of spine.peers.values()) {
    const name = p.clientName.split('/')[0] ?? p.clientName
    families.set(name, (families.get(name) ?? 0) + 1)
  }
  return [...families.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([n, c]) => `${n}(${c})`)
    .join(', ')
}

function avgLatencyMs(spine: EthySpine): number {
  const peers = [...spine.peers.values()]
  if (peers.length === 0) return 0
  return Math.round(peers.reduce((a, p) => a + p.avgLatencyMs, 0) / peers.length)
}

function ethySessionCount(spine: EthySpine): number {
  let n = 0
  for (const p of spine.peers.values()) {
    if (p.ethySession === true) n += 1
  }
  return n
}

function snapSessionCount(spine: EthySpine): number {
  let n = 0
  for (const p of spine.peers.values()) {
    if (p.snapSession === true) n += 1
  }
  return n
}

/** Read-only domain facade for TUI and future LLM pulse (no write handles). */
export function readDomainSnapshots(spine: EthySpine): EthyDomainSnapshots {
  const bucketsDone = snapBucketsDoneCount(spine.snapBuckets)
  const pulse: NodePulseSnapshot = {
    phase: spine.phase,
    syncTransport: spine.syncTransport,
    pivotBlockNumber: spine.pivotBlockNumber?.toString(),
    headBlockNumber: spine.headBlockNumber?.toString(),
    progressPct: computeSnapProgressPct(spine),
    snapEtaMinutes:
      bucketsDone === 16 ? (spine.storageEtaMinutes ?? spine.snapEtaMinutes) : spine.snapEtaMinutes,
    snapPaused: spine.snapPaused,
    snapPeersResting: spine.snapPeersResting,
  }
  const p2p: P2pDomainSnapshot = {
    connected: spine.peers.size,
    snapSession: snapSessionCount(spine),
    ethySession: ethySessionCount(spine),
    clientFamilies: clientFamilies(spine),
    avgLatencyMs: avgLatencyMs(spine),
    servedLatest: spine.serving?.latestBlock?.toString(),
    servedEarliest: spine.serving?.earliestBlock?.toString(),
  }
  const snap: SnapDomainSnapshot = {
    bucketsDone: snapBucketsDoneCount(spine.snapBuckets),
    bucketsSyncing: spine.snapBuckets.filter((b) => b.status === 'syncing').length,
    bucketsStalled: spine.snapBuckets.filter((b) => b.status === 'stalled').length,
    totalAccountsSynced: spine.totalAccountsSynced,
    accountsPerSec: spine.accountsPerSec,
    codesSynced: spine.codesSynced,
    codesTotal: spine.codesTotal,
    storageAccountsSynced: spine.storageAccountsSynced,
    storageAccountsTotal: spine.storageAccountsTotal,
    contractsPerSec: spine.contractsPerSec,
  }
  const latestBal = spine.balWindow[0]
  const head: HeadDomainSnapshot = {
    headBlockNumber: spine.headBlockNumber?.toString(),
    pivotBlockNumber: spine.pivotBlockNumber?.toString(),
    clStatus: spine.clStatus,
    balWindowBlocks: spine.balWindow.length,
    latestBalAccountCount: latestBal?.accountCount ?? 0,
  }
  return {
    pulse,
    economy: spine.economy ?? emptyEconomy(),
    p2p,
    snap,
    head,
  }
}
