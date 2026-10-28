import { completeSlashDraft } from '../ai/slashComplete.ts'
import type { LiveNotice } from '../notify/board.ts'
import type { CapabilityId, EthySpine, TuiViewState } from '../spine/types.ts'
import { BOLD, DIM, RESET, visibleWidth } from './ansi.ts'
import { capabilityMark } from './capabilityMark.ts'
import { COCKPIT_COLUMN_GAP, cockpitColumnWidths, renderCockpit } from './cockpit.ts'
import {
  composeBrandAndRightPills,
  composeFixedRow,
  fixedField,
  fixedLine,
  fixedLineRight,
} from './layout.ts'
import { renderNoticeLine } from './noticeLine.ts'
import { layoutPage, measurePage } from './pageLayout.ts'
import { deepViewCommand } from './prompt.ts'
import { renderWidgetLines } from './widgets.ts'

const DELIMITER_PAD_ROWS = 1

/** Columns between `Slot N` and the first capability pill. */
const SLOT_GAP = 8

export const PROMPT_PREFIX_WIDTH = 9

/** Footer hint: bold key chord, dim prose (avoids "Enter open…" reading as one sentence). */
function hintSegment(key: string, prose: string): string {
  return `${BOLD}${key}${RESET}${DIM} ${prose}`
}

function renderFooterHint(domain: CapabilityId): string {
  return [
    hintSegment('Enter', `open ${domainHintLabel(domain)} view`),
    hintSegment('Tab', 'switch domain'),
    hintSegment('/', 'command'),
    hintSegment('Esc', 'exit'),
  ].join(`${DIM} · ${RESET}`)
}

/** Rhythm inside the pill cluster; spacer before cluster stays flexible. */
const CAPABILITY_PILL_GAP = 2

const CAPABILITY_IDS: readonly CapabilityId[] = ['p2p', 'snap', 'head', 'ai']
const CAPABILITY_NAMES = ['P2P', 'SNAP', 'HEAD', 'AI'] as const

function capabilityPillWidth(name: string): number {
  return visibleWidth(formatCapabilityPill('●', name))
}

const CAPABILITY_PILL_WIDTHS = CAPABILITY_NAMES.map((name) => capabilityPillWidth(name))

function formatCapabilityPill(dot: string, name: string): string {
  return `${dot} ${BOLD}${name}${RESET}`
}

/** Top row: client and network on the left; slot just left of the capability pills. */
function renderCapabilityBar(spine: EthySpine, cols: number): string[] {
  const network = spine.network.toUpperCase()
  const brand = `${BOLD}${spine.clientName} v${spine.clientVersion}${RESET} | ${network}`
  const { p2p, snap, head, ai } = spine.capabilities
  const statuses = [p2p.status, snap.status, head.status, ai.status]
  const pillTexts = CAPABILITY_IDS.map((id, i) =>
    formatCapabilityPill(capabilityMark(id, statuses[i] ?? 'locked'), CAPABILITY_NAMES[i] ?? id),
  )

  const line = composeBrandAndRightPills(
    cols,
    brand,
    pillTexts,
    CAPABILITY_PILL_WIDTHS,
    CAPABILITY_PILL_GAP,
    { text: `Slot ${spine.currentSlot}`, gap: SLOT_GAP },
  )
  return [line]
}

function domainHintLabel(domain: CapabilityId): string {
  switch (domain) {
    case 'p2p':
      return 'P2P'
    case 'snap':
      return 'SNAP'
    case 'head':
      return 'HEAD'
    case 'ai':
      return 'AI'
  }
}

function promptColumnWidths(contentWidth: number): { left: number; right: number } {
  const right = cockpitColumnWidths(contentWidth)[2]
  const left = Math.max(0, contentWidth - COCKPIT_COLUMN_GAP - right)
  return { left, right }
}

function renderLeftHint(domain: CapabilityId, draft: string, leftW: number): string {
  const leftHint = `${renderFooterHint(domain)}${RESET}`
  const slash =
    draft.startsWith('/') && completeSlashDraft(draft) !== null
      ? `${draft} → ${completeSlashDraft(draft)}`
      : ''
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

function renderPrompt(
  spine: EthySpine,
  view: TuiViewState,
  cols: number,
  notice: LiveNotice | null,
): string[] {
  const { left, right } = promptColumnWidths(cols)
  const gap = ' '.repeat(Math.min(COCKPIT_COLUMN_GAP, Math.max(0, cols - left - right)))
  const mark = capabilityMark(view.activeDomain, spine.capabilities[view.activeDomain].status)
  const prefix = `${mark} ${BOLD}ethy > ${RESET}`
  const draftWidth = Math.max(0, left - PROMPT_PREFIX_WIDTH)
  const prompt = `${prefix}${fixedField(view.promptDraft, draftWidth)}`
  const hint = renderLeftHint(view.activeDomain, view.promptDraft, left)
  const noticeCell = renderNoticeLine(notice, right)
  return [
    fixedLine(`${fixedField(prompt, left)}${gap}${fixedField('', right)}`, cols),
    fixedLine(`${fixedField('', left)}${gap}${fixedField('', right)}`, cols),
    fixedLine(`${hint}${gap}${noticeCell}`, cols),
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
  const { left } = promptColumnWidths(page.contentWidth)
  const draftWidth = Math.max(0, left - PROMPT_PREFIX_WIDTH)
  const shown = Math.min(visibleWidth(draft), draftWidth)
  return {
    row: safeRows - 2,
    col: 1 + page.padding.left + PROMPT_PREFIX_WIDTH + shown,
  }
}

export function renderFrame(
  spine: EthySpine,
  view: TuiViewState,
  cols: number,
  rows: number,
  notice: LiveNotice | null = null,
): string[] {
  const safeCols = Math.max(40, cols)
  const safeRows = Math.max(12, rows)
  const page = measurePage(safeCols, safeRows)

  const capBar = renderCapabilityBar(spine, page.contentWidth)
  const cockpit = renderCockpit(spine, view, page.contentWidth)
  const prompt = renderPrompt(spine, view, page.contentWidth, notice)
  const widgetLines = view.activeWidget
    ? renderWidgetLines(view.activeWidget, page.contentWidth)
    : []
  const rule = { kind: 'delimiter' as const, open: DIM, close: RESET }
  const pad = { kind: 'spacer' as const, rows: DELIMITER_PAD_ROWS }

  return layoutPage(page, [
    { kind: 'content', lines: capBar },
    rule,
    { kind: 'content', lines: cockpit },
    pad,
    { kind: 'fill', lines: widgetLines },
    rule,
    pad,
    { kind: 'content', lines: prompt },
  ])
}

export { deepViewCommand }
