import type { Input } from '@ethereumjs/rlp'

/**
 * Empty answer for a lab node that has no chain or state.
 * eth/66+ keeps the request id. The list (headers, bodies, …) is empty.
 */
export function emptyWireReply(
  kind: 'eth' | 'snap',
  version: number,
  name: string,
  payload: unknown,
): { name: string; rlp: Input } | undefined {
  if (kind === 'snap') return emptySnapReply(name, payload)
  return emptyEthReply(version, name, payload)
}

const ETH_LIST_REPLY: Record<string, { name: string; min: number; max?: number }> = {
  GET_BLOCK_HEADERS: { name: 'BLOCK_HEADERS', min: 62 },
  GET_BLOCK_BODIES: { name: 'BLOCK_BODIES', min: 62 },
  GET_RECEIPTS: { name: 'RECEIPTS', min: 63 },
  GET_NODE_DATA: { name: 'NODE_DATA', min: 63, max: 66 },
  GET_POOLED_TRANSACTIONS: { name: 'POOLED_TRANSACTIONS', min: 65 },
}

function emptyEthReply(
  version: number,
  name: string,
  payload: unknown,
): { name: string; rlp: Input } | undefined {
  const spec = ETH_LIST_REPLY[name]
  if (!spec) return undefined
  if (version < spec.min) return undefined
  if (spec.max !== undefined && version > spec.max) return undefined
  if (version >= 66) return { name: spec.name, rlp: [requestIdOf(payload), []] }
  return { name: spec.name, rlp: [] }
}

const SNAP_REPLY: Record<string, 'proof' | 'list'> = {
  GET_ACCOUNT_RANGE: 'proof',
  GET_STORAGE_RANGES: 'proof',
  GET_BYTE_CODES: 'list',
  GET_TRIE_NODES: 'list',
}

const SNAP_REPLY_NAME: Record<string, string> = {
  GET_ACCOUNT_RANGE: 'ACCOUNT_RANGE',
  GET_STORAGE_RANGES: 'STORAGE_RANGES',
  GET_BYTE_CODES: 'BYTE_CODES',
  GET_TRIE_NODES: 'TRIE_NODES',
}

function emptySnapReply(name: string, payload: unknown): { name: string; rlp: Input } | undefined {
  const shape = SNAP_REPLY[name]
  const replyName = SNAP_REPLY_NAME[name]
  if (!shape || !replyName) return undefined
  const id = requestIdOf(payload)
  if (shape === 'proof') return { name: replyName, rlp: [id, [], []] }
  return { name: replyName, rlp: [id, []] }
}

function requestIdOf(payload: unknown): Input {
  if (Array.isArray(payload) && payload.length > 0) {
    const id = payload[0]
    if (id instanceof Uint8Array || typeof id === 'string' || typeof id === 'number') {
      return id as Input
    }
  }
  return new Uint8Array()
}
