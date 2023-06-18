import { assert, describe, it } from 'vitest'
import * as td from 'testdouble'

describe('[Libp2pNode]', async () => {
  td.replace('libp2p')
  const { Libp2pNode } = await import('../peer/libp2pnode')

  it('should be a libp2p bundle', () => {
    const peerId = td.object('PeerId') as any
    const node = new Libp2pNode({ peerId })
    assert.equal(node.constructor.name, Libp2pNode.name, 'is libp2p bundle')
  })

  it('should reset td', () => {
    td.reset()
  })
})
