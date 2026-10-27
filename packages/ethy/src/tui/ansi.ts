export const RESET = '\x1b[0m'
export const BOLD = '\x1b[1m'
export const DIM = '\x1b[2m'

export const FG = {
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  magenta: '\x1b[35m',
  red: '\x1b[31m',
} as const

/** Alternate screen buffer on / off. */
export const ALT_SCREEN_ON = '\x1b[?1049h'
export const ALT_SCREEN_OFF = '\x1b[?1049l'

export const CURSOR_HIDE = '\x1b[?25l'
export const CURSOR_SHOW = '\x1b[?25h'

/** 1-based cursor address, same as a terminal CUP. */
export function cursorTo(row: number, col: number): string {
  return `\x1b[${row};${col}H`
}

export function syncOutputBegin(): string {
  return '\x1b[?2026h'
}

export function syncOutputEnd(): string {
  return '\x1b[?2026l'
}

export function stripAnsi(s: string): string {
  return s.replace(/\x1b\[[0-9;]*m/g, '')
}

export function visibleWidth(s: string): number {
  return stripAnsi(s).length
}

export function padVisible(s: string, width: number): string {
  const vis = visibleWidth(s)
  if (vis >= width) return s
  return s + ' '.repeat(width - vis)
}

export function truncateVisible(s: string, max: number): string {
  const plain = stripAnsi(s)
  if (plain.length <= max) return s
  return plain.slice(0, Math.max(0, max - 1)) + '…'
}
