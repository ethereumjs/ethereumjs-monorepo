import { EventEmitter } from 'events'
import tape from 'tape-catch'
import td from 'testdouble'
import { Config } from '../../../lib/config'

tape('[Libp2pServer]', async (t) => {
  const PeerInfo = td.replace('peer-info')
  const PeerId = td.replace('peer-id')

  const Libp2pPeer = td.replace('../../../lib/net/peer/libp2ppeer')
  Libp2pPeer.id = 'id0'

  class Libp2pNode extends EventEmitter {
    peerInfo = { multiaddrs: { toArray: () => ['ma0'] } }
    handle(_: any) {}
    asyncStart() {}
    asyncStop() {}
  }
  Libp2pNode.prototype.handle = td.func<any>()
  Libp2pNode.prototype.asyncStart = td.func<any>()
  Libp2pNode.prototype.asyncStop = td.func<any>()
  td.replace('../../../lib/net/peer/libp2pnode', { Libp2pNode })

  td.when(Libp2pNode.prototype.handle('/proto/1')).thenCallback(null, 'conn0')
  td.when(Libp2pNode.prototype.handle('/proto/2')).thenCallback(null, 'conn1')
  td.when(Libp2pNode.prototype.asyncStart()).thenResolve()
  td.when(Libp2pNode.prototype.asyncStop()).thenResolve()

  const peerInfo = {
    multiaddrs: { add: td.func(), toArray: td.func() },
    id: { toB58String: td.func() },
  }
  const peerInfo0 = { multiaddrs: { add: td.func() } }

  td.when(PeerId.createFromPrivKey(Buffer.from('1'))).thenCallback(null, 'id0')
  td.when(PeerId.createFromPrivKey(Buffer.from('2'))).thenCallback(null, 'id1')
  td.when(PeerId.createFromPrivKey(Buffer.from('3'))).thenCallback(new Error('err1'), null)
  td.when(PeerInfo.create('id0')).thenCallback(null, peerInfo0)
  td.when(PeerInfo.create('id1')).thenCallback(new Error('err0'), null)
  td.when(PeerInfo.create()).thenCallback(null, peerInfo)
  td.when(peerInfo.id.toB58String()).thenReturn('id')

  const { Libp2pServer } = await import('../../../lib/net/server/libp2pserver')

  t.test('should initialize correctly', async (t) => {
    const config = new Config({ transports: [] })
    const server = new Libp2pServer({
      config,
      multiaddrs: 'ma0,ma1',
      bootnodes: ['0.0.0.0:3030', '1.1.1.1:3031'],
      key: Buffer.from('abcd'),
    })
    t.deepEquals((server as any).multiaddrs, ['ma0', 'ma1'], 'multiaddrs split')
    t.deepEquals(
      server.bootnodes,
      [
        { ip: '0.0.0.0', port: 3030 },
        { ip: '1.1.1.1', port: 3031 },
      ],
      'bootnodes split'
    )
    t.equals(server.key!.toString(), 'abcd', 'key is correct')
    t.equals(server.name, 'libp2p', 'get name')
    t.end()
  })

  t.test('should create peer info', async (t) => {
    const config = new Config({ transports: [] })
    let server = new Libp2pServer({ config, multiaddrs: ['/ip4/6.6.6.6'] })
    t.equals(await server.createPeerInfo(), peerInfo, 'created')
    td.verify(peerInfo.multiaddrs.add('/ip4/6.6.6.6'))
    server = new Libp2pServer({ config, multiaddrs: 'ma0', key: Buffer.from('1') })
    t.equals(await server.createPeerInfo(), peerInfo0, 'created with id')
    server = new Libp2pServer({ config, multiaddrs: 'ma0', key: Buffer.from('2') })
    try {
      await server.createPeerInfo()
    } catch (err) {
      t.equals(err.message, 'err0', 'handle error 1')
    }
    server = new Libp2pServer({ config, multiaddrs: 'ma0', key: Buffer.from('3') })
    try {
      await server.createPeerInfo()
    } catch (err) {
      t.equals(err.message, 'err1', 'handle error 2')
    }
    t.end()
  })

  t.test('should get peer info', async (t) => {
    const config = new Config({ transports: [] })
    const server = new Libp2pServer({ config })
    const connection = td.object<any>()
    td.when(connection.getPeerInfo()).thenCallback(null, 'info')
    t.equals(await server.getPeerInfo(connection), 'info', 'got info')
    td.when(connection.getPeerInfo()).thenCallback(new Error('err0'), null)
    try {
      await server.getPeerInfo(connection)
    } catch (err) {
      t.equals(err.message, 'err0', 'got error')
    }
    t.end()
  })

  t.test('should create peer', async (t) => {
    const config = new Config({ transports: [] })
    const server = new Libp2pServer({ config, multiaddrs: 'ma0' })
    td.when(peerInfo.multiaddrs.toArray()).thenReturn([])
    const peer = server.createPeer(peerInfo)
    t.equals(peer.constructor.name, 'Libp2pPeer', 'created peer')
    t.equals((server as any).peers.get(peer.id), peer, 'has peer')
    t.end()
  })

  t.test('should start/stop server and test banning', async (t) => {
    t.plan(11)
    const config = new Config({ transports: [], loglevel: 'off' })
    const server = new Libp2pServer({ config, multiaddrs: 'ma0' })
    const protos: any = [
      { name: 'proto', versions: [1] },
      { name: 'proto', versions: [2] },
    ]
    const peer = td.object<any>()
    const peer2 = td.object({ id: 'id2', bindProtocols: td.func() }) as any
    const peerInfo2 = { id: { toB58String: () => 'id2' }, multiaddrs: { toArray: () => [] } }
    protos.forEach((p: any) => {
      p.open = td.func()
      td.when(p.open()).thenResolve(null)
    })
    server.getPeerInfo = td.func<typeof server['getPeerInfo']>()
    server.createPeer = td.func<typeof server['createPeer']>()
    td.when(server.getPeerInfo('conn0')).thenResolve(peerInfo)
    td.when(server.getPeerInfo('conn1')).thenReject(new Error('err0'))
    td.when(server.createPeer(peerInfo2)).thenReturn(peer2)
    td.when(peer.accept(protos[0], 'conn0', server)).thenResolve(null)
    ;(server as any).peers.set('id', peer)
    server.addProtocols(protos)
    server.on('listening', (info: any) =>
      t.deepEquals(info, { transport: 'libp2p', url: 'ma0' }, 'listening')
    )
    server.once('connected', (p: any) => t.equals(p, peer, 'peer connected'))
    server.on('error', (err: Error) => t.equals(err.message, 'err0', 'got err0'))
    t.notOk(server.ban('peer'), 'unbannable')
    t.notOk(await server.stop(), 'not started')
    await server.start()
    t.notOk(server.addProtocols([]), 'cannot add protocols after start')
    server.ban('peer0', 10)
    t.ok(server.isBanned('peer0'), 'banned')
    setTimeout(() => {
      t.notOk(server.isBanned('peer0'), 'ban expired')
    }, 20)
    const { node } = server as any
    t.equals(node.constructor.name, 'Libp2pNode', 'libp2p node created')
    node.emit('peer:discovery', peerInfo)
    td.when(peer2.bindProtocols(node, peerInfo2, server)).thenResolve(null)
    server.once('connected', () => t.ok('peer2 connected'))
    node.emit('peer:discovery', peerInfo2)
    node.emit('peer:connect', 'peerInfo3')
    td.verify(server.createPeer('peerInfo3'))
    await server.stop()
    t.notOk(server.running, 'stopped')
  })

  t.test('should reset td', (t) => {
    td.reset()
    t.end()
  })
})
