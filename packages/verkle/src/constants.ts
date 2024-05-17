import { intToBytes } from '@ethereumjs/util'

export enum LeafType {
  BasicData = 0,
  CodeHash = 1,
}

export const VERSION_OFFSET = 0
export const NONCE_OFFSET = 4
export const CODE_SIZE_OFFSET = 12
export const BALANCE_OFFSET = 16

export const VERSION_BYTES_LENGTH = 1
export const NONCE_BYTES_LENGTH = 8
export const CODE_SIZE_BYTES_LENGTH = 4
export const BALANCE_BYTES_LENGTH = 16

export const BASIC_DATA_LEAF_KEY = intToBytes(LeafType.BasicData)
export const CODE_HASH_LEAF_KEY = intToBytes(LeafType.CodeHash)

export const HEADER_STORAGE_OFFSET = 64
export const CODE_OFFSET = 128
export const VERKLE_NODE_WIDTH = 256
export const MAIN_STORAGE_OFFSET = BigInt(256) ** BigInt(31)
