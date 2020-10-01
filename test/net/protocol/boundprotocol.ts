// Suppresses "Cannot redeclare block-scoped variable" errors
// TODO: remove when import becomes possible
export = {}

import * as tape from 'tape-catch'
const td = require('testdouble')
const EventEmitter = require('events')
const BoundProtocol = require('../../../lib/net/protocol/boundprotocol')

tape('[BoundProtocol]', t => {
  const peer = td.object('Peer')
  const protocol = td.object('Protocol')
  const testMessage = {
    name: 'TestMessage',
    code: 0x01,
    response: 0x02,
    encode: (value: any) => value.toString(),
    decode: (value: any) => parseInt(value)
  }
  const testResponse = {
    name: 'TestResponse',
    code: 0x02,
    encode: (value: any) => value.toString(),
    decode: (value: any) => parseInt(value)
  }
  protocol.timeout = 100
  protocol.messages = [ testMessage, testResponse ]

  t.test('should add methods for messages with a response', t => {
    const sender = new EventEmitter()
    const bound = new BoundProtocol({ protocol, peer, sender })
    t.ok(/this.request/.test(bound.testMessage.toString()), 'added testMessage')
    t.ok(/this.request/.test(bound.TestMessage.toString()), 'added TestMessage')
    t.end()
  })

  t.test('should get/set status', t => {
    const sender = new EventEmitter()
    const bound = new BoundProtocol({ protocol, peer, sender })
    t.deepEquals(bound.status, {}, 'empty status')
    bound.status = { id: 1 }
    t.deepEquals(bound.status, { id: 1 }, 'status set')
    t.end()
  })

  t.test('should do handshake', async (t) => {
    const sender = new EventEmitter()
    const bound = new BoundProtocol({ protocol, peer, sender })
    td.when(protocol.handshake(td.matchers.isA(EventEmitter))).thenResolve({ id: 1 })
    await bound.handshake(sender)
    t.deepEquals(bound.status, { id: 1 }, 'handshake success')
    t.end()
  })

  t.test('should handle incoming without resolver', async (t) => {
    const sender = new EventEmitter()
    const bound = new BoundProtocol({ protocol, peer, sender })
    t.notOk(bound.handle({}), 'missing message.code')
    bound.once('error', (err: any) => {
      t.ok(/error0/.test(err.message), 'decode error')
    })
    td.when(protocol.decode(testMessage, '1')).thenThrow(new Error('error0'))
    bound.handle({ code: 0x01, payload: '1' })
    bound.once('message', (message: any) => {
      t.deepEquals(message, { name: 'TestMessage', data: 2 }, 'correct message')
    })
    td.when(protocol.decode(testMessage, '2')).thenReturn(2)
    bound.handle({ code: 0x01, payload: '2' })
    t.end()
  })

  t.test('should perform send', t => {
    const sender = new EventEmitter()
    sender.sendMessage = td.func()
    const bound = new BoundProtocol({ protocol, peer, sender })
    td.when(protocol.encode(testMessage, 3)).thenReturn('3')
    t.deepEquals(bound.send('TestMessage', 3), testMessage, 'message returned')
    td.verify(sender.sendMessage(0x01, '3'))
    t.throws(() => bound.send('UnknownMessage'), /Unknown message/, 'unknown message')
    t.end()
  })

  t.test('should perform request', async (t) => {
    const sender = new EventEmitter()
    const bound = new BoundProtocol({ protocol, peer, sender })
    sender.sendMessage = td.func()
    td.when(protocol.encode(testMessage, 1)).thenReturn('1')
    td.when(protocol.decode(testResponse, '2')).thenReturn(2)
    td.when(sender.sendMessage(0x01, '1')).thenDo(() => {
      setTimeout(() => {
        sender.emit('message', { code: 0x02, payload: '2' })
      }, 100)
    })
    const response = await bound.testMessage(1)
    t.equals(response, 2, 'got response')
    td.when(protocol.decode(testResponse, '2')).thenThrow(new Error('error1'))
    try {
      await bound.testMessage(1)
    } catch (err) {
      t.ok(/error1/.test(err.message), 'got error')
    }
    t.end()
  })

  t.test('should timeout request', async (t) => {
    const sender = td.object('Sender')
    const bound = new BoundProtocol({ protocol, peer, sender })
    try {
      await bound.testMessage(1)
    } catch (err) {
      t.ok(/timed out/.test(err.message), 'got error')
    }
    t.end()
  })

  td.reset()
})
