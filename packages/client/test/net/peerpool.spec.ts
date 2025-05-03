import { EventEmitter } from 'eventemitter3'
import { assert, describe, it, vi } from 'vitest'

import { Config } from '../../src/config.ts'
import { Event } from '../../src/types.ts'
import { MockPeer } from '../integration/mocks/mockpeer.ts'

const { PeerPool } = await import('../../src/net/peerpool.ts')

describe('should initialize', () => {
  const config = new Config({ accountCache: 10000, storageCache: 1000 })
  const pool = new PeerPool({ config })
  it('should open/close', async () => {
    assert.strictEqual(pool['pool'].size, 0, 'empty pool')
    assert.isFalse(pool['opened'], 'not open')
    const peer = new MockPeer({
      id: 'peer',
      location: 'abc',
      config,
      address: '0.0.0.0',
      transport: 'udp',
    })
    await pool.open()
    config.events.on(Event.PEER_CONNECTED, (peer) => {
      if (pool.contains(peer.id)) assert.isTrue(true, 'peer connected')
    })
    config.events.on(Event.POOL_PEER_REMOVED, () => {
      if (!pool.contains('peer')) assert.isTrue(true, 'peer disconnected')
    })
    pool.add(peer)
    pool.remove(peer)
    assert.strictEqual(await pool.open(), false, 'already opened')
    await pool.close()
    assert.isFalse(pool['opened'], 'closed')
  })
})

describe('should connect/disconnect peer', () => {
  const peer = new EventEmitter() as any
  const config = new Config({ accountCache: 10000, storageCache: 1000 })
  const pool = new PeerPool({ config })
  peer.id = 'abc'
  peer.handleMessageQueue = vi.fn()
  pool['connected'](peer)
  pool.config.events.on(Event.PROTOCOL_MESSAGE, (msg: any, proto: any, p: any) => {
    it('should get message', () => {
      assert.isTrue(msg === 'msg0' && proto === 'proto0' && p === peer, 'got message')
    })
  })
  config.events.emit(Event.PROTOCOL_MESSAGE, 'msg0', 'proto0', peer)
  pool.config.events.emit(Event.PEER_ERROR, new Error('err0'), peer)
  pool['disconnected'](peer)
  assert.isUndefined(pool['pool'].get('abc'), 'peer removed')
})

class Peer {
  id: string
  constructor(id: string) {
    this.id = id
  }
}

vi.doMock('../../src/net/peer/peer.ts', () => Peer)
describe('should check contains', () => {
  const peer = new Peer('abc')
  const config = new Config({ accountCache: 10000, storageCache: 1000 })
  const pool = new PeerPool({ config })
  it('should add peer', () => {
    pool.add(peer as any)
    assert.isTrue(pool.contains(peer.id), 'found peer')
  })
})

describe('should get idle peers', () => {
  const peers = [new Peer('1'), new Peer('2'), new Peer('3')]
  const config = new Config({ accountCache: 10000, storageCache: 1000 })
  const pool = new PeerPool({ config })
  /// @ts-expect-error -- Create new property
  peers[1].idle = true
  it('should add peers', () => {
    for (const p of peers) {
      pool.add(p as any)
    }
    assert.strictEqual(pool.idle(), peers[1], 'correct idle peer')
    assert.strictEqual(
      pool.idle((p: any) => p.id > 1),
      peers[1],
      'correct idle peer with filter',
    )
  })
})

describe('should ban peer', () => {
  const peers = [{ id: 1 }, { id: 2, server: { ban: vi.fn() } }]
  const config = new Config({ accountCache: 10000, storageCache: 1000 })
  const pool = new PeerPool({ config })
  pool.config.events.on(Event.POOL_PEER_BANNED, (peer) => {
    it('should ban peer', () => {
      assert.strictEqual(peer, peers[1] as any, 'banned peer')
    })
  })
  pool.config.events.on(Event.POOL_PEER_REMOVED, (peer) => {
    it('should remove peer', () => {
      assert.strictEqual(peer, peers[1] as any, 'removed peer')
      assert.strictEqual(pool.peers[0], peers[0] as any, 'outbound peer not banned')
    })
  })
  for (const p of peers as any) {
    pool.add(p)
    pool.ban(p, 1000)
  }
})
