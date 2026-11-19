import { describe, expect, it } from 'vitest'

import {
  noveltyShouldSkip,
  parseDetectiveTriage,
  signalToDispatchCard,
} from '../src/ai/chainDetective.ts'
import { UserInterestRing } from '../src/ai/investigationJournal.ts'
import type { SignalCandidate } from '../src/economy/types.ts'

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
  })
})

describe('signalToDispatchCard', () => {
  it('marks deterministic SIGNAL dispatches', () => {
    const card = signalToDispatchCard(sampleSignal, 1_000)
    expect(card.deterministic).toBe(true)
    expect(card.category).toBe('7702')
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
