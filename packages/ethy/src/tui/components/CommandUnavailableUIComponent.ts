import type { CommandAvailability } from '../../domains/commandAvailability.ts'
import type { EthySpine, WidgetSpec } from '../../spine/types.ts'

function phaseLabel(spine: EthySpine): string {
  const head = spine.headBlockNumber ?? spine.lastVerifiedBlockNumber
  const headText = head !== undefined ? `#${head.toLocaleString('en-US')}` : ''
  switch (spine.phase) {
    case 'HEAD_FOLLOWING':
      return headText.length > 0 ? `Head Following (${headText})` : 'Head Following'
    case 'BAL_CATCHUP':
      return 'BAL Catch-Up'
    case 'SNAP_SYNCING':
      return 'Snap Sync'
    case 'P2P_WARMUP':
      return 'Connecting P2P'
    default:
      return spine.phase
  }
}

export function renderCommandUnavailableWidget(
  command: string,
  avail: CommandAvailability,
  spine: EthySpine,
): WidgetSpec {
  const statusText =
    avail.title ?? avail.reason ?? avail.shortTag ?? 'Not available in the current stage'
  return {
    kind: 'key_value',
    title: `${command} · ${statusText}`,
    entries: [
      { key: 'Command', value: command },
      { key: 'Status', value: statusText },
      { key: 'Current stage', value: phaseLabel(spine) },
      ...(avail.suggestion !== undefined ? [{ key: 'Next step', value: avail.suggestion }] : []),
    ],
  }
}
