const tape = require('tape-catch')
const td = require('testdouble')
const EventEmitter = require('events')
const timers = require('testdouble-timers').default
const { defaultLogger } = require('../../lib/logging')
defaultLogger.silent = true

timers.use(td)

tape('[Fetcher]', t => {
  class PeerPool extends EventEmitter {}
  td.replace('../../lib/net/peerpool', PeerPool)
  const Fetcher = require('../../lib/sync/fetcher')

  t.test('should initialize correctly', t => {
    const fetcher = new Fetcher({pool: new PeerPool()})
    fetcher.failure = td.func()
    fetcher.pool.emit('removed', {id: 'peer0'})
    process.nextTick(() => {
      td.verify(fetcher.failure('peer0'))
      t.end()
    })
    t.notOk(fetcher.running, 'not running')
  })

  t.test('should add task', t => {
    const fetcher = new Fetcher({pool: new PeerPool()})
    fetcher.add('task0')
    t.equals(fetcher.heap.peek(), 'task0', 'added')
    t.end()
  })

  t.test('should handle success', t => {
    const fetcher = new Fetcher({pool: new PeerPool()})
    const peer = {id: 'id0'}
    fetcher.next = td.func()
    fetcher.active.set('id0', {peer})
    fetcher.success('id0')
    t.ok(peer.idle, 'idle set')
    t.notOk(fetcher.active.get('id0'), 'set to inactive')
    td.verify(fetcher.next())
    t.end()
  })

  t.test('should handle failure', t => {
    t.plan(3)
    const fetcher = new Fetcher({pool: new PeerPool()})
    const peer = {id: 'id0'}
    fetcher.next = td.func()
    fetcher.add = td.func()
    fetcher.active.set('id0', {task: 'task0', peer})
    fetcher.on('error', (err, task, p) => {
      t.ok(err === 'err0' && task === 'task0' && p === peer, 'got error')
    })
    fetcher.failure('id0', 'err0')
    t.ok(peer.idle, 'idle set')
    t.notOk(fetcher.active.get('id0'), 'set to inactive')
    td.verify(fetcher.add('task0'))
    td.verify(fetcher.next())
  })

  t.test('should do next', t => {
    const fetcher = new Fetcher({pool: new PeerPool()})
    const peer = {id: 'id0', idle: true}
    t.equals(fetcher.next(), false, 'no remaining tasks')
    fetcher.pool.idle = td.func()
    fetcher.fetch = td.func()
    fetcher.handle = td.func()
    fetcher.failure = td.func()
    td.when(fetcher.pool.idle(td.matchers.anything())).thenReturn(peer)
    td.when(fetcher.fetch('task0', peer)).thenResolve('reply0')
    td.when(fetcher.fetch('task1', peer)).thenResolve('reply1')
    td.when(fetcher.handle('reply1', peer)).thenThrow('err0')
    fetcher.add('task0')
    t.equals(fetcher.next(), 'task0', 'next task')
    t.notOk(peer.idle, 'peer not idle')
    t.notOk(fetcher.heap.peek(), 'no tasks')
    const active = fetcher.active.get('id0')
    t.ok(active.task === 'task0' && active.peer === peer, 'active set')
    fetcher.add('task1')
    fetcher.next()
    setTimeout(() => {
      td.verify(fetcher.handle('reply0', peer))
      td.verify(fetcher.failure('id0', 'err0'))
      t.end()
    }, 10)
  })

  t.test('should handle reply', t => {
    const fetcher = new Fetcher({pool: new PeerPool()})
    const peer = {id: 'id0'}
    fetcher.process = td.func()
    fetcher.success = td.func()
    fetcher.failure = td.func()
    fetcher.handle(null, peer)
    t.ok(peer.idle, 'peer is idle')
    fetcher.active.set('id0', 'entry0')
    fetcher.handle(null, peer)
    td.verify(fetcher.failure('id0'))
    fetcher.handle('reply', peer)
    td.verify(fetcher.process('entry0', 'reply'))
    td.verify(fetcher.success('id0'))
    td.when(fetcher.process('entry0', 'reply')).thenThrow('err0')
    fetcher.handle('reply', peer)
    td.verify(fetcher.failure('id0', 'err0'))
    t.end()
  })

  t.test('should expire', t => {
    const clock = td.timers()
    const fetcher = new Fetcher({pool: new PeerPool(), timeout: 1})
    fetcher.pool = td.object()
    fetcher.add = td.func()
    fetcher.active.set(1, {time: 1, peer: 'peer1', task: 'task1'})
    fetcher.active.set(2, {time: 2, peer: 'peer2', task: 'task2'})
    fetcher.active.set(3, {time: 3, peer: 'peer3', task: 'task3'})
    td.when(fetcher.pool.contains('peer1')).thenReturn(true)
    clock.tick(4)
    fetcher.expire()
    td.verify(fetcher.pool.ban('peer1', td.matchers.isA(Number)))
    td.verify(fetcher.add('task1'))
    td.verify(fetcher.add('task2'))
    t.deepEquals(Array.from(fetcher.active), [[3, {time: 3, peer: 'peer3', task: 'task3'}]], 'one left')
    clock.restore()
    t.end()
  })

  t.test('should start', async (t) => {
    t.plan(3)
    const clock = td.timers()
    const fetcher = new Fetcher({pool: new PeerPool(), interval: 10})
    fetcher.expire = td.func()
    fetcher.next = td.func()
    td.when(fetcher.next()).thenReturn(true, true, false)
    fetcher.active.set(1)
    fetcher.start().then(() => {
      t.notOk(fetcher.running, 'stopped')
    })
    setTimeout(() => {
      t.ok(fetcher.running, 'started')
    }, 1)
    t.notOk(await fetcher.start(), 'already started')
    clock.tick(1)
    fetcher.active.delete(1)
    clock.tick(20)
    clock.restore()
  })

  t.test('should stop', async (t) => {
    const fetcher = new Fetcher({pool: new PeerPool(), interval: 1})
    fetcher.heap.remove = td.func()
    td.when(fetcher.heap.remove()).thenReturn(false)
    fetcher.active.set(0)
    fetcher.running = true
    fetcher.stop().then(() => {
      t.notOk(fetcher.active.get(0), 'empty active')
      t.end()
    })
    setTimeout(async () => {
      fetcher.running = false
      t.equals(await fetcher.stop(), false, 'already stopped')
    }, 100)
  })

  t.test('should reset td', t => {
    td.reset()
    t.end()
  })
})
