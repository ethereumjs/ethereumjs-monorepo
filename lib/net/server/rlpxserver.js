'use strict'

const Server = require('./server')
const { randomBytes } = require('crypto')
const devp2p = require('ethereumjs-devp2p')
const { RlpxPeer } = require('../peer')
const assert = require('assert')
const { defaultLogger } = require('../../logging')

const capabilities = [
  devp2p.ETH.eth62,
  devp2p.ETH.eth63
]

const defaultOptions = {
  logger: defaultLogger,
  maxPeers: 25,
  localPort: null,
  privateKey: randomBytes(32),
  clientFilter: ['go1.5', 'go1.6', 'go1.7', 'quorum', 'pirl', 'ubiq', 'gmc', 'gwhale', 'prichain'],
  refreshInterval: 30000,
  bootnodes: []
}

const ignoredErrors = new RegExp([
  'NetworkId mismatch',
  'ECONNRESET',
  'Timeout error: ping',
  'Genesis block mismatch'
].join('|'))

/**
 * DevP2P/RLPx server
 * @emits connected
 * @emits disconnected
 * @emits error
 * @memberof module:net/server
 */
class RlpxServer extends Server {
  /**
   * Create new DevP2P/RLPx server
   * @param {Object}   options constructor parameters
   * @param {Object[]} options.bootnodes list of bootnodes to use for discovery
   * @param {number}   [options.maxPeers=25] maximum peers allowed
   * @param {number}   [options.localPort=null] local port to listen on
   * @param {Buffer}   [options.privateKey] private key to use for server
   * @param {string[]} [options.clientFilter] list of supported clients
   * @param {number}   [options.refreshInterval=30000] how often (in ms) to discover new peers
   * @param {Logger}   [options.logger] Logger instance
   */
  constructor (options) {
    super(options)
    options = {...defaultOptions, ...options}

    this.logger = options.logger
    this.maxPeers = options.maxPeers
    this.localPort = options.localPort
    this.privateKey = options.privateKey
    this.clientFilter = options.clientFilter
    this.refreshInterval = options.refreshInterval
    this.bootnodes = options.bootnodes
    this.init()
  }

  /**
   * Server name
   * @type {string}
   */
  get name () {
    return 'rlpx'
  }

  init () {
    this.dpt = null
    this.rlpx = null
    this.peers = new Map()
    this.opened = false
  }

  /**
   * Open RLPx server. Must be called before performing other operations.
   * @return {Promise} [description]
   */
  async open () {
    if (this.opened) {
      return
    }

    this.initDpt()
    this.initRlpx()

    await Promise.all(this.bootnodes.map(node => {
      const bootnode = {
        address: node.ip,
        udpPort: node.port,
        tcpPort: node.port
      }
      return this.dpt.bootstrap(bootnode).catch(e => this.error(e))
    }))

    this.opened = true
  }

  /**
   * Ban peer for a specified time
   * @param  {string} peerId id of peer
   * @param  {number} [maxAge] how long to ban peer
   * @return {Promise}
   */
  ban (peerId, maxAge = 60000) {
    assert(this.opened, 'Server is not opened.')
    this.dpt.banPeer(peerId, maxAge)
  }

  /**
   * Handles errors from server and peers
   * @private
   * @param  {Error} error
   * @param  {Peer} peer
   * @emits  error
   */
  error (error, peer) {
    if (ignoredErrors.test(error.message)) {
      this.logger.debug(`Ignored error: ${error.message} ${peer || ''}`)
      return
    }
    if (peer) {
      peer.emit('error', error)
    } else {
      this.emit('error', error)
    }
  }

  /**
   * Initializes DPT for peer discovery
   * @private
   */
  initDpt () {
    this.dpt = new devp2p.DPT(this.privateKey, {
      refreshInterval: this.refreshInterval,
      endpoint: {
        address: '0.0.0.0',
        udpPort: null,
        tcpPort: null
      }
    })

    this.dpt.on('error', e => this.error(e))
  }

  /**
   * Initializes RLPx instance for peer management
   * @private
   */
  initRlpx () {
    this.rlpx = new devp2p.RLPx(this.privateKey, {
      dpt: this.dpt,
      maxPeers: this.maxPeers,
      capabilities: capabilities,
      remoteClientIdFilter: this.clientFilter,
      listenPort: this.localPort
    })

    this.rlpx.on('peer:added', (rlpxPeer) => {
      const peer = new RlpxPeer({
        id: rlpxPeer.getId().toString('hex'),
        host: rlpxPeer._socket.remoteAddress,
        port: rlpxPeer._socket.remotePort
      })
      peer.accept(rlpxPeer, this)
      this.peers.set(peer.id, peer)
      this.logger.debug(`Peer connected: ${peer}`)
      this.emit('connected', peer)
    })

    this.rlpx.on('peer:removed', (rlpxPeer) => {
      const id = rlpxPeer.getId().toString('hex')
      const peer = this.peers.get(id)
      if (peer) {
        this.peers.delete(peer.id)
        this.logger.debug(`Peer disconnected: ${peer}`)
        this.emit('disconnected', peer)
      } else {
        this.logger.warn(`Tried to remove unknown peer: ${id}`)
      }
    })

    this.rlpx.on('peer:error', (rlpxPeer, error) => {
      const id = rlpxPeer.getId().toString('hex')
      const peer = this.peers.get(id)
      this.error(error, peer)
    })

    this.rlpx.on('error', e => this.error(e))
  }
}

module.exports = RlpxServer
