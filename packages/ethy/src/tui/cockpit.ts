import {
  formatQueueMeter,
  formatSnapBucketBar,
  snapAccountPaceNote,
  snapBucketsDoneCount,
} from '../spine/buckets.ts'
import type {
  CapabilityId,
  EthyPhase,
  EthySpine,
  PivotHealProgress,
  TuiViewState,
} from '../spine/types.ts'
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
const COCKPIT_CONTENT_ROWS = 5

function phaseLabel(spine: EthySpine): string {
  if (spine.phase === 'SNAP_SYNCING' && spine.pivotHeal !== undefined) {
    return `Healing ${healFraction(spine.pivotHeal)}`
  }
  switch (spine.phase) {
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

function healFraction(heal: PivotHealProgress): string {
  const total = heal.toBlock - heal.fromBlock + 1n
  let done = heal.nextBlock - heal.fromBlock
  if (done < 0n) done = 0n
  if (done > total) done = total
  return `${Number(done).toLocaleString('en-US')}/${Number(total).toLocaleString('en-US')}`
}

function formatBlockNum(n: bigint): string {
  return `#${n.toLocaleString('en-US')}`
}

/** Compact count for the pivot clause. Millions and ten-thousands use one decimal. */
function formatCarryAccounts(count: number): string {
  if (count >= 1_000_000) {
    const scaled = Math.round(count / 100_000) / 10
    const text = Number.isInteger(scaled) ? String(scaled) : scaled.toFixed(1)
    return `${text}M`
  }
  if (count >= 10_000) {
    const scaled = Math.round(count / 100) / 10
    const text = Number.isInteger(scaled) ? String(scaled) : scaled.toFixed(1)
    return `${text}k`
  }
  return count.toLocaleString('en-US')
}

function pivotPulseValue(spine: EthySpine): string {
  const heal = spine.pivotHeal
  if (
    spine.phase === 'SNAP_SYNCING' &&
    heal !== undefined &&
    spine.pivotBlockNumber !== undefined
  ) {
    return `${formatBlockNum(spine.pivotBlockNumber)} → ${formatBlockNum(heal.toBlock)}`
  }
  const base =
    spine.pivotBlockNumber !== undefined
      ? formatBlockNum(spine.pivotBlockNumber)
      : (spine.pivotStatusHint ?? 'Waiting for peer...')
  const carry = spine.pivotCarry
  if (
    carry === undefined ||
    carry.accounts <= 0 ||
    spine.phase === 'HEAD_FOLLOWING' ||
    spine.pivotBlockNumber === undefined
  ) {
    return base
  }
  const word = carry.kind === 'kept' ? 'kept' : 'previous'
  return `${base} · ${formatCarryAccounts(carry.accounts)} ${word}`
}

function accountPulseValue(spine: EthySpine): string {
  const bar = formatSnapBucketBar(spine.snapBuckets)
  const count = spine.totalAccountsSynced.toLocaleString('en-US')
  const rate = `~${Math.round(spine.accountsPerSec)}/s`
  const note = snapAccountPaceNote(spine.snapBuckets, {
    peerCount: spine.peers.size,
    phase: spine.phase,
  })
  return note.length > 0 ? `${bar} ${count} ${rate} ${note}` : `${bar} ${count} ${rate}`
}

function codePulseValue(spine: EthySpine): string {
  return queuePulseValue(spine.codesSynced, spine.codesQueued)
}

function storagePulseValue(spine: EthySpine): string {
  return queuePulseValue(spine.storageSlotsSynced, spine.storageQueued)
}

function queuePulseValue(synced: number, queued: number): string {
  const meter = formatQueueMeter(synced, queued)
  if (synced <= 0 && queued <= 0) return `${meter} —`
  const count = synced.toLocaleString('en-US')
  if (queued <= 0) return `${meter} ${count} done`
  return `${meter} ${count} ${queued.toLocaleString('en-US')} left`
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

function nodePulsePairs(spine: EthySpine): TwoColumnPair[] {
  return [
    { label: 'Phase', value: phaseLabel(spine) },
    { label: 'Pivot', value: pivotPulseValue(spine) },
    { label: 'Accounts', value: accountPulseValue(spine) },
    { label: 'Bytecode', value: codePulseValue(spine) },
    { label: 'Storage', value: storagePulseValue(spine) },
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
          value: spine.capabilities.head.status === 'locked' ? 'Locked' : 'Following',
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
