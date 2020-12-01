import { EventEmitter } from 'events'
import tape from 'tape-catch'
import td from 'testdouble'
import { Peer } from '../../../lib/net/peer'
import { Config } from '../../../lib/config'

tape('[Peer]', (t) => {
  const config = new Config({ transports: [], loglevel: 'error' })
  const peer = new Peer({
    config,
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

  t.test('should bind protocol', async (t) => {
    const bound = new EventEmitter() as any
    const sender = 'sender' as any
    const protocol = td.object('Protocol') as any
    bound.name = 'bound0'
    protocol.name = 'proto0'

    t.plan(3)
    td.when(protocol.bind(peer, sender)).thenResolve(bound)
    await peer.bindProtocol(protocol, sender)
    t.equals(peer.bound.get('bound0'), bound, 'protocol bound')
    peer.on('message', (msg: string, name: string) => {
      t.ok(msg === 'msg0' && name === 'proto0', 'on message')
    })
    peer.on('error', (err: Error, name: string) => {
      t.ok(err.message === 'err0' && name === 'proto0', 'on error')
    })
    bound.emit('message', 'msg0')
    bound.emit('error', new Error('err0'))
  })

  t.test('should understand protocols', (t) => {
    t.ok(peer.understands('bound0'), 'understands bound protocol')
    t.notOk(peer.understands('unknown'), 'does not understand unknown protocol')
    t.end()
  })

  t.test('should convert to string', (t) => {
    t.equals(
      peer.toString(true),
      'id=0123456789abcdef address=address0 transport=transport0 protocols=bound0 inbound=true',
      'correct full id string'
    )
    peer.inbound = false
    t.equals(
      peer.toString(),
      'id=01234567 address=address0 transport=transport0 protocols=bound0 inbound=false',
      'correct short id string'
    )
    t.end()
  })
})
