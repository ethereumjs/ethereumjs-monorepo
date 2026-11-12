import { assert, describe, it } from 'vitest'

import { hexToBytes } from '@ethereumjs/util'

import { SELECTOR } from '../src/contracts/signatureCatalog.ts'
import { detectBlockMoments } from '../src/economy/momentDetector.ts'
import type { BlockEconomyRecord } from '../src/economy/types.ts'

function baseRecord(over: Partial<BlockEconomyRecord> = {}): BlockEconomyRecord {
  return {
    blockNumber: 100n,
    hasTxBody: true,
    gasFullPct: 40,
    txCount: 10,
    ethTransferredWei: 0n,
    txTypeSplit: {
      legacy: 0,
      accessList: 0,
      feeMarket: 10,
      blob: 0,
      setCode: 0,
      other: 0,
    },
    largestTransferWei: 0n,
    contractContributions: [],
    timestamp: 1_700_000_000,
    ...over,
  }
}

describe('[Ethy/Economy]: momentDetector', () => {
  it('emits heartbeat when no rare signals', () => {
    const moments = detectBlockMoments({
      record: baseRecord({ activeAccounts: 3, storageWrites: 5 }),
    })
    assert.equal(moments.length, 1)
    assert.equal(moments[0]!.kind, 'heartbeat')
    assert.equal(moments[0]!.badge, '[BEAT]')
  })

  it('detects whale at 1 ETH', () => {
    const moments = detectBlockMoments({
      record: baseRecord({
        largestTransferWei: 10n ** 18n,
        largestTransferTo: '0x0000000000000000000000000000000000000001',
      }),
    })
    assert.isTrue(moments.some((m) => m.kind === 'whale'))
  })

  it('detects graffiti_note from printable calldata', () => {
    const msg = new TextEncoder().encode('hello plaza')
    const moments = detectBlockMoments({
      record: baseRecord({
        observations: {
          calls: [],
          logs: [],
          blockAddresses: [],
          txSlices: [{ to: '0x000000000000000000000000000000000000abcd', data: msg, logs: [] }],
        },
      }),
    })
    assert.isTrue(moments.some((m) => m.kind === 'graffiti_note'))
  })

  it('rejects catalog selector calldata for graffiti', () => {
    const data = new Uint8Array([...hexToBytes(SELECTOR.transfer as `0x${string}`), 0x20])
    const moments = detectBlockMoments({
      record: baseRecord({
        observations: {
          calls: [],
          logs: [],
          blockAddresses: [],
          txSlices: [{ to: '0x1', data, logs: [] }],
        },
      }),
    })
    assert.isFalse(moments.some((m) => m.kind === 'graffiti_note'))
  })

  it('caps ranked moments at three', () => {
    const moments = detectBlockMoments({
      record: baseRecord({
        largestTransferWei: 2n * 10n ** 18n,
        largestTransferTo: '0x2',
        receiptReverts: 1,
        firstRevertTo: '0x3',
        txTypeSplit: {
          legacy: 0,
          accessList: 0,
          feeMarket: 5,
          blob: 2,
          setCode: 1,
          other: 0,
        },
        observations: {
          calls: [],
          logs: [],
          blockAddresses: [],
          txSlices: [
            {
              to: '0x4',
              data: new TextEncoder().encode('note on chain'),
              logs: [],
            },
          ],
        },
      }),
      balJson: [
        {
          address: '0x00000000000000000000000000000000000000c1',
          balanceChanges: [],
          nonceChanges: [{ blockAccessIndex: '0x01', postNonce: '0x01' }],
          codeChanges: [{ blockAccessIndex: '0x01', newCode: '0x6001600101' }],
          storageChanges: [],
          storageReads: [],
        },
      ],
    })
    assert.isAtMost(moments.length, 3)
    assert.equal(moments[0]!.kind, 'graffiti_note')
  })

  it('enriches birth headline when classifyCode is provided', () => {
    const moments = detectBlockMoments({
      record: baseRecord(),
      classifyCode: () => 'ERC-20',
      balJson: [
        {
          address: '0x00000000000000000000000000000000000000c1',
          balanceChanges: [],
          nonceChanges: [],
          codeChanges: [{ blockAccessIndex: '0x01', newCode: '0x6001600101' }],
          storageChanges: [],
          storageReads: [],
        },
      ],
    })
    const birth = moments.find((m) => m.kind === 'birth')
    assert.isDefined(birth)
    assert.include(birth!.headline, '[ERC-20]')
  })

  it('enriches revert headline with archetype badge', () => {
    const archetypes = new Map([['0xdead', 'DEX Router']])
    const moments = detectBlockMoments({
      record: baseRecord({ receiptReverts: 1, firstRevertTo: '0xdead' }),
      addressArchetypes: archetypes,
    })
    const rev = moments.find((m) => m.kind === 'revert')
    assert.isDefined(rev)
    assert.include(rev!.headline, '[DEX Router]')
  })
})
