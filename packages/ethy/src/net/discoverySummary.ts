import type { WorkerDiscoverySnapshot } from '@ethereumjs/devp2p'

const STATUS_FAIL_KEYS = ['genesis', 'network', 'fork', 'reset', 'slots', 'timeout'] as const

const LABEL_WIDTH = 9

function chunks(part: string, budget: number): string[] {
  if (part.length <= budget) return [part]
  const out: string[] = []
  let rest = part
  while (rest.length > budget) {
    let cut = rest.lastIndexOf(' ', budget)
    if (cut < 12) cut = budget
    out.push(rest.slice(0, cut).trimEnd())
    rest = rest.slice(cut).trimStart()
  }
  if (rest.length > 0) out.push(rest)
  return out
}

function pack(label: string, parts: string[], width: number): string[] {
  const prefix = `${label.padEnd(LABEL_WIDTH)}`
  const indent = ' '.repeat(LABEL_WIDTH)
  const budget = Math.max(8, width - LABEL_WIDTH)
  const pieces = parts.flatMap((part) => chunks(part, budget))
  const lines: string[] = []
  let buf = ''
  for (const part of pieces) {
    const next = buf.length === 0 ? `${prefix}${part}` : `${buf}   ${part}`
    if (buf.length > 0 && next.length > width) {
      lines.push(buf)
      buf = `${indent}${part}`
      continue
    }
    buf = next
  }
  if (buf.length > 0) lines.push(buf)
  if (lines.length === 0) lines.push(prefix.trimEnd())
  return lines
}

function fateParts(d: WorkerDiscoverySnapshot): string[] {
  const fates = d.rlpx.peerFates
  if (fates === undefined) return ['—']
  return Object.entries(fates)
    .map(([label, counts]) => {
      const bits = [
        label,
        counts.remote !== undefined ? `remote ${counts.remote}` : '',
        counts.we !== undefined ? `we ${counts.we}` : '',
        counts.reset !== undefined ? `reset ${counts.reset}` : '',
      ].filter((bit) => bit.length > 0)
      const total = (counts.remote ?? 0) + (counts.we ?? 0) + (counts.reset ?? 0)
      return { total, text: bits.join(' ') }
    })
    .sort((a, b) => b.total - a.total)
    .slice(0, 4)
    .map((row) => row.text)
}

function discParts(d: WorkerDiscoverySnapshot): string[] {
  const parts = Object.entries(d.rlpx.disconnects)
    .sort((a, b) => b[1] - a[1])
    .map(([key, count]) => {
      const short = key
        .replace(' (remote dropped us)', '/remote')
        .replace(' (we dropped remote)', '/we')
      return `${short} ${count}`
    })
  return parts.length > 0 ? parts : ['—']
}

/**
 * Discovery counters as labeled rows. Each row wraps inside `width` instead of
 * dropping fields off the end of one line.
 */
export function formatDiscoveryLines(
  d: WorkerDiscoverySnapshot | undefined,
  width: number,
  ring?: { size: number; capacity: number },
): string[] {
  const room = Math.max(40, width)
  if (d === undefined) {
    return ['Discovery metrics not available']
  }
  const fork = d.advertisedFork
  const rejects = d.rlpx.handshakeRejects ?? {}
  const dpt = d.dpt
  const lines = [
    ...pack(
      'Bind',
      [
        `udp ${d.boundAddress}:${d.boundUdpPort}`,
        `tcp ${d.boundTcpPort}`,
        `table ${d.tablePeers}`,
        ...(ring !== undefined ? [`ring ${ring.size}/${ring.capacity}`] : []),
      ],
      room,
    ),
    ...pack(
      'Discover',
      [
        `boot ${d.bootstrap.ok}/${d.bootstrap.attempts}`,
        `fail ${d.bootstrap.fail}`,
        `dns ${d.dns.peersAdded}/${d.dns.attempts}`,
        `resolver ${d.dns.resolver ?? '—'}`,
      ],
      room,
    ),
    ...pack(
      'RLPx',
      [
        `dial ${d.rlpx.dials}`,
        `conn ${d.rlpx.connected}`,
        `status ${d.rlpx.statusOk}`,
        `sent ${d.rlpx.statusSent ?? 0}`,
      ],
      room,
    ),
    ...pack('Fork', [fork?.hardfork ?? '—', fork?.hash ?? '—', `next ${fork?.next ?? '—'}`], room),
    ...pack(
      'Reject',
      [
        ...STATUS_FAIL_KEYS.map((key) => `${key} ${rejects[key] ?? 0}`),
        `afterHello ${d.rlpx.resetAfterHello ?? 0}`,
      ],
      room,
    ),
    ...pack('Disc', discParts(d), room),
    ...pack('Fate', fateParts(d), room),
    ...pack(
      'Ban',
      [
        `new ${dpt?.bansIssued ?? 0}`,
        `skip ${dpt?.banSkips ?? 0}`,
        `last ${dpt?.lastRemote ?? '—'}`,
      ],
      room,
    ),
  ]
  if (dpt?.lastCause !== undefined && dpt.lastCause.length > 0) {
    lines.push(...pack('Cause', [dpt.lastCause], room))
  }
  const last = d.rlpx.lastSubprotocolError
  if (last !== undefined && last.length > 0) {
    lines.push(...pack('Last', [last], room))
  }
  return lines
}

/** Single-line form for logs. The diagnostic view uses {@link formatDiscoveryLines}. */
export function formatDiscoverySummary(d: WorkerDiscoverySnapshot | undefined): string {
  return formatDiscoveryLines(d, 400).join(' · ')
}
