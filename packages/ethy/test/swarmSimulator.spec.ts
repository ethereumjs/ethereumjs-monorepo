import { assert, describe, expect, it } from 'vitest'

import {
  ALL_CUSTODY_SCENARIO_IDS,
  assertCustodySwarmGates,
  custodyMetricsCanonicalJSON,
  runAllCustodySwarmScenarios,
} from '../src/sim/custodySwarm.ts'
import { assertLegacyScenarioGates } from '../src/sim/legacyGates.ts'
import { metricsToCanonicalJSON } from '../src/sim/metrics.ts'
import { createSeededRng } from '../src/sim/rng.ts'
import {
  ALL_SCENARIO_IDS,
  comparePresets,
  runAllScenarios,
  runScenario,
} from '../src/sim/runSim.ts'
import { assertV2ScenarioGates } from '../src/sim/v2Gates.ts'

describe('[Ethy/Sim]: ethy-sim swarm harness', () => {
  it('Mulberry32 is stable for a fixed seed', () => {
    const a = createSeededRng(42)
    const b = createSeededRng(42)
    const seqA = [a(), a(), a()]
    const seqB = [b(), b(), b()]
    assert.deepEqual(seqA, seqB)
  })

  it('all CI scenarios are deterministic JSON', () => {
    const first = runAllScenarios({ seed: 1, policy: 'legacy', scale: 'ci' })
    const second = runAllScenarios({ seed: 1, policy: 'legacy', scale: 'ci' })
    assert.equal(first.length, 10)
    for (let i = 0; i < first.length; i++) {
      assert.equal(metricsToCanonicalJSON(first[i]!), metricsToCanonicalJSON(second[i]!))
    }
  })

  it('legacy CI scenarios satisfy baseline gates', () => {
    const rows = runAllScenarios({ seed: 1, policy: 'legacy', scale: 'ci' })
    for (const row of rows) {
      assertLegacyScenarioGates(row)
    }
  })

  it('falseSyncedCount is always zero', () => {
    for (const id of ALL_SCENARIO_IDS) {
      const row = runScenario({ scenarioId: id, seed: 7, policy: 'legacy', scale: 'ci' })
      assert.equal(row.falseSyncedCount, 0)
    }
  })

  it('v2 CI scenarios satisfy WP-11b compact gates', () => {
    const rows = runAllScenarios({ seed: 1, policy: 'v2', scale: 'ci' })
    for (const row of rows) {
      assertV2ScenarioGates(row)
    }
  })

  it('v2 reduces SNAP stampede vs legacy on thundering herd', () => {
    const cmp = comparePresets({
      scenarioId: 'thundering-herd-age-cliff',
      seed: 1,
      scale: 'ci',
    })
    expect(cmp.legacy.snapMintersMax).toBeGreaterThan(cmp.v2.snapMintersMax)
    expect(cmp.v2.snapMintersMax).toBeLessThanOrEqual(2)
    expect(cmp.v2.falseSyncedCount).toBe(0)
  })

  it('WP-16g custody swarm gates are deterministic', () => {
    const first = runAllCustodySwarmScenarios(1)
    const second = runAllCustodySwarmScenarios(1)
    assert.equal(first.length, ALL_CUSTODY_SCENARIO_IDS.length)
    for (let i = 0; i < first.length; i++) {
      assert.equal(custodyMetricsCanonicalJSON(first[i]!), custodyMetricsCanonicalJSON(second[i]!))
      assertCustodySwarmGates(first[i]!)
    }
  })

  it('500x7 demo thundering herd under 3s wall time', () => {
    const t0 = Date.now()
    runScenario({
      scenarioId: 'thundering-herd-age-cliff',
      seed: 42,
      policy: 'legacy',
      scale: 'demo',
    })
    assert.isBelow(Date.now() - t0, 3000)
  })
})
