const { middleware } = require('../validation')

class Net {
  constructor (node) {
    const service = node.services.find(s => s.name === 'eth')
    this._chain = service.chain
    this._node = node

    this.version = middleware(this.version.bind(this), 0, [])
    this.listening = middleware(this.listening.bind(this), 0, [])
  }

  version (params, cb) {
    cb(null, `${this._node.common.chainId()}`)
  }

  listening (params, cb) {
    cb(null, this._node.opened)
  }
}

module.exports = Net
