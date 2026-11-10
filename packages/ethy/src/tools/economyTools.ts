import { formatSignedEthFromWei, shortAddress } from '../economy/format.ts'
import type { EthySpine, WidgetSpec } from '../spine/types.ts'

export function economyDeepViewWidget(spine: EthySpine): WidgetSpec {
  const snap = spine.economy
  if (snap === undefined || !snap.hasBlocks) {
    return {
      kind: 'key_value',
      title: 'Economy',
      entries: [{ key: 'Status', value: 'Awaiting first block bundle…' }],
    }
  }
  const preface: Array<{ key: string; value: string }> = []
  if (snap.baseFeeGwei !== undefined) {
    const trend = snap.trend === 'up' ? ' ↑' : snap.trend === 'down' ? ' ↓' : ''
    const pct =
      snap.trendPercent !== undefined && snap.trend !== 'flat'
        ? ` (${snap.trend === 'up' ? '+' : '-'}${snap.trendPercent}%)`
        : ''
    preface.push({ key: 'Base fee', value: `${snap.baseFeeGwei} Gwei${trend}${pct}` })
  }
  if (snap.gasFullPct !== undefined) {
    preface.push({ key: 'Block fullness', value: `${snap.gasFullPct}%` })
  }
  if (snap.blobGasUsed !== undefined) {
    preface.push({ key: 'Blob gas', value: snap.blobGasUsed })
  }
  if (snap.tps !== undefined) {
    preface.push({ key: 'TPS (10 blk)', value: snap.tps.toFixed(1) })
  }
  if (snap.ethTransferredWindowEth !== undefined) {
    preface.push({ key: 'ETH volume (64 blk)', value: snap.ethTransferredWindowEth })
  }
  if (snap.largestTransferEth !== undefined && snap.largestTransferTo !== undefined) {
    preface.push({
      key: 'Largest transfer',
      value: `${snap.largestTransferEth} → ${shortAddress(snap.largestTransferTo)}`,
    })
  }
  if (snap.activeAccounts !== undefined) {
    preface.push({
      key: 'Latest BAL',
      value: `${snap.activeAccounts} acc · ${snap.storageWrites ?? 0} writes · ${snap.storageReads ?? 0} reads`,
    })
  }
  const rows = snap.topContracts.map((c) => {
    const hasSpecificArch =
      c.archetype !== undefined && c.archetype !== 'Contract' && c.archetype !== c.knownName
    const label =
      c.knownName !== undefined
        ? `${c.knownName} ${shortAddress(c.address)}${hasSpecificArch ? ` [${c.archetype}]` : ''}`
        : hasSpecificArch
          ? `${shortAddress(c.address)} [${c.archetype}]`
          : shortAddress(c.address)
    return [
      label,
      String(c.blocksActive),
      String(c.storageWrites),
      String(c.storageReads),
      formatSignedEthFromWei(c.netEthDeltaWei),
    ]
  })
  const recent = snap.recentBlocks.map((b) => [
    `#${BigInt(b.blockNumber).toLocaleString('en-US')}`,
    b.baseFeeGwei === '—' ? '—' : `${b.baseFeeGwei} Gwei`,
    `${b.gasFullPct}%`,
    String(b.txCount),
    b.ethTransferredEth,
  ])
  return {
    kind: 'table',
    title: 'Top contracts (64 blocks)',
    headers: ['Contract', 'Blocks', 'S-Writes', 'S-Reads', 'Net ETH'],
    rows,
    preface,
    secondaryTable: {
      title: 'Recent blocks',
      headers: ['Block', 'Base', 'Full', 'Txs', 'ETH'],
      rows: recent,
    },
    debugPage: [
      {
        title: 'Methodology',
        entries: [
          {
            key: 'Net ETH',
            value: 'Observed post-balance delta per contract across the 64-block window.',
          },
          {
            key: 'Volume',
            value: 'Sums top-level tx.value from decoded bodies (no internal calls).',
          },
        ],
      },
    ],
  }
}
