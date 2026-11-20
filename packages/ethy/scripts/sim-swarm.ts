import process from 'node:process'

import { formatMetricsAscii, formatMetricsTable } from '../src/sim/formatReport.ts'
import { metricsToCanonicalJson, runAllScenarios, runScenario, comparePresets, ALL_SCENARIO_IDS } from '../src/sim/runSim.ts'
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
  const resolvedScale: SimScale =
    hasFlag('scale') && (parseArg('scale') ?? 'ci') === 'ci' ? 'ci' : hasFlag('scale') ? 'ci' : 'demo'

  if (hasFlag('compare')) {
    const id = (parseArg('scenario') ?? 'thundering-herd-age-cliff') as ScenarioId
    const cmp = comparePresets({ scenarioId: id, seed, scale: resolvedScale })
    process.stdout.write(`${formatMetricsAscii(cmp.legacy)}\n---\n${formatMetricsAscii(cmp.v2)}\n${cmp.deltaJson}\n`)
    return
  }

  if (scenario === 'all') {
    const rows = runAllScenarios({ seed, policy, scale: resolvedScale })
    if (hasFlag('json')) {
      process.stdout.write(`${rows.map((r) => metricsToCanonicalJson(r)).join('\n')}\n`)
    } else {
      process.stdout.write(`${formatMetricsTable(rows)}\n`)
    }
    if (resolvedScale === 'ci') {
      for (const r of rows) {
        if (policy === 'legacy') assertLegacyScenarioGates(r)
        else assertV2ScenarioGates(r)
      }
    }
    return
  }

  if (!ALL_SCENARIO_IDS.includes(scenario)) {
    process.stderr.write(`Unknown scenario: ${scenario}\n`)
    process.exit(1)
  }
  const row = runScenario({ scenarioId: scenario, seed, policy, scale: resolvedScale })
  if (hasFlag('json')) {
    process.stdout.write(`${metricsToCanonicalJson(row)}\n`)
  } else {
    process.stdout.write(`${formatMetricsAscii(row)}\n`)
  }
  if (resolvedScale === 'ci') {
    if (policy === 'legacy') assertLegacyScenarioGates(row)
    else assertV2ScenarioGates(row)
  }
}

main()