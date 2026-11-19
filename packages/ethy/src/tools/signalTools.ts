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
  const debugEntries = macroBaselineDebugEntries(snap)
  return {
    kind: 'table',
    title: 'Live signals (Layer 1)',
    headers: ['Severity', 'Kind', 'Headline', 'Target', 'Window'],
    rows,
    preface,
    debugPage:
      debugEntries.length > 0
        ? [{ title: 'Macro baseline (~2.5h)', entries: debugEntries }]
        : undefined,
  }
}

function macroBaselineDebugEntries(
  snap: NonNullable<EthySpine['economy']>,
): Array<{ key: string; value: string }> {
  const baseline = snap.macroBaseline
  if (baseline === undefined) return []
  const latestFee = snap.baseFeeGwei ?? '—'
  const baseFeeAvg =
    baseline.avgBaseFeeWei !== undefined ? formatBaseFeeNumber(baseline.avgBaseFeeWei) : '—'
  const blobFeeAvg =
    baseline.avgBlobBaseFeeWei !== undefined ? formatBaseFeeNumber(baseline.avgBlobBaseFeeWei) : '—'
  const entries: Array<{ key: string; value: string }> = [
    { key: 'Buckets', value: `${baseline.bucketCount} × 8 blk` },
    { key: 'Base fee', value: `${latestFee} (baseline ${baseFeeAvg})` },
    { key: 'Blob base fee', value: `${snap.blobBaseFeeGwei ?? '—'} (baseline ${blobFeeAvg})` },
    {
      key: 'Gas fullness',
      value: `${snap.gasFullPct !== undefined ? `${snap.gasFullPct}%` : '—'} (baseline ${baseline.avgGasFullPct !== undefined ? `${baseline.avgGasFullPct}%` : '—'})`,
    },
    {
      key: 'Revert %',
      value: `${snap.windowRevertPct !== undefined ? `${snap.windowRevertPct}%` : '—'} (baseline ${baseline.avgRevertPct !== undefined ? `${baseline.avgRevertPct}%` : '—'})`,
    },
    {
      key: 'EIP-7702 tx/bkt',
      value: `${snap.txTypeSplit?.setCode ?? 0} latest (baseline ${baseline.avgSetCodeTxCount ?? '—'})`,
    },
  ]
  if (snap.l2RollupStats !== undefined && snap.l2RollupStats[0] !== undefined) {
    const top = snap.l2RollupStats[0]
    entries.push({
      key: 'Top L2 blob spend',
      value: `${top.displayName ?? shortAddress(top.inbox)} · ${formatEthFromWei(top.estimatedEthWei)}`,
    })
  }
  return entries
}
