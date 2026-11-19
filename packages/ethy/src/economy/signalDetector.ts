import { knownContractName } from '../contracts/knownContracts.ts'
import type { MacroRollupBucket } from './timeSeries.ts'
import type {
  BlockEconomyRecord,
  L2RollupWindowStat,
  SignalCandidate,
  SignalKind,
  SignalSeverity,
  SlotTrendKind,
  SlotWriteRow,
} from './types.ts'
import { ECONOMY_WINDOW_BLOCKS, MAX_SIGNAL_CANDIDATES, SLOT_TREND_TRACK_CAP } from './types.ts'
import type { MacroBaselineSnapshot } from './types.ts'

type SlotSeriesKey = string

export class SlotTrendTracker {
  private readonly series = new Map<SlotSeriesKey, Array<{ block: bigint; value: bigint }>>()

  noteBlock(record: BlockEconomyRecord): void {
    const writes = record.slotWrites
    if (writes === undefined) return
    for (const row of writes) {
      const key = `${row.address}:${row.slot}`
      let arr = this.series.get(key)
      if (arr === undefined) {
        if (this.series.size >= SLOT_TREND_TRACK_CAP) continue
        arr = []
        this.series.set(key, arr)
      }
      arr.push({ block: record.blockNumber, value: row.postValue })
      while (arr.length > 24) arr.shift()
    }
  }

  classify(key: SlotSeriesKey): SlotTrendKind | undefined {
    const arr = this.series.get(key)
    if (arr === undefined || arr.length < 3) return undefined
    const values = arr.map((v) => v.value)
    let ups = 0
    let downs = 0
    for (let i = 1; i < values.length; i++) {
      if (values[i]! > values[i - 1]!) ups += 1
      else if (values[i]! < values[i - 1]!) downs += 1
    }
    if (ups >= 3 && downs === 0) return 'monotonic_up'
    if (downs >= 3 && ups === 0) return 'monotonic_down'
    if (ups >= 2 && downs >= 2) return 'oscillating'
    const last = values[values.length - 1]!
    const prev = values[values.length - 2]!
    if (prev > 0n && last >= prev * 2n) return 'step_jump'
    return undefined
  }

  seriesFor(address: string, slot: string): Array<{ block: bigint; value: bigint }> | undefined {
    return this.series.get(`${address.toLowerCase()}:${slot}`)
  }

  entries(): Array<{ key: SlotSeriesKey; trend: SlotTrendKind; last: SlotWriteRow }> {
    const out: Array<{ key: SlotSeriesKey; trend: SlotTrendKind; last: SlotWriteRow }> = []
    for (const [key, arr] of this.series) {
      const trend = this.classify(key)
      if (trend === undefined) continue
      const last = arr[arr.length - 1]!
      const [address, slot] = key.split(':')
      if (address === undefined || slot === undefined) continue
      out.push({
        key,
        trend,
        last: { address, slot, postValue: last.value },
      })
    }
    return out
  }
}

export type DetectEconomySignalsInput = {
  ring: readonly BlockEconomyRecord[]
  macroBuckets: readonly MacroRollupBucket[]
  macroBaseline: MacroBaselineSnapshot
  slotTracker: SlotTrendTracker
  chainId: bigint
}

function severityFromScore(score: number): SignalSeverity {
  if (score >= 75) return 'surge'
  if (score >= 45) return 'notable'
  return 'calm'
}

function pushCandidate(
  out: SignalCandidate[],
  kind: SignalKind,
  score: number,
  headline: string,
  windowBlocks: number,
  metrics: Record<string, string | number>,
  address?: string,
  secondaryAddress?: string,
): void {
  const id = `${kind}:${address ?? headline}:${windowBlocks}`
  if (out.some((c) => c.id === id)) return
  out.push({
    id,
    kind,
    severity: severityFromScore(score),
    noveltyScore: Math.min(100, Math.max(0, score)),
    headline,
    address,
    secondaryAddress,
    metrics,
    windowBlocks,
  })
}

export function detectEconomySignals(input: DetectEconomySignalsInput): SignalCandidate[] {
  const { ring, macroBaseline, slotTracker, chainId } = input
  const out: SignalCandidate[] = []
  if (ring.length === 0) return out

  const latest = ring[0]!
  const window = Math.min(ring.length, 16)

  // delegation_surge
  const delegateCounts = new Map<string, number>()
  for (let i = 0; i < window; i++) {
    const b = ring[i]
    if (b?.delegationTargets === undefined) continue
    for (const row of b.delegationTargets) {
      delegateCounts.set(row.target, (delegateCounts.get(row.target) ?? 0) + row.count)
    }
  }
  for (const [target, count] of delegateCounts) {
    const baseline = macroBaseline.avgSetCodeTxCount ?? 1
    if (count >= 3 || (baseline > 0 && count >= baseline * 3)) {
      const name = knownContractName(chainId, target)
      pushCandidate(
        out,
        'delegation_surge',
        count >= 5 ? 80 : 55,
        name !== undefined
          ? `EIP-7702 cluster → ${name}`
          : `EIP-7702 delegate cluster (${count} auths)`,
        window,
        { count, target },
        target,
      )
    }
  }

  // contract_surge — compare per-block average gas vs macro baseline per-block average
  const gasWindow = new Map<string, { gas: bigint; blocks: number }>()
  for (const b of ring) {
    if (b.gasUsedByContract === undefined) continue
    for (const row of b.gasUsedByContract) {
      const prev = gasWindow.get(row.address) ?? { gas: 0n, blocks: 0 }
      prev.gas += row.gasUsed
      prev.blocks += 1
      gasWindow.set(row.address, prev)
    }
  }
  const topGas = [...gasWindow.entries()].sort((a, b) => (b[1].gas > a[1].gas ? 1 : -1))[0]
  if (topGas !== undefined && input.macroBuckets.length >= 1) {
    const [addr, stat] = topGas
    const recentPerBlock = stat.gas / BigInt(Math.max(1, ring.length))
    const macroSlice = input.macroBuckets.slice(0, 12)
    let macroGas = 0n
    for (const bucket of macroSlice) {
      for (const [a, g] of bucket.topContractGas) {
        if (a === addr) macroGas += g
      }
    }
    const macroBlocks = BigInt(Math.max(1, macroSlice.length * 8))
    const macroPerBlock = macroGas / macroBlocks
    const isKnownSurge =
      macroPerBlock > 0n && recentPerBlock >= macroPerBlock * 3n && stat.gas > 100_000n
    const isBreakoutEntrant =
      macroGas === 0n && macroSlice.length >= 2 && stat.blocks >= 2 && stat.gas >= 2_000_000n
    if (isKnownSurge || isBreakoutEntrant) {
      const name = knownContractName(chainId, addr)
      pushCandidate(
        out,
        'contract_surge',
        70,
        name !== undefined ? `${name} gas spike` : 'Contract gas share spike',
        Math.min(ring.length, ECONOMY_WINDOW_BLOCKS),
        { gas: stat.gas.toString() },
        addr,
      )
    }
  }

  // l2_blob_pressure — ring[0] is newest, so climbing means newer > older (strictly rising)
  let blobFeeStreak = 0
  let prevNewerBlobFee: bigint | undefined
  for (let i = 0; i < Math.min(ring.length, 8); i++) {
    const fee = ring[i]?.blobBaseFeeWei
    if (fee === undefined) break
    if (prevNewerBlobFee !== undefined) {
      if (prevNewerBlobFee > fee) {
        blobFeeStreak += 1
      } else {
        break
      }
    }
    prevNewerBlobFee = fee
  }
  const curBlob = latest.blobBaseFeeWei
  const baseBlob = macroBaseline.avgBlobBaseFeeWei
  if (
    blobFeeStreak >= 3 ||
    (curBlob !== undefined &&
      baseBlob !== undefined &&
      baseBlob > 0n &&
      curBlob >= (baseBlob * 5n) / 2n)
  ) {
    pushCandidate(
      out,
      'l2_blob_pressure',
      blobFeeStreak >= 4 ? 78 : 52,
      'Blob base fee climbing — L2 batch pressure',
      Math.min(ring.length, 8),
      {
        blobBaseFee: curBlob?.toString() ?? '0',
        streak: blobFeeStreak,
      },
    )
  }

  // congestion_pressure
  let highFull = 0
  for (let i = 0; i < Math.min(ring.length, 6); i++) {
    if ((ring[i]?.gasFullPct ?? 0) >= 88) highFull += 1
  }
  const tip = latest.medianPriorityTipWei
  const baseTip = macroBaseline.avgPriorityTipWei
  const revertDenom =
    (latest.receiptSuccess ?? 0) + (latest.receiptReverts ?? 0) > 0
      ? ((latest.receiptReverts ?? 0) * 100) /
        ((latest.receiptSuccess ?? 0) + (latest.receiptReverts ?? 0))
      : 0
  if (
    highFull >= 4 ||
    (tip !== undefined && baseTip !== undefined && baseTip > 0n && tip >= (baseTip * 5n) / 2n) ||
    revertDenom >= 15
  ) {
    pushCandidate(
      out,
      'congestion_pressure',
      highFull >= 4 ? 65 : 48,
      highFull >= 4 ? 'Sustained block fullness' : 'Fee-market or revert pressure',
      Math.min(ring.length, 6),
      { gasFullStreak: highFull, revertPct: Math.round(revertDenom) },
    )
  }

  // slot_trend
  for (const entry of slotTracker.entries()) {
    if (entry.trend === 'monotonic_up' || entry.trend === 'step_jump') {
      pushCandidate(
        out,
        'slot_trend',
        entry.trend === 'step_jump' ? 72 : 50,
        `Storage slot ${entry.trend.replace('_', ' ')}`,
        16,
        { slot: entry.last.slot, trend: entry.trend },
        entry.last.address,
      )
    }
  }

  // deployment_or_upgrade
  if ((latest.newDeployments ?? 0) >= 2 || (latest.contractCreationCount ?? 0) >= 2) {
    pushCandidate(out, 'deployment_or_upgrade', 45, 'Notable deployments in latest block', 1, {
      deployments: latest.newDeployments ?? latest.contractCreationCount ?? 0,
    })
  }

  // whale_or_flow
  if (latest.largestTransferWei >= 10n ** 20n) {
    pushCandidate(
      out,
      'whale_or_flow',
      60,
      'Large ETH transfer in latest block',
      1,
      { wei: latest.largestTransferWei.toString() },
      latest.largestTransferTo,
    )
  }

  // sender_burst
  if (latest.sameSenderBursts !== undefined) {
    for (const sender of latest.sameSenderBursts.slice(0, 3)) {
      pushCandidate(out, 'sender_burst', 42, 'Same-sender tx burst', 1, { sender }, sender)
    }
  }

  out.sort((a, b) => b.noveltyScore - a.noveltyScore)
  return out.slice(0, MAX_SIGNAL_CANDIDATES)
}

export function buildL2RollupStats(
  ring: readonly BlockEconomyRecord[],
  chainId: bigint,
): L2RollupWindowStat[] {
  const inboxBlobs = new Map<string, { blobCount: number; ethWei: bigint }>()
  for (const block of ring) {
    if (block.blobTxs === undefined) continue
    for (const row of block.blobTxs) {
      const prev = inboxBlobs.get(row.to) ?? { blobCount: 0, ethWei: 0n }
      prev.blobCount += row.blobCount
      const fee =
        block.blobBaseFeeWei !== undefined
          ? block.blobBaseFeeWei * BigInt(row.blobCount) * 131_072n
          : 0n
      prev.ethWei += fee
      inboxBlobs.set(row.to, prev)
    }
  }
  return [...inboxBlobs.entries()]
    .sort((a, b) => b[1].blobCount - a[1].blobCount)
    .slice(0, 3)
    .map(([inbox, row]) => ({
      inbox,
      displayName: knownContractName(chainId, inbox),
      blobCount: row.blobCount,
      estimatedEthWei: row.ethWei,
    }))
}
