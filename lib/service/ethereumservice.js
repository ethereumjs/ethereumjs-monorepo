'use strict'

const Service = require('./service')
const EthProtocol = require('../net/protocol/ethprotocol')
const LesProtocol = require('../net/protocol/lesprotocol')
const FlowControl = require('../net/protocol/flowcontrol')
const { Chain } = require('../blockchain')
const { FastSynchronizer, LightSynchronizer } = require('../sync')
const { EthHandler, LesHandler } = require('../handler')

const defaultOptions = {
  syncmode: 'light',
  lightserv: false
}

/**
 * Ethereum service
 * @memberof module:service
 */
class EthereumService extends Service {
  /**
   * Create new ETH service
   * @param {Object}   options constructor parameters
   * @param {Server[]} options.servers servers to run service on
   * @param {string}   [options.syncmode=light] synchronization mode ('fast' or 'light')
   * @param {boolean}  [options.lightserv=false] serve LES requests
   * @param {Common}   [options.common] ethereum network name
   * @param {LevelDB}  [options.db=null] blockchain database
   * @param {Logger}   [options.logger] logger instance
   */
  constructor (options) {
    super(options)
    options = { ...defaultOptions, ...options, ...{logger: this.logger} }

    this.syncmode = options.syncmode
    this.lightserv = options.lightserv
    this.flow = new FlowControl(options)
    this.chain = new Chain(options)
    this.handlers = []

    if (this.syncmode === 'light') {
      this.logger.info('Light sync mode')
      this.synchronizer = new LightSynchronizer({
        logger: this.logger,
        pool: this.pool,
        chain: this.chain,
        flow: this.flow
      })
    } else if (this.syncmode === 'fast') {
      this.logger.info('Fast sync mode')
      this.synchronizer = new FastSynchronizer({
        logger: this.logger,
        pool: this.pool,
        chain: this.chain
      })
      this.handlers.push(new EthHandler({
        logger: this.logger,
        chain: this.chain,
        pool: this.pool
      }))
      if (this.lightserv) {
        this.handlers.push(new LesHandler({
          logger: this.logger,
          chain: this.chain,
          pool: this.pool,
          flow: this.flow
        }))
      }
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
    const protocols = []
    if (this.syncmode === 'light') {
      protocols.push(new LesProtocol({ chain: this.chain }))
    } else if (this.syncmode === 'fast') {
      protocols.push(new EthProtocol({ chain: this.chain }))
      if (this.lightserv) {
        protocols.push(new LesProtocol({ chain: this.chain, flow: this.flow }))
      }
    }
    return protocols
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
    this.synchronizer.on('synchronized', (stats) => this.emit('synchronized', stats))
    this.synchronizer.on('error', error => this.emit('error', error))
    await this.chain.open()
    await this.synchronizer.open()
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
    await this.synchronizer.sync()
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

module.exports = EthereumService
