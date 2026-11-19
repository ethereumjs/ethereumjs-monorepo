import { describe, expect, it } from 'vitest'

import { SlotTrendTracker, detectEconomySignals } from '../src/economy/signalDetector.ts'
import { MacroRollupRing } from '../src/economy/timeSeries.ts'
import type { BlockEconomyRecord } from '../src/economy/types.ts'
import { MACRO_BLOCKS_PER_BUCKET } from '../src/economy/types.ts'

function emptyRecord(n: bigint): BlockEconomyRecord {
  return {
    blockNumber: n,
    hasTxBody: true,
    gasFullPct: 95,
    txCount: 100,
    ethTransferredWei: 0n,
    txTypeSplit: {
      legacy: 0,
      accessList: 0,
      feeMarket: 100,
      blob: 0,
      setCode: 0,
      other: 0,
    },
    largestTransferWei: 0n,
    contractContributions: [],
    receiptSuccess: 80,
    receiptReverts: 20,
    delegationTargets: [
      { target: '0x00000000000000000000000000000000000000aa', count: 4, revocations: 0 },
    ],
  }
}

describe('MacroRollupRing', () => {
  it('rolls every 8 blocks and caps at 96 buckets', () => {
    const ring = new MacroRollupRing()
    for (let i = 1n; i <= BigInt(MACRO_BLOCKS_PER_BUCKET * 2 + 1); i++) {
      ring.noteBlock(emptyRecord(i))
    }
    ring.flushBucket()
    expect(ring.getBuckets().length).toBeGreaterThanOrEqual(1)
    expect(ring.getBuckets().length).toBeLessThanOrEqual(96)
  })
})

describe('detectEconomySignals', () => {
  it('emits delegation_surge and caps at 8', () => {
    const ring: BlockEconomyRecord[] = []
    for (let i = 0n; i < 8n; i++) {
      ring.push(emptyRecord(1000n - i))
    }
    const tracker = new SlotTrendTracker()
    const out = detectEconomySignals({
      ring,
      macroBuckets: [],
      macroBaseline: { bucketCount: 0 },
      slotTracker: tracker,
      chainId: 1n,
    })
    expect(out.some((s) => s.kind === 'delegation_surge')).toBe(true)
    expect(out.length).toBeLessThanOrEqual(8)
  })
})
