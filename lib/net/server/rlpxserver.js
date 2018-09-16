'use strict'

const Server = require('./server')
const { randomBytes } = require('crypto')
const devp2p = require('ethereumjs-devp2p')
const { RlpxPeer } = require('../peer')

const defaultOptions = {
  localPort: null,
  privateKey: randomBytes(32),
  clientFilter: ['go1.5', 'go1.6', 'go1.7', 'quorum', 'pirl', 'ubiq', 'gmc', 'gwhale', 'prichain'],
  bootnodes: []
}

const ignoredErrors = new RegExp([
  'EPIPE',
  'ECONNRESET',
  'ETIMEDOUT',
  'NetworkId mismatch',
  'Timeout error: ping',
  'Genesis block mismatch',
  'Handshake timed out',
  'Invalid address buffer',
  'Invalid MAC'
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

    this.localPort = options.localPort
    this.privateKey = options.privateKey
    this.clientFilter = options.clientFilter
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
  }

  /**
   * Start Devp2p/RLPx server. Returns a promise that resolves once server has been started.
   * @return {Promise}
   */
  async start () {
    if (this.started) {
      return false
    }

    await super.start()
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

    this.started = true
  }

  /**
   * Stop Devp2p/RLPx server. Returns a promise that resolves once server has been stopped.
   * @return {Promise}
   */
  async stop () {
    if (!this.started) {
      return false
    }

    await super.stop()
    this.rlpx.destroy()
    this.dpt.destroy()
    this.started = false
  }

  /**
   * Ban peer for a specified time
   * @param  {string} peerId id of peer
   * @param  {number} [maxAge] how long to ban peer
   * @return {Promise}
   */
  ban (peerId, maxAge = 60000) {
    if (!this.started) {
      return false
    }
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

    if (this.localPort) {
      this.dpt.bind(this.localPort, '0.0.0.0')
    }
  }

  /**
   * Initializes RLPx instance for peer management
   * @private
   */
  initRlpx () {
    this.rlpx = new devp2p.RLPx(this.privateKey, {
      dpt: this.dpt,
      maxPeers: this.maxPeers,
      capabilities: RlpxPeer.capabilities(this.protocols),
      remoteClientIdFilter: this.clientFilter,
      listenPort: this.localPort
    })

    this.rlpx.on('peer:added', async (rlpxPeer) => {
      const peer = new RlpxPeer({
        id: rlpxPeer.getId().toString('hex'),
        host: rlpxPeer._socket.remoteAddress,
        port: rlpxPeer._socket.remotePort,
        protocols: Array.from(this.protocols)
      })
      try {
        await peer.accept(rlpxPeer, this)
        this.peers.set(peer.id, peer)
        this.logger.debug(`Peer connected: ${peer}`)
        this.emit('connected', peer)
      } catch (error) {
        this.error(error)
      }
    })

    this.rlpx.on('peer:removed', (rlpxPeer, reason) => {
      const id = rlpxPeer.getId().toString('hex')
      const peer = this.peers.get(id)
      if (peer) {
        this.peers.delete(peer.id)
        this.logger.debug(`Peer disconnected (${rlpxPeer.getDisconnectPrefix(reason)}): ${peer}`)
        this.emit('disconnected', peer)
      }
    })

    this.rlpx.on('peer:error', (rlpxPeer, error) => {
      const id = rlpxPeer.getId().toString('hex')
      const peer = this.peers.get(id)
      this.error(error, peer)
    })

    this.rlpx.on('error', e => this.error(e))

    this.rlpx.on('listening', () => {
      this.emit('listening', {
        url: `enode://${this.rlpx._id.toString('hex')}@[::]:${this.localPort}`
      })
    })

    if (this.localPort) {
      this.rlpx.listen(this.localPort, '0.0.0.0')
    }
  }
}

module.exports = RlpxServer
