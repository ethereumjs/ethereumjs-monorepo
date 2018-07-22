'use strict'

const Service = require('./service')
const { EthProtocol } = require('../net/protocol')
const { Chain } = require('../blockchain')
const { FastSynchronizer } = require('../sync')

const defaultOptions = {
  syncmode: 'fast'
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
   * @param {string}   [options.syncmode=fast] synchronization mode ('fast' or 'light')
   * @param {string}   [options.network=mainnet] ethereum network name
   * @param {string}   [options.dataDir=./chaindata] data directory path
   * @param {Logger}   [options.logger] logger instance
   */
  constructor (options) {
    super(options)
    options = { ...defaultOptions, ...options }

    this.syncmode = options.syncmode
    this.chain = new Chain({
      logger: this.logger,
      dataDir: options.dataDir,
      network: options.network
    })
    if (this.syncmode === 'fast') {
      this.logger.info('Fast sync mode')
      this.synchronizer = new FastSynchronizer({
        logger: this.logger,
        pool: this.pool,
        chain: this.chain
      })
    } else {
      throw new Error(`Unsupported syncmode: ${this.syncmode}`)
    }
  }

  /**
   * Returns all protocols required by this service
   * @type {Protocol[]} required protocols
   */
  protocols () {
    if (this.syncmode === 'fast') {
      return [ new EthProtocol({ chain: this.chain }) ]
    }
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
