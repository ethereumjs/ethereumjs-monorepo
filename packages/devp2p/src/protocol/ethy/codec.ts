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
}

export type EthyLocalStatusFields = {
  genesisHash: Uint8Array
  basePivotBlock?: bigint
  basePivotStateRoot?: Uint8Array
  bucketsBitmask?: number
  balEarliestBlock?: bigint
  balLatestBlock?: bigint
  latestBlockHash?: Uint8Array
}

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
