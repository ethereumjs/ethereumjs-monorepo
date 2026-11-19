import { knownContractName } from '../contracts/knownContracts.ts'
import { formatBaseFeeNumber, formatEthFromWei, shortAddress } from '../economy/format.ts'
import type { EthySpine, WidgetSpec } from '../spine/types.ts'

export function signalsDeepViewWidget(spine: EthySpine): WidgetSpec {
  const snap = spine.economy
  if (snap === undefined || !snap.hasBlocks) {
    return {
      kind: 'key_value',
      title: 'Signals',
      entries: [{ key: 'Status', value: 'Awaiting block bundles for signal engine…' }],
    }
  }
  const signals = snap.signals ?? []
  const preface: Array<{ key: string; value: string }> = []
  if (snap.blobBaseFeeGwei !== undefined) {
    preface.push({ key: 'Blob base fee', value: `${snap.blobBaseFeeGwei} Gwei` })
  }
  if (snap.l2RollupStats !== undefined && snap.l2RollupStats.length > 0) {
    const top = snap.l2RollupStats[0]!
    const label = top.displayName ?? shortAddress(top.inbox)
    preface.push({ key: 'Top L2 inbox', value: `${label} · ${top.blobCount} blobs` })
  }
  const rows = signals.map((s) => {
    const chainId = spine.chainId
    const target = s.address
      ? (knownContractName(chainId, s.address) ?? shortAddress(s.address))
      : '—'
    return [s.severity, s.kind, s.headline, target, String(s.windowBlocks)]
  })
  if (rows.length === 0) {
    rows.push([
      'calm',
      '—',
      'No notable signals in the current window',
      '—',
      String(snap.windowBlockCount ?? 64),
    ])
  }
  const debug = macroBaselineDebugRows(snap)
  return {
    kind: 'table',
    title: 'Live signals (Layer 1)',
    headers: ['Severity', 'Kind', 'Headline', 'Target', 'Window'],
    rows,
    preface,
    secondaryTable:
      debug.rows.length > 0
        ? {
            title: 'Macro baseline (Ctrl+D)',
            headers: debug.headers,
            rows: debug.rows,
          }
        : undefined,
  }
}

function macroBaselineDebugRows(snap: NonNullable<EthySpine['economy']>): {
  headers: string[]
  rows: string[][]
} {
  const baseline = snap.macroBaseline
  const latestFee = snap.baseFeeGwei
  const headers = ['Metric', 'Latest / window', '~2.5h baseline']
  const rows: string[][] = []
  if (baseline === undefined) return { headers, rows }
  rows.push([
    'Base fee',
    latestFee ?? '—',
    baseline.avgBaseFeeWei !== undefined ? formatBaseFeeNumber(baseline.avgBaseFeeWei) : '—',
  ])
  rows.push([
    'Blob base fee',
    snap.blobBaseFeeGwei ?? '—',
    baseline.avgBlobBaseFeeWei !== undefined
      ? formatBaseFeeNumber(baseline.avgBlobBaseFeeWei)
      : '—',
  ])
  rows.push([
    'Gas fullness',
    snap.gasFullPct !== undefined ? `${snap.gasFullPct}%` : '—',
    baseline.avgGasFullPct !== undefined ? `${baseline.avgGasFullPct}%` : '—',
  ])
  rows.push([
    'Revert %',
    snap.windowRevertPct !== undefined ? `${snap.windowRevertPct}%` : '—',
    baseline.avgRevertPct !== undefined ? `${baseline.avgRevertPct}%` : '—',
  ])
  rows.push([
    'EIP-7702 tx/bucket',
    snap.txTypeSplit?.setCode !== undefined ? String(snap.txTypeSplit.setCode) : '—',
    baseline.avgSetCodeTxCount !== undefined ? String(baseline.avgSetCodeTxCount) : '—',
  ])
  if (snap.l2RollupStats !== undefined && snap.l2RollupStats[0] !== undefined) {
    const top = snap.l2RollupStats[0]
    rows.push([
      'L2 blob spend (est.)',
      formatEthFromWei(top.estimatedEthWei),
      `${baseline.bucketCount} buckets`,
    ])
  }
  return { headers, rows }
}
