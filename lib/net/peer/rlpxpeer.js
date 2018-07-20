'use strict'

const Peer = require('./peer')
const { Protocol, RlpxSender } = require('../protocol')
const { ETH, LES, RLPx } = require('ethereumjs-devp2p')
const { randomBytes } = require('crypto')

const capabilities = [
  ETH.eth62,
  ETH.eth63,
  LES.les2
]

/**
 * Devp2p/RLPx peer
 * @memberof module:net/peer
 */
class RlpxPeer extends Peer {
  /**
   * Create new devp2p/rlpx peer
   * @param {Object} options constructor parameters
   * @param {string} options.id peer id
   * @param {string} options.host peer hostname or ip address
   * @param {number} options.port peer port
   * @param {Logger} [options.logger] Logger instance
   * @param {Buffer} [options.privateKey] private key
   */
  constructor (options) {
    super({ ...options, address: `${options.host}:${options.port}` })

    this.host = options.host
    this.port = options.port
    this.server = null
    this.rlpx = null
    this.rlpxPeer = null
    this.connected = false
  }

  /**
   * Initiate peer connection
   * @return {Promise} [description]
   */
  async connect () {
    if (this.connected) {
      return
    }
    const privateKey = randomBytes(32)
    return new Promise(async (resolve, reject) => {
      this.rlpx = new RLPx(privateKey, { capabilities, listenPort: null })
      try {
        await this.rlpx.connect({
          id: Buffer.from(this.id, 'hex'),
          address: this.host,
          port: this.port
        })
      } catch (error) {
        return reject(error)
      }
      this.rlpx.on('peer:error', (rlpxPeer, err) => {
        this.emit('error', err, rlpxPeer)
      })
      this.rlpx.once('peer:added', rlpxPeer => {
        this.rlpxPeer = rlpxPeer
        this.addProtocols(rlpxPeer)
        this.connected = true
        this.emit('connected')
      })
      this.rlpx.once('peer:removed', (rlpxPeer, reason) => {
        if (rlpxPeer !== this.rlpxPeer) {
          return
        }
        reason = rlpxPeer.getDisconnectPrefix(reason)
        this.rlpxPeer = null
        this.connected = false
        this.emit('disconnected', reason)
      })
    })
  }

  /**
   * Accept new peer connection from an rlpx server
   * @private
   */
  accept (rlpxPeer, server) {
    if (this.connected) {
      return
    }
    this.rlpxPeer = rlpxPeer
    this.server = server
    this.addProtocols(rlpxPeer)
    this.connected = true
  }

  addProtocols (rlpxPeer) {
    for (let protocol of rlpxPeer.getProtocols()) {
      const name = protocol.constructor.name.toLowerCase()
      const sender = new RlpxSender(protocol)
      const SubProtocol = Protocol.fromName(name)
      if (SubProtocol) {
        this.addProtocol(new SubProtocol(sender))
      }
    }
  }
}

module.exports = RlpxPeer
