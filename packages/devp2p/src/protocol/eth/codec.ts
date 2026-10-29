import { intToBytes, intToUnpaddedBytes } from '@ethereumjs/util'

import { EthMessageCodes } from './codes.ts'

import type { Input } from '@ethereumjs/rlp'

export type GetBlockHeadersQuery = {
  startBlock: Input
  limit: Input
  skip: Input
  reverse: Input
}

export type GetBlockHeadersJSON = {
  requestId?: string | number
  blockHash?: string
  block?: string | number
  max?: number
  limit?: number
  skip?: number
  reverse?: boolean
}

/** eth/66+ request–response pairs carry a request id (EIP-2481). */
export function ethUsesRequestId(version: number): boolean {
  return version >= 66
}

/** eth/69+ Status drops td and adds block range (EIP-7642). */
export function ethUsesBlockRangeStatus(version: number): boolean {
  return version >= 69
}

export function encodeGetBlockHeaders(
  version: number,
  query: GetBlockHeadersQuery,
  requestId: Input = intToBytes(1),
): Input {
  const inner: Input = [query.startBlock, query.limit, query.skip, query.reverse]
  if (ethUsesRequestId(version)) return [requestId, inner]
  return inner
}

export function encodeBlockHeaders(version: number, requestId: Input, headers: Input): Input {
  if (ethUsesRequestId(version)) return [requestId, headers]
  return headers
}

export function encodeGetHashes(version: number, requestId: Input, hashes: Input[]): Input {
  if (ethUsesRequestId(version)) return [requestId, hashes]
  return hashes
}

export function getBlockHeadersQueryFromJSON(
  fields: GetBlockHeadersJSON,
  hexToBytes: (s: string) => Uint8Array,
): { requestId: Input; query: GetBlockHeadersQuery } {
  const requestId =
    fields.requestId !== undefined
      ? typeof fields.requestId === 'number'
        ? intToUnpaddedBytes(fields.requestId)
        : hexToBytes(fields.requestId.startsWith('0x') ? fields.requestId : `0x${fields.requestId}`)
      : intToUnpaddedBytes(1)
  const limit = intToUnpaddedBytes(fields.limit ?? fields.max ?? 1)
  const skip = intToUnpaddedBytes(fields.skip ?? 0)
  const reverse = fields.reverse ? intToUnpaddedBytes(1) : intToUnpaddedBytes(0)
  let startBlock: Input
  if (fields.blockHash !== undefined) {
    startBlock = hexToBytes(
      fields.blockHash.startsWith('0x') ? fields.blockHash : `0x${fields.blockHash}`,
    )
  } else if (fields.block !== undefined) {
    startBlock =
      typeof fields.block === 'number'
        ? intToUnpaddedBytes(fields.block)
        : hexToBytes(String(fields.block))
  } else {
    startBlock = hexToBytes(`0x${'00'.repeat(32)}`)
  }
  return { requestId, query: { startBlock, limit, skip, reverse } }
}

export function buildGetBlockHeadersFromJSON(
  version: number,
  fields: GetBlockHeadersJSON,
  hexToBytes: (s: string) => Uint8Array,
): Input {
  const { requestId, query } = getBlockHeadersQueryFromJSON(fields, hexToBytes)
  return encodeGetBlockHeaders(version, query, requestId)
}

/** Extract request id from an eth/66+ get or reply payload, if present. */
export function requestIdFromPayload(version: number, payload: unknown): Input | undefined {
  if (!ethUsesRequestId(version)) return undefined
  if (!Array.isArray(payload) || payload.length === 0) return undefined
  return payload[0] as Input
}

/** Post-merge: do not surface deprecated block propagation as normal traffic (eth/67+). */
export function isDeprecatedPostMergeMessage(code: number, version: number): boolean {
  if (version < 67) return false
  return code === EthMessageCodes.NEW_BLOCK_HASHES || code === EthMessageCodes.NEW_BLOCK
}

export function isMessageCodeAllowed(code: number, version: number): boolean {
  switch (code) {
    case EthMessageCodes.STATUS:
      return true
    case EthMessageCodes.NEW_BLOCK_HASHES:
    case EthMessageCodes.TX:
    case EthMessageCodes.GET_BLOCK_HEADERS:
    case EthMessageCodes.BLOCK_HEADERS:
    case EthMessageCodes.GET_BLOCK_BODIES:
    case EthMessageCodes.BLOCK_BODIES:
    case EthMessageCodes.NEW_BLOCK:
      return version >= 62
    case EthMessageCodes.GET_RECEIPTS:
    case EthMessageCodes.RECEIPTS:
      return version >= 63
    case EthMessageCodes.NEW_POOLED_TRANSACTION_HASHES:
    case EthMessageCodes.GET_POOLED_TRANSACTIONS:
    case EthMessageCodes.POOLED_TRANSACTIONS:
      return version >= 65
    case EthMessageCodes.GET_NODE_DATA:
    case EthMessageCodes.NODE_DATA:
      return version >= 63 && version <= 66
    case EthMessageCodes.BLOCK_RANGE_UPDATE:
      return version >= 69
    case EthMessageCodes.GET_BLOCK_ACCESS_LISTS:
    case EthMessageCodes.BLOCK_ACCESS_LISTS:
      return version >= 71
    case EthMessageCodes.GET_CELLS:
    case EthMessageCodes.CELLS:
      return version >= 72
    default:
      return false
  }
}
