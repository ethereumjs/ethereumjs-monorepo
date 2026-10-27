import type { EthySpine, TuiViewState } from '../spine/types.ts'
import { BOLD, DIM, RESET, visibleWidth } from './ansi.ts'
import { type CapabilityId, capabilityMark } from './capabilityMark.ts'
import {
  composeBrandAndRightPills,
  composeFixedRow,
  fixedField,
  fixedLine,
  fixedLineRight,
} from './layout.ts'
import { layoutPage, measurePage } from './pageLayout.ts'
import { defaultCarousel, renderWidgetLines } from './widgets.ts'

const DELIMITER_PAD_ROWS = 1

/** Columns between `Slot N` and the first capability pill. */
const SLOT_GAP = 8

const PROMPT_PREFIX = 'ethy > '
const PROMPT_PREFIX_WIDTH = 7
const PROMPT_HINT = 'Enter submit · Esc exit'

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

function renderPrompt(view: TuiViewState, cols: number): string[] {
  const draftWidth = Math.max(0, cols - PROMPT_PREFIX_WIDTH)
  const prompt = `${BOLD}${PROMPT_PREFIX}${RESET}${fixedField(view.promptDraft, draftWidth)}`
  const line1 = fixedLine(prompt, cols)

  const hint = `${DIM}${PROMPT_HINT}${RESET}`
  const hintWidth = visibleWidth(hint)
  const gap = 2
  const tabWidth = Math.max(0, cols - hintWidth - gap)
  const tabPlain =
    view.promptDraft.length === 0 && view.ghostSuggestion.length > 0
      ? `${view.ghostSuggestion} [Tab]`
      : ''
  const line2 = composeFixedRow(
    cols,
    [
      { text: hint, width: hintWidth },
      { text: fixedLineRight(`${DIM}${tabPlain}${RESET}`, tabWidth), width: tabWidth },
    ],
    gap,
  )
  return [line1, line2]
}

/**
 * 1-based terminal cell where the next typed character lands.
 * Sits just after `ethy > ` and the visible draft, inside the page inset.
 * The prompt line is the second-to-last frame row. The hint row is below it.
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
    row: safeRows - 1,
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
  const prompt = renderPrompt(view, page.contentWidth)
  const widgetLines = view.activeWidget
    ? renderWidgetLines(view.activeWidget, page.contentWidth)
    : []
  const suggestions = renderWidgetLines(defaultCarousel(view.carouselTick), page.contentWidth, {
    p2p: spine.capabilities.p2p.status,
    snap: spine.capabilities.snap.status,
    head: spine.capabilities.head.status,
  })
  const rule = { kind: 'delimiter' as const, open: DIM, close: RESET }
  const pad = { kind: 'spacer' as const, rows: DELIMITER_PAD_ROWS }

  return layoutPage(page, [
    { kind: 'content', lines: capBar },
    rule,
    pad,
    { kind: 'fill', lines: widgetLines },
    rule,
    pad,
    { kind: 'content', lines: suggestions },
    pad,
    rule,
    { kind: 'content', lines: prompt },
  ])
}
