import tape from 'tape-catch'
import { Libp2pSender } from '../../../lib/net/protocol'
const DuplexPair = require('it-pair/duplex')

tape('[Libp2pSender]', (t) => {
  t.test('should send/receive status', (t) => {
    const conn = DuplexPair()
    const sender = new Libp2pSender(conn[0])
    const receiver = new Libp2pSender(conn[1])
    receiver.on('status', (status: any) => {
      t.equal(status.id.toString('hex'), '05', 'status received')
      t.equal(receiver.status.id.toString('hex'), '05', 'status getter')
      t.end()
    })
    sender.sendStatus({ id: 5 })
  })

  t.test('should send/receive message', (t) => {
    const conn = DuplexPair()
    const sender = new Libp2pSender(conn[0])
    const receiver = new Libp2pSender(conn[1])
    receiver.on('message', (message: any) => {
      t.equal(message.code, 1, 'message received (code)')
      t.equal(message.payload.toString('hex'), '05', 'message received (payload)')
      t.end()
    })
    sender.sendMessage(1, 5)
  })

  t.test('should catch errors', (t) => {
    const [conn] = DuplexPair()
    const err0 = {
      ...conn,
      sink: () => {
        throw new Error('err0')
      },
    } as any
    t.throws(() => new Libp2pSender(err0), /err0/, 'catch error')
    t.end()
  })
})
