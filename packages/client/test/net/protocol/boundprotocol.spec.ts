import { EventEmitter } from 'events'
import tape from 'tape-catch'
import td from 'testdouble'
import { Sender } from '../../../lib/net/protocol/sender'
import { BoundProtocol } from '../../../lib/net/protocol'
import { Config } from '../../../lib/config'

tape('[BoundProtocol]', (t) => {
  const peer = td.object('Peer') as any
  const protocol = td.object('Protocol') as any
  const testMessage = {
    name: 'TestMessage',
    code: 0x01,
    response: 0x02,
    encode: (value: any) => value.toString(),
    decode: (value: any) => parseInt(value),
  }
  const testResponse = {
    name: 'TestResponse',
    code: 0x02,
    encode: (value: any) => value.toString(),
    decode: (value: any) => parseInt(value),
  }
  protocol.timeout = 100
  protocol.messages = [testMessage, testResponse]

  t.test('should add methods for messages with a response', (t) => {
    const sender = new Sender()
    const config = new Config({ transports: [], loglevel: 'error' })
    const bound = new BoundProtocol({
      config,
      protocol,
      peer,
      sender,
    })
    t.ok(/this.request/.test((bound as any).testMessage.toString()), 'added testMessage')
    t.end()
  })

  t.test('should get/set status', (t) => {
    const sender = new Sender()
    const config = new Config({ transports: [], loglevel: 'error' })
    const bound = new BoundProtocol({
      config,
      protocol,
      peer,
      sender,
    })
    t.deepEquals(bound.status, {}, 'empty status')
    bound.status = { id: 1 }
    t.deepEquals(bound.status, { id: 1 }, 'status set')
    t.end()
  })

  t.test('should do handshake', async (t) => {
    const config = new Config({ transports: [], loglevel: 'error' })
    const sender = new EventEmitter() as Sender
    const bound = new BoundProtocol({
      config,
      protocol,
      peer,
      sender,
    })
    td.when(protocol.handshake(td.matchers.isA(EventEmitter))).thenResolve({ id: 1 })
    await bound.handshake(sender)
    t.deepEquals(bound.status, { id: 1 }, 'handshake success')
    t.end()
  })

  t.test('should handle incoming without resolver', async (t) => {
    const config = new Config({ transports: [], loglevel: 'error' })
    const sender = new Sender()
    const bound = new BoundProtocol({
      config,
      protocol,
      peer,
      sender,
    })
    bound.once('error', (err: any) => {
      t.ok(/error0/.test(err.message), 'decode error')
    })
    td.when(protocol.decode(testMessage, '1')).thenThrow(new Error('error0'))
    bound.handle({ name: 'TestMessage', code: 0x01, payload: '1' })
    bound.once('message', (message: any) => {
      t.deepEquals(message, { name: 'TestMessage', data: 2 }, 'correct message')
    })
    td.when(protocol.decode(testMessage, '2')).thenReturn(2)
    bound.handle({ name: 'TestMessage', code: 0x01, payload: '2' })
    t.end()
  })

  t.test('should perform send', (t) => {
    const config = new Config({ transports: [], loglevel: 'error' })
    const sender = new Sender()
    sender.sendMessage = td.func<Sender['sendMessage']>()
    const bound = new BoundProtocol({
      config,
      protocol,
      peer,
      sender,
    })
    td.when(protocol.encode(testMessage, 3)).thenReturn('3')
    t.deepEquals(bound.send('TestMessage', 3), testMessage, 'message returned')
    td.verify(sender.sendMessage(0x01, '3' as any))
    t.throws(() => bound.send('UnknownMessage'), /Unknown message/, 'unknown message')
    t.end()
  })

  t.test('should perform request', async (t) => {
    const config = new Config({ transports: [], loglevel: 'error' })
    const sender = new Sender()
    const bound = new BoundProtocol({
      config,
      protocol,
      peer,
      sender,
    })
    sender.sendMessage = td.func<Sender['sendMessage']>()
    td.when(protocol.encode(testMessage, 1)).thenReturn('1')
    td.when(protocol.decode(testResponse, '2')).thenReturn(2)
    td.when(sender.sendMessage(0x01, '1' as any)).thenDo(() => {
      setTimeout(() => {
        sender.emit('message', { code: 0x02, payload: '2' })
      }, 100)
    })
    const response = await (bound as any).testMessage(1)
    t.equals(response, 2, 'got response')
    td.when(protocol.decode(testResponse, '2')).thenThrow(new Error('error1'))
    try {
      await (bound as any).testMessage(1)
    } catch (err) {
      t.ok(/error1/.test(err.message), 'got error')
    }
    t.end()
  })

  t.test('should timeout request', async (t) => {
    const config = new Config({ transports: [], loglevel: 'error' })
    const sender = td.object<Sender>('Sender')
    const bound = new BoundProtocol({
      config,
      protocol,
      peer,
      sender,
    })
    try {
      await (bound as any).testMessage(1)
    } catch (err) {
      t.ok(/timed out/.test(err.message), 'got error')
    }
    t.end()
  })

  t.test('should reset td', (t) => {
    td.reset()
    t.end()
  })
})
