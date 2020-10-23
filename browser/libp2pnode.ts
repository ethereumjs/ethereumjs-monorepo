/**
 * Libp2p Bundle
 * @memberof module:net/peer
 */

import LibP2pWebsockets from 'libp2p-websockets'
import LibP2pBootstrap from 'libp2p-bootstrap'
import mplex from 'libp2p-mplex'
import secio from 'libp2p-secio'

const libp2p = require('libp2p')
const promisify = require('util-promisify')

export class Libp2pNode extends libp2p {
  constructor(options: any) {
    super({
      peerInfo: options.peerInfo,
      modules: {
        transport: [LibP2pWebsockets],
        streamMuxer: [mplex],
        connEncryption: [secio],
        peerDiscovery: [LibP2pBootstrap],
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
