import { afterEach, describe, expect, it } from 'vitest'

import type { EconomySnapshot } from '../src/economy/types.ts'
import {
  ECONOMY_COCKPIT_REFRESH_MS,
  economyForCockpitDisplay,
  resetEconomyCockpitBuffer,
} from '../src/tui/economyCockpitBuffer.ts'

function snap(tps: number): EconomySnapshot {
  return {
    hasBlocks: true,
    hasTxBody: true,
    baseFeeGwei: '12',
    trend: 'flat',
    gasFullPct: 50,
    txCount: 100,
    tps,
    ethTransferredBlockEth: '1 ETH',
    activeAccounts: 10,
    storageWrites: 5,
    storageReads: 3,
    newDeployments: 0,
    topContracts: [],
    recentBlocks: [],
  }
}

describe('economyForCockpitDisplay', () => {
  afterEach(() => resetEconomyCockpitBuffer())

  it('passes through awaiting snapshot without caching', () => {
    const awaiting: EconomySnapshot = { hasBlocks: false, topContracts: [], recentBlocks: [] }
    expect(economyForCockpitDisplay(awaiting, 0)?.hasBlocks).toBe(false)
    expect(economyForCockpitDisplay(snap(1), 1000)?.tps).toBe(1)
  })

  it('holds values until refresh interval elapses', () => {
    const t0 = 1_000_000
    expect(economyForCockpitDisplay(snap(2.5), t0)?.tps).toBe(2.5)
    expect(economyForCockpitDisplay(snap(9.9), t0 + 100)?.tps).toBe(2.5)
    expect(economyForCockpitDisplay(snap(9.9), t0 + ECONOMY_COCKPIT_REFRESH_MS)?.tps).toBe(9.9)
  })
})
