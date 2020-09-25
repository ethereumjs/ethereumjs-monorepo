import { EventEmitter } from 'events'
const { FastEthereumService, LightEthereumService } = require('./service')
const { defaultLogger } = require('./logging')

const defaultOptions = {
  minPeers: 3,
  maxPeers: 25,
  logger: defaultLogger,
  servers: []
}

/**
 * Represents the top-level ethereum node, and is responsible for managing the
 * lifecycle of included services.
 * @memberof module:node
 */
class Node extends EventEmitter {
  /**
   * Create new node
   * @param {Object}   options constructor parameters
   * @param {Logger}   [options.logger] Logger instance
   * @param {Common}   [options.common] common parameters
   * @param {LevelDB}  [options.db=null] blockchain database
   * @param {string}   [options.syncmode=light] synchronization mode ('fast' or 'light')
   * @param {boolean}  [options.lightserv=false] serve LES requests
   * @param {Server[]} [options.servers=[]] list of servers to use
   * @param {Object[]} [options.bootnodes] list of bootnodes to use for discovery
   * @param {number}   [options.minPeers=3] number of peers needed before syncing
   * @param {number}   [options.maxPeers=25] maximum peers allowed
   * @param {string[]} [options.clientFilter] list of supported clients
   * @param {number}   [options.refreshInterval] how often to discover new peers
   */
  constructor (options) {
    super()
    options = { ...defaultOptions, ...options }

    this.logger = options.logger
    this.common = options.common
    this.servers = options.servers
    this.syncmode = options.syncmode
    this.services = [
      this.syncmode === 'fast'
        ? new FastEthereumService({
          servers: this.servers,
          logger: this.logger,
          lightserv: options.lightserv,
          common: options.common,
          minPeers: options.minPeers,
          maxPeers: options.maxPeers,
          db: options.db
        })
        : new LightEthereumService({
          servers: this.servers,
          logger: this.logger,
          common: options.common,
          minPeers: options.minPeers,
          maxPeers: options.maxPeers,
          db: options.db
        })
    ]
    this.opened = false
    this.started = false
  }

  /**
   * Open node. Must be called before node is started
   * @return {Promise}
   */
  async open () {
    if (this.opened) {
      return false
    }
    this.servers.map(s => {
      s.on('error', error => {
        this.emit('error', error)
      })
      s.on('listening', details => {
        this.emit('listening', details)
      })
    })
    this.services.map(s => {
      s.on('error', error => {
        this.emit('error', error)
      })
      s.on('synchronized', () => {
        this.emit('synchronized')
      })
    })
    await Promise.all(this.services.map(s => s.open()))
    this.opened = true
  }

  /**
   * Starts node and all services and network servers.
   * @return {Promise}
   */
  async start () {
    if (this.started) {
      return false
    }
    await Promise.all(this.servers.map(s => s.start()))
    await Promise.all(this.services.map(s => s.start()))
    this.started = true
  }

  /**
   * Stops node and all services and network servers.
   * @return {Promise}
   */
  async stop () {
    if (!this.started) {
      return false
    }
    await Promise.all(this.services.map(s => s.stop()))
    await Promise.all(this.servers.map(s => s.stop()))
    this.started = false
  }

  /**
   * Returns the service with the specified name.
   * @param {string} name name of service
   * @return {Service}
   */
  service (name) {
    return this.services.find(s => s.name === name)
  }

  /**
   * Returns the server with the specified name.
   * @param {string} name name of server
   * @return {Server}
   */
  server (name) {
    return this.servers.find(s => s.name === name)
  }
}

module.exports = Node
