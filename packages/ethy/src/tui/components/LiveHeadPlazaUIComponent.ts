import { formatGwei, trendArrow } from '../../economy/format.ts'
import type { BlockMomentKind, EconomySnapshot } from '../../economy/types.ts'
import type { EthySpine } from '../../spine/types.ts'
import { BOLD, DIM, FG, RESET, visibleWidth } from '../ansi.ts'
import { COCKPIT_COLUMN_GAP } from '../cockpit.ts'
import { fixedField, fixedLine } from '../layout.ts'
import { innerRowWidth } from '../roundedBox.ts'
import type { DomainHelpColumnMetrics } from './DomainHelpUIComponent.ts'

const GAS_GLYPHS = '▁▂▃▄▅▆▇█'
const MUT_GLYPHS = '·░▒▓█'
const SLOT_SECONDS = 12

const BADGE_COLOR: Record<BlockMomentKind, string> = {
  birth: FG.green,
  choreography: FG.cyan,
  whale: FG.magenta,
  first_step: FG.cyan,
  veteran: FG.yellow,
  eip7702: FG.yellow,
  graffiti_note: FG.green,
  blob_anchor: FG.cyan,
  revert: FG.red,
  heartbeat: FG.magenta,
}

function gasGlyph(pct: number): string {
  const idx = Math.min(GAS_GLYPHS.length - 1, Math.max(0, Math.floor((pct / 100) * 7)))
  const ch = GAS_GLYPHS[idx]!
  const color = pct < 35 ? FG.cyan : pct <= 70 ? FG.yellow : FG.magenta
  return `${color}${ch}${RESET}`
}

function mutGlyph(value: number, max: number): string {
  if (value <= 0 || max <= 0) return '·'
  const ratio = value / max
  const idx = Math.min(MUT_GLYPHS.length - 1, Math.max(1, Math.ceil(ratio * 4)))
  return MUT_GLYPHS[idx]!
}

function barRow(label: string, fill: number, width: number, totalW: number): string {
  const labelW = Math.min(18, visibleWidth(label) + 1)
  const barW = 10
  const filled = Math.max(0, Math.min(barW, fill))
  const bar = `${'█'.repeat(filled)}${'░'.repeat(barW - filled)}`
  const line = `${BOLD}${label}${RESET} ${bar}`
  return fixedLine(line, totalW)
}

function formatUtcTime(sec: number): string {
  if (sec <= 0) return '--:--:--'
  const d = new Date(sec * 1000)
  const hh = String(d.getUTCHours()).padStart(2, '0')
  const mm = String(d.getUTCMinutes()).padStart(2, '0')
  const ss = String(d.getUTCSeconds()).padStart(2, '0')
  return `${hh}:${mm}:${ss}`
}

function slotBreathBar(elapsed: number, width: number): string {
  const parts: string[] = []
  for (let i = 0; i < SLOT_SECONDS; i++) {
    parts.push(i < elapsed ? '●' : '○')
  }
  const remain = Math.max(0, SLOT_SECONDS - elapsed)
  const core = parts.join('')
  const tail = ` next ~${remain}s`
  const raw = `${core}${tail}`
  if (visibleWidth(raw) <= width) return raw
  return truncateBreath(core, width)
}

function truncateBreath(core: string, width: number): string {
  if (width < 6) return '…'
  const short = core.slice(0, Math.max(4, width - 4))
  return `${short}…`
}

function wrapHeadline(text: string, maxW: number): [string, string | undefined] {
  if (visibleWidth(text) <= maxW) return [text, undefined]
  const words = text.split(/\s+/)
  let line1 = ''
  let i = 0
  for (; i < words.length; i++) {
    const next = line1.length === 0 ? words[i]! : `${line1} ${words[i]!}`
    if (visibleWidth(next) > maxW && line1.length > 0) break
    line1 = next
  }
  const rest = words.slice(i).join(' ')
  if (rest.length === 0) return [truncateVisiblePlain(text, maxW), undefined]
  return [line1, rest]
}

function truncateVisiblePlain(text: string, maxW: number): string {
  if (visibleWidth(text) <= maxW) return text
  let out = ''
  for (const ch of text) {
    if (visibleWidth(out + ch) > maxW - 1) return `${out}…`
    out += ch
  }
  return out
}

function nibbleSpark(heat: number, max: number): string {
  if (heat <= 0 || max <= 0) return '····'
  const ratio = heat / max
  let out = ''
  for (let i = 1; i <= 4; i++) {
    const threshold = i / 4
    out +=
      ratio >= threshold
        ? '█'
        : ratio >= threshold - 0.25
          ? '▓'
          : ratio >= threshold - 0.5
            ? '▒'
            : '░'
  }
  return out
}

export function renderLiveHeadPlazaUIComponent(
  spine: EthySpine,
  innerWidth: number,
  maxBodyLines: number,
  tick: number,
  colMetrics?: DomainHelpColumnMetrics,
): string[] {
  const w = Math.max(20, innerWidth)
  const econ = spine.economy
  const gutter = COCKPIT_COLUMN_GAP + 4
  let leftColW: number
  let rightColW: number
  if (colMetrics !== undefined && colMetrics.leftBoxOuterW > 8 && colMetrics.middleBoxOuterW > 8) {
    leftColW = innerRowWidth(colMetrics.leftBoxOuterW)
    rightColW = Math.max(12, w - leftColW - gutter)
  } else {
    leftColW = Math.max(16, Math.floor((w - gutter) / 2))
    rightColW = Math.max(12, w - leftColW - gutter)
  }
  const gapStr = ' '.repeat(gutter)
  const lines: string[] = []

  if (econ?.hasBlocks !== true) {
    lines.push(fixedLine(`${DIM}Waiting for the first verified block…${RESET}`, w))
    return lines
  }

  renderHorizon(lines, econ, spine, leftColW, rightColW, gapStr, w, tick)
  lines.push(fixedLine('', w))

  const leftLines = buildLeftColumn(econ, leftColW)
  const rightLines = buildRightColumn(econ, rightColW, maxBodyLines - lines.length - 1)
  const rowCount = Math.min(
    maxBodyLines - lines.length,
    Math.max(leftLines.length, rightLines.length),
  )
  for (let i = 0; i < rowCount; i++) {
    const l = fixedField(leftLines[i] ?? '', leftColW)
    const r = fixedField(rightLines[i] ?? '', rightColW)
    lines.push(fixedLine(`${l}${gapStr}${r}`, w))
  }
  return lines
}

function renderHorizon(
  lines: string[],
  econ: EconomySnapshot,
  spine: EthySpine,
  leftColW: number,
  rightColW: number,
  gapStr: string,
  w: number,
  tick: number,
): void {
  const skyW = Math.max(8, Math.min(36, leftColW - 2))
  const skyline = econ.skyline ?? []
  let mutMax = 1
  for (const p of skyline) mutMax = Math.max(mutMax, p.mutation)
  let gasRow = ''
  let mutRow = ''
  const start = Math.max(0, skyline.length - skyW)
  for (let i = start; i < skyline.length; i++) {
    const p = skyline[i]!
    gasRow += gasGlyph(p.gasFullPct)
    mutRow += mutGlyph(p.mutation, mutMax)
  }
  gasRow = gasRow.padEnd(skyW, ' ')
  mutRow = mutRow.padEnd(skyW, ' ')
  const ruler = '───┴' + '─'.repeat(Math.max(0, skyW - 4)) + (skyW >= 4 ? '┴' : '')
  const blockN = econ.latestBlockNumber ?? '—'
  const graffiti = econ.latestProposerGraffiti
  const blockLine =
    graffiti !== undefined && graffiti.length > 0
      ? `${BOLD}Block #${blockN}${RESET} · "${graffiti}"`
      : `${BOLD}Block #${blockN}${RESET} · Proposer verified`
  const baseFee = econ.baseFeeGwei ?? '—'
  const trend = trendArrow(econ.trend)
  const txs = econ.txCount ?? 0
  const writes = econ.storageWrites ?? 0
  const bls = spine.clParticipationPct !== undefined ? spine.clParticipationPct.toFixed(1) : '—'
  const statsLine = `${txs} txs · ${baseFee} Gwei${trend} · ${writes} writes · ${bls}% BLS`

  const nowSec = Math.floor(Date.now() / 1000)
  const ts = econ.latestBlockTimestamp
  let elapsed =
    ts !== undefined && ts > 0
      ? Math.min(SLOT_SECONDS, Math.max(0, nowSec - ts))
      : tick % SLOT_SECONDS
  const slotLine = slotBreathBar(elapsed, rightColW)

  const rows = [
    { l: gasRow, r: blockLine },
    { l: mutRow, r: statsLine },
    { l: ruler.slice(0, skyW), r: slotLine },
  ]
  for (const row of rows) {
    const l = fixedField(row.l, leftColW)
    const r = fixedField(row.r, rightColW)
    lines.push(fixedLine(`${l}${gapStr}${r}`, w))
  }
}

function buildLeftColumn(econ: EconomySnapshot, colW: number): string[] {
  const out: string[] = []
  out.push(fixedLine(`${BOLD}● BLOCK ANATOMY (#${econ.latestBlockNumber ?? '—'})${RESET}`, colW))
  const split = econ.txTypeSplit
  const txMax = Math.max(1, econ.txCount ?? 1)
  const bars: Array<{ label: string; count: number }> = [
    { label: 'EIP-1559', count: split?.feeMarket ?? 0 },
    { label: 'EIP-4844', count: split?.blob ?? 0 },
    { label: 'EIP-7702', count: split?.setCode ?? 0 },
    { label: 'Contracts', count: econ.activeAccounts ?? 0 },
  ]
  for (const b of bars) {
    const fill = Math.round((10 * b.count) / txMax)
    out.push(barRow(b.label, fill, 10, colW))
  }
  out.push(fixedLine('', colW))
  out.push(fixedLine(`${BOLD}● NEIGHBORHOOD LIGHTS (0x0..0xf)${RESET}`, colW))
  const heat = econ.nibbleHeat ?? new Array(16).fill(0)
  let maxH = 1
  for (const h of heat) maxH = Math.max(maxH, h)
  for (let row = 0; row < 4; row++) {
    const cells: string[] = []
    for (let col = 0; col < 4; col++) {
      const i = row * 4 + col
      const spark = nibbleSpark(heat[i] ?? 0, maxH)
      cells.push(`0x${i.toString(16)} ${spark}`)
    }
    out.push(fixedLine(cells.join('  '), colW))
  }
  return out
}

function buildRightColumn(econ: EconomySnapshot, colW: number, budget: number): string[] {
  const out: string[] = []
  out.push(fixedLine(`${BOLD}● STREET ENCOUNTERS${RESET}`, colW))
  const moments = econ.moments ?? []
  const badgeW = 6
  const timeW = 8
  const textW = Math.max(8, colW - timeW - badgeW - 2)
  let used = 1
  for (const m of moments) {
    if (used >= budget - 1) break
    const color = BADGE_COLOR[m.kind] ?? RESET
    const [line1, line2] = wrapHeadline(m.headline, textW)
    const prefix = `${DIM}${formatUtcTime(m.timestampSec)}${RESET} ${color}${BOLD}${m.badge}${RESET} `
    const padPrefix = ' '.repeat(timeW + badgeW + 1)
    out.push(fixedLine(`${prefix}${line1}`, colW))
    used += 1
    if (line2 !== undefined && used < budget) {
      out.push(fixedLine(`${DIM}${padPrefix}${line2}${RESET}`, colW))
      used += 1
    }
  }
  if (moments.length === 0) {
    out.push(fixedLine(`${DIM}No moments yet — watch the next block…${RESET}`, colW))
  }
  return out
}
