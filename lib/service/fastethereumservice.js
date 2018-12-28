'use strict'

const EthereumService = require('./ethereumservice')
const FastSynchronizer = require('../sync/fastsync')
const EthProtocol = require('../net/protocol/ethprotocol')
const LesProtocol = require('../net/protocol/lesprotocol')

const defaultOptions = {
  lightserv: false
}

/**
 * Ethereum service
 * @memberof module:service
 */
class FastEthereumService extends EthereumService {
  /**
   * Create new ETH service
   * @param {Object}   options constructor parameters
   * @param {Server[]} options.servers servers to run service on
   * @param {boolean}  [options.lightserv=false] serve LES requests
   * @param {Chain}    [options.chain] blockchain
   * @param {Common}   [options.common] ethereum network name
   * @param {number}   [options.minPeers=3] number of peers needed before syncing
   * @param {number}   [options.maxPeers=25] maximum peers allowed
   * @param {number}   [options.interval] sync retry interval
   * @param {Logger}   [options.logger] logger instance
   */
  constructor (options) {
    super(options)
    options = { ...defaultOptions, ...options }
    this.lightserv = options.lightserv
    this.init()
  }

  init () {
    this.logger.info('Fast sync mode')
    this.synchronizer = new FastSynchronizer({
      logger: this.logger,
      pool: this.pool,
      chain: this.chain,
      minPeers: this.minPeers,
      interval: this.interval
    })
  }

  /**
   * Returns all protocols required by this service
   * @type {Protocol[]} required protocols
   */
  get protocols () {
    const protocols = [ new EthProtocol({
      chain: this.chain,
      timeout: this.timeout
    }) ]
    if (this.lightserv) {
      protocols.push(new LesProtocol({
        chain: this.chain,
        flow: this.flow,
        timeout: this.timeout
      }))
    }
    return protocols
  }

  /**
   * Handles incoming message from connected peer
   * @param  {Object}  message message object
   * @param  {string}  protocol protocol name
   * @param  {Peer}    peer peer
   * @return {Promise}
   */
  async handle (message, protocol, peer) {
    if (protocol === 'eth') {
      return this.handleEth(message, peer)
    } else {
      return this.handleLes(message, peer)
    }
  }

  /**
   * Handles incoming ETH message from connected peer
   * @param  {Object}  message message object
   * @param  {Peer}    peer peer
   * @return {Promise}
   */
  async handleEth (message, peer) {
    if (message.name === 'GetBlockHeaders') {
      const { block, max, skip, reverse } = message.data
      const headers = await this.chain.getHeaders(block, max, skip, reverse)
      peer.eth.send('BlockHeaders', headers)
    } else if (message.name === 'GetBlockBodies') {
      const hashes = message.data
      const blocks = await Promise.all(hashes.map(hash => this.chain.getBlock(hash)))
      const bodies = blocks.map(block => block.raw.slice(1))
      peer.eth.send('BlockBodies', bodies)
    } else if (message.name === 'NewBlockHashes') {
      this.synchronizer.announced(message.data, peer)
    }
  }

  /**
   * Handles incoming LES message from connected peer
   * @param  {Object}  message message object
   * @param  {Peer}    peer peer
   * @return {Promise}
   */
  async handleLes (message, peer) {
    if (message.name === 'GetBlockHeaders' && this.lightserv) {
      const { reqId, block, max, skip, reverse } = message.data
      const bv = this.flow.handleRequest(peer, message.name, max)
      if (bv < 0) {
        this.pool.ban(peer, 300000)
        this.logger.debug(`Dropping peer for violating flow control ${peer}`)
      } else {
        const headers = await this.chain.getHeaders(block, max, skip, reverse)
        peer.les.send('BlockHeaders', { reqId, bv, headers })
      }
    }
  }
}

module.exports = FastEthereumService
