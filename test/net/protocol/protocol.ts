import tape from 'tape-catch'
const td = require('testdouble')
import { EventEmitter } from 'events'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Sender } from '../../../lib/net/protocol/sender'
import { Protocol } from '../../../lib/net/protocol/protocol'

tape('[Protocol]', (t) => {
  // TODO: remove lint ignores when disabled tests are uncommented
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const BoundProtocol = td.replace('../../../lib/net/protocol/boundprotocol')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const Sender = td.replace('../../../lib/net/protocol/sender')
  const testMessage = {
    name: 'TestMessage',
    code: 0x01,
    encode: (value: any) => value.toString(),
    decode: (value: any) => parseInt(value),
  }
  class TestProtocol extends Protocol {
    get name(): string {
      return 'test'
    }
    get versions(): number[] {
      return [1]
    }
    get messages(): any[] {
      return [testMessage]
    }
    encodeStatus(): number[] {
      return [1]
    }
    decodeStatus(status: any): any {
      return { id: status[0] }
    }
  }

  t.test('should throw if missing abstract methods', (t) => {
    const p = new Protocol()
    t.throws(() => p.versions, /Unimplemented/)
    t.throws(() => p.messages, /Unimplemented/)
    t.throws(() => p.encodeStatus(), /Unimplemented/)
    t.throws(() => p.decodeStatus({}), /Unimplemented/)
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
    const sender = new EventEmitter() // need semi-colon as statement separator
    ;((<unknown>sender) as any).sendStatus = td.func()
    ;((<unknown>sender) as any).status = [1]
    t.deepEquals(await p.handshake(sender as Sender), { id: 1 }, 'got status now')
    t.end()
  })

  t.test('should perform handshake (status later)', async (t) => {
    const p = new TestProtocol()
    const sender = new EventEmitter() // need semi-colon as statement separator
    ;((<unknown>sender) as any).sendStatus = td.func()
    setTimeout(() => {
      sender.emit('status', [1])
    }, 100)
    const status = await p.handshake(sender as Sender)
    td.verify(((<unknown>sender) as any).sendStatus([1]))
    t.deepEquals(status, { id: 1 }, 'got status later')
    t.end()
  })

  t.test('should handle handshake timeout', async (t) => {
    const p = new TestProtocol()
    const sender = new EventEmitter() // need semi-colon as statement separator
    ;((<unknown>sender) as any).sendStatus = td.func()
    p.timeout = 100
    setTimeout(() => {
      sender.emit('status', [1])
    }, 101)
    try {
      await p.handshake(sender as Sender)
    } catch (e) {
      t.ok(/timed out/.test(e.message), 'got timeout error')
    }
    t.end()
  })

  t.test('should encode message', (t) => {
    const p = new TestProtocol()
    t.equals(p.encode(testMessage, 1234), '1234', 'encoded')
    // Deactivated along TypeScript transition, wrong Message type
    //t.equals(p.encode({}, 1234), 1234, 'encode not defined')
    t.end()
  })

  t.test('should decode message', (t) => {
    const p = new TestProtocol()
    t.equals(p.decode(testMessage, '1234'), 1234, 'decoded')
    // Deactivated along TypeScript transition, wrong Message type
    //t.equals(p.decode({}, 1234), 1234, 'decode not defined')
    t.end()
  })

  // TODO: disabled due to `td.replace` / typescript transition
  /*t.test('should bind to peer', async (t) => {
    const p = new TestProtocol()
    const peer = td.object('Peer')
    const sender = new Sender()

    td.when(BoundProtocol.prototype.handshake(td.matchers.isA(Sender))).thenResolve()
    const bound = await p.bind(peer, sender)
    t.ok(bound instanceof BoundProtocol, 'correct bound protocol')
    t.equals(peer.test, bound, 'bound to peer')
    t.end()
  })*/

  td.reset()
})
