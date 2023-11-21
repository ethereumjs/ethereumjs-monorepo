import type { Config } from '../../config'
import type { Peer } from '../peer/peer'
import type { Sender } from './sender'
import { Event } from '../../types'

export interface ProtocolOptions {
  config: Config

  /* Handshake timeout in ms (default: 8000) */
  timeout?: number

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
export abstract class Protocol {
  public config: Config
  public timeout: number
  public opened: boolean

  private peer: Peer
  private sender: Sender
  private _status: any
  private resolvers: Map<string | number, any>
  private messageQueue: Message[] = []

  /**
   * Create new protocol
   */
  constructor(options: ProtocolOptions) {
    this.config = options.config
    this.timeout = options.timeout ?? 8000

    this.peer = options.peer
    this.sender = options.sender
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
          resolve(this.decodeStatus(status))
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
   * Abstract getter for name of protocol
   */
  abstract get name(): string

  /**
   * Abstract getter for versions of the protocol
   */
  abstract get versions(): number[]

  /**
   * Messages defined by this protocol
   */
  abstract get messages(): Message[]

  /**
   * Encodes status into status message payload. Must be implemented by subclass.
   * TODO: should be removed (?)
   */
  abstract encodeStatus(): any

  /**
   * Decodes status message payload into a status object.  Must be implemented
   * by subclass.
   * @param _status status message payload
   */
  abstract decodeStatus(_status: any): any

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
  async connect(): Promise<void> {
    // Handshake only when snap, else
    if (this.name !== 'snap') {
      await this.handshake(this.sender)
    } else {
      if (this.sender.status === undefined) throw Error('Snap can only be bound on handshaked peer')
    }
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
    const messages = this.messages
    const message = messages.find((m) => m.code === incoming.code)
    if (!message) {
      return
    }

    let data
    let error
    try {
      data = this.decode(message, incoming.payload)
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
          this.name,
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
    const messages = this.messages
    const message = messages.find((m) => m.name === name)
    if (message) {
      const encoded = this.encode(message, args)
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
}
