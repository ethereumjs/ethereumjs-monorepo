import process from 'node:process'

import {
  assertCustodySwarmGates,
  custodyMetricsCanonicalJSON,
  runAllCustodySwarmScenarios,
} from '../src/sim/custodySwarm.ts'
import { formatMetricsAscii, formatMetricsTable } from '../src/sim/formatReport.ts'
import { metricsToCanonicalJSON, runAllScenarios, runScenario, comparePresets, ALL_SCENARIO_IDS } from '../src/sim/runSim.ts'
import type { PolicyPreset, ScenarioId, SimScale } from '../src/sim/types.ts'
import { assertLegacyScenarioGates } from '../src/sim/legacyGates.ts'
import { assertV2ScenarioGates } from '../src/sim/v2Gates.ts'

function parseArg(name: string): string | undefined {
  const i = process.argv.indexOf(`--${name}`)
  if (i < 0 || i + 1 >= process.argv.length) return undefined
  return process.argv[i + 1]
}

function hasFlag(name: string): boolean {
  return process.argv.includes(`--${name}`)
}

function main(): void {
  const scenario = (parseArg('scenario') ?? 'all') as ScenarioId | 'all'
  const seed = Number.parseInt(parseArg('seed') ?? '1', 10)
  const policy = (parseArg('policy') ?? 'legacy') as PolicyPreset
  const scaleRaw = parseArg('scale')
  if (scaleRaw !== undefined && scaleRaw !== 'ci' && scaleRaw !== 'demo') {
    process.stderr.write(`Unknown scale: ${scaleRaw} (expected ci or demo)\n`)
    process.exit(1)
  }
  const resolvedScale: SimScale = (scaleRaw ?? 'demo') as SimScale

  if (hasFlag('compare')) {
    const ids: ScenarioId[] =
      scenario === 'all'
        ? ALL_SCENARIO_IDS
        : ALL_SCENARIO_IDS.includes(scenario)
          ? [scenario]
          : (() => {
              process.stderr.write(`Unknown scenario: ${scenario}\n`)
              process.exit(1)
            })()
    for (const id of ids) {
      const cmp = comparePresets({ scenarioId: id, seed, scale: resolvedScale })
      if (hasFlag('json')) {
        process.stdout.write(
          `${JSON.stringify({ scenarioId: id, legacy: cmp.legacy, v2: cmp.v2, delta: JSON.parse(cmp.deltaJSON) })}\n`,
        )
      } else {
        process.stdout.write(
          `${formatMetricsAscii(cmp.legacy)}\n---\n${formatMetricsAscii(cmp.v2)}\n${cmp.deltaJSON}\n\n`,
        )
      }
      if (resolvedScale === 'ci') {
        assertLegacyScenarioGates(cmp.legacy)
        assertV2ScenarioGates(cmp.v2)
      }
    }
    return
  }

  if (scenario === 'all') {
    const rows = runAllScenarios({ seed, policy, scale: resolvedScale })
    if (hasFlag('json')) {
      process.stdout.write(`${rows.map((r) => metricsToCanonicalJSON(r)).join('\n')}\n`)
    } else {
      process.stdout.write(`${formatMetricsTable(rows)}\n`)
    }
    if (resolvedScale === 'ci') {
      for (const r of rows) {
        if (policy === 'legacy') assertLegacyScenarioGates(r)
        else assertV2ScenarioGates(r)
      }
    }
    const custodyRows = runAllCustodySwarmScenarios(seed)
    if (hasFlag('json')) {
      process.stdout.write(`${custodyRows.map((r) => custodyMetricsCanonicalJSON(r)).join('\n')}\n`)
    } else {
      process.stdout.write('\n=== WP-16g Unified Custody Swarm Gates ===\n')
      for (const r of custodyRows) {
        process.stdout.write(
          `${r.scenarioId}: nodes=${r.nodeCount} maxPeers=${r.maxConnectedPeers} snapDials=${r.snapDials} hop16=${r.allHopSixteen} minRed2=${r.minRedundancyOk} coldEthy=${r.coldEthyResolutions} fail=${r.coldFailures} rootOk=${r.rootAssemblyOk} byz=${r.byzantineQuarantined} gens=${r.generationsRefreshed}\n`,
        )
      }
    }
    if (resolvedScale === 'ci') {
      for (const r of custodyRows) assertCustodySwarmGates(r)
    }
    return
  }

  if (!ALL_SCENARIO_IDS.includes(scenario)) {
    process.stderr.write(`Unknown scenario: ${scenario}\n`)
    process.exit(1)
  }
  const row = runScenario({ scenarioId: scenario, seed, policy, scale: resolvedScale })
  if (hasFlag('json')) {
    process.stdout.write(`${metricsToCanonicalJSON(row)}\n`)
  } else {
    process.stdout.write(`${formatMetricsAscii(row)}\n`)
  }
  if (resolvedScale === 'ci') {
    if (policy === 'legacy') assertLegacyScenarioGates(row)
    else assertV2ScenarioGates(row)
  }
}

main()