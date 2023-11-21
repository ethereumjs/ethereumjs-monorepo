import { EventEmitter } from 'events'

import type { Config } from '../../config'
import type { EthProtocol, LesProtocol, Protocol, Sender, SnapProtocol } from '../protocol'
import type { Server } from '../server'

export interface PeerOptions {
  /* Config */
  config: Config

  /* Peer id */
  id?: string

  /* Peer address */
  address: string

  /* Transport name */
  transport: string

  /* Pass true if peer initiated connection (default: false) */
  inbound?: boolean

  /* Supported protocols */
  protocols?: Protocol[]

  /* Server */
  server?: Server
}

/**
 * Network peer
 * @memberof module:net/peer
 */
export class Peer extends EventEmitter {
  public config: Config
  public id: string
  public address: string
  public inbound: boolean
  public server: Server | undefined
  protected transport: string
  protected protocols: Protocol[]
  private _idle: boolean

  /*
    If the peer is in the PeerPool.
    If true, messages are handled immediately.
    If false, adds incoming messages to handleMessageQueue,
    which are handled after the peer is added to the pool.
  */
  public pooled: boolean = false

  // Dynamically bound protocol properties
  // TODO: move this into RlpxPeer
  public eth?: EthProtocol
  public snap?: SnapProtocol
  public les?: LesProtocol

  /**
   * Create new peer
   */
  constructor(options: PeerOptions) {
    super()

    this.config = options.config

    this.id = options.id ?? ''
    this.address = options.address
    this.transport = options.transport
    this.inbound = options.inbound ?? false
    this.protocols = options.protocols ?? []

    this._idle = true
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

  async connect(): Promise<void> {}

  /**
   * Return true if peer understand the specified protocol name
   * TODO: used nowhere, can likely remove
   * @param protocolName
   */
  /*understands(protocolName: string): boolean {
    return !!this.bound.get(protocolName)
  }*/

  /**
   * Handle unhandled messages along handshake
   */
  handleMessageQueue() {
    for (const protocol of [this.eth, this.les, this.snap]) {
      if (protocol !== undefined) {
        protocol.handleMessageQueue()
      }
    }
  }

  toString(withFullId = false): string {
    const protocols = [this.eth, this.snap, this.les]
      .map((e) => e?.name)
      .filter((e) => e !== undefined)
    const properties = {
      id: withFullId ? this.id : this.id.substr(0, 8),
      address: this.address,
      transport: this.transport,
      protocols,
      inbound: this.inbound,
    }
    return Object.entries(properties)
      .filter(([, value]) => value !== undefined && value !== null && value.toString() !== '')
      .map((keyValue) => keyValue.join('='))
      .join(' ')
  }
}
