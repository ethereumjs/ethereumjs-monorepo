import { EventEmitter } from 'events'
import { BoundProtocol } from './boundprotocol'
import { Sender } from './sender'
import { Peer } from '../peer/peer'
import { defaultLogger } from '../../logging'

const defaultOptions = {
  logger: defaultLogger,
  timeout: 8000,
}

export type Message = {
  name: string
  code: number
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
export class Protocol extends EventEmitter {
  public timeout: number
  public opened: boolean
  public logger: any

  /**
   * Create new protocol
   * @param {Object}   options constructor parameters
   * @param {number}   [options.timeout=8000] handshake timeout in ms
   * @param {Logger}   [options.logger] logger instance
   */
  constructor(options?: any) {
    super()
    options = { ...defaultOptions, ...options }
    this.logger = options.logger
    this.timeout = options.timeout
    this.opened = false
  }

  /**
   * Opens protocol and any associated dependencies
   * @return {Promise}
   */
  async open(): Promise<boolean | void> {
    this.opened = true
  }

  /**
   * Perform handshake given a sender from subclass.
   * @private
   * @return {Promise}
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
        if (timeout) {
          clearTimeout(timeout)
          resolve(this.decodeStatus(status))
        }
      }
      if (sender.status) {
        handleStatus(sender.status)
      } else {
        sender.once('status', handleStatus)
      }
    })
  }

  /**
   * Abstract getter for name of protocol
   * @type {string}
   */
  get name(): string {
    return 'protocol'
  }

  /**
   * Protocol versions supported
   * @type {number[]}
   */
  get versions(): number[] {
    throw new Error('Unimplemented')
  }

  /**
   * Messages defined by this protocol
   * @type {Protocol~Message[]}
   */
  get messages(): Message[] {
    throw new Error('Unimplemented')
  }

  /**
   * Encodes status into status message payload. Must be implemented by subclass.
   * @return {Object}
   */
  encodeStatus(): any {
    throw new Error('Unimplemented')
  }

  /**
   * Decodes status message payload into a status object.  Must be implemented
   * by subclass.
   * @param {Object} status status message payload
   * @return {Object}
   */
  decodeStatus(_status: any): any {
    throw new Error('Unimplemented')
  }

  /**
   * Encodes message into proper format before sending
   * @protected
   * @param message message definition
   * @param {*} args message arguments
   * @return {*}
   */
  encode(message: Message, args: any): any {
    if (message.encode) {
      return message.encode(args)
    }
    return args
  }

  /**
   * Decodes message payload
   * @protected
   * @param message message definition
   * @param {*} payload message payload
   * @param {BoundProtocol} bound reference to bound protocol
   * @return {*}
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
   * @param  {Peer}    peer peer
   * @param  {Sender}  sender sender
   * @return {Promise}
   */
  async bind(peer: Peer, sender: Sender): Promise<BoundProtocol> {
    const bound = new BoundProtocol({
      protocol: this,
      peer: peer,
      sender: sender,
    })
    await bound.handshake(sender)
    //@ts-ignore TODO: evaluate this line
    peer[this.name] = bound
    return bound
  }
}
