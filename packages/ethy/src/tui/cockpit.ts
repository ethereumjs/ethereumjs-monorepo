import type { CapabilityId, EthyPhase, EthySpine, TuiViewState } from '../spine/types.ts'
import { BOLD, DIM, RESET, visibleWidth } from './ansi.ts'
import { capabilityMark } from './capabilityMark.ts'
import { fixedField, fixedLine, widthsFromWeights } from './layout.ts'

const DOMAIN_LABEL: Record<CapabilityId, string> = {
  p2p: 'P2P',
  snap: 'SNAP',
  head: 'HEAD',
  ai: 'AI',
}

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

function renderBox(boxW: number, titlePlain: string, rows: string[]): string[] {
  return [boxTop(boxW, titlePlain), ...rows.map((r) => boxRow(boxW, r)), boxBottom(boxW)]
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

function nodePulseRows(spine: EthySpine): string[] {
  const pivot =
    spine.pivotBlockNumber !== undefined
      ? `#${spine.pivotBlockNumber.toLocaleString('en-US')}`
      : 'Waiting for peer...'
  const accounts = `${spine.totalAccountsSynced.toLocaleString('en-US')} ~${Math.round(spine.accountsPerSec)}/s`
  return [
    `Phase   ${phaseLabel(spine.phase)}`,
    `Pivot   ${pivot}`,
    `Buckets ${bucketMiniBar(spine)}`,
    `Accounts ${accounts}`,
  ]
}

function commandRows(domain: CapabilityId, phase: EthyPhase): string[] {
  switch (domain) {
    case 'p2p':
      return [
        '/peers   client table',
        '/diag    anomalies',
        '/drop    disconnect',
        '/help    commands',
      ]
    case 'snap':
      return [
        '/buckets 16-bucket view',
        '/snap    progress',
        '/reassign bucket',
        '/diag    anomalies',
      ]
    case 'head':
      return [
        '/account inspect',
        '/bal     head summary',
        '/simulate tx sandbox',
        '/help    commands',
      ]
    case 'ai':
      return phase === 'P2P_WARMUP'
        ? [
            'Which peers are connected?',
            'Show client latency',
            'Any handshake errors?',
            '/help for slash mode',
          ]
        : phase === 'SNAP_SYNCING'
          ? [
              'Why is a bucket stalled?',
              'Show snap throughput',
              'Which peer serves 0x3?',
              '/help for slash mode',
            ]
          : [
              'Summarize latest BAL',
              'What changed at head?',
              'Explain pivot vs head',
              '/help for slash mode',
            ]
  }
}

function metricsRows(spine: EthySpine, domain: CapabilityId): string[] {
  switch (domain) {
    case 'p2p':
      return [
        `Peers    ${spine.peers.size} connected`,
        `Caps     ${countCaps(spine)}`,
        `Latency  ${avgLatency(spine)}`,
        `Clients  ${clientFamilies(spine)}`,
      ]
    case 'snap': {
      const done = spine.snapBuckets.filter((b) => b.status === 'done').length
      const syncing = spine.snapBuckets.filter((b) => b.status === 'syncing').length
      const stalled = spine.snapBuckets.filter((b) => b.status === 'stalled').length
      return [
        `Progress ${Math.round((done / 16) * 100)}% (${done}/16)`,
        `Active   ${syncing} syncing · ${stalled} stalled`,
        `Pivot Root ${shortHash(spine.pivotStateRoot)}`,
        `Speed    ${Math.round(spine.accountsPerSec)} acc/s`,
      ]
    }
    case 'head':
      return [
        `Status   ${spine.capabilities.head.status === 'locked' ? 'Locked' : 'Following'}`,
        `Head Block ${spine.headBlockNumber !== undefined ? `#${spine.headBlockNumber}` : '—'}`,
        `State Root ${shortHash(spine.headStateRoot)}`,
        `Pivot    ${spine.pivotBlockNumber !== undefined ? `#${spine.pivotBlockNumber}` : '—'}`,
      ]
    case 'ai': {
      const unlocked = (['p2p', 'snap', 'head', 'ai'] as const)
        .filter((id) => spine.capabilities[id].status !== 'locked')
        .map((id) => DOMAIN_LABEL[id])
        .join(', ')
      return [
        'Engine   Slash / Rule Mode',
        `Unlocked ${unlocked || '—'}`,
        `Slot     ${spine.currentSlot}`,
        `Anomalies ${spine.diagnosticRingBuffer.length}`,
      ]
    }
  }
}

function domainTitle(spine: EthySpine, view: TuiViewState, kind: 'Commands' | 'Metrics'): string {
  const id = view.activeDomain
  const mark = capabilityMark(id, domainStatus(spine, id))
  const label = DOMAIN_LABEL[id]
  if (kind === 'Metrics') {
    return `${mark} ${label} Metrics [Enter]`
  }
  return `${mark} ${label} Commands`
}

/** Six-line 3-box cockpit row (Node Pulse + domain Commands + domain Metrics). */
export function renderCockpit(
  spine: EthySpine,
  view: TuiViewState,
  contentWidth: number,
): string[] {
  const [w0, w1, w2] = widthsFromWeights(contentWidth, [1, 1, 1], 2)
  const pulse = renderBox(w0, `${BOLD}Node Pulse${RESET}`, nodePulseRows(spine))
  const commands = renderBox(
    w1,
    domainTitle(spine, view, 'Commands'),
    commandRows(view.activeDomain, spine.phase),
  )
  const metrics = renderBox(
    w2,
    domainTitle(spine, view, 'Metrics'),
    metricsRows(spine, view.activeDomain),
  )
  return joinBoxLines([pulse, commands, metrics], contentWidth)
}
