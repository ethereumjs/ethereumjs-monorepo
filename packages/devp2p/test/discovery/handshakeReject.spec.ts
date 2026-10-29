import { assert, describe, it } from 'vitest'

import { classifyHandshakeReject } from '../../src/discovery/handshakeReject.ts'

describe('[Devp2p/Discovery]: handshake reject class', () => {
  it('separates protocol rejects from dead discovery pings', () => {
    assert.equal(
      classifyHandshakeReject('Genesis mismatch: we=0x25a5cc10... remote=0x11'),
      'genesis',
    )
    assert.equal(classifyHandshakeReject('Network id mismatch: we=11155111 remote=369'), 'network')
    assert.equal(classifyHandshakeReject('Unknown fork hash'), 'fork')
    assert.equal(classifyHandshakeReject('read ECONNRESET'), 'reset')
    assert.equal(classifyHandshakeReject('Timeout error: ping 1.2.3.4:30303'), undefined)
    assert.equal(classifyHandshakeReject('ETH status timeout'), 'timeout')
  })
})
