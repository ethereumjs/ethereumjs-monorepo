import { formatDiscoverySummary } from '../net/discoverySummary.ts'
import type { EthySpine, WidgetSpec } from '../spine/types.ts'

export function peersTableWidget(spine: EthySpine): WidgetSpec {
  const rows: string[][] = []
  for (const p of spine.peers.values()) {
    rows.push([p.id, p.clientName, p.caps.join(', '), String(p.avgLatencyMs), p.lastError ?? 'OK'])
  }
  if (rows.length === 0) {
    rows.push(['—', '—', '—', '—', 'No peers yet'])
  }
  return {
    kind: 'table',
    title: 'Peer health',
    headers: ['Peer', 'Client', 'Caps', 'Avg ms', 'Last issue'],
    rows,
    assistantComment: `${spine.peers.size} connected peers on ${spine.network}.`,
  }
}

export function bucketsTableWidget(spine: EthySpine): WidgetSpec {
  const rows: string[][] = spine.snapBuckets.map((b) => [
    b.prefix,
    b.status.toUpperCase(),
    b.assignedPeerId ?? '—',
    String(b.accountsLoaded),
    b.lastStallReason ?? '—',
  ])
  const stalled = spine.snapBuckets.find((b) => b.status === 'stalled')
  let comment = `Snap phase: ${spine.phase}. ${spine.totalAccountsSynced.toLocaleString()} accounts synced.`
  if (stalled) {
    const diag = spine.diagnosticRingBuffer.find((e) => e.bucketIndex === stalled.index)
    comment = `Bucket ${stalled.prefix} stalled: ${stalled.lastStallReason ?? diag?.message ?? 'unknown'}. ${comment}`
  }
  return {
    kind: 'table',
    title: 'Snap buckets (0x0..0xf)',
    headers: ['Bucket', 'Status', 'Peer', 'Accounts', 'Issue'],
    rows,
    assistantComment: comment,
  }
}

export function diagnosticsTableWidget(spine: EthySpine): WidgetSpec {
  const discoveryLine = formatDiscoverySummary(spine.discovery)
  const recent = spine.diagnosticRingBuffer.slice(-20).reverse()
  const rows = recent.map((e) => [
    new Date(e.timestamp).toISOString().slice(11, 19),
    e.subsystem,
    e.severity,
    e.peerId ?? '—',
    e.message.slice(0, 48),
  ])
  if (rows.length === 0) {
    rows.push(['—', '—', '—', '—', 'No diagnostics recorded'])
  }
  return {
    kind: 'table',
    title: 'Diagnostic ring (latest)',
    headers: ['Time', 'Subsystem', 'Sev', 'Peer', 'Message'],
    rows,
    assistantComment: `${discoveryLine} · ${spine.diagnosticRingBuffer.length} events in ring (max 100).`,
  }
}
