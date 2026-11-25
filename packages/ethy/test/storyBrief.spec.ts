import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { createFlatStateManager } from '@ethereumjs/statemanager'
import { describe, expect, it } from 'vitest'

import { buildStoryBrief } from '../src/ai/storyBrief.ts'
import { ETHEconomyDataManager } from '../src/economy/economyDataManager.ts'
import type { BlockMoment } from '../src/economy/types.ts'
import { createSpine } from '../src/spine/createSpine.ts'

describe('storyBrief', () => {
  it('returns undefined when economy has no blocks', () => {
    const spine = createSpine('mainnet', 1n)
    spine.economy = { hasBlocks: false, topContracts: [], recentBlocks: [] }
    const chain = Mainnet
    const economy = new ETHEconomyDataManager({
      spine,
      chain,
      hardfork: Hardfork.Cancun,
      stateManager: createFlatStateManager({
        common: new Common({ chain, hardfork: Hardfork.Cancun }),
      }),
    })
    expect(buildStoryBrief(spine, economy, 'compact')).toBeUndefined()
  })

  it('formats head metrics in human units and sets network and hardfork', () => {
    const spine = createSpine('sepolia', 11155111n)
    const moment: BlockMoment = {
      id: 'm1',
      kind: 'birth',
      blockNumber: '99',
      headline: 'New contract',
      timestampSec: 1,
      badge: ' birth',
    }
    spine.economy = {
      hasBlocks: true,
      latestBlockNumber: '100',
      baseFeeGwei: '12.3',
      blobBaseFeeGwei: '0.4 Gwei',
      signals: [],
      moments: [moment],
      topContracts: [],
      recentBlocks: [],
      macroBaseline: { bucketCount: 3, avgBaseFeeWei: 1_500_000_000n, avgBlobBaseFeeWei: 100n },
    }
    const chain = Mainnet
    const common = new Common({ chain, hardfork: Hardfork.Cancun })
    const economy = new ETHEconomyDataManager({
      spine,
      chain,
      hardfork: Hardfork.Cancun,
      stateManager: createFlatStateManager({ common }),
    })
    const brief = buildStoryBrief(spine, economy, 'compact')
    expect(brief?.network).toBe('sepolia')
    expect(brief?.hardfork).toBe(Hardfork.Cancun)
    expect(brief?.head.baseFeeGwei).toBe('12.3')
    expect(brief?.moments[0]?.kind).toBe('birth')
    const json = JSON.stringify(brief)
    expect(json).not.toMatch(/1500000000n/)
    expect(json).toMatch(/avgBaseFeeGwei/)
  })
})
