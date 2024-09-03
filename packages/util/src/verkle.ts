import {
  bigIntToBytes,
  bytesToBigInt,
  bytesToInt32,
  concatBytes,
  int32ToBytes,
  intToBytes,
  setLengthLeft,
  setLengthRight,
  toBytes,
} from './bytes.js'

import type { Account } from './account.js'
import type { Address } from './address.js'
import type { PrefixedHexString } from './types.js'

/**
 * Verkle related constants and helper functions
 *
 * Experimental (do not use in production!)
 */

/* Verkle Crypto */
export interface VerkleCrypto {
  getTreeKey: (address: Uint8Array, treeIndex: Uint8Array, subIndex: number) => Uint8Array
  getTreeKeyHash: (address: Uint8Array, treeIndexLE: Uint8Array) => Uint8Array
  updateCommitment: (
    commitment: Uint8Array,
    commitmentIndex: number,
    oldScalarValue: Uint8Array,
    newScalarValue: Uint8Array,
  ) => Uint8Array // Commitment
  zeroCommitment: Uint8Array
  verifyExecutionWitnessPreState: (prestateRoot: string, execution_witness_json: string) => boolean
  hashCommitment: (commitment: Uint8Array) => Uint8Array
  serializeCommitment: (commitment: Uint8Array) => Uint8Array
}

/**
 * @dev Returns the 31-bytes verkle tree stem for a given address and tree index.
 * @dev Assumes that the verkle node width = 256
 * @param ffi The verkle ffi object from verkle-cryptography-wasm.
 * @param address The address to generate the tree key for.
 * @param treeIndex The index of the tree to generate the key for. Defaults to 0.
 * @return The 31-bytes verkle tree stem as a Uint8Array.
 */
export function getVerkleStem(
  ffi: VerkleCrypto,
  address: Address,
  treeIndex: number | bigint = 0,
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
 * @param ffi The verkle ffi object from verkle-cryptography-wasm.
 * @param executionWitness The verkle execution witness.
 * @returns {boolean} Whether or not the executionWitness belongs to the prestateRoot.
 */
export function verifyVerkleProof(
  ffi: VerkleCrypto,
  executionWitness: VerkleExecutionWitness,
): boolean {
  const { parentStateRoot, ...parsedExecutionWitness } = executionWitness
  return ffi.verifyExecutionWitnessPreState(parentStateRoot, JSON.stringify(parsedExecutionWitness))
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
   * The stateRoot of the parent block
   */
  parentStateRoot: PrefixedHexString
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

export enum VerkleLeafType {
  BasicData = 0,
  CodeHash = 1,
}

export type VerkleLeafBasicData = {
  version: number
  nonce: bigint
  balance: bigint
  codeSize: number
}

export const VERKLE_VERSION_OFFSET = 0
export const VERKLE_NONCE_OFFSET = 4
export const VERKLE_CODE_SIZE_OFFSET = 12
export const VERKLE_BALANCE_OFFSET = 16

export const VERKLE_VERSION_BYTES_LENGTH = 1
export const VERKLE_NONCE_BYTES_LENGTH = 8
export const VERKLE_CODE_SIZE_BYTES_LENGTH = 4
export const VERKLE_BALANCE_BYTES_LENGTH = 16

export const VERKLE_BASIC_DATA_LEAF_KEY = intToBytes(VerkleLeafType.BasicData)
export const VERKLE_CODE_HASH_LEAF_KEY = intToBytes(VerkleLeafType.CodeHash)

export const VERKLE_CODE_CHUNK_SIZE = 31
export const VERKLE_HEADER_STORAGE_OFFSET = 64
export const VERKLE_CODE_OFFSET = 128
export const VERKLE_NODE_WIDTH = 256
export const VERKLE_MAIN_STORAGE_OFFSET = BigInt(256) ** BigInt(VERKLE_CODE_CHUNK_SIZE)

/**
 * @dev Returns the tree key for a given verkle tree stem, and sub index.
 * @dev Assumes that the verkle node width = 256
 * @param stem The 31-bytes verkle tree stem as a Uint8Array.
 * @param subIndex The sub index of the tree to generate the key for as a Uint8Array.
 * @return The tree key as a Uint8Array.
 */

export const getVerkleKey = (stem: Uint8Array, leaf: VerkleLeafType | Uint8Array) => {
  switch (leaf) {
    case VerkleLeafType.BasicData:
      return concatBytes(stem, VERKLE_BASIC_DATA_LEAF_KEY)
    case VerkleLeafType.CodeHash:
      return concatBytes(stem, VERKLE_CODE_HASH_LEAF_KEY)
    default:
      return concatBytes(stem, leaf)
  }
}

export function getVerkleTreeIndexesForStorageSlot(storageKey: bigint): {
  treeIndex: bigint
  subIndex: number
} {
  let position: bigint
  if (storageKey < VERKLE_CODE_OFFSET - VERKLE_HEADER_STORAGE_OFFSET) {
    position = BigInt(VERKLE_HEADER_STORAGE_OFFSET) + storageKey
  } else {
    position = VERKLE_MAIN_STORAGE_OFFSET + storageKey
  }

  const treeIndex = position / BigInt(VERKLE_NODE_WIDTH)
  const subIndex = Number(position % BigInt(VERKLE_NODE_WIDTH))

  return { treeIndex, subIndex }
}

export function getVerkleTreeIndicesForCodeChunk(chunkId: number) {
  const treeIndex = Math.floor((VERKLE_CODE_OFFSET + chunkId) / VERKLE_NODE_WIDTH)
  const subIndex = (VERKLE_CODE_OFFSET + chunkId) % VERKLE_NODE_WIDTH
  return { treeIndex, subIndex }
}

export const getVerkleTreeKeyForCodeChunk = async (
  address: Address,
  chunkId: number,
  verkleCrypto: VerkleCrypto,
) => {
  const { treeIndex, subIndex } = getVerkleTreeIndicesForCodeChunk(chunkId)
  return concatBytes(getVerkleStem(verkleCrypto, address, treeIndex), toBytes(subIndex))
}

export const chunkifyCode = (code: Uint8Array) => {
  // Pad code to multiple of VERKLE_CODE_CHUNK_SIZE bytes
  if (code.length % VERKLE_CODE_CHUNK_SIZE !== 0) {
    const paddingLength = VERKLE_CODE_CHUNK_SIZE - (code.length % VERKLE_CODE_CHUNK_SIZE)
    code = setLengthRight(code, code.length + paddingLength)
  }
  // Put first chunk (leading byte is always 0 since we have no leading PUSHDATA bytes)
  const chunks = [concatBytes(new Uint8Array(1), code.subarray(0, 31))]
  for (let i = 1; i < Math.floor(code.length / 31); i++) {
    const slice = code.slice((i - 1) * 31, i * 31)
    let x = 31
    while (x >= 0) {
      // Look for last push instruction in code chunk
      if (slice[x] > 0x5f && slice[x] < 0x80) break
      x--
    }
    if (x >= 0 && slice[x] - 0x5f > 31 - x) {
      // x >= 0 indicates PUSHn in this chunk
      // n > 31 - x indicates that PUSHDATA spills over to next chunk
      // PUSHDATA overflow = n - 31 - x + 1(i.e. number of elements PUSHed
      // - size of code chunk (31) - position of PUSHn in the previous
      // code chunk + 1 (since x is zero-indexed))
      const pushDataOverflow = slice[x] - 0x5f - 31 - x + 1
      // Put next chunk prepended with number of overflow PUSHDATA bytes
      chunks.push(
        concatBytes(Uint8Array.from([pushDataOverflow]), code.slice(i * 31, (i + 1) * 31)),
      )
    } else {
      // Put next chunk prepended with 0 (i.e. no overflow PUSHDATA bytes from previous chunk)
      chunks.push(concatBytes(new Uint8Array(1), code.slice(i * 31, (i + 1) * 31)))
    }
  }
  return chunks
}

export const getVerkleTreeKeyForStorageSlot = async (
  address: Address,
  storageKey: bigint,
  verkleCrypto: VerkleCrypto,
) => {
  const { treeIndex, subIndex } = getVerkleTreeIndexesForStorageSlot(storageKey)

  return concatBytes(getVerkleStem(verkleCrypto, address, treeIndex), toBytes(subIndex))
}

export function decodeVerkleLeafBasicData(encodedBasicData: Uint8Array): VerkleLeafBasicData {
  const versionBytes = encodedBasicData.slice(0, VERKLE_VERSION_BYTES_LENGTH)
  const nonceBytes = encodedBasicData.slice(
    VERKLE_NONCE_OFFSET,
    VERKLE_NONCE_OFFSET + VERKLE_NONCE_BYTES_LENGTH,
  )
  const codeSizeBytes = encodedBasicData.slice(
    VERKLE_CODE_SIZE_OFFSET,
    VERKLE_CODE_SIZE_OFFSET + VERKLE_CODE_SIZE_BYTES_LENGTH,
  )
  const balanceBytes = encodedBasicData.slice(
    VERKLE_BALANCE_OFFSET,
    VERKLE_BALANCE_OFFSET + VERKLE_BALANCE_BYTES_LENGTH,
  )

  const version = bytesToInt32(versionBytes)
  const nonce = bytesToBigInt(nonceBytes)
  const codeSize = bytesToInt32(codeSizeBytes)
  const balance = bytesToBigInt(balanceBytes)

  return { version, nonce, codeSize, balance }
}

export function encodeVerkleLeafBasicData(account: Account): Uint8Array {
  const encodedVersion = setLengthLeft(int32ToBytes(account.version), VERKLE_VERSION_BYTES_LENGTH)
  // Per EIP-6800, bytes 1-4 are reserved for future use
  const reservedBytes = new Uint8Array([0, 0, 0])
  const encodedNonce = setLengthLeft(bigIntToBytes(account.nonce), VERKLE_NONCE_BYTES_LENGTH)
  const encodedCodeSize = setLengthLeft(
    int32ToBytes(account.codeSize),
    VERKLE_CODE_SIZE_BYTES_LENGTH,
  )
  const encodedBalance = setLengthLeft(bigIntToBytes(account.balance), VERKLE_BALANCE_BYTES_LENGTH)
  return concatBytes(encodedVersion, reservedBytes, encodedNonce, encodedCodeSize, encodedBalance)
}

export const generateChunkSuffixes = (numChunks: number) => {
  const chunkSuffixes: number[] = new Array(numChunks)
  for (let x = 0; x < numChunks; x++) {
    if (x < 128) {
      // Suffixes for chunks 0 - 127 start at 128 and end with 255
      chunkSuffixes[x] = x + 128
      continue
    }
    if (x < 384) {
      // Suffixes for chunks 128 - 383 start at 0 and go to 255
      chunkSuffixes[x] = x - 128
      continue
    }
    if (x < 640) {
      // Suffixes for chunks 384 - 639 start at 0 and go to 255
      chunkSuffixes[x] = x - 384
      continue
    }
    if (x > 639) {
      // Suffixes for chunks 640 - 793 start at 0 and go to 153
      chunkSuffixes[x] = x - 640
      continue
    }
  }
  return chunkSuffixes
}

export const generateCodeStems = async (
  numChunks: number,
  address: Address,
  verkleCrypto: VerkleCrypto,
) => {
  // The maximum number of chunks is 793 (maxCodeSize - 24576) / (bytes per chunk 31) + (round up - 1)
  // Code is stored in chunks starting at leaf index 128 of the leaf node corresponding to the stem of the code's address
  // Code chunks beyond the initial 128 are stored in additional leaf nodes in batches up of up to 256 chunks per leaf node
  // so the maximum number of leaf nodes that can hold contract code for a specific address is 4 leaf nodes (128 chunks in
  // the first leaf node and 256 chunks in up to 3 additional leaf nodes)
  // So, instead of computing every single leaf key (which is a heavy async operation), we just compute the stem for the first
  // chunk in each leaf node and can then know that the chunks in between have tree keys in monotonically increasing order
  const numStems = Math.floor(numChunks / 256) + 1
  const chunkStems = new Array(numStems)
  // Compute the stem for the initial set of code chunks
  chunkStems[0] = (await getVerkleTreeKeyForCodeChunk(address, 0, verkleCrypto)).slice(0, 31)

  for (let stemNum = 0; stemNum < numStems - 1; stemNum++) {
    // Generate additional stems
    const firstChunkKey = await getVerkleTreeKeyForCodeChunk(
      address,
      128 + stemNum * 256,
      verkleCrypto,
    )
    chunkStems[stemNum] = firstChunkKey.slice(0, 31)
  }
  return chunkStems
}
