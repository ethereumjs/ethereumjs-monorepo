import { Sender } from '../../../lib/net/protocol'

export default class MockSender extends Sender {
  public protocol: any
  public pushable: any
  public receiver: any

  constructor(protocol: any, pushable: any, receiver: any) {
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
    this.pushable.push([this.protocol, 0, status])
  }

  sendMessage(code: any, data: any) {
    this.pushable.push([this.protocol, code, data])
  }
}
