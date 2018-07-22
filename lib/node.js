'use strict'

const EventEmitter = require('events')
const Common = require('ethereumjs-common')
const { Server } = require('./net/server')
const { EthService } = require('./service')
const { defaultLogger } = require('./logging')

const defaultOptions = {
  logger: defaultLogger,
  transports: [ 'rlpx' ]
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
   * @param {string}   [options.network=mainnet] ethereum network name
   * @param {string}   [options.dataDir=./chaindata] data directory path
   * @param {string}   [options.syncmode=fast] synchronization mode ('fast' or 'light')
   * @param {string[]} [options.transports=rlpx] names of supported transports
   * @param {number}   [options.maxPeers=25] maximum peers allowed
   * @param {number}   [options.localPort=null] local port to listen on
   * @param {Buffer}   [options.privateKey] private key to use for server
   * @param {string[]} [options.clientFilter] list of supported clients
   * @param {number}   [options.refreshInterval] how often to discover new peers
   */
  constructor (options) {
    super()
    options = {...defaultOptions, ...options}

    this.logger = options.logger
    this.common = new Common(options.network)
    this.servers = options.transports.map(name => {
      return new (Server.fromName(name))(Object.assign({}, options, {
        bootnodes: this.common.bootstrapNodes()
      }))
    })
    this.services = [
      new EthService({
        servers: this.servers,
        logger: this.logger,
        syncmode: options.syncmode,
        network: options.network,
        dataDir: options.dataDir
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
      s.on('error', error => this.emit('error', error))
    })
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
    await Promise.all(this.services.map(s => s.open()))
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
}

module.exports = Node
