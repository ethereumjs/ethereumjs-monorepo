import {
  type PrefixedHexString,
  bigIntToUnpaddedBytes,
  hexToBytes,
  setLengthLeft,
} from '@ethereumjs/util'

import { SnapMessageCodes } from '../../protocol/snap.ts'
import { jsonToRlpInput } from '../payloadCodec.ts'

import type { Input } from '@ethereumjs/rlp'

export function snapMessageNameToCode(name: string): SnapMessageCodes {
  const code = (SnapMessageCodes as Record<string, number>)[name]
  if (code === undefined) {
    throw new Error(`Unknown SNAP message name: ${name}`)
  }
  return code as SnapMessageCodes
}

export function buildSnapRlpPayload(name: string, json: Record<string, unknown>): Input {
  switch (name) {
    case 'GET_ACCOUNT_RANGE': {
      const requestId = json.requestId !== undefined ? Number(json.requestId) : 1
      const rootHex =
        typeof json.rootHash === 'string'
          ? json.rootHash
          : typeof json.root === 'string'
            ? json.root
            : `0x${'00'.repeat(32)}`
      const startHex =
        typeof json.startingHash === 'string'
          ? json.startingHash
          : typeof json.offset === 'string'
            ? json.offset
            : `0x${'00'.repeat(32)}`
      const limitHex = typeof json.limitHash === 'string' ? json.limitHash : `0x${'ff'.repeat(32)}`
      const responseBytes = json.responseBytes !== undefined ? Number(json.responseBytes) : 0
      const hx = (s: string): PrefixedHexString =>
        (s.startsWith('0x') ? s : `0x${s}`) as PrefixedHexString
      return [
        bigIntToUnpaddedBytes(BigInt(requestId)),
        setLengthLeft(hexToBytes(hx(rootHex)), 32),
        setLengthLeft(hexToBytes(hx(startHex)), 32),
        setLengthLeft(hexToBytes(hx(limitHex)), 32),
        bigIntToUnpaddedBytes(BigInt(responseBytes)),
      ] as Input
    }
    default:
      if (json.rlp !== undefined) {
        return jsonToRlpInput(json.rlp)
      }
      throw new Error(`No structured builder for SNAP message ${name}; use --rlp`)
  }
}
