
const Sender = require('./sender')
import { bufferToInt, rlp } from 'ethereumjs-util'
const pull = require('pull-stream')
const catcher = require('pull-catch')
const Pushable = require('pull-pushable')

/**
 * Libp2p protocol sender
 * @emits message
 * @emits status
 * @memberof module:net/protocol
 */
export = module.exports = class Libp2pSender extends Sender {
  /**
   * Creates a new Libp2p protocol sender
   * @param {Connection} connection  connection to libp2p peer
   */
  constructor (connection: any) {
    super()

    this.connection = connection
    this.pushable = Pushable()
    this.init()
  }

  init () {
    // outgoing stream
    pull(
      this.pushable,
      catcher((e: Error) => this.error(e)),
      this.connection
    )

    // incoming stream
    pull(
      this.connection,
      catcher((e: Error) => this.error(e)),
      pull.drain((message: any) => {
        let [code, payload]: any = rlp.decode(message)
        code = bufferToInt(code)
        if (code === 0) {
          const status: any = {}
          payload.forEach(([k, v]: any) => {
            status[k.toString()] = v
          })
          this.status = status
        } else {
          this.emit('message', { code, payload })
        }
      })
    )
  }

  /**
   * Send a status to peer
   * @param  {Object} status
   */
  sendStatus (status: any) {
    const payload: any = Object.entries(status).map(([k, v]) => [k, v])
    this.pushable.push(rlp.encode([ 0, payload ]))
  }

  /**
   * Send a message to peer
   * @param  {number} code message code
   * @param  {*}      data message payload
   */
  sendMessage (code: number, data: any) {
    this.pushable.push(rlp.encode([ code, data ]))
  }

  /**
   * Handle pull stream errors
   * @param  error error
   */
  error (error: Error) {
    this.emit('error', error)
  }
}
