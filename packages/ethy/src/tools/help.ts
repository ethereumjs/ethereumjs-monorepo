import type { EthySpine, WidgetSpec } from '../spine/types.ts'

export function buildHelpWidget(spine: EthySpine): WidgetSpec {
  const rows: string[][] = [
    ['/peers', 'Peer table (latency, caps)'],
    ['/buckets, /snap', '16-bucket snap progress'],
    ['/diag', 'Diagnostic ring buffer'],
    ['/drop <peerId>', 'Remove peer (dev)'],
    ['/reassign <bucket>', 'Reassign bucket (dev)'],
  ]
  if (spine.capabilities.head.status !== 'locked') {
    rows.push(['/account <addr>', 'Inspect account at head'])
    rows.push(['/bal', 'Latest block access list'])
    rows.push(['/simulate', 'Simulate tx on head'])
  }
  const comment =
    spine.capabilities.head.status === 'locked'
      ? 'Head tools unlock after snap sync reaches the chain head.'
      : 'All stage tools are available.'
  return {
    kind: 'table',
    title: 'Commands',
    headers: ['Command', 'Description'],
    rows,
    assistantComment: comment,
  }
}
