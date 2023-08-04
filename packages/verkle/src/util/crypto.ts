import { type Address, concatBytes, setLengthLeft, toBytes, writeInt32LE } from '@ethereumjs/util'

import * as rustVerkleWasm from '../rust-verkle-wasm/rust_verkle_wasm.js'

import {
  BALANCE_LEAF_KEY,
  CODE_KECCAK_LEAF_KEY,
  CODE_OFFSET,
  CODE_SIZE_LEAF_KEY,
  NONCE_LEAF_KEY,
  VERKLE_NODE_WIDTH,
  VERSION_LEAF_KEY,
} from './constants.js'

export function pedersenHash(input: Uint8Array): Uint8Array {
  const pedersenHash = rustVerkleWasm.pedersen_hash(input)

  if (pedersenHash === null) {
    throw new Error(
      'pedersenHash: Wrong pedersenHash input. This might happen if length is not correct.'
    )
  }

  return pedersenHash
}

function getTreeKey(address: Address, treeIndex: number, subIndex: number): Uint8Array {
  const address32 = setLengthLeft(address.toBytes(), 32)

  const treeIndexB = writeInt32LE(treeIndex)

  const input = concatBytes(address32, treeIndexB)

  const treeKey = concatBytes(pedersenHash(input).slice(0, 31), toBytes(subIndex))

  return treeKey
}

export function getTreeKeyForVersion(address: Address) {
  return getTreeKey(address, 0, VERSION_LEAF_KEY)
}

export function getTreeKeyForBalance(address: Address) {
  return getTreeKey(address, 0, BALANCE_LEAF_KEY)
}

export function getTreeKeyForNonce(address: Address) {
  return getTreeKey(address, 0, NONCE_LEAF_KEY)
}

export function getTreeKeyForCodeHash(address: Address) {
  return getTreeKey(address, 0, CODE_KECCAK_LEAF_KEY)
}

export function getTreeKeyForCodeSize(address: Address) {
  return getTreeKey(address, 0, CODE_SIZE_LEAF_KEY)
}

export function getTreeKeyForCodeChunk(address: Address, chunkId: number) {
  return getTreeKey(
    address,
    Math.floor((CODE_OFFSET + chunkId) / VERKLE_NODE_WIDTH),
    (CODE_OFFSET + chunkId) % VERKLE_NODE_WIDTH
  )
}
