import { economyCockpitPairs } from '../economy/cockpitPairs.ts'
import {
  computeAccountRangeFraction,
  computeSnapProgressPct,
  formatProgressBar,
  snapBucketsDoneCount,
} from '../spine/buckets.ts'
import { localVerifiedBlock, resolveChainHeadClock } from '../spine/chainHead.ts'
import type { CapabilityId, EthySpine, TuiViewState } from '../spine/types.ts'
import { BOLD, RESET } from './ansi.ts'
import { capabilityMark } from './capabilityMark.ts'
import { economyForCockpitDisplay } from './economyCockpitBuffer.ts'
import {
  type TwoColumnPair,
  formatTwoColumnRows,
  maxLabelWidth,
  widthsFromWeights,
} from './layout.ts'
import { innerRowWidth, joinBoxColumns, renderBox } from './roundedBox.ts'

const BOX_LABEL: Record<CapabilityId, string> = {
  state: 'State',
  economy: 'Economy',
  p2p: 'P2P',
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

function estimateAccountSyncEtaMin(spine: EthySpine): number | undefined {
  if (spine.snapEtaMinutes !== undefined && spine.snapEtaMinutes > 0) {
    return spine.snapEtaMinutes
  }
  const frac = computeAccountRangeFraction(spine.snapBuckets)
  const perMin =
    spine.accountsPerMin !== undefined && spine.accountsPerMin > 0
      ? spine.accountsPerMin
      : spine.accountsPerSec * 60
  if (frac < 0.005 || frac >= 1 || perMin <= 0 || spine.totalAccountsSynced <= 0) {
    return undefined
  }
  const remainingAccounts = spine.totalAccountsSynced * ((1 - frac) / frac)
  return remainingAccounts / perMin
}

function snapTargetRow(spine: EthySpine): string {
  const pivot = spine.pivotBlockNumber
  if (pivot === undefined) {
    return spine.pivotStatusHint ?? 'Awaiting peer head…'
  }
  const bridging = spine.pivotBridging
  if (bridging !== undefined) {
    const remaining =
      bridging.targetBlock > bridging.currentBlock
        ? bridging.targetBlock - bridging.currentBlock
        : 0n
    return `${formatBlockNum(bridging.fromBlock)} → ${formatBlockNum(bridging.targetBlock)} (+${remaining.toLocaleString('en-US')} BALs)`
  }
  const rawTip = spine.bestPeerHead ?? spine.headBlockNumber ?? pivot
  const tip = rawTip > pivot ? rawTip : pivot
  if (spine.syncTransport === 'ethy') {
    return `${formatBlockNum(pivot)} → ${formatBlockNum(tip)} · ETHY/0 swarm`
  }
  const buffered = spine.bufferedBalCount ?? 0
  const steps = spine.pivotStepsCompleted ?? 0
  return `${formatBlockNum(pivot)} → ${formatBlockNum(tip)} · +${buffered} BALs · step ${steps}`
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
    if (spine.pivotBridging !== undefined) {
      const bridge = spine.pivotBridging
      const span =
        bridge.targetBlock > bridge.fromBlock ? bridge.targetBlock - bridge.fromBlock : 1n
      const done =
        bridge.currentBlock > bridge.fromBlock ? bridge.currentBlock - bridge.fromBlock : 0n
      const pct = span > 0n ? Number((done * 100n) / span) : 0
      const remainingBridge =
        bridge.targetBlock > bridge.currentBlock
          ? Number(bridge.targetBlock - bridge.currentBlock)
          : 0
      const bridgeRate = bridge.blocksPerSec
      const bridgeEta =
        bridgeRate !== undefined && bridgeRate > 0 && remainingBridge > 0
          ? remainingBridge / bridgeRate / 60
          : undefined
      const bridgeRateText =
        bridgeRate !== undefined && bridgeRate > 0 ? ` · ${Math.round(bridgeRate)}/s` : ''
      return [
        { label: 'Stage', value: 'Snap Resume · Bridging' },
        { label: 'Target', value: snapTargetRow(spine) },
        { label: 'Progress', value: formatProgressBar(pct, bridgeEta) },
        {
          label: 'State',
          value: `${formatCompactCount(spine.totalAccountsSynced)} acc kept · applying BALs${bridgeRateText}`,
        },
      ]
    }
    const allBucketsDone = snapBucketsDoneCount(spine.snapBuckets) === 16
    if (!allBucketsDone) {
      const rate = Math.round(spine.accountsPerSec).toLocaleString('en-US')
      const pct = computeSnapProgressPct(spine)
      const etaMin = estimateAccountSyncEtaMin(spine)
      const ethyTransport = spine.syncTransport === 'ethy'
      const seedBits = (spine.ethyBucketsBitmask ?? 0).toString(2).replace(/0/g, '').length
      const seedHint =
        !ethyTransport && seedBits > 0 ? ` · seed ${seedBits}/16` : ethyTransport ? ' (ETHY/0)' : ''
      return [
        { label: 'Stage', value: ethyTransport ? 'Ethy Sync · Accounts' : 'Snap Sync · Accounts' },
        { label: 'Target', value: snapTargetRow(spine) },
        { label: 'Progress', value: formatProgressBar(pct, etaMin) },
        {
          label: 'State',
          value: `${formatCompactCount(spine.totalAccountsSynced)} acc · ${rate}/s${seedHint}`,
        },
      ]
    }
    const codeTotal = Math.max(spine.codesTotal ?? 0, spine.codesSynced + spine.codesQueued)
    const storSynced = spine.storageAccountsSynced ?? 0
    const storTotal = Math.max(spine.storageAccountsTotal ?? 0, storSynced + spine.storageQueued)
    const bytecodePending = codeTotal > 0 && spine.codesSynced < codeTotal
    const stage = bytecodePending ? 'Snap Sync · Bytecode' : 'Snap Sync · Storage'
    const rate =
      (spine.contractsPerSec ?? 0) > 0 ? ` · ${Math.round(spine.contractsPerSec ?? 0)}/s` : ''
    return [
      { label: 'Stage', value: stage },
      { label: 'Target', value: snapTargetRow(spine) },
      {
        label: 'Progress',
        value: formatProgressBar(computeSnapProgressPct(spine), spine.storageEtaMinutes),
      },
      {
        label: 'State',
        value: `code ${formatCompactCount(spine.codesSynced)}/${formatCompactCount(codeTotal)} · stor ${formatCompactCount(storSynced)}/${formatCompactCount(storTotal)} (${formatCompactCount(spine.storageSlotsSynced)} slots)${rate}`,
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
    const rate = catchUp?.blocksPerSec
    const etaMin =
      rate !== undefined && rate > 0 && remaining > 0 ? remaining / rate / 60 : undefined
    const rateText = rate !== undefined && rate > 0 ? ` · ${Math.round(rate)}/s` : ''
    return [
      { label: 'Stage', value: 'BAL Catch-Up' },
      {
        label: 'Target',
        value: `${formatBlockNum(from)} → +${remaining.toLocaleString('en-US')} blk`,
      },
      { label: 'Progress', value: formatProgressBar(pct, etaMin) },
      {
        label: 'State',
        value: `${applied.toLocaleString('en-US')} / ${total.toLocaleString('en-US')} BALs applied${rateText}`,
      },
    ]
  }

  if (phase === 'HEAD_FOLLOWING') {
    const head = localVerifiedBlock(spine)
    const chainHead = resolveChainHeadClock(spine)?.chainHeadBlock
    const lag =
      head !== undefined && chainHead !== undefined && chainHead > head ? chainHead - head : 0n
    let targetSuffix = '(live)'
    if (lag >= 2n) targetSuffix = `(live · -${lag.toString()} blk)`
    else if (lag === 1n) targetSuffix = '(live · -1 blk)'
    const balCount = spine.appliedBalCount ?? spine.balWindow.length
    const acc = formatCompactCount(spine.totalAccountsSynced)
    const codeCount = spine.codesSynced ?? 0
    const clLabel =
      spine.clStatus === 'verified'
        ? 'verified'
        : spine.clStatus === 'p2p_only'
          ? 'p2p only'
          : (spine.clStatus ?? '—')
    const stateValue =
      codeCount > 0
        ? `${acc} acc · ${formatCompactCount(codeCount)} code · ${balCount.toLocaleString('en-US')} BALs`
        : `${acc} acc · ${balCount.toLocaleString('en-US')} BALs · CL ${clLabel}`
    return [
      { label: 'Stage', value: '★ Head Following · Live' },
      {
        label: 'Target',
        value: head !== undefined ? `${formatBlockNum(head)} ${targetSuffix}` : '—',
      },
      { label: 'Progress', value: `${formatProgressBar(100)} (synced)` },
      { label: 'State', value: stateValue },
    ]
  }

  return [
    { label: 'Stage', value: '—' },
    { label: 'Target', value: '—' },
    { label: 'Progress', value: formatProgressBar(0) },
    { label: 'State', value: '—' },
  ]
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

function ethySessionCount(spine: EthySpine): number {
  let n = 0
  for (const p of spine.peers.values()) {
    if (p.ethySession === true) n++
  }
  return n
}

function formatServeBytes(bytes: number): string {
  if (bytes >= 1_048_576) return `${(bytes / 1_048_576).toFixed(1)} MB`
  if (bytes >= 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${bytes} B`
}

function countBits16(mask: number): number {
  let n = 0
  for (let i = 0; i < 16; i++) {
    if ((mask >> i) & 1) n++
  }
  return n
}

function servedMetric(spine: EthySpine): string {
  const s = spine.serving
  const ethBlocks = s?.blocksStored ?? 0
  const ethyBuckets = countBits16(spine.ethyBucketsBitmask ?? 0)
  const engineTag = `(eth ${ethBlocks}b · ethy ${ethyBuckets}/16)`
  if (s === undefined) return `0 replies ${engineTag}`
  if (s.totalRequestsServed > 0) {
    return `${s.totalRequestsServed} replies · ${formatServeBytes(s.totalBytesServed)} ${engineTag}`
  }
  if (ethBlocks > 0 || ethyBuckets > 0) {
    return `0 replies ${engineTag}`
  }
  return '0 replies'
}

function p2pMetricsPairs(spine: EthySpine): TwoColumnPair[] {
  return [
    {
      label: 'Peers',
      value: `${spine.peers.size} connected (${ethySessionCount(spine)} ethy · ${snapSessionCount(spine)} snap)`,
    },
    { label: 'Served', value: servedMetric(spine) },
    { label: 'Latency', value: avgLatency(spine) },
    { label: 'Clients', value: clientFamilies(spine) },
  ]
}

export function cockpitBoxTitle(spine: EthySpine, view: TuiViewState, id: CapabilityId): string {
  void view
  const mark = capabilityMark(id, spine.capabilities[id].status)
  const label = BOX_LABEL[id]
  return `${mark} ${BOLD}${label}${RESET}`
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
  const econP = economyCockpitPairs(economyForCockpitDisplay(spine.economy))
  const metP = p2pMetricsPairs(spine)
  const labelW = maxLabelWidth([...pulseP, ...econP, ...metP])

  const pulseLines = formatTwoColumnRows(pulseP, labelW, innerRowWidth(w0))
  const econLines = formatTwoColumnRows(econP, labelW, innerRowWidth(w1))
  const metLines = formatTwoColumnRows(metP, labelW, innerRowWidth(w2))

  while (pulseLines.length < COCKPIT_CONTENT_ROWS) pulseLines.push('')
  while (econLines.length < COCKPIT_CONTENT_ROWS) econLines.push('')
  while (metLines.length < COCKPIT_CONTENT_ROWS) metLines.push('')

  const economy = renderBox(
    w0,
    cockpitBoxTitle(spine, view, 'economy'),
    econLines.slice(0, COCKPIT_CONTENT_ROWS),
  )
  const state = renderBox(
    w1,
    cockpitBoxTitle(spine, view, 'state'),
    pulseLines.slice(0, COCKPIT_CONTENT_ROWS),
  )
  const p2p = renderBox(
    w2,
    cockpitBoxTitle(spine, view, 'p2p'),
    metLines.slice(0, COCKPIT_CONTENT_ROWS),
  )
  return joinBoxColumns([economy, state, p2p], contentWidth)
}
