const { middleware } = require('../validation')
const { addHexPrefix } = require('ethereumjs-util')

class Net {
  constructor (node) {
    const service = node.services.find(s => s.name === 'eth')
    this._chain = service.chain
    this._node = node
    this._peerPool = service.pool

    this.version = middleware(this.version.bind(this), 0, [])
    this.listening = middleware(this.listening.bind(this), 0, [])
    this.peerCount = middleware(this.peerCount.bind(this), 0, [])
  }

  version (params, cb) {
    cb(null, `${this._node.common.chainId()}`)
  }

  listening (params, cb) {
    cb(null, this._node.opened)
  }

  peerCount (params, cb) {
    cb(null, addHexPrefix(this._peerPool.peers.length.toString(16)))
  }
}

module.exports = Net
