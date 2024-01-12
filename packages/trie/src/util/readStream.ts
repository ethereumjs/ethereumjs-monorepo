// eslint-disable-next-line implicit-dependencies/no-implicit
import { ReadableStream } from 'node:stream/web'

import { BranchNode, LeafNode } from '../node/index.js'

import { nibblestoBytes } from './nibbles.js'

import type { Trie } from '../trie.js'
import type { FoundNodeFunction } from '../types.js'

export function TrieReadStream(trie: Trie) {
  const _findValueNodes = async (onFound: FoundNodeFunction): Promise<void> => {
    const outerOnFound: FoundNodeFunction = async (nodeRef, node, key, walkController) => {
      let fullKey = key
      if (node instanceof LeafNode) {
        fullKey = key.concat(node.key())
        // found leaf node!
        onFound(nodeRef, node, fullKey, walkController)
      } else if (node instanceof BranchNode && node.value()) {
        // found branch with value
        onFound(nodeRef, node, fullKey, walkController)
      } else {
        // keep looking for value nodes
        if (node !== null) {
          walkController.allChildren(node, key)
        }
      }
    }
    await trie.walkTrie(trie.root(), outerOnFound)
  }

  return new ReadableStream({
    async start(controller) {
      try {
        await _findValueNodes(async (_, node, key, walkController) => {
          if (node !== null) {
            controller.enqueue({
              key: nibblestoBytes(key),
              value: node.value(),
            })
            walkController.allChildren(node, key)
          }
        })
      } catch (error: any) {
        if (error.message === 'Missing node in DB') {
          // pass
        } else {
          throw error
        }
      }
      controller.close()
    },
  })
}
