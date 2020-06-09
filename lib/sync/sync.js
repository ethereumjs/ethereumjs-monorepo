'use strict'

const Common = require('ethereumjs-common').default
const EventEmitter = require('events')
const { defaultLogger } = require('../logging')

const defaultOptions = {
  common: new Common('mainnet', 'chainstart'),
  logger: defaultLogger,
  interval: 1000,
  minPeers: 3
}

/**
 * Base class for blockchain synchronizers
 * @memberof module:sync
 */
class Synchronizer extends EventEmitter {
  /**
   * Create new node
   * @param {Object}      options constructor parameters
   * @param {PeerPool}    options.pool peer pool
   * @param {Chain}       options.chain blockchain
   * @param {Common}      options.common common chain config
   * @param {FlowControl} options.flow flow control manager
   * @param {number}      [options.minPeers=3] number of peers needed before syncing
   * @param {number}      [options.interval] refresh interval
   * @param {Logger}      [options.logger] Logger instance
   */
  constructor (options) {
    super()
    options = { ...defaultOptions, ...options }

    this.logger = options.logger
    this.pool = options.pool
    this.chain = options.chain
    this.common = options.common
    this.flow = options.flow
    this.minPeers = options.minPeers
    this.interval = options.interval
    this.running = false
    this.forceSync = false
    this.pool.on('added', peer => {
      if (this.syncable(peer)) {
        this.logger.debug(`Found ${this.type} peer: ${peer}`)
      }
    })
  }

  /**
   * Returns synchronizer type
   * @return {string} type
   */
  get type () {
  }

  /**
   * Open synchronizer. Must be called before sync() is called
   * @return {Promise}
   */
  async open () {
  }

  /**
   * Returns true if peer can be used for syncing
   * @return {boolean}
   */
  syncable (peer) {
    return true
  }

  /**
   * Start synchronization
   * @return {Promise}
   */
  async start () {
    if (this.running) {
      return false
    }
    this.running = true
    const timeout = setTimeout(() => { this.forceSync = true }, this.interval * 30)
    while (this.running) {
      try {
        if (await this.sync()) this.emit('synchronized')
      } catch (error) {
        if (this.running) this.emit('error', error)
      }
      await new Promise(resolve => setTimeout(resolve, this.interval))
    }
    this.running = false
    clearTimeout(timeout)
  }

  /**
   * Stop synchronization. Returns a promise that resolves once its stopped.
   * @return {Promise}
   */
  async stop () {
    if (!this.running) {
      return false
    }
    await new Promise(resolve => setTimeout(resolve, this.interval))
    this.running = false
  }
}

module.exports = Synchronizer
