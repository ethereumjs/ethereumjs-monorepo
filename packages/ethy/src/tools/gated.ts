import type { EthySpine, WidgetSpec } from '../spine/types.ts'

export function headLockedWidget(toolName: string, spine: EthySpine): WidgetSpec {
  return {
    kind: 'key_value',
    title: `${toolName} (locked)`,
    entries: [
      { key: 'Phase', value: spine.phase },
      { key: 'Head capability', value: spine.capabilities.head.status },
    ],
    assistantComment:
      'Finish snap sync and reach HEAD_FOLLOWING before account, BAL, or simulation tools unlock.',
  }
}

export function inspectAccountStub(_spine: EthySpine, addr: string): WidgetSpec {
  return headLockedWidget('inspectAccount', _spine)
}

export function inspectLatestBALStub(spine: EthySpine): WidgetSpec {
  return headLockedWidget('inspectLatestBAL', spine)
}

export function simulateTxOnHeadStub(spine: EthySpine): WidgetSpec {
  return headLockedWidget('simulateTxOnHead', spine)
}

export function headReadyAccountStub(spine: EthySpine, addr: string): WidgetSpec {
  return {
    kind: 'key_value',
    title: 'Account (stub)',
    entries: [
      { key: 'Address', value: addr || '(none)' },
      { key: 'State', value: 'StateStore arrives in WP-03' },
    ],
    assistantComment: 'Head is verified; flat store integration is not wired yet.',
  }
}
