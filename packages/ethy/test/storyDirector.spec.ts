import { describe, expect, it } from 'vitest'

import { InvestigationJournal } from '../src/ai/investigationJournal.ts'
import { isInterestingProposerGraffiti } from '../src/ai/storyBeats.ts'
import type { StoryBrief } from '../src/ai/storyBrief.ts'
import { directStory, parseLensOverride } from '../src/ai/storyDirector.ts'

const brief = (over: Partial<StoryBrief> = {}): StoryBrief => ({
  network: 'mainnet',
  hardfork: 'Cancun',
  head: { blockNumber: '500' },
  signals: [
    {
      id: 'sig1',
      kind: 'l2_blob_pressure',
      severity: 'notable',
      headline: 'Blob lane climbing',
      noveltyScore: 72,
      metrics: {},
    },
  ],
  moments: [],
  hotContracts: [],
  l2: [],
  ...over,
})

describe('storyDirector', () => {
  it('maps history lens override to lore', () => {
    expect(parseLensOverride('history')).toBe('lore')
    expect(parseLensOverride('security')).toBe('security')
  })

  it('down-weights a beat after it appears in the journal', () => {
    const journal = new InvestigationJournal()
    const a = directStory(brief(), journal, undefined, { rng: () => 0.01 })
    journal.push({
      category: 'l2',
      severity: 'notable',
      headline: 'h',
      body: 'b',
      atMs: 1,
      deterministic: false,
      lens: a.lens,
      subjectKey: a.subjectKey,
      beatKind: a.beat,
    })
    const b = directStory(brief(), journal, undefined, { rng: () => 0.99 })
    expect(b.beat).toBeDefined()
    expect(b.diceRoll).toBeDefined()
  })

  it('uses moment lead on quiet chain', () => {
    const journal = new InvestigationJournal()
    const quiet = brief({
      signals: [],
      moments: [
        { id: 'm1', kind: 'graffiti_note', blockNumber: '1', headline: 'Validator left a note' },
      ],
    })
    const lead = directStory(quiet, journal)
    expect(lead.quiet).toBe(true)
    expect(lead.subjectKey).toBe('moment:m1')
  })

  it('marks follow-up when novelty jumps', () => {
    const journal = new InvestigationJournal()
    journal.push({
      category: 'l2',
      severity: 'notable',
      headline: 'old',
      body: 'b',
      atMs: 1,
      deterministic: false,
      subjectKey: 'signal:sig1',
      signalScore: 40,
      lens: 'economics',
    })
    const lead = directStory(brief(), journal)
    expect(lead.followUp).toBe(true)
  })

  it('demotes bare anonymous tiny contracts & births below graffiti notes and rich contracts', () => {
    const journal = new InvestigationJournal()
    const mixed = brief({
      signals: [],
      moments: [
        {
          id: 'b1',
          kind: 'birth',
          blockNumber: '500',
          headline: 'New 0.2 KB deployed at 0x1111..2222',
          address: '0x1111111111111111111111111111111111112222',
        },
        {
          id: 'g1',
          kind: 'graffiti_note',
          blockNumber: '500',
          headline: 'alice.eth wrote on-chain: "hello sepolia!"',
          address: '0x000000000000000000000000000000000000abcd',
        },
      ],
      hotContracts: [
        {
          address: '0x2222222222222222222222222222222222222222',
          blocksActive: 4,
          storageWrites: 2,
          storageReads: 0,
          netEthDeltaWei: 0n,
        },
      ],
    })
    const lead = directStory(mixed, journal, undefined, { rng: () => 0.01 })
    expect(lead.subjectKey).toBe('moment:g1')
    expect(lead.format).toBe('snap')
    const birthCandidate = lead.beatCandidates?.find((c) => c.subjectKey === 'moment:b1')
    const bareCandidate = lead.beatCandidates?.find(
      (c) => c.subjectKey === 'contract:0x2222222222222222222222222222222222222222',
    )
    const noteCandidate = lead.beatCandidates?.find((c) => c.subjectKey === 'moment:g1')
    expect(noteCandidate!.weight).toBeGreaterThan(birthCandidate!.weight)
    expect(noteCandidate!.weight).toBeGreaterThan(bareCandidate!.weight)
  })

  it('filters routine client graffiti and promotes human validator graffiti as a snap', () => {
    expect(isInterestingProposerGraffiti('geth/v1.15.0')).toBe(false)
    expect(isInterestingProposerGraffiti('besu/v25.1.0')).toBe(false)
    expect(isInterestingProposerGraffiti('0xdeadbeef01')).toBe(false)
    expect(isInterestingProposerGraffiti('hi mom from home staking')).toBe(true)

    const journal = new InvestigationJournal()
    const withGraffiti = brief({
      head: { blockNumber: '500', proposerGraffiti: 'hi mom from home staking' },
      signals: [],
      moments: [],
      hotContracts: [],
    })
    const lead = directStory(withGraffiti, journal, undefined, { rng: () => 0.01 })
    expect(lead.subjectKey).toBe('proposer_graffiti:hi mom from home staking')
    expect(lead.format).toBe('snap')
  })
})
