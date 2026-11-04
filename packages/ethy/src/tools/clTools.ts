import { bytesToHex } from '@ethereumjs/util'

import type { EthySpine, WidgetSpec } from '../spine/types.ts'

export function clMicroscopeWidget(spine: EthySpine): WidgetSpec {
  const status = spine.clStatus ?? 'p2p_only'
  const optLabel =
    spine.clOptimisticBlockNumber !== undefined && spine.clOptimisticBlockNumber > 0n
      ? `#${spine.clOptimisticBlockNumber.toLocaleString('en-US')}${spine.clOptimisticSlot !== undefined ? ` (slot ${spine.clOptimisticSlot.toLocaleString('en-US')})` : ''}`
      : spine.clOptimisticSlot !== undefined
        ? `Slot ${spine.clOptimisticSlot.toLocaleString('en-US')}`
        : '—'
  const finLabel =
    spine.clFinalizedBlockNumber !== undefined && spine.clFinalizedBlockNumber > 0n
      ? `#${spine.clFinalizedBlockNumber.toLocaleString('en-US')}${spine.clFinalizedSlot !== undefined ? ` (slot ${spine.clFinalizedSlot.toLocaleString('en-US')})` : ''}`
      : spine.clFinalizedSlot !== undefined
        ? `Slot ${spine.clFinalizedSlot.toLocaleString('en-US')}`
        : '—'
  const entries = [
    { key: 'Status', value: status },
    { key: 'Period', value: spine.clPeriod !== undefined ? String(spine.clPeriod) : '—' },
    {
      key: 'BLS participation',
      value: spine.clParticipationPct !== undefined ? `${spine.clParticipationPct}%` : '—',
    },
    {
      key: 'Optimistic head',
      value: optLabel,
    },
    {
      key: 'Finalized head',
      value: finLabel,
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
