import { RLP } from '@ethereumjs/rlp'
import { bytesToHex, equalsBytes } from '@ethereumjs/util'

import { BranchMPTNode } from '../node/branch.ts'
import { ExtensionMPTNode } from '../node/extension.ts'

import type { MerklePatriciaTrie } from '../mpt.ts'
import type { MPTNode } from '../types.ts'

export type NodeFilter = (node: MPTNode, key: number[]) => Promise<boolean>
export type OnFound = (node: MPTNode, key: number[]) => Promise<void>

/**
 * Walk MerklePatriciaTrie via async generator
 * @param nodeHash - The root key to walk on.
 * @param currentKey - The current (partial) key.
 * @param onFound - Called on every node found (before filter)
 * @param filter - Filter nodes yielded by the generator.
 * @param visited - Set of visited nodes
 * @returns AsyncIterable<{ node: MPTNode; currentKey: number[] }>
 * Iterate through nodes with
 * `for await (const { node, currentKey } of trie._walkTrie(root)) { ... }`
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
    const node = await this.lookupNode(nodeHash)
    if (node === undefined) {
      return
    }
    const nodeHashHex = bytesToHex(this.hash(node.serialize()))
    if (visited.has(nodeHashHex)) {
      return
    }
    visited.add(nodeHashHex)
    await onFound(node, currentKey)
    if (await filter(node, currentKey)) {
      yield { node, currentKey }
    }
    if (node instanceof BranchMPTNode) {
      for (const [nibble, childNode] of node._branches.entries()) {
        if (childNode === null) {
          continue
        }
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
  } catch {
    return
  }
}
