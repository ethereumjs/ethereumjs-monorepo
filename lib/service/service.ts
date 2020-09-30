const { EventEmitter } = require('events')
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
export = module.exports = class Service extends EventEmitter {
  /**
   * Create new service and associated peer pool
   * @param {Object}     options constructor parameters
   * @param {Server[]}   [options.servers=[]] servers to run service on
   * @param {number}     [options.maxPeers=25] maximum peers allowed
   * @param {Logger}     [options.logger] logger instance
   */
  constructor (options: any) {
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
    this.pool.on('message', async (message: any, protocol: string, peer: any) => {
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
    this.servers.map((s: any) => s.addProtocols(protocols))
    if (this.pool) {
      this.pool.on('banned', (peer: any) => this.logger.debug(`Peer banned: ${peer}`))
      this.pool.on('error', (error: Error) => this.emit('error', error))
      this.pool.on('added', (peer: any) => this.logger.debug(`Peer added: ${peer}`))
      this.pool.on('removed', (peer: any) => this.logger.debug(`Peer removed: ${peer}`))
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
    await Promise.all(this.servers.map((s: any) => s.start()))
    this.running = true
    this.logger.info(`Started ${this.name} service.`)
  }

  /**
   * Stop service
   * @return {Promise}
   */
  async stop () {
    if (this.opened) {
      await this.close()
    }
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
  async handle (message: any, protocol: string, peer: any) {
  }
}

