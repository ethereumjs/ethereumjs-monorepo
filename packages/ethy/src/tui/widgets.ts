import type { CapabilityReadiness, WidgetSpec } from '../spine/types.ts'
import type { CapabilityId } from '../spine/types.ts'
import { BOLD, DIM, RESET, padVisible, truncateVisible } from './ansi.ts'
import { capabilityMark } from './capabilityMark.ts'
import {
  type TwoColumnPair,
  composeFixedRow,
  fixedLine,
  formatTwoColumnRows,
  maxLabelWidth,
} from './layout.ts'

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
            2,
          ),
        )
      }
      break
    case 'table':
      if (widget.title) {
        lines.push(fixedLine(`${BOLD}${widget.title}${RESET}`, w))
      }
      lines.push(...renderTable(widget.headers, widget.rows, w))
      break
    case 'key_value':
      if (widget.title) {
        lines.push(fixedLine(`${BOLD}${widget.title}${RESET}`, w))
      }
      {
        const pairs: TwoColumnPair[] = widget.entries.map((e) => ({
          label: `${DIM}${e.key}${RESET}`,
          value: e.value,
        }))
        const lw = maxLabelWidth(pairs)
        for (const row of formatTwoColumnRows(pairs, lw, w)) {
          lines.push(fixedLine(row, w))
        }
      }
      break
  }

  if (widget.assistantComment) {
    lines.push(fixedLine(`${DIM}> ${widget.assistantComment}${RESET}`, w))
  }

  return lines
}

type ColPlan = { min: number; flex: number }

/**
 * Expected width for a known table. `min` fits the header or a typical value,
 * with a little slack. `flex` takes leftover width (the long column).
 * Widths stay fixed as cell text changes.
 */
const TABLE_PLANS: Record<string, ColPlan[]> = {
  'Time|Subsystem|Sev|Peer|Message': [
    { min: 10, flex: 0 },
    { min: 12, flex: 0 },
    { min: 8, flex: 0 },
    { min: 8, flex: 0 },
    { min: 28, flex: 1 },
  ],
  'Peer|Client|Caps|Avg ms|Last issue': [
    { min: 18, flex: 1 },
    { min: 16, flex: 1 },
    { min: 18, flex: 2 },
    { min: 8, flex: 0 },
    { min: 20, flex: 3 },
  ],
  'Bucket|Status|Peer|Accounts|Issue': [
    { min: 8, flex: 0 },
    { min: 16, flex: 0 },
    { min: 14, flex: 1 },
    { min: 10, flex: 0 },
    { min: 18, flex: 3 },
  ],
  'Account|Balance (ETH)|Nonce|Contract|Storage root': [
    { min: 22, flex: 2 },
    { min: 14, flex: 0 },
    { min: 8, flex: 0 },
    { min: 10, flex: 0 },
    { min: 16, flex: 1 },
  ],
  'Account|Balance (ETH)|Nonce': [
    { min: 22, flex: 2 },
    { min: 14, flex: 0 },
    { min: 8, flex: 0 },
  ],
  'Command|Description': [
    { min: 22, flex: 0 },
    { min: 24, flex: 1 },
  ],
}

function planFor(headers: string[]): ColPlan[] {
  const known = TABLE_PLANS[headers.join('|')]
  if (known !== undefined && known.length === headers.length) return known
  return headers.map((header, index) => ({
    min: Math.max(4, header.length + 2),
    flex: index === headers.length - 1 ? 1 : 0,
  }))
}

function shrinkColumns(
  widths: number[],
  plans: ColPlan[],
  overflow: number,
  flexOnly: boolean,
  floor: number,
): number {
  const order = plans
    .map((plan, index) => index)
    .filter((index) => (flexOnly ? plans[index].flex > 0 : true))
    .sort((a, b) => plans[b].flex - plans[a].flex || b - a)
  for (const index of order) {
    if (overflow <= 0) break
    const can = widths[index] - floor
    if (can <= 0) continue
    const cut = Math.min(can, overflow)
    widths[index] -= cut
    overflow -= cut
  }
  return overflow
}

/** Column widths for a table of `maxWidth`, including the box border. */
export function layoutTableColumns(headers: string[], maxWidth: number): number[] {
  const inner = Math.max(headers.length, maxWidth - 4)
  const gapTotal = Math.max(0, headers.length - 1) * 3
  const budget = Math.max(headers.length, inner - gapTotal)
  const plans = planFor(headers)
  const widths = plans.map((plan) => plan.min)
  let used = widths.reduce((sum, width) => sum + width, 0)

  if (used > budget) {
    let overflow = shrinkColumns(widths, plans, used - budget, true, 4)
    if (overflow > 0) shrinkColumns(widths, plans, overflow, false, 1)
    return widths
  }

  const extra = budget - used
  const flexSum = plans.reduce((sum, plan) => sum + plan.flex, 0)
  if (extra === 0) return widths
  if (flexSum <= 0) {
    widths[widths.length - 1] += extra
    return widths
  }
  let given = 0
  for (let i = 0; i < widths.length; i++) {
    const share = Math.floor((extra * plans[i].flex) / flexSum)
    widths[i] += share
    given += share
  }
  let best = 0
  for (let i = 1; i < plans.length; i++) {
    if (plans[i].flex >= plans[best].flex) best = i
  }
  widths[best] += extra - given
  return widths
}

function renderTable(headers: string[], rows: string[][], maxWidth: number): string[] {
  const colWidths = layoutTableColumns(headers, maxWidth)

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
