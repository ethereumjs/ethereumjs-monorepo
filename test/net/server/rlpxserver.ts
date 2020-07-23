import tape from 'tape-catch'
const td = require('testdouble')
const EventEmitter = require('events')
import { RlpxServer } from '../../../lib/net/server/rlpxserver'
const { defaultLogger } = require('../../../lib/logging')
defaultLogger.silent = true

tape('[RlpxServer]', (t) => {
  class RlpxPeer extends EventEmitter { }
  RlpxPeer.capabilities = td.func()
  RlpxPeer.prototype.accept = td.func()
  td.replace('../../../lib/net/peer/rlpxpeer', RlpxPeer)
  class RLPx extends EventEmitter { }
  RLPx.prototype.listen = td.func()
  class DPT extends EventEmitter { }
  DPT.prototype.bind = td.func()
  td.replace('ethereumjs-devp2p', { DPT, RLPx })
  td.when(
    RlpxPeer.prototype.accept(td.matchers.anything(), td.matchers.isA(RlpxServer))
  ).thenResolve()

  t.test('should initialize correctly', async (t) => {
    const server = new RlpxServer({
      bootnodes: '10.0.0.1:1234,enode://abcd@10.0.0.2:1234',
      key: 'abcd',
    })
    t.equals(server.name, 'rlpx', 'get name')
    t.ok((server.key as Buffer).equals(Buffer.from('abcd', 'hex')), 'key parse')
    t.deepEquals(
      server.bootnodes,
      [
        {
          ip: '10.0.0.1',
          port: '1234',
        },
        {
          id: 'abcd',
          ip: '10.0.0.2',
          port: '1234',
        },
      ],
      'bootnodes split'
    )
    t.end()
  })

  t.test('should start/stop server', async (t) => {
    const server = new RlpxServer({
      bootnodes: '10.0.0.1:1234,10.0.0.2:1234',
    })
    server.initDpt = td.func()
    server.initRlpx = td.func()
    server.dpt = td.object()
    server.rlpx = td.object()
    td.when(
      (server.dpt as any).bootstrap({ address: '10.0.0.1', udpPort: '1234', tcpPort: '1234' })
    ).thenResolve()
    td.when(
      (server.dpt as any).bootstrap({ address: '10.0.0.2', udpPort: '1234', tcpPort: '1234' })
    ).thenReject('err0')
    server.on('error', (err: any) => t.equals(err, 'err0', 'got error'))
    await server.start()
    td.verify(server.initDpt())
    td.verify(server.initRlpx())
    t.ok(server.running, 'started')
    t.notOk(await server.start(), 'already started')
    await server.stop()
    td.verify((server.dpt as any).destroy())
    td.verify((server.rlpx as any).destroy())
    t.notOk(server.running, 'stopped')
    t.notOk(await server.stop(), 'already stopped')
    t.end()
  })

  t.test('should return rlpx server info', async (t) => {
    const mockId = '123'
    const server = new RlpxServer({
      bootnodes: '10.0.0.1:1234,10.0.0.2:1234'
    })
    server.initDpt = td.func()
    server.initRlpx = td.func()
    server.dpt = td.object()
    server.rlpx = td.object({
      _id: mockId,
      destroy: td.func()
    })
    td.when(server.dpt.bootstrap({ address: '10.0.0.1', udpPort: '1234', tcpPort: '1234' })).thenResolve()
    td.when(server.dpt.bootstrap({ address: '10.0.0.2', udpPort: '1234', tcpPort: '1234' })).thenReject('err0')
    server.on('error', err => t.equals(err, 'err0', 'got error'))
    await server.start()
    const nodeInfo = server.getRlpxInfo()
    t.deepEqual(nodeInfo, {
      enode: `enode://${mockId}@[::]:30303`,
      id: mockId,
      ip: '::',
      listenAddr: '[::]:30303',
      ports: { discovery: 30303, listener: 30303 }
    }, 'get nodeInfo')
    await server.stop()
    t.end()
  })

  t.test('should handle errors', t => {
    t.plan(3)
    let count = 0
    const server = new RlpxServer()
    const peer = new EventEmitter()
    server.on('error', (err: any) => {
      count = count + 1
      t.equals(err.message, 'err0', 'got error')
    })
    server.error(new Error('EPIPE'))
    server.error(new Error('err0'))
    setTimeout(() => {
      t.equals(count, 1, 'ignored error')
    }, 100)
    peer.on('error', (err: any) => t.deepEqual(err, new Error('err1'), 'got peer error'))
    server.error(new Error('err1'), peer)
  })

  t.test('should ban peer', (t) => {
    const server = new RlpxServer()
    t.notOk(server.ban('123'), 'not started')
    server.started = true
    server.dpt = td.object()
    server.ban('peer0', 1234)
    td.verify((server.dpt as any).banPeer('peer0', 1234))
    t.end()
  })

  // Deactivated along TypeScript transition
  // TODO: investigate
  /*t.test('should init dpt', t => {
    t.plan(1)
    const server = new RlpxServer()
    server.initDpt()
    td.verify((server.dpt as any).bind(server.port, '0.0.0.0'))
    server.on('error', (err: any) => t.equals(err, 'err0', 'got error'));
    (server.dpt as any).emit('error', 'err0')
  })*/

  // Deactivated along TypeScript transition
  // server.initRlpx() not working with td-modified RlpxPeer class object
  /*t.test('should init rlpx', t => {
    t.plan(4)
    const server = new RlpxServer()
    const rlpxPeer = td.object()
    td.when(rlpxPeer.getId()).thenReturn(Buffer.from([1]))
    td.when(RlpxPeer.prototype.accept(rlpxPeer, td.matchers.isA(RlpxServer))).thenResolve()
    server.initRlpx()
    td.verify(RlpxPeer.capabilities(server.protocols))
    td.verify(server.rlpx.listen(server.port, '0.0.0.0'))
    server.on('connected', (peer: any) => t.ok(peer instanceof RlpxPeer, 'connected'))
    server.on('disconnected', (peer: any) => t.equals(peer.id, '01', 'disconnected'))
    server.on('error', (err: any) => t.equals(err, 'err0', 'got error'))
    server.on('listening', (info: any) => t.deepEquals(info, { transport: 'rlpx', url: 'enode://ff@[::]:30303' }, 'listening'))
    server.rlpx.emit('peer:added', rlpxPeer)
    server.peers.set('01', { id: '01' })
    server.rlpx.emit('peer:removed', rlpxPeer)
    server.rlpx.emit('peer:error', rlpxPeer, 'err0')
    server.rlpx._id = Buffer.from('ff', 'hex')
    server.rlpx.emit('listening')
  })*/

  // Deactivated along TypeScript transition
  // server.initRlpx() not working with td-modified RlpxPeer class object
  /*t.test('should handles errors from id-less peers', t => {
    t.plan(1)
    const server = new RlpxServer()
    const rlpxPeer = td.object()
    td.when(rlpxPeer.getId()).thenReturn(null)
    td.when(RlpxPeer.prototype.accept(rlpxPeer, td.matchers.isA(RlpxServer))).thenResolve()
    server.initRlpx()
    server.on('error', (err: any) => t.equals(err, 'err0', 'got error'))
    server.rlpx.emit('peer:error', rlpxPeer, 'err0')
  })*/

  t.test('should reset td', (t) => {
    td.reset()
    t.end()
  })
})
