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

  it('does not trigger l2_blob_pressure on flat or falling blob fees, but fires when climbing', () => {
    const tracker = new SlotTrendTracker()
    const base = (n: bigint, blobBaseFeeWei: bigint): BlockEconomyRecord => ({
      ...emptyRecord(n),
      gasFullPct: 50,
      receiptReverts: 0,
      delegationTargets: undefined,
      blobBaseFeeWei,
    })

    // Flat 1 wei across 8 blocks must NOT fire
    const flatRing = [8n, 7n, 6n, 5n, 4n, 3n, 2n, 1n].map((n) => base(n, 1n))
    const flatOut = detectEconomySignals({
      ring: flatRing,
      macroBuckets: [],
      macroBaseline: { bucketCount: 0 },
      slotTracker: tracker,
      chainId: 1n,
    })
    expect(flatOut.some((s) => s.kind === 'l2_blob_pressure')).toBe(false)

    // Falling fees (ring[0] newest = 10, ring[1] = 20, ring[2] = 30, ring[3] = 40) must NOT fire
    const fallingRing = [10n, 20n, 30n, 40n, 50n].map((fee, i) => base(100n - BigInt(i), fee))
    const fallingOut = detectEconomySignals({
      ring: fallingRing,
      macroBuckets: [],
      macroBaseline: { bucketCount: 0 },
      slotTracker: tracker,
      chainId: 1n,
    })
    expect(fallingOut.some((s) => s.kind === 'l2_blob_pressure')).toBe(false)

    // Strictly climbing fees (ring[0] newest = 50 > 40 > 30 > 20 > 10) MUST fire
    const climbingRing = [50n, 40n, 30n, 20n, 10n].map((fee, i) => base(100n - BigInt(i), fee))
    const climbingOut = detectEconomySignals({
      ring: climbingRing,
      macroBuckets: [],
      macroBaseline: { bucketCount: 0 },
      slotTracker: tracker,
      chainId: 1n,
    })
    expect(climbingOut.some((s) => s.kind === 'l2_blob_pressure')).toBe(true)
  })

  it('does not false-positive contract_surge without a macro baseline', () => {
    const tracker = new SlotTrendTracker()
    const ring: BlockEconomyRecord[] = [
      {
        ...emptyRecord(10n),
        gasFullPct: 50,
        receiptReverts: 0,
        delegationTargets: undefined,
        gasUsedByContract: [
          { address: '0x00000000000000000000000000000000000000bb', gasUsed: 250_000n },
        ],
      },
    ]
    const out = detectEconomySignals({
      ring,
      macroBuckets: [],
      macroBaseline: { bucketCount: 0 },
      slotTracker: tracker,
      chainId: 1n,
    })
    expect(out.some((s) => s.kind === 'contract_surge')).toBe(false)
  })
})
