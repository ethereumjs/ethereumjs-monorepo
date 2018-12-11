'use strict'

const Handler = require('./handler')

/**
 * ETH protocol handler
 * @memberof module:handler
 */
class EthHandler extends Handler {
  /**
   * Message event to listen for
   * @return {string} name of message event
   */
  get event () {
    return 'message:eth'
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
      } else if (message.name === 'GetBlockBodies') {
        const hashes = message.data
        const blocks = await Promise.all(hashes.map(hash => this.chain.getBlock(hash)))
        const bodies = blocks.map(block => block.raw.slice(1))
        peer.eth.send('BlockBodies', bodies)
      }
    } catch (error) {
      this.emit('error', error)
    }
  }
}

module.exports = EthHandler
