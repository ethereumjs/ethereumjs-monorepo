'use strict'

const Handler = require('./handler')

/**
 * ETH protocol handler
 * @memberof module:handler
 */
class EthHandler extends Handler {
  /**
   * Create new handler
   * @param {Object}      options constructor parameters
   * @param {PeerPool}    options.pool peer pool
   * @param {Chain}       options.chain blockchain
   * @param {Logger}      [options.logger] Logger instance
   */
  constructor (options) {
    super(options)

    this.pool = options.pool
    this.chain = options.chain
    this.init()
  }

  init () {
    this.pool.on('message:eth', (message, peer) => this.handle(message, peer))
  }

  /**
   * Handles incoming ETH request from connected peer
   * @param  {Object}  message message object
   * @param  {Peer}    peer peer
   * @return {Promise}
   */
  async handle (message, peer) {
    try {
      if (!this.chain.opened) {
        await this.chain.open()
      }

      if (message.name === 'GetBlockHeaders') {
        const { block, max, skip, reverse } = message.data
        const headers = await this.chain.getHeaders(block, max, skip, reverse)
        peer.eth.send('BlockHeaders', headers)
      }
    } catch (error) {
      this.emit('error', error)
    }
  }
}

module.exports = EthHandler
