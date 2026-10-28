import { createBlockHeaderFromBytesArray, createBlockHeaderFromRLP } from '@ethereumjs/block'
import { Common } from '@ethereumjs/common'
import { EthMessageCodes, buildGetBlockHeadersFromJSON, ethUsesRequestId } from '@ethereumjs/devp2p'
import { RLP } from '@ethereumjs/rlp'
import { type PrefixedHexString, bytesToBigInt, bytesToHex, hexToBytes } from '@ethereumjs/util'

import type { ChainConfig } from '@ethereumjs/common'

export type ParsedPivotHeader = {
  number: bigint
  stateRoot: Uint8Array
  hash: Uint8Array
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

function blockNumberFromHeaderRaw(first: unknown): bigint | undefined {
  const fields = first instanceof Uint8Array ? (RLP.decode(first) as unknown[]) : first
  if (!Array.isArray(fields) || fields.length < 9) return undefined
  const num = fields[8]
  if (!(num instanceof Uint8Array)) return undefined
  return bytesToBigInt(num)
}

function headerFromRaw(first: unknown, chain: ChainConfig) {
  const blockNumber = blockNumberFromHeaderRaw(first)
  const common = new Common({ chain })
  if (blockNumber !== undefined) {
    common.setHardforkBy({ blockNumber })
  }
  return first instanceof Uint8Array
    ? createBlockHeaderFromRLP(first, { common, skipConsensusFormatValidation: true })
    : createBlockHeaderFromBytesArray(first as never, {
        common,
        skipConsensusFormatValidation: true,
      })
}

/** Parse `BLOCK_HEADERS` and verify the header hash matches `expectedHashHex`. */
export function parsePivotHeaderFromBlockHeadersPayload(
  ethVersion: number,
  payload: Uint8Array,
  expectedHashHex: string,
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
  const expected = hexToBytes(
    hx(expectedHashHex.startsWith('0x') ? expectedHashHex : `0x${expectedHashHex}`),
  )
  if (hash.length !== expected.length || !hash.every((b, i) => b === expected[i])) {
    return null
  }
  return {
    number: header.number,
    stateRoot: header.stateRoot,
    hash,
  }
}

export function highestEthVersion(caps: string[]): number {
  let max = 68
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

export { bytesToHex, EthMessageCodes }
