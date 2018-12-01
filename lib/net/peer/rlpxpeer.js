'use strict'

const Peer = require('./peer')
const RlpxSender = require('../protocol/rlpxsender')
const { ETH, LES, RLPx } = require('ethereumjs-devp2p')
const { randomBytes } = require('crypto')

const devp2pCapabilities = {
  eth62: ETH.eth62,
  eth63: ETH.eth63,
  les2: LES.les2
}

/**
 * Devp2p/RLPx peer
 * @memberof module:net/peer
 * @example
 *
 * const { RlpxPeer } = require('./lib/net/peer')
 * const { Chain } = require('./lib/blockchain')
 * const { EthProtocol } = require('./lib/net/protocol')
 *
 * const chain = new Chain()
 * const protocols = [ new EthProtocol({ chain })]
 * const id = '70180a7fcca96aa013a3609fe7c23cc5c349ba82652c077be6f05b8419040560a622a4fc197a450e5e2f5f28fe6227637ccdbb3f9ba19220d1fb607505ffb455'
 * const host = '192.0.2.1'
 * const port = 12345
 *
 * new RlpxPeer({ id, host, port, protocols })
 *   .on('error', (err) => console.log('Error:', err))
 *   .on('connected', () => console.log('Connected'))
 *   .on('disconnected', (reason) => console.log('Disconnected:', reason))
 *   .connect()
 */
class RlpxPeer extends Peer {
  /**
   * Create new devp2p/rlpx peer
   * @param {Object} options constructor parameters
   * @param {string} options.id peer id
   * @param {string} options.host peer hostname or ip address
   * @param {number} options.port peer port
   * @param {Protocols[]} [options.protocols=[]] supported protocols
   * @param {Logger} [options.logger] Logger instance
   */
  constructor (options) {
    super({
      ...options,
      transport: 'rlpx',
      address: `${options.host}:${options.port}`
    })

    this.host = options.host
    this.port = options.port
    this.server = null
    this.rlpx = null
    this.rlpxPeer = null
    this.connected = false
  }

  /**
   * Return devp2p/rlpx capabilities for the specified protocols
   * @param  {Protocols[]} protocols protocol instances
   * @return {Object[]} capabilities
   */
  static capabilities (protocols) {
    const capabilities = []
    protocols.forEach(protocol => {
      const { name, versions } = protocol
      const keys = versions.map(v => name + v)
      keys.forEach(key => {
        const capability = devp2pCapabilities[key]
        if (capability) {
          capabilities.push(capability)
        }
      })
    })
    return capabilities
  }

  /**
   * Initiate peer connection
   * @return {Promise}
   */
  async connect () {
    if (this.connected) {
      return
    }
    const key = randomBytes(32)
    await Promise.all(this.protocols.map(p => p.open()))
    this.rlpx = new RLPx(key, {
      capabilities: RlpxPeer.capabilities(this.protocols),
      listenPort: null }
    )
    await this.rlpx.connect({
      id: Buffer.from(this.id, 'hex'),
      address: this.host,
      port: this.port
    })
    this.rlpx.on('peer:error', (rlpxPeer, error) => {
      this.emit('error', error)
    })
    this.rlpx.once('peer:added', async (rlpxPeer) => {
      try {
        await this.bindProtocols(rlpxPeer)
        this.emit('connected')
      } catch (error) {
        this.emit('error', error)
      }
    })
    this.rlpx.once('peer:removed', (rlpxPeer, reason) => {
      try {
        if (rlpxPeer !== this.rlpxPeer) {
          return
        }
        reason = rlpxPeer.getDisconnectPrefix(reason)
        this.rlpxPeer = null
        this.connected = false
        this.emit('disconnected', reason)
      } catch (error) {
        this.emit('error', error)
      }
    })
  }

  /**
   * Accept new peer connection from an rlpx server
   * @private
   * @return {Promise}
   */
  async accept (rlpxPeer, server) {
    if (this.connected) {
      return
    }
    await this.bindProtocols(rlpxPeer)
    this.server = server
  }

  /**
   * Adds protocols to this peer given an rlpx native peer instance.
   * @private
   * @param  {Object}  rlpxPeer rlpx native peer
   * @return {Promise}
   */
  async bindProtocols (rlpxPeer) {
    this.rlpxPeer = rlpxPeer
    await Promise.all(rlpxPeer.getProtocols().map(rlpxProtocol => {
      const name = rlpxProtocol.constructor.name.toLowerCase()
      const protocol = this.protocols.find(p => p.name === name)
      if (protocol) {
        return this.bindProtocol(protocol, new RlpxSender(rlpxProtocol))
      }
    }))
    this.connected = true
  }
}

module.exports = RlpxPeer
