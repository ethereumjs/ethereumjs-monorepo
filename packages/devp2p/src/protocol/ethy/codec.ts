import {
  bigIntToUnpaddedBytes,
  bytesToBigInt,
  bytesToInt,
  equalsBytes,
  hexToBytes,
  intToUnpaddedBytes,
} from '@ethereumjs/util'

import { EthyMessageCodes } from './codes.ts'

/** Parsed remote or local ETHY/0 STATUS (spec §6 `0x00`). */
export type EthyPeerStatus = {
  protocolVersion: number
  chainId: bigint
  genesisHash: Uint8Array
  basePivotBlock: bigint
  basePivotStateRoot: Uint8Array
  bucketsBitmask: number
  balEarliestBlock: bigint
  balLatestBlock: bigint
  latestBlockHash: Uint8Array
  storageBucketsBitmask: number
  codeBucketsBitmask: number
  trieBucketsBitmask: number
}

export type EthyLocalStatusFields = {
  genesisHash: Uint8Array
  basePivotBlock?: bigint
  basePivotStateRoot?: Uint8Array
  bucketsBitmask?: number
  balEarliestBlock?: bigint
  balLatestBlock?: bigint
  latestBlockHash?: Uint8Array
  storageBucketsBitmask?: number
  codeBucketsBitmask?: number
  trieBucketsBitmask?: number
}

export const MAX_ETHY_MESSAGE_BYTES = 2 * 1024 * 1024
export const MAX_ETHY_PROOF_NODES = 4096
export const MAX_WITNESS_ACCOUNTS = 64
export const MAX_WITNESS_SLOTS = 256
export const MAX_ETHY_RESPONSE_BYTES = 524_288

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

export function parseEthyStatus(payload: unknown): EthyPeerStatus {
  if (!Array.isArray(payload) || payload.length < 9) {
    throw new Error('ETHY STATUS: expected 9-tuple')
  }
  const genesisHash = asBytes(payload[2])
  const latestBlockHash = asBytes(payload[8])
  if (genesisHash.length !== 32) throw new Error('ETHY STATUS: genesisHash must be 32 bytes')
  if (latestBlockHash.length !== 32 && latestBlockHash.length !== 0) {
    throw new Error('ETHY STATUS: latestBlockHash must be 32 bytes or empty')
  }
  return {
    protocolVersion: scalarInt(payload[0]),
    chainId: scalarBigInt(payload[1]),
    genesisHash,
    basePivotBlock: scalarBigInt(payload[3]),
    basePivotStateRoot: asBytes(payload[4]),
    bucketsBitmask: scalarInt(payload[5]),
    balEarliestBlock: scalarBigInt(payload[6]),
    balLatestBlock: scalarBigInt(payload[7]),
    latestBlockHash: latestBlockHash.length === 32 ? latestBlockHash : ZERO32,
    storageBucketsBitmask: payload.length > 9 ? scalarInt(payload[9]) : 0,
    codeBucketsBitmask: payload.length > 10 ? scalarInt(payload[10]) : 0,
    trieBucketsBitmask: payload.length > 11 ? scalarInt(payload[11]) : 0,
  }
}

export function encodeEthyStatus(chainId: bigint, fields: EthyLocalStatusFields): Uint8Array[] {
  const genesisHash = fields.genesisHash
  const basePivotBlock = fields.basePivotBlock ?? 0n
  const basePivotStateRoot =
    fields.basePivotStateRoot !== undefined && fields.basePivotStateRoot.length === 32
      ? fields.basePivotStateRoot
      : ZERO32
  const bucketsBitmask = fields.bucketsBitmask ?? 0
  const balEarliest = fields.balEarliestBlock ?? 0n
  const balLatest = fields.balLatestBlock ?? 0n
  const latestHash =
    fields.latestBlockHash !== undefined && fields.latestBlockHash.length === 32
      ? fields.latestBlockHash
      : ZERO32
  const storageMask = fields.storageBucketsBitmask ?? 0
  const codeMask = fields.codeBucketsBitmask ?? 0
  const trieMask = fields.trieBucketsBitmask ?? 0
  return [
    intToUnpaddedBytes(0),
    bigIntToUnpaddedBytes(chainId),
    genesisHash,
    bigIntToUnpaddedBytes(basePivotBlock),
    basePivotStateRoot,
    intToUnpaddedBytes(bucketsBitmask),
    bigIntToUnpaddedBytes(balEarliest),
    bigIntToUnpaddedBytes(balLatest),
    latestHash,
    intToUnpaddedBytes(storageMask),
    intToUnpaddedBytes(codeMask),
    intToUnpaddedBytes(trieMask),
  ]
}

export function ethyStatusFromGenesisHex(genesisHashHex: string): EthyLocalStatusFields {
  const hex = (
    genesisHashHex.startsWith('0x') ? genesisHashHex : `0x${genesisHashHex}`
  ) as `0x${string}`
  return { genesisHash: hexToBytes(hex) }
}

export function ethyMessageNameToCode(name: string): EthyMessageCodes {
  const code = (EthyMessageCodes as Record<string, number>)[name]
  if (code === undefined) throw new Error(`Unknown ETHY message name: ${name}`)
  return code as EthyMessageCodes
}

export function countProofNodesInEthyMessage(code: EthyMessageCodes, decoded: unknown): number {
  if (!Array.isArray(decoded)) return 0
  if (code === EthyMessageCodes.PROVEN_ACCOUNT_CHUNK) {
    const proofNodes = decoded[8]
    return Array.isArray(proofNodes) ? proofNodes.length : 0
  }
  if (code === EthyMessageCodes.PROVEN_STORAGE_OR_CODE) {
    const kind = scalarInt(decoded[1])
    if (kind === 1 && decoded.length > 9) {
      const proofNodes = decoded[9]
      return Array.isArray(proofNodes) ? proofNodes.length : 0
    }
    return 0
  }
  if (code === EthyMessageCodes.STATE_WITNESS) {
    const groups = decoded[1]
    if (!Array.isArray(groups)) return 0
    let total = 0
    for (const group of groups) {
      if (Array.isArray(group) && Array.isArray(group[4])) {
        total += group[4].length
      }
    }
    return total
  }
  return 0
}

export function validateEthyStatusAgainstLocal(
  remote: EthyPeerStatus,
  chainId: bigint,
  genesisHash: Uint8Array,
): void {
  if (remote.protocolVersion !== 0) {
    throw new Error(`ETHY STATUS: unsupported protocol version ${remote.protocolVersion}`)
  }
  if (remote.chainId !== chainId) {
    throw new Error(`ETHY STATUS: chainId mismatch`)
  }
  if (!equalsBytes(remote.genesisHash, genesisHash)) {
    throw new Error(`ETHY STATUS: genesisHash mismatch`)
  }
}
