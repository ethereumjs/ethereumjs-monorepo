/**
* Libp2p Bundle
* @memberof module:net/peer
*/

const TCP = require('libp2p-tcp')
const WS = require('libp2p-websockets')
const Bootstrap = require('libp2p-bootstrap')
const KadDHT = require('libp2p-kad-dht')
const Multiplex = require('libp2p-mplex')
const SECIO = require('libp2p-secio')
const libp2p = require('libp2p')
const promisify = require('util-promisify')

export = module.exports = class Libp2pNode extends libp2p {
  constructor (options: any) {
    super({
      peerInfo: options.peerInfo,
      modules: {
        transport: [
          TCP,
          WS
        ],
        streamMuxer: [
          Multiplex
        ],
        connEncryption: [
          SECIO
        ],
        peerDiscovery: [
          Bootstrap
        ],
        dht: KadDHT
      },
      config: {
        peerDiscovery: {
          bootstrap: {
            interval: 2000,
            enabled: options.bootnodes !== undefined,
            list: options.bootnodes || []
          }
        },
        dht: {
          kBucketSize: 20
        },
        EXPERIMENTAL: {
          dht: false,
          pubsub: false
        }
      }
    })

    this.asyncStart = promisify(this.start.bind(this))
    this.asyncStop = promisify(this.stop.bind(this))
    this.asyncDial = promisify(this.dial.bind(this))
    this.asyncDialProtocol = promisify(this.dialProtocol.bind(this))
  }
}


