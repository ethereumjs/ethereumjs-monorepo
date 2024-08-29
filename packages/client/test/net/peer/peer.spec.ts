import { assert, describe, it } from 'vitest'

import { Config } from '../../../src/config.js'
import { Peer as AbstractPeer } from '../../../src/net/peer/index.js'

// Mock peer class (can't directly use the imported Peer class  as it's abstract)
class Peer extends AbstractPeer {
  async connect() {}
}

describe('[Peer]', () => {
  const config = new Config({ accountCache: 10000, storageCache: 1000 })
  const peer = new Peer({
    config,
    id: '0123456789abcdef',
    address: 'address0',
    transport: 'transport0',
    inbound: true,
  })

  it('should get/set idle state', () => {
    assert.ok(peer.idle, 'is initially idle')
    peer.idle = false
    assert.notOk(peer.idle, 'idle set to false')
  })

  it('should convert to string', () => {
    assert.equal(
      peer.toString(true),
      'id=0123456789abcdef address=address0 transport=transport0 inbound=true',
      'correct full id string',
    )
    peer.inbound = false
    assert.equal(
      peer.toString(),
      'id=01234567 address=address0 transport=transport0 inbound=false',
      'correct short id string',
    )
  })
})
