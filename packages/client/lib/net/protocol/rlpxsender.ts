import { Sender } from './sender'
import { ETH as Devp2pETH, LES as Devp2pLES } from '@ethereumjs/devp2p'

/**
 * DevP2P/RLPx protocol sender
 * @emits message
 * @emits status
 * @memberof module:net/protocol
 */
export class RlpxSender extends Sender {
  private sender: Devp2pETH | Devp2pLES
  /**
   * Creates a new DevP2P/Rlpx protocol sender
   * @param {Object} rlpxProtocol protocol object from @ethereumjs/devp2p
   */
  constructor(rlpxProtocol: Devp2pETH | Devp2pLES) {
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
      //@ts-ignore "type number is not assignable to type never"
      this.sender.sendMessage(code, data)
    } catch (err) {
      this.emit('error', err)
    }
  }
}
