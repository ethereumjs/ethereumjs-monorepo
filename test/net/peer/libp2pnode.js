const tape = require('tape-catch')
const td = require('testdouble')
const { Libp2pNode } = require('../../../lib/net/peer')
const libp2p = require('libp2p')

tape('[Libp2pNode]', t => {
  t.test('should be a libp2p bundle', t => {
    const peerInfo = td.object('PeerInfo')
    const node = new Libp2pNode({peerInfo})
    t.ok(node instanceof libp2p, 'is libp2p bundle')
    t.end()
  })
})
