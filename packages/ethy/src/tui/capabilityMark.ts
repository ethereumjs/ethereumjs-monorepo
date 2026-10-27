import type { CapabilityReadiness } from '../spine/types.ts'
import { FG, RESET } from './ansi.ts'

/** Spine capability ids. Color is keyed here, not on readiness. */
export type CapabilityId = 'p2p' | 'snap' | 'head' | 'ai'

/**
 * Canonical foreground for each capability.
 * Ready, partial, and locked states keep this color; only the glyph changes.
 */
export const CAPABILITY_FG: Record<CapabilityId, string> = {
  p2p: FG.green,
  snap: FG.yellow,
  head: FG.cyan,
  ai: FG.magenta,
}

function capabilityGlyph(status: CapabilityReadiness): string {
  switch (status) {
    case 'ready':
      return '●'
    case 'partial':
      return '◐'
    case 'locked':
      return '○'
  }
}

/** Colored status glyph for one capability. Color comes from `CAPABILITY_FG`. */
export function capabilityMark(id: CapabilityId, status: CapabilityReadiness): string {
  return `${CAPABILITY_FG[id]}${capabilityGlyph(status)}${RESET}`
}
