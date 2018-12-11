'use strict'

const { Sender } = require('../../../lib/net/protocol')

class MockSender extends Sender {
  constructor (protocol, pushable, receiver) {
    super()

    this.protocol = protocol
    this.pushable = pushable
    this.receiver = receiver
    this.init()
  }

  init () {
    this.receiver.on('data', ([protocol, code, payload]) => {
      if (protocol !== this.protocol) return
      if (code === 0) {
        this.status = payload
      } else {
        this.emit('message', { code, payload })
      }
    })
  }

  sendStatus (status) {
    this.pushable.push([ this.protocol, 0, status ])
  }

  sendMessage (code, data) {
    this.pushable.push([ this.protocol, code, data ])
  }
}

module.exports = MockSender
