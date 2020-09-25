
const Sender = require('./sender')
const util = require('ethereumjs-util')
const pull = require('pull-stream')
const catcher = require('pull-catch')
const Pushable = require('pull-pushable')
const rlp = util.rlp

/**
 * Libp2p protocol sender
 * @emits message
 * @emits status
 * @memberof module:net/protocol
 */
class Libp2pSender extends Sender {
  /**
   * Creates a new Libp2p protocol sender
   * @param {Connection} connection  connection to libp2p peer
   */
  constructor (connection) {
    super()

    this.connection = connection
    this.pushable = Pushable()
    this.init()
  }

  init () {
    // outgoing stream
    pull(
      this.pushable,
      catcher(e => this.error(e)),
      this.connection
    )

    // incoming stream
    pull(
      this.connection,
      catcher(e => this.error(e)),
      pull.drain(message => {
        let [code, payload] = rlp.decode(message)
        code = util.bufferToInt(code)
        if (code === 0) {
          const status = {}
          payload.forEach(([k, v]) => {
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
  sendStatus (status) {
    const payload = Object.entries(status).map(([k, v]) => [k, v])
    this.pushable.push(rlp.encode([ 0, payload ]))
  }

  /**
   * Send a message to peer
   * @param  {number} code message code
   * @param  {*}      data message payload
   */
  sendMessage (code, data) {
    this.pushable.push(rlp.encode([ code, data ]))
  }

  /**
   * Handle pull stream errors
   * @param  {Error} error error
   */
  error (error) {
    this.emit('error', error)
  }
}

module.exports = Libp2pSender
