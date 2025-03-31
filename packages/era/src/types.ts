import * as ssz from 'micro-eth-signer/ssz'

export type e2StoreEntry = {
  type: Uint8Array
  data: Uint8Array
}

export const CommonTypes = {
  Version: new Uint8Array([0x65, 0x32]),
  BlockIndex: new Uint8Array([0x66, 0x32]),
} as const

/** Era 1 Type Identifiers */
export const Era1Types = {
  CompressedHeader: new Uint8Array([0x03, 0x00]),
  CompressedBody: new Uint8Array([0x04, 0x00]),
  CompressedReceipts: new Uint8Array([0x05, 0x00]),
  TotalDifficulty: new Uint8Array([0x06, 0x00]),
  AccumulatorRoot: new Uint8Array([0x07, 0x00]),
} as const

export const VERSION = {
  type: CommonTypes.Version,
  data: new Uint8Array([]),
}

/** Era1 SSZ containers */
export const HeaderRecord = ssz.container({
  blockHash: ssz.bytevector(32),
  totalDifficulty: ssz.uint256,
}) as ssz.SSZCoder<{
  blockHash: Uint8Array
  totalDifficulty: bigint
}>

export const EpochAccumulator = ssz.list(8192, HeaderRecord) as ssz.SSZCoder<
  Array<{
    blockHash: Uint8Array
    totalDifficulty: bigint
  }>
>

/** Era Type Identifiers */
export const EraTypes = {
  CompressedSignedBeaconBlockType: new Uint8Array([0x01, 0x00]),
  CompressedBeaconState: new Uint8Array([0x02, 0x00]),
  Empty: new Uint8Array([0x00, 0x00]),
  SlotIndex: new Uint8Array([0x69, 0x32]),
}

export type SlotIndex = {
  startSlot: number
  recordStart: number
  slotOffsets: number[]
}

/**
 * E2HS Type Identifiers
 * Version                     = { type: [0x65, 0x32], data: nil }
 * CompressedHeaderWithProof   = { type: [0x03, 0x01], data: snappyFramed(ssz(header_with_proof)) }
 * CompressedBody              = { type: [0x04, 0x00], data: snappyFramed(rlp(body)) }
 * CompressedReceipts          = { type: [0x05, 0x00], data: snappyFramed(rlp(receipts)) }
 * BlockIndex                  = { type: [0x66, 0x32], data: block-index }
 */

export const E2HSTypes = {
  Version: new Uint8Array([0x65, 0x32]),
  CompressedHeaderWithProof: new Uint8Array([0x03, 0x01]),
  CompressedBody: new Uint8Array([0x04, 0x00]),
  CompressedReceipts: new Uint8Array([0x05, 0x00]),
  BlockIndex: new Uint8Array([0x66, 0x32]),
} as const
