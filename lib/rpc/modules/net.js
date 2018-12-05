'use strict'

const { middleware } = require('../validation')
const { addHexPrefix } = require('ethereumjs-util')

/**
 * net_* RPC module
 * @memberof module:rpc/modules
 */
class Net {
  /**
   * Create net_* RPC module
   * @param {Node} Node to which the module binds
   */
  constructor (node) {
    const service = node.services.find(s => s.name === 'eth')
    this._chain = service.chain
    this._node = node
    this._peerPool = service.pool

    this.version = middleware(this.version.bind(this), 0, [])
    this.listening = middleware(this.listening.bind(this), 0, [])
    this.peerCount = middleware(this.peerCount.bind(this), 0, [])
  }

  /**
   * Returns the current network id
   * @param  {Array<>} [params] An empty array
   * @param  {Function} [cb] A function with an error object as the first argument and the network
   * id as the second argument
   */
  version (params, cb) {
    cb(null, `${this._node.common.chainId()}`)
  }

  /**
   * Returns true if client is actively listening for network connections
   * @param  {Array<>} [params] An empty array
   * @param  {Function} [cb] A function with an error object as the first argument and a boolean
   * that's true when the client is listening and false when it's not as the second argument
   */
  listening (params, cb) {
    cb(null, this._node.opened)
  }

  /**
   * Returns number of peers currently connected to the client
   * @param  {Array<>} [params] An empty array
   * @param  {Function} [cb] A function with an error object as the first argument and the
   * number of peers connected to the client as the second argument
   */
  peerCount (params, cb) {
    cb(null, addHexPrefix(this._peerPool.peers.length.toString(16)))
  }
}

module.exports = Net
