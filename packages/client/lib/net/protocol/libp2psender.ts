import { RLP } from '@ethereumjs/rlp'
import { bytesToInt, bytesToUtf8, intToBytes, utf8ToBytes } from '@ethereumjs/util'
import * as pipe from 'it-pipe'
import * as pushable from 'it-pushable'

import { Sender } from './sender'

import type { Libp2pMuxedStream as MuxedStream } from '../../types'
import type { NestedUint8Array } from '@ethereumjs/util'

// TypeScript doesn't have support yet for ReturnType
// with generic types, so this wrapper is used as a helper.
const wrapperPushable = () => pushable<Uint8Array>()
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
    pipe.pipe(this.pushable, this.stream)

    // incoming stream
    void pipe.pipe(this.stream, async (source: any) => {
      for await (const bl of source) {
        // convert BytesList to Uint8Array
        const data: Uint8Array = bl.slice()
        try {
          const [codeBuf, payload] = RLP.decode(Uint8Array.from(data))
          const code = bytesToInt(codeBuf as Uint8Array)
          if (code === 0) {
            const status: any = {}
            for (const [k, v] of (payload as NestedUint8Array).values()) {
              status[bytesToUtf8(k as Uint8Array)] = v
            }
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
    const payload: any = Object.entries(status).map(([k, v]) => [utf8ToBytes(k), v])
    this.pushable.push(RLP.encode([intToBytes(0), payload]))
  }

  /**
   * Send a message to peer
   * @param code message code
   * @param data message payload
   */
  sendMessage(code: number, data: any) {
    this.pushable.push(RLP.encode([intToBytes(code), data]))
  }
}
