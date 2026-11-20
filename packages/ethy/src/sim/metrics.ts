/** Integer-only KPI records (WP-11a). */

import type { ScenarioId } from './types.ts'

export type SimMetrics = {
  scenarioId: ScenarioId
  policy: 'legacy' | 'v2'
  seed: number
  virtualDays: number
  nodeCount: number
  snapSyncStarts: number
  ethySyncStarts: number
  snapMintersMax: number
  peakConcurrentSnapSyncs: number
  balGapIncidents: number
  gappedButStillUsable: number
  stalledNodeCount: number
  falseSyncedCount: number
  snapLockedAfterGrace: number
  snapJoinersTotal: number
  fakeMinterAssignments: number
  fallbackSingleSnapshot: number
  swarmAmplificationFactorTimes100: number
  bytesDownloaded: number
  bytesUploaded: number
  p95JoinTimeMs: number
  flashCrowdP95RatioTimes100: number
  generationCount: number
}

export function emptyMetrics(
  scenarioId: ScenarioId,
  policy: 'legacy' | 'v2',
  seed: number,
  nodeCount: number,
  virtualDays: number,
): SimMetrics {
  return {
    scenarioId,
    policy,
    seed,
    virtualDays,
    nodeCount,
    snapSyncStarts: 0,
    ethySyncStarts: 0,
    snapMintersMax: 0,
    peakConcurrentSnapSyncs: 0,
    balGapIncidents: 0,
    gappedButStillUsable: 0,
    stalledNodeCount: 0,
    falseSyncedCount: 0,
    snapLockedAfterGrace: 0,
    snapJoinersTotal: 0,
    fakeMinterAssignments: 0,
    fallbackSingleSnapshot: 0,
    swarmAmplificationFactorTimes100: 0,
    bytesDownloaded: 0,
    bytesUploaded: 0,
    p95JoinTimeMs: 0,
    flashCrowdP95RatioTimes100: 0,
    generationCount: 0,
  }
}

export function metricsToCanonicalJson(m: SimMetrics): string {
  return JSON.stringify(m)
}

export function p95(sortedMs: number[]): number {
  if (sortedMs.length === 0) return 0
  const idx = Math.min(sortedMs.length - 1, Math.floor(sortedMs.length * 0.95))
  return sortedMs[idx]!
}
