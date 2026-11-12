import type { InteractionPage, TuiViewState } from '../../spine/types.ts'
import { BOLD, DIM, RESET, visibleWidth } from '../ansi.ts'
import { fixedField } from '../layout.ts'

/** Fixed visible width of the right history arrow cluster. */
export const INTERACTION_RIGHT_CHROME_WIDTH = visibleWidth('← →')

function historyCanGoLeft(view: TuiViewState): boolean {
  return view.viewHistoryIndex > 0
}

function historyCanGoRight(view: TuiViewState): boolean {
  return view.viewHistoryIndex < view.viewHistory.length - 1
}

export function interactionBoxRightChrome(
  view: TuiViewState,
  _page: InteractionPage,
  _hasDebugPage: boolean,
): string {
  if (view.activeWidget === null || view.activeWidget.kind === 'start_page') {
    return ''
  }
  const left = historyCanGoLeft(view) ? `${RESET}${BOLD}←${RESET}` : `${RESET}${DIM}←${RESET}`
  const right = historyCanGoRight(view) ? `${RESET}${BOLD}→${RESET}` : `${RESET}${DIM}→${RESET}`
  return fixedField(`${left} ${right}`, INTERACTION_RIGHT_CHROME_WIDTH)
}
