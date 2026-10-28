import { completeSlashDraft } from '../ai/slashComplete.ts'
import type { CapabilityId, EthySpine, TuiViewState } from '../spine/types.ts'
import { BOLD, DIM, RESET, visibleWidth } from './ansi.ts'
import { capabilityMark } from './capabilityMark.ts'
import { renderCockpit } from './cockpit.ts'
import {
  composeBrandAndRightPills,
  composeFixedRow,
  fixedField,
  fixedLine,
  fixedLineRight,
} from './layout.ts'
import { layoutPage, measurePage } from './pageLayout.ts'
import { deepViewCommand, ghostForPhase } from './prompt.ts'
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
  return `${dot} ${name}`
}

/** Top row: client and network on the left; slot just left of the capability pills. */
function renderCapabilityBar(spine: EthySpine, cols: number): string[] {
  const network = spine.network.toUpperCase()
  const brand = `${spine.clientName} v${spine.clientVersion} | ${network}`
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

function renderPrompt(spine: EthySpine, view: TuiViewState, cols: number): string[] {
  const mark = capabilityMark(view.activeDomain, spine.capabilities[view.activeDomain].status)
  const prefix = `${mark} ${BOLD}ethy > ${RESET}`
  const draftWidth = Math.max(0, cols - PROMPT_PREFIX_WIDTH)
  const prompt = `${prefix}${fixedField(view.promptDraft, draftWidth)}`
  const line1 = fixedLine(prompt, cols)

  const leftHint = `${DIM}${renderFooterHint(view.activeDomain)}${RESET}`
  const hintWidth = visibleWidth(leftHint)
  const gap = 2
  const tabWidth = Math.max(0, cols - hintWidth - gap)
  const slashComplete =
    view.promptDraft.startsWith('/') && completeSlashDraft(view.promptDraft) !== null
      ? `${view.promptDraft} → ${completeSlashDraft(view.promptDraft)}`
      : ''
  const tabPlain =
    slashComplete.length > 0
      ? slashComplete
      : view.promptDraft.length === 0 && view.ghostSuggestion.length > 0
        ? view.ghostSuggestion
        : ''
  const line2 = composeFixedRow(
    cols,
    [
      { text: leftHint, width: hintWidth },
      { text: fixedLineRight(`${DIM}${tabPlain}${RESET}`, tabWidth), width: tabWidth },
    ],
    gap,
  )
  const spacer = fixedLine('', cols)
  return [line1, spacer, line2]
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
  const draftWidth = Math.max(0, page.contentWidth - PROMPT_PREFIX_WIDTH)
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
): string[] {
  const safeCols = Math.max(40, cols)
  const safeRows = Math.max(12, rows)
  const page = measurePage(safeCols, safeRows)

  const capBar = renderCapabilityBar(spine, page.contentWidth)
  const cockpit = renderCockpit(spine, view, page.contentWidth)
  const prompt = renderPrompt(spine, view, page.contentWidth)
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

export { deepViewCommand, ghostForPhase }
