import { concatBytes, setLengthRight, toBytes } from '@ethereumjs/util'

import {
  BALANCE_LEAF_KEY,
  CODE_HASH_LEAF_KEY,
  CODE_OFFSET,
  CODE_SIZE_LEAF_KEY,
  HEADER_STORAGE_OFFSET,
  LeafType,
  MAIN_STORAGE_OFFSET,
  NONCE_LEAF_KEY,
  VERKLE_NODE_WIDTH,
  VERSION_LEAF_KEY,
} from '../types.js'

import { getStem } from './crypto.js'

import type { VerkleCrypto } from '../types.js'
import type { Address } from '@ethereumjs/util'

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

export const getTreeKeyForCodeChunk = async (
  address: Address,
  chunkId: number,
  verkleCrypto: VerkleCrypto
) => {
  const { treeIndex, subIndex } = getTreeIndicesForCodeChunk(chunkId)
  return concatBytes(getStem(verkleCrypto, address, treeIndex), toBytes(subIndex))
}

export const chunkifyCode = (code: Uint8Array) => {
  // Pad code to multiple of 31 bytes
  if (code.length % 31 !== 0) {
    const paddingLength = 31 - (code.length % 31)
    code = setLengthRight(code, code.length + paddingLength)
  }

  throw new Error('Not implemented')
}

export const getTreeKeyForStorageSlot = async (
  address: Address,
  storageKey: bigint,
  verkleCrypto: VerkleCrypto
) => {
  const { treeIndex, subIndex } = getTreeIndexesForStorageSlot(storageKey)

  return concatBytes(getStem(verkleCrypto, address, treeIndex), toBytes(subIndex))
}
