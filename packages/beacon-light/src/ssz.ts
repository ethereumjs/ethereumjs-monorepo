import { EthereumJSErrorWithoutCode, concatBytes } from '@ethereumjs/util'

import type { BeaconBlockHeader, ExecutionPayloadHeaderSummary, SyncCommittee } from './types.ts'

/** SHA-256 digest callback (Noble or {@link Common.customCrypto.sha256}). */
export type Sha256Fn = (msg: Uint8Array) => Uint8Array

const SYNC_COMMITTEE_SIZE = 512

export function chunkUint64(value: number | bigint): Uint8Array {
  const out = new Uint8Array(32)
  let v = BigInt(value)
  for (let i = 0; i < 8; i++) {
    out[i] = Number(v & 0xffn)
    v >>= 8n
  }
  return out
}

export function chunkUint256(value: bigint): Uint8Array {
  const out = new Uint8Array(32)
  let v = value
  for (let i = 0; i < 32; i++) {
    out[i] = Number(v & 0xffn)
    v >>= 8n
  }
  return out
}

export function chunkBytes32(bytes: Uint8Array): Uint8Array {
  if (bytes.length !== 32) {
    throw EthereumJSErrorWithoutCode('expected 32-byte root chunk')
  }
  return bytes
}

/** 20-byte execution address in a 32-byte SSZ chunk (`ByteVector[20]`, right-padded at bytes 0..20). */
export function chunkExecutionAddress(address: Uint8Array): Uint8Array {
  if (address.length !== 20) {
    throw EthereumJSErrorWithoutCode('expected 20-byte execution address')
  }
  const out = new Uint8Array(32)
  out.set(address, 0)
  return out
}

export function chunkBytes48(pubkey: Uint8Array, sha256: Sha256Fn): Uint8Array {
  if (pubkey.length !== 48) {
    throw EthereumJSErrorWithoutCode('expected 48-byte BLS pubkey')
  }
  return sha256(concatBytes(pubkey.subarray(0, 32), pubkey.subarray(32, 48), new Uint8Array(16)))
}

function merkleHashPaddedChunks(chunks: Uint8Array[], sha256: Sha256Fn): Uint8Array {
  if (chunks.length === 0) {
    return new Uint8Array(32)
  }
  let layer = chunks.slice()
  let size = 1
  while (size < layer.length) size <<= 1
  while (layer.length < size) {
    layer.push(new Uint8Array(32))
  }
  while (layer.length > 1) {
    const next: Uint8Array[] = []
    for (let i = 0; i < layer.length; i += 2) {
      next.push(sha256(concatBytes(layer[i]!, layer[i + 1]!)))
    }
    layer = next
  }
  return layer[0]!
}

function hashTreeRootByteList(data: Uint8Array, sha256: Sha256Fn): Uint8Array {
  if (data.length > 32) {
    throw EthereumJSErrorWithoutCode('extra_data exceeds 32 bytes')
  }
  const chunks: Uint8Array[] = []
  for (let i = 0; i < data.length; i += 32) {
    const slice = data.subarray(i, i + 32)
    const chunk = new Uint8Array(32)
    chunk.set(slice)
    chunks.push(chunk)
  }
  if (chunks.length === 0) chunks.push(new Uint8Array(32))
  const root = merkleHashPaddedChunks(chunks, sha256)
  const len = chunkUint64(data.length)
  return sha256(concatBytes(root, len))
}

function hashTreeRootLogsBloom(bloom: Uint8Array, sha256: Sha256Fn): Uint8Array {
  if (bloom.length !== 256) {
    throw EthereumJSErrorWithoutCode('logs_bloom must be 256 bytes')
  }
  const chunks: Uint8Array[] = []
  for (let i = 0; i < 256; i += 32) {
    chunks.push(bloom.subarray(i, i + 32))
  }
  return merkleHashPaddedChunks(chunks, sha256)
}

/**
 * SSZ `hash_tree_root` for a 5-field `BeaconBlockHeader`.
 */
export function hashTreeRootBeaconBlockHeader(
  header: BeaconBlockHeader,
  sha256: Sha256Fn,
): Uint8Array {
  const chunks = [
    chunkUint64(header.slot),
    chunkUint64(header.proposerIndex),
    chunkBytes32(header.parentRoot),
    chunkBytes32(header.stateRoot),
    chunkBytes32(header.bodyRoot),
  ]
  return merkleHashPaddedChunks(chunks, sha256)
}

/**
 * SSZ `hash_tree_root` for a 512-validator `SyncCommittee`.
 */
export function hashTreeRootSyncCommittee(committee: SyncCommittee, sha256: Sha256Fn): Uint8Array {
  if (committee.publicKeys.length !== SYNC_COMMITTEE_SIZE) {
    throw EthereumJSErrorWithoutCode(
      `sync committee must have ${SYNC_COMMITTEE_SIZE} validator public keys`,
    )
  }
  const pubkeyChunks = committee.publicKeys.map((pk) => chunkBytes48(pk, sha256))
  const publicKeysRoot = merkleHashPaddedChunks(pubkeyChunks, sha256)
  const aggregateChunk = chunkBytes48(committee.aggregatePubkey, sha256)
  return merkleHashPaddedChunks([publicKeysRoot, aggregateChunk], sha256)
}

/**
 * SSZ `hash_tree_root` for `ExecutionPayloadHeader` (Capella or Deneb+ field set).
 */
export function hashTreeRootExecutionPayloadHeader(
  payload: ExecutionPayloadHeaderSummary,
  fork: 'capella' | 'deneb',
  sha256: Sha256Fn,
): Uint8Array {
  const chunks: Uint8Array[] = [
    chunkBytes32(payload.parentHash),
    chunkExecutionAddress(payload.feeRecipient),
    chunkBytes32(payload.stateRoot),
    chunkBytes32(payload.receiptsRoot),
    hashTreeRootLogsBloom(payload.logsBloom, sha256),
    chunkBytes32(payload.prevRandao),
    chunkUint64(payload.blockNumber),
    chunkUint64(payload.gasLimit),
    chunkUint64(payload.gasUsed),
    chunkUint64(payload.timestamp),
    hashTreeRootByteList(payload.extraData, sha256),
    chunkUint256(payload.baseFeePerGas),
    chunkBytes32(payload.blockHash),
    chunkBytes32(payload.transactionsRoot),
    chunkBytes32(payload.withdrawalsRoot),
  ]
  if (fork === 'deneb') {
    chunks.push(chunkUint64(payload.blobGasUsed ?? 0))
    chunks.push(chunkUint64(payload.excessBlobGas ?? 0))
  }
  return merkleHashPaddedChunks(chunks, sha256)
}
