'use strict'

const EventEmitter = require('events')
const PeerPool = require('../net/peerpool')
const { defaultLogger } = require('../logging')

const defaultOptions = {
  logger: defaultLogger,
  servers: []
}

/**
 * Base class for all services
 * @memberof module:net/service
 */
class Service extends EventEmitter {
  /**
   * Create new service and associated peer pool
   * @param {Object}     options constructor parameters
   * @param {Server[]}   [options.servers=[]] servers to run service on
   * @param {Logger}     [options.logger] logger instance
   */
  constructor (options) {
    super()
    options = { ...defaultOptions, ...options }

    this.logger = options.logger
    this.opened = false
    this.started = false
    this.servers = options.servers
    this.pool = null
    this.pool = new PeerPool({
      logger: this.logger,
      servers: this.servers
    })
  }

  /**
   * Returns all protocols required by this service
   * @type {Protocol[]} required protocols
   */
  protocols () {
    return []
  }

  /**
   * Open service. Must be called before service is started
   * @return {Promise}
   */
  async open () {
    if (this.opened) {
      return false
    }
    const protocols = this.protocols()
    this.servers.map(s => s.addProtocols(protocols))
    this.pool.addProtocols(protocols)
    if (this.pool) {
      this.pool.on('banned', peer => this.logger.debug(`Peer banned: ${peer}`))
      this.pool.on('error', error => this.emit('error', error))
      this.pool.on('added', peer => this.logger.debug(`Peer added: ${peer}`))
      this.pool.on('removed', peer => this.logger.debug(`Peer removed: ${peer}`))
      await this.pool.open()
    }
    this.opened = true
  }

  /**
   * Start service
   * @return {Promise}
   */
  async start () {
    this.started = true
  }

  /**
   * Start service
   * @return {Promise}
   */
  async stop () {
    this.started = false
  }
}

module.exports = Service
