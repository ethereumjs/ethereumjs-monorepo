const tape = require('tape-catch')
const td = require('testdouble')
const BN = require('bn.js')
const EventEmitter = require('events')
const { defaultLogger } = require('../../lib/logging')
defaultLogger.silent = true

tape('[BlockFetcher]', t => {
  class PeerPool extends EventEmitter {}
  td.replace('../../lib/net/peerpool', PeerPool)
  const BlockPool = td.constructor()
  BlockPool.prototype.open = td.func()
  BlockPool.prototype.add = td.func()
  td.when(BlockPool.prototype.open()).thenResolve()
  const blocks = [{header: {number: 1}}, {header: {number: 2}}]
  td.when(BlockPool.prototype.add(blocks)).thenReject(new Error('err0'))
  td.replace('../../lib/blockchain', { BlockPool })
  const BlockFetcher = require('../../lib/sync/blockfetcher')
  const ONE = new BN(1)
  const TWO = new BN(2)

  t.test('should order correctly', t => {
    const fetcher = new BlockFetcher({pool: new PeerPool()})
    t.ok(fetcher.before({first: ONE}, {first: TWO}), 'ordered')
    t.notOk(fetcher.before({first: TWO}, {first: ONE}), 'not ordered')
    t.end()
  })

  t.test('should open', async (t) => {
    const fetcher = new BlockFetcher({pool: new PeerPool()})
    t.notOk(fetcher.opened, 'not open')
    await fetcher.open()
    t.ok(fetcher.opened, 'open')
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

  t.test('should process', t => {
    const fetcher = new BlockFetcher({pool: new PeerPool()})
    fetcher.running = true
    fetcher.add = td.func()
    fetcher.process({task: 'task'}, {blocks: []})
    td.verify(fetcher.add('task'))
    fetcher.process({task: {last: TWO}}, {blocks})
    setTimeout(() => {
      td.verify(fetcher.add({first: ONE, last: TWO}))
      t.pass('processed tasks')
      t.end()
    }, 10)
  })

  t.test('should check if peer fetchable', async (t) => {
    const fetcher = new BlockFetcher({pool: new PeerPool()})
    t.ok(fetcher.fetchable({eth: {}}), 'fetchable')
    t.end()
  })

  t.test('should reset td', t => {
    td.reset()
    t.end()
  })
})
