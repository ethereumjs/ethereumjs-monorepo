import { concatBytes, intToBytes } from './bytes.js'

/**
 * Verkle related constants and helper functions
 *
 * Experimental (do not use in production!)
 */

// TODO: this comes with a deprecation of the respective constants and methods within the
// @ethereumjs/verkle package. Due to ease of parallel work this has not yet been executed upon,
// so this still needs a small follow-up clean up PR.
//
// Along with the PR likely more/additional helper functionality should be moved over
// (basically everything generic not depending on Verkle cryptography)
//
// Holger Drewes, 2024-06-18

export interface VerkleCrypto {
  getTreeKey: (address: Uint8Array, treeIndex: Uint8Array, subIndex: number) => Uint8Array
  getTreeKeyHash: (address: Uint8Array, treeIndexLE: Uint8Array) => Uint8Array
  updateCommitment: (
    commitment: Uint8Array,
    commitmentIndex: number,
    oldScalarValue: Uint8Array,
    newScalarValue: Uint8Array
  ) => Uint8Array // Commitment
  zeroCommitment: Uint8Array
  verifyExecutionWitnessPreState: (prestateRoot: string, execution_witness_json: string) => boolean
}

export enum LeafType {
  Version = 0,
  Balance = 1,
  Nonce = 2,
  CodeHash = 3,
  CodeSize = 4,
}

export const VERSION_LEAF_KEY = intToBytes(LeafType.Version)
export const BALANCE_LEAF_KEY = intToBytes(LeafType.Balance)
export const NONCE_LEAF_KEY = intToBytes(LeafType.Nonce)
export const CODE_HASH_LEAF_KEY = intToBytes(LeafType.CodeHash)
export const CODE_SIZE_LEAF_KEY = intToBytes(LeafType.CodeSize)

export const HEADER_STORAGE_OFFSET = 64
export const CODE_OFFSET = 128
export const VERKLE_NODE_WIDTH = 256
export const MAIN_STORAGE_OFFSET = BigInt(256) ** BigInt(31)

/**
 * @dev Returns the tree key for a given verkle tree stem, and sub index.
 * @dev Assumes that the verkle node width = 256
 * @param stem The 31-bytes verkle tree stem as a Uint8Array.
 * @param subIndex The sub index of the tree to generate the key for as a Uint8Array.
 * @return The tree key as a Uint8Array.
 */

export const getKey = (stem: Uint8Array, leaf: LeafType | Uint8Array) => {
  switch (leaf) {
    case LeafType.Version:
      return concatBytes(stem, VERSION_LEAF_KEY)
    case LeafType.Balance:
      return concatBytes(stem, BALANCE_LEAF_KEY)
    case LeafType.Nonce:
      return concatBytes(stem, NONCE_LEAF_KEY)
    case LeafType.CodeHash:
      return concatBytes(stem, CODE_HASH_LEAF_KEY)
    case LeafType.CodeSize:
      return concatBytes(stem, CODE_SIZE_LEAF_KEY)
    default:
      return concatBytes(stem, leaf)
  }
}

export function getTreeIndexesForStorageSlot(storageKey: bigint): {
  treeIndex: bigint
  subIndex: number
} {
  let position: bigint
  if (storageKey < CODE_OFFSET - HEADER_STORAGE_OFFSET) {
    position = BigInt(HEADER_STORAGE_OFFSET) + storageKey
  } else {
    position = MAIN_STORAGE_OFFSET + storageKey
  }

  const treeIndex = position / BigInt(VERKLE_NODE_WIDTH)
  const subIndex = Number(position % BigInt(VERKLE_NODE_WIDTH))

  return { treeIndex, subIndex }
}

export function getTreeIndicesForCodeChunk(chunkId: number) {
  const treeIndex = Math.floor((CODE_OFFSET + chunkId) / VERKLE_NODE_WIDTH)
  const subIndex = (CODE_OFFSET + chunkId) % VERKLE_NODE_WIDTH
  return { treeIndex, subIndex }
}
