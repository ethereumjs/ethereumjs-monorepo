import { EventEmitter } from 'events'
import * as td from 'testdouble'
import { assert, describe, it } from 'vitest'

import { Config } from '../../../src/config'
import { RlpxSender } from '../../../src/net/protocol/rlpxsender'
import { Event } from '../../../src/types'

describe('[RlpxPeer]', async () => {
  const { DPT, ETH, LES, SNAP } = await import('@ethereumjs/devp2p')
  class RLPx extends EventEmitter {
    connect(_: any) {}
  }
  RLPx.prototype.connect = td.func<any>()
  td.replace<any>('@ethereumjs/devp2p', { DPT, ETH, LES, SNAP, RLPx })
  const { RlpxPeer } = await import('../../../src/net/peer/rlpxpeer')

  it('should initialize correctly', async () => {
    const config = new Config({ transports: [], accountCache: 10000, storageCache: 1000 })
    const peer = new RlpxPeer({
      config,
      id: 'abcdef0123',
      host: '10.0.0.1',
      port: 1234,
    })
    assert.equal(peer.address, '10.0.0.1:1234', 'address correct')
    assert.notOk(peer.connected, 'not connected')
  })

  it('should compute capabilities', () => {
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
      'correct capabilities'
    )
  })

  it('should connect to peer', async () => {
    const config = new Config({ transports: [], accountCache: 10000, storageCache: 1000 })
    const proto0 = { name: 'les', versions: [4] } as any
    const peer = new RlpxPeer({
      config,
      id: 'abcdef0123',
      protocols: [proto0],
      host: '10.0.0.1',
      port: 1234,
    })
    proto0.open = td.func()
    td.when(proto0.open()).thenResolve(null)
    await peer.connect()
    assert.ok('connected successfully')
    td.verify(RLPx.prototype.connect(td.matchers.anything()))
  })

  it('should handle peer events', async () => {
    const config = new Config({ transports: [], accountCache: 10000, storageCache: 1000 })
    const peer = new RlpxPeer({ config, id: 'abcdef0123', host: '10.0.0.1', port: 1234 })
    const rlpxPeer = { id: 'zyx321', getDisconnectPrefix: td.func() } as any
    ;(peer as any).bindProtocols = td.func<typeof peer['bindProtocols']>()
    peer.rlpxPeer = rlpxPeer
    td.when((peer as any).bindProtocols(rlpxPeer)).thenResolve(undefined)
    td.when(rlpxPeer.getDisconnectPrefix('reason')).thenReturn('reason')
    await peer.connect()
    config.events.on(Event.PEER_ERROR, (error) => {
      if (error.message === 'err0') assert.ok(true, 'got err0')
    })

    peer.config.events.on(Event.PEER_CONNECTED, (peer) =>
      assert.equal(peer.id, 'abcdef0123', 'got connected')
    )
    peer.config.events.on(Event.PEER_DISCONNECTED, (rlpxPeer) =>
      assert.equal(rlpxPeer.pooled, false, 'got disconnected')
    )
    peer.rlpx!.emit('peer:error', rlpxPeer, new Error('err0'))
    peer.rlpx!.emit('peer:added', rlpxPeer)
    peer.rlpx!.emit('peer:removed', rlpxPeer, 'reason')
    ;(peer as any).bindProtocols = td.func<typeof peer['bindProtocols']>()
    peer.rlpxPeer = rlpxPeer
    await peer.connect()
    td.when((peer as any).bindProtocols(rlpxPeer)).thenReject(new Error('err1'))
    td.when(rlpxPeer.getDisconnectPrefix('reason')).thenThrow(new Error('err2'))
    peer.config.events.on(Event.PEER_ERROR, (err) => {
      if (err.message === 'err1') assert.ok(true, 'got err1')
      if (err.message === 'err2') assert.ok(true, 'got err2')
    })
    peer.rlpx!.emit('peer:added', rlpxPeer)
    peer.rlpx!.emit('peer:removed', rlpxPeer, 'reason')
  })

  it('should accept peer connection', async () => {
    const config = new Config({ transports: [], accountCache: 10000, storageCache: 1000 })
    const peer: any = new RlpxPeer({ config, id: 'abcdef0123', host: '10.0.0.1', port: 1234 })
    peer.bindProtocols = td.func<typeof peer['bindProtocols']>()
    td.when(peer.bindProtocols('rlpxpeer' as any)).thenResolve(null)
    await peer.accept('rlpxpeer' as any, 'server')
    assert.equal(peer.server, 'server', 'server set')
  })

  it('should bind protocols', async () => {
    const config = new Config({ transports: [], accountCache: 10000, storageCache: 1000 })
    const protocols = [{ name: 'proto0' }] as any
    const peer = new RlpxPeer({ config, id: 'abcdef0123', protocols, host: '10.0.0.1', port: 1234 })
    const proto0 = new (class Proto0 extends EventEmitter {})()

    const rlpxPeer = { getProtocols: td.func() } as any
    ;(peer as any).bindProtocol = td.func<typeof peer['bindProtocols']>()
    const bindProtocolThen = td.func()
    td.when((peer as any).bindProtocol(td.matchers.anything(), td.matchers.anything())).thenReturn({
      then: bindProtocolThen,
    })
    td.when(rlpxPeer.getProtocols()).thenReturn([proto0])

    await (peer as any).bindProtocols(rlpxPeer)
    td.verify((peer as any).bindProtocol({ name: 'proto0' } as any, td.matchers.isA(RlpxSender)))
    assert.ok(peer.connected, 'connected set to true')
  })

  it('should reset td', () => {
    td.reset()
  })
})
