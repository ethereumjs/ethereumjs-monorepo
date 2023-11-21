import { EventEmitter } from 'events'

import type { Config } from '../../config'
import type {
  BoundEthProtocol,
  BoundLesProtocol,
  BoundProtocol,
  BoundSnapProtocol,
  Protocol,
} from '../protocol'
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
export abstract class Peer extends EventEmitter {
  public config: Config
  public id: string
  public address: string
  public inbound: boolean
  public server: Server | undefined
  protected transport: string
  protected protocols: Protocol[]
  protected boundProtocols: BoundProtocol[] = []
  private _idle: boolean

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

  abstract connect(): Promise<void>

  /**
   * Handle unhandled messages along handshake
   */
  handleMessageQueue() {
    this.boundProtocols.map((e) => e.handleMessageQueue())
  }

  toString(withFullId = false): string {
    const properties = {
      id: withFullId ? this.id : this.id.substr(0, 8),
      address: this.address,
      transport: this.transport,
      protocols: this.boundProtocols.map((e) => e.name),
      inbound: this.inbound,
    }
    return Object.entries(properties)
      .filter(([, value]) => value !== undefined && value !== null && value.toString() !== '')
      .map((keyValue) => keyValue.join('='))
      .join(' ')
  }
}
