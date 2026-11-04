import { EthereumJSErrorWithoutCode, hexToBytes } from '@ethereumjs/util'

import { emptyLightClientHeader, emptySyncCommittee } from './client.ts'
import type {
  LightClientBootstrap,
  LightClientFinalityUpdate,
  LightClientHeader,
  LightClientOptimisticUpdate,
  LightClientUpdate,
  SyncAggregate,
  SyncCommittee,
} from './types.ts'

function parseHex(data: unknown, label: string): Uint8Array {
  if (typeof data !== 'string' || !data.startsWith('0x')) {
    throw EthereumJSErrorWithoutCode(`${label} must be a 0x-prefixed hex string`)
  }
  return hexToBytes(data as `0x${string}`)
}

function parseUint(data: unknown, label: string): number {
  if (typeof data === 'number' && Number.isInteger(data)) return data
  if (typeof data === 'string' && /^\d+$/.test(data)) return Number(data)
  throw EthereumJSErrorWithoutCode(`${label} must be a uint`)
}

function parseBranch(data: unknown): Uint8Array[] {
  if (!Array.isArray(data)) {
    throw EthereumJSErrorWithoutCode('Merkle branch must be an array')
  }
  return data.map((entry, i) => parseHex(entry, `branch[${i}]`))
}

function parseSyncCommittee(data: unknown): SyncCommittee {
  if (data === null || typeof data !== 'object') {
    throw EthereumJSErrorWithoutCode('sync committee must be an object')
  }
  const obj = data as Record<string, unknown>
  const pubkeys = obj.pubkeys ?? obj.public_keys
  if (!Array.isArray(pubkeys) || pubkeys.length !== 512) {
    throw EthereumJSErrorWithoutCode('sync committee must have 512 pubkeys')
  }
  const aggregate = obj.aggregate_pubkey ?? obj.aggregatePubkey
  return {
    publicKeys: pubkeys.map((pk, i) => {
      const bytes = parseHex(pk, `pubkeys[${i}]`)
      if (bytes.length !== 48) {
        throw EthereumJSErrorWithoutCode('sync committee pubkey must be 48 bytes')
      }
      return bytes
    }),
    aggregatePubkey: (() => {
      const bytes = parseHex(aggregate, 'aggregate_pubkey')
      if (bytes.length !== 48) {
        throw EthereumJSErrorWithoutCode('aggregate pubkey must be 48 bytes')
      }
      return bytes
    })(),
  }
}

function parseSyncAggregate(data: unknown): SyncAggregate {
  if (data === null || typeof data !== 'object') {
    throw EthereumJSErrorWithoutCode('sync aggregate must be an object')
  }
  const obj = data as Record<string, unknown>
  const bits = obj.sync_committee_bits ?? obj.syncCommitteeBits
  const signature = obj.sync_committee_signature ?? obj.syncCommitteeSignature ?? obj.signature
  const bitBytes = parseHex(bits, 'sync_committee_bits')
  if (bitBytes.length !== 64) {
    throw EthereumJSErrorWithoutCode('sync committee bits must be 64 bytes')
  }
  const sigBytes = parseHex(signature, 'signature')
  if (sigBytes.length !== 96) {
    throw EthereumJSErrorWithoutCode('sync committee signature must be 96 bytes')
  }
  return { syncCommitteeBits: bitBytes, signature: sigBytes }
}

function parseExecutionPayload(data: unknown) {
  if (data === null || typeof data !== 'object') {
    throw EthereumJSErrorWithoutCode('execution payload header must be an object')
  }
  const e = data as Record<string, unknown>
  const feeRecipient = parseHex(e.fee_recipient ?? e.feeRecipient, 'fee_recipient')
  if (feeRecipient.length !== 20) {
    throw EthereumJSErrorWithoutCode('fee_recipient must be 20 bytes')
  }
  const blobGas = e.blob_gas_used ?? e.blobGasUsed
  const excessBlob = e.excess_blob_gas ?? e.excessBlobGas
  return {
    parentHash: parseHex(e.parent_hash ?? e.parentHash, 'parent_hash'),
    feeRecipient,
    stateRoot: parseHex(e.state_root ?? e.stateRoot, 'state_root'),
    receiptsRoot: parseHex(e.receipts_root ?? e.receiptsRoot, 'receipts_root'),
    logsBloom: parseHex(e.logs_bloom ?? e.logsBloom, 'logs_bloom'),
    prevRandao: parseHex(e.prev_randao ?? e.prevRandao, 'prev_randao'),
    blockNumber: parseUint(e.block_number ?? e.blockNumber, 'block_number'),
    gasLimit: parseUint(e.gas_limit ?? e.gasLimit, 'gas_limit'),
    gasUsed: parseUint(e.gas_used ?? e.gasUsed, 'gas_used'),
    timestamp: parseUint(e.timestamp, 'timestamp'),
    extraData: parseHex(e.extra_data ?? e.extraData, 'extra_data'),
    baseFeePerGas: BigInt(String(e.base_fee_per_gas ?? e.baseFeePerGas ?? 0)),
    blockHash: parseHex(e.block_hash ?? e.blockHash, 'block_hash'),
    transactionsRoot: parseHex(e.transactions_root ?? e.transactionsRoot, 'transactions_root'),
    withdrawalsRoot: parseHex(e.withdrawals_root ?? e.withdrawalsRoot, 'withdrawals_root'),
    blobGasUsed: blobGas !== undefined ? parseUint(blobGas, 'blob_gas_used') : undefined,
    excessBlobGas: excessBlob !== undefined ? parseUint(excessBlob, 'excess_blob_gas') : undefined,
  }
}

/** Parse a REST `LightClientHeader` JSON object. */
export function parseLightClientHeaderJson(data: unknown): LightClientHeader {
  if (data === null || typeof data !== 'object') {
    throw EthereumJSErrorWithoutCode('light client header must be an object')
  }
  const obj = data as Record<string, unknown>
  const beaconRaw = obj.beacon
  if (beaconRaw === null || typeof beaconRaw !== 'object') {
    throw EthereumJSErrorWithoutCode('beacon sub-header required')
  }
  const b = beaconRaw as Record<string, unknown>
  const header: LightClientHeader = {
    beacon: {
      slot: parseUint(b.slot, 'slot'),
      proposerIndex: parseUint(b.proposer_index ?? b.proposerIndex, 'proposer_index'),
      parentRoot: parseHex(b.parent_root ?? b.parentRoot, 'parent_root'),
      stateRoot: parseHex(b.state_root ?? b.stateRoot, 'state_root'),
      bodyRoot: parseHex(b.body_root ?? b.bodyRoot, 'body_root'),
    },
  }
  const execBlockHash = obj.execution_block_hash ?? obj.executionBlockHash
  if (execBlockHash !== undefined) {
    header.executionBlockHash = parseHex(execBlockHash, 'execution_block_hash')
  } else if (obj.execution !== undefined) {
    header.execution = parseExecutionPayload(obj.execution)
  }
  const branch = obj.execution_branch ?? obj.executionBranch
  if (branch !== undefined) {
    header.executionBranch = parseBranch(branch)
  }
  return header
}

function unwrapData<T>(body: unknown, parser: (data: unknown) => T): T {
  if (body === null || typeof body !== 'object') {
    throw EthereumJSErrorWithoutCode('response must be an object')
  }
  const envelope = body as Record<string, unknown>
  return parser(envelope.data)
}

export function parseLightClientBootstrapJson(body: unknown): LightClientBootstrap {
  return unwrapData(body, (data) => {
    if (data === null || typeof data !== 'object') {
      throw EthereumJSErrorWithoutCode('bootstrap data must be an object')
    }
    const obj = data as Record<string, unknown>
    return {
      header: parseLightClientHeaderJson(obj.header),
      currentSyncCommittee: parseSyncCommittee(
        obj.current_sync_committee ?? obj.currentSyncCommittee,
      ),
      currentSyncCommitteeBranch: parseBranch(
        obj.current_sync_committee_branch ?? obj.currentSyncCommitteeBranch,
      ),
    }
  })
}

function parseLightClientUpdateData(data: unknown): LightClientUpdate {
  if (data === null || typeof data !== 'object') {
    throw EthereumJSErrorWithoutCode('update data must be an object')
  }
  const unwrapped =
    'data' in (data as Record<string, unknown>) &&
    (data as Record<string, unknown>).data !== undefined &&
    typeof (data as Record<string, unknown>).data === 'object'
      ? ((data as Record<string, unknown>).data as Record<string, unknown>)
      : (data as Record<string, unknown>)
  const nextRaw = unwrapped.next_sync_committee ?? unwrapped.nextSyncCommittee
  const nextBranchRaw = unwrapped.next_sync_committee_branch ?? unwrapped.nextSyncCommitteeBranch
  const finRaw = unwrapped.finalized_header ?? unwrapped.finalizedHeader
  const finBranchRaw = unwrapped.finality_branch ?? unwrapped.finalityBranch
  return {
    attestedHeader: parseLightClientHeaderJson(
      unwrapped.attested_header ?? unwrapped.attestedHeader,
    ),
    nextSyncCommittee: nextRaw !== undefined ? parseSyncCommittee(nextRaw) : emptySyncCommittee(),
    nextSyncCommitteeBranch: nextBranchRaw !== undefined ? parseBranch(nextBranchRaw) : [],
    finalizedHeader:
      finRaw !== undefined ? parseLightClientHeaderJson(finRaw) : emptyLightClientHeader(),
    finalityBranch: finBranchRaw !== undefined ? parseBranch(finBranchRaw) : [],
    syncAggregate: parseSyncAggregate(unwrapped.sync_aggregate ?? unwrapped.syncAggregate),
    signatureSlot: parseUint(unwrapped.signature_slot ?? unwrapped.signatureSlot, 'signature_slot'),
  }
}

export function parseLightClientUpdateJson(body: unknown): LightClientUpdate {
  return unwrapData(body, parseLightClientUpdateData)
}

export function parseLightClientFinalityUpdateJson(body: unknown): LightClientFinalityUpdate {
  return unwrapData(body, (data) => {
    if (data === null || typeof data !== 'object') {
      throw EthereumJSErrorWithoutCode('finality update data must be an object')
    }
    const obj = data as Record<string, unknown>
    return {
      attestedHeader: parseLightClientHeaderJson(obj.attested_header ?? obj.attestedHeader),
      finalizedHeader: parseLightClientHeaderJson(obj.finalized_header ?? obj.finalizedHeader),
      finalityBranch: parseBranch(obj.finality_branch ?? obj.finalityBranch),
      syncAggregate: parseSyncAggregate(obj.sync_aggregate ?? obj.syncAggregate),
      signatureSlot: parseUint(obj.signature_slot ?? obj.signatureSlot, 'signature_slot'),
    }
  })
}

export function parseLightClientOptimisticUpdateJson(body: unknown): LightClientOptimisticUpdate {
  return unwrapData(body, (data) => {
    if (data === null || typeof data !== 'object') {
      throw EthereumJSErrorWithoutCode('optimistic update data must be an object')
    }
    const obj = data as Record<string, unknown>
    return {
      attestedHeader: parseLightClientHeaderJson(obj.attested_header ?? obj.attestedHeader),
      syncAggregate: parseSyncAggregate(obj.sync_aggregate ?? obj.syncAggregate),
      signatureSlot: parseUint(obj.signature_slot ?? obj.signatureSlot, 'signature_slot'),
    }
  })
}

export function parseLightClientUpdatesJson(body: unknown): LightClientUpdate[] {
  if (Array.isArray(body)) {
    return body.map((entry) => parseLightClientUpdateData(entry))
  }
  return unwrapData(body, (data) => {
    if (!Array.isArray(data)) {
      throw EthereumJSErrorWithoutCode('updates data must be an array')
    }
    return data.map((entry) => parseLightClientUpdateData(entry))
  })
}
