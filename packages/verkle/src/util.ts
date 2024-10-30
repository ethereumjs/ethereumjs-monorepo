import { bytesToHex, concatBytes, equalsBytes } from '@ethereumjs/util'

import { LeafVerkleNode, LeafVerkleNodeValue, decodeVerkleNode } from './node/index.js'

import type { VerkleTree } from './verkleTree.js'
import type { PrefixedHexString } from '@ethereumjs/util'

export const dumpLeafValues = async (
  tree: VerkleTree,
  startingNode: Uint8Array,
): Promise<[PrefixedHexString, PrefixedHexString][] | undefined> => {
  if (equalsBytes(startingNode, tree.EMPTY_TREE_ROOT) === true) return
  // Retrieve starting node from DB
  const rawNode = await tree['_db'].get(startingNode)
  if (rawNode === undefined) return
  const node = decodeVerkleNode(rawNode, tree['verkleCrypto'])
  const entries: [PrefixedHexString, PrefixedHexString][] = []
  if (node instanceof LeafVerkleNode) {
    for (const [idx, val] of node.values.entries()) {
      if (val !== LeafVerkleNodeValue.Untouched) {
        entries.push([
          bytesToHex(concatBytes(node.stem, Uint8Array.from([idx]))),
          bytesToHex(val === LeafVerkleNodeValue.Deleted ? new Uint8Array(32) : val),
        ])
      }
    }
    return entries
  } else {
    const childPaths = node.children
      .filter((value) => value !== null)
      .map((value) => dumpLeafValues(tree, tree['verkleCrypto'].hashCommitment(value.commitment)))

    const res = (await Promise.all(childPaths)).filter((val) => val !== undefined)
    return res.flat(1) as [PrefixedHexString, PrefixedHexString][]
  }
}
