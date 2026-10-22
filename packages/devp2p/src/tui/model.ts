import type { LabEventRecord } from '../lab/eventBus.ts'

export const DEFAULT_TRANSCRIPT_CAP = 120

export type TranscriptLine = {
  layer: 'dpt' | 'rlpx' | 'eth' | 'snap'
  dir: 'in' | 'out'
  name: string
  peer?: string
  payloadLines: string[]
  message?: string
  /** Command reply on this pane. Not a wire message, so it does not pair with protocol traffic. */
  local?: boolean
}

export type PaneStatus = {
  nodeName: string
  listenLabel?: string
  rlpxPeerCount: number
  lastPeer?: string
  remoteClientId?: string
  ethStatusSent: boolean
  ethStatusReceived: boolean
  attachedOnly?: boolean
  remoteViewLabel?: string
}

export type PaneState = {
  status: PaneStatus
  transcript: TranscriptLine[]
}

export type ReducePaneOptions = {
  /** When set, only events whose `peer` matches this host:port (see `peerMatchesFilter`). */
  peerFilter?: string
  transcriptCap?: number
  /** RLPx PING / PONG. Off unless the TUI is started with `--pings`. */
  showKeepalive?: boolean
}

export function createPaneState(nodeName: string, init?: Partial<PaneStatus>): PaneState {
  return {
    status: {
      nodeName,
      rlpxPeerCount: 0,
      ethStatusSent: false,
      ethStatusReceived: false,
      ...init,
    },
    transcript: [],
  }
}

/** Normalize peer endpoints for filter matching (IPv4-mapped IPv6, port). */
export function normalizePeerEndpoint(peer?: string): { host: string; port: number } | undefined {
  if (!peer) return undefined
  const trimmed = peer.trim()
  if (!trimmed) return undefined
  let host = trimmed
  let portPart = ''
  if (trimmed.startsWith('[')) {
    const end = trimmed.indexOf(']')
    if (end > 0) {
      host = trimmed.slice(1, end)
      portPart = trimmed.slice(end + 1).replace(/^:/, '')
    }
  } else {
    const lastColon = trimmed.lastIndexOf(':')
    if (lastColon > 0) {
      host = trimmed.slice(0, lastColon)
      portPart = trimmed.slice(lastColon + 1)
    }
  }
  if (host.startsWith('::ffff:')) host = host.slice(7)
  const port = Number(portPart)
  if (!Number.isFinite(port)) return undefined
  return { host, port }
}

/** Display form of a peer endpoint (`::ffff:127.0.0.1:30302` → `127.0.0.1:30302`). */
export function formatPeerLabel(peer?: string): string | undefined {
  const parsed = normalizePeerEndpoint(peer)
  if (!parsed) return peer
  return `${parsed.host}:${parsed.port}`
}

export function peerMatchesFilter(peer: string | undefined, filter: string): boolean {
  const a = normalizePeerEndpoint(peer)
  const b = normalizePeerEndpoint(filter)
  if (!a || !b) return false
  if (a.port !== b.port) return false
  if (a.host === b.host) return true
  if (a.host === '127.0.0.1' && b.host === 'localhost') return true
  if (a.host === 'localhost' && b.host === '127.0.0.1') return true
  return false
}

export function parseListenFromLog(message: string): string | undefined {
  const m = message.match(/listening udp=(\d+) tcp=(\d+)/)
  if (!m) return undefined
  return `127.0.0.1:${m[2]}`
}

/** eth STATUS RLP order (eth/64+): version, networkId, td, bestHash, genesis, forkId. */
const ETH_STATUS_FIELDS = [
  'version',
  'networkId',
  'td',
  'bestHash',
  'genesisHash',
  'forkId',
] as const

function payloadToLines(payload: unknown, layer?: string, name?: string): string[] {
  if (payload === undefined || payload === null) return []
  if (layer === 'eth' && name === 'STATUS' && Array.isArray(payload)) {
    return statusArrayLines(payload)
  }
  if (layer === 'eth' && name === 'GET_BLOCK_HEADERS' && Array.isArray(payload)) {
    return namedArrayLines(payload, ['requestId', 'block', 'max', 'skip', 'reverse'])
  }
  if (layer === 'eth' && name === 'BLOCK_HEADERS' && Array.isArray(payload)) {
    return blockHeadersLines(payload)
  }
  if (typeof payload !== 'object') return [String(payload)]
  if (Array.isArray(payload)) {
    return payload.map((value, i) => `${i}  ${formatPayloadValue(value)}`)
  }
  const lines: string[] = []
  for (const [key, value] of Object.entries(payload as Record<string, unknown>)) {
    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      lines.push(key)
      for (const [k2, v2] of Object.entries(value as Record<string, unknown>)) {
        lines.push(`  ${k2}  ${formatPayloadValue(v2)}`)
      }
    } else {
      lines.push(`${key}  ${formatPayloadValue(value)}`)
    }
  }
  return lines
}

function namedArrayLines(payload: unknown[], keys: string[]): string[] {
  return payload.map((value, i) => {
    const key = keys[i] ?? String(i)
    if (key === 'block' && Array.isArray(value) && value.length === 1) {
      return `blockHash  ${formatPayloadValue(value[0])}`
    }
    if (key === 'reverse') {
      const raw = formatPayloadValue(value)
      if (raw === '0x00' || raw === '0x') return 'reverse  false'
      if (raw === '0x01') return 'reverse  true'
    }
    return `${key}  ${formatPayloadValue(value)}`
  })
}

function blockHeadersLines(payload: unknown[]): string[] {
  const lines = [`requestId  ${formatPayloadValue(payload[0])}`]
  const headers = payload[1]
  if (Array.isArray(headers) && headers.length === 0) lines.push('headers  (none)')
  else lines.push(`headers  ${formatPayloadValue(headers)}`)
  return lines
}

function statusArrayLines(payload: unknown[]): string[] {
  const lines: string[] = []
  payload.forEach((value, i) => {
    const key = ETH_STATUS_FIELDS[i] ?? String(i)
    if (key === 'forkId' && Array.isArray(value)) {
      lines.push(`forkHash  ${formatPayloadValue(value[0])}`)
      const next = formatPayloadValue(value[1])
      if (next && next !== '0x') lines.push(`forkNext  ${next}`)
      return
    }
    lines.push(`${key}  ${formatPayloadValue(value)}`)
  })
  return lines
}

function formatPayloadValue(value: unknown): string {
  if (value === null || value === undefined) return ''
  if (typeof value === 'string') return value
  if (typeof value === 'number' || typeof value === 'boolean') return String(value)
  try {
    return JSON.stringify(value)
  } catch {
    return String(value)
  }
}

export function reduceLabEvent(
  pane: PaneState,
  ev: LabEventRecord,
  opts: ReducePaneOptions = {},
): PaneState {
  const cap = opts.transcriptCap ?? DEFAULT_TRANSCRIPT_CAP
  const next: PaneState = {
    status: { ...pane.status },
    transcript: pane.transcript.slice(),
  }

  if (ev.t === 'log' && ev.message) {
    const listen = parseListenFromLog(ev.message)
    if (listen) next.status.listenLabel = listen
    return next
  }

  if (ev.t !== 'event') return next

  if (opts.peerFilter && ev.peer && !peerMatchesFilter(ev.peer, opts.peerFilter)) {
    return next
  }

  const layer = ev.layer
  if (!layer || !ev.name) return next

  if (!opts.showKeepalive && layer === 'rlpx' && (ev.name === 'PING' || ev.name === 'PONG')) {
    return next
  }

  if (layer === 'rlpx' && ev.name === 'peer:added') {
    next.status.rlpxPeerCount += 1
    if (ev.peer) next.status.lastPeer = ev.peer
    if (ev.clientId) next.status.remoteClientId = ev.clientId
  }
  if (layer === 'rlpx' && ev.name === 'peer:removed') {
    next.status.rlpxPeerCount = Math.max(0, next.status.rlpxPeerCount - 1)
  }
  if (layer === 'eth' && ev.name === 'STATUS') {
    if (ev.dir === 'out') next.status.ethStatusSent = true
    if (ev.dir === 'in') next.status.ethStatusReceived = true
  }

  if (ev.dir !== 'in' && ev.dir !== 'out') {
    if (ev.message) {
      appendTranscript(
        next,
        {
          layer,
          dir: 'in',
          name: ev.name,
          peer: ev.peer,
          payloadLines: [],
          message: ev.message,
        },
        cap,
      )
    }
    return next
  }

  appendTranscript(
    next,
    {
      layer,
      dir: ev.dir,
      name: ev.name,
      peer: ev.peer,
      payloadLines: payloadToLines(ev.payload, layer, ev.name),
      message: ev.message,
    },
    cap,
  )
  return next
}

/** Lines for a control-socket reply. `undefined` when the wire event already shows the send. */
export function formatCommandReply(cmd: string, data: unknown): string[] | undefined {
  if (isSentAck(data)) return undefined
  if (cmd === 'peer.list' && Array.isArray(data)) {
    if (data.length === 0) return ['(none)']
    return data.map((row) => formatPeerRow(row))
  }
  const lines = payloadToLines(data)
  return lines.length > 0 ? lines : ['ok']
}

export function commandLayer(cmd: string): TranscriptLine['layer'] {
  if (cmd.startsWith('dpt')) return 'dpt'
  if (cmd.startsWith('eth')) return 'eth'
  if (cmd.startsWith('snap')) return 'snap'
  return 'rlpx'
}

export function appendLocalReply(pane: PaneState, line: TranscriptLine): PaneState {
  const next: PaneState = {
    status: { ...pane.status },
    transcript: pane.transcript.slice(),
  }
  appendTranscript(next, { ...line, local: true }, DEFAULT_TRANSCRIPT_CAP)
  return next
}

function isSentAck(data: unknown): boolean {
  if (data === null || typeof data !== 'object' || Array.isArray(data)) return false
  const keys = Object.keys(data as Record<string, unknown>)
  return keys.length === 1 && keys[0] === 'sent'
}

function formatPeerRow(row: unknown): string {
  if (row === null || typeof row !== 'object') return String(row)
  const rec = row as { index?: number; addr?: string }
  const addr = formatPeerLabel(rec.addr) ?? rec.addr ?? '?'
  return rec.index === undefined ? addr : `${rec.index}  ${addr}`
}

function appendTranscript(pane: PaneState, line: TranscriptLine, cap: number) {
  pane.transcript.push(line)
  if (pane.transcript.length > cap) {
    pane.transcript.splice(0, pane.transcript.length - cap)
  }
}

export function applyPeerListStatus(
  pane: PaneState,
  peers: Array<{ index: number; addr: string }>,
): PaneState {
  const next: PaneState = {
    status: { ...pane.status },
    transcript: pane.transcript.slice(),
  }
  next.status.rlpxPeerCount = peers.length
  if (peers.length > 0) {
    next.status.lastPeer = peers[peers.length - 1]!.addr
  }
  return next
}
