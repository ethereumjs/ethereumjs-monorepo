import { type PrefixedHexString, hexToBytes, intToBytes } from '@ethereumjs/util'

import { EthMessageCodes } from '../../protocol/eth.ts'
import {
  buildGetBlockHeadersFromFields,
  ethUsesBlockRangeStatus,
} from '../../protocol/eth/codec.ts'
import { jsonToRlpInput } from '../payloadCodec.ts'

import type { Input } from '@ethereumjs/rlp'
import type { EthStatusOpts } from '../../protocol/eth.ts'

export type EthStatusFields = {
  td: string
  bestHash: string
  genesisHash: string
  latestBlock?: string
}

function hx(s: string): PrefixedHexString {
  return s as PrefixedHexString
}

export function ethStatusFromFields(fields: EthStatusFields, ethVersion = 68): EthStatusOpts {
  const genesisHash = hexToBytes(hx(fields.genesisHash))
  const bestHash = hexToBytes(hx(fields.bestHash))
  if (ethUsesBlockRangeStatus(ethVersion)) {
    return {
      genesisHash,
      earliestBlock: intToBytes(0),
      latestBlockHash: bestHash,
      ...(fields.latestBlock !== undefined
        ? { latestBlock: hexToBytes(hx(fields.latestBlock)) }
        : {}),
    }
  }
  return {
    td: hexToBytes(hx(fields.td)),
    bestHash,
    genesisHash,
    latestBlock: fields.latestBlock !== undefined ? hexToBytes(hx(fields.latestBlock)) : undefined,
  }
}

export function ethMessageNameToCode(name: string): EthMessageCodes {
  const code = (EthMessageCodes as Record<string, number>)[name]
  if (code === undefined) {
    throw new Error(`Unknown ETH message name: ${name}`)
  }
  return code as EthMessageCodes
}

export function buildEthRlpPayload(
  name: string,
  json: Record<string, unknown>,
  ethVersion = 68,
): Input {
  switch (name) {
    case 'GET_BLOCK_HEADERS':
      return buildGetBlockHeadersFromFields(ethVersion, json as never, (s) => hexToBytes(hx(s)))
    case 'GET_BLOCK_BODIES': {
      const requestId =
        json.requestId !== undefined ? hexToBytes(hx(String(json.requestId))) : intToBytes(1)
      const hashes = (json.hashes as string[]).map((h) => hexToBytes(hx(h)))
      return [requestId, hashes]
    }
    case 'GET_POOLED_TRANSACTIONS': {
      const requestId =
        json.requestId !== undefined ? hexToBytes(hx(String(json.requestId))) : intToBytes(1)
      const hashes = (json.hashes as string[]).map((h) => hexToBytes(hx(h)))
      return [requestId, hashes]
    }
    default:
      if (json.rlp !== undefined) {
        return jsonToRlpInput(json.rlp)
      }
      throw new Error(`No structured builder for ETH message ${name}; use --rlp`)
  }
}
