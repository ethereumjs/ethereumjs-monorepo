const tape = require('tape-catch')
const td = require('testdouble')

tape('[Libp2pNode]', t => {
  const libp2p = td.replace('libp2p')
  const Libp2pNode = require('../../../lib/net/peer/libp2pnode')

  t.test('should be a libp2p bundle', t => {
    const peerInfo = td.object('PeerInfo')
    const node = new Libp2pNode({ peerInfo })
    t.ok(node instanceof libp2p, 'is libp2p bundle')
    t.end()
  })

  t.test('should reset td', t => {
    td.reset()
    t.end()
  })
})
