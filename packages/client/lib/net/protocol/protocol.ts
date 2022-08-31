import { BoundProtocol } from './boundprotocol'

import type { Config } from '../../config'
import type { Peer } from '../peer/peer'
import type { Sender } from './sender'

export interface ProtocolOptions {
  config: Config

  /* Handshake timeout in ms (default: 8000) */
  timeout?: number
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

  /**
   * Create new protocol
   */
  constructor(options: ProtocolOptions) {
    this.config = options.config
    this.timeout = options.timeout ?? 8000

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
  get name() {
    return 'protocol'
  }

  /**
   * Protocol versions supported
   */
  get versions(): number[] {
    throw new Error('Unimplemented')
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
  }
}
