import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { createFlatStateManager } from '@ethereumjs/statemanager'
import { describe, expect, it } from 'vitest'

import {
  ChainDetectiveNarrator,
  noveltyShouldSkip,
  parseDetectiveTriage,
  signalToDispatchCard,
} from '../src/ai/chainDetective.ts'
import { FixtureReplayTransport } from '../src/ai/fixtureEngine.ts'
import { InvestigationJournal, UserInterestRing } from '../src/ai/investigationJournal.ts'
import { buildSignalDigest, digestForPrompt } from '../src/ai/signalDigest.ts'
import { ETHEconomyDataManager } from '../src/economy/economyDataManager.ts'
import type { SignalCandidate } from '../src/economy/types.ts'
import { createSpine } from '../src/spine/createSpine.ts'
import type { AiOverviewSections } from '../src/spine/types.ts'

const sampleSignal: SignalCandidate = {
  id: 't1',
  kind: 'delegation_surge',
  severity: 'surge',
  noveltyScore: 80,
  headline: 'Delegation wave',
  metrics: {},
  windowBlocks: 8,
}

describe('noveltyShouldSkip', () => {
  it('skips quiet stretches', () => {
    expect(
      noveltyShouldSkip({
        blocksSinceLast: 1,
        topScore: 10,
        msSinceLast: 10_000,
        userFocusBump: false,
      }),
    ).toBe(true)
    expect(
      noveltyShouldSkip({
        blocksSinceLast: 5,
        topScore: 20,
        msSinceLast: 50_000,
        userFocusBump: false,
      }),
    ).toBe(true)
    expect(
      noveltyShouldSkip({
        blocksSinceLast: 5,
        topScore: 80,
        msSinceLast: 50_000,
        userFocusBump: false,
      }),
    ).toBe(false)
  })
})

describe('parseDetectiveTriage', () => {
  it('parses investigate and dispatch JSON', () => {
    const inv = parseDetectiveTriage({
      mode: 'investigate',
      calls: [{ tool: 'inspect_l2_blobs', args: {} }],
    })
    expect(inv?.mode).toBe('investigate')
    const disp = parseDetectiveTriage({
      mode: 'dispatch',
      category: 'l2',
      severity: 'notable',
      headline: 'Blob spend climbing',
      body: 'Base inbox leads blob count in the macro window.',
    })
    expect(disp?.mode).toBe('dispatch')
    const tell = parseDetectiveTriage({ mode: 'tell_story', focus: 'quiet blocks' })
    expect(tell?.mode).toBe('tell_story')
  })
})

describe('signalToDispatchCard', () => {
  it('marks deterministic SIGNAL dispatches', () => {
    const card = signalToDispatchCard(sampleSignal, 1_000)
    expect(card.deterministic).toBe(true)
    expect(card.category).toBe('7702')
    expect(card.body).not.toMatch(/Layer 1 signal/)
  })
})

describe('UserInterestRing', () => {
  it('stores at most 3 NL prompts', () => {
    const ring = new UserInterestRing()
    ring.notePrompt('one')
    ring.notePrompt('two')
    ring.notePrompt('three')
    ring.notePrompt('four')
    expect(ring.snapshot()).toEqual(['four', 'three', 'two'])
  })

  it('omits slash commands', () => {
    const ring = new UserInterestRing()
    ring.notePrompt('/peers')
    expect(ring.snapshot()).toEqual([])
  })
})

describe('ChainDetectiveNarrator end-to-end replay', () => {
  it('serializes bigint macroBaseline/L2 stats safely and never duplicates the newest card', async () => {
    const chain = Mainnet
    const hardfork = Hardfork.Cancun
    const common = new Common({ chain, hardfork })
    const stateManager = createFlatStateManager({ common })
    const spine = createSpine('mainnet', 1n)
    spine.aiMode = 'local'
    spine.economy = {
      hasBlocks: true,
      latestBlockNumber: '100',
      topContracts: [],
      recentBlocks: [],
      signals: [sampleSignal],
      macroBaseline: {
        bucketCount: 4,
        avgBaseFeeWei: 1_500_000_000n,
        avgBlobBaseFeeWei: 100n,
      },
      l2RollupStats: [
        {
          inbox: '0xff00000000000000000000000000000000008453',
          displayName: 'Base Batcher',
          blobCount: 8,
          estimatedEthWei: 500_000n,
        },
      ],
    }

    const digest = buildSignalDigest(spine.economy)!
    expect(() => digestForPrompt(digest)).not.toThrow()

    const transport = new FixtureReplayTransport([
      JSON.stringify({
        mode: 'investigate',
        calls: [{ tool: 'inspect_l2_blobs', args: {} }],
      }),
      `HEADLINE: Base batch pressure climbs
STORY: Base Batcher posted 8 blobs while blob fees trend up.
ANGLE: EIP-4844 split blob demand from execution gas in 2024.
CURIOSITY: Will blob fees cool if batching pauses?
COMMAND: /signals`,
    ])
    const economy = new ETHEconomyDataManager({ spine, chain, hardfork, stateManager })
    const journal = new InvestigationJournal()
    const userInterest = new UserInterestRing()
    const updates: AiOverviewSections[] = []
    const narrator = new ChainDetectiveNarrator({
      transport,
      economy,
      stateManager,
      chain,
      journal,
      userInterest,
      onOverview: (s) => updates.push(s),
    })
    narrator.start(spine)
    await new Promise((r) => setTimeout(r, 50))
    narrator.stop()

    const last = updates[updates.length - 1]
    expect(last?.dispatches?.length).toBe(1)
    expect(last?.dispatches?.[0]?.headline).toContain('Base batch')
  })
})
