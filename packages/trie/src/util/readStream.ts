import { pipeline, Readable, Writable } from 'stream'

import { BranchNode, LeafNode } from '../node/index.js'

import { nibblestoBytes } from './nibbles.js'

import type { Trie } from '../trie.js'
import type { FoundNodeFunction } from '../types.js'

async function* asyncGenerator(trie: Trie, f: FoundNodeFunction) {
  try {
    for await (const chunk of _findValueNodes(trie, f)) {
      yield chunk
    }
  } catch (error: any) {
    if (error.message === 'Missing node in DB') {
      // pass
    } else {
      throw error
    }
  }
}

const _findValueNodes = async function* (trie: Trie, onFound: FoundNodeFunction) {
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
  private asyncIterator
  private _started: boolean

  constructor(trie: Trie, asyncIterable: AsyncIterable<BranchNode | LeafNode>) {
    super({ objectMode: true })

    this.trie = trie
    this.asyncIterator = asyncIterable[Symbol.asyncIterator]()
    this._started = false
  }

  async _read() {
    if (this._started) {
      return
    }
    this._started = true
    try {
      const { value, done } = await this.asyncIterator.next()
      this.push(value)
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

// Transform stream to convert writable stream to async iterable
class WritableToAsyncIterable extends Writable {
  public data: []

  constructor() {
    super({ objectMode: true })
    this.data = []
  }

  // @ts-ignore
  _write(chunk, encoding, callback) {
    // @ts-ignore
    this.data.push(chunk)
    callback()
  }

  async *[Symbol.asyncIterator]() {
    for (const item of this.data) {
      yield item
    }
  }
}

export async function asyncTrieReadStream(
  trie: Trie
): Promise<AsyncIterable<BranchNode | LeafNode>> {
  const sourceStream = new TrieReadStream(
    trie,
    asyncGenerator(trie, async function* (_, node, key, walkController) {
      if (node !== null) {
        yield {
          key: nibblestoBytes(key),
          value: node.value(),
        }
        walkController.allChildren(node, key)
      }
    })
  )
  const destinationStream = new WritableToAsyncIterable()

  await pipeline(sourceStream, destinationStream, (err: any) => {
    if (err) {
      console.error('Pipeline failed.', err)
    } else {
      console.log('Pipeline succeeded.')
    }
  })

  return destinationStream
}
