'use strict'

const EventEmitter = require('events')
const { Chain } = require('../blockchain')
const { Server } = require('../net/server')
const Common = require('ethereumjs-common')
const { defaultLogger } = require('../logging')

const defaultOptions = {
  logger: defaultLogger,
  transports: [ 'rlpx' ]
}

/**
 * Base class for ethereum node implementations
 * @memberof module:node
 */
class Node extends EventEmitter {
  /**
   * Create new node
   * @param {Object}   options constructor parameters
   * @param {Logger}   options.logger Logger instance
   * @param {string}   options.network ethereum network name
   * @param {string[]} options.transports names of supported transports
   * @param {string}   options.dataDir data directory path
   * @param {number}   options.maxPeers maximum peers allowed
   * @param {number}   options.localPort local port to listen on
   * @param {Buffer}   options.privateKey private key to use for server
   * @param {string[]} options.clientFilter list of supported clients
   * @param {number}   options.refreshInterval how often to discover new peers
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
    this.chain = new Chain({
      logger: this.logger,
      dataDir: options.dataDir,
      network: options.network
    })
    this.pool = null
    this.opened = false
  }

  /**
   * Open node and wait for all components to initialize
   * @protected
   * @return {Promise}
   */
  async open () {
    if (this.opened) {
      return
    }
    await Promise.all(this.servers.map(s => s.open()))
    await this.chain.open()
    if (this.pool) {
      this.pool.on('banned', peer => this.logger.debug(`Peer banned: ${peer}`))
      this.pool.on('error', error => this.logger.error(error))
      this.pool.on('added', peer => this.logger.debug(`Peer added: ${peer}`))
      this.pool.on('removed', peer => this.logger.debug(`Peer removed: ${peer}`))
      await this.pool.open()
    }
    this.opened = true
  }

  /**
   * Run blockchain synchronization. Returns a promise that resolves once chain
   * is synchronized
   * @protected
   * @return {Promise}
   */
  async sync () {
    throw new Error('Unimplemented')
  }
}

module.exports = Node
