'use strict'

const Node = require('./node')
const PeerPool = require('../net/peerpool')
const { FastSynchronizer } = require('../sync')

/**
 * Implements an ethereum fast sync node
 * @memberof module:node
 */
class FastSyncNode extends Node {
  /**
   * Create new node
   * @param {Object}   options constructor parameters
   * @param {string}   [options.network=mainnet] ethereum network name
   * @param {string[]} [options.transports=rlpx] names of supported transports
   * @param {string}   [options.dataDir=./chaindata] data directory path
   * @param {number}   [options.maxPeers=25] maximum peers allowed
   * @param {number}   [options.localPort=null] local port to listen on
   * @param {Buffer}   [options.privateKey] private key to use for server
   * @param {string[]} [options.clientFilter] list of supported clients
   * @param {number}   [options.refreshInterval=30000] how often to discover new peers
   * @param {Logger}   [options.logger] Logger instance
   */
  constructor (options) {
    super(options)

    this.pool = new PeerPool({
      logger: this.logger,
      servers: this.servers,
      protocols: [ 'eth' ]
    })

    this.synchronizer = new FastSynchronizer({
      logger: this.logger,
      pool: this.pool,
      chain: this.chain
    })
  }

  /**
   * Open fast sync node and wait for all components to initialize
   * @return {Promise}
   */
  async open () {
    if (this.opened) {
      return
    }
    await super.open()
    this.pool.on('connected', peer => this.handshake(peer))
    await this.synchronizer.open()
    this.opened = true
  }

  /**
   * Run blockchain synchronization. Returns a promise that resolves once chain
   * is synchronized
   * @return {Promise}
   */
  async sync () {
    await this.synchronizer.sync()
  }

  /**
   * Performs a handshake with newly connected peers
   * @private
   * @param  {Peer}  peer
   * @return {Promise}
   */
  async handshake (peer) {
    try {
      await peer.eth.handshake(this.chain)
      this.pool.add(peer)
    } catch (e) {
      this.logger.debug(`${e.message} ${peer}`)
    }
  }
}

module.exports = FastSyncNode
