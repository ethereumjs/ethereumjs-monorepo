const Readable = require('readable-stream').Readable
const { nibblesToBuffer } = require('./util/nibbles')

module.exports = class TrieReadStream extends Readable {
  constructor (trie) {
    super({ objectMode: true })

    this.trie = trie
    this.next = null
  }

  _read () {
    if (!this._started) {
      this._started = true
      this.trie._findValueNodes((nodeRef, node, key, next) => {
        this.push({
          key: nibblesToBuffer(key),
          value: node.value
        })

        next()
      }, () => {
        // close stream
        this.push(null)
      })
    }
  }
}
