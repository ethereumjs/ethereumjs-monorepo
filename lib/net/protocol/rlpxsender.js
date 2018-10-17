'use strict'

const Sender = require('./sender')
const rlp = require('ethereumjs-util').rlp

/**
 * DevP2P/RLPx protocol sender
 * @emits message
 * @emits status
 * @memberof module:net/protocol
 */
class RlpxSender extends Sender {
  /**
   * Creates a new DevP2P/Rlpx protocol sender
   * @param {Object} rlpxProtocol protocol object from ethereumjs-devp2p
   */
  constructor (rlpxProtocol) {
    super()

    this.sender = rlpxProtocol
    this.sender.on('status', (status) => {
      this.status = status
    })
    this.sender.on('message', (code, payload) => {
      this.emit('message', { code, payload })
    })
  }

  /**
   * Send a status to peer
   * @param  {Object} status
   */
  sendStatus (status) {
    try {
      this.sender.sendStatus(status)
    } catch (err) {
      this.emit('error', err)
    }
  }

  /**
   * Send a message to peer
   * @param  {number} code message code
   * @param  {*}      data message payload
   */
  sendMessage (code, data) {
    try {
      this.sender._send(code, rlp.encode(data))
    } catch (err) {
      this.emit('error', err)
    }
  }
}

module.exports = RlpxSender
