'use strict'

/**
 * Libp2p Bundle
 * @memberof module:net/peer
 */

const WS = require('libp2p-websockets')
const Bootstrap = require('libp2p-bootstrap')
const Multiplex = require('libp2p-mplex')
const SECIO = require('libp2p-secio')
const libp2p = require('libp2p')
const promisify = require('util-promisify')

class Libp2pNode extends libp2p {
  constructor(options) {
    super({
      peerInfo: options.peerInfo,
      modules: {
        transport: [WS],
        streamMuxer: [Multiplex],
        connEncryption: [SECIO],
        peerDiscovery: [Bootstrap],
      },
      config: {
        peerDiscovery: {
          bootstrap: {
            interval: 2000,
            enabled: options.bootnodes !== undefined,
            list: options.bootnodes || [],
          },
        },
        EXPERIMENTAL: {
          dht: false,
          pubsub: false,
        },
      },
    })

    this.asyncStart = promisify(this.start.bind(this))
    this.asyncStop = promisify(this.stop.bind(this))
    this.asyncDial = promisify(this.dial.bind(this))
    this.asyncDialProtocol = promisify(this.dialProtocol.bind(this))
  }
}

module.exports = Libp2pNode
