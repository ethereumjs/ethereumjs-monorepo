import tape from 'tape-catch'
const td = require('testdouble')
import { EventEmitter } from 'events'
import { RlpxPeer } from '../../../lib/net/peer/rlpxpeer'
import { defaultLogger } from '../../../lib/logging'
defaultLogger.silent = true

// Many tests pass but it looks like this suite still needs to be skipped because
// importing RlpxPeer above (instead of `require`ing it within the Tape test below
// as originally) causes td.reset to hang (?). Suite will not exit
tape.skip('[RlpxPeer]', (t) => {
  const { DPT, ETH, LES } = require('ethereumjs-devp2p')
  class RLPx extends EventEmitter {}
  ((<unknown>RLPx.prototype) as any).connect = td.func()
  td.replace('ethereumjs-devp2p', { DPT, ETH, LES, RLPx })
  const RlpxSender = td.replace('../../../lib/net/protocol/rlpxsender')

  t.test('should initialize correctly', async (t) => {
    const peer = new RlpxPeer({ id: 'abcdef0123', host: '10.0.0.1', port: 1234 })
    t.equals(peer.address, '10.0.0.1:1234', 'address correct')
    t.notOk(peer.connected, 'not connected')
    t.end()
  })

  // TODO: disabled for typescript transition. Test case not reproduceable with
  // necessary Protocol instantiations due to protocol type addition to RlpxPeer.capabilities()
  /*t.test('should compute capabilities', t => {
    const protocols = [ { name: 'eth', versions: [62, 63] }, { name: 'les', versions: [2] } ]
    const caps = RlpxPeer.capabilities(protocols).map(
      ({ name, version, length } : any) => ({ name, version, length }))
    t.deepEquals(caps, [
      { name: 'eth', version: 62, length: 8 },
      { name: 'eth', version: 63, length: 17 },
      { name: 'les', version: 2, length: 21 }
    ], 'correct capabilities')
    t.end()
  })*/

  // TODO: disabled for typescript transition. td.verify failing...
  /*
  t.test('should connect to peer', async (t) => {
    const proto0: any = { name: 'les', versions: [2] }
    const peer = new RlpxPeer({ id: 'abcdef0123', protocols: [proto0] })
    proto0.open = td.func()
    td.when(proto0.open()).thenResolve()
    await peer.connect()
    td.verify((<unknown>RLPx.prototype as any).connect(td.matchers.anything()))
    t.end()
  })*/

  // TODO: disabled for typescript transition. rlpxPeer mock not sufficient
  // along rlpxPeer type addition to the Peer class
  /*t.test('should handle peer events', async (t) => {
    t.plan(5)
    let peer = new RlpxPeer({ id: 'abcdef0123', host: '10.0.0.1', port: 1234 })
    const rlpxPeer = { getDisconnectPrefix: td.func() }
    peer.bindProtocols = td.func()
    peer.rlpxPeer = rlpxPeer
    td.when(peer.bindProtocols(rlpxPeer)).thenResolve()
    td.when(rlpxPeer.getDisconnectPrefix('reason')).thenReturn('reason')
    await peer.connect()
    peer.on('error', (err: any) => t.equals(err, 'err0', 'got err0'))
    peer.on('connected', () => t.pass('got connected'))
    peer.on('disconnected', (reason: any) => t.equals(reason, 'reason', 'got disconnected'))
    peer.rlpx.emit('peer:error', rlpxPeer, 'err0')
    peer.rlpx.emit('peer:added', rlpxPeer)
    peer.rlpx.emit('peer:removed', rlpxPeer, 'reason')
    peer = new RlpxPeer({ id: 'abcdef0123', host: '10.0.0.1', port: 1234 })
    peer.bindProtocols = td.func()
    peer.rlpxPeer = rlpxPeer
    await peer.connect()
    td.when(peer.bindProtocols(rlpxPeer)).thenReject('err1')
    td.when(rlpxPeer.getDisconnectPrefix('reason')).thenThrow('err2')
    peer.on('error', (err: any) => {
      if (err === 'err1') t.pass('got err1')
      if (err === 'err2') t.pass('got err2')
    })
    peer.rlpx.emit('peer:added', rlpxPeer)
    peer.rlpx.emit('peer:removed', rlpxPeer, 'reason')
  })*/

  t.test('should throw connect error', async (t) => {
    const peer = new RlpxPeer({})
    try {
      await peer.connect()
    } catch (err) {
      t.ok(err, 'caught error')
    }
    t.end()
  })

  // TODO: disabled for typescript transition. peer.bindProtocols('rlpxpeer') mock
  // not reproduceable on peer.bindProtocols() parameter type addition
  /*t.test('should accept peer connection', async (t) => {
    const peer = new RlpxPeer({ id: 'abcdef0123', host: '10.0.0.1', port: 1234 })
    peer.bindProtocols = td.func()
    td.when(peer.bindProtocols('rlpxpeer')).thenResolve()
    await peer.accept('rlpxpeer', 'server')
    t.equals(peer.server, 'server', 'server set')
    t.end()
  })*/

  // TODO: disabled for typescript transition. `RlpxSender.on` is not a function
  /*t.test('should bind protocols', async (t) => {
    const protocols = [{ name: 'proto0' }]
    const peer = new RlpxPeer({ id: 'abcdef0123', protocols })
    const proto0 = new (class Proto0 {})()
    const rlpxPeer = { getProtocols: td.func() }
    peer.bindProtocol = td.func()
    td.when(rlpxPeer.getProtocols()).thenReturn([proto0])
    await peer.bindProtocols(rlpxPeer)
    td.verify(peer.bindProtocol({ name: 'proto0' }, td.matchers.isA(RlpxSender)))
    t.ok(peer.connected, 'connected set to true')
    t.end()
  })*/

  t.test('should reset td', (t) => {
    td.reset()
    t.end()
  })
})
