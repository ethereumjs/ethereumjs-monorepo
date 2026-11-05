import type { EthySpine, PeerTelemetry, WidgetSpec } from '../spine/types.ts'

function countSeedBits16(mask: number): number {
  let n = 0
  for (let b = 0; b < 16; b++) {
    if ((mask & (1 << b)) !== 0) n++
  }
  return n
}

function parseBucketsBitmask(raw: string): number {
  return raw.startsWith('0x') ? Number.parseInt(raw, 16) : Number.parseInt(raw, 10)
}

export function peerEthyBucketsLabel(p: PeerTelemetry): string {
  if (p.ethySession !== true) return '—'
  if (p.ethyStatus === undefined) return '…'
  const bits = countSeedBits16(parseBucketsBitmask(p.ethyStatus.bucketsBitmask))
  return `${bits}/16`
}

export function ethyOverviewWidget(spine: EthySpine): WidgetSpec {
  const transport = spine.syncTransport ?? 'unset'
  const localBits = countSeedBits16(spine.ethyBucketsBitmask ?? 0)
  const s = spine.serving
  const chunks = s?.ethyChunksServed ?? 0
  const balBlocks = s?.ethyBalBlocksServed ?? 0
  const ethyPeers = [...spine.peers.values()].filter((p) => p.ethySession === true).length
  const pivot =
    spine.pivotBlockNumber !== undefined
      ? `#${spine.pivotBlockNumber.toLocaleString('en-US')}`
      : '—'
  return {
    kind: 'table',
    title: 'ETHY/0 swarm',
    headers: ['Field', 'Value'],
    rows: [
      ['Transport', transport],
      ['Local seed buckets', `${localBits}/16`],
      ['ETHY sessions', String(ethyPeers)],
      ['Pivot', pivot],
      ['Chunks served (local)', String(chunks)],
      ['BAL blocks served (local)', String(balBlocks)],
    ],
    assistantComment:
      transport === 'ethy'
        ? 'Base state downloads via ETHY/0 proven chunks; snap cursors may assist unfinished buckets.'
        : transport === 'snap'
          ? 'SNAP/1 base sync; completed buckets advertise on ETHY/0 as they finish.'
          : 'Sync transport not locked yet (auto selector window).',
  }
}

export function peersTableWidget(spine: EthySpine): WidgetSpec {
  const rows: string[][] = []
  for (const p of spine.peers.values()) {
    rows.push([
      p.id,
      p.clientName,
      p.caps.join(', '),
      peerEthyBucketsLabel(p),
      String(p.avgLatencyMs),
      p.lastError ?? 'OK',
    ])
  }
  if (rows.length === 0) {
    rows.push(['—', '—', '—', '—', '—', 'No peers yet'])
  }
  return {
    kind: 'table',
    title: 'Peer health',
    headers: ['Peer', 'Client', 'Caps', 'Ethy', 'Avg ms', 'Last issue'],
    rows,
    assistantComment: (() => {
      const s = spine.serving
      const window =
        s?.earliestBlock !== undefined && s.latestBlock !== undefined
          ? `Window #${s.earliestBlock}..#${s.latestBlock}`
          : 'Window —'
      const breakdown =
        s === undefined
          ? 'Serve —'
          : `Serve h:${s.headersServed} b:${s.bodiesServed} r:${s.receiptsServed} bal:${s.accessListsServed} ethy:${s.ethyChunksServed}ch/${s.ethyBalBlocksServed}blk`
      const enode = spine.discovery?.localEnode
      const enodeLine = enode !== undefined ? ` Local enode: ${enode}.` : ''
      return `${spine.peers.size} connected peers on ${spine.network}. ${breakdown}. ${window}.${enodeLine}`
    })(),
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
  const recent = spine.diagnosticRingBuffer.slice(-20).reverse()
  const rows = recent.map((e) => [
    new Date(e.timestamp).toISOString().slice(11, 19),
    e.subsystem,
    e.severity,
    e.peerId ?? '—',
    e.message,
  ])
  if (rows.length === 0) {
    rows.push(['—', '—', '—', '—', 'No diagnostics recorded'])
  }
  return {
    kind: 'table',
    title: 'Diagnostic ring (latest)',
    headers: ['Time', 'Subsystem', 'Sev', 'Peer', 'Message'],
    rows,
    footer: 'discovery',
    assistantComment:
      spine.logsDirPath !== undefined
        ? `Flight recorder active: ${spine.logsDirPath}/{ethy.log,errors.log,events.jsonl}`
        : undefined,
  }
}
