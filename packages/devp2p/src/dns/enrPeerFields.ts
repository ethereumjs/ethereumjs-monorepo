import { RLP } from '@ethereumjs/rlp'
import { bytesToBigInt, bytesToHex, bytesToInt, bytesToUtf8 } from '@ethereumjs/util'

import { ipToString, pk2id } from '../util.ts'

import type { PeerInfo } from '../types.ts'

export type EthForkIdFromEnr = {
  forkHash: string
  nextFork: bigint
}

/** Decode EIP-868 `eth` ENR value (RLP nested or flat pair). */
function forkPairFromRlp(decoded: unknown): unknown {
  if (!Array.isArray(decoded)) return undefined
  if (decoded.length >= 2 && decoded[0] instanceof Uint8Array && decoded[1] instanceof Uint8Array) {
    return decoded
  }
  if (decoded.length === 1) {
    const first = decoded[0]
    if (first instanceof Uint8Array) {
      return forkPairFromRlp(RLP.decode(first))
    }
    if (Array.isArray(first)) {
      return forkPairFromRlp(first)
    }
  }
  return undefined
}

export function decodeEthForkIdFromEnrValue(ethValue: Uint8Array): EthForkIdFromEnr | undefined {
  try {
    const pair = forkPairFromRlp(RLP.decode(ethValue))
    if (pair === undefined) return undefined
    if (!Array.isArray(pair) || pair.length < 2) return undefined
    const forkHashBytes = pair[0]
    const nextBytes = pair[1]
    if (!(forkHashBytes instanceof Uint8Array) || forkHashBytes.length !== 4) return undefined
    const nextFork =
      nextBytes instanceof Uint8Array && nextBytes.length > 0 ? bytesToBigInt(nextBytes) : 0n
    return { forkHash: bytesToHex(forkHashBytes), nextFork }
  } catch {
    return undefined
  }
}

function portFromEnrBytes(bytes: Uint8Array | undefined): number | undefined {
  if (!(bytes instanceof Uint8Array) || bytes.length === 0 || bytes.length > 2) return undefined
  const port = bytesToInt(bytes)
  if (port < 1 || port > 65535) return undefined
  return port
}

/**
 * Map verified ENR key/value pairs to {@link PeerInfo} fields (no signature check).
 */
export function peerFieldsFromEnrPairs(obj: Record<string, Uint8Array>): PeerInfo {
  const peerInfo: PeerInfo = {}

  const secp = obj.secp256k1
  if (secp instanceof Uint8Array && (secp.length === 33 || secp.length === 65)) {
    peerInfo.id = pk2id(secp)
  }

  const ip = obj.ip
  if (ip instanceof Uint8Array && (ip.length === 4 || ip.length === 16)) {
    peerInfo.address = ipToString(ip)
  }

  const tcpPort = portFromEnrBytes(obj.tcp)
  if (tcpPort !== undefined) peerInfo.tcpPort = tcpPort

  const udpPort = portFromEnrBytes(obj.udp)
  if (udpPort !== undefined) peerInfo.udpPort = udpPort

  const ethRaw = obj.eth
  if (ethRaw instanceof Uint8Array) {
    const ethForkId = decodeEthForkIdFromEnrValue(ethRaw)
    if (ethForkId !== undefined) peerInfo.ethForkId = ethForkId
  }

  return peerInfo
}

/** Build ENR pair map from RLP `[seq, ...kvs]` tail (alternating utf8 keys). */
export function enrPairsFromKvs(kvs: Uint8Array[]): Record<string, Uint8Array> {
  const obj: Record<string, Uint8Array> = {}
  for (let i = 0; i < kvs.length; i += 2) {
    obj[bytesToUtf8(kvs[i] as Uint8Array)] = kvs[i + 1] as Uint8Array
  }
  return obj
}

/** Read EIP-868 fork id from a discv4 ENRResponse RLP record list. */
export function ethForkIdFromDiscv4Record(record: Uint8Array[]): EthForkIdFromEnr | undefined {
  for (let i = 2; i + 1 < record.length; i += 2) {
    const key = new TextDecoder().decode(record[i]!)
    if (key === 'eth') {
      const val = record[i + 1]!
      return decodeEthForkIdFromEnrValue(val)
    }
  }
  return undefined
}
