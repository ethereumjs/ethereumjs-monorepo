import { RLP } from '@ethereumjs/rlp'
import { bytesToHex, equalsBytes } from '@ethereumjs/util'

import { BranchMPTNode } from '../node/branch.ts'
import { ExtensionMPTNode } from '../node/extension.ts'

import type { MerklePatriciaTrie } from '../mpt.ts'
import type { MPTNode } from '../types.ts'

/** Async filter applied during {@link _walkTrie} iteration. */
export type NodeFilter = (node: MPTNode, key: number[]) => Promise<boolean>

/** Callback invoked for each node during {@link _walkTrie} before filtering. */
export type OnFound = (node: MPTNode, key: number[]) => Promise<unknown>

/**
 * Depth-first async generator over trie nodes.
 *
 * @param nodeHash Root hash to start from
 * @param currentKey Nibble path accumulated so far
 * @param onFound Called on every visited node (before the filter)
 * @param filter When it returns `false`, the node is not yielded
 * @param visited Set of visited node hashes (cycle guard)
 */
export async function* _walkTrie(
  this: MerklePatriciaTrie,
  nodeHash: Uint8Array,
  currentKey: number[] = [],
  onFound: OnFound = async (_trieNode: MPTNode, _key: number[]) => {},
  filter: NodeFilter = async (_trieNode: MPTNode, _key: number[]) => true,
  visited: Set<string> = new Set<string>(),
): AsyncIterable<{ node: MPTNode; currentKey: number[] }> {
  if (equalsBytes(nodeHash, this.EMPTY_TRIE_ROOT)) {
    return
  }
  try {
    const nodeHashHex = bytesToHex(nodeHash)
    if (visited.has(nodeHashHex)) {
      return
    }
    const node = await this.lookupNode(nodeHash)
    visited.add(nodeHashHex)
    await onFound(node, currentKey)
    if (await filter(node, currentKey)) {
      yield { node, currentKey }
    }
    if (node instanceof BranchMPTNode) {
      for (const [nibble, childNode] of node.getChildren()) {
        const nextKey = [...currentKey, nibble]
        const _childNode: Uint8Array =
          childNode instanceof Uint8Array ? childNode : this.hash(RLP.encode(childNode))
        yield* _walkTrie.call(this, _childNode, nextKey, onFound, filter, visited)
      }
    } else if (node instanceof ExtensionMPTNode) {
      const childNode = node.value()
      const nextKey = [...currentKey, ...node._nibbles]
      yield* _walkTrie.call(this, childNode, nextKey, onFound, filter, visited)
    }
  } catch (error: any) {
    if (error.message !== 'Missing node in DB') {
      throw error
    }
  }
}
