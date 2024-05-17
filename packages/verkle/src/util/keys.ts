import {
  bigIntToBytes,
  bytesToBigInt,
  bytesToInt32,
  concatBytes,
  int32ToBytes,
  setLengthRight,
  toBytes,
} from '@ethereumjs/util'

import {
  BALANCE_BYTES_LENGTH,
  BALANCE_OFFSET,
  BASIC_DATA_LEAF_KEY,
  CODE_HASH_LEAF_KEY,
  CODE_OFFSET,
  CODE_SIZE_BYTES_LENGTH,
  CODE_SIZE_OFFSET,
  HEADER_STORAGE_OFFSET,
  LeafType,
  MAIN_STORAGE_OFFSET,
  NONCE_BYTES_LENGTH,
  NONCE_OFFSET,
  VERKLE_NODE_WIDTH,
  VERSION_BYTES_LENGTH,
} from '../constants.js'

import { getStem } from './crypto.js'

import type { VerkleCrypto, VerkleLeafBasicData } from '../types.js'
import type { Address } from '@ethereumjs/util'

export function decodeLeafBasicData(encodedBasicData: Uint8Array): VerkleLeafBasicData {
  const versionBytes = encodedBasicData.slice(0, VERSION_BYTES_LENGTH)
  const nonceBytes = encodedBasicData.slice(NONCE_OFFSET, NONCE_OFFSET + NONCE_BYTES_LENGTH)
  const codeSizeBytes = encodedBasicData.slice(
    CODE_SIZE_OFFSET,
    CODE_SIZE_OFFSET + CODE_SIZE_BYTES_LENGTH
  )
  const balanceBytes = encodedBasicData.slice(BALANCE_OFFSET, BALANCE_OFFSET + BALANCE_BYTES_LENGTH)

  const version = bytesToInt32(versionBytes, true)
  const nonce = bytesToBigInt(nonceBytes, true)
  const codeSize = bytesToInt32(codeSizeBytes, true)
  const balance = bytesToBigInt(balanceBytes, true)

  return { version, nonce, codeSize, balance }
}

export function encodeLeafBasicData(basicData: VerkleLeafBasicData): Uint8Array {
  const encodedVersion = setLengthRight(int32ToBytes(basicData.version, true), VERSION_BYTES_LENGTH)
  const encodedNonce = setLengthRight(bigIntToBytes(basicData.nonce, true), NONCE_BYTES_LENGTH)
  const encodedCodeSize = setLengthRight(
    int32ToBytes(basicData.codeSize, true),
    CODE_SIZE_BYTES_LENGTH
  )
  const encodedBalance = setLengthRight(
    bigIntToBytes(basicData.balance, true),
    BALANCE_BYTES_LENGTH
  )
  return concatBytes(encodedVersion, encodedNonce, encodedCodeSize, encodedBalance)
}

/**
 * @dev Returns the tree key for a given verkle tree stem, and sub index.
 * @dev Assumes that the verkle node width = 256
 * @param stem The 31-bytes verkle tree stem as a Uint8Array.
 * @param subIndex The sub index of the tree to generate the key for as a Uint8Array.
 * @return The tree key as a Uint8Array.
 */

export const getKey = (stem: Uint8Array, leaf: LeafType | Uint8Array) => {
  switch (leaf) {
    case LeafType.BasicData:
      return concatBytes(stem, BASIC_DATA_LEAF_KEY)
    case LeafType.CodeHash:
      return concatBytes(stem, CODE_HASH_LEAF_KEY)
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
