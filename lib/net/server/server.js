'use strict'

const EventEmitter = require('events')
const { defaultLogger } = require('../../logging')

const defaultOptions = {
  logger: defaultLogger,
  maxPeers: 25,
  refreshInterval: 30000
}

/**
 * Base class for transport specific server implementations.
 * @memberof module:net/server
 */
class Server extends EventEmitter {
  constructor (options) {
    super()
    options = { ...defaultOptions, ...options }

    this.logger = options.logger
    this.maxPeers = options.maxPeers
    this.refreshInterval = options.refreshInterval
    this.protocols = new Set()
    this.started = false
  }

  get name () {
    return this.constructor.name
  }

  /**
   * Check if server is running
   * @return {boolean} true if server is running
   */
  get running () {
    return this.started
  }

  /**
   * Start server. Returns a promise that resolves once server has been started.
   * @return {Promise}
   */
  async start () {
    if (this.started) {
      return
    }
    const protocols = Array.from(this.protocols)
    await Promise.all(protocols.map(p => p.open()))
    this.started = true
    this.logger.info(`Started ${this.name} server.`)
  }

  /**
   * Stop server. Returns a promise that resolves once server has been stopped.
   * @return {Promise}
   */
  async stop () {
    this.started = false
    this.logger.info(`Stopped ${this.name} server.`)
  }

  /**
   * Specify which protocols the server must support
   * @param {Protocol[]} protocols protocol classes
   */
  addProtocols (protocols) {
    if (this.started) {
      this.logger.error('Cannot require protocols after server has been started')
      return false
    }
    protocols.forEach(p => this.protocols.add(p))
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
