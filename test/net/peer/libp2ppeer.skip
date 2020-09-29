// import Libp2pNode from '../../../lib/net/peer/libp2pnode'
const tape = require('tape-catch')
const td = require('testdouble')
const { defaultLogger } = require('../../../lib/logging')
defaultLogger.silent = true

tape('[Libp2pPeer]', t => {
  const PeerInfo = td.replace('peer-info')
  const PeerId = td.replace('peer-id')

  // const Libp2pNode = td.replace('../../../lib/net/peer/libp2pnode')
  const Libp2pSender = td.replace('../../../lib/net/protocol/libp2psender')
  const Libp2pPeer = require('../../../lib/net/peer/libp2ppeer')
  const peerInfo = { multiaddrs: { add: td.func() }, id: { toB58String: td.func() } }
  const peerInfo0 = { multiaddrs: { add: td.func() } }
  td.when(PeerId.createFromB58String('id0')).thenReturn('peerId0')
  td.when(PeerId.createFromB58String('id1')).thenReturn('peerId1')
  td.when(PeerInfo.create('peerId0')).thenCallback(null, peerInfo0)
  td.when(PeerInfo.create('peerId1')).thenCallback('error0')
  td.when(PeerInfo.create()).thenCallback(null, peerInfo)
  td.when(peerInfo.id.toB58String()).thenReturn('id')

  t.test('should initialize correctly', async (t) => {
    const peer = new Libp2pPeer({ multiaddrs: 'ma0,ma1' })
    t.deepEquals(peer.multiaddrs, [ 'ma0', 'ma1' ], 'multiaddrs split')
    t.equals(peer.address, 'ma0,ma1', 'address correct')
    t.end()
  })

  t.test('should create PeerInfo', async (t) => {
    const peer = new Libp2pPeer()
    t.equals(await peer.createPeerInfo({ multiaddrs: ['ma0'] }), peerInfo, 'created')
    td.verify(peerInfo.multiaddrs.add('ma0'))
    t.equals(await peer.createPeerInfo({ multiaddrs: ['ma0'], id: 'id0' }), peerInfo0, 'created with id')
    try {
      await peer.createPeerInfo({ multiaddrs: ['ma0'], id: 'id1' })
    } catch (err) {
      t.equals(err, 'error0', 'handle error')
    }
    t.end()
  })

  // TODO
  // Test deactivated along TypeScript transition, fix or remove
  /* t.test('should connect to peer', async (t) => {
    const peer = new Libp2pPeer()
    peer.bindProtocols = td.func()
    Libp2pNode.prototype.asyncStart = td.func()
    Libp2pNode.prototype.asyncDial = td.func()
    td.when(Libp2pNode.prototype.asyncStart()).thenResolve()
    td.when(Libp2pNode.prototype.asyncDial(peerInfo)).thenResolve()
    td.when(peer.bindProtocols(td.matchers.anything(), peerInfo)).thenResolve()
    peer.connect()
    peer.on('connected', () => {
      t.pass('connected')
      t.end()
    })
  }) */

  t.test('should accept peer connection', async (t) => {
    const peer = new Libp2pPeer()
    peer.bindProtocol = td.func()
    td.when(peer.bindProtocol('proto', td.matchers.isA(Libp2pSender))).thenResolve()
    await peer.accept('proto', 'conn', 'server')
    t.equals(peer.server, 'server', 'server set')
    t.ok(peer.inbound, 'inbound set to true')
    t.end()
  })

  t.test('should bind protocols', async (t) => {
    const protocol = { name: 'proto', versions: [1] }
    const badProto = { name: 'bad', versions: [1] }
    const peer = new Libp2pPeer({ protocols: [ protocol, badProto ] })
    const node = td.object('Libp2pNode')
    peer.bindProtocol = td.func()
    protocol.open = td.func()
    badProto.open = td.func()
    td.when(peer.bindProtocol(protocol, td.matchers.isA(Libp2pSender))).thenResolve()
    td.when(protocol.open()).thenResolve()
    td.when(node.asyncDialProtocol(peerInfo, '/proto/1')).thenResolve()
    td.when(node.asyncDialProtocol(peerInfo, '/bad/1')).thenReject(new Error('bad'))
    await peer.bindProtocols(node, peerInfo, 'server')
    t.equals(peer.server, 'server', 'server set')
    t.ok(peer.connected, 'connected set to true')
    t.end()
  })

  t.test('should reset td', t => {
    td.reset()
    t.end()
  })
})
