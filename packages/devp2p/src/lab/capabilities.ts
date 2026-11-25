import { ETH, ETHY, SNAP } from '../protocol/index.ts'

import type { Capabilities, NetworkProfile } from '../types.ts'

const CAP_MAP: Record<string, Capabilities> = {
  eth62: ETH.eth62,
  eth63: ETH.eth63,
  eth64: ETH.eth64,
  eth65: ETH.eth65,
  eth66: ETH.eth66,
  eth67: ETH.eth67,
  eth68: ETH.eth68,
  eth69: ETH.eth69,
  eth70: ETH.eth70,
  eth71: ETH.eth71,
  eth72: ETH.eth72,
  snap1: SNAP.snap,
  snap: SNAP.snap,
  ethy0: ETHY.ethy0,
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

/** Stable `eth71` / `snap1` / `ethy0` names for {@link NetworkProfile} telemetry. */
export function capabilityWireNames(caps: Capabilities[]): string[] {
  const names: string[] = []
  for (const cap of caps) {
    if (cap.name === 'eth') names.push(`eth${cap.version}`)
    else if (cap.name === 'snap') names.push('snap1')
    else if (cap.name === 'ethy') names.push('ethy0')
    else names.push(`${cap.name}${cap.version}`)
  }
  return names
}

export function networkProfilesEqual(a: NetworkProfile, b: NetworkProfile): boolean {
  if (
    a.maxPeers !== b.maxPeers ||
    a.discoveryMode !== b.discoveryMode ||
    a.ethyDiscoveryTag !== b.ethyDiscoveryTag ||
    a.preferEthyDiscovery !== b.preferEthyDiscovery ||
    a.minEthyPeers !== b.minEthyPeers ||
    a.maxInboundPeers !== b.maxInboundPeers ||
    a.discoveryLowWaterMark !== b.discoveryLowWaterMark ||
    a.capabilities.length !== b.capabilities.length
  ) {
    return false
  }
  for (let i = 0; i < a.capabilities.length; i++) {
    if (a.capabilities[i] !== b.capabilities[i]) return false
  }
  return true
}
