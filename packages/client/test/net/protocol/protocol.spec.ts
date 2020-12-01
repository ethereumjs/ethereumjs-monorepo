import tape from 'tape-catch'
import td from 'testdouble'
import { BoundProtocol, Protocol, Sender } from '../../../lib/net/protocol'
import { Config } from '../../../lib/config'

tape('[Protocol]', (t) => {
  const testMessage = {
    name: 'TestMessage',
    code: 0x01,
    encode: (value: any) => value.toString(),
    decode: (value: any) => parseInt(value),
  }
  class TestProtocol extends Protocol {
    constructor() {
      const config = new Config({ transports: [] })
      super({ config })
    }

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
    const config = new Config({ transports: [] })
    const p = new Protocol({ config })
    t.throws(() => p.versions, /Unimplemented/)
    t.throws(() => p.messages, /Unimplemented/)
    t.throws(() => p.encodeStatus(), /Unimplemented/)
    t.throws(() => p.decodeStatus({}), /Unimplemented/)
    t.end()
  })

  t.test('should handle open', async (t) => {
    const config = new Config({ transports: [] })
    const p = new Protocol({ config })
    await p.open()
    t.ok(p.opened, 'is open')
    t.end()
  })

  t.test('should perform handshake (status now)', async (t) => {
    const p = new TestProtocol()
    const sender = new Sender()
    sender.sendStatus = td.func<Sender['sendStatus']>()
    sender.status = [1]
    t.deepEquals(await p.handshake(sender), { id: 1 }, 'got status now')
    t.end()
  })

  t.test('should perform handshake (status later)', async (t) => {
    const p = new TestProtocol()
    const sender = new Sender()
    sender.sendStatus = td.func<Sender['sendStatus']>()
    setTimeout(() => {
      sender.emit('status', [1])
    }, 100)
    const status = await p.handshake(sender)
    td.verify(sender.sendStatus([1]))
    t.deepEquals(status, { id: 1 }, 'got status later')
    t.end()
  })

  t.test('should handle handshake timeout', async (t) => {
    const p = new TestProtocol()
    const sender = new Sender()
    sender.sendStatus = td.func<Sender['sendStatus']>()
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

  t.test('should encode message', (t) => {
    const p = new TestProtocol()
    t.equals(p.encode(testMessage, 1234), '1234', 'encoded')
    t.equals(p.encode({} as any, 1234), 1234, 'encode not defined')
    t.end()
  })

  t.test('should decode message', (t) => {
    const p = new TestProtocol()
    t.equals(p.decode(testMessage, '1234'), 1234, 'decoded')
    t.equals(p.decode({} as any, 1234), 1234, 'decode not defined')
    t.end()
  })

  t.test('should bind to peer', async (t) => {
    const p = new TestProtocol()
    const peer = td.object('Peer') as any
    const sender = new Sender()
    BoundProtocol.prototype.handshake = td.func<BoundProtocol['handshake']>()
    td.when(BoundProtocol.prototype.handshake(td.matchers.isA(Sender))).thenResolve()
    const bound = await p.bind(peer, sender)
    t.ok(bound instanceof BoundProtocol, 'correct bound protocol')
    t.equals(peer.test, bound, 'bound to peer')
    t.end()
  })

  td.reset()
})
