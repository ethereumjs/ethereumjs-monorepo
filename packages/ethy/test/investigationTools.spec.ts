import { describe, expect, it } from 'vitest'

import { Hardfork, Mainnet } from '@ethereumjs/common'
import { Common } from '@ethereumjs/common'
import { createFlatStateManager } from '@ethereumjs/statemanager'
import { runInvestigationTool } from '../src/ai/investigationTools.ts'
import { ETHEconomyDataManager } from '../src/economy/economyDataManager.ts'
import { createSpine } from '../src/spine/createSpine.ts'

describe('investigationTools', () => {
  it('rejects non-whitelisted probe fn', () => {
    const spine = createSpine('sepolia', 11155111n)
    const chain = Mainnet
    const common = new Common({ chain, hardfork: Hardfork.Cancun })
    const stateManager = createFlatStateManager({ common })
    const economy = new ETHEconomyDataManager({
      spine,
      chain,
      hardfork: Hardfork.Cancun,
      stateManager,
    })
    const raw = runInvestigationTool(
      'probe_contract_view',
      { address: '0x00000000000000000000000000000000000000aa', fn: 'transfer' },
      { economy, stateManager, chain, spine },
    )
    const obj = JSON.parse(raw) as { error?: string }
    expect(obj.error).toBe('fn_not_whitelisted')
  })

  it('caps JSON output size', () => {
    const spine = createSpine('sepolia', 11155111n)
    const chain = Mainnet
    const common = new Common({ chain, hardfork: Hardfork.Cancun })
    const stateManager = createFlatStateManager({ common })
    const economy = new ETHEconomyDataManager({
      spine,
      chain,
      hardfork: Hardfork.Cancun,
      stateManager,
    })
    const raw = runInvestigationTool(
      'inspect_l2_blobs',
      {},
      { economy, stateManager, chain, spine },
    )
    expect(raw.length).toBeLessThan(2000)
  })
})
