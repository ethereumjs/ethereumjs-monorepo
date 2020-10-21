/* eslint-disable */
// TODO: re-enable linting. Disabled because much of test is commented out
// resulting in unused variable false positives
import tape from 'tape-catch'
const td = require('testdouble')
import { Peer } from '../../../lib/net/peer'
import * as events from 'events'

tape('[Peer]', (t) => {
  const peer = new Peer({
    id: '0123456789abcdef',
    address: 'address0',
    transport: 'transport0',
    inbound: true,
  })

  t.test('should get/set idle state', (t) => {
    t.ok(peer.idle, 'is initially idle')
    peer.idle = false
    t.notOk(peer.idle, 'idle set to false')
    t.end()
  })

  // Deactivated along TypeScript transition, peer.bindProtocol
  // can not be called with sender with string type
  /*t.test('should bind protocol', async (t) => {
    const bound = (new events.EventEmitter() as any)
    const sender = 'sender'
    const protocol = td.object('Protocol')
    bound.name = 'bound0'
    protocol.name = 'proto0'

    t.plan(3)
    td.when(protocol.bind(peer, sender)).thenResolve(bound)
    await peer.bindProtocol(protocol, sender)
    t.equals(peer.bound.get('bound0'), bound, 'protocol bound')
    peer.on('message', (msg: any, name: any) => {
      t.ok(msg === 'msg0' && name === 'proto0', 'on message')
    })
    peer.on('error', (err: any, name: any) => {
      t.ok(err === 'err0' && name === 'proto0', 'on error')
    })
    bound.emit('message', 'msg0')
    bound.emit('error', 'err0')
  })

  t.test('should understand protocols', t => {
    t.ok(peer.understands('bound0'), 'understands bound protocol')
    t.notOk(peer.understands('unknown'), 'does not understand unknown protocol')
    t.end()
  })

  t.test('should convert to string', t => {
    t.equals(
      peer.toString(true),
      'id=0123456789abcdef address=address0 transport=transport0 protocols=bound0 inbound=true',
      'correct full id string'
    )
    peer.inbound = false
    t.equals(
      peer.toString(),
      'id=01234567 address=address0 transport=transport0 protocols=bound0',
      'correct short id string'
    )
    t.end()
  })*/
})
