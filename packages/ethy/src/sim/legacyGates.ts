import type { SimMetrics } from './metrics.ts'
import type { ScenarioId } from './types.ts'

/** CI baseline gates — legacy failure modes (WP-11a), not WP-11b green targets. */
export function assertLegacyScenarioGates(m: SimMetrics): void {
  switch (m.scenarioId as ScenarioId) {
    case 'thundering-herd-age-cliff':
      if (m.snapMintersMax < 12) {
        throw new Error(`thundering-herd: snapMintersMax ${m.snapMintersMax} < 12`)
      }
      if (m.peakConcurrentSnapSyncs < 4) {
        throw new Error(`thundering-herd: peakConcurrentSnapSyncs ${m.peakConcurrentSnapSyncs} < 4`)
      }
      break
    case 'laptop-every-3-days':
      if (m.balGapIncidents < 1) {
        throw new Error(`laptop: balGapIncidents ${m.balGapIncidents} < 1`)
      }
      if (m.gappedButStillUsable < 1) {
        throw new Error(`laptop: gappedButStillUsable ${m.gappedButStillUsable} < 1`)
      }
      break
    case 'flash-crowd-launch':
      if (m.flashCrowdP95RatioTimes100 < 160) {
        throw new Error(`flash-crowd: p95 ratio*100 ${m.flashCrowdP95RatioTimes100} < 160`)
      }
      break
    case 'low-density-dht-bootstrap':
      if (m.snapJoinersTotal < 12) {
        throw new Error(`low-density: snapJoinersTotal ${m.snapJoinersTotal} < 12`)
      }
      break
    case 'minter-crash-failover':
      if (m.stalledNodeCount < 1) {
        throw new Error(`minter-crash: stalledNodeCount ${m.stalledNodeCount} < 1`)
      }
      if (m.falseSyncedCount !== 0) {
        throw new Error('minter-crash: falseSyncedCount must be 0')
      }
      break
    case 'fake-minter-suppression':
      if (m.fakeMinterAssignments > 0) {
        throw new Error('fake-minter: assignments to fakes must be 0')
      }
      if (m.snapSyncStarts < Math.floor(m.nodeCount * 0.8)) {
        throw new Error(`fake-minter: snap starts ${m.snapSyncStarts} below 80% joiners`)
      }
      break
    case 'cross-snapshot-churn':
      if (m.fallbackSingleSnapshot < 1) {
        throw new Error('cross-snapshot: expected fallbackSingleSnapshot')
      }
      if (m.falseSyncedCount !== 0) {
        throw new Error('cross-snapshot: falseSyncedCount must be 0')
      }
      break
    case 'total-swarm-hibernation':
      if (m.snapSyncStarts !== m.nodeCount) {
        throw new Error(
          `hibernation: snapSyncStarts ${m.snapSyncStarts} !== nodeCount ${m.nodeCount}`,
        )
      }
      if (m.falseSyncedCount !== 0) {
        throw new Error('hibernation: falseSyncedCount must be 0')
      }
      break
    case 'seeder-bandwidth-cap':
      if (m.swarmAmplificationFactorTimes100 >= 250) {
        throw new Error(
          `bandwidth-cap: amplification*100 ${m.swarmAmplificationFactorTimes100} >= 250`,
        )
      }
      if (m.bytesDownloaded < m.bytesUploaded) {
        throw new Error('bandwidth-cap: byte conservation violated')
      }
      break
    case 'long-horizon-soak':
      if (m.falseSyncedCount !== 0) {
        throw new Error('soak: falseSyncedCount must be 0')
      }
      if (m.generationCount < 1) {
        throw new Error('soak: expected generationCount >= 1')
      }
      break
    default:
      break
  }
}
