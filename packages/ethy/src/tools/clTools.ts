import { bytesToHex } from '@ethereumjs/util'

import type { EthySpine, WidgetSpec } from '../spine/types.ts'

export function clMicroscopeWidget(spine: EthySpine): WidgetSpec {
  const status = spine.clStatus ?? 'p2p_only'
  const entries = [
    { key: 'Status', value: status },
    { key: 'Period', value: spine.clPeriod !== undefined ? String(spine.clPeriod) : '—' },
    {
      key: 'BLS participation',
      value: spine.clParticipationPct !== undefined ? `${spine.clParticipationPct}%` : '—',
    },
    {
      key: 'Optimistic EL',
      value:
        spine.clOptimisticBlockNumber !== undefined
          ? `#${spine.clOptimisticBlockNumber.toString()}`
          : '—',
    },
    {
      key: 'Finalized EL',
      value:
        spine.clFinalizedBlockNumber !== undefined
          ? `#${spine.clFinalizedBlockNumber.toString()}`
          : '—',
    },
    {
      key: 'CL block hash',
      value: spine.clHeadBlockHash !== undefined ? bytesToHex(spine.clHeadBlockHash) : '—',
    },
    { key: 'Endpoint', value: spine.clEndpoint ?? '—' },
  ]
  return {
    kind: 'key_value',
    title: 'Consensus light client',
    entries,
    assistantComment:
      status === 'p2p_only'
        ? 'Beacon REST unreachable — EL sync continues on devp2p only.'
        : 'Validator-signed execution head from sync committee BLS verification.',
  }
}
