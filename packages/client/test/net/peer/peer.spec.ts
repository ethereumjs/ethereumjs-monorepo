import { EventEmitter } from 'events'
import * as td from 'testdouble'
import { assert, describe, it } from 'vitest'

import { Config } from '../../../src/config'
import { Peer } from '../../../src/net/peer'
import { Event } from '../../../src/types'

describe('[Peer]', () => {
  const config = new Config({ transports: [], accountCache: 10000, storageCache: 1000 })
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

  it('should bind protocol', async () => {
    const bound = new EventEmitter() as any
    const sender = 'sender' as any
    const protocol = td.object('Protocol') as any
    bound.name = 'bound0'
    protocol.name = 'proto0'

    td.when(protocol.bind(peer, sender)).thenResolve(bound)
    await (peer as any).bindProtocol(protocol, sender)
    assert.equal(peer.bound.get('bound0'), bound, 'protocol bound')
    config.events.on(Event.PROTOCOL_MESSAGE, (msg, name, msgPeer) => {
      assert.ok(msg === 'msg0' && name === 'proto0' && msgPeer === peer, 'on message')
    })
    config.events.on(Event.PEER_ERROR, (err) => {
      if (err.message === 'err0') assert.ok(true, 'on error')
    })
    config.events.emit(Event.PROTOCOL_MESSAGE, 'msg0', 'proto0', peer)
    config.events.emit(Event.PEER_ERROR, new Error('err0'), peer)
  })

  it('should understand protocols', () => {
    assert.ok(peer.understands('bound0'), 'understands bound protocol')
    assert.notOk(peer.understands('unknown'), 'does not understand unknown protocol')
  })

  it('should convert to string', () => {
    assert.equal(
      peer.toString(true),
      'id=0123456789abcdef address=address0 transport=transport0 protocols=bound0 inbound=true',
      'correct full id string'
    )
    peer.inbound = false
    assert.equal(
      peer.toString(),
      'id=01234567 address=address0 transport=transport0 protocols=bound0 inbound=false',
      'correct short id string'
    )
  })
})
