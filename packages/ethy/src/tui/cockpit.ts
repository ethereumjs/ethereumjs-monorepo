import {
  computeSnapProgressPct,
  formatProgressBar,
  snapBucketsDoneCount,
} from '../spine/buckets.ts'
import type { CapabilityId, EthyPhase, EthySpine, TuiViewState } from '../spine/types.ts'
import { BOLD, DIM, RESET, visibleWidth } from './ansi.ts'
import { capabilityMark } from './capabilityMark.ts'
import {
  type TwoColumnPair,
  fixedField,
  fixedLine,
  formatTwoColumnRows,
  maxLabelWidth,
  widthsFromWeights,
} from './layout.ts'

const DOMAIN_LABEL: Record<CapabilityId, string> = {
  p2p: 'P2P',
  snap: 'SNAP',
  head: 'HEAD',
  ai: 'AI',
}

/** Inner content rows per box (excluding top/bottom border and vertical padding). */
const COCKPIT_CONTENT_ROWS = 4

function formatBlockNum(n: bigint): string {
  return `#${n.toLocaleString('en-US')}`
}

function formatCompactCount(n: number): string {
  if (n >= 1_000_000) {
    const scaled = Math.round(n / 100_000) / 10
    return `${Number.isInteger(scaled) ? scaled : scaled.toFixed(1)}M`
  }
  if (n >= 10_000) {
    const scaled = Math.round(n / 100) / 10
    return `${Number.isInteger(scaled) ? scaled : scaled.toFixed(1)}k`
  }
  return n.toLocaleString('en-US')
}

function snapTargetRow(spine: EthySpine): string {
  const pivot = spine.pivotBlockNumber
  if (pivot === undefined) {
    return spine.pivotStatusHint ?? 'Awaiting peer head…'
  }
  const head = spine.bestPeerHead ?? spine.headBlockNumber ?? pivot
  const drift = head > pivot ? head - pivot : 0n
  if (drift > 0n) return `${formatBlockNum(pivot)} (+${drift.toLocaleString('en-US')} blk)`
  return formatBlockNum(pivot)
}

function nodePulsePairs(spine: EthySpine): TwoColumnPair[] {
  const phase = spine.phase
  const peerCount = spine.peers.size

  if (phase === 'BOOTING' || phase === 'P2P_WARMUP') {
    const target = peerCount === 0 ? 'Awaiting peer head…' : `Peers: ${peerCount} RLPx`
    return [
      { label: 'Stage', value: 'Connecting P2P' },
      { label: 'Target', value: target },
      { label: 'Progress', value: formatProgressBar(0) },
      { label: 'State', value: 'Warming peer book' },
    ]
  }

  if (phase === 'SNAP_SYNCING') {
    const allBucketsDone = snapBucketsDoneCount(spine.snapBuckets) === 16
    if (!allBucketsDone) {
      const rate = Math.round(spine.accountsPerSec).toLocaleString('en-US')
      return [
        { label: 'Stage', value: 'Snap Sync · Accounts' },
        { label: 'Target', value: snapTargetRow(spine) },
        { label: 'Progress', value: formatProgressBar(computeSnapProgressPct(spine)) },
        {
          label: 'State',
          value: `${formatCompactCount(spine.totalAccountsSynced)} acc · ${rate}/s`,
        },
      ]
    }
    return [
      { label: 'Stage', value: 'Snap Sync · Storage' },
      { label: 'Target', value: snapTargetRow(spine) },
      { label: 'Progress', value: formatProgressBar(computeSnapProgressPct(spine)) },
      {
        label: 'State',
        value: `${formatCompactCount(spine.codesSynced)} code · ${formatCompactCount(spine.storageSlotsSynced)} slots`,
      },
    ]
  }

  if (phase === 'BAL_CATCHUP') {
    const catchUp = spine.balCatchUp
    const from = catchUp?.fromBlock ?? (spine.lastVerifiedBlockNumber ?? 0n) + 1n
    const total = catchUp?.total ?? 0
    const applied = catchUp?.applied ?? 0
    const remaining = Math.max(0, total - applied)
    const pct = total > 0 ? (applied / total) * 100 : 0
    return [
      { label: 'Stage', value: 'BAL Catch-Up' },
      {
        label: 'Target',
        value: `${formatBlockNum(from)} → +${remaining.toLocaleString('en-US')} blk`,
      },
      { label: 'Progress', value: formatProgressBar(pct) },
      {
        label: 'State',
        value: `${applied.toLocaleString('en-US')} / ${total.toLocaleString('en-US')} BALs applied`,
      },
    ]
  }

  if (phase === 'HEAD_FOLLOWING') {
    const head = spine.headBlockNumber ?? spine.lastVerifiedBlockNumber
    const balCount = spine.balWindow.length
    const acc = formatCompactCount(spine.totalAccountsSynced)
    return [
      { label: 'Stage', value: 'Head Following' },
      { label: 'Target', value: head !== undefined ? `${formatBlockNum(head)} (live)` : '—' },
      { label: 'Progress', value: formatProgressBar(100) },
      { label: 'State', value: `${acc} acc · ${balCount} BALs` },
    ]
  }

  return [
    { label: 'Stage', value: '—' },
    { label: 'Target', value: '—' },
    { label: 'Progress', value: formatProgressBar(0) },
    { label: 'State', value: '—' },
  ]
}

function shortHash(root: Uint8Array | undefined): string {
  if (root === undefined || root.length === 0) return '—'
  const hex = Array.from(root.slice(0, 4))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
  const tail = Array.from(root.slice(-4))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
  return `0x${hex}…${tail}`
}

function clientFamilies(spine: EthySpine): string {
  const counts = new Map<string, number>()
  for (const p of spine.peers.values()) {
    const family = p.clientName.split(/[/\s]/)[0] ?? p.clientName
    counts.set(family, (counts.get(family) ?? 0) + 1)
  }
  const sorted = [...counts.entries()].sort((a, b) => b[1] - a[1])
  if (sorted.length === 0) return 'none'
  return sorted
    .slice(0, 2)
    .map(([name, n]) => `${n} ${name}`)
    .join(' · ')
}

function avgLatency(spine: EthySpine): string {
  const peers = [...spine.peers.values()]
  if (peers.length === 0) return '—'
  const sum = peers.reduce((a, p) => a + p.avgLatencyMs, 0)
  return `${Math.round(sum / peers.length)} ms avg`
}

function snapSessionCount(spine: EthySpine): number {
  let n = 0
  for (const p of spine.peers.values()) {
    if (p.snapSession === true) n++
  }
  return n
}

function formatServeBytes(bytes: number): string {
  if (bytes >= 1_048_576) return `${(bytes / 1_048_576).toFixed(1)} MB`
  if (bytes >= 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${bytes} B`
}

function servedMetric(spine: EthySpine): string {
  const s = spine.serving
  if (s === undefined) return '0 replies'
  if (s.totalRequestsServed > 0) {
    return `${s.totalRequestsServed} replies · ${formatServeBytes(s.totalBytesServed)}`
  }
  if (s.blocksStored > 0) return '0 replies (ready)'
  return '0 replies'
}

function domainStatus(spine: EthySpine, id: CapabilityId) {
  return spine.capabilities[id].status
}

function boxTop(boxW: number, titlePlain: string): string {
  const prefix = `${DIM}╭─ ${RESET}${titlePlain}${DIM} `
  const prefixVis = visibleWidth(prefix)
  const dashes = Math.max(1, boxW - prefixVis - 1)
  return fixedLine(`${prefix}${'─'.repeat(dashes)}╮${RESET}`, boxW)
}

function boxRow(boxW: number, text: string): string {
  const inner = Math.max(0, boxW - 4)
  const body = fixedField(text, inner)
  return fixedLine(`${DIM}│${RESET} ${body} ${DIM}│${RESET}`, boxW)
}

function boxBottom(boxW: number): string {
  return fixedLine(`${DIM}╰${'─'.repeat(Math.max(0, boxW - 2))}╯${RESET}`, boxW)
}

function renderBox(boxW: number, titlePlain: string, contentLines: string[]): string[] {
  const pad = boxRow(boxW, '')
  return [
    boxTop(boxW, titlePlain),
    pad,
    ...contentLines.map((r) => boxRow(boxW, r)),
    pad,
    boxBottom(boxW),
  ]
}

function joinBoxLines(columns: string[][], contentWidth: number): string[] {
  const lineCount = columns[0]?.length ?? 0
  const out: string[] = []
  for (let i = 0; i < lineCount; i++) {
    const parts = columns.map((col) => col[i] ?? fixedLine('', contentWidth))
    const gap = '  '
    const joined = parts.join(gap)
    out.push(fixedLine(joined, contentWidth))
  }
  return out
}

function commandPairs(domain: CapabilityId, phase: EthyPhase): TwoColumnPair[] {
  switch (domain) {
    case 'p2p':
      return [
        { label: '/peers', value: 'client table' },
        { label: '/diag', value: 'anomalies' },
        { label: '/drop', value: 'disconnect' },
        { label: '/help', value: 'commands' },
      ]
    case 'snap':
      return [
        { label: '/buckets', value: '16-bucket view' },
        { label: '/range', value: 'account table' },
        { label: '/sample', value: 'top balances' },
        { label: '/reassign', value: 'bucket' },
      ]
    case 'head':
      return [
        { label: '/account', value: 'inspect' },
        { label: '/bal', value: 'head summary' },
        { label: '/simulate', value: 'tx sandbox' },
        { label: '/help', value: 'commands' },
      ]
    case 'ai':
      return phase === 'P2P_WARMUP'
        ? [
            { label: '', value: 'Which peers are connected?' },
            { label: '', value: 'Show client latency' },
            { label: '', value: 'Any handshake errors?' },
            { label: '/help', value: 'slash mode' },
          ]
        : phase === 'SNAP_SYNCING'
          ? [
              { label: '', value: 'Why is a bucket stalled?' },
              { label: '', value: 'Show snap throughput' },
              { label: '', value: 'Which peer serves 0x3?' },
              { label: '/help', value: 'slash mode' },
            ]
          : [
              { label: '', value: 'Summarize latest BAL' },
              { label: '', value: 'What changed at head?' },
              { label: '', value: 'Explain pivot vs head' },
              { label: '/help', value: 'slash mode' },
            ]
  }
}

function metricsPairs(spine: EthySpine, domain: CapabilityId): TwoColumnPair[] {
  switch (domain) {
    case 'p2p':
      return [
        {
          label: 'Peers',
          value: `${spine.peers.size} connected (${snapSessionCount(spine)} snap)`,
        },
        { label: 'Served', value: servedMetric(spine) },
        { label: 'Latency', value: avgLatency(spine) },
        { label: 'Clients', value: clientFamilies(spine) },
      ]
    case 'snap': {
      const done = snapBucketsDoneCount(spine.snapBuckets)
      const syncing = spine.snapBuckets.filter((b) => b.status === 'syncing').length
      const stalled = spine.snapBuckets.filter((b) => b.status === 'stalled').length
      return [
        { label: 'Progress', value: `${Math.round((done / 16) * 100)}% (${done}/16 complete)` },
        { label: 'Active', value: `${syncing} syncing · ${stalled} stalled` },
        { label: 'Pivot Root', value: shortHash(spine.pivotStateRoot) },
        { label: 'Speed', value: `${Math.round(spine.accountsPerSec)} acc/s` },
      ]
    }
    case 'head':
      return [
        {
          label: 'Status',
          value:
            spine.capabilities.head.status === 'locked'
              ? 'Locked'
              : spine.capabilities.head.status === 'partial'
                ? 'Catch-up'
                : 'Following',
        },
        {
          label: 'Head Block',
          value: spine.headBlockNumber !== undefined ? `#${spine.headBlockNumber}` : '—',
        },
        { label: 'State Root', value: shortHash(spine.headStateRoot) },
        {
          label: 'BAL Window',
          value:
            spine.balWindow.length > 0
              ? `${spine.balWindow.length} blocks · ${spine.balWindow[0]?.accountCount ?? 0} accounts`
              : '—',
        },
      ]
    case 'ai': {
      const unlocked = (['p2p', 'snap', 'head', 'ai'] as const)
        .filter((id) => spine.capabilities[id].status !== 'locked')
        .map((id) => DOMAIN_LABEL[id])
        .join(', ')
      return [
        { label: 'Engine', value: 'Slash / Rule Mode' },
        { label: 'Unlocked', value: unlocked || '—' },
        { label: 'Slot', value: String(spine.currentSlot) },
        { label: 'Anomalies', value: String(spine.diagnosticRingBuffer.length) },
      ]
    }
  }
}

function domainTitle(spine: EthySpine, view: TuiViewState, kind: 'Commands' | 'Metrics'): string {
  const id = view.activeDomain
  const mark = capabilityMark(id, domainStatus(spine, id))
  const label = DOMAIN_LABEL[id]
  const suffix = kind === 'Metrics' ? 'Metrics' : 'Commands'
  return `${mark} ${BOLD}${label} ${suffix}${RESET}`
}

function innerRowWidth(boxW: number): number {
  return Math.max(0, boxW - 4)
}

/** Gap between the three cockpit columns, also used under the metrics box. */
export const COCKPIT_COLUMN_GAP = 2

/** Visible widths of the three cockpit boxes for one content row. */
export function cockpitColumnWidths(contentWidth: number): [number, number, number] {
  const [w0, w1, w2] = widthsFromWeights(contentWidth, [1, 1, 1], COCKPIT_COLUMN_GAP)
  return [w0 ?? 0, w1 ?? 0, w2 ?? 0]
}

/** Eight-line 3-box cockpit (padding row above/below four data rows). */
export function renderCockpit(
  spine: EthySpine,
  view: TuiViewState,
  contentWidth: number,
): string[] {
  const [w0, w1, w2] = cockpitColumnWidths(contentWidth)
  const pulseP = nodePulsePairs(spine)
  const cmdP = commandPairs(view.activeDomain, spine.phase)
  const metP = metricsPairs(spine, view.activeDomain)
  const labelW = maxLabelWidth([...pulseP, ...cmdP, ...metP])

  const pulseLines = formatTwoColumnRows(pulseP, labelW, innerRowWidth(w0))
  const cmdLines = formatTwoColumnRows(cmdP, labelW, innerRowWidth(w1))
  const metLines = formatTwoColumnRows(metP, labelW, innerRowWidth(w2))

  while (pulseLines.length < COCKPIT_CONTENT_ROWS) pulseLines.push('')
  while (cmdLines.length < COCKPIT_CONTENT_ROWS) cmdLines.push('')
  while (metLines.length < COCKPIT_CONTENT_ROWS) metLines.push('')

  const pulse = renderBox(
    w0,
    `${BOLD}Node Pulse${RESET}`,
    pulseLines.slice(0, COCKPIT_CONTENT_ROWS),
  )
  const commands = renderBox(
    w1,
    domainTitle(spine, view, 'Commands'),
    cmdLines.slice(0, COCKPIT_CONTENT_ROWS),
  )
  const metrics = renderBox(
    w2,
    domainTitle(spine, view, 'Metrics'),
    metLines.slice(0, COCKPIT_CONTENT_ROWS),
  )
  return joinBoxLines([pulse, commands, metrics], contentWidth)
}
