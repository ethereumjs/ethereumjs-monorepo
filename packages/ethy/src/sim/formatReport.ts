import type { SimMetrics } from './metrics.ts'

export function formatMetricsTable(rows: SimMetrics[]): string {
  const header = [
    'scenario',
    'policy',
    'snap',
    'ethy',
    'snapMax',
    'peakSnap',
    'balGap',
    'stalled',
    'falseSync',
  ].join('\t')
  const lines = rows.map((m) =>
    [
      m.scenarioId,
      m.policy,
      m.snapSyncStarts,
      m.ethySyncStarts,
      m.snapMintersMax,
      m.peakConcurrentSnapSyncs,
      m.balGapIncidents,
      m.stalledNodeCount,
      m.falseSyncedCount,
    ].join('\t'),
  )
  return [header, ...lines].join('\n')
}

export function formatMetricsAscii(m: SimMetrics): string {
  return [
    `Scenario: ${m.scenarioId} (${m.policy}, seed=${m.seed})`,
    `  snap/ethy starts: ${m.snapSyncStarts} / ${m.ethySyncStarts}`,
    `  snap minters max: ${m.snapMintersMax}  peak concurrent SNAP: ${m.peakConcurrentSnapSyncs}`,
    `  bal gaps: ${m.balGapIncidents}  gapped usable: ${m.gappedButStillUsable}`,
    `  stalled: ${m.stalledNodeCount}  false-synced: ${m.falseSyncedCount}`,
  ].join('\n')
}
