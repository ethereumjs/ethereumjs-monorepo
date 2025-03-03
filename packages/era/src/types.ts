import * as ssz from 'micro-eth-signer/ssz'

export type e2StoreEntry = {
  type: Uint8Array
  data: Uint8Array
}

/** Era 1 Type Identifiers */
export const Era1Types = {
  Version: new Uint8Array([0x65, 0x32]),
  CompressedHeader: new Uint8Array([0x03, 0x00]),
  CompressedBody: new Uint8Array([0x04, 0x00]),
  CompressedReceipts: new Uint8Array([0x05, 0x00]),
  TotalDifficulty: new Uint8Array([0x06, 0x00]),
  AccumulatorRoot: new Uint8Array([0x07, 0x00]),
  BlockIndex: new Uint8Array([0x66, 0x32]),
} as const

export const VERSION = {
  type: Era1Types.Version,
  data: new Uint8Array([]),
}

/** Era1 SSZ containers */
export const HeaderRecord = ssz.container({
  blockHash: ssz.bytevector(32),
  totalDifficulty: ssz.uint256,
})

export const EpochAccumulator = ssz.list(8192, HeaderRecord)

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
