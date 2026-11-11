import { bytesToHex } from '@ethereumjs/util'

import type { DebugSectionSpec, EthySpine, WidgetSpec } from '../spine/types.ts'

export function livePlazaDebugSections(spine: EthySpine): DebugSectionSpec[] {
  const head = spine.lastVerifiedBlockNumber ?? spine.headBlockNumber
  const root =
    spine.headStateRoot !== undefined ? `0x${bytesToHex(spine.headStateRoot).slice(0, 10)}…` : '—'
  const cl =
    spine.clStatus === 'verified' && spine.clParticipationPct !== undefined
      ? `verified · ${spine.clParticipationPct.toFixed(1)}% BLS`
      : (spine.clStatus ?? '—')
  const graffiti = spine.economy?.latestProposerGraffiti ?? '—'
  const extraHex = spine.economy?.latestExtraDataHex ?? '—'
  return [
    {
      title: 'Sync & State Summary',
      entries: [
        { key: 'Accounts', value: spine.totalAccountsSynced.toLocaleString('en-US') },
        { key: 'Contracts', value: spine.codesSynced.toLocaleString('en-US') },
        { key: 'Storage slots', value: spine.storageSlotsSynced.toLocaleString('en-US') },
        { key: 'Pivot steps', value: String(spine.pivotStepsCompleted ?? 0) },
        {
          key: 'BALs applied',
          value: String(spine.appliedBalCount ?? spine.streamedBalCount ?? 0),
        },
      ],
    },
    {
      title: 'Head & Consensus Provenance',
      entries: [
        {
          key: 'Head block',
          value: head !== undefined ? `#${head.toLocaleString('en-US')}` : '—',
        },
        { key: 'Head stateRoot', value: root },
        { key: 'CL status', value: cl },
        { key: 'Proposer graffiti', value: graffiti },
        { key: 'extraData hex', value: extraHex },
      ],
    },
  ]
}

export function livePlazaWidget(spine: EthySpine): WidgetSpec {
  return {
    kind: 'live_plaza',
    debugPage: livePlazaDebugSections(spine),
  }
}
