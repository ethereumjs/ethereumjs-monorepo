import { ETH, SNAP } from '../protocol/index.ts'

import type { Capabilities } from '../types.ts'

const CAP_MAP: Record<string, Capabilities> = {
  eth62: ETH.eth62,
  eth63: ETH.eth63,
  eth64: ETH.eth64,
  eth65: ETH.eth65,
  eth66: ETH.eth66,
  eth67: ETH.eth67,
  eth68: ETH.eth68,
  snap1: SNAP.snap,
  snap: SNAP.snap,
}

export function resolveCapabilities(names: string[]): Capabilities[] {
  const caps: Capabilities[] = []
  for (const name of names) {
    const cap = CAP_MAP[name]
    if (!cap) {
      throw new Error(`Unknown capability: ${name}`)
    }
    caps.push(cap)
  }
  return caps
}
