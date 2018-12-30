'use strict'

const EventEmitter = require('events')
const PeerPool = require('../net/peerpool')
const { defaultLogger } = require('../logging')

const defaultOptions = {
  maxPeers: 25,
  logger: defaultLogger,
  servers: []
}

/**
 * Base class for all services
 * @memberof module:service
 */
class Service extends EventEmitter {
  /**
   * Create new service and associated peer pool
   * @param {Object}     options constructor parameters
   * @param {Server[]}   [options.servers=[]] servers to run service on
   * @param {number}     [options.maxPeers=25] maximum peers allowed
   * @param {Logger}     [options.logger] logger instance
   */
  constructor (options) {
    super()
    options = { ...defaultOptions, ...options }

    this.logger = options.logger
    this.opened = false
    this.running = false
    this.servers = options.servers
    this.pool = new PeerPool({
      logger: this.logger,
      servers: this.servers,
      maxPeers: options.maxPeers
    })
    this.pool.on('message', async (message, protocol, peer) => {
      if (this.running) {
        try {
          await this.handle(message, protocol, peer)
        } catch (error) {
          this.logger.debug(`Error handling message (${protocol}:${message.name}): ${error.message}`)
        }
      }
    })
  }

  /**
   * Service name
   * @protected
   * @type {string}
   */
  get name () {
    throw new Error('Unimplemented')
  }

  /**
   * Returns all protocols required by this service
   * @type {Protocol[]} required protocols
   */
  get protocols () {
    return []
  }

  /**
   * Open service. Must be called before service is running
   * @return {Promise}
   */
  async open () {
    if (this.opened) {
      return false
    }
    const protocols = this.protocols
    this.servers.map(s => s.addProtocols(protocols))
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
   * Close service.
   * @return {Promise}
   */
  async close () {
    if (this.pool) {
      this.pool.removeAllListeners()
      await this.pool.close()
    }
    this.opened = false
  }

  /**
   * Start service
   * @return {Promise}
   */
  async start () {
    if (this.running) {
      return false
    }
    await Promise.all(this.servers.map(s => s.start()))
    this.running = true
    this.logger.info(`Started ${this.name} service.`)
  }

  /**
   * Start service
   * @return {Promise}
   */
  async stop () {
    this.running = false
    this.logger.info(`Stopped ${this.name} service.`)
  }

  /**
   * Handles incoming request from connected peer
   * @param  {Object}  message message object
   * @param  {string}  protocol protocol name
   * @param  {Peer}    peer peer
   * @return {Promise}
   */
  async handle (message, protocol, peer) {
  }
}

module.exports = Service
