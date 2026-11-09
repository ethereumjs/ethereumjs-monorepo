import type { EthySpine, TuiViewState } from '../spine/types.ts'
import type { CapabilityId } from '../spine/types.ts'
import { BOLD, RESET } from './ansi.ts'
import { capabilityMark } from './capabilityMark.ts'
import {
  COCKPIT_COLUMN_GAP,
  cockpitColumnWidths,
  domainCommandPairs,
  domainTitle,
} from './cockpit.ts'
import {
  interactionViewTitle,
  renderInteractionWidgetBody,
  wrapProseCentered,
} from './interactionContent.ts'
import { fixedLine, formatTwoColumnRows, maxLabelWidth } from './layout.ts'
import { innerRowWidth, renderBox } from './roundedBox.ts'
import { type SuggestionMarks, defaultCarousel } from './widgets.ts'

const COMMANDS_BOX_ROWS = 8
const COCKPIT_CONTENT_ROWS = 4

function rightStackHeights(fillRows: number): { aiRows: number; commandsRows: number } {
  if (fillRows >= 13) {
    return { aiRows: fillRows - COMMANDS_BOX_ROWS, commandsRows: COMMANDS_BOX_ROWS }
  }
  if (fillRows >= 10) {
    return { aiRows: 5, commandsRows: fillRows - 5 }
  }
  return { aiRows: 0, commandsRows: fillRows }
}

function buildVariableBox(
  boxW: number,
  totalHeight: number,
  title: string,
  contentLines: string[],
): string[] {
  const innerLines = Math.max(0, totalHeight - 4)
  const body: string[] = []
  for (let i = 0; i < innerLines; i++) {
    body.push(contentLines[i] ?? '')
  }
  return renderBox(boxW, title, body)
}

function concatBoxesVertically(top: string[], bottom: string[]): string[] {
  return [...top, ...bottom]
}

export function renderLowerArea(
  spine: EthySpine,
  view: TuiViewState,
  contentWidth: number,
  fillRows: number,
): string[] {
  const [w0, w1, w2] = cockpitColumnWidths(contentWidth)
  const leftW = w0 + COCKPIT_COLUMN_GAP + w1
  const rightW = w2
  const gap = ' '.repeat(COCKPIT_COLUMN_GAP)

  const { aiRows, commandsRows } = rightStackHeights(fillRows)

  const widget = view.activeWidget ?? defaultCarousel(view.carouselTick)
  const marks: SuggestionMarks = {
    p2p: spine.capabilities.p2p.status,
    snap: spine.capabilities.snap.status,
    head: spine.capabilities.head.status,
  }
  const innerH = Math.max(0, fillRows - 4)
  const bodyLines = renderInteractionWidgetBody(
    widget,
    innerRowWidth(leftW),
    innerH,
    view.interactionPage,
    marks,
  )
  const title = interactionViewTitle(widget, view.interactionPage, view.interactionLabel)
  const leftBox = buildVariableBox(leftW, fillRows, title, bodyLines)

  let rightBox: string[] = []
  if (aiRows > 0) {
    const aiMark = capabilityMark('ai', spine.capabilities.ai.status)
    const aiTitle = `${aiMark} ${BOLD}AI Overview${RESET}`
    const centered = wrapProseCentered(
      view.aiOverview ?? '',
      innerRowWidth(rightW),
      Math.max(0, aiRows - 4),
    )
    rightBox = buildVariableBox(rightW, aiRows, aiTitle, centered)
  }
  if (commandsRows > 0) {
    const cmdPairs = domainCommandPairs(view.activeDomain, spine.phase).slice(
      0,
      COCKPIT_CONTENT_ROWS,
    )
    const lw = maxLabelWidth(cmdPairs)
    const cmdLines = formatTwoColumnRows(cmdPairs, lw, innerRowWidth(rightW))
    while (cmdLines.length < COCKPIT_CONTENT_ROWS) cmdLines.push('')
    const cmdTitle = domainTitle(spine, view, 'Commands')
    const cmdBox = buildVariableBox(rightW, commandsRows, cmdTitle, cmdLines)
    rightBox = rightBox.length > 0 ? concatBoxesVertically(rightBox, cmdBox) : cmdBox
  }

  while (rightBox.length < fillRows) rightBox.push(fixedLine('', rightW))
  rightBox = rightBox.slice(0, fillRows)
  while (leftBox.length < fillRows) leftBox.push(fixedLine('', leftW))
  const leftCol = leftBox.slice(0, fillRows)

  const out: string[] = []
  for (let i = 0; i < fillRows; i++) {
    out.push(fixedLine(`${leftCol[i] ?? ''}${gap}${rightBox[i] ?? ''}`, contentWidth))
  }
  return out
}
