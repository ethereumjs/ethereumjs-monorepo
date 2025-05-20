import {
  bigIntToBytes,
  bytesToBigInt,
  bytesToInt32,
  concatBytes,
  int32ToBytes,
  intToBytes,
  setLengthLeft,
  setLengthRight,
} from './bytes.ts'

import type { Account } from './account.ts'
import type { Address } from './address.ts'
import type { PrefixedHexString } from './types.ts'

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
  createProof: (bytes: ProverInput[]) => Uint8Array
  verifyProof: (proof: Uint8Array, verifierInput: VerifierInput[]) => boolean
  commitToScalars: (vector: Uint8Array[]) => Uint8Array
}

export interface ProverInput {
  serializedCommitment: Uint8Array // serialized node commitment we want a proof from  i.e. verkleCrypto.serializeCommitment(commitment)
  vector: Uint8Array[] // Array of 256 children/values
  indices: number[] // Indices from the valuesArray we are proving existence of
}

export interface VerifierInput {
  serializedCommitment: Uint8Array // serialized node commitment we want a proof from  i.e. verkleCrypto.serializeCommitment(commitment)
  indexValuePairs: Array<{ index: number; value: Uint8Array }> // array of tuples of indices and values from node's children array being verified by proof
}
/**
 * @dev Returns the 31-bytes verkle tree stem for a given address and tree index.
 * @dev Assumes that the verkle node width = 256
 * @param {VerkleCrypto} verkleCrypto The {@link VerkleCrypto} foreign function interface object from Verkle cryptography
 * @param {Address} address The address to generate the tree key for.
 * @param treeIndex The index of the tree to generate the key for. Defaults to 0.
 * @return The 31-bytes verkle tree stem as a Uint8Array.
 */
export function getVerkleStem(
  verkleCrypto: VerkleCrypto,
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

  const treeStem = verkleCrypto.getTreeKey(address32, treeIndexBytes, 0).slice(0, 31)

  return treeStem
}

/**
 * Verifies that the executionWitness is valid for the given prestateRoot.
 * @param {VerkleCrypto} verkleCrypto The {@link VerkleCrypto} foreign function interface object from Verkle cryptography
 * @param {VerkleExecutionWitness} executionWitness The verkle execution witness.
 * @returns {boolean} Whether or not the executionWitness belongs to the prestateRoot.
 */
export function verifyVerkleProof(
  verkleCrypto: VerkleCrypto,
  executionWitness: VerkleExecutionWitness,
): boolean {
  const { parentStateRoot, ...parsedExecutionWitness } = executionWitness
  return verkleCrypto.verifyExecutionWitnessPreState(
    parentStateRoot,
    JSON.stringify(parsedExecutionWitness),
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

export type VerkleLeafType = (typeof VerkleLeafType)[keyof typeof VerkleLeafType]

export const VerkleLeafType = {
  BasicData: 0,
  CodeHash: 1,
} as const

export type VerkleLeafBasicData = {
  version: number
  nonce: bigint
  balance: bigint
  codeSize: number
}

export const VERKLE_VERSION_OFFSET = 0
export const VERKLE_CODE_SIZE_OFFSET = 5
export const VERKLE_NONCE_OFFSET = 8
export const VERKLE_BALANCE_OFFSET = 16

export const VERKLE_VERSION_BYTES_LENGTH = 1
export const VERKLE_CODE_SIZE_BYTES_LENGTH = 3
export const VERKLE_NONCE_BYTES_LENGTH = 8
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

/**
 * Calculates the position of the storage key in the Verkle tree, determining
 * both the tree index (the node in the tree) and the subindex (the position within the node).
 * @param {bigint} storageKey - The key representing a specific storage slot.
 * @returns {Object} - An object containing the tree index and subindex
 */
export function getVerkleTreeIndicesForStorageSlot(storageKey: bigint): {
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

/**
 * Calculates the position of the code chunks in the Verkle tree, determining
 * both the tree index (the node in the tree) and the subindex (the position within the node).
 * @param {bigint} chunkId - The ID representing a specific chunk.
 * @returns {Object} - An object containing the tree index and subindex
 */
export function getVerkleTreeIndicesForCodeChunk(chunkId: number) {
  const treeIndex = Math.floor((VERKLE_CODE_OFFSET + chunkId) / VERKLE_NODE_WIDTH)
  const subIndex = (VERKLE_CODE_OFFSET + chunkId) % VERKLE_NODE_WIDTH
  return { treeIndex, subIndex }
}

/**
 * Asynchronously calculates the Verkle tree key for the specified code chunk ID.
 * @param {Address} address - The account address to access code for.
 * @param {number} chunkId - The ID of the code chunk to retrieve.
 * @param {VerkleCrypto} verkleCrypto - The cryptographic object used for Verkle-related operations.
 * @returns {Promise<Uint8Array>} - A promise that resolves to the Verkle tree key as a byte array.
 */
export const getVerkleTreeKeyForCodeChunk = async (
  address: Address,
  chunkId: number,
  verkleCrypto: VerkleCrypto,
) => {
  const { treeIndex, subIndex } = getVerkleTreeIndicesForCodeChunk(chunkId)
  return concatBytes(getVerkleStem(verkleCrypto, address, treeIndex), intToBytes(subIndex))
}

// This code was written by robots based on the reference implementation in EIP-6800
export const chunkifyCode = (code: Uint8Array) => {
  const PUSH1 = 0x60 // Assuming PUSH1 is defined as 0x60
  const PUSH32 = 0x7f // Assuming PUSH32 is defined as 0x7f
  const PUSH_OFFSET = 0x5f // Assuming PUSH_OFFSET is defined as 0x5f

  // Calculate padding length
  const paddingLength = (31 - (code.length % 31)) % 31
  const paddedCode = new Uint8Array(code.length + paddingLength)
  paddedCode.set(code)

  // Pre-allocate the bytesToExecData array
  const bytesToExecData = new Uint8Array(paddedCode.length + 32)

  let pos = 0
  while (pos < paddedCode.length) {
    let pushdataBytes = 0
    if (PUSH1 <= paddedCode[pos] && paddedCode[pos] <= PUSH32) {
      pushdataBytes = paddedCode[pos] - PUSH_OFFSET
    }
    pos += 1
    for (let x = 0; x < pushdataBytes; x++) {
      bytesToExecData[pos + x] = pushdataBytes - x
    }
    pos += pushdataBytes
  }

  // Pre-allocate the chunks array
  const numChunks = Math.ceil(paddedCode.length / 31)
  const chunks = new Array<Uint8Array>(numChunks)

  for (let i = 0, pos = 0; i < numChunks; i++, pos += 31) {
    const chunk = new Uint8Array(32)
    chunk[0] = Math.min(bytesToExecData[pos], 31)
    chunk.set(paddedCode.subarray(pos, pos + 31), 1)
    chunks[i] = chunk
  }

  return chunks
}

/**
 * Asynchronously calculates the Verkle tree key for the specified storage slot.
 * @param {Address} address - The account address to access code for.
 * @param {bigint} storageKey - The storage slot key to retrieve the verkle key for.
 * @param {VerkleCrypto} verkleCrypto - The cryptographic object used for Verkle-related operations.
 * @returns {Promise<Uint8Array>} - A promise that resolves to the Verkle tree key as a byte array.
 */
export const getVerkleTreeKeyForStorageSlot = async (
  address: Address,
  storageKey: bigint,
  verkleCrypto: VerkleCrypto,
) => {
  const { treeIndex, subIndex } = getVerkleTreeIndicesForStorageSlot(storageKey)

  return concatBytes(getVerkleStem(verkleCrypto, address, treeIndex), intToBytes(subIndex))
}

/**
 * This function extracts and decodes account header elements (version, nonce, code size, and balance)
 * from an encoded `Uint8Array` representation of raw Verkle leaf-node basic data. Each component is sliced
 * from the `encodedBasicData` array based on predefined offsets and lengths, and then converted
 * to its appropriate type (integer or BigInt).
 * @param {Uint8Array} encodedBasicData - The encoded Verkle leaf basic data containing the version, nonce,
 * code size, and balance in a compact Uint8Array format.
 * @returns {VerkleLeafBasicData} - An object containing the decoded version, nonce, code size, and balance.
 */
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

/**
 * This function takes a `VerkleLeafBasicData` object and encodes its properties
 * (version, nonce, code size, and balance) into a compact `Uint8Array` format. Each
 * property is serialized and padded to match the required byte lengths defined by
 * EIP-6800. Additionally, 4 bytes are reserved for future use as specified
 * in EIP-6800.
 * @param {VerkleLeafBasicData} basicData - An object containing the version, nonce,
 *   code size, and balance to be encoded.
 * @returns {Uint8Array} - A compact bytes representation of the account header basic data.
 */
export function encodeVerkleLeafBasicData(account: Account): Uint8Array {
  const encodedVersion = setLengthLeft(int32ToBytes(account.version), VERKLE_VERSION_BYTES_LENGTH)
  // Per EIP-6800, bytes 1-4 are reserved for future use
  const reservedBytes = new Uint8Array([0, 0, 0, 0])
  const encodedNonce = setLengthLeft(bigIntToBytes(account.nonce), VERKLE_NONCE_BYTES_LENGTH)
  const encodedCodeSize = setLengthLeft(
    int32ToBytes(account.codeSize),
    VERKLE_CODE_SIZE_BYTES_LENGTH,
  )
  const encodedBalance = setLengthLeft(bigIntToBytes(account.balance), VERKLE_BALANCE_BYTES_LENGTH)
  return concatBytes(encodedVersion, reservedBytes, encodedCodeSize, encodedNonce, encodedBalance)
}

/**
 * Helper method to generate the suffixes for code chunks for putting code
 * @param numChunks number of chunks to generate suffixes for
 * @returns number[] - an array of numbers corresponding to the code chunks being put
 */
export const generateChunkSuffixes = (numChunks: number) => {
  if (numChunks === 0) return []
  const chunkSuffixes: number[] = new Array<number>(numChunks)
  let currentSuffix = VERKLE_CODE_OFFSET
  for (let x = 0; x < numChunks; x++) {
    chunkSuffixes[x] = currentSuffix
    currentSuffix++
    // Reset suffix to 0 if exceeds VERKLE_NODE_WIDTH
    if (currentSuffix >= VERKLE_NODE_WIDTH) currentSuffix = 0
  }

  return chunkSuffixes
}

/**
 * Helper method for generating the code stems necessary for putting code
 * @param numChunks the number of code chunks to be put
 * @param address the address of the account getting the code
 * @param verkleCrypto an initialized {@link VerkleCrypto} object
 * @returns an array of stems for putting code
 */
export const generateCodeStems = async (
  numChunks: number,
  address: Address,
  verkleCrypto: VerkleCrypto,
): Promise<Uint8Array[]> => {
  // The maximum number of chunks is 793 (maxCodeSize - 24576) / (bytes per chunk 31) + (round up - 1)
  // Code is stored in chunks starting at leaf index 128 of the leaf node corresponding to the stem of the code's address
  // Code chunks beyond the initial 128 are stored in additional leaf nodes in batches up of up to 256 chunks per leaf node
  // so the maximum number of leaf nodes that can hold contract code for a specific address is 4 leaf nodes (128 chunks in
  // the first leaf node and 256 chunks in up to 3 additional leaf nodes)
  // So, instead of computing every single leaf key (which is a heavy async operation), we just compute the stem for the first
  // chunk in each leaf node and can then know that the chunks in between have tree keys in monotonically increasing order
  const numStems = numChunks > VERKLE_CODE_OFFSET ? Math.ceil(numChunks / VERKLE_NODE_WIDTH) + 1 : 1
  const chunkStems = new Array<Uint8Array>(numStems)
  // Compute the stem for the initial set of code chunks
  chunkStems[0] = (await getVerkleTreeKeyForCodeChunk(address, 0, verkleCrypto)).slice(0, 31)

  for (let stemNum = 0; stemNum < numStems - 1; stemNum++) {
    // Generate additional stems
    const firstChunkKey = await getVerkleTreeKeyForCodeChunk(
      address,
      VERKLE_CODE_OFFSET + stemNum * VERKLE_NODE_WIDTH,
      verkleCrypto,
    )
    chunkStems[stemNum + 1] = firstChunkKey.slice(0, 31)
  }
  return chunkStems
}
