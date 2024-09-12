import { EventEmitter } from 'events'
import { assert, describe, expect, it, vi } from 'vitest'

import { Config } from '../../../src/config.js'
import { Event } from '../../../src/types.js'

describe('[RlpxPeer]', async () => {
  vi.mock('@ethereumjs/devp2p', async () => {
    const devp2p = await vi.importActual<any>('@ethereumjs/devp2p')
    const RLPx = vi.fn().mockImplementation(() => {
      return {
        events: new EventEmitter(),
        connect: vi.fn(),
      }
    })

    return {
      ...devp2p,
      RLPx,
    }
  })

  const { RlpxPeer } = await import('../../../src/net/peer/rlpxpeer.js')

  it('should initialize correctly', async () => {
    const config = new Config({ accountCache: 10000, storageCache: 1000 })
    const peer = new RlpxPeer({
      config,
      id: 'abcdef0123',
      host: '10.0.0.1',
      port: 1234,
    })
    assert.equal(peer.address, '10.0.0.1:1234', 'address correct')
    assert.notOk(peer.connected, 'not connected')
  })

  it('should compute capabilities', async () => {
    const protocols: any = [
      { name: 'eth', versions: [66] },
      { name: 'les', versions: [4] },
      { name: 'snap', versions: [1] },
    ]
    const caps = RlpxPeer.capabilities(protocols).map(({ name, version, length }) => ({
      name,
      version,
      length,
    }))
    assert.deepEqual(
      caps,
      [
        { name: 'eth', version: 66, length: 17 },
        { name: 'les', version: 4, length: 23 },
        { name: 'snap', version: 1, length: 8 },
      ],
      'correct capabilities',
    )
  })

  it('should connect to peer', async () => {
    const config = new Config({ accountCache: 10000, storageCache: 1000 })
    const proto0 = { name: 'les', versions: [4] } as any
    const peer = new RlpxPeer({
      config,
      id: 'abcdef0123',
      protocols: [proto0],
      host: '10.0.0.1',
      port: 1234,
    })
    proto0.open = vi.fn().mockResolvedValue(null)
    await peer.connect()
    assert.ok('connected successfully')
    expect(peer.rlpx!.connect).toBeCalled()
  })

  it('should handle peer events', async () => {
    const config = new Config({ accountCache: 10000, storageCache: 1000 })
    const peer = new RlpxPeer({
      config,
      id: 'abcdef0123',
      host: '10.0.0.1',
      port: 1234,
    })
    const rlpxPeer = { id: 'zyx321', getDisconnectPrefix: vi.fn() } as any
    ;(peer as any).bindProtocols = vi.fn().mockResolvedValue(undefined)
    peer.rlpxPeer = rlpxPeer

    rlpxPeer.getDisconnectPrefix = vi.fn().mockImplementation((param: any) => {
      if (param === 'reason') {
        return 'reason'
      }
    })
    await peer.connect()
    config.events.on(Event.PEER_ERROR, (error) => {
      if (error.message === 'err0') assert.ok(true, 'got err0')
    })

    peer.config.events.on(Event.PEER_CONNECTED, (peer) =>
      assert.equal(peer.id, 'abcdef0123', 'got connected'),
    )
    peer.config.events.on(Event.PEER_DISCONNECTED, (rlpxPeer) =>
      assert.equal(rlpxPeer.pooled, false, 'got disconnected'),
    )
    peer.rlpx!.events.emit('peer:error', rlpxPeer, new Error('err0'))
    peer.rlpx!.events.emit('peer:added', rlpxPeer)
    peer.rlpx!.events.emit('peer:removed', rlpxPeer, 'reason')
    ;(peer as any).bindProtocols = vi.fn().mockRejectedValue(new Error('err1'))
    rlpxPeer.getDisconnectPrefix = vi.fn().mockImplementation((param: string) => {
      if (param === 'reason') throw new Error('err2')
    })

    peer.rlpxPeer = rlpxPeer
    await peer.connect()

    peer.config.events.on(Event.PEER_ERROR, (err) => {
      if (err.message === 'err1') assert.ok(true, 'got err1')
      if (err.message === 'err2') assert.ok(true, 'got err2')
    })
    peer.rlpx!.events.emit('peer:added', rlpxPeer)
    peer.rlpx!.events.emit('peer:removed', rlpxPeer, 'reason')
  })

  it('should accept peer connection', async () => {
    const config = new Config({ accountCache: 10000, storageCache: 1000 })
    const peer: any = new RlpxPeer({
      config,
      id: 'abcdef0123',
      host: '10.0.0.1',
      port: 1234,
    })
    peer.bindProtocols = vi.fn().mockResolvedValue(null)

    await peer.accept('rlpxpeer' as any, 'server')
    assert.equal(peer.server, 'server', 'server set')
  })

  it('should bind protocols', async () => {
    const config = new Config({ accountCache: 10000, storageCache: 1000 })
    const protocols = [{ name: 'proto0' }] as any
    const peer = new RlpxPeer({
      config,
      id: 'abcdef0123',
      protocols,
      host: '10.0.0.1',
      port: 1234,
    })
    class Proto0 {
      events: EventEmitter
      constructor() {
        this.events = new EventEmitter()
      }
    }
    const proto0 = new Proto0()

    const rlpxPeer = {
      getProtocols: vi.fn().mockReturnValue([proto0]),
    } as any
    peer['addProtocol'] = vi.fn().mockResolvedValue(undefined)

    await peer['bindProtocols'](rlpxPeer)
    expect(peer.addProtocol).toBeCalled()
    assert.ok(peer.connected, 'connected set to true')
  })
})
