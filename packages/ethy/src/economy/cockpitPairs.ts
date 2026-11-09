import type { TwoColumnPair } from '../tui/layout.ts'
import { shortAddress, trendArrow } from './format.ts'
import type { EconomySnapshot } from './types.ts'

/** Top-middle Economy cockpit rows (read-only; no decodeBundle import). */
export function economyCockpitPairs(snap: EconomySnapshot | undefined): TwoColumnPair[] {
  if (snap === undefined || !snap.hasBlocks) {
    return [
      { label: 'Status', value: 'Awaiting first block…' },
      { label: 'Gas / Base', value: '—' },
      { label: 'Activity', value: '—' },
      { label: 'Hot Contr.', value: '—' },
    ]
  }
  const gas =
    snap.baseFeeGwei !== undefined
      ? `${snap.baseFeeGwei} Gwei${trendArrow(snap.trend)} · ${snap.gasFullPct ?? 0}% full`
      : `${snap.gasFullPct ?? 0}% full`
  const activity =
    snap.hasTxBody === true && snap.txCount !== undefined && snap.tps !== undefined
      ? `${snap.txCount} txs (${snap.tps.toFixed(1)}/s) · ${snap.ethTransferredBlockEth ?? '0 ETH'}`
      : '—'
  const state =
    snap.activeAccounts !== undefined
      ? `${snap.activeAccounts} acc · ${snap.storageWrites ?? 0} writes · ${snap.newDeployments ?? 0} new`
      : '—'
  const hot = snap.topContracts[0]
  const hotValue =
    hot !== undefined
      ? (() => {
          const w = hot.storageWrites + hot.storageReads
          const slots = Math.round(w / Math.max(1, hot.blocksActive))
          const label = hot.knownName ?? shortAddress(hot.address)
          const arch =
            hot.archetype !== undefined &&
            hot.archetype !== 'Contract' &&
            hot.archetype !== hot.knownName
              ? ` [${hot.archetype}]`
              : ''
          return `${label}${arch} (${slots}w)`
        })()
      : '—'
  return [
    { label: 'Gas / Base', value: gas },
    { label: 'Activity', value: activity },
    { label: 'State / BAL', value: state },
    { label: 'Hot Contr.', value: hotValue },
  ]
}
