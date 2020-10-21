import tape from 'tape-catch'
const td = require('testdouble')
// const EventEmitter = require('events')
const { defaultLogger } = require('../../../lib/logging')
defaultLogger.silent = true

// TODO
// Test deactivated along TypeScript transition
tape.skip('[Libp2pServer]', (t) => {
  const PeerInfo = td.replace('peer-info')
  const PeerId = td.replace('peer-id')
  const Libp2pPeer = td.replace('../../../lib/net/peer/libp2ppeer')

  // TypeError: Cannot set property 'id' of undefined
  Libp2pPeer.prototype.id = 'id0'
  // TODO
  // Test deactivated along TypeScript transition, fix or remove
  /* class Libp2pNode extends EventEmitter {}
  Libp2pNode.prototype.handle = td.func()
  Libp2pNode.prototype.start = td.func()
  Libp2pNode.prototype.stop = td.func()
  Libp2pNode.prototype.peerInfo = { multiaddrs: { toArray: () => ['ma0'] } }
  td.when(Libp2pNode.prototype.handle('/proto/1')).thenCallback(null, 'conn0')
  td.when(Libp2pNode.prototype.handle('/proto/2')).thenCallback(null, 'conn1')
  td.when(Libp2pNode.prototype.start()).thenCallback()
  td.when(Libp2pNode.prototype.stop()).thenCallback()
  td.replace('../../../lib/net/peer/libp2pnode', Libp2pNode) */
  const Libp2pServer = require('../../../lib/net/server/libp2pserver')
  const peerInfo = {
    multiaddrs: { add: td.func(), toArray: td.func() },
    id: { toB58String: td.func() },
  }
  const peerInfo0 = { multiaddrs: { add: td.func() } }
  td.when(PeerId.createFromPrivKey(1)).thenCallback(null, 'id0')
  td.when(PeerId.createFromPrivKey(2)).thenCallback(null, 'id1')
  td.when(PeerId.createFromPrivKey(3)).thenCallback('err1')
  td.when(PeerInfo.create('id0')).thenCallback(null, peerInfo0)
  td.when(PeerInfo.create('id1')).thenCallback('err0')
  td.when(PeerInfo.create()).thenCallback(null, peerInfo)
  td.when(peerInfo.id.toB58String()).thenReturn('id')

  t.test('should initialize correctly', async (t) => {
    const server = new Libp2pServer({
      multiaddrs: 'ma0,ma1',
      bootnodes: 'boot0,boot1',
      key: 'abcd',
    })
    t.deepEquals(server.multiaddrs, ['ma0', 'ma1'], 'multiaddrs split')
    t.deepEquals(server.bootnodes, ['boot0', 'boot1'], 'bootnodes split')
    t.equals(server.key.toString('base64'), 'abcd', 'key is correct')
    t.equals(server.name, 'libp2p', 'get name')
    t.end()
  })

  t.test('should create peer info', async (t) => {
    let server = new Libp2pServer({ multiaddrs: 'ma0' })
    t.equals(await server.createPeerInfo(), peerInfo, 'created')
    td.verify(peerInfo.multiaddrs.add('ma0'))
    server = new Libp2pServer({ multiaddrs: 'ma0', key: 1 })
    t.equals(await server.createPeerInfo(), peerInfo0, 'created with id')
    server = new Libp2pServer({ multiaddrs: 'ma0', key: 2 })
    try {
      await server.createPeerInfo()
    } catch (err) {
      t.equals(err, 'err0', 'handle error 1')
    }
    server = new Libp2pServer({ multiaddrs: 'ma0', key: 3 })
    try {
      await server.createPeerInfo()
    } catch (err) {
      t.equals(err, 'err1', 'handle error 2')
    }
    t.end()
  })

  t.test('should get peer info', async (t) => {
    const server = new Libp2pServer()
    const connection = td.object()
    td.when(connection.getPeerInfo()).thenCallback(null, 'info')
    t.equals(await server.getPeerInfo(connection), 'info', 'got info')
    td.when(connection.getPeerInfo()).thenCallback('err0')
    try {
      await server.getPeerInfo(connection)
    } catch (err) {
      t.equals(err, 'err0', 'got error')
    }
    t.end()
  })

  t.test('should create peer', async (t) => {
    const server = new Libp2pServer({ multiaddrs: 'ma0' })
    td.when(peerInfo.multiaddrs.toArray()).thenReturn([])
    const peer = server.createPeer(peerInfo)
    t.ok(peer instanceof Libp2pPeer, 'created peer')
    t.equals(server.peers.get('id0'), peer, 'has peer')
    t.end()
  })

  // TODO
  // Test deactivated along TypeScript transition, fix or remove
  /* t.test('should start/stop server and test banning', async (t) => {
    t.plan(11)
    const server = new Libp2pServer({ multiaddrs: 'ma0' })
    const protos = [{ name: 'proto', versions: [1] }, { name: 'proto', versions: [2] }]
    const peer = td.object()
    const peer2 = td.object({ id: 'id2', bindProtocols: td.func() })
    const peerInfo2 = { id: { toB58String: () => 'id2' }, multiaddrs: { toArray: () => [] } }
    protos.forEach(p => {
      p.open = td.func()
      td.when(p.open()).thenResolve()
    })
    server.getPeerInfo = td.func()
    server.createPeer = td.func()
    td.when(server.getPeerInfo('conn0')).thenResolve(peerInfo)
    td.when(server.getPeerInfo('conn1')).thenReject('err0')
    td.when(server.createPeer(peerInfo2)).thenReturn(peer2)
    td.when(peer.accept(protos[0], 'conn0', server)).thenResolve()
    server.peers.set('id', peer)
    server.addProtocols(protos)
    server.on('listening', (info) => t.deepEquals(info, { transport: 'libp2p', url: 'ma0' }, 'listening'))
    server.once('connected', (p) => t.equals(p, peer, 'peer connected'))
    server.on('error', (err) => t.equals(err, 'err0', 'got err0'))
    t.notOk(server.ban('peer'), 'unbannable')
    t.notOk(await server.stop(), 'not started')
    await server.start()
    t.notOk(server.addProtocols([]), 'cannot add protocols after start')
    server.ban('peer0', 10)
    t.ok(server.isBanned('peer0'), 'banned')
    setTimeout(() => { t.notOk(server.isBanned('peer0'), 'ban expired') }, 20)
    // t.ok(server.node instanceof Libp2pNode, 'libp2p node created')
    server.node.emit('peer:discovery', peerInfo)
    td.when(peer2.bindProtocols(server.node, peerInfo2, server)).thenResolve()
    server.once('connected', () => t.ok('peer2 connected'))
    server.node.emit('peer:discovery', peerInfo2)
    server.node.emit('peer:connect', 'peerInfo3')
    td.verify(server.createPeer('peerInfo3'))
    await server.stop()
    t.notOk(server.running, 'stopped')
  }) */

  t.test('should reset td', (t) => {
    td.reset()
    t.end()
  })
})
