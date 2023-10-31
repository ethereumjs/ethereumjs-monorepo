import { type Address, concatBytes, int32ToBytes, setLengthLeft, toBytes } from '@ethereumjs/util'

import * as rustVerkleWasm from '../rust-verkle-wasm/rust_verkle_wasm.js'

import type { Point } from '../types.js'

export function pedersenHash(input: Uint8Array): Uint8Array {
  const pedersenHash = rustVerkleWasm.pedersen_hash(input)

  if (pedersenHash === null) {
    throw new Error(
      'pedersenHash: Wrong pedersenHash input. This might happen if length is not correct.'
    )
  }

  return pedersenHash
}

/**
 * @dev Returns the tree key for a given address, tree index, and sub index.
 * @dev Assumes that the verkle node width = 256
 * @param address The address to generate the tree key for.
 * @param treeIndex The index of the tree to generate the key for.
 * @param subIndex The sub index of the tree to generate the key for.
 * @return The tree key as a Uint8Array.
 */
export function getTreeKey(address: Address, treeIndex: number, subIndex: number): Uint8Array {
  const address32 = setLengthLeft(address.toBytes(), 32)

  const treeIndexB = int32ToBytes(treeIndex, true)

  const input = concatBytes(address32, treeIndexB)

  const treeKey = concatBytes(pedersenHash(input).slice(0, 31), toBytes(subIndex))

  return treeKey
}

// TODO: Replace this by the actual value of Point().Identity() from the Go code.
export const POINT_IDENTITY = new Uint8Array(32).fill(0) as unknown as Point
