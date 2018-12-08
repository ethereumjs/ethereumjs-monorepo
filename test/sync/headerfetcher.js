const tape = require('tape-catch')
const td = require('testdouble')
const BN = require('bn.js')
const EventEmitter = require('events')
const { defaultLogger } = require('../../lib/logging')
defaultLogger.silent = true

tape('[HeaderFetcher]', t => {
  class PeerPool extends EventEmitter {}
  td.replace('../../lib/net/peerpool', PeerPool)
  const HeaderPool = td.constructor()
  HeaderPool.prototype.open = td.func()
  HeaderPool.prototype.add = td.func()
  td.when(HeaderPool.prototype.open()).thenResolve()
  const headers = [{number: 1}, {number: 2}]
  td.when(HeaderPool.prototype.add(headers)).thenReject(new Error('err0'))
  td.replace('../../lib/blockchain', { HeaderPool })
  const HeaderFetcher = require('../../lib/sync/headerfetcher')
  const ONE = new BN(1)
  const TWO = new BN(2)

  t.test('should order correctly', t => {
    const fetcher = new HeaderFetcher({pool: new PeerPool()})
    t.ok(fetcher.before({first: ONE}, {first: TWO}), 'ordered')
    t.notOk(fetcher.before({first: TWO}, {first: ONE}), 'not ordered')
    t.end()
  })

  t.test('should open', async (t) => {
    const fetcher = new HeaderFetcher({pool: new PeerPool()})
    t.notOk(fetcher.opened, 'not open')
    await fetcher.open()
    t.ok(fetcher.opened, 'open')
    t.end()
  })

  t.test('should fetch', async (t) => {
    const fetcher = new HeaderFetcher({
      interval: 1,
      pool: new PeerPool(),
      flow: td.object(),
      maxPerRequest: 128
    })
    const peer = {les: td.object()}
    td.when(fetcher.flow.maxRequestCount(peer, 'GetBlockHeaders')).thenReturn(0)
    t.equals(await fetcher.fetch({}, peer), false, 'reached request limit')
    td.when(fetcher.flow.maxRequestCount(peer, 'GetBlockHeaders')).thenReturn(1000)
    td.when(peer.les.getBlockHeaders({block: ONE, max: 2})).thenResolve([])
    td.when(peer.les.getBlockHeaders({block: ONE, max: 128})).thenResolve([])
    t.deepEquals(await fetcher.fetch({first: ONE, last: TWO}, peer), [], 'got headers')
    t.deepEquals(await fetcher.fetch({first: ONE, last: new BN(1000)}, peer), [], 'got max headers')
    t.end()
  })

  t.test('should process', async (t) => {
    const fetcher = new HeaderFetcher({pool: new PeerPool(), flow: td.object()})
    fetcher.running = true
    fetcher.add = td.func()
    fetcher.process({task: 'task'}, {headers: []})
    td.verify(fetcher.add('task'))
    fetcher.process({task: {last: TWO}}, {headers})
    setTimeout(() => {
      td.verify(fetcher.add({first: ONE, last: TWO}))
      t.pass('processed tasks')
      t.end()
    }, 10)
  })

  t.test('should check if peer fetchable', async (t) => {
    const fetcher = new HeaderFetcher({pool: new PeerPool(), sync: td.object()})
    t.ok(fetcher.fetchable({les: {status: {serveHeaders: 1}}}), 'fetchable')
    t.end()
  })

  t.test('should reset td', t => {
    td.reset()
    t.end()
  })
})
