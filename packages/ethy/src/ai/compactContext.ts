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
      topContracts: s.economy.topContracts.slice(0, 5).map((c) => ({
        ...c,
        netEthDeltaWei: c.netEthDeltaWei.toString(),
      })),
      recentBlocks: s.economy.recentBlocks.slice(0, 4),
      l2RollupStats: s.economy.l2RollupStats?.slice(0, 3).map((l) => ({
        ...l,
        estimatedEthWei: l.estimatedEthWei.toString(),
      })),
      macroBaseline:
        s.economy.macroBaseline !== undefined
          ? {
              ...s.economy.macroBaseline,
              avgBaseFeeWei: s.economy.macroBaseline.avgBaseFeeWei?.toString(),
              avgBlobBaseFeeWei: s.economy.macroBaseline.avgBlobBaseFeeWei?.toString(),
              avgPriorityTipWei: s.economy.macroBaseline.avgPriorityTipWei?.toString(),
            }
          : undefined,
    },
    p2p: s.p2p,
    snap: s.snap,
    head: s.head,
    peersSample: peers,
  }
}
