'use strict'

const EventEmitter = require('events')

/**
 * Base class for transport specific server implementations.
 * @memberof module:net/server
 */
class Server extends EventEmitter {
  get name () {
    return this.constructor.name
  }

  /**
   * Open server and get ready for new connections
   * @protected
   * @return {Promise} [description]
   */
  async open () {
    throw new Error('Unimplemented')
  }

  /**
   * Ban peer for a specified time
   * @protected
   * @param  {string} peerId id of peer
   * @param  {number} [maxAge] how long to ban peer
   * @return {Promise}
   */
  ban (peerId, maxAge) {
    // don't do anything by default
  }
}

module.exports = Server
