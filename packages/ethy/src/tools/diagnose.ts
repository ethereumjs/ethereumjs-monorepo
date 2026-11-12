import { ensureBucketSubRanges } from '../spine/buckets.ts'
import { DIAGNOSTIC_RING_CAPACITY } from '../spine/diagnostics.ts'
import type { DebugSectionSpec, EthySpine, PeerTelemetry, WidgetSpec } from '../spine/types.ts'

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
  const servableCount =
    s?.earliestBlock !== undefined && s?.latestBlock !== undefined
      ? BigInt(s.latestBlock) >= BigInt(s.earliestBlock)
        ? Number(BigInt(s.latestBlock) - BigInt(s.earliestBlock) + 1n)
        : (s.blocksStored ?? 0)
      : (s?.blocksStored ?? 0)
  const servableWindow =
    s?.earliestBlock !== undefined && s?.latestBlock !== undefined
      ? `#${BigInt(s.earliestBlock).toLocaleString('en-US')}..#${BigInt(s.latestBlock).toLocaleString('en-US')} (${servableCount} block${servableCount === 1 ? '' : 's'})`
      : '—'
  const localEnode = spine.discovery?.localEnode ?? '—'
  return {
    kind: 'table',
    title: 'ETHY/0 swarm',
    preface: [{ key: 'Local enode', value: localEnode }],
    headers: ['Field', 'Value'],
    rows: [
      ['Transport', transport],
      ['Local seed buckets', `${localBits}/16`],
      ['ETHY sessions', String(ethyPeers)],
      ['Pivot', pivot],
      ['Servable head window (eth)', servableWindow],
      ['Headers served (eth)', String(s?.headersServed ?? 0)],
      ['Bodies served (eth)', String(s?.bodiesServed ?? 0)],
      ['Receipts served (eth)', String(s?.receiptsServed ?? 0)],
      ['BALs served (eth)', String(s?.accessListsServed ?? 0)],
      ['Chunks served (ETHY)', String(chunks)],
      ['BAL blocks served (ETHY)', String(balBlocks)],
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
  const localEnode = spine.discovery?.localEnode
  return {
    kind: 'table',
    title: 'Peer health',
    preface: localEnode !== undefined ? [{ key: 'Local enode', value: localEnode }] : undefined,
    headers: ['Peer', 'Client', 'Caps', 'Ethy', 'Avg ms', 'Last issue'],
    rows,
    debugPage: peersDebugSections(spine),
  }
}

function peersDebugSections(spine: EthySpine): DebugSectionSpec[] {
  const d = spine.discovery
  const s = spine.serving
  const discovery: DebugSectionSpec = {
    title: 'Discovery funnel',
    entries:
      d === undefined
        ? [{ key: 'Status', value: 'Metrics unavailable' }]
        : [
            { key: 'DPT table', value: String(d.tablePeers) },
            { key: 'RLPx dials', value: String(d.rlpx.dials) },
            { key: 'Connected', value: String(d.rlpx.connected) },
            { key: 'STATUS ok', value: String(d.rlpx.statusOk) },
            {
              key: 'Slot rejects',
              value: String(d.rlpx.handshakeRejects?.slots ?? 0),
            },
          ],
  }
  const serving: DebugSectionSpec = {
    title: 'Serving telemetry',
    entries:
      s === undefined
        ? [{ key: 'Serve', value: '—' }]
        : [
            { key: 'Headers', value: String(s.headersServed) },
            { key: 'Bodies', value: String(s.bodiesServed) },
            { key: 'Receipts', value: String(s.receiptsServed) },
            { key: 'BALs', value: String(s.accessListsServed) },
            {
              key: 'ETHY',
              value: `${s.ethyChunksServed ?? 0} ch / ${s.ethyBalBlocksServed ?? 0} blk`,
            },
            {
              key: 'Window',
              value:
                s.earliestBlock !== undefined && s.latestBlock !== undefined
                  ? `#${s.earliestBlock}..#${s.latestBlock}`
                  : '—',
            },
          ],
  }
  const identity: DebugSectionSpec = {
    title: 'Local identity',
    entries: [
      { key: 'Network', value: spine.network },
      { key: 'Peers', value: String(spine.peers.size) },
      { key: 'Enode', value: spine.discovery?.localEnode ?? '—' },
      {
        key: 'Logs',
        value: spine.logsDirPath !== undefined ? `${spine.logsDirPath}/ethy.log` : '—',
      },
    ],
  }
  return [discovery, serving, identity]
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
  const cursorRows = spine.snapBuckets.map((b) => {
    const ranges = ensureBucketSubRanges(b)
    const inFlight = ranges.filter((c) => c.inFlightReqKey !== undefined).length
    const verifying = ranges.reduce((a, c) => a + (c.verifyingCount ?? 0), 0)
    return `${b.prefix}: ${ranges.length} cursors · ${inFlight} in-flight · ${verifying} verify`
  })
  return {
    kind: 'table',
    title: 'Snap buckets (0x0..0xf)',
    headers: ['Bucket', 'Status', 'Peer', 'Accounts', 'Issue'],
    rows,
    debugPage: [
      {
        title: 'Cursors',
        entries: cursorRows.map((line, i) => ({
          key: spine.snapBuckets[i]?.prefix ?? String(i),
          value: line.split(': ')[1] ?? line,
        })),
      },
      {
        title: 'Sync summary',
        entries: [
          { key: 'Phase', value: spine.phase },
          {
            key: 'Accounts',
            value: spine.totalAccountsSynced.toLocaleString('en-US'),
          },
          {
            key: 'Code',
            value: `${spine.codesSynced}/${spine.codesTotal ?? spine.codesSynced + spine.codesQueued}`,
          },
          {
            key: 'Storage acc',
            value: `${spine.storageAccountsSynced ?? 0}/${spine.storageAccountsTotal ?? 0}`,
          },
          ...(stalled
            ? [
                {
                  key: 'Stalled',
                  value: `${stalled.prefix}: ${stalled.lastStallReason ?? 'unknown'}`,
                },
              ]
            : []),
        ],
      },
    ],
  }
}

function formatLocalClock(timestampMs: number): string {
  const d = new Date(timestampMs)
  const hh = String(d.getHours()).padStart(2, '0')
  const mm = String(d.getMinutes()).padStart(2, '0')
  const ss = String(d.getSeconds()).padStart(2, '0')
  return `${hh}:${mm}:${ss}`
}

export function diagnosticsTableWidget(spine: EthySpine): WidgetSpec {
  const recent = spine.diagnosticRingBuffer.slice(-20).reverse()
  const rows = recent.map((e) => [
    formatLocalClock(e.timestamp),
    e.subsystem,
    e.severity,
    e.peerId ?? '—',
    e.message,
  ])
  if (rows.length === 0) {
    rows.push(['—', '—', '—', '—', 'No diagnostics recorded'])
  }
  const d = spine.discovery
  const discoveryEntries =
    d === undefined
      ? [{ key: 'Discovery', value: 'Metrics unavailable' }]
      : [
          { key: 'Boot ok', value: `${d.bootstrap.ok}/${d.bootstrap.attempts}` },
          { key: 'DNS added', value: `${d.dns.peersAdded}/${d.dns.attempts}` },
          { key: 'RLPx status', value: String(d.rlpx.statusOk) },
          {
            key: 'Ring',
            value: `${spine.diagnosticRingBuffer.length}/${DIAGNOSTIC_RING_CAPACITY}`,
          },
        ]
  return {
    kind: 'table',
    title: 'Diagnostic ring (latest)',
    headers: ['Time', 'Subsystem', 'Sev', 'Peer', 'Message'],
    rows,
    debugPage: [
      { title: 'Discovery', entries: discoveryEntries },
      {
        title: 'Flight recorder',
        entries: [
          {
            key: 'Path',
            value:
              spine.logsDirPath !== undefined
                ? `${spine.logsDirPath}/{ethy.log,errors.log,events.jsonl}`
                : '—',
          },
        ],
      },
    ],
  }
}
