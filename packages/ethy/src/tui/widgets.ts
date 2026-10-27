import type { CapabilityReadiness, WidgetSpec } from '../spine/types.ts'
import { BOLD, DIM, RESET, padVisible, truncateVisible } from './ansi.ts'
import { type CapabilityId, capabilityMark } from './capabilityMark.ts'
import { composeFixedRow, fixedLine } from './layout.ts'

/** How often the suggestion carousel advances to the next set. */
export const CAROUSEL_INTERVAL_MS = 12_000

export type SuggestionMarks = {
  p2p: CapabilityReadiness
  snap: CapabilityReadiness
  head: CapabilityReadiness
}

export function renderWidgetLines(
  widget: WidgetSpec,
  innerWidth: number,
  marks?: SuggestionMarks,
): string[] {
  const lines: string[] = []
  const w = Math.max(20, innerWidth)

  switch (widget.kind) {
    case 'onboarding_carousel':
      for (const line of widget.lines) {
        const id: CapabilityId =
          line.group === 'P2P' ? 'p2p' : line.group === 'SNAP' ? 'snap' : 'head'
        const status =
          id === 'p2p'
            ? (marks?.p2p ?? 'locked')
            : id === 'snap'
              ? (marks?.snap ?? 'locked')
              : (marks?.head ?? 'locked')
        const prefix = capabilityMark(id, status)
        const half = Math.floor(w / 2)
        lines.push(
          composeFixedRow(
            w,
            [
              { text: `${prefix} ${line.command}`, width: half },
              { text: `${prefix} ${line.prose}`, width: w - half },
            ],
            0,
          ),
        )
      }
      break
    case 'table':
      if (widget.title) {
        lines.push(fixedLine(`${BOLD}${widget.title}${RESET}`, w))
      }
      lines.push(
        ...renderTable(widget.headers, widget.rows, w, tableColWeights(widget.headers.length)),
      )
      break
    case 'key_value':
      if (widget.title) {
        lines.push(fixedLine(`${BOLD}${widget.title}${RESET}`, w))
      }
      for (const e of widget.entries) {
        lines.push(fixedLine(`${DIM}${e.key}:${RESET} ${e.value}`, w))
      }
      break
  }

  if (widget.assistantComment) {
    lines.push(fixedLine(`${DIM}> ${widget.assistantComment}${RESET}`, w))
  }

  return lines
}

/** Stable column proportions — widths do not change when cell text length changes. */
function tableColWeights(colCount: number): number[] {
  if (colCount === 5) return [1, 3, 2, 1, 2]
  if (colCount === 2) return [1, 2]
  return Array.from({ length: colCount }, () => 1)
}

function renderTable(
  headers: string[],
  rows: string[][],
  maxWidth: number,
  weights: number[],
): string[] {
  const colCount = headers.length
  const inner = Math.max(8, maxWidth - 4)
  const gap = 3
  const gapTotal = Math.max(0, colCount - 1) * gap
  const budget = Math.max(colCount * 4, inner - gapTotal)
  const sum = weights.reduce((a, b) => a + b, 0)
  const colWidths = weights.map((wt) => Math.max(4, Math.floor((budget * wt) / sum)))
  let used = colWidths.reduce((a, b) => a + b, 0) + gapTotal
  while (used > inner && colWidths.some((cw) => cw > 4)) {
    const i = colWidths.indexOf(Math.max(...colWidths))
    colWidths[i] = Math.max(4, (colWidths[i] ?? 4) - 1)
    used = colWidths.reduce((a, b) => a + b, 0) + gapTotal
  }

  const sep = colWidths.map((cw) => '─'.repeat(cw)).join('─┼─')
  const fmtRow = (cells: string[]) =>
    cells
      .map((cell, i) => padVisible(truncateVisible(cell, colWidths[i] ?? 8), colWidths[i] ?? 8))
      .join(' │ ')

  const out: string[] = []
  const top = fixedLine(`┌─${sep}─┐`, maxWidth)
  out.push(top)
  out.push(fixedLine(`│ ${fmtRow(headers)} │`, maxWidth))
  out.push(fixedLine(`├─${sep}─┤`, maxWidth))
  for (const row of rows) {
    out.push(fixedLine(`│ ${fmtRow(row)} │`, maxWidth))
  }
  out.push(fixedLine(`└─${sep}─┘`, maxWidth))
  return out
}

const COMMAND_SETS = [
  [
    { group: 'P2P' as const, command: '/peers — latency table by client' },
    { group: 'SNAP' as const, command: '/buckets — 16 hex segments at a glance' },
    { group: 'HEAD' as const, command: '/account — inspect once head is verified' },
  ],
  [
    { group: 'P2P' as const, command: '/drop — remove one peer' },
    { group: 'SNAP' as const, command: '/reassign — hand a bucket to another peer' },
    { group: 'HEAD' as const, command: '/bal — latest block access list' },
  ],
  [
    { group: 'P2P' as const, command: '/diag — recent diagnostics' },
    { group: 'SNAP' as const, command: '/snap — bucket progress' },
    { group: 'HEAD' as const, command: '/simulate — run a transaction at head' },
  ],
]

const PROSE_SETS = [
  [
    'Which clients are connected and how fast are they?',
    'Why is bucket 0x3 stalled while 0x4 syncs?',
    'What changed in the latest block access list?',
  ],
  [
    'Who is the slowest peer right now?',
    'Which snap range is stuck?',
    'Show the account stored at the head.',
  ],
  [
    'How many peers speak snap?',
    'Is the proof for bucket 0x7 ready?',
    'What would this transfer change in state?',
  ],
]

export function defaultCarousel(tick: number): WidgetSpec {
  const commands = COMMAND_SETS[tick % COMMAND_SETS.length] ?? COMMAND_SETS[0]
  const prose = PROSE_SETS[tick % PROSE_SETS.length] ?? PROSE_SETS[0]
  const lines = commands.map((row, i) => ({
    group: row.group,
    command: row.command,
    prose: prose[i] ?? '',
  }))
  return { kind: 'onboarding_carousel', lines }
}
