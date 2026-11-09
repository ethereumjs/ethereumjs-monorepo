import { readDomainSnapshots } from '../domains/domainManagers.ts'
import type { EthySpine } from '../spine/types.ts'

export function buildCompactDomainContext(spine: EthySpine): Record<string, unknown> {
  const s = readDomainSnapshots(spine)
  const peers = [...spine.peers.values()].slice(0, 16).map((p) => ({
    id: p.id.slice(0, 8),
    client: (p.clientName.split('/')[0] ?? p.clientName).slice(0, 24),
    latencyMs: p.avgLatencyMs,
    snapOk: p.snapResponsesOk,
    snapSession: p.snapSession === true,
  }))

  return {
    phase: s.pulse.phase,
    pulse: s.pulse,
    economy: {
      ...s.economy,
      topContracts: s.economy.topContracts.slice(0, 5),
      recentBlocks: s.economy.recentBlocks.slice(0, 4),
    },
    p2p: s.p2p,
    snap: s.snap,
    head: s.head,
    peersSample: peers,
  }
}
