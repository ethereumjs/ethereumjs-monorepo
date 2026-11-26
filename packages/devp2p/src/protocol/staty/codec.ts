import {
  bigIntToUnpaddedBytes,
  bytesToBigInt,
  bytesToInt,
  equalsBytes,
  hexToBytes,
  intToUnpaddedBytes,
} from '@ethereumjs/util'

import { StatyMessageCodes } from './codes.ts'

/** Parsed remote or local STATY/0 STATUS (STATY-0-SPEC §7 `0x00`). */
export type StatyPeerStatus = {
  protocolVersion: number
  chainId: bigint
  genesisHash: Uint8Array
  earliestEpoch: bigint
  latestEpoch: bigint
  epochMask: bigint
  mintingEpoch: bigint
  witnessMinAnchorBlock: bigint
  witnessCountHint: number
  codeCountHint: number
}

export type StatyLocalStatusFields = {
  genesisHash: Uint8Array
  earliestEpoch?: bigint
  latestEpoch?: bigint
  epochMask?: bigint
  mintingEpoch?: bigint
  witnessMinAnchorBlock?: bigint
  witnessCountHint?: number
  codeCountHint?: number
}

export const MAX_STATY_MESSAGE_BYTES = 2 * 1024 * 1024
export const MAX_STATY_PROOF_NODES = 4096

const ZERO32 = new Uint8Array(32)

function asBytes(v: unknown): Uint8Array {
  if (!(v instanceof Uint8Array)) return new Uint8Array(0)
  return v
}

function scalarBigInt(v: unknown): bigint {
  if (!(v instanceof Uint8Array)) return 0n
  if (v.length === 0) return 0n
  return bytesToBigInt(v)
}

function scalarInt(v: unknown): number {
  if (!(v instanceof Uint8Array)) return 0
  if (v.length === 0) return 0
  return bytesToInt(v)
}

export function parseStatyStatus(payload: unknown): StatyPeerStatus {
  if (!Array.isArray(payload) || payload.length < 10) {
    throw new Error('STATY STATUS: expected 10-tuple')
  }
  const genesisHash = asBytes(payload[2])
  if (genesisHash.length !== 32) throw new Error('STATY STATUS: genesisHash must be 32 bytes')
  return {
    protocolVersion: scalarInt(payload[0]),
    chainId: scalarBigInt(payload[1]),
    genesisHash,
    earliestEpoch: scalarBigInt(payload[3]),
    latestEpoch: scalarBigInt(payload[4]),
    epochMask: scalarBigInt(payload[5]),
    mintingEpoch: scalarBigInt(payload[6]),
    witnessMinAnchorBlock: scalarBigInt(payload[7]),
    witnessCountHint: scalarInt(payload[8]),
    codeCountHint: scalarInt(payload[9]),
  }
}

export function encodeStatyStatus(chainId: bigint, fields: StatyLocalStatusFields): Uint8Array[] {
  return [
    intToUnpaddedBytes(0),
    bigIntToUnpaddedBytes(chainId),
    fields.genesisHash,
    bigIntToUnpaddedBytes(fields.earliestEpoch ?? 0n),
    bigIntToUnpaddedBytes(fields.latestEpoch ?? 0n),
    bigIntToUnpaddedBytes(fields.epochMask ?? 0n),
    bigIntToUnpaddedBytes(fields.mintingEpoch ?? 0n),
    bigIntToUnpaddedBytes(fields.witnessMinAnchorBlock ?? 0n),
    intToUnpaddedBytes(fields.witnessCountHint ?? 0),
    intToUnpaddedBytes(fields.codeCountHint ?? 0),
  ]
}

export function statyStatusFromGenesisHex(genesisHashHex: string): StatyLocalStatusFields {
  const hex = (
    genesisHashHex.startsWith('0x') ? genesisHashHex : `0x${genesisHashHex}`
  ) as `0x${string}`
  return { genesisHash: hexToBytes(hex) }
}

export function statyMessageNameToCode(name: string): StatyMessageCodes {
  const code = (StatyMessageCodes as Record<string, number>)[name]
  if (code === undefined) throw new Error(`Unknown STATY message name: ${name}`)
  return code as StatyMessageCodes
}

export function validateStatyStatusAgainstLocal(
  remote: StatyPeerStatus,
  chainId: bigint,
  genesisHash: Uint8Array,
): void {
  if (remote.protocolVersion !== 0) {
    throw new Error(`STATY STATUS: unsupported protocol version ${remote.protocolVersion}`)
  }
  if (remote.chainId !== chainId) {
    throw new Error(`STATY STATUS: chainId mismatch`)
  }
  if (!equalsBytes(remote.genesisHash, genesisHash)) {
    throw new Error(`STATY STATUS: genesisHash mismatch`)
  }
}

export function countProofNodesInDecoded(decoded: unknown): number {
  if (!Array.isArray(decoded)) return 0
  let n = 0
  for (const item of decoded) {
    if (Array.isArray(item) && item.length > 0 && item[0] instanceof Uint8Array) {
      const last = item[item.length - 1]
      if (Array.isArray(last)) n += last.length
    }
  }
  return n
}
