import { EthereumJSErrorWithoutCode, equalsBytes } from '@ethereumjs/util'

import { createBinaryTree } from './constructors.ts'
import { decodeBinaryNode } from './node/index.ts'

import type { BinaryTree } from './binaryTree.ts'
import type { BinaryNode } from './node/index.ts'
import type { StemBinaryNode } from './node/stemNode.ts'

/**
 * Saves the nodes from a proof into the tree.
 * @param proof
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
 * Verifies a proof.
 * @param rootHash
 * @param key
 * @param proof
 * @throws If proof is found to be invalid.
 * @returns The value from the key, or null if valid proof of non-existence.
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
