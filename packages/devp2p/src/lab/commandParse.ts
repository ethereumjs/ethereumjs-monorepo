import type { CommandRequest } from './commandDispatcher.ts'
import { MAINNET_STATUS_JSON } from './inProcessMesh.ts'

/** Parse `key=value` tokens from REPL lines. */
export function parseReplKeyValues(tokens: string[]): Record<string, string> {
  const out: Record<string, string> = {}
  for (const t of tokens) {
    const eq = t.indexOf('=')
    if (eq > 0) {
      out[t.slice(0, eq)] = t.slice(eq + 1)
    }
  }
  return out
}

export function parseReplLine(line: string): CommandRequest {
  const parts = line.split(/\s+/).filter(Boolean)
  const head = parts[0]

  if (head === 'peer' && parts[1] === 'add') {
    return {
      cmd: 'peer.add',
      host: parts[2],
      udpPort: Number(parts[3]),
      tcpPort: parts[4] !== undefined ? Number(parts[4]) : undefined,
    }
  }
  if (head === 'peer' && parts[1] === 'disconnect') {
    return { cmd: 'peer.disconnect', peerIndex: parts[2] !== undefined ? Number(parts[2]) : 0 }
  }
  if (head === 'peers' || head === 'peer.list' || (head === 'peer' && parts[1] === 'list')) {
    return { cmd: 'peer.list' }
  }
  if (head === 'dpt' && parts[1] === 'ping') {
    return { cmd: 'dpt.ping', host: parts[2], udpPort: Number(parts[3]) }
  }
  if (head === 'rlpx' && parts[1] === 'ping') {
    return { cmd: 'rlpx.ping', peerIndex: parts[2] !== undefined ? Number(parts[2]) : 0 }
  }
  if (head === 'wait') {
    const event = parts[1] ?? 'peer.added'
    const timeoutMs = parts[2] !== undefined ? Number(parts[2]) * 1000 : 30000
    return { cmd: 'wait', event, timeoutMs }
  }
  if (head === 'trace' && parts[1] === 'on') return { cmd: 'trace.on' }
  if (head === 'trace' && parts[1] === 'off') return { cmd: 'trace.off' }
  if (head === 'eth' && parts[1] === 'send') {
    const name = parts[2]
    if (!name) throw new Error('eth send requires message name')
    const fields = parseReplKeyValues(parts.slice(3))
    if (name === 'STATUS') {
      return {
        cmd: 'eth.sendStatus',
        peerIndex: 0,
        status: statusFromReplFields(fields),
      }
    }
    return {
      cmd: 'eth.send',
      name,
      peerIndex: fields.peer !== undefined ? Number(fields.peer) : 0,
      json: ethFieldsFromRepl(name, fields),
    }
  }
  if (head === 'snap' && parts[1] === 'send') {
    const name = parts[2]
    if (!name) throw new Error('snap send requires message name')
    const fields = parseReplKeyValues(parts.slice(3))
    return {
      cmd: 'snap.send',
      name,
      peerIndex: fields.peer !== undefined ? Number(fields.peer) : 0,
      json: snapFieldsFromRepl(name, fields),
    }
  }
  throw new Error(`Unknown REPL command: ${line}`)
}

function statusFromReplFields(fields: Record<string, string>) {
  return {
    td: fields.td ?? MAINNET_STATUS_JSON.td,
    bestHash: fields.bestHash ?? MAINNET_STATUS_JSON.bestHash,
    genesisHash: fields.genesisHash ?? MAINNET_STATUS_JSON.genesisHash,
    latestBlock: fields.latestBlock,
  }
}

function ethFieldsFromRepl(name: string, fields: Record<string, string>): Record<string, unknown> {
  if (name === 'GET_BLOCK_HEADERS') {
    return {
      requestId: fields.requestId ?? '0x01',
      blockHash: fields.blockHash,
      block: fields.block,
      max: fields.max !== undefined ? Number(fields.max) : 1,
      skip: fields.skip !== undefined ? Number(fields.skip) : 0,
      reverse: fields.reverse === 'true',
    }
  }
  return { ...fields }
}

function snapFieldsFromRepl(name: string, fields: Record<string, string>): Record<string, unknown> {
  if (name === 'GET_ACCOUNT_RANGE') {
    return {
      requestId: fields.requestId !== undefined ? Number(fields.requestId) : 1,
      root: fields.root !== undefined ? Number(fields.root) : 437000,
      limit: fields.limit !== undefined ? Number(fields.limit) : 1,
      offset: fields.offset !== undefined ? Number(fields.offset) : 0,
      bytes: fields.bytes !== undefined ? Number(fields.bytes) : 0,
    }
  }
  return { ...fields }
}

export function buildEthSendRequest(opts: {
  name?: string
  peer?: string
  json?: string
  rlp?: string
}): CommandRequest {
  const name = opts.name
  if (!name) throw new Error('message name is required')
  const peerIndex = Number(opts.peer ?? 0)
  if (name === 'STATUS') {
    return {
      cmd: 'eth.sendStatus',
      peerIndex,
      status: opts.json ? JSON.parse(opts.json) : MAINNET_STATUS_JSON,
    }
  }
  return {
    cmd: 'eth.send',
    peerIndex,
    name,
    json: opts.json ? JSON.parse(opts.json) : undefined,
    rlp: opts.rlp ? JSON.parse(opts.rlp) : undefined,
  }
}

export function buildEthWaitRequest(opts: { name?: string; timeoutMs?: number }): CommandRequest {
  if (!opts.name) throw new Error('message name is required')
  return {
    cmd: 'wait',
    event: `eth.${opts.name}`,
    timeoutMs: opts.timeoutMs ?? 30000,
  }
}

export function buildSnapSendRequest(opts: {
  name?: string
  peer?: string
  json?: string
  rlp?: string
}): CommandRequest {
  const name = opts.name
  if (!name) throw new Error('message name is required')
  return {
    cmd: 'snap.send',
    peerIndex: Number(opts.peer ?? 0),
    name,
    json: opts.json ? JSON.parse(opts.json) : undefined,
    rlp: opts.rlp ? JSON.parse(opts.rlp) : undefined,
  }
}

export function buildSnapWaitRequest(opts: { name?: string; timeoutMs?: number }): CommandRequest {
  if (!opts.name) throw new Error('message name is required')
  return {
    cmd: 'wait',
    event: `snap.${opts.name}`,
    timeoutMs: opts.timeoutMs ?? 30000,
  }
}

export function buildWaitRequest(opts: { event?: string; timeoutMs?: number }): CommandRequest {
  if (!opts.event) throw new Error('--event is required')
  return {
    cmd: 'wait',
    event: opts.event,
    timeoutMs: opts.timeoutMs ?? 30000,
  }
}
