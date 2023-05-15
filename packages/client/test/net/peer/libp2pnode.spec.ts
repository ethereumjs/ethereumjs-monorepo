import * as tape from 'tape'
import * as td from 'testdouble'

tape('[Libp2pNode]', async (t) => {
  td.replace('libp2p')
  const { Libp2pNode } = await import('../../../lib/net/peer/libp2pnode')

  t.test('should be a libp2p bundle', (t) => {
    const peerId = td.object('PeerId') as any
    const node = new Libp2pNode({ peerId })
    t.equals(node.constructor.name, Libp2pNode.name, 'is libp2p bundle')
    t.end()
  })

  t.test('should reset td', (t) => {
    td.reset()
    t.end()
  })
})
