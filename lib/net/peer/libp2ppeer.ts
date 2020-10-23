import { Peer } from './peer'
import PeerId from 'peer-id'
import PeerInfo from 'peer-info'
import { Libp2pNode } from './libp2pnode'
import { Libp2pSender } from '../protocol/libp2psender'

const defaultOptions = {
  multiaddrs: ['/ip4/0.0.0.0/tcp/0'],
  key: null,
  bootnodes: [],
}

/**
 * Libp2p peer
 * @memberof module:net/peer
 * @example
 *
 * const { Libp2pPeer } = require('./lib/net/peer')
 * import { Chain } from './lib/blockchain'
 * const { EthProtocol } = require('./lib/net/protocol')
 *
 * const chain = new Chain()
 * const protocols = [ new EthProtocol({ chain })]
 * const id = 'QmWYhkpLFDhQBwHCMSWzEebbJ5JzXWBKLJxjEuiL8wGzUu'
 * const multiaddrs = [ '/ip4/192.0.2.1/tcp/12345' ]
 *
 * new Libp2pPeer({ id, multiaddrs, protocols })
 *   .on('error', (err) => console.log('Error:', err))
 *   .on('connected', () => console.log('Connected'))
 *   .on('disconnected', (reason) => console.log('Disconnected:', reason))
 *   .connect()
 */
export class Libp2pPeer extends Peer {
  private multiaddrs: string | string[]
  private connected: boolean

  /**
   * Create new libp2p peer
   * @param {Object}      options constructor parameters
   * @param {string}      options.id peer id
   * @param {multiaddr[]} options.multiaddrs multiaddrs to listen on (can be
   * a comma separated string or list)
   * @param {Protocols[]} [options.protocols=[]] supported protocols
   * @param {Logger}      [options.logger] Logger instance
   */
  constructor(options: any) {
    super({ ...options, transport: 'libp2p' })
    options = { ...defaultOptions, ...options }

    this.multiaddrs = options.multiaddrs
    this.server = null
    this.connected = false
    this.init()
  }

  init() {
    if (typeof this.multiaddrs === 'string') {
      this.multiaddrs = this.multiaddrs.split(',')
    }
    this.address = this.multiaddrs.map((ma: string) => ma.split('/ipfs')[0]).join(',')
  }

  /**
   * Initiate peer connection
   * @return {Promise}
   */
  async connect(): Promise<void> {
    if (this.connected) {
      return
    }
    const nodeInfo = await this.createPeerInfo({ multiaddrs: ['/ip4/0.0.0.0/tcp/0'] })
    const peerInfo = await this.createPeerInfo({ multiaddrs: [] })
    const node = new Libp2pNode({ peerInfo: nodeInfo })
    await node.asyncStart()
    await node.asyncDial(peerInfo)
    await this.bindProtocols(node, peerInfo)
    this.emit('connected')
  }

  /**
   * Accept new peer connection from a libp2p server
   * @private
   * @return {Promise}
   */
  async accept(protocol: any, connection: any, server: any): Promise<void> {
    await this.bindProtocol(protocol, new Libp2pSender(connection))
    this.inbound = true
    this.server = server
  }

  /**
   * Adds protocols to the peer given a libp2p node and peerInfo
   * @private
   * @param  {Libp2pNode} node libp2p node
   * @param  {PeerInfo}   peerInfo libp2p peerInfo
   * @param  {Server}     [server] optional server that initiated connection
   * @return {Promise}
   */
  async bindProtocols(node: any, peerInfo: any, server: any = null): Promise<void> {
    await Promise.all(
      this.protocols.map(async (p: any) => {
        await p.open()
        const protocol = `/${p.name}/${p.versions[0]}`
        try {
          const conn = await node.asyncDialProtocol(peerInfo, protocol)
          await this.bindProtocol(p, new Libp2pSender(conn))
        } catch (err) {
          const id = peerInfo.id.toB58String()
          this.logger.debug(`Peer doesn't support protocol=${protocol} id=${id} ${err.stack}`)
        }
      })
    )
    this.server = server
    this.connected = true
  }

  async createPeerInfo({
    multiaddrs,
    id,
  }: {
    multiaddrs: string[]
    id?: string
  }): Promise<PeerInfo> {
    return new Promise<PeerInfo>((resolve, reject) => {
      const handler = (err: Error | null, peerInfo?: PeerInfo): any => {
        if (err) {
          return reject(err)
        }
        multiaddrs.forEach((ma) => {
          if (peerInfo) {
            peerInfo.multiaddrs.add(ma)
          }
        })
        resolve(peerInfo)
      }
      if (id) {
        // TODO: PeerInfo types are wrong...
        PeerInfo.create(
          (<unknown>PeerId.createFromB58String(id)) as PeerInfo.CreateOptions,
          handler
        )
      } else {
        PeerInfo.create(handler)
      }
    })
  }
}
