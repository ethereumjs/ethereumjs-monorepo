import { Sender } from './sender'
import { rlp } from 'ethereumjs-util'

/**
 * DevP2P/RLPx protocol sender
 * @emits message
 * @emits status
 * @memberof module:net/protocol
 */
export class RlpxSender extends Sender {
  private sender: any
  /**
   * Creates a new DevP2P/Rlpx protocol sender
   * @param {Object} rlpxProtocol protocol object from ethereumjs-devp2p
   */
  constructor(rlpxProtocol: any) {
    super()

    this.sender = rlpxProtocol
    this.sender.on('status', (status: any) => {
      this.status = status
    })
    this.sender.on('message', (code: number, payload: any) => {
      this.emit('message', { code, payload })
    })
  }

  /**
   * Send a status to peer
   * @param  {Object} status
   */
  sendStatus(status: any) {
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
  sendMessage(code: number, data: any) {
    try {
      this.sender._send(code, rlp.encode(data))
    } catch (err) {
      this.emit('error', err)
    }
  }
}
