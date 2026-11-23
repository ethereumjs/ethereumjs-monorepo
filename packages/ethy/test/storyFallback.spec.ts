import { describe, expect, it } from 'vitest'

import { ETHEREUM_LORE_CARDS } from '../src/ai/ethereumLore.ts'
import type { StoryBrief } from '../src/ai/storyBrief.ts'
import { buildDeterministicFieldNote } from '../src/ai/storyFallback.ts'

const brief: StoryBrief = {
  network: 'mainnet',
  hardfork: 'Cancun',
  head: { blockNumber: '21', baseFeeGwei: '10 Gwei', gasFullPct: 55 },
  signals: [],
  moments: [{ id: 'm1', kind: 'birth', blockNumber: '21', headline: 'Fresh deploy' }],
  hotContracts: [],
  l2: [],
}

describe('storyFallback', () => {
  it('builds LIVE NOTE without Layer 1 signal phrasing', () => {
    const card = buildDeterministicFieldNote(brief, 'lore', ETHEREUM_LORE_CARDS[0]!, 9_000)
    expect(card.deterministic).toBe(true)
    expect(card.body).not.toMatch(/Layer 1 signal/i)
    expect(card.body.length).toBeGreaterThan(80)
    expect(card.loreCardId).toBeDefined()
  })
})
