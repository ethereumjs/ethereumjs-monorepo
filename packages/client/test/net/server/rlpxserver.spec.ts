import { equalsBytes, hexToBytes, utf8ToBytes } from '@ethereumjs/util'
import { multiaddr } from '@multiformats/multiaddr'
import { EventEmitter } from 'eventemitter3'
import { assert, describe, expect, it, vi } from 'vitest'

import { Config } from '../../../src/config.ts'
import { Event } from '../../../src/types.ts'

import type { Peer } from '@ethereumjs/devp2p'

class RlpxPeer extends EventEmitter {
  accept(_: any, _2: any) {}
  getId() {
    return new Uint8Array([1])
  }
  getDisconnectPrefix(_: any) {
    return 'MockedReason'
  }
  getProtocols() {
    return []
  }
  static capabilities(_: any) {
    return []
  }
  _socket = { remoteAddress: 'mock', remotePort: 101 }
}
RlpxPeer.prototype.accept = vi.fn((input: object) => {
  if (!(input instanceof RlpxPeer)) throw Error('expected RlpxPeer type as input')
})
RlpxPeer.capabilities = vi.fn()
vi.doMock('../../../src/net/peer/rlpxpeer', () => {
  return {
    RlpxPeer,
  }
})

class RLPx extends EventEmitter {
  listen(_: any, _2: any) {}
}
RLPx.prototype.listen = vi.fn()
class DPT extends EventEmitter {
  bind(_: any, _2: any) {}
  getDnsPeers() {}
}
DPT.prototype.bind = vi.fn()
DPT.prototype.getDnsPeers = vi.fn()

vi.doMock('@ethereumjs/devp2p', () => {
  return {
    RLPx,
  }
})

const { RlpxServer } = await import('../../../src/net/server/rlpxserver.ts')
describe('[RlpxServer]', async () => {
  it('should initialize correctly', async () => {
    const config = new Config({ accountCache: 10000, storageCache: 1000 })
    const server = new RlpxServer({
      config,
      bootnodes: '10.0.0.1:1234,enode://abcd@10.0.0.2:1234',
      key: 'abcd',
    })
    assert.equal(server.name, 'rlpx', 'get name')
    assert.isTrue(equalsBytes(server.key!, hexToBytes('0xabcd')), 'key parse')
    assert.deepEqual(
      server.bootnodes,
      [multiaddr('/ip4/10.0.0.1/tcp/1234'), multiaddr('/ip4/10.0.0.2/tcp/1234')],
      'bootnodes split',
    )
  })

  it('should start/stop server', async () => {
    const config = new Config({ accountCache: 10000, storageCache: 1000 })
    const server = new RlpxServer({
      config,
      bootnodes: '10.0.0.1:1234,10.0.0.2:1234',
    })
    server['initDpt'] = vi.fn()
    server['initRlpx'] = vi.fn()
    server.dpt = {
      destroy: vi.fn(),
      bootstrap: vi.fn(async (input) => {
        if (
          JSON.stringify(input) ===
          JSON.stringify({ address: '10.0.0.1', udpPort: 1234, tcpPort: 1234 })
        )
          return
        if (
          JSON.stringify(input) ===
          JSON.stringify({ address: '10.0.0.2', udpPort: '1234', tcpPort: '1234' })
        )
          throw new Error('err0')
      }),
    } as any
    server.rlpx = { destroy: vi.fn() } as any
    server.config.events.on(Event.PEER_ERROR, (err: any) =>
      assert.equal(err.message, 'err0', 'got error'),
    )
    await server.start()
    expect(server['initDpt']).toHaveBeenCalled()
    expect(server['initRlpx']).toHaveBeenCalled()
    assert.ok(server.running, 'started')
    assert.notOk(await server.start(), 'already started')
    await server.stop()
    expect(server.dpt!.destroy).toHaveBeenCalled()
    expect(server.rlpx!.destroy).toHaveBeenCalled()
    assert.notOk(server.running, 'stopped')
    assert.notOk(await server.stop(), 'already stopped')
  })

  it('should bootstrap with dns acquired peers', async () => {
    const dnsPeerInfo = { address: '10.0.0.5', udpPort: 1234, tcpPort: 1234 }
    const config = new Config({
      accountCache: 10000,
      storageCache: 1000,
      discDns: true,
    })
    const server = new RlpxServer({
      config,
      dnsNetworks: ['enrtree:A'],
    })
    server['initDpt'] = vi.fn()
    server['initRlpx'] = vi.fn()
    server.rlpx = { destroy: vi.fn() } as any
    server.dpt = {
      destroy: vi.fn(),
      getDnsPeers: vi.fn(() => [dnsPeerInfo]),
      bootstrap: vi.fn((input) => {
        if (JSON.stringify(input) !== JSON.stringify(dnsPeerInfo))
          throw new Error('expected input check has failed')
      }),
    } as any
    await server.start()
    await server.bootstrap()
    await server.stop()
  })
})
describe('should return rlpx server info with ip4 as default', async () => {
  const config = new Config({ accountCache: 10000, storageCache: 1000 })
  const mockId = '0123'
  const server = new RlpxServer({
    config,
    bootnodes: '10.0.0.1:1234,10.0.0.2:1234',
  }) as any
  const _nodeInfo = server.getRlpxInfo()
  server['initDpt'] = vi.fn()
  server['initRlpx'] = vi.fn()
  server.dpt = {
    destroy: vi.fn(),
    getDnsPeers: vi.fn(),
    bootstrap: vi.fn((input) => {
      if (
        JSON.stringify(input) ===
        JSON.stringify({ address: '10.0.0.1', udpPort: 1234, tcpPort: 1234 })
      )
        return undefined
      if (
        JSON.stringify(input) ===
        JSON.stringify({ address: '10.0.0.2', udpPort: '1234', tcpPort: '1234' })
      )
        throw new Error('err0')
    }),
  }
  server.rlpx = { destroy: vi.fn() }

  server.rlpx!.id = hexToBytes(`0x${mockId}`)
  await server.start()
  const nodeInfo = server.getRlpxInfo()
  it('tests nodeinfo', () => {
    assert.deepEqual(
      nodeInfo,
      {
        enode: `enode://${mockId}@0.0.0.0:30303`,
        id: mockId,
        ip: '0.0.0.0',
        listenAddr: '0.0.0.0:30303',
        ports: { discovery: 30303, listener: 30303 },
      },
      'get nodeInfo',
    )
  })
  await server.stop()
})
describe('should return rlpx server info with ip6', async () => {
  const config = new Config({
    accountCache: 10000,
    storageCache: 1000,
    extIP: '::',
  })
  const mockId = '0123'
  const server = new RlpxServer({
    config,
    bootnodes: '10.0.0.1:1234,10.0.0.2:1234',
  })
  server['initDpt'] = vi.fn()
  server['initRlpx'] = vi.fn()
  server.dpt = {
    destroy: vi.fn(),
    getDnsPeers: vi.fn(),
    bootstrap: vi.fn((input) => {
      if (
        JSON.stringify(input) ===
        JSON.stringify({ address: '10.0.0.1', udpPort: 1234, tcpPort: 1234 })
      )
        return undefined
      if (
        JSON.stringify(input) ===
        JSON.stringify({ address: '10.0.0.2', udpPort: '1234', tcpPort: '1234' })
      )
        throw new Error('err0')
    }),
  } as any
  ;(server as any).rlpx = { destroy: vi.fn() }

  //@ts-expect-error -- Assigning to read-only property
  server.rlpx!.id = hexToBytes(`0x${mockId}`)

  config.events.on(Event.SERVER_ERROR, (err) => {
    it('should error', async () => {
      assert.equal(err.message, 'err0', 'got error')
    })
  })
  await server.start()
  const nodeInfo = server.getRlpxInfo()
  it('should return node info', async () => {
    assert.deepEqual(
      nodeInfo,
      {
        enode: `enode://${mockId}@[::]:30303`,
        id: mockId,
        ip: '::',
        listenAddr: '[::]:30303',
        ports: { discovery: 30303, listener: 30303 },
      },
      'get nodeInfo',
    )
  })
  await server.stop()
})
describe('should handle errors', () => {
  let count = 0
  const config = new Config({ accountCache: 10000, storageCache: 1000 })
  const server = new RlpxServer({ config })
  server.config.events.on(Event.SERVER_ERROR, (err) => {
    count = count + 1
    it('should handle rlpx error', async () => {
      if (err.message === 'err0') assert.isTrue(true, 'got server error - err0')
      if (err.message === 'err1') assert.isTrue(true, 'got peer error - err1')
    })
  })
  server['error'](new Error('EPIPE'))
  server['error'](new Error('err0'))
  server['error'](new Error('err1'))
  it('should count errors', async () => {
    assert.equal(count, 2, 'ignored error')
  })
})
describe('should ban peer', async () => {
  const config = new Config({ accountCache: 10000, storageCache: 1000 })
  const server = new RlpxServer({ config })
  assert.notOk(server.ban('123'), 'not started')
  server.started = true
  server.dpt = {
    destroy: vi.fn(),
    getDnsPeers: vi.fn(),
    bootstrap: vi.fn(),
    banPeer: vi.fn((peerId, maxAge) => {
      it('should ban correct beer', () => {
        assert.equal(peerId, '112233', 'banned correct peer')
        assert.equal(maxAge, 1234, 'got correct maxAge')
      })
    }),
  } as any
  ;(server as any).rlpx = { destroy: vi.fn(), disconnect: vi.fn() }
  server.ban('112233', 1234)
})
describe('should init dpt', async () => {
  const config = new Config({ accountCache: 10000, storageCache: 1000 })
  const server = new RlpxServer({ config })
  server['initDpt']().catch((error: Error) => {
    throw error
  })
  config.events.on(Event.SERVER_ERROR, (err) =>
    it('should throw', async () => {
      assert.equal(err.message, 'err0', 'got error')
    }),
  )
  server['dpt']?.events.emit('error', new Error('err0'))
})
describe('should handles errors from id-less peers', async () => {
  const config = new Config({ accountCache: 10000, storageCache: 1000 })
  const server = new RlpxServer({ config })
  const rlpxPeer = new RlpxPeer()
  rlpxPeer.getId = vi.fn().mockReturnValue(utf8ToBytes('test'))
  RlpxPeer.prototype.accept = vi.fn((input) => {
    if (JSON.stringify(input[0]) === JSON.stringify(rlpxPeer) && input[1] instanceof RlpxPeer) {
      return
    } else {
      throw new Error('expected input check has failed')
    }
  })
  server['initRlpx']().catch((error: Error) => {
    throw error
  })
  config.events.on(Event.SERVER_ERROR, (err) => {
    it('should throw', async () => {
      assert.equal(err.message, 'err0', 'got error')
    })
  })
  server.rlpx!.events.emit('peer:error', rlpxPeer as any, new Error('err0'))
})
describe('should init rlpx', async () => {
  const config = new Config({ accountCache: 10000, storageCache: 1000 })
  const server = new RlpxServer({ config })
  const rlpxPeer = new RlpxPeer() as unknown as Peer

  rlpxPeer.getId = vi.fn().mockReturnValue(new Uint8Array([1]))
  RlpxPeer.prototype.accept = vi.fn((input) => {
    if (JSON.stringify(input[0]) === JSON.stringify(rlpxPeer) && input[1] instanceof RlpxPeer) {
      return
    } else {
      throw new Error('expected input check has failed')
    }
  })
  server['initRlpx']().catch((error: Error) => {
    throw error
  })
  config.events.on(Event.PEER_CONNECTED, (peer) =>
    it('should connect', async () => {
      assert.isTrue((peer as any).connected, 'connected')
    }),
  )
  config.events.on(Event.PEER_DISCONNECTED, (peer) =>
    it('should disconnect', async () => {
      assert.equal(peer.id, '01', 'disconnected')
    }),
  )
  config.events.on(Event.SERVER_ERROR, (err) =>
    it('should throw error', async () => {
      assert.equal(err.message, 'err0', 'got error')
    }),
  )
  config.events.on(Event.SERVER_LISTENING, (info) =>
    it('should listen', async () => {
      assert.deepEqual(info, { transport: 'rlpx', url: 'enode://ff@0.0.0.0:30303' }, 'listening')
    }),
  )
  server.rlpx!.events.emit('peer:added', rlpxPeer)
  //@ts-expect-error -- Setting a minimal peer for testing
  server['peers'].set('01', { id: '01' })
  server.rlpx!.events.emit('peer:removed', rlpxPeer, '', true)
  server.rlpx!.events.emit('peer:error', rlpxPeer, new Error('err0'))
  ;(server.rlpx!.id as any) = hexToBytes('0xff')
  server.rlpx!.events.emit('listening')
})
