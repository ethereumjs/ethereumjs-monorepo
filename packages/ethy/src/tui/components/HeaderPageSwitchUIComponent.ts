import type { InteractionPage } from '../../spine/types.ts'
import { BOLD, DIM, RESET, UNDERLINE } from '../ansi.ts'

export type HeaderPageSwitchOpts = {
  page: InteractionPage
  hasDebugPage: boolean
  mainLabel?: string
}

/**
 * Canonical header-inline page switch (`· Commands | Debug (Ctrl+D)`).
 * Returns empty string when the active widget has no secondary debug page.
 */
export function renderHeaderPageSwitchUIComponent(opts: HeaderPageSwitchOpts): string {
  if (!opts.hasDebugPage) return ''
  const mainLabel = opts.mainLabel ?? 'Commands'
  const mainText =
    opts.page === 'main'
      ? `${RESET}${BOLD}${UNDERLINE}${mainLabel}${RESET}`
      : `${RESET}${DIM}${mainLabel}${RESET}`
  const debugText =
    opts.page === 'debug'
      ? `${RESET}${BOLD}${UNDERLINE}Debug${RESET}${DIM} (Ctrl+D)${RESET}`
      : `${RESET}${DIM}Debug (Ctrl+D)${RESET}`
  return `${RESET}${DIM} · ${RESET}${mainText}${DIM} | ${RESET}${debugText}`
}
