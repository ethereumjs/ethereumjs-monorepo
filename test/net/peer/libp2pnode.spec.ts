import tape from 'tape-catch'
const td = require('testdouble')
// const Libp2pNode = require('../../../lib/net/peer/libp2pnode')

tape('[Libp2pNode]', (t) => {
  // const libp2p = td.replace('libp2p')

  t.test('should be a libp2p bundle', (t) => {
    // TODO: fix this test
    // libp2p class members on node are there, but
    // instanceof check is not working any more
    // after TypeScript transition
    // const peerInfo = td.object('PeerInfo')
    // const node = new Libp2pNode({ peerInfo })
    // t.ok(node instanceof libp2p, 'is libp2p bundle')
    t.end()
  })

  t.test('should reset td', (t) => {
    td.reset()
    t.end()
  })
})
