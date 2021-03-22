import { randomBytes } from 'crypto'
import {
  Capabilities as Devp2pCapabilities,
  ETH as Devp2pETH,
  LES as Devp2pLES,
  Peer as Devp2pRlpxPeer,
  RLPx as Devp2pRLPx,
} from '@ethereumjs/devp2p'
import { Protocol, RlpxSender } from '../protocol'
import { Peer, PeerOptions } from './peer'
import { RlpxServer } from '../server'

const devp2pCapabilities: any = {
  eth63: Devp2pETH.eth63,
  eth64: Devp2pETH.eth64,
  eth65: Devp2pETH.eth65,
  les2: Devp2pLES.les2,
}

export interface RlpxPeerOptions extends Omit<PeerOptions, 'address' | 'transport'> {
  /* Peer hostname or ip address */
  host: string

  /* Peer port */
  port: number
}

/**
 * Devp2p/RLPx peer
 * @memberof module:net/peer
 * @example
 *
 * import { RlpxPeer } from './lib/net/peer'
 * import { Chain } from './lib/blockchain'
 * import { EthProtocol } from './lib/net/protocol'
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
export class RlpxPeer extends Peer {
  private host: string
  private port: number
  public rlpx: Devp2pRLPx | null
  public rlpxPeer: Devp2pRlpxPeer | null
  public connected: boolean

  /**
   * Create new devp2p/rlpx peer
   * @param {RlpxPeerOptions}
   */
  constructor(options: RlpxPeerOptions) {
    const address = `${options.host}:${options.port}`
    super({
      ...options,
      transport: 'rlpx',
      address,
    })

    this.host = options.host
    this.port = options.port
    this.rlpx = null
    this.rlpxPeer = null
    this.connected = false
  }

  /**
   * Return devp2p/rlpx capabilities for the specified protocols
   * @param  {Protocols[]} protocols protocol instances
   * @return {Object[]} capabilities
   */
  static capabilities(protocols: Protocol[]): Devp2pCapabilities[] {
    const capabilities: Devp2pCapabilities[] = []
    protocols.forEach((protocol) => {
      const { name, versions } = protocol
      const keys = versions.map((v: number) => name + String(v))
      keys.forEach((key: any) => {
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
  async connect(): Promise<void> {
    if (this.connected) {
      return
    }
    const key = randomBytes(32)
    await Promise.all(this.protocols.map((p) => p.open()))
    this.rlpx = new Devp2pRLPx(key, {
      capabilities: RlpxPeer.capabilities(this.protocols),
      common: this.config.chainCommon,
    })
    await this.rlpx.connect({
      id: Buffer.from(this.id, 'hex'),
      address: this.host,
      tcpPort: this.port,
    })
    this.rlpx.on('peer:error', (rlpxPeer: Devp2pRlpxPeer, error: Error) => {
      this.emit('error', error)
    })
    this.rlpx.once('peer:added', async (rlpxPeer: Devp2pRlpxPeer) => {
      try {
        await this.bindProtocols(rlpxPeer)
        this.emit('connected')
      } catch (error) {
        this.emit('error', error)
      }
    })
    this.rlpx.once('peer:removed', (rlpxPeer: Devp2pRlpxPeer, reason: any) => {
      try {
        if (rlpxPeer !== this.rlpxPeer) {
          return
        }
        reason = rlpxPeer.getDisconnectPrefix(reason)
        this.rlpxPeer = null
        this.connected = false
        this.emit('disconnected', reason as string)
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
  async accept(rlpxPeer: Devp2pRlpxPeer, server: RlpxServer): Promise<void> {
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
  async bindProtocols(rlpxPeer: Devp2pRlpxPeer): Promise<void> {
    this.rlpxPeer = rlpxPeer
    await Promise.all(
      rlpxPeer.getProtocols().map((rlpxProtocol) => {
        const name = rlpxProtocol.constructor.name.toLowerCase()
        const protocol = this.protocols.find((p) => p.name === name)
        if (protocol) {
          return this.bindProtocol(protocol, new RlpxSender(rlpxProtocol))
        }
      })
    )
    this.connected = true
  }
}
