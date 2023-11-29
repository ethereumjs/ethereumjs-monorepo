import {
  ETH as Devp2pETH,
  LES as Devp2pLES,
  RLPx as Devp2pRLPx,
  SNAP as Devp2pSNAP,
} from '@ethereumjs/devp2p'
import { randomBytes, unprefixedHexToBytes } from '@ethereumjs/util'

import { Event } from '../../types'
import { RlpxSender } from '../protocol'

import {
  BoundEthProtocol,
  BoundLesProtocol,
  BoundProtocol,
  BoundSnapProtocol,
  Protocol,
  Sender,
} from '../protocol'
import type { RlpxServer, Server } from '../server'
import type { Capabilities as Devp2pCapabilities, Peer as Devp2pRlpxPeer } from '@ethereumjs/devp2p'
import { Config } from '../../config'
import { EventEmitter } from 'stream'
const devp2pCapabilities = {
  snap1: Devp2pSNAP.snap,
  eth66: Devp2pETH.eth66,
  eth67: Devp2pETH.eth67,
  eth68: Devp2pETH.eth68,
  les2: Devp2pLES.les2,
  les3: Devp2pLES.les3,
  les4: Devp2pLES.les4,
}

export interface RlpxPeerOptions {
  /* Peer hostname or ip address */
  host: string

  /* Peer port */
  port: number

  /* Config */
  config: Config

  /* Peer id */
  id?: string

  /* Pass true if peer initiated connection (default: false) */
  inbound?: boolean

  /* Supported protocols */
  protocols?: Protocol[]

  /* Server */
  server?: Server
}

/**
 * Devp2p/RLPx peer
 * @memberof module:net/peer
 * @example
 * ```typescript
 * import { RlpxPeer } from './src/net/peer'
 * import { Chain } from './src/blockchain'
 * import { EthProtocol } from './src/net/protocol'
 *
 * const chain = await Chain.create()
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
 * ```
 */
export class RlpxPeer extends EventEmitter {
  public config: Config
  public id: string
  public address: string
  public inbound: boolean
  public server: Server | undefined
  protected transport: string
  protected protocols: Protocol[]
  private _idle: boolean

  // TODO check if this should be moved into RlpxPeer
  public eth?: BoundEthProtocol
  public snap?: BoundSnapProtocol
  public les?: BoundLesProtocol

  /*
    If the peer is in the PeerPool.
    If true, messages are handled immediately.
    If false, adds incoming messages to handleMessageQueue,
    which are handled after the peer is added to the pool.
  */
  public pooled: boolean = false

  private host: string
  private port: number
  public rlpx: Devp2pRLPx | null
  public rlpxPeer: Devp2pRlpxPeer | null
  public connected: boolean
  /**
   * Create new devp2p/rlpx peer
   */
  constructor(options: RlpxPeerOptions) {
    super()

    this.config = options.config

    this.id = options.id ?? ''
    this.address = `${options.host}:${options.port}`
    this.transport = 'rlpx'
    this.inbound = options.inbound ?? false
    this.protocols = options.protocols ?? []

    this._idle = true

    /*super({
      ...options,
      transport: 'rlpx',
      address,
    })*/

    this.host = options.host
    this.port = options.port
    this.rlpx = null
    this.rlpxPeer = null
    this.connected = false
  }

  /**
   * Return devp2p/rlpx capabilities for the specified protocols
   * @param protocols protocol instances
   */
  static capabilities(protocols: Protocol[]): Devp2pCapabilities[] {
    const capabilities: Devp2pCapabilities[] = []
    for (const protocol of protocols) {
      const { name, versions } = protocol
      const keys = versions.map((v: number) => name + String(v))
      for (const key of keys) {
        const capability = devp2pCapabilities[key as keyof typeof devp2pCapabilities]
        if (capability !== undefined) {
          capabilities.push(capability)
        }
      }
    }
    return capabilities
  }

  /**
   * Initiate peer connection
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
      id: unprefixedHexToBytes(this.id),
      address: this.host,
      tcpPort: this.port,
    })

    const peerErrorHandler = (_: Devp2pRlpxPeer, error: Error) => {
      this.config.events.emit(Event.PEER_ERROR, error, this)
    }
    const peerErrorHandlerBound = peerErrorHandler.bind(this)
    const peerAddedHandler = async (rlpxPeer: Devp2pRlpxPeer) => {
      try {
        await this.bindProtocols(rlpxPeer)
        this.config.events.emit(Event.PEER_CONNECTED, this)
      } catch (error: any) {
        this.config.events.emit(Event.PEER_ERROR, error, this)
      }
    }
    const peerRemovedHandler = (rlpxPeer: Devp2pRlpxPeer) => {
      if (rlpxPeer !== this.rlpxPeer) {
        return
      }
      this.rlpxPeer = null
      this.connected = false
      this.config.events.emit(Event.PEER_DISCONNECTED, this)
      this.rlpx?.events.removeListener('peer:error', peerErrorHandlerBound)
    }
    this.rlpx.events.on('peer:error', peerErrorHandlerBound)
    this.rlpx.events.once('peer:added', peerAddedHandler.bind(this))
    this.rlpx.events.once('peer:removed', peerRemovedHandler.bind(this))
  }

  /**
   * Accept new peer connection from an rlpx server
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
   * @param rlpxPeer rlpx native peer
   */
  private async bindProtocols(rlpxPeer: Devp2pRlpxPeer): Promise<void> {
    this.rlpxPeer = rlpxPeer
    await Promise.all(
      rlpxPeer.getProtocols().map((rlpxProtocol) => {
        const name = rlpxProtocol.constructor.name.toLowerCase()
        const protocol = this.protocols.find((p) => p.name === name)
        // Since snap is running atop/besides eth, it doesn't need a separate sender
        // handshake, and can just use the eth handshake
        if (protocol && name !== 'snap') {
          const sender = new RlpxSender(rlpxProtocol as Devp2pETH | Devp2pLES | Devp2pSNAP)
          return this.addProtocol(sender, protocol).then(() => {
            if (name === 'eth') {
              const snapRlpxProtocol = rlpxPeer
                .getProtocols()
                .filter((p) => p.constructor.name.toLowerCase() === 'snap')[0]
              const snapProtocol =
                snapRlpxProtocol !== undefined
                  ? this.protocols.find(
                      (p) => p.name === snapRlpxProtocol?.constructor.name.toLowerCase()
                    )
                  : undefined
              if (snapProtocol !== undefined) {
                const snapSender = new RlpxSender(
                  snapRlpxProtocol as Devp2pETH | Devp2pLES | Devp2pSNAP
                )
                return this.addProtocol(snapSender, snapProtocol)
              }
            }
          })
        }
      })
    )
    this.connected = true
  }

  /**
   * Get idle state of peer
   */
  get idle() {
    return this._idle
  }

  /**
   * Set idle state of peer
   */
  set idle(value) {
    this._idle = value
  }

  /**
   * Handle unhandled messages along handshake
   */
  handleMessageQueue() {
    const protocols = [this.eth, this.snap, this.les]
    protocols.map((e) => {
      if (e !== undefined) {
        e.handleMessageQueue()
      }
    })
  }

  async addProtocol(sender: Sender, protocol: Protocol): Promise<void> {
    let bound: BoundProtocol
    const boundOpts = {
      config: protocol.config, // TODO: why cant we use `this.config`?
      protocol,
      peer: this,
      sender,
    }

    if (protocol.name === 'eth') {
      bound = new BoundEthProtocol(boundOpts)
    } else if (protocol.name === 'les') {
      bound = new BoundLesProtocol(boundOpts)
    } else if (protocol.name === 'snap') {
      bound = new BoundSnapProtocol(boundOpts)
    } else {
      throw new Error(`addProtocol: ${protocol.name} protocol not supported`)
    }

    // Handshake only when snap, else
    if (protocol.name !== 'snap') {
      await bound!.handshake(sender)
    } else {
      if (sender.status === undefined) throw Error('Snap can only be bound on handshaked peer')
    }

    if (protocol.name === 'eth') {
      this.eth = <BoundEthProtocol>bound
    } else if (protocol.name === 'snap') {
      this.snap = <BoundSnapProtocol>bound
    } else if (protocol.name === 'les') {
      this.les = <BoundLesProtocol>bound
    }
  }

  toString(withFullId = false): string {
    const protocols = [this.eth, this.snap, this.les]
    const properties = {
      id: withFullId ? this.id : this.id.substr(0, 8),
      address: this.address,
      transport: this.transport,
      protocols: protocols.filter((e) => e !== undefined).map((e) => (<BoundProtocol>e).name),
      inbound: this.inbound,
    }
    return Object.entries(properties)
      .filter(([, value]) => value !== undefined && value !== null && value.toString() !== '')
      .map((keyValue) => keyValue.join('='))
      .join(' ')
  }
}
