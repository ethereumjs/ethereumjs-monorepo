import tape from 'tape'
import td from 'testdouble'
import { Config } from '../../../lib/config'
import { Protocol } from '../../../lib/net/protocol'

tape('[Libp2pPeer]', async (t) => {
  const PeerInfo = td.replace('peer-info')
  const PeerId = td.replace('peer-id')

  const Libp2pNode = td.constructor([
    'asyncStart',
    'asyncStop',
    'asyncDial',
    'asyncDialProtocol',
  ] as any)
  td.replace('../../../lib/net/peer/libp2pnode', { Libp2pNode })
  const Libp2pSender = td.replace('../../../lib/net/protocol/libp2psender')

  const peerInfo = { multiaddrs: { add: td.func() }, id: { toB58String: td.func() } }
  const peerInfo0 = { multiaddrs: { add: td.func() } }

  td.when(PeerId.createFromB58String('id0')).thenReturn('peerId0')
  td.when(PeerId.createFromB58String('id1')).thenReturn('peerId1')
  td.when(PeerInfo.create('peerId0')).thenCallback(null, peerInfo0)
  td.when(PeerInfo.create('peerId1')).thenCallback(new Error('error0'), null)
  td.when(PeerInfo.create()).thenCallback(null, peerInfo)
  td.when(peerInfo.id.toB58String()).thenReturn('id')

  td.when(Libp2pNode.prototype.asyncStart()).thenResolve(null)
  td.when(Libp2pNode.prototype.asyncDial(peerInfo)).thenResolve(null)

  const { Libp2pPeer } = await import('../../../lib/net/peer/libp2ppeer')

  t.test('should initialize correctly', async (t) => {
    const config = new Config({ loglevel: 'error' })
    const peer = new Libp2pPeer({ config, multiaddrs: 'ma0,ma1' })
    t.deepEquals((peer as any).multiaddrs, ['ma0', 'ma1'], 'multiaddrs split')
    t.equals(peer.address, 'ma0,ma1', 'address correct')
    t.end()
  })

  t.test('should create PeerInfo', async (t) => {
    const config = new Config({ loglevel: 'error' })
    const peer = new Libp2pPeer({ config })
    t.equals(await peer.createPeerInfo({ multiaddrs: ['ma0'] }), peerInfo, 'created')
    td.verify(peerInfo.multiaddrs.add('ma0'))
    t.equals(
      await peer.createPeerInfo({ multiaddrs: ['ma0'], id: 'id0' }),
      peerInfo0,
      'created with id'
    )
    try {
      await peer.createPeerInfo({ multiaddrs: ['ma0'], id: 'id1' })
    } catch (err) {
      t.equals(err.message, 'error0', 'handle error')
    }
    t.end()
  })

  t.test('should connect to peer', async (t) => {
    const config = new Config({ loglevel: 'error' })
    const peer = new Libp2pPeer({ config })
    peer.bindProtocols = td.func<typeof peer['bindProtocol']>()
    td.when(peer.bindProtocols(td.matchers.anything(), peerInfo)).thenResolve()
    peer.on('connected', () => {
      t.pass('connected')
      t.end()
    })
    await peer.connect()
  })

  t.test('should accept peer connection', async (t) => {
    const config = new Config({ loglevel: 'error' })
    const peer = new Libp2pPeer({ config })
    peer.bindProtocol = td.func<typeof peer['bindProtocol']>()
    td.when(peer.bindProtocol('proto' as any, 'conn' as any)).thenResolve()
    await peer.accept('proto', 'conn', 'server')
    t.equals(peer.server, 'server', 'server set')
    t.ok(peer.inbound, 'inbound set to true')
    t.end()
  })

  t.test('should bind protocols', async (t) => {
    const config = new Config({ loglevel: 'error' })
    const protocol = { name: 'proto', versions: [1], open: () => {} } as Protocol
    const badProto = { name: 'bad', versions: [1], open: () => {} } as Protocol
    const peer = new Libp2pPeer({ config, protocols: [protocol, badProto] })
    const node = new Libp2pNode() as any
    peer.bindProtocol = td.func<typeof peer['bindProtocol']>()
    protocol.open = td.func<Protocol['open']>()
    badProto.open = td.func<Protocol['open']>()
    td.when(peer.bindProtocol(protocol, td.matchers.isA(Libp2pSender))).thenResolve()
    td.when(protocol.open()).thenResolve()
    td.when(node.asyncDialProtocol(peerInfo, '/proto/1')).thenResolve(null)
    td.when(node.asyncDialProtocol(peerInfo, '/bad/1')).thenReject(new Error('bad'))
    await peer.bindProtocols(node, peerInfo, 'server')
    t.equals(peer.server, 'server', 'server set')
    t.ok((peer as any).connected, 'connected set to true')
    t.end()
  })

  t.test('should reset td', (t) => {
    td.reset()
    t.end()
  })
})
