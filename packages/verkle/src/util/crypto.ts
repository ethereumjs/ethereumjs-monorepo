import { type Address, concatBytes, setLengthLeft, toBytes, writeInt32LE } from '@ethereumjs/util'

import * as rustVerkleWasm from '../rust-verkle-wasm/rust_verkle_wasm.js'

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

  const treeIndexB = writeInt32LE(treeIndex)

  const input = concatBytes(address32, treeIndexB)

  const treeKey = concatBytes(pedersenHash(input).slice(0, 31), toBytes(subIndex))

  return treeKey
}
