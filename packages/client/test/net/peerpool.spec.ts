import tape from 'tape-catch'
import td from 'testdouble'
import { EventEmitter } from 'events'
import { Config } from '../../lib/config'
import { RlpxServer } from '../../lib/net/server'

tape('[PeerPool]', async (t) => {
  const Peer = td.replace('../../lib/net/peer/peer', function (this: any, id: string) {
    this.id = id // eslint-disable-line no-invalid-this
  })
  const { PeerPool } = await import('../../lib/net/peerpool')

  t.test('should initialize', (t) => {
    const config = new Config({ transports: [] })
    const pool = new PeerPool({ config })
    t.notOk((pool as any).pool.size, 'empty pool')
    t.notOk((pool as any).opened, 'not open')
    t.end()
  })

  t.test('should open/close', async (t) => {
    const server = new EventEmitter()
    const config = new Config({ servers: [server as RlpxServer] })
    const pool = new PeerPool({ config })
    pool.connected = td.func<typeof pool.connected>()
    pool.disconnected = td.func<typeof pool.disconnected>()
    await pool.open()
    server.emit('connected', 'peer')
    server.emit('disconnected', 'peer')
    process.nextTick(() => {
      td.verify(pool.connected('peer' as any))
      td.verify(pool.disconnected('peer' as any))
    })
    t.equals(await pool.open(), false, 'already opened')
    await pool.close()
    t.notOk((pool as any).opened, 'closed')
    t.end()
  })

  t.test('should connect/disconnect peer', (t) => {
    t.plan(4)
    const peer = new EventEmitter() as any
    const config = new Config({ loglevel: 'error', transports: [] })
    const pool = new PeerPool({ config })
    ;(peer as any).id = 'abc'
    ;(pool as any).ban = td.func()
    pool.connected(peer)
    pool.on('message', (msg: any, proto: any, p: any) => {
      t.ok(msg === 'msg0' && proto === 'proto0' && p === peer, 'got message')
    })
    pool.on('message:proto0', (msg: any, p: any) => {
      t.ok(msg === 'msg0' && p === peer, 'got message:protocol')
    })
    peer.emit('message', 'msg0', 'proto0')
    peer.emit('error', 'err0', 'proto0')
    process.nextTick(() => {
      td.verify(pool.ban(peer))
      t.pass('got error')
    })
    pool.disconnected(peer)
    t.notOk((pool as any).pool.get('abc'), 'peer removed')
  })

  t.test('should check contains', (t) => {
    const peer = new Peer('abc')
    const config = new Config({ transports: [], loglevel: 'error' })
    const pool = new PeerPool({ config })
    pool.add(peer)
    t.ok(pool.contains(peer.id), 'found peer')
    t.end()
  })

  t.test('should get idle peers', (t) => {
    const peers = [new Peer(1), new Peer(2), new Peer(3)]
    const config = new Config({ transports: [] })
    const pool = new PeerPool({ config })
    peers[1].idle = true
    peers.forEach((p) => pool.add(p))
    t.equals(pool.idle(), peers[1], 'correct idle peer')
    t.equals(
      pool.idle((p: any) => p.id > 1),
      peers[1],
      'correct idle peer with filter'
    )
    t.end()
  })

  t.test('should ban peer', (t) => {
    const peers = [{ id: 1 }, { id: 2, server: { ban: td.func() } }]
    const config = new Config({ transports: [] })
    const pool = new PeerPool({ config })
    peers.forEach((p: any) => pool.add(p))
    peers.forEach((p: any) => pool.ban(p, 1000))
    pool.on('banned', (peer: any) => t.equals(peer, peers[1], 'banned peer'))
    pool.on('removed', (peer: any) => t.equals(peer, peers[1], 'removed peer'))
    t.equals(pool.peers[0], peers[0], 'outbound peer not banned')
    t.end()
  })

  t.test('should reset td', (t) => {
    td.reset()
    t.end()
  })
})
