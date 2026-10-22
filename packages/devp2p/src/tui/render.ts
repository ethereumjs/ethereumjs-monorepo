import {
  BOLD,
  DIM,
  FG,
  RESET,
  invertedProtocolTag,
  padVisible,
  stripAnsi,
  visibleWidth,
} from './ansi.ts'
import { formatPeerLabel } from './model.ts'
import { pairTranscripts } from './pairs.ts'

import type { PaneState, TranscriptLine } from './model.ts'
import type { ActionPair } from './pairs.ts'

export type TuiLayout = {
  cols: number
  rows: number
  leftWidth: number
  rightWidth: number
  /** Rows available for action boxes (below the status line, above the prompts). */
  transcriptRows: number
}

export type TuiViewModel = {
  left: PaneState
  right: PaneState
  leftDraft: string
  rightDraft: string
  focus: 'left' | 'right'
  rightHasPrompt: boolean
  footerHint: string
}

const CHROME_ROWS = 4

export function computeLayout(cols: number, rows: number): TuiLayout {
  const safeCols = Math.max(40, cols)
  const safeRows = Math.max(12, rows)
  const gutter = 1
  const leftWidth = Math.floor((safeCols - gutter) / 2)
  const rightWidth = safeCols - gutter - leftWidth
  const transcriptRows = Math.max(4, safeRows - CHROME_ROWS)
  return { cols: safeCols, rows: safeRows, leftWidth, rightWidth, transcriptRows }
}

export function renderTui(view: TuiViewModel, layout: TuiLayout): string {
  const lines: string[] = []
  lines.push(splitRow(formatPaneTitle(view.left), formatPaneTitle(view.right), layout, true))
  lines.push(splitRow(formatStatus(view.left), formatStatus(view.right), layout, false))

  const mode = view.rightHasPrompt ? 'mirror' : 'echo'
  const pairs = pairTranscripts(view.left.transcript, view.right.transcript, mode)
  const leftInner = Math.max(1, layout.leftWidth - 2)
  const rightInner = Math.max(1, layout.rightWidth - 2)
  const visible = selectPairs(pairs, leftInner, rightInner, layout.transcriptRows)
  if (visible.length === 0) {
    lines.push(`${DIM}(no messages yet)${RESET}`)
  }
  for (const pair of visible) {
    lines.push(...renderPair(pair, leftInner, rightInner))
  }

  lines.push(
    splitRow(
      formatPrompt(view.left.status.nodeName, view.leftDraft, view.focus === 'left'),
      promptRight(view),
      layout,
      false,
    ),
  )
  lines.push(`${DIM}${fitPlain(view.footerHint, layout.cols)}${RESET}`)
  return `${lines.join('\n')}\x1b[0J`
}

function splitRow(left: string, right: string, layout: TuiLayout, bold: boolean): string {
  const l = padVisible(fitVisible(left, layout.leftWidth), layout.leftWidth)
  const r = padVisible(fitVisible(right, layout.rightWidth), layout.rightWidth)
  const row = `${l} ${r}`
  return bold ? `${BOLD}${row}${RESET}` : row
}

function formatPaneTitle(pane: PaneState): string {
  const addr = pane.status.listenLabel ?? '…'
  if (pane.status.remoteViewLabel) {
    return `${pane.status.nodeName}  ${addr}  →  ${pane.status.remoteViewLabel}`
  }
  return `${pane.status.nodeName}  ${addr}`
}

function formatStatus(pane: PaneState): string {
  const s = pane.status
  const peer = formatPeerLabel(s.lastPeer)
  const peers =
    s.rlpxPeerCount === 0
      ? 'RLPx 0 peers'
      : `RLPx ${s.rlpxPeerCount} peer${s.rlpxPeerCount === 1 ? '' : 's'}${peer ? `  ${peer}` : ''}`
  const ethOut = s.ethStatusSent ? 'out' : '—'
  const ethIn = s.ethStatusReceived ? 'in' : '—'
  const client = s.remoteClientId ? `  ${s.remoteClientId}` : ''
  const attach = s.attachedOnly ? '  attached' : ''
  return `${peers}${client}  ETH ${ethOut}/${ethIn}${attach}`
}

function promptRight(view: TuiViewModel): string {
  if (!view.rightHasPrompt) return `${DIM}${view.right.status.nodeName} (remote view)${RESET}`
  return formatPrompt(view.right.status.nodeName, view.rightDraft, view.focus === 'right')
}

function formatPrompt(name: string, draft: string, focused: boolean): string {
  const cursor = focused ? `${BOLD}>${RESET}` : `${DIM}>${RESET}`
  const border = focused ? BOLD : DIM
  return `${border}${name}${RESET}${cursor} ${draft}${focused ? '▌' : ''}`
}

type DrawnPair = {
  pair: ActionPair
  /** Inner rows to draw; the shorter side is blank-filled to this height. */
  inner: number
}

function selectPairs(
  pairs: ActionPair[],
  leftInner: number,
  rightInner: number,
  maxRows: number,
): DrawnPair[] {
  const drawn: DrawnPair[] = []
  let used = 0
  for (let i = pairs.length - 1; i >= 0; i--) {
    const pair = pairs[i]!
    const inner = pairInnerHeight(pair, leftInner, rightInner)
    const height = inner + 2
    if (used + height <= maxRows) {
      drawn.unshift({ pair, inner })
      used += height
      continue
    }
    if (drawn.length === 0 && maxRows >= 3) {
      drawn.unshift({ pair, inner: maxRows - 2 })
    }
    break
  }
  return drawn
}

function pairInnerHeight(pair: ActionPair, leftInner: number, rightInner: number): number {
  return Math.max(
    sideLines(pair.left, leftInner).length,
    sideLines(pair.right, rightInner).length,
    1,
  )
}

function sideLines(entries: TranscriptLine[], inner: number): string[] {
  const lines: string[] = []
  for (const entry of entries) {
    if (lines.length > 0) lines.push('')
    lines.push(...entryLines(entry, inner))
  }
  return lines
}

function renderPair(drawn: DrawnPair, leftInner: number, rightInner: number): string[] {
  const leftLines = sideLines(drawn.pair.left, leftInner)
  const rightLines = sideLines(drawn.pair.right, rightInner)
  const leftShown = clipLines(leftLines, drawn.inner)
  const rightShown = clipLines(rightLines, drawn.inner)
  const rows: string[] = [boxEdge(leftInner, '┌', '┐') + ' ' + boxEdge(rightInner, '┌', '┐')]
  for (let i = 0; i < drawn.inner; i++) {
    rows.push(
      boxContent(leftShown[i] ?? '', leftInner) + ' ' + boxContent(rightShown[i] ?? '', rightInner),
    )
  }
  rows.push(boxEdge(leftInner, '└', '┘') + ' ' + boxEdge(rightInner, '└', '┘'))
  return rows
}

function clipLines(lines: string[], inner: number): string[] {
  if (lines.length <= inner) return lines
  if (inner <= 1) return lines.slice(0, 1)
  return [lines[0]!, `${DIM}…${RESET}`, ...lines.slice(lines.length - (inner - 2))]
}

function entryLines(entry: TranscriptLine, innerWidth: number): string[] {
  const tag = invertedProtocolTag(entry.layer)
  const dir = entry.dir === 'in' ? `${FG.cyan}in${RESET}` : `${FG.yellow}out${RESET}`
  const nameRoom = Math.max(0, innerWidth - visibleWidth(tag) - 2 - entry.dir.length - 2)
  const lines = [`${tag}  ${dir}  ${fitPlain(entry.name, nameRoom)}`]
  if (entry.message) lines.push(fitPlain(`  ${entry.message}`, innerWidth))
  for (const pl of entry.payloadLines) {
    lines.push(fitPlain(`  ${pl}`, innerWidth))
  }
  return lines
}

function boxEdge(inner: number, left: string, right: string): string {
  return `${FG.blue}${left}${'─'.repeat(inner)}${right}${RESET}`
}

function boxContent(text: string, inner: number): string {
  return `${FG.blue}│${RESET}${padVisible(fitVisible(text, inner), inner)}${FG.blue}│${RESET}`
}

/** Keep colors when the string already fits; otherwise plain-text ellipsis. */
function fitVisible(s: string, max: number): string {
  if (visibleWidth(s) <= max) return s
  return fitPlain(stripAnsi(s), max)
}

function fitPlain(s: string, max: number): string {
  if (s.length <= max) return s
  if (max <= 1) return '…'
  const keep = max - 1
  const head = Math.ceil(keep / 2)
  const tail = keep - head
  return `${s.slice(0, head)}…${tail > 0 ? s.slice(s.length - tail) : ''}`
}
