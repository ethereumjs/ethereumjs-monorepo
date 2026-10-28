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

function phaseLabel(phase: EthyPhase): string {
  switch (phase) {
    case 'BOOTING':
      return 'Booting'
    case 'P2P_WARMUP':
      return 'P2P Warmup'
    case 'SNAP_SYNCING':
      return 'Snap Syncing'
    case 'HEAD_FOLLOWING':
      return 'Head Following'
  }
}

function bucketMiniBar(spine: EthySpine): string {
  let bar = ''
  for (const b of spine.snapBuckets) {
    switch (b.status) {
      case 'done':
        bar += '█'
        break
      case 'syncing':
        bar += '▓'
        break
      case 'verifying_proof':
        bar += '▒'
        break
      case 'stalled':
        bar += '!'
        break
      default:
        bar += '░'
    }
  }
  const done = spine.snapBuckets.filter((b) => b.status === 'done').length
  return `${bar} ${done}/16`
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

function countCaps(spine: EthySpine): string {
  let snap = 0
  let eth71 = 0
  for (const p of spine.peers.values()) {
    for (const c of p.caps) {
      if (c.startsWith('snap/')) snap++
      if (c === 'eth/71') eth71++
    }
  }
  return `${snap} snap/1 · ${eth71} eth/71`
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

function nodePulsePairs(spine: EthySpine): TwoColumnPair[] {
  const pivot =
    spine.pivotBlockNumber !== undefined
      ? `#${spine.pivotBlockNumber.toLocaleString('en-US')}`
      : 'Waiting for peer...'
  const accounts = `${spine.totalAccountsSynced.toLocaleString('en-US')} ~${Math.round(spine.accountsPerSec)}/s`
  return [
    { label: 'Phase', value: phaseLabel(spine.phase) },
    { label: 'Pivot', value: pivot },
    { label: 'Buckets', value: bucketMiniBar(spine) },
    { label: 'Accounts', value: accounts },
  ]
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
        { label: '/snap', value: 'progress' },
        { label: '/reassign', value: 'bucket' },
        { label: '/diag', value: 'anomalies' },
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
        { label: 'Peers', value: `${spine.peers.size} connected` },
        { label: 'Caps', value: countCaps(spine) },
        { label: 'Latency', value: avgLatency(spine) },
        { label: 'Clients', value: clientFamilies(spine) },
      ]
    case 'snap': {
      const done = spine.snapBuckets.filter((b) => b.status === 'done').length
      const syncing = spine.snapBuckets.filter((b) => b.status === 'syncing').length
      const stalled = spine.snapBuckets.filter((b) => b.status === 'stalled').length
      return [
        { label: 'Progress', value: `${Math.round((done / 16) * 100)}% (${done}/16)` },
        { label: 'Active', value: `${syncing} syncing · ${stalled} stalled` },
        { label: 'Pivot Root', value: shortHash(spine.pivotStateRoot) },
        { label: 'Speed', value: `${Math.round(spine.accountsPerSec)} acc/s` },
      ]
    }
    case 'head':
      return [
        {
          label: 'Status',
          value: spine.capabilities.head.status === 'locked' ? 'Locked' : 'Following',
        },
        {
          label: 'Head Block',
          value: spine.headBlockNumber !== undefined ? `#${spine.headBlockNumber}` : '—',
        },
        { label: 'State Root', value: shortHash(spine.headStateRoot) },
        {
          label: 'Pivot',
          value: spine.pivotBlockNumber !== undefined ? `#${spine.pivotBlockNumber}` : '—',
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
