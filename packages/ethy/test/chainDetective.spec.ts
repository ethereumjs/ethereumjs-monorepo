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

  it('waits for an aborted in-flight cycle during triggerNow without marking unhealthy and infers rich tier from transport.modelName', async () => {
    const chain = Mainnet
    const hardfork = Hardfork.Cancun
    const common = new Common({ chain, hardfork })
    const stateManager = createFlatStateManager({ common })
    const spine = createSpine('mainnet', 1n)
    spine.aiMode = 'local'
    spine.economy = {
      hasBlocks: true,
      latestBlockNumber: '101',
      topContracts: [],
      recentBlocks: [],
      signals: [sampleSignal],
    }

    let calls = 0
    const seenTiers: Array<string | undefined> = []
    let releaseFirst: (() => void) | undefined
    const transport = {
      modelName: 'qwen2.5:14b',
      async complete(
        req: { overrides?: { modelTier?: string } },
        signal?: AbortSignal,
      ): Promise<string> {
        calls += 1
        seenTiers.push(req.overrides?.modelTier)
        if (calls === 1) {
          await new Promise<void>((resolve, reject) => {
            releaseFirst = resolve
            signal?.addEventListener('abort', () => reject(new Error('aborted')), { once: true })
          })
        }
        if (calls === 2) {
          return JSON.stringify({ mode: 'tell_story', focus: 'fresh lens' })
        }
        return `HEADLINE: Manual fresh story
STORY: Fresh narrative after aborting an in-flight pulse.
ANGLE: EIP-4844 split blob fees from execution fees.
CURIOSITY: What changes when demand spikes?`
      },
    }

    const economy = new ETHEconomyDataManager({ spine, chain, hardfork, stateManager })
    const journal = new InvestigationJournal()
    const userInterest = new UserInterestRing()
    let unhealthyCount = 0
    const narrator = new ChainDetectiveNarrator({
      transport,
      economy,
      stateManager,
      chain,
      journal,
      userInterest,
      onOverview: () => {},
      onUnhealthy: () => {
        unhealthyCount += 1
      },
    })
    narrator.start(spine)
    await new Promise((r) => setTimeout(r, 15))
    await narrator.triggerNow('security')
    releaseFirst?.()
    narrator.stop()

    expect(unhealthyCount).toBe(0)
    expect(seenTiers).toContain('rich')
    expect(journal.latest()?.headline).toContain('Manual fresh story')
    expect(journal.latest()?.lens).toBe('security')
    expect(journal.latest()?.modelLabel).toBe('qwen2.5:14b')
  })
})
