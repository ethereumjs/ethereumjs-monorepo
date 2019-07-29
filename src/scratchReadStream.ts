//import { Readable } from 'readable-stream'
import { Trie as BaseTrie } from './baseTrie'
import { TrieNode } from './trieNode'
const Readable = require('readable-stream').Readable

/*
 * This is used to minimally dump the scratch into the db.
 */
export class ScratchReadStream extends Readable {
  private trie: BaseTrie
  private _started: boolean

  constructor(trie: BaseTrie) {
    super({ objectMode: true })

    this.trie = trie
    this._started = false
  }

  _read() {
    if (!this._started) {
      this._started = true
      this.trie._findDbNodes(
        (nodeRef: Buffer, node: TrieNode, key: number[], next: Function) => {
          this.push({
            key: nodeRef,
            value: node.serialize(),
          })

          next()
        },
        () => {
          // close stream
          this.push(null)
        },
      )
    }
  }
}
