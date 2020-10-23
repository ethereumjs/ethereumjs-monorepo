import tape from 'tape-catch'
const pull = require('pull-stream')
// TODO: investigate pull-pair implicit dependency...
// eslint-disable-next-line implicit-dependencies/no-implicit
const DuplexPair = require('pull-pair/duplex')
const { Libp2pSender } = require('../../../lib/net/protocol')

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
    const err0 = { source: pull.error(new Error('err0')), sink: pull.drain() }
    t.throws(() => new Libp2pSender(err0), /err0/, 'catch error')
    t.end()
  })
})
