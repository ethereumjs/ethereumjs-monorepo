import { EventEmitter } from 'events'
import { assert, describe, it, vi } from 'vitest'

import { Config } from '../../src/config'
import { Event } from '../../src/types'
import { MockPeer } from '../integration/mocks/mockpeer'

const { PeerPool } = await import('../../src/net/peerpool')

describe('should initialize', () => {
  const config = new Config({ accountCache: 10000, storageCache: 1000 })
  const pool = new PeerPool({ config })
  it('should open/close', async () => {
    assert.notOk((pool as any).pool.size, 'empty pool')
    assert.notOk((pool as any).opened, 'not open')
    const peer = new MockPeer({
      id: 'peer',
      location: 'abc',
      config,
      address: '0.0.0.0',
      transport: 'udp',
    })
    await pool.open()
    config.events.on(Event.PEER_CONNECTED, (peer) => {
      if (pool.contains(peer.id)) assert.ok(true, 'peer connected')
    })
    config.events.on(Event.POOL_PEER_REMOVED, () => {
      if (!pool.contains('peer')) assert.ok(true, 'peer disconnected')
    })
    pool.add(peer)
    pool.remove(peer)
    assert.equal(await pool.open(), false, 'already opened')
    await pool.close()
    assert.notOk((pool as any).opened, 'closed')
  })
})

describe('should connect/disconnect peer', () => {
  const peer = new EventEmitter() as any
  const config = new Config({ accountCache: 10000, storageCache: 1000 })
  const pool = new PeerPool({ config })
  ;(peer as any).id = 'abc'
  ;(peer as any).handleMessageQueue = vi.fn()
  ;(pool as any).connected(peer)
  pool.config.events.on(Event.PROTOCOL_MESSAGE, (msg: any, proto: any, p: any) => {
    it('should get message', () => {
      assert.ok(msg === 'msg0' && proto === 'proto0' && p === peer, 'got message')
    })
  })
  config.events.emit(Event.PROTOCOL_MESSAGE, 'msg0', 'proto0', peer)
  pool.config.events.emit(Event.PEER_ERROR, new Error('err0'), peer)
  ;(pool as any).disconnected(peer)
  assert.notOk((pool as any).pool.get('abc'), 'peer removed')
})

const Peer = function (this: any, id: string) {
  this.id = id // eslint-disable-line no-invalid-this
}
vi.doMock('../../src/net/peer/peer', () => Peer)
describe('should check contains', () => {
  // @ts-ignore
  const peer = new Peer('abc')
  const config = new Config({ accountCache: 10000, storageCache: 1000 })
  const pool = new PeerPool({ config })
  it('should add peer', () => {
    pool.add(peer)
    assert.ok(pool.contains(peer.id), 'found peer')
  })
})

it('should get idle peers', () => {
  // @ts-ignore
  const peers = [new Peer(1), new Peer(2), new Peer(3)]
  const config = new Config({ accountCache: 10000, storageCache: 1000 })
  const pool = new PeerPool({ config })
  peers[1].idle = true
  it('should add peers', () => {
    for (const p of peers) {
      pool.add(p)
    }
    assert.equal(pool.idle(), peers[1], 'correct idle peer')
    assert.equal(
      pool.idle((p: any) => p.id > 1),
      peers[1],
      'correct idle peer with filter'
    )
  })
})

describe('should ban peer', () => {
  const peers = [{ id: 1 }, { id: 2, server: { ban: vi.fn() } }]
  const config = new Config({ accountCache: 10000, storageCache: 1000 })
  const pool = new PeerPool({ config })
  pool.config.events.on(Event.POOL_PEER_BANNED, (peer) => {
    it('should ban peer', () => {
      assert.equal(peer, peers[1] as any, 'banned peer')
    })
  })
  pool.config.events.on(Event.POOL_PEER_REMOVED, (peer) => {
    it('should remove peer', () => {
      assert.equal(peer, peers[1] as any, 'removed peer')
      assert.equal(pool.peers[0], peers[0] as any, 'outbound peer not banned')
    })
  })
  for (const p of peers as any) {
    pool.add(p)
    pool.ban(p, 1000)
  }
})
