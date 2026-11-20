import type { SimMetrics } from './metrics.ts'
import type { ScenarioId } from './types.ts'

/**
 * WP-11b `v2` CI regression gates (compact scale).
 * Demo-scale thresholds are stricter — see WP-11b §2.7.
 */
export function assertV2ScenarioGates(m: SimMetrics): void {
  const total = m.ethySyncStarts + m.snapSyncStarts
  const offload =
    total > 0 ? Math.floor((m.ethySyncStarts * 100) / total) : m.snapOffloadRatioTimes100

  switch (m.scenarioId as ScenarioId) {
    case 'thundering-herd-age-cliff':
      if (m.snapMintersMax > 2) {
        throw new Error(`v2 thundering-herd: snapMintersMax ${m.snapMintersMax} > 2`)
      }
      if (m.peakConcurrentSnapSyncs > 4) {
        throw new Error(
          `v2 thundering-herd: peakConcurrentSnapSyncs ${m.peakConcurrentSnapSyncs} > 4`,
        )
      }
      if (offload < 95 && total > 0) {
        throw new Error(`v2 thundering-herd: snapOffload insufficient (${offload}% ethy)`)
      }
      break
    case 'laptop-every-3-days':
      if (m.balGapIncidents !== 0) {
        throw new Error(`v2 laptop: balGapIncidents ${m.balGapIncidents} !== 0`)
      }
      if (m.stalledNodeCount !== 0) {
        throw new Error(`v2 laptop: stalledNodeCount ${m.stalledNodeCount} !== 0`)
      }
      if (m.servingContinuityRateTimes100 < 98) {
        throw new Error(
          `v2 laptop: servingContinuityRate*100 ${m.servingContinuityRateTimes100} < 98`,
        )
      }
      break
    case 'flash-crowd-launch':
      if (m.swarmAmplificationFactorTimes100 < 200) {
        throw new Error(
          `v2 flash-crowd: amplification*100 ${m.swarmAmplificationFactorTimes100} < 200`,
        )
      }
      break
    case 'low-density-dht-bootstrap':
      if (offload < 85 && total > 0) {
        throw new Error(`v2 low-density: ethy offload ${offload}% < 85`)
      }
      break
    case 'minter-crash-failover':
    case 'fake-minter-suppression':
      if (m.stalledNodeCount !== 0) {
        throw new Error(`v2 ${m.scenarioId}: stalledNodeCount must be 0`)
      }
      break
    case 'cross-snapshot-churn':
    case 'total-swarm-hibernation':
    case 'seeder-bandwidth-cap':
    case 'long-horizon-soak':
      if (m.falseSyncedCount !== 0) {
        throw new Error(`v2 ${m.scenarioId}: falseSyncedCount must be 0`)
      }
      if (m.p95BalTailBlocks > 4096) {
        throw new Error(`v2 ${m.scenarioId}: p95BalTailBlocks ${m.p95BalTailBlocks} > 4096`)
      }
      break
    default:
      break
  }
}
