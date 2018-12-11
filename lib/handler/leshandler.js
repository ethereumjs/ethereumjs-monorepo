'use strict'

const Handler = require('./handler')

/**
 * LES protocol handler
 * @memberof module:handler
 */
class LesHandler extends Handler {
  /**
   * Create new handler
   * @param {Object}      options constructor parameters
   * @param {PeerPool}    options.pool peer pool
   * @param {Chain}       options.chain blockchain
   * @param {FlowControl} options.flow flow control manager
   * @param {Logger}      [options.logger] Logger instance
   */
  constructor (options) {
    super(options)
    this.flow = options.flow
  }

  /**
   * Message event to listen for
   * @return {string} name of message event
   */
  get event () {
    return 'message:les'
  }

  /**
   * Handles incoming LES requests from connected peer
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
        const { reqId, block, max, skip, reverse } = message.data
        const bv = this.flow.handleRequest(peer, message.name, max)
        if (bv < 0) {
          this.pool.ban(peer, 300000)
          this.logger.debug(`Dropping peer for violating flow control ${peer}`)
        } else {
          const headers = await this.chain.getHeaders(block, max, skip, reverse)
          peer.les.send('BlockHeaders', { reqId, bv, headers })
        }
      }
    } catch (error) {
      this.emit('error', error)
    }
  }
}

module.exports = LesHandler
