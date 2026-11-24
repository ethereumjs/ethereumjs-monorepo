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
import { formatHumanCallPreview, renderPromptFacts } from '../src/ai/forensicDossierBuilder.ts'
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

    const transport = Object.assign(
      new FixtureReplayTransport([
        JSON.stringify({
          mode: 'investigate',
          calls: [{ tool: 'inspect_l2_blobs', args: {} }],
        }),
        `HEADLINE: Base batch pressure climbs
STORY: Base Batcher posted 8 blobs while blob fees trend up.
ANGLE: EIP-4844 split blob demand from execution gas in 2024.
CURIOSITY: Will blob fees cool if batching pauses?
COMMAND: /signals`,
      ]),
      { modelName: 'qwen2.5:14b' },
    )
    const economy = new ETHEconomyDataManager({ spine, chain, hardfork, stateManager })
    const journal = new InvestigationJournal()
    const userInterest = new UserInterestRing()
    const updates: AiOverviewSections[] = []
    const narrator = new ChainDetectiveNarrator({
      transport,
      economy,
      stateManager,
      chain,
      network: 'mainnet',
      journal,
      userInterest,
      onOverview: (s) => updates.push(s),
    })
    narrator.start(spine)
    await new Promise((r) => setTimeout(r, 250))
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
      network: 'mainnet',
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

  it('sends clean plain-English facts without dossier/dice/candidate leaks and rejects invented slash commands', async () => {
    const chain = Mainnet
    const hardfork = Hardfork.Cancun
    const common = new Common({ chain, hardfork })
    const stateManager = createFlatStateManager({ common })
    const spine = createSpine('mainnet', 1n)
    spine.aiMode = 'local'
    const targetAddr = '0x000000000000000000000000000000000000abcd'
    spine.economy = {
      hasBlocks: true,
      latestBlockNumber: '102',
      topContracts: [],
      recentBlocks: [],
      signals: [{ ...sampleSignal, address: targetAddr }],
    }

    const capturedPrompts: Array<{ system: string; user: string }> = []
    const transport = {
      modelName: 'qwen3.5-2b',
      async complete(req: { messages: Array<{ role: string; content: string }> }): Promise<string> {
        const system = req.messages.find((m) => m.role === 'system')?.content ?? ''
        const user = req.messages.find((m) => m.role === 'user')?.content ?? ''
        capturedPrompts.push({ system, user })
        return `HEADLINE: Delegation wave on mainnet
STORY: A delegation burst just hit ${targetAddr} on block #102.
HYPOTHESIS: One plausible reading is an automated wallet rollout.
POINTER: Inspect the address code.
COMMAND: /call_pattern 0xdeadbeef`
      },
    }

    const economy = new ETHEconomyDataManager({ spine, chain, hardfork, stateManager })
    const journal = new InvestigationJournal()
    const userInterest = new UserInterestRing()
    const narrator = new ChainDetectiveNarrator({
      transport,
      economy,
      stateManager,
      chain,
      network: 'mainnet',
      journal,
      userInterest,
      onOverview: () => {},
    })
    narrator.start(spine)
    await new Promise((r) => setTimeout(r, 150))
    narrator.stop()

    expect(capturedPrompts.length).toBe(1)
    const { user } = capturedPrompts[0]!
    expect(user).not.toMatch(/\bdossier\b/i)
    expect(user).not.toContain('diceRoll')
    expect(user).not.toContain('beatCandidates')
    expect(user).toContain('Observation:')
    // Invented /call_pattern command must be replaced with deterministic /contract <relatedAddress>
    expect(journal.latest()?.suggestedAction).toBe(`/contract ${targetAddr}`)
  })

  it('scales ERC-20 token units, omits hardfork city names, and labels raw 4-byte selectors clearly', () => {
    expect(formatHumanCallPreview('transfer(to: 0x6355…59c6, amount: 20000000)', 6, 'USDC')).toBe(
      'transfer(to: 0x6355…59c6, amount: 20 USDC)',
    )
    expect(formatHumanCallPreview('transfer(to: 0x5b8b…1d93, amount: 500000)', 6, 'USDC')).toBe(
      'transfer(to: 0x5b8b…1d93, amount: 0.5 USDC)',
    )

    const facts = renderPromptFacts({
      dossier: {
        beat: 'storage_slot_pulse',
        subjectKey: 'signal:slot_trend:0x1c7d4b196cb0c7b01d743fbc6116a902379c7238:16',
        address: '0x1c7d4b196cb0c7b01d743fbc6116a902379c7238',
        lead: 'Storage slot monotonic up',
        identity: {
          knownName: 'USDC',
          kind: 'token',
          role: 'Sepolia USD Coin ERC-20 test token contract',
          symbol: 'USDC',
          decimals: 6,
        },
        callPreviews: ['transfer(to: 0x6355…59c6, amount: 20000000)'],
      },
      brief: {
        network: 'sepolia',
        hardfork: 'amsterdam',
        head: { blockNumber: '12202385' },
        signals: [],
        moments: [],
        hotContracts: [],
        l2: [],
      },
      lead: {
        lens: 'detective',
        lead: 'Storage slot monotonic up',
        subjectKey: 'signal:slot_trend:0x1c7d4b196cb0c7b01d743fbc6116a902379c7238:16',
        relatedAddress: '0x1c7d4b196cb0c7b01d743fbc6116a902379c7238',
        followUp: false,
        quiet: false,
        beat: 'storage_slot_pulse',
        format: 'field_note',
        baseScore: 70,
      },
    })
    expect(facts).toContain('amount: 20 USDC')
    expect(facts).toContain('NOT a user wallet')
    expect(facts).not.toMatch(/amsterdam/i)

    const rawFacts = renderPromptFacts({
      dossier: {
        beat: 'contract_deep_dive',
        subjectKey: 'contract:0x2c4dfb3ba834c11246f609bffd01c0a5e0c9181a',
        address: '0x2c4dfb3ba834c11246f609bffd01c0a5e0c9181a',
        lead: 'Active contract 0x2c4dfb3b…',
        callPreviews: ['0xd36b4ff6'],
      },
      brief: {
        network: 'sepolia',
        hardfork: 'amsterdam',
        head: { blockNumber: '12202367' },
        signals: [],
        moments: [],
        hotContracts: [],
        l2: [],
      },
      lead: {
        lens: 'detective',
        lead: 'Active contract 0x2c4dfb3b…',
        subjectKey: 'contract:0x2c4dfb3ba834c11246f609bffd01c0a5e0c9181a',
        relatedAddress: '0x2c4dfb3ba834c11246f609bffd01c0a5e0c9181a',
        followUp: false,
        quiet: false,
        beat: 'contract_deep_dive',
        format: 'field_note',
        baseScore: 28,
      },
    })
    expect(rawFacts).toContain('4-byte method selector 0xd36b4ff6 — NOT a contract address')
  })
})
