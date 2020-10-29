import * as events from 'events'
import { Protocol } from '../protocol/protocol'
import { BoundProtocol, Sender } from '../protocol'
import { Config } from '../../config'

const defaultOptions = {
  inbound: false,
  server: null,
  protocols: [],
}

/**
 * Network peer
 * @memberof module:net/peer
 */
export class Peer extends events.EventEmitter {
  public config: Config

  public id: string
  protected transport: string
  protected protocols: any[]
  private _idle: boolean
  public address: string
  public inbound: boolean
  public bound: Map<string, any>
  public server: any

  // Dynamically bound protocol properties
  public les: BoundProtocol | undefined
  public eth: BoundProtocol | undefined

  /**
   * Create new peer
   * @param {Object}      options constructor parameters
   * @param {string}      options.id peer id
   * @param {string}      [options.address] peer address
   * @param {boolean}     [options.inbound] true if peer initiated connection
   * @param {string}      [options.transport] transport name
   * @param {Protocols[]} [options.protocols=[]] supported protocols
   */
  constructor(options: any) {
    super()

    options = { ...defaultOptions, ...options }
    this.config = options.config

    this.id = options.id
    this.address = options.address
    this.inbound = options.inbound
    this.transport = options.transport
    this.protocols = options.protocols
    this.bound = new Map()
    this.server = options.server

    this._idle = true
  }

  /**
   * Get idle state of peer
   * @type {boolean}
   */
  get idle() {
    return this._idle
  }

  /**
   * Set idle state of peer
   * @type {boolean}
   */
  set idle(value) {
    this._idle = value
  }

  /**
   * Adds a protocol to this peer given a sender instance. Protocol methods
   * will be accessible via a field with the same name as protocol. New methods
   * will be added corresponding to each message defined by the protocol, in
   * addition to send() and request() methods that takes a message name and message
   * arguments. send() only sends a message without waiting for a response, whereas
   * request() also sends the message but will return a promise that resolves with
   * the response payload.
   * @protected
   * @param  {Protocol}  protocol protocol instance
   * @param  {Sender}    sender Sender instance provided by subclass
   * @return {Promise}
   * @example
   *
   * await peer.bindProtocol(ethProtocol, sender)
   * // Example: Directly call message name as a method on the bound protocol
   * const headers1 = await peer.eth.getBlockHeaders(1, 100, 0, 0)
   * // Example: Call request() method with message name as first parameter
   * const headers2 = await peer.eth.request('getBlockHeaders', 1, 100, 0, 0)
   * // Example: Call send() method with message name as first parameter and
   * // wait for response message as an event
   * peer.eth.send('getBlockHeaders', 1, 100, 0, 0)
   * peer.eth.on('message', ({ data }) => console.log(`Received ${data.length} headers`))
   */
  async bindProtocol(protocol: Protocol, sender: Sender): Promise<void> {
    const bound = await protocol.bind(this, sender)
    bound.on('message', (message: any) => {
      this.emit('message', message, protocol.name)
    })
    bound.on('error', (error: Error) => {
      this.emit('error', error, protocol.name)
    })
    this.bound.set(bound.name, bound)
  }

  /**
   * Return true if peer understand the specified protocol name
   * @param protocolName
   */
  understands(protocolName: string): boolean {
    return !!this.bound.get(protocolName)
  }

  toString(withFullId = false): string {
    const properties = {
      id: withFullId ? this.id : this.id.substr(0, 8),
      address: this.address,
      transport: this.transport,
      protocols: Array.from(this.bound.keys()),
      inbound: this.inbound || null,
    }
    return Object.entries(properties)
      .filter(([, value]) => value !== undefined && value !== null && value.toString() !== '')
      .map((keyValue) => keyValue.join('='))
      .join(' ')
  }
}
