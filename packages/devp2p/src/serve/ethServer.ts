import { RLP } from '@ethereumjs/rlp'
import { bytesToBigInt, intToUnpaddedBytes } from '@ethereumjs/util'

import { encodeBlockHeaders, ethUsesRequestId } from '../protocol/eth/codec.ts'
import { EthMessageCodes } from '../protocol/eth/codes.ts'

import type { Input } from '@ethereumjs/rlp'
import type { RollingBlockStore } from './rollingBlockStore.ts'

export type EthServeReply = {
  code: number
  name: string
  rlp: Input
  bytesEstimate: number
  metric: 'headers' | 'bodies' | 'receipts' | 'accessLists'
}

const MAX_HEADER_LIMIT = 64

function rlpSizeEstimate(input: Input): number {
  return RLP.encode(input).byteLength
}

function headerParentHash(headerRlp: Uint8Array): Uint8Array | undefined {
  const decoded = RLP.decode(headerRlp)
  if (!Array.isArray(decoded) || decoded.length === 0) return undefined
  const parent = decoded[0]
  return parent instanceof Uint8Array && parent.length === 32 ? parent : undefined
}

function parseGetBlockHeaders(
  ethVersion: number,
  payload: unknown,
): {
  requestId: Input
  startBlock: Uint8Array
  limit: number
  skip: number
  reverse: boolean
} | null {
  let inner: unknown
  let requestId: Input = intToUnpaddedBytes(1)
  if (ethUsesRequestId(ethVersion)) {
    if (!Array.isArray(payload) || payload.length < 2) return null
    requestId = payload[0] as Input
    inner = payload[1]
  } else {
    inner = payload
  }
  if (!Array.isArray(inner) || inner.length < 4) return null
  const start = inner[0]
  if (!(start instanceof Uint8Array)) return null
  const limit = Number(bytesToBigInt(inner[1] as Uint8Array))
  const skip = Number(bytesToBigInt(inner[2] as Uint8Array))
  const reverse = bytesToBigInt(inner[3] as Uint8Array) === 1n
  return {
    requestId,
    startBlock: start,
    limit: Math.min(Math.max(limit, 0), MAX_HEADER_LIMIT),
    skip,
    reverse,
  }
}

export function tryServeEthGet(
  store: RollingBlockStore,
  ethVersion: number,
  messageName: string,
  decodedPayload: unknown,
  byteBudget: number,
): EthServeReply | undefined {
  switch (messageName) {
    case 'GET_BLOCK_HEADERS':
      return serveHeaders(store, ethVersion, decodedPayload, byteBudget)
    case 'GET_BLOCK_BODIES':
      return serveBodies(store, ethVersion, decodedPayload, byteBudget)
    case 'GET_RECEIPTS':
      return serveReceipts(store, ethVersion, decodedPayload, byteBudget)
    case 'GET_BLOCK_ACCESS_LISTS':
      if (ethVersion < 71) return undefined
      return serveAccessLists(store, ethVersion, decodedPayload, byteBudget)
    default:
      return undefined
  }
}

function serveHeaders(
  store: RollingBlockStore,
  ethVersion: number,
  payload: unknown,
  byteBudget: number,
): EthServeReply | undefined {
  const q = parseGetBlockHeaders(ethVersion, payload)
  if (q === null) return undefined

  let current: ReturnType<RollingBlockStore['getByHash']> | undefined
  if (q.startBlock.length === 32) {
    current = store.getByHash(q.startBlock)
  } else {
    const n = bytesToBigInt(q.startBlock)
    current = store.getByNumber(n)
  }
  if (current === undefined) return undefined

  const headers: Input[] = []
  let bytes = 0
  let block = current
  for (let i = 0; i < q.limit; i++) {
    const item = block.headerRlp
    const nextSize = bytes + item.byteLength
    if (headers.length > 0 && nextSize > byteBudget) break
    headers.push(item)
    bytes = nextSize
    if (i + 1 >= q.limit) break
    if (q.reverse) {
      let walk: typeof block | undefined = block
      for (let s = 0; s <= q.skip; s++) {
        const parent = headerParentHash(walk.headerRlp)
        if (parent === undefined) {
          walk = undefined
          break
        }
        const p = store.getByHash(parent)
        if (p === undefined) {
          walk = undefined
          break
        }
        walk = p
      }
      if (walk === undefined) break
      block = walk
    } else {
      const nextNum = block.number + BigInt(q.skip + 1)
      const nextBlock = store.getByNumber(nextNum)
      if (nextBlock === undefined) break
      block = nextBlock
    }
  }

  if (headers.length === 0) return undefined
  const rlp = encodeBlockHeaders(ethVersion, q.requestId, headers)
  return {
    code: EthMessageCodes.BLOCK_HEADERS,
    name: 'BLOCK_HEADERS',
    rlp,
    bytesEstimate: rlpSizeEstimate(rlp),
    metric: 'headers',
  }
}

function hashListFromGet(
  payload: unknown,
  ethVersion: number,
): { requestId: Input; hashes: Uint8Array[] } | null {
  if (!Array.isArray(payload)) return null
  if (ethUsesRequestId(ethVersion)) {
    if (payload.length < 2) return null
    const hashesRaw = payload[1]
    if (!Array.isArray(hashesRaw)) return null
    const hashes = hashesRaw.filter(
      (h): h is Uint8Array => h instanceof Uint8Array && h.length === 32,
    )
    return { requestId: payload[0] as Input, hashes }
  }
  const hashes = payload.filter((h): h is Uint8Array => h instanceof Uint8Array && h.length === 32)
  return { requestId: intToUnpaddedBytes(1), hashes }
}

function serveBodies(
  store: RollingBlockStore,
  ethVersion: number,
  payload: unknown,
  byteBudget: number,
): EthServeReply | undefined {
  const list = hashListFromGet(payload, ethVersion)
  if (list === null || list.hashes.length === 0) return undefined
  const bodies: Input[] = []
  let bytes = 0
  let any = false
  for (const hash of list.hashes) {
    const b = store.getByHash(hash)
    if (b === undefined) continue
    any = true
    const next = bytes + b.bodyRlp.byteLength
    if (bodies.length > 0 && next > byteBudget) break
    bodies.push(b.bodyRlp)
    bytes = next
  }
  if (!any) return undefined
  const rlp = ethUsesRequestId(ethVersion) ? [list.requestId, bodies] : bodies
  return {
    code: EthMessageCodes.BLOCK_BODIES,
    name: 'BLOCK_BODIES',
    rlp,
    bytesEstimate: rlpSizeEstimate(rlp),
    metric: 'bodies',
  }
}

function serveReceipts(
  store: RollingBlockStore,
  ethVersion: number,
  payload: unknown,
  byteBudget: number,
): EthServeReply | undefined {
  if (ethVersion < 69) return undefined
  let requestId: Input = intToUnpaddedBytes(1)
  let firstIndex = 0
  let hashes: Uint8Array[] = []
  if (!Array.isArray(payload)) return undefined
  if (ethVersion >= 70) {
    if (payload.length < 3) return undefined
    requestId = payload[0] as Input
    firstIndex = Number(bytesToBigInt(payload[1] as Uint8Array))
    const hashesRaw = payload[2]
    if (!Array.isArray(hashesRaw)) return undefined
    hashes = hashesRaw.filter((h): h is Uint8Array => h instanceof Uint8Array && h.length === 32)
  } else {
    if (payload.length < 2) return undefined
    requestId = payload[0] as Input
    const hashesRaw = payload[1]
    if (!Array.isArray(hashesRaw)) return undefined
    hashes = hashesRaw.filter((h): h is Uint8Array => h instanceof Uint8Array && h.length === 32)
  }
  if (hashes.length === 0) return undefined

  const lists: Input[] = []
  let bytes = 0
  let any = false
  let lastBlockIncomplete = intToUnpaddedBytes(0)
  for (let hi = 0; hi < hashes.length; hi++) {
    const b = store.getByHash(hashes[hi]!)
    if (b === undefined) continue
    any = true
    let receiptList = RLP.decode(b.receiptsEth69Rlp) as Input[]
    if (!Array.isArray(receiptList)) receiptList = []
    if (hi === 0 && firstIndex > 0) {
      receiptList = receiptList.slice(firstIndex)
    }
    const next = bytes + RLP.encode(receiptList).byteLength
    if (lists.length > 0 && next > byteBudget) {
      lastBlockIncomplete = intToUnpaddedBytes(1)
      break
    }
    lists.push(receiptList)
    bytes = next
  }
  if (!any) return undefined
  const rlp =
    ethVersion >= 70
      ? [requestId, lastBlockIncomplete, lists]
      : ethUsesRequestId(ethVersion)
        ? [requestId, lists]
        : lists
  return {
    code: EthMessageCodes.RECEIPTS,
    name: 'RECEIPTS',
    rlp,
    bytesEstimate: rlpSizeEstimate(rlp),
    metric: 'receipts',
  }
}

function serveAccessLists(
  store: RollingBlockStore,
  ethVersion: number,
  payload: unknown,
  byteBudget: number,
): EthServeReply | undefined {
  const list = hashListFromGet(payload, ethVersion)
  if (list === null || list.hashes.length === 0) return undefined
  const out: Input[] = []
  let bytes = 0
  let any = false
  for (const hash of list.hashes) {
    const b = store.getByHash(hash)
    if (b === undefined) continue
    any = true
    const item = b.balRlp ?? new Uint8Array(0)
    const next = bytes + (item.length === 0 ? 1 : item.byteLength)
    if (out.length > 0 && next > byteBudget) break
    out.push(item.length === 0 ? new Uint8Array(0) : item)
    bytes = next
  }
  if (!any) return undefined
  const rlp = [list.requestId, out]
  return {
    code: EthMessageCodes.BLOCK_ACCESS_LISTS,
    name: 'BLOCK_ACCESS_LISTS',
    rlp,
    bytesEstimate: rlpSizeEstimate(rlp),
    metric: 'accessLists',
  }
}
