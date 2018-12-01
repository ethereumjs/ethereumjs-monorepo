const tape = require('tape-catch')
const td = require('testdouble')
const BN = require('bn.js')
const EventEmitter = require('events')
const { defaultLogger } = require('../../lib/logging')
defaultLogger.silent = true

tape('[BlockFetcher]', t => {
  class PeerPool extends EventEmitter {}
  td.replace('../../lib/net/peerpool', PeerPool)
  const BlockFetcher = require('../../lib/sync/blockfetcher')
  const ONE = new BN(1)
  const TWO = new BN(2)

  t.test('should order correctly', t => {
    const fetcher = new BlockFetcher({pool: new PeerPool()})
    t.ok(fetcher.before({first: ONE}, {first: TWO}), 'ordered')
    t.notOk(fetcher.before({first: TWO}, {first: ONE}), 'not ordered')
    t.end()
  })

  t.test('should fetch', async (t) => {
    const fetcher = new BlockFetcher({pool: new PeerPool()})
    const peer = {eth: td.object()}
    td.when(peer.eth.getBlockHeaders({block: ONE, max: 2})).thenResolve([])
    td.when(peer.eth.getBlockHeaders({block: ONE, max: 128})).thenResolve([])
    td.when(peer.eth.getBlockBodies(td.matchers.anything())).thenResolve([])
    const blocks = await fetcher.fetch({first: ONE, last: TWO}, peer)
    t.deepEquals(blocks, {blocks: []}, 'got blocks')
    await fetcher.fetch({first: ONE, last: new BN(1000)}, peer)
    t.end()
  })

  t.test('should process', async (t) => {
    const fetcher = new BlockFetcher({pool: new PeerPool()})
    fetcher.add = td.func()
    fetcher.process({task: 'task'}, {blocks: []})
    td.verify(fetcher.add('task'))
    fetcher.on('blocks', blocks => {
      t.deepEquals(blocks, [{header: {number: 1}}], 'got blocks')
      td.verify(fetcher.add({first: TWO, last: TWO}))
      t.end()
    })
    fetcher.process({task: {last: TWO}}, {blocks: [{header: {number: 1}}]})
  })

  t.test('should check if peer fetchable', async (t) => {
    const fetcher = new BlockFetcher({pool: new PeerPool(), sync: td.object()})
    td.when(fetcher.sync.fetchable('peer')).thenReturn(true)
    t.ok(fetcher.fetchable('peer'), 'fetchable')
    t.end()
  })

  t.test('should reset td', t => {
    td.reset()
    t.end()
  })
})
