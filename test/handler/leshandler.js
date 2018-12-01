const tape = require('tape-catch')
const td = require('testdouble')
const EventEmitter = require('events')
const Chain = td.constructor(require('../../lib/blockchain/chain'))
const Flow = td.constructor(require('../../lib/net/protocol/flowcontrol'))
const { LesHandler } = require('../../lib/handler')
const { defaultLogger } = require('../../lib/logging')
defaultLogger.silent = true

tape('[LesHandler]', t => {
  const pool = new EventEmitter()
  const chain = new Chain()
  const flow = new Flow()
  const handler = new LesHandler({ pool, chain, flow })
  const peer = { les: { send: td.func() } }
  const message = {
    name: 'GetBlockHeaders',
    data: {
      reqId: 1,
      block: 5,
      max: 100,
      skip: 10,
      reverse: 1
    }
  }
  const headers = [ 'header0', 'header1' ]

  t.test('should handle GetBlockHeaders', t => {
    td.when(flow.handleRequest(peer, message.name, 100)).thenReturn(11)
    td.when(chain.getHeaders(5, 100, 10, 1)).thenResolve(headers)
    pool.emit('message:les', message, peer)
    setTimeout(() => {
      td.verify(peer.les.send('BlockHeaders', { reqId: 1, bv: 11, headers }))
      td.reset()
      t.pass('sent BlockHeaders')
      t.end()
    }, 100)
  })

  t.test('should perform flow control', t => {
    td.when(flow.handleRequest(peer, message.name, 100)).thenReturn(-1)
    pool.ban = td.func()
    pool.emit('message:les', message, peer)
    setTimeout(() => {
      td.verify(pool.ban(peer, 300000))
      td.reset()
      t.pass('flow control')
      t.end()
    }, 100)
    pool.emit('message:les', message, peer)
  })

  t.test('should handle errors', t => {
    handler.on('error', err => {
      t.ok(err, 'caught error')
      t.end()
    })
    pool.emit('message:les', null, peer)
  })
})
