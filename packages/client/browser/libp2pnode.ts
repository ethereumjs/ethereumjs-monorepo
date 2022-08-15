/**
 * Libp2p Bundle
 * @memberof module:net/peer
 */

import { NOISE } from '@chainsafe/libp2p-noise'
import * as Libp2p from 'libp2p'
import * as Bootstrap from 'libp2p-bootstrap'

import type { Multiaddr } from 'multiaddr'
import type PeerId from 'peer-id'

const MPLEX = require('libp2p-mplex')
const Websockets = require('libp2p-websockets')
const filters = require('libp2p-websockets/src/filters')

export interface Libp2pNodeOptions {
  /* Peer id */
  peerId: PeerId

  /* Addresses */
  addresses?: {
    listen?: string[]
    announce?: string[]
    announceFilter?: (ma: Multiaddr[]) => Multiaddr[]
  }

  /* Bootnodes */
  bootnodes?: Multiaddr[]
}

export class Libp2pNode extends Libp2p {
  constructor(options: Libp2pNodeOptions) {
    const wsTransportKey = Websockets.prototype[Symbol.toStringTag]
    options.bootnodes = options.bootnodes ?? []

    super({
      peerId: options.peerId,
      addresses: options.addresses,
      modules: {
        transport: [Websockets],
        streamMuxer: [MPLEX],
        connEncryption: [NOISE],
        [<any>'peerDiscovery']: [Bootstrap],
      },
      config: {
        transport: {
          [wsTransportKey]: {
            filter: filters.all,
          },
        },
        peerDiscovery: {
          autoDial: false,
          [Bootstrap.tag]: {
            interval: 2000,
            enabled: options.bootnodes.length > 0,
            list: options.bootnodes,
          },
        },
      },
    })
  }
}
