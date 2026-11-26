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

function parseBucketsBitmask(raw: string | undefined): number {
  if (raw === undefined || raw.length === 0) return 0
  const n = raw.startsWith('0x') ? Number.parseInt(raw, 16) : Number.parseInt(raw, 10)
  return Number.isFinite(n) ? n & 0xffff : 0
}

export function peerEthyBucketsLabel(p: PeerTelemetry): string {
  if (p.ethySession !== true) return '—'
  if (p.ethyStatus === undefined) return '…'
  const bits = countSeedBits16(parseBucketsBitmask(p.ethyStatus.bucketsBitmask))
  return `${bits}/16`
}

function buildCustodyMatrixRows(spine: EthySpine): string[][] {
  const assigned = new Set(spine.custodyBuckets ?? [])
  const closedMask = spine.closedBucketsMask ?? 0
  const accMask = spine.ethyBucketsBitmask ?? 0
  const codeMask = spine.ethyCodeBucketsBitmask ?? 0
  const storMask = spine.ethyStorageBucketsBitmask ?? 0
  const trieMask = spine.ethyTrieBucketsBitmask ?? 0
  const pctMap = spine.custodyBucketSyncPct ?? {}

  const triePeersByBucket = new Uint8Array(16)
  const flatPeersByBucket = new Uint8Array(16)
  for (const p of spine.peers.values()) {
    if (p.ethySession !== true || p.ethyStatus === undefined) continue
    const bMask = parseBucketsBitmask(p.ethyStatus.bucketsBitmask)
    const tMask = parseBucketsBitmask(p.ethyStatus.trieBucketsBitmask)
    for (let b = 0; b < 16; b++) {
      if ((bMask & (1 << b)) === 0) continue
      if ((tMask & (1 << b)) !== 0) triePeersByBucket[b]!++
      else flatPeersByBucket[b]!++
    }
  }

  const rows: string[][] = []
  for (let b = 0; b < 16; b++) {
    const bit = 1 << b
    const isClosed = (closedMask & bit) !== 0
    const isTrie = (trieMask & bit) !== 0
    const isAssigned = assigned.has(b)
    const pct = pctMap[b]
    const localState = isClosed
      ? isTrie
        ? 'Closed + Trie ✓'
        : 'Closed Flat'
      : isAssigned
        ? pct !== undefined
          ? `Syncing ${pct}%`
          : 'Syncing'
        : 'Open'
    const planes = `${(accMask & bit) !== 0 ? 'Acc' : '—'} · ${(codeMask & bit) !== 0 ? 'Code' : '—'} · ${(storMask & bit) !== 0 ? 'Stor' : '—'}`
    const trieN = triePeersByBucket[b]!
    const flatN = flatPeersByBucket[b]!
    const swarmCell =
      trieN + flatN === 0
        ? '0 peers'
        : trieN > 0 && flatN > 0
          ? `${trieN} trie · ${flatN} flat`
          : trieN > 0
            ? `${trieN} trie`
            : `${flatN} flat`
    const privacy = isClosed ? '🔒 Private' : trieN + flatN > 0 ? '1-hop' : 'Uncovered'
    rows.push([`0x${b.toString(16)}`, localState, planes, swarmCell, privacy])
  }
  return rows
}

function ethyPeersDebugSection(spine: EthySpine): DebugSectionSpec {
  const entries: Array<{ key: string; value: string }> = []
  for (const p of spine.peers.values()) {
    if (p.ethySession !== true) continue
    const st = p.ethyStatus
    if (st === undefined) {
      entries.push({ key: p.id.slice(0, 12), value: 'handshake pending' })
      continue
    }
    const acc = parseBucketsBitmask(st.bucketsBitmask).toString(16).padStart(4, '0')
    const stor = parseBucketsBitmask(st.storageBucketsBitmask).toString(16).padStart(4, '0')
    const code = parseBucketsBitmask(st.codeBucketsBitmask).toString(16).padStart(4, '0')
    const trie = parseBucketsBitmask(st.trieBucketsBitmask).toString(16).padStart(4, '0')
    entries.push({
      key: p.id.slice(0, 12),
      value: `pivot #${st.basePivotBlock} · acc 0x${acc} · stor 0x${stor} · code 0x${code} · trie 0x${trie}`,
    })
  }
  return {
    title: 'Connected ETHY/0 peers',
    entries: entries.length > 0 ? entries : [{ key: '—', value: 'No active ETHY/0 peers' }],
  }
}

export function ethyOverviewWidget(spine: EthySpine): WidgetSpec {
  const transport = spine.syncTransport ?? 'unset'
  const localBits = countSeedBits16(spine.ethyBucketsBitmask ?? 0)
  const s = spine.serving
  const chunks = s?.ethyChunksServed ?? 0
  const balBlocks = s?.ethyBalBlocksServed ?? 0
  const witnesses = s?.ethyWitnessesServed ?? 0
  const codes = s?.ethyCodesServed ?? 0
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
  const swarm = spine.swarm
  const shadowMode = swarm?.shadowRefresh?.mode ?? '—'
  const genAge =
    swarm?.generationAgeBlocks !== undefined ? swarm.generationAgeBlocks.toString() : '—'
  const balTail =
    swarm?.balTailEarliest !== undefined && swarm?.balTailLatest !== undefined
      ? `#${swarm.balTailEarliest.toString()}..#${swarm.balTailLatest.toString()}${swarm.balTailContiguous === false ? ' (gap)' : ''}`
      : '—'
  const electionDeadline =
    swarm?.shadowRefresh?.electionDeadlineMs !== undefined
      ? new Date(swarm.shadowRefresh.electionDeadlineMs).toISOString()
      : '—'
  const mintBucket =
    swarm?.shadowRefresh?.mintBucket !== undefined
      ? `0x${swarm.shadowRefresh.mintBucket.toString(16)}`
      : '—'
  const summaryRows: string[][] = [
    ['Transport', transport],
    ['Local seed buckets', `${localBits}/16`],
    ['ETHY sessions', String(ethyPeers)],
    ['Pivot', pivot],
    ['Generation age (blocks)', genAge],
    ['Disk BAL tail', balTail],
    ['Shadow refresh', shadowMode],
    ['Servable head window (eth)', servableWindow],
    ['Headers served (eth)', String(s?.headersServed ?? 0)],
    ['Bodies served (eth)', String(s?.bodiesServed ?? 0)],
    ['Receipts served (eth)', String(s?.receiptsServed ?? 0)],
    ['BALs served (eth)', String(s?.accessListsServed ?? 0)],
    ['Witnesses served (ETHY)', String(witnesses)],
    ['Chunks served (ETHY)', String(chunks)],
    ['Code served (ETHY)', String(codes)],
    ['BAL blocks served (ETHY)', String(balBlocks)],
  ]
  const shadowDebug: DebugSectionSpec = {
    title: 'Shadow refresh',
    entries: [
      { key: 'Mode', value: shadowMode },
      ...(swarm?.shadowRefresh?.blockedReason !== undefined
        ? [
            {
              key: 'Blocked',
              value:
                swarm.shadowRefresh.freeBytes !== undefined &&
                swarm.shadowRefresh.requiredFreeBytes !== undefined
                  ? `${swarm.shadowRefresh.blockedReason} (${(Number(swarm.shadowRefresh.freeBytes) / 1024 ** 3).toFixed(1)} / ${(Number(swarm.shadowRefresh.requiredFreeBytes) / 1024 ** 3).toFixed(1)} GiB)`
                  : swarm.shadowRefresh.blockedReason,
            },
          ]
        : []),
      {
        key: 'Progress',
        value:
          swarm?.shadowRefresh?.progressPct !== undefined
            ? `${swarm.shadowRefresh.progressPct}%`
            : '—',
      },
      {
        key: 'Target block',
        value:
          swarm?.shadowRefresh?.targetBlock !== undefined
            ? `#${swarm.shadowRefresh.targetBlock.toString()}`
            : '—',
      },
      { key: 'Election deadline (UTC)', value: electionDeadline },
      { key: 'Mint bucket', value: mintBucket },
      {
        key: 'Suppressed by',
        value: swarm?.shadowRefresh?.suppressedByPeerId ?? '—',
      },
      {
        key: 'Partial minter mask',
        value:
          swarm?.shadowRefresh?.partialMinterMask !== undefined
            ? `0x${swarm.shadowRefresh.partialMinterMask.toString(16)}`
            : '—',
      },
      {
        key: 'Suppression state',
        value: swarm?.shadowRefresh?.suppressionState ?? '—',
      },
      {
        key: 'Stalled minters',
        value:
          swarm?.shadowRefresh?.stalledMinterPeerIds !== undefined
            ? swarm.shadowRefresh.stalledMinterPeerIds.join(', ')
            : '—',
      },
    ],
  }

  const assigned = spine.custodyBuckets
  if (assigned !== undefined && assigned.length > 0) {
    const modeLabel = assigned.length === 16 ? 'Full 16/16' : `Custody ${assigned.length}/16`
    const assignedText =
      assigned.length === 16 ? '0x0..0xf' : assigned.map((b) => `#${b.toString(16)}`).join(', ')
    const lastAsm = spine.custodyLastAssembly
    const rootStatus =
      lastAsm !== undefined
        ? `#${lastAsm.anchorBlock} (${lastAsm.viaBootstrap ? 'bootstrap 530B' : '16/16 assembled'})`
        : 'pending'
    const res = spine.custodyResolve
    const resolveText =
      res !== undefined
        ? `local ${res.local} · tomb ${res.tombstone} · prf ${res.ethyProof} · ch ${res.ethyChunk} · snap ${res.snap}`
        : 'local 0 · tomb 0 · prf 0 · ch 0 · snap 0'
    const asmLog = spine.custodyAssemblyLog ?? []
    const asmDebug: DebugSectionSpec = {
      title: 'Root assembly log (recent)',
      entries:
        asmLog.length > 0
          ? asmLog.map((line, i) => ({ key: String(i + 1), value: line }))
          : [{ key: '—', value: 'No root assemblies yet' }],
    }
    return {
      kind: 'table',
      title: 'ETHY/0 custody matrix',
      preface: [
        { key: 'Custody mode', value: `${modeLabel} (${assignedText})` },
        { key: 'BAL horizon', value: balTail },
        { key: 'RootNode assembly', value: rootStatus },
        { key: 'Resolve breakdown', value: resolveText },
        { key: 'Local enode', value: localEnode },
      ],
      headers: ['Bucket', 'Local state', 'Planes', '1-hop swarm', 'Privacy'],
      rows: buildCustodyMatrixRows(spine),
      secondaryTable: {
        title: 'ETHY/0 swarm',
        headers: ['Field', 'Value'],
        rows: summaryRows,
      },
      debugPage: [ethyPeersDebugSection(spine), asmDebug, shadowDebug],
      assistantComment:
        'Unified Custody ETHY/0: closed buckets resolve privately on disk; open buckets resolve in 1 hop from connected custodians with 0 snap/1.',
    }
  }

  return {
    kind: 'table',
    title: 'ETHY/0 swarm',
    preface: [{ key: 'Local enode', value: localEnode }],
    headers: ['Field', 'Value'],
    debugPage: [ethyPeersDebugSection(spine), shadowDebug],
    rows: summaryRows,
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
