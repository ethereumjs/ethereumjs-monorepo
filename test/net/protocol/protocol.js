const tape = require('tape-catch')
const td = require('testdouble')
const EventEmitter = require('events')

tape('[Protocol]', t => {
  const BoundProtocol = td.replace('../../../lib/net/protocol/boundprotocol')
  const Sender = td.replace('../../../lib/net/protocol/sender')
  const Protocol = require('../../../lib/net/protocol/protocol')
  const testMessage = {
    name: 'TestMessage',
    code: 0x01,
    encode: value => value.toString(),
    decode: value => parseInt(value)
  }
  class TestProtocol extends Protocol {
    get name () { return 'test' }
    get versions () { return [1] }
    get messages () { return [ testMessage ] }
    encodeStatus () { return [1] }
    decodeStatus (status) { return { id: status[0] } }
  }

  t.test('should throw if missing abstract methods', t => {
    const p = new Protocol()
    t.throws(() => p.name, /Unimplemented/)
    t.throws(() => p.versions, /Unimplemented/)
    t.throws(() => p.messages, /Unimplemented/)
    t.throws(() => p.encodeStatus(), /Unimplemented/)
    t.throws(() => p.decodeStatus(), /Unimplemented/)
    t.end()
  })

  t.test('should handle open', async (t) => {
    const p = new Protocol()
    await p.open()
    t.ok(p.opened, 'is open')
    t.end()
  })

  t.test('should perform handshake (status now)', async (t) => {
    const p = new TestProtocol()
    const sender = new EventEmitter()
    sender.sendStatus = td.func()
    sender.status = [1]
    t.deepEquals(await p.handshake(sender), {id: 1}, 'got status now')
    t.end()
  })

  t.test('should perform handshake (status later)', async (t) => {
    const p = new TestProtocol()
    const sender = new EventEmitter()
    sender.sendStatus = td.func()
    setTimeout(() => {
      sender.emit('status', [1])
    }, 100)
    const status = await p.handshake(sender)
    td.verify(sender.sendStatus([1]))
    t.deepEquals(status, {id: 1}, 'got status later')
    t.end()
  })

  t.test('should handle handshake timeout', async (t) => {
    const p = new TestProtocol()
    const sender = new EventEmitter()
    sender.sendStatus = td.func()
    p.timeout = 100
    setTimeout(() => {
      sender.emit('status', [1])
    }, 101)
    try {
      await p.handshake(sender)
    } catch (e) {
      t.ok(/timed out/.test(e.message), 'got timeout error')
    }
    t.end()
  })

  t.test('should encode message', t => {
    const p = new TestProtocol()
    t.equals(p.encode(testMessage, 1234), '1234', 'encoded')
    t.equals(p.encode({}, 1234), 1234, 'encode not defined')
    t.end()
  })

  t.test('should decode message', t => {
    const p = new TestProtocol()
    t.equals(p.decode(testMessage, '1234'), 1234, 'decoded')
    t.equals(p.decode({}, 1234), 1234, 'decode not defined')
    t.end()
  })

  t.test('should bind to peer', async (t) => {
    const p = new TestProtocol()
    const peer = td.object('Peer')
    const sender = new Sender()

    td.when(BoundProtocol.prototype.handshake(td.matchers.isA(Sender))).thenResolve()
    const bound = await p.bind(peer, sender)
    t.ok(bound instanceof BoundProtocol, 'correct bound protocol')
    t.equals(peer.test, bound, 'bound to peer')
    t.end()
  })

  td.reset()
})
