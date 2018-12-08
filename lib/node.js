'use strict'

const EventEmitter = require('events')
const Common = require('ethereumjs-common')
const { EthereumService } = require('./service')
const { defaultLogger } = require('./logging')

const defaultOptions = {
  logger: defaultLogger,
  servers: [],
  common: new Common('mainnet')
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
   * @param {number}   [options.maxPeers=25] maximum peers allowed
   * @param {string[]} [options.clientFilter] list of supported clients
   * @param {number}   [options.refreshInterval] how often to discover new peers
   */
  constructor (options) {
    super()
    options = {...defaultOptions, ...options}

    this.logger = options.logger
    this.common = options.common
    this.servers = options.servers
    this.services = [
      new EthereumService({
        servers: this.servers,
        logger: this.logger,
        syncmode: options.syncmode,
        lightserv: options.lightserv,
        common: options.common,
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
      s.on('synchronized', stats => {
        this.emit('synchronized', stats)
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
    this.services.map(s => s.start())
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
}

module.exports = Node
