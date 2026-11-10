import { createBlockHeaderFromBytesArray, createBlockHeaderFromRLP } from '@ethereumjs/block'
import { Common } from '@ethereumjs/common'
import { EthMessageCodes, buildGetBlockHeadersFromJSON, ethUsesRequestId } from '@ethereumjs/devp2p'
import { RLP } from '@ethereumjs/rlp'
import {
  type PrefixedHexString,
  bytesToBigInt,
  bytesToHex,
  equalsBytes,
  hexToBytes,
  intToUnpaddedBytes,
} from '@ethereumjs/util'

import type { ChainConfig } from '@ethereumjs/common'

export type ParsedPivotHeader = {
  number: bigint
  stateRoot: Uint8Array
  hash: Uint8Array
  blockAccessListHash?: Uint8Array
}

function hx(s: string): PrefixedHexString {
  return s as PrefixedHexString
}

/** RLP payload for `GET_BLOCK_HEADERS` (one header at `blockHashHex`). */
export function encodeGetBlockHeadersPayload(
  ethVersion: number,
  blockHashHex: string,
  requestId = 1,
): Uint8Array {
  const reqHex = `0x${requestId.toString(16).padStart(2, '0')}`
  const input = buildGetBlockHeadersFromJSON(
    ethVersion,
    {
      requestId: reqHex,
      blockHash: blockHashHex.startsWith('0x') ? blockHashHex : `0x${blockHashHex}`,
      max: 1,
      skip: 0,
      reverse: false,
    },
    (s) => hexToBytes(hx(s)),
  )
  return RLP.encode(input)
}

/** RLP payload for `GET_BLOCK_HEADERS` (one header at `blockNumber`). */
export function encodeGetBlockHeadersByNumberPayload(
  ethVersion: number,
  blockNumber: bigint,
  requestId = 1,
): Uint8Array {
  const reqHex = `0x${requestId.toString(16).padStart(2, '0')}`
  const input = buildGetBlockHeadersFromJSON(
    ethVersion,
    {
      requestId: reqHex,
      block: `0x${blockNumber.toString(16)}`,
      max: 1,
      skip: 0,
      reverse: false,
    },
    (s) => hexToBytes(hx(s)),
  )
  return RLP.encode(input)
}

function blockNumberFromHeaderRaw(first: unknown): bigint | undefined {
  const fields = first instanceof Uint8Array ? (RLP.decode(first) as unknown[]) : first
  if (!Array.isArray(fields) || fields.length < 9) return undefined
  const num = fields[8]
  if (!(num instanceof Uint8Array)) return undefined
  return bytesToBigInt(num)
}

function timestampFromHeaderRaw(first: unknown): bigint | undefined {
  const fields = first instanceof Uint8Array ? (RLP.decode(first) as unknown[]) : first
  if (!Array.isArray(fields) || fields.length < 12) return undefined
  const ts = fields[11]
  if (!(ts instanceof Uint8Array)) return undefined
  return bytesToBigInt(ts)
}

function headerFromRaw(first: unknown, chain: ChainConfig) {
  const blockNumber = blockNumberFromHeaderRaw(first)
  const timestamp = timestampFromHeaderRaw(first)
  const common = new Common({ chain })
  if (blockNumber !== undefined) {
    common.setHardforkBy({
      blockNumber,
      ...(timestamp !== undefined ? { timestamp } : {}),
    })
  }
  return first instanceof Uint8Array
    ? createBlockHeaderFromRLP(first, { common, skipConsensusFormatValidation: true })
    : createBlockHeaderFromBytesArray(first as never, {
        common,
        skipConsensusFormatValidation: true,
      })
}

/** Parse `BLOCK_HEADERS`; when `expectedHashHex` is set, verify the header hash. */
export function parsePivotHeaderFromBlockHeadersPayload(
  ethVersion: number,
  payload: Uint8Array,
  expectedHashHex: string | undefined,
  chain: ChainConfig,
): ParsedPivotHeader | null {
  const decoded = RLP.decode(payload) as unknown
  if (!Array.isArray(decoded)) return null

  let headersRaw: unknown
  if (ethUsesRequestId(ethVersion)) {
    if (decoded.length < 2) return null
    headersRaw = decoded[1]
  } else {
    headersRaw = decoded[0]
  }

  if (!Array.isArray(headersRaw) || headersRaw.length === 0) return null

  const first = headersRaw[0]
  const header = headerFromRaw(first, chain)
  const hash = header.hash()
  if (expectedHashHex !== undefined) {
    const expected = hexToBytes(
      hx(expectedHashHex.startsWith('0x') ? expectedHashHex : `0x${expectedHashHex}`),
    )
    if (hash.length !== expected.length || !hash.every((b, i) => b === expected[i])) {
      return null
    }
  }
  return {
    number: header.number,
    stateRoot: header.stateRoot,
    hash,
    blockAccessListHash: header.blockAccessListHash,
  }
}

export function highestEthVersion(caps: string[]): number {
  let max = 69
  for (const c of caps) {
    const m = /^eth\/(\d+)$/.exec(c)
    if (m !== null) {
      max = Math.max(max, Number(m[1]))
    }
  }
  return max
}

export function peerIdToBytes(idHex: string): Uint8Array {
  const hex = idHex.startsWith('0x') ? idHex.slice(2) : idHex
  return hexToBytes(hx(`0x${hex}`))
}

/** Request id from an eth/66+ reply payload (first RLP element). */
export function ethReplyRequestId(ethVersion: number, payload: Uint8Array): number | null {
  if (!ethUsesRequestId(ethVersion)) return 1
  const decoded = RLP.decode(payload) as unknown
  if (!Array.isArray(decoded) || decoded.length === 0) return null
  const idBytes = decoded[0]
  if (!(idBytes instanceof Uint8Array)) return null
  return Number(bytesToBigInt(idBytes))
}

/** Raw RLP of the first header in a `BLOCK_HEADERS` reply. */
export function firstHeaderRlpFromBlockHeadersPayload(
  ethVersion: number,
  payload: Uint8Array,
): Uint8Array | null {
  const decoded = RLP.decode(payload) as unknown
  if (!Array.isArray(decoded)) return null
  let headersRaw: unknown
  if (ethUsesRequestId(ethVersion)) {
    if (decoded.length < 2) return null
    headersRaw = decoded[1]
  } else {
    headersRaw = decoded[0]
  }
  if (!Array.isArray(headersRaw) || headersRaw.length === 0) return null
  const first = headersRaw[0]
  if (first instanceof Uint8Array) return first
  return RLP.encode(first as never)
}

export function encodeGetBlockBodiesPayload(
  ethVersion: number,
  blockHash: Uint8Array,
  requestId = 2,
): Uint8Array {
  const id = intToUnpaddedBytes(requestId)
  const inner: unknown[] = [blockHash]
  const body = ethUsesRequestId(ethVersion) ? [id, inner] : inner
  return RLP.encode(body as never)
}

export function encodeGetReceiptsPayload(
  ethVersion: number,
  blockHash: Uint8Array,
  requestId = 3,
): Uint8Array {
  const id = intToUnpaddedBytes(requestId)
  const hashes = [blockHash]
  const body =
    ethVersion >= 70
      ? [id, intToUnpaddedBytes(0), hashes]
      : ethUsesRequestId(ethVersion)
        ? [id, hashes]
        : hashes
  return RLP.encode(body as never)
}

export function encodeGetBlockAccessListsPayload(
  ethVersion: number,
  blockHash: Uint8Array,
  requestId = 4,
): Uint8Array {
  const id = intToUnpaddedBytes(requestId)
  return RLP.encode([id, [blockHash]] as never)
}

export function parseFirstBodyFromBlockBodiesPayload(payload: Uint8Array): Uint8Array | null {
  const decoded = RLP.decode(payload) as unknown
  if (!Array.isArray(decoded) || decoded.length < 2) return null
  const bodies = decoded[1]
  if (!Array.isArray(bodies) || bodies.length === 0) return null
  const first = bodies[0]
  if (first instanceof Uint8Array) return first
  return RLP.encode(first as never)
}

export type ParsedReceiptsReply = {
  receiptsListRlp: Uint8Array
  lastBlockIncomplete: boolean
}

export function parseReceiptsReplyPayload(
  ethVersion: number,
  payload: Uint8Array,
): ParsedReceiptsReply | null {
  const decoded = RLP.decode(payload) as unknown
  if (!Array.isArray(decoded)) return null
  if (ethVersion >= 70) {
    if (decoded.length < 3) return null
    const flag = decoded[1]
    const lists = decoded[2]
    if (!(flag instanceof Uint8Array) || !Array.isArray(lists) || lists.length === 0) return null
    const incomplete = bytesToBigInt(flag) === 1n
    return {
      receiptsListRlp: RLP.encode(lists[0] as never),
      lastBlockIncomplete: incomplete,
    }
  }
  if (ethUsesRequestId(ethVersion)) {
    if (decoded.length < 2) return null
    const lists = decoded[1]
    if (!Array.isArray(lists) || lists.length === 0) return null
    return {
      receiptsListRlp: RLP.encode(lists[0] as never),
      lastBlockIncomplete: false,
    }
  }
  return null
}

export function parseFirstBalFromBlockAccessListsPayload(
  payload: Uint8Array,
): Uint8Array | undefined {
  const lists = parseBlockAccessListsBatchPayload(payload)
  if (lists === null || lists.length === 0) return undefined
  const first = lists[0]
  return first !== undefined && first.length > 0 ? first : undefined
}

export type ParsedBatchHeader = {
  number: bigint
  hash: Uint8Array
  parentHash: Uint8Array
  stateRoot: Uint8Array
  blockAccessListHash?: Uint8Array
  headerRlp: Uint8Array
}

/** RLP payload for `GET_BLOCK_HEADERS` starting at `startBlock` with `maxHeaders` (≤ 32). */
export function encodeGetBlockHeadersRangePayload(
  ethVersion: number,
  startBlock: bigint,
  maxHeaders: number,
  requestId = 1,
): Uint8Array {
  const reqHex = `0x${requestId.toString(16).padStart(2, '0')}`
  const input = buildGetBlockHeadersFromJSON(
    ethVersion,
    {
      requestId: reqHex,
      block: `0x${startBlock.toString(16)}`,
      max: maxHeaders,
      skip: 0,
      reverse: false,
    },
    (s) => hexToBytes(hx(s)),
  )
  return RLP.encode(input)
}

function headersRawFromBlockHeadersPayload(
  ethVersion: number,
  payload: Uint8Array,
): unknown[] | null {
  const decoded = RLP.decode(payload) as unknown
  if (!Array.isArray(decoded)) return null
  let headersRaw: unknown
  if (ethUsesRequestId(ethVersion)) {
    if (decoded.length < 2) return null
    headersRaw = decoded[1]
  } else {
    headersRaw = decoded[0]
  }
  if (!Array.isArray(headersRaw) || headersRaw.length === 0) return null
  return headersRaw
}

/** Decode a contiguous header batch; verifies parentHash chain from `priorTipHash` when set. */
export function parseBlockHeadersBatchPayload(
  ethVersion: number,
  payload: Uint8Array,
  startBlock: bigint,
  chain: ChainConfig,
  priorTipHash?: Uint8Array,
): ParsedBatchHeader[] | null {
  const headersRaw = headersRawFromBlockHeadersPayload(ethVersion, payload)
  if (headersRaw === null) return null
  const out: ParsedBatchHeader[] = []
  let expectNumber = startBlock
  let priorHash = priorTipHash
  for (const raw of headersRaw) {
    const headerRlp = raw instanceof Uint8Array ? raw : RLP.encode(raw as never)
    const header = headerFromRaw(raw, chain)
    if (header.number !== expectNumber) return null
    const hash = header.hash()
    if (priorHash !== undefined && !equalsBytes(header.parentHash, priorHash)) return null
    out.push({
      number: header.number,
      hash,
      parentHash: header.parentHash,
      stateRoot: header.stateRoot,
      blockAccessListHash: header.blockAccessListHash,
      headerRlp,
    })
    priorHash = hash
    expectNumber += 1n
  }
  return out.length > 0 ? out : null
}

export function encodeGetBlockAccessListsBatchPayload(
  ethVersion: number,
  blockHashes: Uint8Array[],
  requestId = 4,
): Uint8Array {
  const id = intToUnpaddedBytes(requestId)
  return RLP.encode([id, blockHashes] as never)
}

/** Parse all RLP block access lists in a batch reply (may be shorter than requested). */
export function parseBlockAccessListsBatchPayload(payload: Uint8Array): Uint8Array[] | null {
  const decoded = RLP.decode(payload) as unknown
  if (!Array.isArray(decoded) || decoded.length < 2) return null
  const lists = decoded[1]
  if (!Array.isArray(lists)) return null
  const out: Uint8Array[] = []
  for (const item of lists) {
    if (item instanceof Uint8Array) {
      out.push(item)
    } else if (Array.isArray(item)) {
      out.push(item.length === 0 ? new Uint8Array([0xc0]) : RLP.encode(item as never))
    } else {
      return null
    }
  }
  return out
}

export function encodeGetBlockBodiesBatchPayload(
  ethVersion: number,
  blockHashes: Uint8Array[],
  requestId = 2,
): Uint8Array {
  const id = intToUnpaddedBytes(requestId)
  const inner = blockHashes
  const body = ethUsesRequestId(ethVersion) ? [id, inner] : inner
  return RLP.encode(body as never)
}

export function parseBlockBodiesBatchPayload(payload: Uint8Array): Uint8Array[] | null {
  const decoded = RLP.decode(payload) as unknown
  if (!Array.isArray(decoded) || decoded.length < 2) return null
  const bodies = decoded[1]
  if (!Array.isArray(bodies)) return null
  const out: Uint8Array[] = []
  for (const item of bodies) {
    if (item instanceof Uint8Array) {
      out.push(item)
    } else if (item !== null && item !== undefined) {
      out.push(RLP.encode(item as never))
    } else {
      return null
    }
  }
  return out
}

export function encodeGetReceiptsBatchPayload(
  ethVersion: number,
  blockHashes: Uint8Array[],
  requestId = 3,
): Uint8Array {
  const id = intToUnpaddedBytes(requestId)
  const body =
    ethVersion >= 70
      ? [id, intToUnpaddedBytes(0), blockHashes]
      : ethUsesRequestId(ethVersion)
        ? [id, blockHashes]
        : blockHashes
  return RLP.encode(body as never)
}

export type ParsedReceiptsBatchItem = ParsedReceiptsReply

/** Parse receipt lists aligned with a hash batch (eth/70+ last-item incomplete flag). */
export function parseBlockReceiptsBatchPayload(
  ethVersion: number,
  payload: Uint8Array,
): ParsedReceiptsBatchItem[] | null {
  const decoded = RLP.decode(payload) as unknown
  if (!Array.isArray(decoded)) return null
  if (ethVersion >= 70) {
    if (decoded.length < 3) return null
    const flag = decoded[1]
    const lists = decoded[2]
    if (!(flag instanceof Uint8Array) || !Array.isArray(lists)) return null
    const lastIncomplete = bytesToBigInt(flag) === 1n
    const out: ParsedReceiptsBatchItem[] = []
    for (let i = 0; i < lists.length; i++) {
      const list = lists[i]
      if (list === undefined) return null
      out.push({
        receiptsListRlp: RLP.encode(list as never),
        lastBlockIncomplete: lastIncomplete && i === lists.length - 1,
      })
    }
    return out
  }
  if (ethUsesRequestId(ethVersion)) {
    if (decoded.length < 2) return null
    const lists = decoded[1]
    if (!Array.isArray(lists)) return null
    return lists.map((list) => ({
      receiptsListRlp: RLP.encode(list as never),
      lastBlockIncomplete: false,
    }))
  }
  return null
}

export { bytesToHex, EthMessageCodes }
