import { BIGINT_NEG1 } from '@ethereumjs/util'
import { EventEmitter } from 'events'

import type { Config } from '../../config'
import type {
  EthProtocolMethods,
  LesProtocolMethods,
  Protocol,
  Sender,
  SnapProtocolMethods,
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
  private _idle: boolean

  /*
    If the peer is in the PeerPool.
    If true, messages are handled immediately.
    If false, adds incoming messages to handleMessageQueue,
    which are handled after the peer is added to the pool.
  */
  public pooled: boolean = false

  // Dynamically bound protocol properties
  // TODO: interfaces
  public eth: (BoundProtocol & EthProtocolMethods) | undefined
  public snap: (BoundProtocol & SnapProtocolMethods) | undefined
  public les: (BoundProtocol & LesProtocolMethods) | undefined

  // Dynamic `peerScore` used to score peers by `best()`
  // For `eth` protocol, this is the chain height of the peer
  public peerScore: bigint

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

    this.peerScore = BIGINT_NEG1
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
  abstract handleMessageQueue(): Promise<void>

  abstract availableProtocols(): string[]

  toString(withFullId = false): string {
    const properties = {
      id: withFullId ? this.id : this.id.substr(0, 8),
      address: this.address,
      transport: this.transport,
      protocols: this.availableProtocols,
      inbound: this.inbound,
    }
    return Object.entries(properties)
      .filter(([, value]) => value !== undefined && value !== null && value.toString() !== '')
      .map((keyValue) => keyValue.join('='))
      .join(' ')
  }
}
