import { nibblesToBuffer } from './util/nibbles'
import { Trie as BaseTrie } from './baseTrie'
import { TrieNode } from './trieNode'
const Readable = require('readable-stream').Readable

export class TrieReadStream extends Readable {
  private trie: BaseTrie
  private _started: boolean

  constructor(trie: BaseTrie) {
    super({ objectMode: true })

    this.trie = trie
    this._started = false
  }

  async _read() {
    if (!this._started) {
      this._started = true
      await this.trie._findValueNodes((nodeRef, node, key, next) => {
        this.push({
          key: nibblesToBuffer(key),
          value: node.value,
        })
        next()
      })
      this.push(null)
    }
  }
}
