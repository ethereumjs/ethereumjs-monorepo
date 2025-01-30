import { ByteVectorType, ContainerType, ListCompositeType, UintBigintType } from '@chainsafe/ssz'

export type e2StoreEntry = {
  type: Uint8Array
  data: Uint8Array
}

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

export const HeaderRecord = new ContainerType({
  blockHash: new ByteVectorType(32),
  totalDifficulty: new UintBigintType(32),
})
export const EpochAccumulator = new ListCompositeType(HeaderRecord, 8192)
