import type { ETHEconomyDataManager } from '../economy/economyDataManager.ts'
import { formatEthFromWei } from '../economy/format.ts'
import type { BlockMomentKind, SignalKind, TopContractRow } from '../economy/types.ts'
import type { EthySpine } from '../spine/types.ts'
import type { ModelTier } from './modelTier.ts'

const MOMENT_PRIORITY: BlockMomentKind[] = [
  'graffiti_note',
  'eip7702',
  'choreography',
  'revert',
  'whale',
  'veteran',
  'blob_anchor',
  'first_step',
  'birth',
  'heartbeat',
]

export type StoryBriefHead = {
  blockNumber?: string
  baseFeeGwei?: string
  baseFeeTrend?: string
  blobBaseFeeGwei?: string
  gasFullPct?: number
  tps?: number
  windowRevertPct?: number
  ethTransferredWindowEth?: string
  txTypeSplit?: Record<string, number>
  proposerGraffiti?: string
}

export type StoryBriefMoment = {
  id: string
  kind: BlockMomentKind
  blockNumber: string
  headline: string
  address?: string
}

export type StoryBriefHotContract = TopContractRow & {
  callPreviews?: string[]
  eventPreviews?: string[]
}

export type StoryBriefL2 = {
  inbox: string
  displayName?: string
  blobCount: number
  estimatedEth: string
}

export type StoryBriefMacro = {
  avgBaseFeeGwei?: string
  avgBlobBaseFeeGwei?: string
  avgGasFullPct?: number
  avgRevertPct?: number
  bucketCount: number
}

export type StoryBriefSignal = {
  id: string
  kind: SignalKind
  severity: string
  headline: string
  noveltyScore: number
  address?: string
  metrics: Record<string, string | number>
}

export type StoryBrief = {
  network: string
  hardfork: string
  head: StoryBriefHead
  signals: StoryBriefSignal[]
  moments: StoryBriefMoment[]
  hotContracts: StoryBriefHotContract[]
  l2: StoryBriefL2[]
  macro?: StoryBriefMacro
}

function momentRank(kind: BlockMomentKind): number {
  const idx = MOMENT_PRIORITY.indexOf(kind)
  return idx >= 0 ? idx : MOMENT_PRIORITY.length
}

function pickMoments(
  briefMoments: StoryBriefMoment[],
  tier: ModelTier,
  limit: number,
): StoryBriefMoment[] {
  const sorted = [...briefMoments].sort((a, b) => momentRank(a.kind) - momentRank(b.kind))
  const cap = tier === 'rich' ? limit : Math.min(limit, 4)
  return sorted.slice(0, cap)
}

function humanizeMacro(
  macro: NonNullable<NonNullable<EthySpine['economy']>['macroBaseline']>,
): StoryBriefMacro {
  const avgBase = macro.avgBaseFeeWei
  const avgBlob = macro.avgBlobBaseFeeWei
  const formatGwei = (wei?: bigint): string | undefined => {
    if (wei === undefined) return undefined
    const g = Number(wei) / 1e9
    return `${g.toFixed(2)} Gwei`
  }
  return {
    avgBaseFeeGwei: formatGwei(avgBase),
    avgBlobBaseFeeGwei: formatGwei(avgBlob),
    avgGasFullPct: macro.avgGasFullPct,
    avgRevertPct: macro.avgRevertPct,
    bucketCount: macro.bucketCount,
  }
}

export function buildStoryBrief(
  spine: EthySpine,
  economy: ETHEconomyDataManager,
  tier: ModelTier = 'compact',
): StoryBrief | undefined {
  const snap = spine.economy
  if (snap?.hasBlocks !== true) return undefined

  const momentsRaw: StoryBriefMoment[] = (snap.moments ?? []).map((m) => ({
    id: m.id,
    kind: m.kind,
    blockNumber: m.blockNumber,
    headline: m.headline,
    address: m.address,
  }))

  const hotContracts: StoryBriefHotContract[] = (snap.topContracts ?? []).slice(0, 5).map((row) => {
    const agg = economy.getContractAgg(row.address)
    const extra: StoryBriefHotContract = { ...row }
    if (agg !== undefined) {
      extra.callPreviews = agg.callPreviews.slice(0, 2)
      extra.eventPreviews = agg.eventPreviews.slice(0, 2)
    }
    return extra
  })

  const signals: StoryBriefSignal[] = (snap.signals ?? []).slice(0, 4).map((s) => ({
    id: s.id,
    kind: s.kind,
    severity: s.severity,
    headline: s.headline,
    noveltyScore: s.noveltyScore,
    address: s.address,
    metrics: { ...s.metrics },
  }))

  const l2: StoryBriefL2[] = (snap.l2RollupStats ?? []).slice(0, 3).map((s) => ({
    inbox: s.inbox,
    displayName: s.displayName,
    blobCount: s.blobCount,
    estimatedEth: formatEthFromWei(s.estimatedEthWei),
  }))

  const txSplit = snap.txTypeSplit
    ? {
        legacy: snap.txTypeSplit.legacy,
        feeMarket: snap.txTypeSplit.feeMarket,
        blob: snap.txTypeSplit.blob,
        setCode: snap.txTypeSplit.setCode,
      }
    : undefined

  return {
    network: spine.network,
    hardfork: economy.getHardfork(),
    head: {
      blockNumber: snap.latestBlockNumber,
      baseFeeGwei: snap.baseFeeGwei,
      baseFeeTrend: snap.trend,
      blobBaseFeeGwei: snap.blobBaseFeeGwei,
      gasFullPct: snap.gasFullPct,
      tps: snap.tps,
      windowRevertPct: snap.windowRevertPct,
      ethTransferredWindowEth: snap.ethTransferredWindowEth,
      txTypeSplit: txSplit,
      proposerGraffiti: snap.latestProposerGraffiti,
    },
    signals,
    moments: pickMoments(momentsRaw, tier, 6),
    hotContracts,
    l2,
    macro: snap.macroBaseline !== undefined ? humanizeMacro(snap.macroBaseline) : undefined,
  }
}

export function briefForPrompt(brief: StoryBrief): string {
  return JSON.stringify(brief)
}
