import {
  bigIntToBytes,
  bytesToHex,
  concatBytes,
  int32ToBytes,
  intToBytes,
  setLengthLeft,
  setLengthRight,
  toBytes,
} from './bytes.js'

import type { Address } from './address.js'
import type { PrefixedHexString } from './types.js'

/**
 * Verkle related constants and helper functions
 *
 * Experimental (do not use in production!)
 */

// TODO 1: this comes with a deprecation of the respective constants and methods within the
// @ethereumjs/verkle package. Due to ease of parallel work this has not yet been executed upon,
// so this still needs a small follow-up clean up PR.
//
// Along with the PR likely more/additional helper functionality should be moved over
// (basically everything generic not depending on Verkle cryptography)
//
// TODO 2: Basically all these constants and methods need a Verkle or (VERKLE) prefix since
// atm names are too generic to be grasped in a non-Verkle-limited context (e.g. `getKey()`)
//
// Holger Drewes, 2024-06-18

/* Verkle Crypto */

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
  hashCommitment: (commitment: Uint8Array) => Uint8Array
  serializeCommitment: (commitment: Uint8Array) => Uint8Array
}

/**
 * @dev Returns the 31-bytes verkle tree stem for a given address and tree index.
 * @dev Assumes that the verkle node width = 256
 * @param ffi The verkle ffi object from verkle-crypotography-wasm.
 * @param address The address to generate the tree key for.
 * @param treeIndex The index of the tree to generate the key for. Defaults to 0.
 * @return The 31-bytes verkle tree stem as a Uint8Array.
 */
export function getStem(
  ffi: VerkleCrypto,
  address: Address,
  treeIndex: number | bigint = 0
): Uint8Array {
  const address32 = setLengthLeft(address.toBytes(), 32)

  let treeIndexBytes: Uint8Array
  if (typeof treeIndex === 'number') {
    treeIndexBytes = setLengthRight(int32ToBytes(Number(treeIndex), true), 32)
  } else {
    treeIndexBytes = setLengthRight(bigIntToBytes(BigInt(treeIndex), true).slice(0, 32), 32)
  }

  const treeStem = ffi.getTreeKey(address32, treeIndexBytes, 0).slice(0, 31)

  return treeStem
}

/**
 * Verifies that the executionWitness is valid for the given prestateRoot.
 * @param ffi The verkle ffi object from verkle-crypotography-wasm.
 * @param prestateRoot The prestateRoot matching the executionWitness.
 * @param executionWitness The verkle execution witness.
 * @returns {boolean} Whether or not the executionWitness belongs to the prestateRoot.
 */
export function verifyProof(
  ffi: VerkleCrypto,
  prestateRoot: Uint8Array,
  executionWitness: VerkleExecutionWitness
): boolean {
  return ffi.verifyExecutionWitnessPreState(
    bytesToHex(prestateRoot),
    JSON.stringify(executionWitness)
  )
}

/* Verkle Structure */

export interface VerkleProof {
  commitmentsByPath: PrefixedHexString[]
  d: PrefixedHexString
  depthExtensionPresent: PrefixedHexString
  ipaProof: {
    cl: PrefixedHexString[]
    cr: PrefixedHexString[]
    finalEvaluation: PrefixedHexString
  }
  otherStems: PrefixedHexString[]
}

export interface VerkleStateDiff {
  stem: PrefixedHexString
  suffixDiffs: {
    currentValue: PrefixedHexString | null
    newValue: PrefixedHexString | null
    suffix: number | string
  }[]
}

/**
 * Experimental, object format could eventual change.
 * An object that provides the state and proof necessary for verkle stateless execution
 * */
export interface VerkleExecutionWitness {
  /**
   * An array of state diffs.
   * Each item corresponding to state accesses or state modifications of the block.
   * In the current design, it also contains the resulting state of the block execution (post-state).
   */
  stateDiff: VerkleStateDiff[]
  /**
   * The verkle proof for the block.
   * Proves that the provided stateDiff belongs to the canonical verkle tree.
   */
  verkleProof: VerkleProof
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
