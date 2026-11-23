import { describe, expect, it } from 'vitest'

import { InvestigationJournal } from '../src/ai/investigationJournal.ts'
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

  it('rotates lenses when the same subject repeats', () => {
    const journal = new InvestigationJournal()
    const a = directStory(brief(), journal)
    journal.push({
      category: 'l2',
      severity: 'notable',
      headline: 'h',
      body: 'b',
      atMs: 1,
      deterministic: false,
      lens: a.lens,
      subjectKey: a.subjectKey,
    })
    const b = directStory(brief(), journal)
    expect(b.lens).not.toBe(a.lens)
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
})
