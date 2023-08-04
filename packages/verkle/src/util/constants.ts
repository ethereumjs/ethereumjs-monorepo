/**
 * Tree key export constants.
 */
export const VERSION_LEAF_KEY = 0
export const BALANCE_LEAF_KEY = 1
export const NONCE_LEAF_KEY = 2
export const CODE_KECCAK_LEAF_KEY = 3
export const CODE_SIZE_LEAF_KEY = 4

export const HEADER_STORAGE_OFFSET = 64
export const CODE_OFFSET = 128
export const VERKLE_NODE_WIDTH = 256
export const MAIN_STORAGE_OFFSET = 256 ** 31

const PUSH_OFFSET = 95
export const PUSH1 = PUSH_OFFSET + 1
export const PUSH32 = PUSH_OFFSET + 32
