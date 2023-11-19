import { Event } from '../../types'

import type { Config } from '../../config'
import type { Peer } from '../peer/peer'
import type { Sender } from './sender'

export interface ProtocolOptions {
  config: Config

  /* Handshake timeout in ms (default: 8000) */
  timeout?: number

  /* Protocol */
  protocol: Protocol

  /* Peer */
  peer: Peer

  /* Sender */
  sender: Sender
}

export type Message = {
  name: string
  code: number
  payload?: any
  // TODO: check semantics of this field
  response?: number
  // TODO: check if this should be optional
  encode?: Function
  // TODO: check if this should be optional
  decode?: Function
}

/**
 * Protocol message
 * @typedef {Object} Protocol~Message
 * @property {string} name message name
 * @property {number} code message code
 * @property {response} response code of response message
 * @property {boolean} flow true if message includes flow control
 * @property {function(...*): *} encode encode message arguments
 * @property {function(*): *} decode decodes message payload
 */

/**
 * Base class for all wire protocols
 * @memberof module:net/protocol
 */
export class Protocol {
  public config: Config
  public timeout: number
  public opened: boolean

  public name: string
  private protocol: Protocol
  private peer: Peer
  private sender: Sender
  public versions: number[]
  private _status: any
  private resolvers: Map<string | number, any>
  private messageQueue: Message[] = []

  /**
   * Create new protocol
   */
  constructor(options: ProtocolOptions) {
    this.config = options.config
    this.timeout = options.timeout ?? 8000

    this.config = options.config

    this.protocol = options.protocol
    this.peer = options.peer
    this.sender = options.sender
    this.name = this.protocol.name
    this.versions = this.protocol.versions
    this.timeout = this.protocol.timeout
    this._status = {}
    this.resolvers = new Map()
    this.sender.on('message', (message: any) => {
      try {
        if (this.peer.pooled) {
          this.handle(message)
        } else {
          this.messageQueue.push(message)
          // Expected message queue growth is in the single digits
          // so this adds a guard here if something goes wrong
          if (this.messageQueue.length >= 50) {
            const error = new Error('unexpected message queue growth for peer')
            this.config.events.emit(Event.PROTOCOL_ERROR, error, this.peer)
          }
        }
      } catch (error: any) {
        this.config.events.emit(Event.PROTOCOL_ERROR, error, this.peer)
      }
    })
    this.sender.on('error', (error: Error) =>
      this.config.events.emit(Event.PROTOCOL_ERROR, error, this.peer)
    )

    this.opened = false
  }

  get status(): any {
    return this._status
  }

  set status(status: any) {
    Object.assign(this._status, status)
  }

  /**
   * Handle incoming message
   * @param message message object
   * @emits {@link Event.PROTOCOL_MESSAGE}
   * @emits {@link Event.PROTOCOL_ERROR}
   */
  private handle(incoming: Message) {
    const messages = this.protocol.messages
    const message = messages.find((m) => m.code === incoming.code)
    if (!message) {
      return
    }

    let data
    let error
    try {
      data = this.protocol.decode(message, incoming.payload)
    } catch (e: any) {
      error = new Error(`Could not decode message ${message.name}: ${e}`)
    }
    const resolver = this.resolvers.get(incoming.code)
    if (resolver !== undefined) {
      clearTimeout(resolver.timeout)
      this.resolvers.delete(incoming.code)
      if (error) {
        resolver.reject(error)
      } else {
        resolver.resolve(data)
      }
    } else {
      if (error) {
        this.config.events.emit(Event.PROTOCOL_ERROR, error, this.peer)
      } else {
        this.config.events.emit(
          Event.PROTOCOL_MESSAGE,
          { name: message.name, data },
          this.protocol.name,
          this.peer
        )
      }
    }
  }

  /**
   * Handle unhandled messages along handshake
   */
  handleMessageQueue() {
    for (const message of this.messageQueue) {
      this.handle(message)
    }
  }

  /**
   * Send message with name and the specified args
   * @param name message name
   * @param args message arguments
   */
  send(name: string, args?: any) {
    const messages = this.protocol.messages
    const message = messages.find((m) => m.name === name)
    if (message) {
      const encoded = this.protocol.encode(message, args)
      this.sender.sendMessage(message.code, encoded)
    } else {
      throw new Error(`Unknown message: ${name}`)
    }
    return message
  }

  /**
   * Returns a promise that resolves with the message payload when a response
   * to the specified message is received
   * @param name message to wait for
   * @param args message arguments
   */
  async request(name: string, args: any[]): Promise<any> {
    const message = this.send(name, args)
    let lock
    if (
      typeof message.response === 'number' &&
      this.resolvers.get(message.response) !== undefined
    ) {
      const res = this.resolvers.get(message.response)
      lock = res.lock
      await res.lock.acquire()
    }
    const resolver: any = {
      timeout: null,
      resolve: null,
      reject: null,
      lock: lock ?? new Lock(),
    }
    this.resolvers.set(message.response!, resolver)
    if (lock === undefined) {
      await resolver.lock.acquire()
    }
    return new Promise((resolve, reject) => {
      resolver.resolve = function (e: any) {
        resolver.lock.release()
        resolve(e)
      }
      resolver.reject = function (e: any) {
        resolver.lock.release()
        reject(e)
      }
      resolver.timeout = setTimeout(() => {
        resolver.timeout = null
        this.resolvers.delete(message.response!)
        resolver.reject(new Error(`Request timed out after ${this.timeout}ms`))
      }, this.timeout)
    })
  }

  /**
   * Opens protocol and any associated dependencies
   */
  async open(): Promise<boolean | void> {
    this.opened = true
  }

  /**
   * Perform handshake given a sender from subclass.
   */
  async handshake(sender: Sender) {
    const status = this.encodeStatus()
    sender.sendStatus(status)
    return new Promise((resolve, reject) => {
      let timeout: any = setTimeout(() => {
        timeout = null
        reject(new Error(`Handshake timed out after ${this.timeout}ms`))
      }, this.timeout)
      const handleStatus = (status: any) => {
        if (timeout !== null && timeout !== 0) {
          clearTimeout(timeout)
          this._status = this.decodeStatus(status)
        }
      }
      if (sender.status !== undefined && sender.status !== null && sender.status !== 0) {
        handleStatus(sender.status)
      } else {
        sender.once('status', handleStatus)
      }
    })
  }

  /**
   * Messages defined by this protocol
   */
  get messages(): Message[] {
    throw new Error('Unimplemented')
  }

  /**
   * Encodes status into status message payload. Must be implemented by subclass.
   */
  encodeStatus(): any {
    throw new Error('Unimplemented')
  }

  /**
   * Decodes status message payload into a status object.  Must be implemented
   * by subclass.
   * @param _status status message payload
   */
  decodeStatus(_status: any): Object {
    throw new Error('Unimplemented')
  }

  /**
   * Encodes message into proper format before sending
   * @param message message definition
   * @param args message arguments
   */
  encode(message: Message, args: any): any {
    if (message.encode) {
      return message.encode(args)
    }
    return args
  }

  /**
   * Decodes message payload
   * @param message message definition
   * @param payload message payload
   */
  decode(message: Message, payload: any): any {
    if (message.decode) {
      return message.decode(payload)
    }
    return payload
  }

  /**
   * Binds this protocol to a given peer using the specified sender to handle
   * message communication.
   * @param peer peer
   * @param sender sender
   */
  /* TODO FIXME
  async bind(peer: Peer, sender: Sender): Promise<BoundProtocol> {
    const bound = new BoundProtocol({
      config: this.config,
      protocol: this,
      peer,
      sender,
    })
    // Handshake only when snap, else
    if (this.name !== 'snap') {
      await bound.handshake(sender)
    } else {
      if (sender.status === undefined) throw Error('Snap can only be bound on handshaked peer')
    }
    //@ts-ignore TODO: evaluate this line
    peer[this.name] = bound
    return bound
  }*/
}
