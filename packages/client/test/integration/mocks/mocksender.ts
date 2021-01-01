import EventEmitter from 'events'
import { Sender } from '../../../lib/net/protocol'
import { Pushable } from './mockpeer'

export default class MockSender extends Sender {
  public protocol: string
  public pushable: Pushable
  public receiver: EventEmitter

  constructor(protocol: string, pushable: Pushable, receiver: EventEmitter) {
    super()

    this.protocol = protocol
    this.pushable = pushable
    this.receiver = receiver
    this.init()
  }

  init() {
    this.receiver.on('data', ([protocol, code, payload]: any[]) => {
      if (protocol !== this.protocol) return
      if (code === 0) {
        this.status = payload
      } else {
        this.emit('message', { code, payload })
      }
    })
  }

  sendStatus(status: any) {
    this.pushable.push([this.protocol, 0, status] as any)
  }

  sendMessage(code: any, data: any) {
    this.pushable.push([this.protocol, code, data] as any)
  }
}
