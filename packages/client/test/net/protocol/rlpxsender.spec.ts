import { EventEmitter } from 'events'
import tape from 'tape-catch'
import td from 'testdouble'
import { ETH as Devp2pETH } from '@ethereumjs/devp2p'
import { RlpxSender } from '../../../lib/net/protocol'

tape('[RlpxSender]', (t) => {
  t.test('should send status', (t) => {
    const rlpxProtocol = td.object() as any
    const status = { id: 5 }
    const sender = new RlpxSender(rlpxProtocol)
    sender.sendStatus(status)
    td.verify(rlpxProtocol.sendStatus(status))
    td.reset()
    t.pass('status sent')
    t.end()
  })

  t.test('should send message', (t) => {
    const rlpxProtocol = td.object() as any
    const sender = new RlpxSender(rlpxProtocol)
    sender.sendMessage(1, 5)
    td.verify(rlpxProtocol.sendMessage(1, 5))
    td.reset()
    t.pass('message sent')
    t.end()
  })

  t.test('should receive status', (t) => {
    const rlpxProtocol = new EventEmitter()
    const sender = new RlpxSender(rlpxProtocol as Devp2pETH)
    sender.on('status', (status: any) => {
      t.equal(status.id, 5, 'status received')
      t.equal(sender.status.id, 5, 'status getter')
      t.end()
    })
    rlpxProtocol.emit('status', { id: 5 })
  })

  t.test('should receive message', (t) => {
    const rlpxProtocol = new EventEmitter()
    const sender = new RlpxSender(rlpxProtocol as Devp2pETH)
    sender.on('message', (message: any) => {
      t.equal(message.code, 1, 'message received (code)')
      t.equal(message.payload, 5, 'message received (payload)')
      t.end()
    })
    rlpxProtocol.emit('message', 1, 5)
  })

  t.test('should catch errors', (t) => {
    const rlpxProtocol = new EventEmitter()
    const sender = new RlpxSender(rlpxProtocol as Devp2pETH)
    t.throws(() => sender.sendStatus({ id: 5 }), /not a function/, 'sendStatus error')
    t.throws(() => sender.sendMessage(1, 5), /not a function/, 'sendMessage error')
    t.end()
  })
})
