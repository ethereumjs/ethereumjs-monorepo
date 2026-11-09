import { assert, describe, it } from 'vitest'

import { MAX_AI_OVERVIEW_CHARS, buildDeterministicOverview } from '../src/ai/overviewNarrator.ts'
import { readDomainSnapshots } from '../src/domains/domainManagers.ts'
import { createSpine, setPhase } from '../src/spine/createSpine.ts'

describe('[Ethy/AI]: overviewNarrator', () => {
  it('welcome overview mentions peers and stays within cap', () => {
    const spine = createSpine('sepolia', 11155111n)
    setPhase(spine, 'P2P_WARMUP')
    const text = buildDeterministicOverview(readDomainSnapshots(spine), 'welcome')
    assert.isAtMost(text.length, MAX_AI_OVERVIEW_CHARS)
    assert.match(text, /peer/i)
  })

  it('head-following overview mentions base fee when economy has blocks', () => {
    const spine = createSpine('sepolia', 11155111n)
    setPhase(spine, 'HEAD_FOLLOWING')
    spine.economy = {
      hasBlocks: true,
      hasTxBody: true,
      baseFeeGwei: '2.4',
      trend: 'up',
      gasFullPct: 50,
      tps: 9.8,
      txCount: 118,
      ethTransferredWindowEth: '42.1 ETH',
      topContracts: [
        {
          address: '0xabc',
          blocksActive: 3,
          storageWrites: 1,
          storageReads: 2,
          netEthDeltaWei: 0n,
        },
      ],
      recentBlocks: [],
    }
    const text = buildDeterministicOverview(readDomainSnapshots(spine), 'pulse')
    assert.isAtMost(text.length, MAX_AI_OVERVIEW_CHARS)
    assert.match(text, /base fee|Gwei/i)
  })
})
