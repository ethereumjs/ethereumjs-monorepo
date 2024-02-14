import {
  type Address,
  bigIntToBytes,
  bytesToHex,
  concatBytes,
  int32ToBytes,
  setLengthLeft,
  setLengthRight,
} from '@ethereumjs/util'
import { pedersen_hash, verify_update } from 'rust-verkle-wasm'

import type { Point } from '../types.js'

export function pedersenHash(input: Uint8Array): Uint8Array {
  const pedersenHash = pedersen_hash(input)

  if (pedersenHash === null) {
    throw new Error(
      `pedersenHash: Wrong pedersenHash input: ${bytesToHex(
        input
      )}. This might happen if length is not correct.`
    )
  }

  return pedersenHash
}

export function verifyUpdate(
  root: Uint8Array,
  proof: Uint8Array,
  keyValues: Map<any, any>
): Uint8Array {
  return verify_update(root, proof, keyValues)
}

/**
 * @dev Returns the 31-bytes verkle tree stem for a given address and tree index.
 * @dev Assumes that the verkle node width = 256
 * @param address The address to generate the tree key for.
 * @param treeIndex The index of the tree to generate the key for. Defaults to 0.
 * @return The 31-bytes verkle tree stem as a Uint8Array.
 */
export function getStem(address: Address, treeIndex: number | bigint = 0): Uint8Array {
  const address32 = setLengthLeft(address.toBytes(), 32)

  let treeIndexBytes: Uint8Array
  if (typeof treeIndex === 'number') {
    treeIndexBytes = setLengthRight(int32ToBytes(Number(treeIndex), true), 32)
  } else {
    treeIndexBytes = setLengthRight(bigIntToBytes(BigInt(treeIndex), true).slice(0, 32), 32)
  }

  const input = concatBytes(address32, treeIndexBytes)
  const treeStem = pedersenHash(input).slice(0, 31)

  return treeStem
}

/**
 * @dev Returns the tree key for a given verkle tree stem, and sub index.
 * @dev Assumes that the verkle node width = 256
 * @param stem The 31-bytes verkle tree stem as a Uint8Array.
 * @param subIndex The sub index of the tree to generate the key for as a Uint8Array.
 * @return The tree key as a Uint8Array.
 */

export function getKey(stem: Uint8Array, subIndex: Uint8Array): Uint8Array {
  const treeKey = concatBytes(stem, subIndex)
  return treeKey
}

export function verifyProof(
  root: Uint8Array,
  proof: Uint8Array,
  keyValues: Map<any, any>
): Uint8Array {
  return verify_update(root, proof, keyValues)
}

// TODO: Replace this by the actual value of Point().Identity() from the Go code.
export const POINT_IDENTITY = new Uint8Array(32).fill(0) as unknown as Point
