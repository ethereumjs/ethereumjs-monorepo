const tape = require('tape-catch')
const td = require('testdouble')
const EventEmitter = require('events')
const Chain = td.constructor(require('../../lib/blockchain/chain'))
const { EthHandler } = require('../../lib/handler')
const { defaultLogger } = require('../../lib/logging')
defaultLogger.silent = true

tape('[EthHandler]', t => {
  const pool = new EventEmitter()
  const chain = new Chain()
  const handler = new EthHandler({ pool, chain })
  const peer = { eth: { send: td.func() } }
  handler.start()

  t.test('should handle GetBlockHeaders', t => {
    const message = {
      name: 'GetBlockHeaders',
      data: {
        block: 5,
        max: 100,
        skip: 10,
        reverse: 1
      }
    }
    const headers = ['header0', 'header1']
    td.when(chain.getHeaders(5, 100, 10, 1)).thenResolve(headers)
    pool.emit('message:eth', message, peer)
    setTimeout(() => {
      td.verify(peer.eth.send('BlockHeaders', headers))
      td.reset()
      t.pass('sent BlockHeaders')
      t.end()
    }, 100)
  })

  t.test('should handle errors', t => {
    handler.on('error', err => {
      t.ok(err, 'caught error')
      t.end()
    })
    pool.emit('message:eth', null, peer)
  })

  t.test('should stop handler', t => {
    handler.stop()
    t.notOk(handler.running, 'stopped handler')
    t.end()
  })
})
