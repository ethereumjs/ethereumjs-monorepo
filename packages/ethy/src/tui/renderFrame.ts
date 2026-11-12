import { completeSlashDraft } from '../ai/slashComplete.ts'
import type { LiveNotice } from '../notify/board.ts'
import {
  CAPABILITY_PILL_ORDER,
  type CapabilityMarkId,
  type EthySpine,
  type TuiViewState,
} from '../spine/types.ts'
import { BOLD, DIM, RESET, visibleWidth } from './ansi.ts'
import { capabilityMark } from './capabilityMark.ts'
import { COCKPIT_COLUMN_GAP, cockpitColumnWidths, renderCockpit } from './cockpit.ts'
import { capabilityBarClockLabel, isRpcReady } from './headerClock.ts'
import {
  composeBrandAndRightPills,
  composeFixedRow,
  fixedField,
  fixedLine,
  fixedLineRight,
} from './layout.ts'
import { renderLowerArea } from './lowerArea.ts'
import { type HorizontalPadding, bandContentWidth, layoutPage, measurePage } from './pageLayout.ts'

const DELIMITER_PAD_ROWS = 1

/** Inset header and footer so their left/right edges align with box inner content (`│ ` / ` │`). */
const HEADER_FOOTER_PADDING: HorizontalPadding = { left: 2, right: 2 }

/** Columns between `Slot N` and the first capability pill. */
const SLOT_GAP = 6

export const PROMPT_PREFIX_WIDTH = 9

/** Footer hint: bold key chord, dim prose (avoids "Enter open…" reading as one sentence). */
function hintSegment(key: string, prose: string): string {
  return `${BOLD}${key}${RESET}${DIM} ${prose}`
}

function renderFooterHint(): string {
  return [
    hintSegment('Tab', 'help'),
    hintSegment('Enter', 'plaza'),
    hintSegment('/', 'command'),
    hintSegment('Esc', 'exit'),
  ].join(`${DIM} · ${RESET}`)
}

/** Rhythm inside the pill cluster; spacer before cluster stays flexible. */
const CAPABILITY_PILL_GAP = 2

const CAPABILITY_IDS = CAPABILITY_PILL_ORDER
const CAPABILITY_LABEL: Record<CapabilityMarkId, string> = {
  economy: 'Economy',
  state: 'State',
  p2p: 'P2P',
  ai: 'AI',
}

function capabilityPillWidth(name: string): number {
  return visibleWidth(formatCapabilityPill('●', name))
}

const CAPABILITY_PILL_WIDTHS = CAPABILITY_IDS.map((id) => capabilityPillWidth(CAPABILITY_LABEL[id]))

function formatCapabilityPill(dot: string, name: string): string {
  return `${dot} ${BOLD}${name}${RESET}`
}

/** Top row: client and network on the left; slot just left of the capability pills. */
function renderCapabilityBar(spine: EthySpine, cols: number): string[] {
  const network = spine.network.toUpperCase()
  const brand = `${BOLD}${spine.clientName} v${spine.clientVersion}${RESET} | ${network}`
  const pillTexts = CAPABILITY_IDS.map((id) =>
    formatCapabilityPill(capabilityMark(id, spine.capabilities[id].status), CAPABILITY_LABEL[id]),
  )

  const line = composeBrandAndRightPills(
    cols,
    brand,
    pillTexts,
    CAPABILITY_PILL_WIDTHS,
    CAPABILITY_PILL_GAP,
    { text: capabilityBarClockLabel(spine), gap: SLOT_GAP },
  )
  return [line]
}

function promptColumnWidths(contentWidth: number): { left: number; right: number } {
  const right = cockpitColumnWidths(contentWidth)[2]
  const left = Math.max(0, contentWidth - COCKPIT_COLUMN_GAP - right)
  return { left, right }
}

function renderRightFooterRpc(spine: EthySpine, width: number): string {
  const rpc = spine.rpc
  if (rpc === undefined || rpc.enabled === false) {
    return fixedField(`${DIM}JSON-RPC off${RESET}`, width)
  }
  if (rpc.listening !== true) {
    return fixedField(`${DIM}JSON-RPC bind failed${RESET}`, width)
  }
  const ready = isRpcReady(spine)
  if (ready) {
    return fixedLineRight(`${DIM}JSON-RPC${RESET} ${BOLD}${rpc.url}${RESET}`, width)
  }
  return fixedLineRight(`${DIM}JSON-RPC ${rpc.url}${RESET}`, width)
}

function renderLeftHint(draft: string, leftW: number): string {
  const leftHint = `${renderFooterHint()}${RESET}`
  const completed = draft.startsWith('/') ? completeSlashDraft(draft) : null
  const slash = completed !== null && completed !== draft ? `${draft} → ${completed}` : ''
  const hintWidth = visibleWidth(leftHint)
  if (slash.length === 0 || hintWidth + 2 >= leftW) return fixedField(leftHint, leftW)
  const tabWidth = Math.max(0, leftW - hintWidth - 2)
  return composeFixedRow(
    leftW,
    [
      { text: leftHint, width: hintWidth },
      { text: fixedLineRight(`${DIM}${slash}${RESET}`, tabWidth), width: tabWidth },
    ],
    2,
  )
}

function renderPrompt(spine: EthySpine, view: TuiViewState, cols: number): string[] {
  const { left, right } = promptColumnWidths(cols)
  const gap = ' '.repeat(Math.min(COCKPIT_COLUMN_GAP, Math.max(0, cols - left - right)))
  const mark = capabilityMark(view.activeDomain, spine.capabilities[view.activeDomain].status)
  const prefix = `${mark} ${BOLD}ethy > ${RESET}`
  const draftWidth = Math.max(0, left - PROMPT_PREFIX_WIDTH)
  const prompt = `${prefix}${fixedField(view.promptDraft, draftWidth)}`
  const hint = renderLeftHint(view.promptDraft, left)
  const footerRpc = renderRightFooterRpc(spine, right)
  return [
    fixedLine(`${fixedField(prompt, left)}${gap}${fixedField('', right)}`, cols),
    fixedLine(`${fixedField('', left)}${gap}${fixedField('', right)}`, cols),
    fixedLine(`${hint}${gap}${footerRpc}`, cols),
  ]
}

/**
 * 1-based terminal cell where the next typed character lands.
 * Sits just after the domain mark and `ethy > `, inside the page inset.
 */
export function promptCaretPosition(
  cols: number,
  rows: number,
  draft: string,
): { row: number; col: number } {
  const safeCols = Math.max(40, cols)
  const safeRows = Math.max(12, rows)
  const page = measurePage(safeCols, safeRows)
  const barWidth = bandContentWidth(page, HEADER_FOOTER_PADDING)
  const { left } = promptColumnWidths(barWidth)
  const draftWidth = Math.max(0, left - PROMPT_PREFIX_WIDTH)
  const shown = Math.min(visibleWidth(draft), draftWidth)
  return {
    row: safeRows - 2,
    col: 1 + page.padding.left + HEADER_FOOTER_PADDING.left + PROMPT_PREFIX_WIDTH + shown,
  }
}

export function renderFrame(
  spine: EthySpine,
  view: TuiViewState,
  cols: number,
  rows: number,
  _notice: LiveNotice | null = null,
): string[] {
  const safeCols = Math.max(40, cols)
  const safeRows = Math.max(12, rows)
  const page = measurePage(safeCols, safeRows)
  const barWidth = bandContentWidth(page, HEADER_FOOTER_PADDING)

  const capBar = renderCapabilityBar(spine, barWidth)
  const cockpit = renderCockpit(spine, view, page.contentWidth)
  const prompt = renderPrompt(spine, view, barWidth)
  const pad = { kind: 'spacer' as const, rows: DELIMITER_PAD_ROWS }

  const reserved =
    capBar.length +
    DELIMITER_PAD_ROWS +
    cockpit.length +
    DELIMITER_PAD_ROWS +
    DELIMITER_PAD_ROWS +
    prompt.length
  const fillRows = Math.max(0, safeRows - reserved)

  const lowerLines = renderLowerArea(spine, view, page.contentWidth, fillRows)

  return layoutPage(page, [
    { kind: 'content', lines: capBar, padding: HEADER_FOOTER_PADDING },
    pad,
    { kind: 'content', lines: cockpit },
    pad,
    { kind: 'fill', lines: lowerLines },
    pad,
    { kind: 'content', lines: prompt, padding: HEADER_FOOTER_PADDING },
  ])
}
