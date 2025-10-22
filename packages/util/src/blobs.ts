import { sha256 } from 'ethereum-cryptography/sha256.js'

import { bytesToHex, hexToBytes, utf8ToBytes } from './bytes.ts'

import type { KZG } from './kzg.ts'
import type { PrefixedHexString } from './types.ts'

/**
 * These utilities for constructing blobs are borrowed from https://github.com/Inphi/eip4844-interop.git
 */
const BYTES_PER_FIELD_ELEMENT = 32 // EIP-4844
const FIELD_ELEMENTS_PER_BLOB = 4096 // EIP-4844
const BLOB_SIZE = BYTES_PER_FIELD_ELEMENT * FIELD_ELEMENTS_PER_BLOB

const MAX_BLOBS_PER_TX = 6 // EIP-7691: Blob throughput increase, Pectra HF
const MAX_BLOB_BYTES_PER_TX = BLOB_SIZE * MAX_BLOBS_PER_TX - 1

export const CELLS_PER_EXT_BLOB = 128 // EIP-4844, Consensus Spec, 2 * FIELD_ELEMENTS_PER_BLOB // 64 (FIELD_ELEMENTS_PER_CELL)

/**
 * Pads input data to blob boundaries with 0x80 marker and zeros.
 * @param data Input data to pad
 * @param blobs_len Number of blobs the data should span
 * @returns Padded data aligned to blob boundaries
 */
function getPadded(data: Uint8Array, blobs_len: number): Uint8Array {
  const pData = new Uint8Array(blobs_len * BLOB_SIZE)
  pData.set(data)
  pData[data.byteLength] = 0x80
  return pData
}

/**
 * Converts arbitrary byte data into EIP-4844 blob format.
 * Splits data into 4096 field elements of 32 bytes each, with proper alignment.
 * @param data Input data (must be exactly BLOB_SIZE bytes)
 * @returns Hex-prefixed blob string
 */
function getBlob(data: Uint8Array): PrefixedHexString {
  const blob = new Uint8Array(BLOB_SIZE)
  for (let i = 0; i < FIELD_ELEMENTS_PER_BLOB; i++) {
    const chunk = new Uint8Array(32)
    chunk.set(data.subarray(i * 31, (i + 1) * 31), 0)
    blob.set(chunk, i * 32)
  }

  return bytesToHex(blob)
}

/**
 * EIP-4844: Converts UTF-8 string(s) into EIP-4844 blob format.
 *
 * Each input string is converted to UTF-8 bytes, padded with 0x80 followed by zeros
 * to align with blob boundaries, and encoded as one or more blobs depending on size.
 * Multiple inputs are processed sequentially, with each input contributing its own blob(s).
 *
 * @param input Single UTF-8 string or array of UTF-8 strings to encode
 * @throws Error with message 'invalid blob data' if any input string is empty
 * @throws Error with message 'blob data is too large' if any single input exceeds MAX_USEFUL_BYTES_PER_TX
 * @returns Array of hex-prefixed blob strings (0x...), one blob per 131,071 useful bytes per input
 */
export const getBlobs = (input: string | string[]) => {
  const inputArray = Array.isArray(input) ? input : [input]
  const blobs: PrefixedHexString[] = []

  for (const input of inputArray) {
    const data = utf8ToBytes(input)
    const len = data.byteLength
    if (len === 0) {
      throw Error('invalid blob data (0 bytes)')
    }
    if (len > MAX_BLOB_BYTES_PER_TX) {
      throw Error(`blob data is too large (${len} bytes > ${MAX_BLOB_BYTES_PER_TX} bytes)`)
    }

    const blobs_len = Math.ceil(len / BLOB_SIZE)

    const pData = getPadded(data, blobs_len)

    for (let i = 0; i < blobs_len; i++) {
      const chunk = pData.subarray(i * BLOB_SIZE, (i + 1) * BLOB_SIZE)
      const blob = getBlob(chunk)
      blobs.push(blob)
    }
  }

  return blobs
}

/**
 * EIP-4844: Computes KZG commitments for a set of blobs.
 * @param kzg KZG implementation used to compute commitments
 * @param blobs Array of blob data as hex-prefixed strings
 * @returns Array of lowercase hex-prefixed KZG commitments (one per blob)
 */
export const blobsToCommitments = (kzg: KZG, blobs: PrefixedHexString[]) => {
  const commitments: PrefixedHexString[] = []
  for (const blob of blobs) {
    commitments.push(kzg.blobToKzgCommitment(blob).toLowerCase() as PrefixedHexString)
  }
  return commitments
}

/**
 * EIP-4844: Computes KZG proofs for each blob/commitment pair.
 * @param kzg KZG implementation used to compute proofs
 * @param blobs Array of blob data as hex-prefixed strings
 * @param commitments Array of corresponding blob commitments
 * @returns Array of lowercase hex-prefixed proofs (aligned with input order)
 */
export const blobsToProofs = (
  kzg: KZG,
  blobs: PrefixedHexString[],
  commitments: PrefixedHexString[],
) => {
  const proofs = blobs.map((blob, ctx) =>
    kzg.computeBlobProof(blob, commitments[ctx]).toLowerCase(),
  ) as PrefixedHexString[]

  return proofs
}

/**
 * EIP-4844: Converts a vector commitment for a given data blob to its versioned hash.  For 4844, this version
 * number will be 0x01 for KZG vector commitments but could be different if future vector commitment
 * types are introduced
 * @param commitment a vector commitment to a blob
 * @param blobCommitmentVersion the version number corresponding to the type of vector commitment
 * @returns a versioned hash corresponding to a given blob vector commitment
 */
export const computeVersionedHash = (
  commitment: PrefixedHexString,
  blobCommitmentVersion: number,
) => {
  const computedVersionedHash = new Uint8Array(32)
  computedVersionedHash.set([blobCommitmentVersion], 0)
  computedVersionedHash.set(sha256(hexToBytes(commitment)).subarray(1), 1)
  return bytesToHex(computedVersionedHash)
}

/**
 * EIP-4844: Generate an array of versioned hashes from corresponding kzg commitments
 * @param commitments array of kzg commitments
 * @returns array of versioned hashes
 * Note: assumes KZG commitments (version 1 version hashes)
 */
export const commitmentsToVersionedHashes = (commitments: PrefixedHexString[]) => {
  const hashes: PrefixedHexString[] = []
  for (const commitment of commitments) {
    hashes.push(computeVersionedHash(commitment, 0x01))
  }
  return hashes
}

/**
 * EIP-7594: Expands blobs into their extended cells using the provided KZG implementation.
 * @param kzg KZG implementation capable of computing cells
 * @param blobs Array of blob data as hex-prefixed strings
 * @returns Tuple of [cells, indices], where cells are hex strings and indices are 0..127
 */
export const blobsToCells = (
  kzg: KZG,
  blobs: PrefixedHexString[],
): [PrefixedHexString[], number[]] => {
  const cells = blobs.reduce((acc, elem) => {
    return [...acc, ...(kzg.computeCells(elem) as PrefixedHexString[])]
  }, [] as PrefixedHexString[])
  const indices = Array.from({ length: CELLS_PER_EXT_BLOB }, (_, i) => i)

  return [cells, indices]
}

/**
 * EIP-7594: Computes extended cells and corresponding proofs for the given blobs.
 * @param kzg KZG implementation capable of computing cells and proofs
 * @param blobs Array of blob data as hex-prefixed strings
 * @returns Tuple of [cells, proofs, indices]; indices are 0..127
 */
export const blobsToCellsAndProofs = (
  kzg: KZG,
  blobs: PrefixedHexString[],
): [PrefixedHexString[], PrefixedHexString[], number[]] => {
  const blobsAndCells = blobs.reduce(
    ([cellsAcc, proofsAcc], elem) => {
      const blobCellsAndProofs = kzg.computeCellsAndProofs(elem) as [
        PrefixedHexString[],
        PrefixedHexString[],
      ]
      return [
        [...cellsAcc, ...blobCellsAndProofs[0]],
        [...proofsAcc, ...blobCellsAndProofs[1]],
      ]
    },
    [[] as PrefixedHexString[], [] as PrefixedHexString[]],
  )

  const indices = Array.from({ length: CELLS_PER_EXT_BLOB }, (_, i) => i)
  return [...blobsAndCells, indices] as [PrefixedHexString[], PrefixedHexString[], number[]]
}

/**
 * EIP-7594: Computes cell proofs for the given blobs.
 * @param kzg KZG implementation capable of computing cell proofs
 * @param blobs Array of blob data as hex-prefixed strings
 * @returns Array of lowercase hex-prefixed cell proofs (aligned with input order)
 */
export const blobsToCellProofs = (kzg: KZG, blobs: PrefixedHexString[]): PrefixedHexString[] => {
  return blobsToCellsAndProofs(kzg, blobs)[1] as PrefixedHexString[]
}
