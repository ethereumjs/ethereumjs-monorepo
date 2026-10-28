import { assert, describe, it } from 'vitest'

import { subprotocolErrorDropsPeer } from '../../src/rlpx/peer.ts'

describe('[Devp2p/RLPx]: subprotocol errors', () => {
  it('drops the peer for a bad STATUS or a base-protocol frame', () => {
    assert.equal(subprotocolErrorDropsPeer('ETH', 0x00), true)
    assert.equal(subprotocolErrorDropsPeer('Peer', 0x01), true)
  })

  it('keeps the peer when a later eth or snap message cannot be decoded', () => {
    assert.equal(subprotocolErrorDropsPeer('ETH', 0x02), false)
    assert.equal(subprotocolErrorDropsPeer('SNAP', 0x00), false)
    assert.equal(subprotocolErrorDropsPeer('SNAP', 0x01), false)
  })
})
