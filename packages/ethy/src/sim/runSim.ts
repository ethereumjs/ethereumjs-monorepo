import { type SimMetrics, metricsToCanonicalJson } from './metrics.ts'
import { ALL_SCENARIO_IDS, resolveScenarioParams } from './scenarios.ts'
import type { PolicyPreset, ScenarioId, SimScale } from './types.ts'
import { runSimulation } from './world.ts'

export function runScenario(opts: {
  scenarioId: ScenarioId
  seed: number
  policy: PolicyPreset
  scale: SimScale
}): SimMetrics {
  const params = resolveScenarioParams(opts.scenarioId, opts.scale)
  return runSimulation({
    scenarioId: opts.scenarioId,
    seed: opts.seed,
    policy: opts.policy,
    params,
  })
}

export function runAllScenarios(opts: {
  seed: number
  policy: PolicyPreset
  scale: SimScale
}): SimMetrics[] {
  return ALL_SCENARIO_IDS.map((id) =>
    runScenario({ scenarioId: id, seed: opts.seed, policy: opts.policy, scale: opts.scale }),
  )
}

export function comparePresets(opts: {
  scenarioId: ScenarioId
  seed: number
  scale: SimScale
}): { legacy: SimMetrics; v2: SimMetrics; deltaJson: string } {
  const legacy = runScenario({ ...opts, policy: 'legacy' })
  const v2 = runScenario({ ...opts, policy: 'v2' })
  const delta = {
    snapSyncStarts: v2.snapSyncStarts - legacy.snapSyncStarts,
    ethySyncStarts: v2.ethySyncStarts - legacy.ethySyncStarts,
    balGapIncidents: v2.balGapIncidents - legacy.balGapIncidents,
    falseSyncedCount: v2.falseSyncedCount - legacy.falseSyncedCount,
  }
  return { legacy, v2, deltaJson: JSON.stringify(delta) }
}

export { metricsToCanonicalJson, ALL_SCENARIO_IDS }
