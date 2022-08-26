// eslint-disable-next-line implicit-dependencies/no-implicit, import/no-extraneous-dependencies
import { keys } from 'libp2p-crypto'
import { multiaddr } from 'multiaddr'
import * as PeerId from 'peer-id'

import { Event } from '../../types'
import { Libp2pPeer } from '../peer'
import { Libp2pNode } from '../peer/libp2pnode'

import { Server } from './server'

import type { Libp2pConnection as Connection } from '../../types'
import type { ServerOptions } from './server'
import type { Multiaddr } from 'multiaddr'

export interface Libp2pServerOptions extends ServerOptions {
  /* Multiaddrs to listen on */
  multiaddrs?: Multiaddr[]
}

/**
 * Libp2p server
 * @memberof module:net/server
 */
export class Libp2pServer extends Server {
  private peers: Map<string, Libp2pPeer> = new Map()
  private banned: Map<string, number> = new Map()
  private multiaddrs: Multiaddr[]
  private node: Libp2pNode | null

  /**
   * Create new DevP2P/RLPx server
   */
  constructor(options: Libp2pServerOptions) {
    super(options)

    this.multiaddrs = options.multiaddrs ?? [multiaddr('/ip4/127.0.0.1/tcp/50580/ws')]

    this.node = null
    this.banned = new Map()
  }

  /**
   * Server name
   */
  get name() {
    return 'libp2p'
  }

  /**
   * Start Libp2p server. Returns a promise that resolves once server has been started.
   * @returns true if server successfully started
   */
  async start(): Promise<boolean> {
    if (this.started) {
      return false
    }
    let peerId: PeerId
    await super.start()
    if (!this.node) {
      peerId = await this.getPeerId()
      const addresses = { listen: this.multiaddrs.map((ma) => ma.toString()) }
      this.node = new Libp2pNode({
        peerId,
        addresses,
        bootnodes: this.bootnodes,
      })
      for (const p of this.protocols) {
        const protocol = `/${p.name}/${p.versions[0]}`
        this.node!.handle(protocol, async ({ connection, stream }) => {
          const [peerId] = this.getPeerInfo(connection)
          const peer = this.peers.get(peerId.toB58String())
          if (peer) {
            await peer.accept(p, stream, this)
            this.config.events.emit(Event.PEER_CONNECTED, peer)
          }
        })
      }
    }
    this.node.on('peer:discovery', async (peerId: PeerId) => {
      const id = peerId.toB58String()
      if (this.peers.get(id) || this.isBanned(id)) {
        return
      }
      const peer = this.createPeer(peerId)
      await peer.bindProtocols(this.node as Libp2pNode, peerId, this)
      this.config.logger.debug(`Peer discovered: ${peer}`)
      this.config.events.emit(Event.PEER_CONNECTED, peer)
    })
    this.node.connectionManager.on('peer:connect', async (connection: Connection) => {
      const [peerId, multiaddr, inbound] = this.getPeerInfo(connection)
      const peer = this.createPeer(peerId, [multiaddr], inbound)
      this.config.logger.debug(`Peer connected: ${peer}`)
      // note: do not call Event.PEER_CONNECTED here, it will
      // be called after bindProtocols on peer:discovery
    })
    this.node.connectionManager.on('peer:disconnect', (_connection: Connection) => {
      // TODO: do anything here on disconnect?
    })
    this.node.on('error', (error: Error) => this.error(error))
    await this.node.start()
    this.node.addressManager.getListenAddrs().map(async (ma) => {
      this.config.events.emit(Event.SERVER_LISTENING, {
        transport: this.name,
        url: `${ma}/p2p/${peerId.toB58String()}`,
      })
    })
    this.started = true
    return true
  }

  /**
   * Stop Libp2p server. Returns a promise that resolves once server has been stopped.
   */
  async stop(): Promise<boolean> {
    if (this.started) {
      await this.node!.stop()
      await super.stop()
      this.started = false
    }
    return this.started
  }

  /**
   * Ban peer for a specified time
   * @param peerId id of peer
   * @param maxAge how long to ban peer (default: 60s)
   */
  ban(peerId: string, maxAge = 60000): boolean {
    if (!this.started) {
      return false
    }
    this.banned.set(peerId, Date.now() + maxAge)
    return true
  }

  /**
   * Check if peer is currently banned
   * @param peerId id of peer
   * @returns true if banned
   */
  isBanned(peerId: string): boolean {
    const expireTime = this.banned.get(peerId)
    if (typeof expireTime === 'number' && expireTime !== 0 && expireTime > Date.now()) {
      return true
    }
    this.banned.delete(peerId)
    return false
  }

  /**
   * Handles errors from server and peers
   * @param error
   * @emits {@link Event.SERVER_ERROR}
   */
  private error(error: Error) {
    this.config.events.emit(Event.SERVER_ERROR, error, this)
  }

  async getPeerId() {
    const privKey = await keys.generateKeyPairFromSeed('ed25519', this.key, 512)
    const protoBuf = keys.marshalPrivateKey(privKey)
    return PeerId.createFromPrivKey(protoBuf)
  }

  getPeerInfo(connection: Connection): [peerId: PeerId, multiaddr: Multiaddr, inbound: boolean] {
    return [connection.remotePeer, connection.remoteAddr, connection._stat.direction === 'inbound']
  }

  createPeer(peerId: PeerId, multiaddrs?: Multiaddr[], inbound = false) {
    const peer = new Libp2pPeer({
      config: this.config,
      id: peerId.toB58String(),
      multiaddrs,
      protocols: Array.from(this.protocols),
      inbound,
    })
    this.peers.set(peer.id, peer)
    return peer
  }
}
