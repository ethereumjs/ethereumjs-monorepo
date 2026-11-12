import { assert, describe, it } from 'vitest'

import {
  MAX_AI_TOTAL_CHARS,
  buildDeterministicOverviewSections,
} from '../src/ai/overviewNarrator.ts'
import { readDomainSnapshots } from '../src/domains/domainManagers.ts'
import { createSpine, setPhase } from '../src/spine/createSpine.ts'

function sectionCharTotal(sections: ReturnType<typeof buildDeterministicOverviewSections>): number {
  return (
    (sections.state?.length ?? 0) + (sections.economy?.length ?? 0) + (sections.p2p?.length ?? 0)
  )
}

describe('[Ethy/AI]: overviewNarrator', () => {
  it('welcome overview mentions peers and stays within cap', () => {
    const spine = createSpine('sepolia', 11155111n)
    setPhase(spine, 'P2P_WARMUP')
    const sections = buildDeterministicOverviewSections(readDomainSnapshots(spine), 'welcome')
    assert.isAtMost(sectionCharTotal(sections), MAX_AI_TOTAL_CHARS)
    assert.match(sections.p2p ?? sections.state ?? '', /peer/i)
    assert.isUndefined(sections.economy)
  })

  it('head-following overview mentions base fee when economy has blocks', () => {
    const spine = createSpine('sepolia', 11155111n)
    setPhase(spine, 'HEAD_FOLLOWING')
    for (const b of spine.snapBuckets) b.status = 'done'
    spine.codesSynced = 713_700
    spine.codesTotal = 751_500
    spine.economy = {
      hasBlocks: true,
      hasTxBody: true,
      baseFeeGwei: '2.4',
      trend: 'up',
      gasFullPct: 50,
      tps: 9.8,
      txCount: 118,
      ethTransferredWindowEth: '42.1 ETH',
      latestBlockNumber: '12117924',
      topContracts: [
        {
          address: '0xbe2212345678901234567890abcdefe054',
          blocksActive: 3,
          storageWrites: 1,
          storageReads: 2,
          netEthDeltaWei: 0n,
          archetype: 'EIP-1967 Proxy',
          proxyKind: 'EIP-1967',
        },
      ],
      recentBlocks: [
        { blockNumber: '1', baseFeeGwei: '1', gasFullPct: 1, txCount: 1, ethTransferredEth: '0' },
      ],
    }
    const sections = buildDeterministicOverviewSections(readDomainSnapshots(spine), 'pulse')
    assert.isAtMost(sectionCharTotal(sections), MAX_AI_TOTAL_CHARS)
    assert.match(sections.economy ?? '', /base fee|Gwei/i)
    assert.notInclude(sections.economy ?? '', 'ETH ETH')
    assert.notInclude(sections.state ?? '', 'sync complete')
    assert.include(sections.state ?? '', '12117924')
    assert.include(sections.economy ?? '', '[EIP-1967 Proxy]')
  })

  it('snap-syncing overview narrates bytecode and storage when 16/16 buckets are done', () => {
    const spine = createSpine('sepolia', 11155111n)
    setPhase(spine, 'SNAP_SYNCING')
    for (const b of spine.snapBuckets) b.status = 'done'
    spine.codesSynced = 713_700
    spine.codesTotal = 751_500
    spine.storageAccountsSynced = 36_300
    spine.storageAccountsTotal = 57_700
    spine.storageEtaMinutes = 7
    const sections = buildDeterministicOverviewSections(readDomainSnapshots(spine), 'pulse')
    assert.isAtMost(sectionCharTotal(sections), MAX_AI_TOTAL_CHARS)
    assert.include(sections.state ?? '', 'Accounts 16/16 complete')
    assert.include(sections.state ?? '', '713,700/751,500')
    assert.include(sections.state ?? '', 'ETA ~7m')
  })
})
