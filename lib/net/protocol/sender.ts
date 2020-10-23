import { EventEmitter } from 'events'

/**
 * Base class for transport specific message sender/receiver. Subclasses should
 * emit a message event when the sender receives a new message, and they should
 * emit a status event when the sender receives a handshake status message
 * @emits message
 * @emits status
 * @memberof module:net/protocol
 */
export class Sender extends EventEmitter {
  private _status: any

  constructor() {
    super()
    this._status = null
  }

  get status(): any {
    return this._status
  }

  set status(status: any) {
    this._status = status
    this.emit('status', status)
  }

  /**
   * Send a status to peer
   * @protected
   * @param  {Object} status
   */
  sendStatus(_status: any) {
    throw new Error('Unimplemented')
  }

  /**
   * Send a message to peer
   * @protected
   * @param  {number} code message code
   * @param  {Array|Buffer} rlpEncodedData rlp encoded message payload
   */
  sendMessage(_code: number, _rlpEncodedData: any[] | Buffer) {
    throw new Error('Unimplemented')
  }
}
