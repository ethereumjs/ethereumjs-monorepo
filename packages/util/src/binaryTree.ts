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
 * Build the 31-byte binary-tree stem for an address and tree index (EIP-7864).
 *
 * @param hashFunction Hash used to derive the stem from the padded address and index
 * @param treeIndex Tree index; defaults to `0`
 */
export function getBinaryTreeStem(
  hashFunction: (value: Uint8Array) => Uint8Array,
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

  const treeStem = hashFunction(concatBytes(address32, treeIndexBytes)).slice(0, 31)

  return treeStem
}

/** Stem and suffix diffs for one binary-tree state access. */
export interface BinaryTreeStateDiff {
  stem: PrefixedHexString
  suffixDiffs: {
    currentValue: PrefixedHexString | null
    newValue: PrefixedHexString | null
    suffix: number | string
  }[]
}

// TODO: This is a placeholder type, the actual type is not yet defined
/** Placeholder proof type for binary-tree witnesses (experimental). */
export type BinaryTreeProof = any

/**
 * Experimental, object format could eventual change.
 * An object that provides the state and proof necessary for binary tree stateless execution
 */
export interface BinaryTreeExecutionWitness {
  /**
   * The stateRoot of the parent block
   */
  parentStateRoot: PrefixedHexString
  /**
   * An array of state diffs.
   * Each item corresponding to state accesses or state modifications of the block.
   * In the current design, it also contains the resulting state of the block execution (post-state).
   */
  stateDiff: BinaryTreeStateDiff[]
  /**
   * The proof for the block.
   * Proves that the provided stateDiff belongs to the canonical binary tree.
   */
  proof: BinaryTreeProof
}

/** Leaf kind discriminator for binary-tree account data. */
export type BinaryTreeLeafType = (typeof BinaryTreeLeafType)[keyof typeof BinaryTreeLeafType]

/** Leaf kind discriminator for binary-tree account data. */
export const BinaryTreeLeafType = {
  BasicData: 0,
  CodeHash: 1,
} as const

/** Decoded account header fields from a binary-tree basic-data leaf. */
export type BinaryTreeLeafBasicData = {
  version: number
  nonce: bigint
  balance: bigint
  codeSize: number
}

/** Binary-tree layout constant `VERSION_OFFSET` (EIP-7864). */
export const BINARY_TREE_VERSION_OFFSET = 0
/** Binary-tree layout constant `CODE_SIZE_OFFSET` (EIP-7864). */
export const BINARY_TREE_CODE_SIZE_OFFSET = 5
/** Binary-tree layout constant `NONCE_OFFSET` (EIP-7864). */
export const BINARY_TREE_NONCE_OFFSET = 8
/** Binary-tree layout constant `BALANCE_OFFSET` (EIP-7864). */
export const BINARY_TREE_BALANCE_OFFSET = 16

/** Binary-tree layout constant `VERSION_BYTES_LENGTH` (EIP-7864). */
export const BINARY_TREE_VERSION_BYTES_LENGTH = 1
/** Binary-tree layout constant `CODE_SIZE_BYTES_LENGTH` (EIP-7864). */
export const BINARY_TREE_CODE_SIZE_BYTES_LENGTH = 3
/** Binary-tree layout constant `NONCE_BYTES_LENGTH` (EIP-7864). */
export const BINARY_TREE_NONCE_BYTES_LENGTH = 8
/** Binary-tree layout constant `BALANCE_BYTES_LENGTH` (EIP-7864). */
export const BINARY_TREE_BALANCE_BYTES_LENGTH = 16

/** Binary-tree layout constant `BASIC_DATA_LEAF_KEY` (EIP-7864). */
export const BINARY_TREE_BASIC_DATA_LEAF_KEY = intToBytes(BinaryTreeLeafType.BasicData)
/** Binary-tree layout constant `CODE_HASH_LEAF_KEY` (EIP-7864). */
export const BINARY_TREE_CODE_HASH_LEAF_KEY = intToBytes(BinaryTreeLeafType.CodeHash)

/** Binary-tree layout constant `CODE_CHUNK_SIZE` (EIP-7864). */
export const BINARY_TREE_CODE_CHUNK_SIZE = 31
/** Binary-tree layout constant `HEADER_STORAGE_OFFSET` (EIP-7864). */
export const BINARY_TREE_HEADER_STORAGE_OFFSET = 64
/** Binary-tree layout constant `CODE_OFFSET` (EIP-7864). */
export const BINARY_TREE_CODE_OFFSET = 128
/** Binary-tree layout constant `NODE_WIDTH` (EIP-7864). */
export const BINARY_TREE_NODE_WIDTH = 256
/** Binary-tree layout constant `MAIN_STORAGE_OFFSET` (EIP-7864). */
export const BINARY_TREE_MAIN_STORAGE_OFFSET = BigInt(256) ** BigInt(BINARY_TREE_CODE_CHUNK_SIZE)

/**
 * Combine a 31-byte stem with a leaf suffix to form a binary-tree key (node width 256).
 *
 * @param leaf {@link BinaryTreeLeafType} constant or raw suffix bytes
 */
export const getBinaryTreeKey = (stem: Uint8Array, leaf: BinaryTreeLeafType | Uint8Array) => {
  switch (leaf) {
    case BinaryTreeLeafType.BasicData:
      return concatBytes(stem, BINARY_TREE_BASIC_DATA_LEAF_KEY)
    case BinaryTreeLeafType.CodeHash:
      return concatBytes(stem, BINARY_TREE_CODE_HASH_LEAF_KEY)
    default:
      return concatBytes(stem, leaf)
  }
}

/** Map a storage slot to its binary-tree node index and in-node subindex. */
export function getBinaryTreeIndicesForStorageSlot(storageKey: bigint): {
  treeIndex: bigint
  subIndex: number
} {
  let position: bigint
  if (storageKey < BINARY_TREE_CODE_OFFSET - BINARY_TREE_HEADER_STORAGE_OFFSET) {
    position = BigInt(BINARY_TREE_HEADER_STORAGE_OFFSET) + storageKey
  } else {
    position = BINARY_TREE_MAIN_STORAGE_OFFSET + storageKey
  }

  const treeIndex = position / BigInt(BINARY_TREE_NODE_WIDTH)
  const subIndex = Number(position % BigInt(BINARY_TREE_NODE_WIDTH))

  return { treeIndex, subIndex }
}

/** Map a code chunk index to its binary-tree node index and in-node subindex. */
export function getBinaryTreeIndicesForCodeChunk(chunkId: number) {
  const treeIndex = Math.floor((BINARY_TREE_CODE_OFFSET + chunkId) / BINARY_TREE_NODE_WIDTH)
  const subIndex = (BINARY_TREE_CODE_OFFSET + chunkId) % BINARY_TREE_NODE_WIDTH
  return { treeIndex, subIndex }
}

/**
 * Build the binary-tree key for a contract code chunk.
 *
 * @param hashFunction Hash used to derive the address stem
 */
export const getBinaryTreeKeyForCodeChunk = (
  address: Address,
  chunkId: number,
  hashFunction: (input: Uint8Array) => Uint8Array,
) => {
  const { treeIndex, subIndex } = getBinaryTreeIndicesForCodeChunk(chunkId)
  return concatBytes(getBinaryTreeStem(hashFunction, address, treeIndex), intToBytes(subIndex))
}

// This code was written by robots based on the reference implementation in EIP-7864
/** Split contract bytecode into binary-tree code chunks (EIP-7864). */
export const chunkifyBinaryTreeCode = (code: Uint8Array) => {
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
 * Build the binary-tree key for an account storage slot.
 *
 * @param hashFunction Hash used to derive the address stem
 */
export const getBinaryTreeKeyForStorageSlot = (
  address: Address,
  storageKey: bigint,
  hashFunction: (input: Uint8Array) => Uint8Array,
) => {
  const { treeIndex, subIndex } = getBinaryTreeIndicesForStorageSlot(storageKey)

  return concatBytes(getBinaryTreeStem(hashFunction, address, treeIndex), intToBytes(subIndex))
}

/** Decode account header fields from a binary-tree basic-data leaf payload. */
export function decodeBinaryTreeLeafBasicData(
  encodedBasicData: Uint8Array,
): BinaryTreeLeafBasicData {
  const versionBytes = encodedBasicData.slice(0, BINARY_TREE_VERSION_BYTES_LENGTH)
  const nonceBytes = encodedBasicData.slice(
    BINARY_TREE_NONCE_OFFSET,
    BINARY_TREE_NONCE_OFFSET + BINARY_TREE_NONCE_BYTES_LENGTH,
  )
  const codeSizeBytes = encodedBasicData.slice(
    BINARY_TREE_CODE_SIZE_OFFSET,
    BINARY_TREE_CODE_SIZE_OFFSET + BINARY_TREE_CODE_SIZE_BYTES_LENGTH,
  )
  const balanceBytes = encodedBasicData.slice(
    BINARY_TREE_BALANCE_OFFSET,
    BINARY_TREE_BALANCE_OFFSET + BINARY_TREE_BALANCE_BYTES_LENGTH,
  )

  const version = bytesToInt32(versionBytes)
  const nonce = bytesToBigInt(nonceBytes)
  const codeSize = bytesToInt32(codeSizeBytes)
  const balance = bytesToBigInt(balanceBytes)

  return { version, nonce, codeSize, balance }
}

/** Encode an {@link Account} basic-data leaf for binary-tree storage (EIP-7864). */
export function encodeBinaryTreeLeafBasicData(account: Account): Uint8Array {
  const encodedVersion = setLengthLeft(
    intToBytes(account.version),
    BINARY_TREE_VERSION_BYTES_LENGTH,
  )
  // Per EIP-7864, bytes 1-4 are reserved for future use
  const reservedBytes = new Uint8Array([0, 0, 0, 0])
  const encodedNonce = setLengthLeft(bigIntToBytes(account.nonce), BINARY_TREE_NONCE_BYTES_LENGTH)
  const encodedCodeSize = setLengthLeft(
    intToBytes(account.codeSize),
    BINARY_TREE_CODE_SIZE_BYTES_LENGTH,
  )
  const encodedBalance = setLengthLeft(
    bigIntToBytes(account.balance),
    BINARY_TREE_BALANCE_BYTES_LENGTH,
  )
  return concatBytes(encodedVersion, reservedBytes, encodedCodeSize, encodedNonce, encodedBalance)
}

/**
 * Helper method to generate the suffixes for code chunks for putting code
 * @param numChunks number of chunks to generate suffixes for
 * @returns number[] - an array of numbers corresponding to the code chunks being put
 */
export const generateBinaryTreeChunkSuffixes = (numChunks: number) => {
  if (numChunks === 0) return []
  const chunkSuffixes: number[] = new Array<number>(numChunks)
  let currentSuffix = BINARY_TREE_CODE_OFFSET
  for (let x = 0; x < numChunks; x++) {
    chunkSuffixes[x] = currentSuffix
    currentSuffix++
    // Reset suffix to 0 if exceeds BINARY_TREE_NODE_WIDTH
    if (currentSuffix >= BINARY_TREE_NODE_WIDTH) currentSuffix = 0
  }

  return chunkSuffixes
}

/**
 * Helper method for generating the code stems necessary for putting code
 * @param numChunks the number of code chunks to be put
 * @param address the address of the account getting the code
 * @param hashFunction Keccak/Blake3 (or compatible) hash used for stem generation
 * @returns an array of stems for putting code
 */
export function generateBinaryTreeCodeStems(
  numChunks: number,
  address: Address,
  hashFunction: (input: Uint8Array) => Uint8Array,
): Uint8Array[] {
  // The maximum number of chunks is 793 (maxCodeSize - 24576) / (bytes per chunk 31) + (round up - 1)
  // Code is stored in chunks starting at leaf index 128 of the leaf node corresponding to the stem of the code's address
  // Code chunks beyond the initial 128 are stored in additional leaf nodes in batches up of up to 256 chunks per leaf node
  // so the maximum number of leaf nodes that can hold contract code for a specific address is 4 leaf nodes (128 chunks in
  // the first leaf node and 256 chunks in up to 3 additional leaf nodes)
  // So, instead of computing every single leaf key (which is a heavy operation), we just compute the stem for the first
  // chunk in each leaf node and can then know that the chunks in between have tree keys in monotonically increasing order
  const numStems =
    numChunks > BINARY_TREE_CODE_OFFSET ? Math.ceil(numChunks / BINARY_TREE_NODE_WIDTH) + 1 : 1
  const chunkStems = new Array<Uint8Array>(numStems)
  // Compute the stem for the initial set of code chunks
  chunkStems[0] = getBinaryTreeKeyForCodeChunk(address, 0, hashFunction).slice(0, 31)

  for (let stemNum = 0; stemNum < numStems - 1; stemNum++) {
    // Generate additional stems
    const firstChunkKey = getBinaryTreeKeyForCodeChunk(
      address,
      BINARY_TREE_CODE_OFFSET + stemNum * BINARY_TREE_NODE_WIDTH,
      hashFunction,
    )
    chunkStems[stemNum + 1] = firstChunkKey.slice(0, 31)
  }
  return chunkStems
}
