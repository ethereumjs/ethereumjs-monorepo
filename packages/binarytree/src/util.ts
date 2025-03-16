import { type PrefixedHexString, bytesToHex, concatBytes, equalsBytes } from '@ethereumjs/util'

import { InternalBinaryNode } from './node/internalNode.ts'
import { StemBinaryNode } from './node/stemNode.ts'
import { decodeBinaryNode } from './node/util.ts'

import type { BinaryTree } from './binaryTree.ts'
import type { ChildBinaryNode } from './node/types.ts'

/**
 * Recursively walks down the tree from a given starting node and returns all the leaf values
 * @param tree - The binary tree
 * @param startingNode - The starting node
 * @returns An array of key-value pairs containing the tree keys and associated values
 */
export const dumpLeafValues = async (
  tree: BinaryTree,
  startingNode: Uint8Array,
): Promise<[PrefixedHexString, PrefixedHexString][] | undefined> => {
  if (equalsBytes(startingNode, tree.EMPTY_TREE_ROOT) === true) return
  // Retrieve starting node from DB
  const rawNode = await tree['_db'].get(startingNode)
  if (rawNode === undefined) return
  const node = decodeBinaryNode(rawNode)
  const entries: [PrefixedHexString, PrefixedHexString][] = []
  if (node instanceof StemBinaryNode) {
    for (const [idx, val] of node.values.entries()) {
      if (val !== null) {
        entries.push([bytesToHex(concatBytes(node.stem, Uint8Array.from([idx]))), bytesToHex(val)])
      }
    }
    return entries
  } else {
    const childPaths = node.children
      .filter((value) => value !== null)
      .map((value) => dumpLeafValues(tree, value!.hash))

    const res = (await Promise.all(childPaths)).filter((val) => val !== undefined)
    return res.flat(1) as [PrefixedHexString, PrefixedHexString][]
  }
}
/**
 * Recursively walks down the tree from a given starting node and returns all the node paths and hashes
 * @param tree - The binary tree
 * @param startingNode - The starting node
 * @returns An array of key-value pairs containing the tree paths and associated hashes
 */
export const dumpNodeHashes = async (
  tree: BinaryTree,
  startingNode: Uint8Array,
): Promise<[string, PrefixedHexString][] | undefined> => {
  let entries: [string, PrefixedHexString][] = []
  // Retrieve starting node from DB
  const rawNode = await tree['_db'].get(startingNode)
  if (rawNode === undefined) return

  const node = decodeBinaryNode(rawNode)
  // If current node is root, push '0x' for path and node hash for commitment
  equalsBytes(startingNode, tree.root()) && entries.push(['0x', bytesToHex(startingNode)])
  if (node instanceof InternalBinaryNode) {
    const children = node.children.filter((value) => value !== null) as ChildBinaryNode[]

    // Push non-null children paths and hashes
    for (const child of children) {
      entries.push([child.path.join(''), bytesToHex(child.hash)])
    }

    // Recursively call dumpNodeHashes on each child node
    const childPaths = (
      await Promise.all(children.map((value) => dumpNodeHashes(tree, value.hash)))
    )
      .filter((val) => val !== undefined)
      .flat(1)

    // Add all child paths and hashes to entries
    entries = [...entries, ...childPaths] as [string, PrefixedHexString][]
  }

  return entries
}
