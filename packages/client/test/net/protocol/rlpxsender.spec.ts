import { EventEmitter } from 'events'
import * as td from 'testdouble'
import { assert, describe, it } from 'vitest'

import { RlpxSender } from '../../../src/net/protocol'

import type { ETH as Devp2pETH } from '@ethereumjs/devp2p'

describe('[RlpxSender]', () => {
  it('should send status', () => {
    const rlpxProtocol = td.object() as any
    const status = { id: 5 }
    const sender = new RlpxSender(rlpxProtocol)
    sender.sendStatus(status)
    td.verify(rlpxProtocol.sendStatus(status))
    td.reset()
    assert.ok(true, 'status sent')
  })

  it('should send message', () => {
    const rlpxProtocol = td.object() as any
    const sender = new RlpxSender(rlpxProtocol)
    sender.sendMessage(1, 5)
    td.verify(rlpxProtocol.sendMessage(1, 5))
    td.reset()
    assert.ok(true, 'message sent')
  })

  it('should receive status', () => {
    const rlpxProtocol = { events: new EventEmitter() }
    const sender = new RlpxSender(rlpxProtocol as Devp2pETH)
    sender.on('status', (status: any) => {
      assert.equal(status.id, 5, 'status received')
      assert.equal(sender.status.id, 5, 'status getter')
    })
    rlpxProtocol.events.emit('status', { id: 5 })
  })

  it('should receive message', () => {
    const rlpxProtocol = { events: new EventEmitter() }
    const sender = new RlpxSender(rlpxProtocol as Devp2pETH)
    sender.on('message', (message: any) => {
      assert.equal(message.code, 1, 'message received (code)')
      assert.equal(message.payload, 5, 'message received (payload)')
    })
    rlpxProtocol.events.emit('message', 1, 5)
  })

  it('should catch errors', () => {
    const rlpxProtocol = { events: new EventEmitter() }
    const sender = new RlpxSender(rlpxProtocol as Devp2pETH)
    assert.throws(() => sender.sendStatus({ id: 5 }), /not a function/, 'sendStatus error')
    assert.throws(() => sender.sendMessage(1, 5), /not a function/, 'sendMessage error')
  })
})
