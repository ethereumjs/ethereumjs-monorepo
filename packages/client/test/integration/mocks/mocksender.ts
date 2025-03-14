import { Sender } from '../../../src/net/protocol/index.ts'

import type { EventEmitter } from 'eventemitter3'
import type { Pushable } from 'it-pushable'

export class MockSender extends Sender {
  public protocol: string
  public pushable: Pushable<unknown>
  public receiver: EventEmitter

  constructor(protocol: string, pushable: Pushable<unknown>, receiver: EventEmitter) {
    super()

    this.protocol = protocol
    this.pushable = pushable
    this.receiver = receiver
    this.init()
  }

  init() {
    this.receiver.on('data', ([protocol, code, payload]) => {
      if (protocol !== this.protocol) return
      if (code === 0) {
        this.status = payload
      } else {
        this.emit('message', { code, payload })
      }
    })
  }

  sendStatus(status: any) {
    this.pushable.push([this.protocol, 0, status])
  }

  sendMessage(code: any, data: any) {
    this.pushable.push([this.protocol, code, data])
  }
}
