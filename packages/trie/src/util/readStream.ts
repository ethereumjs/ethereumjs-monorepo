import { nibblesToBuffer } from '../util/nibbles'
import { Trie } from '../trie'
import { Readable } from 'readable-stream'

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
