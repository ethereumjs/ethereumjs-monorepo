export const RESET = '\x1b[0m'
export const BOLD = '\x1b[1m'
export const DIM = '\x1b[2m'
export const REVERSE = '\x1b[7m'

export const FG = {
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  magenta: '\x1b[35m',
  blue: '\x1b[34m',
} as const

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

export function layerLabel(layer: 'dpt' | 'rlpx' | 'eth' | 'snap'): string {
  switch (layer) {
    case 'dpt':
      return 'DPT'
    case 'rlpx':
      return 'RLPx'
    case 'eth':
      return 'ETH'
    case 'snap':
      return 'SNAP'
  }
}

export function invertedProtocolTag(layer: 'dpt' | 'rlpx' | 'eth' | 'snap'): string {
  const colors: Record<string, string> = {
    dpt: FG.yellow,
    rlpx: FG.magenta,
    eth: FG.green,
    snap: FG.cyan,
  }
  const label = layerLabel(layer)
  return `${REVERSE}${colors[layer] ?? ''}${label}${RESET}`
}
