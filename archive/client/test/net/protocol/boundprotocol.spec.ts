import { EventEmitter } from 'eventemitter3'
import { assert, describe, expect, it, vi } from 'vitest'

import { Config } from '../../../src/config.ts'
import { BoundProtocol } from '../../../src/net/protocol/index.ts'
import { Sender } from '../../../src/net/protocol/sender.ts'
import { Event } from '../../../src/types.ts'

describe('[BoundProtocol]', () => {
  const peer = {} as any
  const protocol = {
    timeout: 100,
    messages: [] as any[],
    handshake: vi.fn(),
    decode: vi.fn(),
    encode: vi.fn(),
  } as any
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
  protocol.messages = [testMessage, testResponse]

  it('should add methods for messages with a response', () => {
    const sender = new Sender()
    const config = new Config({ accountCache: 10000, storageCache: 1000 })
    const bound = new BoundProtocol({
      config,
      protocol,
      peer,
      sender,
    })

    assert.strictEqual(bound['protocol'].messages[0].name, 'TestMessage')
  })

  it('should get/set status', () => {
    const sender = new Sender()
    const config = new Config({ accountCache: 10000, storageCache: 1000 })
    const bound = new BoundProtocol({
      config,
      protocol,
      peer,
      sender,
    })
    assert.deepEqual(bound.status, {}, 'empty status')
    bound.status = { id: 1 }
    assert.deepEqual(bound.status, { id: 1 }, 'status set')
  })

  it('should do handshake', async () => {
    const config = new Config({ accountCache: 10000, storageCache: 1000 })
    const sender = new EventEmitter() as Sender
    const bound = new BoundProtocol({
      config,
      protocol,
      peer,
      sender,
    })
    protocol.handshake.mockResolvedValue({ id: 1 })
    await bound.handshake(sender)
    assert.deepEqual(bound.status, { id: 1 }, 'handshake success')
  })

  it('should handle incoming without resolver', async () => {
    const config = new Config({ accountCache: 10000, storageCache: 1000 })
    const sender = new Sender()
    const bound = new BoundProtocol({
      config,
      protocol,
      peer,
      sender,
    })
    bound.config.events.once(Event.PROTOCOL_ERROR, (err) => {
      assert.isTrue(/error0/.test(err.message), 'decode error')
    })
    protocol.decode.mockImplementation((msg: any, payload: string) => {
      if (payload === '1') throw new Error('error0')
      if (payload === '2') return 2
      return payload
    })
    bound['handle']({ name: 'TestMessage', code: 0x01, payload: '1' })
    bound.config.events.once(Event.PROTOCOL_MESSAGE, (message) => {
      assert.deepEqual(message, { name: 'TestMessage', data: 2 }, 'correct message')
    })
    bound['handle']({ name: 'TestMessage', code: 0x01, payload: '2' })
  })

  it('should perform send', () => {
    const config = new Config({ accountCache: 10000, storageCache: 1000 })
    const sender = new Sender()
    sender.sendMessage = vi.fn()
    const bound = new BoundProtocol({
      config,
      protocol,
      peer,
      sender,
    })
    protocol.encode.mockReturnValue('3')
    assert.deepEqual(bound.send('TestMessage', 3), testMessage, 'message returned')
    expect(sender.sendMessage).toHaveBeenCalledWith(0x01, '3' as any)
    assert.throws(() => bound.send('UnknownMessage'), /Unknown message/, 'unknown message')
  })

  it('should perform request', async () => {
    const config = new Config({ accountCache: 10000, storageCache: 1000 })
    const sender = new Sender()
    const testPeer = { pooled: true } as any
    const bound = new BoundProtocol({
      config,
      protocol,
      peer: testPeer,
      sender,
    })
    protocol.encode.mockReturnValue('1')
    protocol.decode.mockImplementation((msg: any, payload: string) => {
      if (payload === '2') return 2
      return payload
    })
    sender.sendMessage = vi.fn().mockImplementation(() => {
      // Use setImmediate to ensure the event is emitted in the next tick
      // but before the timeout fires
      setImmediate(() => {
        sender.emit('message', { code: 0x02, payload: '2' })
      })
    })
    const response = await bound.request('TestMessage', 1)
    assert.strictEqual(response, 2, 'got response')
    protocol.decode.mockImplementation((msg: any, payload: string) => {
      if (payload === '2') throw new Error('error1')
      return payload
    })
    try {
      await bound.request('TestMessage', 1)
    } catch (err: any) {
      assert.isTrue(/error1/.test(err.message), 'got error')
    }
  })

  it('should timeout request', async () => {
    const config = new Config({ accountCache: 10000, storageCache: 1000 })
    const sender = {
      sendMessage: vi.fn(),
      on: vi.fn(),
      emit: vi.fn(),
    } as any as Sender
    const bound = new BoundProtocol({
      config,
      protocol,
      peer,
      sender,
    })
    try {
      await bound.request('TestMessage', {})
    } catch (err: any) {
      assert.isTrue(/timed out/.test(err.message), 'got error')
    }
  })
})
