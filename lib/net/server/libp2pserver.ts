const PeerId = require('peer-id')
const PeerInfo = require('peer-info')
import { Multiaddrs, MultiaddrsLike } from '../../types'
import { parseMultiaddrs } from '../../util'
import { Libp2pNode } from '../peer/libp2pnode'
import { Libp2pPeer } from '../peer'
import { Server, ServerOptions } from './server'

export interface Libp2pServerOptions extends ServerOptions {
  /* Multiaddrs to listen on (can be a comma separated string or list) */
  multiaddrs?: MultiaddrsLike
}

/**
 * Libp2p server
 * @emits connected
 * @emits disconnected
 * @emits error
 * @memberof module:net/server
 */
export class Libp2pServer extends Server {
  private peers: Map<string, Libp2pPeer> = new Map()
  private banned: Map<string, number> = new Map()
  private multiaddrs: Multiaddrs
  private node: Libp2pNode | null

  /**
   * Create new DevP2P/RLPx server
   * @param {Libp2pServerOptions}
   */
  constructor(options: Libp2pServerOptions) {
    super(options)

    this.multiaddrs = options.multiaddrs
      ? parseMultiaddrs(options.multiaddrs)
      : ['/ip4/127.0.0.1/tcp/50580/ws']

    this.node = null
    this.banned = new Map()
  }

  /**
   * Server name
   * @type {string}
   */
  get name() {
    return 'libp2p'
  }

  /**
   * Start Libp2p server. Returns a promise that resolves once server has been started.
   * @return Resolves with true if server successfully started
   */
  async start(): Promise<boolean> {
    if (this.started) {
      return false
    }
    await super.start()
    if (!this.node) {
      this.node = new Libp2pNode({
        peerInfo: await this.createPeerInfo(),
        bootnodes: this.bootnodes,
      })
      this.protocols.forEach(async (p: any) => {
        //@ts-ignore
        const protocol: any = `/${p.name}/${p.versions[0]}`
        this.node!.handle(protocol, async (_: any, connection: any) => {
          try {
            const peerInfo = await this.getPeerInfo(connection)
            const id = (peerInfo as any).id.toB58String()
            const peer = this.peers.get(id)
            if (peer) {
              await peer.accept(p, connection, this)
              this.emit('connected', peer)
            }
          } catch (e) {
            this.error(e)
          }
        })
      })
    }
    // eslint-disable-next-line no-extra-semi
    this.node.on('peer:discovery', async (peerInfo: any) => {
      try {
        const id = peerInfo.id.toB58String()
        if (this.peers.get(id) || this.isBanned(id)) {
          return
        }
        const peer = this.createPeer(peerInfo)
        await peer.bindProtocols(this.node, peerInfo, this)
        this.config.logger.debug(`Peer discovered: ${peer}`)
        this.emit('connected', peer)
      } catch (e) {
        this.error(e)
      }
    })
    this.node.on('peer:connect', (peerInfo: any) => {
      try {
        const peer = this.createPeer(peerInfo)
        this.config.logger.debug(`Peer connected: ${peer}`)
      } catch (e) {
        this.error(e)
      }
    })
    await new Promise((resolve, reject) =>
      this.node!.start((err: any) => {
        if (err) reject(err)
        resolve()
      })
    )
    this.node.peerInfo.multiaddrs.toArray().map((ma: any) => {
      this.emit('listening', {
        transport: this.name,
        url: ma.toString(),
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
      await new Promise((resolve, reject) =>
        this.node!.stop((err: any) => {
          if (err) reject(err)
          resolve()
        })
      )
      await super.stop()
      this.started = false
    }
    return this.started
  }

  /**
   * Ban peer for a specified time
   * @param  peerId id of peer
   * @param  [maxAge] how long to ban peer
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
   * @param  peerId id of peer
   * @return true if banned
   */
  isBanned(peerId: string): boolean {
    const expireTime = this.banned.get(peerId)
    if (expireTime && expireTime > Date.now()) {
      return true
    }
    this.banned.delete(peerId)
    return false
  }

  /**
   * Handles errors from server and peers
   * @private
   * @param  error
   * @emits  error
   */
  error(error: Error) {
    this.emit('error', error)
  }

  async createPeerInfo() {
    return new Promise((resolve, reject) => {
      const handler = (err: any, peerInfo: any) => {
        if (err) {
          return reject(err)
        }
        // eslint-disable-next-line no-extra-semi
        this.multiaddrs.forEach((ma: any) => peerInfo.multiaddrs.add(ma))
        resolve(peerInfo)
      }
      if (this.key) {
        PeerId.createFromPrivKey(this.key, (err: any, id: any) => {
          if (err) {
            return reject(err)
          }
          PeerInfo.create(id, handler)
        })
      } else {
        PeerInfo.create(handler)
      }
    })
  }

  async getPeerInfo(connection: any) {
    return new Promise((resolve, reject) => {
      connection.getPeerInfo((err: any, info: any) => {
        if (err) {
          return reject(err)
        }
        resolve(info)
      })
    })
  }

  createPeer(peerInfo: any) {
    const peer = new Libp2pPeer({
      config: this.config,
      id: peerInfo.id.toB58String(),
      multiaddrs: peerInfo.multiaddrs.toArray().map((ma: any) => ma.toString()),
      protocols: Array.from(this.protocols),
    })
    this.peers.set(peer.id, peer)
    return peer
  }
}
