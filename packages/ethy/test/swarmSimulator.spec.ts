import { assert, describe, expect, it } from 'vitest'

import { assertLegacyScenarioGates } from '../src/sim/legacyGates.ts'
import { metricsToCanonicalJson } from '../src/sim/metrics.ts'
import { createSeededRng } from '../src/sim/rng.ts'
import {
  ALL_SCENARIO_IDS,
  comparePresets,
  runAllScenarios,
  runScenario,
} from '../src/sim/runSim.ts'

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
      assert.equal(metricsToCanonicalJson(first[i]!), metricsToCanonicalJson(second[i]!))
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

  it('v2 differs from legacy only where WP-11b applies (thundering herd)', () => {
    const cmp = comparePresets({
      scenarioId: 'thundering-herd-age-cliff',
      seed: 1,
      scale: 'ci',
    })
    expect(cmp.legacy.snapSyncStarts).toBeGreaterThan(0)
    expect(cmp.v2.falseSyncedCount).toBe(0)
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
