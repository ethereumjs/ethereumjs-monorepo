import type { TwoColumnPair } from '../tui/layout.ts'
import { formatTrendSuffix, shortAddress, trendArrow } from './format.ts'
import type { EconomySnapshot, TopContractRow } from './types.ts'

function venueBadge(hot: TopContractRow): string {
  if (
    hot.archetype !== undefined &&
    hot.archetype !== 'Contract' &&
    hot.archetype !== hot.knownName
  ) {
    return hot.archetype
  }
  if (hot.proxyKind !== undefined) return hot.proxyKind
  return 'Contract'
}

function topSelectorName(hot: TopContractRow): string | undefined {
  const raw = hot.topSelectors?.[0]
  if (raw === undefined) return undefined
  const name = raw.split(' (')[0]
  if (name.length === 0 || name.startsWith('0x')) return undefined
  return name
}

function formatSelectorSuffix(sel: string | undefined): string {
  if (sel === undefined || sel.length === 0) return ''
  return sel.startsWith('0x') ? ` · ${sel}` : ` · ${sel}()`
}

/** Top-middle Economy cockpit rows (read-only; no decodeBundle import). */
export function economyCockpitPairs(snap: EconomySnapshot | undefined): TwoColumnPair[] {
  const awaiting: TwoColumnPair[] = [
    { label: 'Fee (64b)', value: '—' },
    { label: 'Throughput', value: '—' },
    { label: 'Volume', value: '—' },
    { label: 'Top Venue', value: '—' },
  ]
  if (snap === undefined || !snap.hasBlocks) {
    return awaiting
  }

  const pctClause = formatTrendSuffix(snap.trend, snap.trendPercent)
  const avgLoad = snap.avgGasFullPct ?? snap.gasFullPct ?? 0
  const fee =
    snap.baseFeeGwei !== undefined
      ? `${snap.baseFeeGwei} Gwei${trendArrow(snap.trend)}${pctClause} · ${avgLoad}% avg load`
      : `${avgLoad}% avg load`

  let throughput = '—'
  if (snap.hasTxBody === true && snap.tps !== undefined && snap.windowTxCount !== undefined) {
    const rev =
      snap.windowRevertPct !== undefined ? ` · ${snap.windowRevertPct.toFixed(1)}% rev` : ''
    throughput = `${snap.tps.toFixed(1)} tx/s · ${snap.windowTxCount.toLocaleString('en-US')} txs${rev}`
  } else if (snap.activeAccounts !== undefined) {
    throughput = `BAL stream · ${snap.activeAccounts} acc/blk`
  }

  const windowB = snap.windowBlockCount ?? 0
  const volume = `${snap.ethTransferredWindowEth ?? '0 ETH'} (${windowB}b) · peak ${snap.windowPeakTransferEth ?? '0 ETH'}`

  const hot = snap.topContracts[0]
  let topVenue = '—'
  if (hot !== undefined) {
    const w = hot.storageWrites + hot.storageReads
    const slots = Math.round(w / Math.max(1, hot.blocksActive))
    const label = hot.knownName ?? shortAddress(hot.address)
    const badge = venueBadge(hot)
    const sel = topSelectorName(hot)
    topVenue = `${label} [${badge}] · ${slots}w/blk${formatSelectorSuffix(sel)}`
  }

  return [
    { label: 'Fee (64b)', value: fee },
    { label: 'Throughput', value: throughput },
    { label: 'Volume', value: volume },
    { label: 'Top Venue', value: topVenue },
  ]
}
