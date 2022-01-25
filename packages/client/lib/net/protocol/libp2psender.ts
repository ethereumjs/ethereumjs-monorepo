import pipe from 'it-pipe'
import pushable from 'it-pushable'
import { arrToBufArr, bufferToInt, bufArrToArr } from 'ethereumjs-util'
import RLP from 'rlp'
import { Libp2pMuxedStream as MuxedStream } from '../../types'
import { Sender } from './sender'

// TypeScript doesn't have support yet for ReturnType
// with generic types, so this wrapper is used as a helper.
const wrapperPushable = () => pushable<Buffer>()
type Pushable = ReturnType<typeof wrapperPushable>

/**
 * Libp2p protocol sender
 * @emits message
 * @emits status
 * @memberof module:net/protocol
 */
export class Libp2pSender extends Sender {
  private stream: MuxedStream
  private pushable: Pushable

  /**
   * Creates a new Libp2p protocol sender
   * @param stream stream to libp2p peer
   */
  constructor(stream: MuxedStream) {
    super()

    this.stream = stream
    this.pushable = pushable()
    this.init()
  }

  init() {
    // outgoing stream
    pipe(this.pushable, this.stream)

    // incoming stream
    void pipe(this.stream, async (source: any) => {
      for await (const bl of source) {
        // convert BufferList to Buffer
        const data: Buffer = bl.slice()
        try {
          const [codeBuf, payload]: any = arrToBufArr(RLP.decode(Uint8Array.from(data)))
          const code = bufferToInt(codeBuf)
          if (code === 0) {
            const status: any = {}
            payload.forEach(([k, v]: any) => {
              status[k.toString()] = v
            })
            this.status = status
          } else {
            this.emit('message', { code, payload })
          }
        } catch (error: any) {
          this.emit('error', error)
        }
      }
    })
  }

  /**
   * Send a status to peer
   * @param status
   */
  sendStatus(status: any) {
    const payload: any = Object.entries(status).map(([k, v]) => [k, v])
    this.pushable.push(Buffer.from(RLP.encode(bufArrToArr([0, payload]))))
  }

  /**
   * Send a message to peer
   * @param code message code
   * @param data message payload
   */
  sendMessage(code: number, data: any) {
    this.pushable.push(Buffer.from(RLP.encode(bufArrToArr([code, data]))))
  }
}
