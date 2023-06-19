import { multiaddr } from 'multiaddr'
import { assert, describe, it } from 'vitest'
import * as td from 'testdouble'

import { Config } from '../../../src/config'
import { Event } from '../../../src/types'

import type { Libp2pPeer } from '../../../src/net/peer'
import type { Protocol } from '../../../src/net/protocol'

describe('[Libp2pPeer]', async () => {
  td.replace('peer-id')

  const Libp2pNode = td.constructor(['start', 'stop', 'dial', 'dialProtocol'] as any)
  td.replace('../../../src/net/peer/libp2pnode', { Libp2pNode })
  const Libp2pSender = td.replace<any>('../../../src/net/protocol/libp2psender')

  td.when(Libp2pNode.prototype.start()).thenResolve(null)
  td.when(Libp2pNode.prototype.dial(td.matchers.anything())).thenResolve(null)

  const { Libp2pPeer } = await import('../peer/libp2ppeer')

  it('should initialize correctly', async () => {
    const config = new Config()
    const multiaddrs = [
      multiaddr('/ip4/192.0.2.1/tcp/12345'),
      multiaddr('/ip4/192.0.2.1/tcp/23456'),
    ]
    const peer = new Libp2pPeer({ config, multiaddrs })
    assert.equal(
      peer.address,
      '/ip4/192.0.2.1/tcp/12345,/ip4/192.0.2.1/tcp/23456',
      'address correct'
    )
  })

  it('should connect to peer', async () => {
    const config = new Config()
    const peer = new Libp2pPeer({ config })
    config.events.on(Event.PEER_CONNECTED, (peer) => {
      assert.equal((peer as Libp2pPeer).address, '/ip4/0.0.0.0/tcp/0', 'connected')
    })
    await peer.connect()
  })

  it('should accept peer connection', async () => {
    const config = new Config()
    const peer: any = new Libp2pPeer({ config })
    peer.bindProtocol = td.func<typeof peer['bindProtocol']>()
    td.when(peer.bindProtocol('proto' as any, 'conn' as any)).thenResolve(null)
    await peer.accept('proto', 'conn', 'server')
    assert.equal(peer.server, 'server', 'server set')
    assert.ok(peer.inbound, 'inbound set to true')
  })

  it('should bind protocols', async () => {
    const config = new Config()
    const protocol = { name: 'proto', versions: [1], open: () => {} } as Protocol
    const badProto = { name: 'bad', versions: [1], open: () => {} } as Protocol
    const peer: any = new Libp2pPeer({ config, protocols: [protocol, badProto] })
    const node = new Libp2pNode() as any
    peer.bindProtocol = td.func<typeof peer['bindProtocol']>()
    protocol.open = td.func<Protocol['open']>()
    badProto.open = td.func<Protocol['open']>()
    td.when(peer.bindProtocol(protocol, td.matchers.isA(Libp2pSender))).thenResolve(null)
    td.when(protocol.open()).thenResolve()
    td.when(node.dialProtocol(td.matchers.anything(), '/proto/1')).thenResolve(null)
    td.when(node.dialProtocol(td.matchers.anything(), '/bad/1')).thenReject(new Error('bad'))
    await peer.bindProtocols(node, td.matchers.anything(), 'server')
    assert.equal(peer.server, 'server', 'server set')
    assert.ok((peer as any).connected, 'connected set to true')
  })

  it('should reset td', () => {
    td.reset()
  })
})
