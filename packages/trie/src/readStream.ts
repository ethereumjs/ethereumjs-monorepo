import { nibblesToBuffer } from './util/nibbles.js'
import { Trie as BaseTrie } from './baseTrie.js'

import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const Readable = require('readable-stream')

export class TrieReadStream extends Readable.Readable {
  private trie: BaseTrie
  private _started: boolean

  constructor(trie: BaseTrie) {
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
      await this.trie._findValueNodes(async (nodeRef, node, key, walkController) => {
        if (node !== null) {
          this.push({
            key: nibblesToBuffer(key),
            value: node.value,
          })
          walkController.allChildren(node, key)
        }
      })
    } catch (error: any) {
      if (error.message == 'Missing node in DB') {
        // pass
      } else {
        throw error
      }
    }
    this.push(null)
  }
}
