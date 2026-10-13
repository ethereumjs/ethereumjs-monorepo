import { EthereumJSErrorWithoutCode, equalsBytes } from '@ethereumjs/util'

import { createBinaryTree } from './constructors.ts'
import { decodeBinaryNode } from './node/index.ts'

import type { BinaryTree } from './binaryTree.ts'
import type { BinaryNode } from './node/index.ts'
import type { StemBinaryNode } from './node/stemNode.ts'

/**
 * Load proof nodes into a new binary tree and set its root.
 *
 * @param proof Serialized binary tree nodes along a key path
 */
export async function binaryTreeFromProof(proof: Uint8Array[]): Promise<BinaryTree> {
  const proofTrie = await createBinaryTree()
  const putStack: [Uint8Array, BinaryNode][] = proof.map((bytes) => {
    const node = decodeBinaryNode(bytes)
    return [proofTrie['merkelize'](node), node]
  })
  await proofTrie.saveStack(putStack)
  const root = putStack[0][0]
  proofTrie.root(root)
  return proofTrie
}

/**
 * Verify a binary tree proof for `key` against `rootHash`.
 *
 * @param rootHash Expected tree root
 * @param key Full 32-byte key (stem + suffix)
 * @param proof Serialized nodes along the key path
 * @throws If the proof is invalid
 * @returns Proven value, or `null` for a valid non-existence proof
 */
export async function verifyBinaryProof(
  rootHash: Uint8Array,
  key: Uint8Array,
  proof: Uint8Array[],
): Promise<Uint8Array | null> {
  const proofTrie = await binaryTreeFromProof(proof)
  if (!equalsBytes(proofTrie.root(), rootHash)) {
    throw EthereumJSErrorWithoutCode('rootHash does not match proof root')
  }
  const [value] = await proofTrie.get(key.slice(0, 31), [key[31]])
  const valueNode = decodeBinaryNode(proof[proof.length - 1]) as StemBinaryNode
  const expectedValue = valueNode.values[key[31]]
  if (!expectedValue) {
    if (value) {
      throw EthereumJSErrorWithoutCode('Proof is invalid')
    }
  } else if (value && !equalsBytes(value, expectedValue)) {
    throw EthereumJSErrorWithoutCode('Proof is invalid')
  }
  return value
}
