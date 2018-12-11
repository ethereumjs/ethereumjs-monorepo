const { Readable } = require('readable-stream')

// ScratchReadStream
// this is used to minimally dump the scratch into the db
module.exports = class ScratchReadStream extends Readable {
  constructor (trie) {
    super({ objectMode: true })

    this.trie = trie
    this.next = null
  }

  _read () {
    if (!this._started) {
      this._started = true
      this.trie._findDbNodes((nodeRef, node, key, next) => {
        this.push({
          key: nodeRef,
          value: node.serialize()
        })

        next()
      }, () => {
        // close stream
        this.push(null)
      })
    }
  }
}
