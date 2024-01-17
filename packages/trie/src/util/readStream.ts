// eslint-disable-next-line implicit-dependencies/no-implicit
import { ReadableStream } from 'node:stream/web'
import { Readable } from 'readable-stream'

import { BranchNode, LeafNode } from '../node/index.js'

import { nibblestoBytes } from './nibbles.js'

import type { Trie } from '../trie.js'
import type { FoundNodeFunction } from '../types.js'

const _findValueNodes = async (trie: Trie, onFound: FoundNodeFunction): Promise<void> => {
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

export class TrieReadStream extends Readable {
  private trie: Trie
  private _started: boolean

  constructor(trie: Trie) {
    super({ objectMode: true })

    this.trie = trie
    this._started = false
  }

  async _read() {
    if (this._started) {
      return
    }
    this._started = true
    try {
      await _findValueNodes(this.trie, async (_, node, key, walkController) => {
        if (node !== null) {
          this.push({
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
    this.push(null)
  }
}

export function asyncTrieReadStream(trie: Trie) {
  return new ReadableStream({
    async start(controller) {
      try {
        await _findValueNodes(trie, async (_, node, key, walkController) => {
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
