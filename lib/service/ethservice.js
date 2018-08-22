'use strict'

const Service = require('./service')
const { LesProtocol } = require('../net/protocol')
const { Chain } = require('../blockchain')
const { LightSynchronizer } = require('../sync')

const defaultOptions = {
  syncmode: 'light'
}

/**
 * Ethereum service
 * @memberof module:net/service
 */
class EthService extends Service {
  /**
   * Create new ETH service
   * @param {Object}   options constructor parameters
   * @param {Server[]} options.servers servers to run service on
   * @param {string}   [options.syncmode=light] synchronization mode ('fast' or 'light')
   * @param {Common}   [options.common] ethereum network name
   * @param {string}   [options.dataDir=./chaindata] data directory path
   * @param {Logger}   [options.logger] logger instance
   */
  constructor (options) {
    super(options)
    options = { ...defaultOptions, ...options, ...{logger: this.logger} }

    this.syncmode = options.syncmode
    this.chain = new Chain(options)
    if (this.syncmode === 'light') {
      this.logger.info('Light sync mode')
      this.synchronizer = new LightSynchronizer({
        logger: this.logger,
        pool: this.pool,
        chain: this.chain
      })
    } else {
      throw new Error(`Unsupported syncmode: ${this.syncmode}`)
    }
  }

  /**
   * Service name
   * @protected
   * @type {string}
   */
  get name () {
    return 'eth'
  }

  /**
   * Returns all protocols required by this service
   * @type {Protocol[]} required protocols
   */
  protocols () {
    if (this.syncmode === 'light') {
      return [ new LesProtocol({ chain: this.chain }) ]
    }
  }

  /**
   * Open eth service. Must be called before service is started
   * @return {Promise}
   */
  async open () {
    if (this.opened) {
      return false
    }
    super.open()
    this.pool.on('added', peer => {
      if (!peer.les.status.serveHeaders) {
        this.logger.debug(`Peer does not server headers: ${peer}`)
        this.pool.remove(peer)
      } else {
        this.logger.info(`Found peer: ${peer}`)
      }
    })
  }

  /**
   * Starts service and ensures blockchain is synchronized. Returns a promise
   * that resolves once the service is started and blockchain is in sync.
   * @return {Promise}
   */
  async start () {
    if (this.started) {
      return false
    }
    await super.start()
    await this.chain.open()
    await this.synchronizer.start()
  }

  /**
   * Stop service. Interrupts blockchain synchronization if its in progress.
   * @return {Promise}
   */
  async stop () {
    if (!this.started) {
      return false
    }
    await this.synchronizer.stop()
    await super.stop()
  }
}

module.exports = EthService
