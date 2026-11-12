import type { EthySpine, TuiViewState } from '../spine/types.ts'
import { BOLD, DIM, RESET } from './ansi.ts'
import { capabilityMark } from './capabilityMark.ts'
import { COCKPIT_COLUMN_GAP, cockpitColumnWidths } from './cockpit.ts'
import { interactionBoxRightChrome } from './components/interactionChrome.ts'
import {
  interactionViewTitle,
  renderAiOverviewSections,
  renderInteractionWidgetBody,
} from './interactionContent.ts'
import { fixedLine } from './layout.ts'
import { innerRowWidth, renderBox } from './roundedBox.ts'
import { type SuggestionMarks, defaultCarousel } from './widgets.ts'

function buildVariableBox(
  boxW: number,
  totalHeight: number,
  title: string,
  titleRight: string,
  contentLines: string[],
  bottomRight?: string,
): string[] {
  const innerLines = Math.max(0, totalHeight - 4)
  const body: string[] = []
  for (let i = 0; i < innerLines; i++) {
    body.push(contentLines[i] ?? '')
  }
  return renderBox(boxW, title, body, titleRight, bottomRight)
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

  const widget = view.activeWidget ?? { kind: 'start_page' as const }
  const marks: SuggestionMarks = {
    state: spine.capabilities.state.status,
    economy: spine.capabilities.economy.status,
    p2p: spine.capabilities.p2p.status,
  }
  const innerH = Math.max(0, fillRows - 4)
  const bodyLines = renderInteractionWidgetBody(
    widget,
    innerRowWidth(leftW),
    innerH,
    view.interactionPage,
    marks,
    spine,
    view.carouselTick,
    { leftBoxOuterW: w0, middleBoxOuterW: w1 },
  )
  const title = interactionViewTitle(
    widget,
    view.interactionPage,
    view.interactionLabel,
    view.interactionTitle,
    view,
    spine,
  )
  const hasDebugPage = (widget.debugPage?.length ?? 0) > 0
  const titleRight = interactionBoxRightChrome(view, view.interactionPage, hasDebugPage)
  const bottomRight =
    hasDebugPage && view.interactionPage === 'debug'
      ? `${BOLD}● Debug${RESET}${DIM} · Ctrl+D${RESET}`
      : hasDebugPage
        ? `${DIM}Ctrl+D debug${RESET}`
        : undefined
  const leftBox = buildVariableBox(leftW, fillRows, title, titleRight, bodyLines, bottomRight)

  const aiMark = capabilityMark('ai', spine.capabilities.ai.status)
  const aiTitle = `${aiMark} ${BOLD}AI${RESET}`
  const aiBody = renderAiOverviewSections(
    spine,
    view.aiOverviewSections,
    innerRowWidth(rightW),
    innerH,
  )
  const rightBox = buildVariableBox(rightW, fillRows, aiTitle, '', aiBody)

  while (rightBox.length < fillRows) rightBox.push(fixedLine('', rightW))
  const rightCol = rightBox.slice(0, fillRows)
  while (leftBox.length < fillRows) leftBox.push(fixedLine('', leftW))
  const leftCol = leftBox.slice(0, fillRows)

  const out: string[] = []
  for (let i = 0; i < fillRows; i++) {
    out.push(fixedLine(`${leftCol[i] ?? ''}${gap}${rightCol[i] ?? ''}`, contentWidth))
  }
  return out
}
