import type { InteractionPage, TuiViewState } from '../../spine/types.ts'
import { BOLD, DIM, RESET, visibleWidth } from '../ansi.ts'
import { fixedField } from '../layout.ts'

/** Fixed visible width of the right interaction title cluster (no border jump). */
export const INTERACTION_RIGHT_CHROME_WIDTH = visibleWidth(
  `${BOLD}Commands${RESET}${DIM} | ${RESET}${BOLD}Debug${RESET}${DIM} (Ctrl+D)${RESET}  ← →`,
)

function historyCanGoLeft(view: TuiViewState): boolean {
  if (view.showingHelp && view.viewHistory.length > 0) return true
  return view.viewHistoryIndex > 0
}

function historyCanGoRight(view: TuiViewState): boolean {
  if (view.showingHelp) return false
  return view.viewHistoryIndex < view.viewHistory.length - 1
}

export function interactionBoxRightChrome(
  view: TuiViewState,
  page: InteractionPage,
  hasDebugPage: boolean,
): string {
  const commands = page === 'main' ? `${BOLD}Commands${RESET}` : `${DIM}Commands${RESET}`
  const debugActive = hasDebugPage && page === 'debug'
  const debug = debugActive ? `${BOLD}Debug${RESET}` : `${DIM}Debug${RESET}`
  const left = historyCanGoLeft(view) ? '←' : `${DIM}←${RESET}`
  const right = historyCanGoRight(view) ? '→' : `${DIM}→${RESET}`
  const raw = `${commands}${DIM} | ${RESET}${debug}${DIM} (Ctrl+D)${RESET}  ${left} ${right}`
  return fixedField(raw, INTERACTION_RIGHT_CHROME_WIDTH)
}
