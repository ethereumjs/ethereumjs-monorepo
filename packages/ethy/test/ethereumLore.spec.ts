import { describe, expect, it } from 'vitest'

import { ETHEREUM_LORE_CARDS, selectLoreCards } from '../src/ai/ethereumLore.ts'
import type { StoryBrief } from '../src/ai/storyBrief.ts'

const miniBrief = (over: Partial<StoryBrief> = {}): StoryBrief => ({
  network: 'mainnet',
  hardfork: 'Cancun',
  head: { blockNumber: '100' },
  signals: [],
  moments: [],
  hotContracts: [],
  l2: [],
  ...over,
})

describe('ethereumLore', () => {
  it('ships exactly 14 curated lore cards', () => {
    expect(ETHEREUM_LORE_CARDS).toHaveLength(14)
    const ids = new Set(ETHEREUM_LORE_CARDS.map((c) => c.id))
    expect(ids.has('l2_blobs_dencun')).toBe(true)
    expect(ids.has('sepolia_testnet_rehearsal')).toBe(true)
  })

  it('prefers signal-tagged lore over Sepolia network tag alone', () => {
    const picked = selectLoreCards(
      miniBrief({
        network: 'sepolia',
        signals: [
          {
            id: 's1',
            kind: 'l2_blob_pressure',
            severity: 'notable',
            headline: 'blobs',
            noveltyScore: 70,
            metrics: {},
          },
        ],
      }),
      'economics',
      [],
      1,
    )
    expect(picked[0]?.id).toBe('l2_blobs_dencun')
  })

  it('penalizes recently used lore ids', () => {
    const withBlob = miniBrief({
      signals: [
        {
          id: 's1',
          kind: 'l2_blob_pressure',
          severity: 'notable',
          headline: 'x',
          noveltyScore: 70,
          metrics: {},
        },
      ],
    })
    const fresh = selectLoreCards(withBlob, 'economics', [], 1)
    const repeat = selectLoreCards(withBlob, 'economics', [fresh[0]!.id], 1)
    expect(repeat[0]?.id).not.toBe(fresh[0]?.id)
  })

  it('returns one card on compact and two on rich tier', () => {
    const brief = miniBrief({
      signals: [
        {
          id: 's1',
          kind: 'delegation_surge',
          severity: 'surge',
          headline: 'd',
          noveltyScore: 80,
          metrics: {},
        },
      ],
    })
    expect(selectLoreCards(brief, 'security', [], 1)).toHaveLength(1)
    expect(selectLoreCards(brief, 'security', [], 2)).toHaveLength(2)
  })
})
