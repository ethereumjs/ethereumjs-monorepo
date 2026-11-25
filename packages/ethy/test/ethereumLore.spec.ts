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

  it('scopes lore strictly to the chosen lead and omits lore on snap cards', () => {
    const briefWithBlobs = miniBrief({
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
    })
    // A newborn contract lead must NOT pull unrelated l2_blobs_dencun lore from brief.signals
    const birthPicked = selectLoreCards(briefWithBlobs, 'detective', [], 1, {
      lens: 'detective',
      lead: 'New 2.1 KB [ERC-20] deployed',
      subjectKey: 'moment:100:birth:0',
      followUp: false,
      quiet: false,
      beat: 'newborn_contract',
      format: 'field_note',
      baseScore: 68,
    })
    expect(birthPicked[0]?.id).toBe('contract_birth_code_audit')

    // A short snap card gets no lore cards
    const snapPicked = selectLoreCards(briefWithBlobs, 'lore', [], 2, {
      lens: 'lore',
      lead: 'alice.eth wrote on-chain: "hello"',
      subjectKey: 'moment:100:graffiti_note:0',
      followUp: false,
      quiet: true,
      beat: 'tx_or_address_oddity',
      format: 'snap',
      baseScore: 94,
    })
    expect(snapPicked).toHaveLength(0)

    // A routine USDC token slot_trend must NOT attach alarmist storage_slot_accumulator lore
    const usdcSlotPicked = selectLoreCards(
      miniBrief({ network: 'mainnet' }),
      'detective',
      [],
      1,
      {
        lens: 'detective',
        lead: 'Storage slot monotonic up',
        subjectKey: 'signal:slot_trend:0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48:16',
        relatedAddress: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
        followUp: false,
        quiet: false,
        beat: 'storage_slot_pulse',
        format: 'field_note',
        baseScore: 70,
      },
      {
        beat: 'storage_slot_pulse',
        subjectKey: 'signal:slot_trend:0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48:16',
        lead: 'Storage slot monotonic up',
        identity: { knownName: 'USDC', kind: 'token', decimals: 6, symbol: 'USDC' },
        callPreviews: ['transfer(to: 0x6355…59c6, amount: 20000000)'],
      },
    )
    expect(usdcSlotPicked.some((c) => c.id === 'storage_slot_accumulator')).toBe(false)
  })
})
