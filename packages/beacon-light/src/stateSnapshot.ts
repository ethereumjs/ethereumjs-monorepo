import { bytesToHex, hexToBytes } from '@ethereumjs/util'

import type {
  BeaconBlockHeader,
  ExecutionPayloadHeaderSummary,
  LightClientHeader,
  SyncCommittee,
} from './types.ts'

export type BeaconLightClientSnapshot = {
  version: 1
  bootstrapped: boolean
  lastParticipantCount: number
  finalizedHeader: LightClientHeader
  optimisticHeader: LightClientHeader
  currentSyncCommittee: SyncCommittee
  nextSyncCommittee: SyncCommittee
}

type Hex = string

function hexBytes(b: Uint8Array): Hex {
  return bytesToHex(b)
}

function parseBytes(hex: Hex, expectedLen?: number): Uint8Array {
  const out = hexToBytes(
    hex.startsWith('0x') ? (hex as `0x${string}`) : (`0x${hex}` as `0x${string}`),
  )
  if (expectedLen !== undefined && out.length !== expectedLen) {
    throw new Error(`expected ${expectedLen} bytes, got ${out.length}`)
  }
  return out
}

function serializeBeaconHeader(h: BeaconBlockHeader) {
  return {
    slot: h.slot,
    proposerIndex: h.proposerIndex,
    parentRoot: hexBytes(h.parentRoot),
    stateRoot: hexBytes(h.stateRoot),
    bodyRoot: hexBytes(h.bodyRoot),
  }
}

function parseBeaconHeader(raw: {
  slot: number
  proposerIndex: number
  parentRoot: Hex
  stateRoot: Hex
  bodyRoot: Hex
}): BeaconBlockHeader {
  return {
    slot: raw.slot,
    proposerIndex: raw.proposerIndex,
    parentRoot: parseBytes(raw.parentRoot, 32),
    stateRoot: parseBytes(raw.stateRoot, 32),
    bodyRoot: parseBytes(raw.bodyRoot, 32),
  }
}

function serializeExecution(e: ExecutionPayloadHeaderSummary) {
  return {
    parentHash: hexBytes(e.parentHash),
    feeRecipient: hexBytes(e.feeRecipient),
    stateRoot: hexBytes(e.stateRoot),
    receiptsRoot: hexBytes(e.receiptsRoot),
    logsBloom: hexBytes(e.logsBloom),
    prevRandao: hexBytes(e.prevRandao),
    blockNumber: e.blockNumber,
    gasLimit: e.gasLimit,
    gasUsed: e.gasUsed,
    timestamp: e.timestamp,
    extraData: hexBytes(e.extraData),
    baseFeePerGas: e.baseFeePerGas.toString(),
    blockHash: hexBytes(e.blockHash),
    transactionsRoot: hexBytes(e.transactionsRoot),
    withdrawalsRoot: hexBytes(e.withdrawalsRoot),
    blobGasUsed: e.blobGasUsed,
    excessBlobGas: e.excessBlobGas,
  }
}

function parseExecution(raw: ReturnType<typeof serializeExecution>): ExecutionPayloadHeaderSummary {
  return {
    parentHash: parseBytes(raw.parentHash, 32),
    feeRecipient: parseBytes(raw.feeRecipient, 20),
    stateRoot: parseBytes(raw.stateRoot, 32),
    receiptsRoot: parseBytes(raw.receiptsRoot, 32),
    logsBloom: parseBytes(raw.logsBloom, 256),
    prevRandao: parseBytes(raw.prevRandao, 32),
    blockNumber: raw.blockNumber,
    gasLimit: raw.gasLimit,
    gasUsed: raw.gasUsed,
    timestamp: raw.timestamp,
    extraData: parseBytes(raw.extraData),
    baseFeePerGas: BigInt(raw.baseFeePerGas),
    blockHash: parseBytes(raw.blockHash, 32),
    transactionsRoot: parseBytes(raw.transactionsRoot, 32),
    withdrawalsRoot: parseBytes(raw.withdrawalsRoot, 32),
    blobGasUsed: raw.blobGasUsed,
    excessBlobGas: raw.excessBlobGas,
  }
}

function serializeHeader(h: LightClientHeader) {
  return {
    beacon: serializeBeaconHeader(h.beacon),
    execution: h.execution !== undefined ? serializeExecution(h.execution) : undefined,
    executionBlockHash:
      h.executionBlockHash !== undefined ? hexBytes(h.executionBlockHash) : undefined,
    executionBranch: h.executionBranch?.map(hexBytes),
  }
}

function parseHeader(raw: ReturnType<typeof serializeHeader>): LightClientHeader {
  return {
    beacon: parseBeaconHeader(raw.beacon),
    execution: raw.execution !== undefined ? parseExecution(raw.execution) : undefined,
    executionBlockHash:
      raw.executionBlockHash !== undefined ? parseBytes(raw.executionBlockHash, 32) : undefined,
    executionBranch: raw.executionBranch?.map((b) => parseBytes(b, 32)),
  }
}

function serializeCommittee(c: SyncCommittee) {
  return {
    publicKeys: c.publicKeys.map(hexBytes),
    aggregatePubkey: hexBytes(c.aggregatePubkey),
  }
}

function parseCommittee(raw: ReturnType<typeof serializeCommittee>): SyncCommittee {
  return {
    publicKeys: raw.publicKeys.map((pk) => parseBytes(pk, 48)),
    aggregatePubkey: parseBytes(raw.aggregatePubkey, 48),
  }
}

/** JSON-safe snapshot for {@link BeaconLightStore}. */
export function serializeClientSnapshot(snapshot: BeaconLightClientSnapshot): string {
  const payload = {
    version: 1 as const,
    bootstrapped: snapshot.bootstrapped,
    lastParticipantCount: snapshot.lastParticipantCount,
    finalizedHeader: serializeHeader(snapshot.finalizedHeader),
    optimisticHeader: serializeHeader(snapshot.optimisticHeader),
    currentSyncCommittee: serializeCommittee(snapshot.currentSyncCommittee),
    nextSyncCommittee: serializeCommittee(snapshot.nextSyncCommittee),
  }
  return `${JSON.stringify(payload, null, 2)}\n`
}

export function parseClientSnapshot(json: string): BeaconLightClientSnapshot {
  const raw = JSON.parse(json) as {
    version: number
    bootstrapped: boolean
    lastParticipantCount: number
    finalizedHeader: ReturnType<typeof serializeHeader>
    optimisticHeader: ReturnType<typeof serializeHeader>
    currentSyncCommittee: ReturnType<typeof serializeCommittee>
    nextSyncCommittee: ReturnType<typeof serializeCommittee>
  }
  if (raw.version !== 1) {
    throw new Error(`unsupported snapshot version ${raw.version}`)
  }
  return {
    version: 1,
    bootstrapped: raw.bootstrapped,
    lastParticipantCount: raw.lastParticipantCount,
    finalizedHeader: parseHeader(raw.finalizedHeader),
    optimisticHeader: parseHeader(raw.optimisticHeader),
    currentSyncCommittee: parseCommittee(raw.currentSyncCommittee),
    nextSyncCommittee: parseCommittee(raw.nextSyncCommittee),
  }
}
