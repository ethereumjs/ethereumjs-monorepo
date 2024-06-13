import {
  type Address,
  bigIntToBytes,
  bytesToHex,
  int32ToBytes,
  setLengthLeft,
  setLengthRight,
} from '@ethereumjs/util'

import type { VerkleExecutionWitness } from '@ethereumjs/block'
import type { VerkleCrypto } from 'verkle-cryptography-wasm'

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

export const POINT_IDENTITY = new Uint8Array(0)
