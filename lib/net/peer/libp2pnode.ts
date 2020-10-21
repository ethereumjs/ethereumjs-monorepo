/**
 * Libp2p Bundle
 * @memberof module:net/peer
 */
const LibP2pTcp = require('libp2p-tcp')
const LibP2pWebsockets = require('libp2p-websockets')
const LibP2pBootstrap = require('libp2p-bootstrap')
const LibP2pKadDht = require('libp2p-kad-dht')
const mplex = require('libp2p-mplex')
const secio = require('libp2p-secio')

// TODO: Import errors with "class extends value undefined is not a constructor or null"
//       but LibP2p *is* default export and has a constructor
const LibP2p = require('libp2p')
const promisify = require('util-promisify')

export class Libp2pNode extends LibP2p {
  public asyncStart: any
  public asyncStop: any
  public asyncDial: any
  public asyncDialProtocol: any

  constructor(options: any) {
    super({
      peerInfo: options.peerInfo,
      modules: {
        transport: [LibP2pTcp, LibP2pWebsockets],
        streamMuxer: [mplex],
        connEncryption: [secio],
        peerDiscovery: [LibP2pBootstrap],
        dht: LibP2pKadDht,
      },
      config: {
        peerDiscovery: {
          bootstrap: {
            interval: 2000,
            enabled: options.bootnodes !== undefined,
            list: options.bootnodes || [],
          },
        },
        dht: {
          kBucketSize: 20,
        },
        // @ts-ignore: 'EXPERIMENTAL' does not exist in type 'OptionsConfig'
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
