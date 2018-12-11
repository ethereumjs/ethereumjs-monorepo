const tape = require('tape')
const Node = require('../../lib/node')
const MockServer = require('./mocks/mockserver.js')
const { defaultLogger } = require('../../lib/logging')
defaultLogger.silent = true

tape('[Integration:Node]', t => {
  const node = new Node({
    servers: [ new MockServer() ],
    syncmode: 'fast',
    lightserv: false
  })

  t.test('should start/stop', async (t) => {
    t.plan(4)
    node.on('error', err => t.equal(err, 'err0', 'got error'))
    node.on('listening', details => {
      t.deepEqual(details, { transport: 'mock', url: 'mock://127.0.0.1' }, 'server listening')
    })
    node.on('synchronized', stats => {
      t.deepEqual(stats, { count: 0, type: 'fast' }, 'synchronized')
    })
    await node.open()
    node.service('eth').synchronizer.interval = 100
    node.service('eth').emit('error', 'err0')
    await node.start()
    await node.stop()
    t.pass('node stopped')
  })
})
