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
      const root = json.root !== undefined ? Number(json.root) : 437000
      const limit = json.limit !== undefined ? Number(json.limit) : 1
      const offset = json.offset !== undefined ? Number(json.offset) : 0
      const bytes = json.bytes !== undefined ? Number(json.bytes) : 0
      return [requestId, [root, limit, offset, bytes]] as Input
    }
    default:
      if (json.rlp !== undefined) {
        return jsonToRlpInput(json.rlp)
      }
      throw new Error(`No structured builder for SNAP message ${name}; use --rlp`)
  }
}
