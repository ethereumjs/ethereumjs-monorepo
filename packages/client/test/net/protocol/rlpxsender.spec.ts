import { EventEmitter } from 'events'
import * as td from 'testdouble'
import { assert, describe, it } from 'vitest'

import { RlpxSender } from '../../../src/net/protocol'

import type { ETH as Devp2pETH } from '@ethereumjs/devp2p'

describe('should send status', async () => {
  const rlpxProtocol = td.object() as any
  const status = { id: 5 }
  const sender = new RlpxSender(rlpxProtocol)
  sender.sendStatus(status)
  td.verify(rlpxProtocol.sendStatus(status))
  td.reset()
  it('sent status', () => {
    assert.ok(true, 'status sent')
  })
})

describe('should send message', async () => {
  const rlpxProtocol = td.object() as any
  const sender = new RlpxSender(rlpxProtocol)
  sender.sendMessage(1, 5)
  td.verify(rlpxProtocol.sendMessage(1, 5))
  td.reset()
  it('sent message', () => {
    assert.ok(true, 'message sent')
  })
})

describe('should receive status', async () => {
  const rlpxProtocol = { events: new EventEmitter() }
  const sender = new RlpxSender(rlpxProtocol as Devp2pETH)
  sender.on('status', (status: any) => {
    it('status received', () => {
      assert.equal(status.id, 5, 'status received')
      assert.equal(sender.status.id, 5, 'status getter')
    })
  })
  rlpxProtocol.events.emit('status', { id: 5 })
})

describe('should receive message', async () => {
  const rlpxProtocol = { events: new EventEmitter() }
  const sender = new RlpxSender(rlpxProtocol as Devp2pETH)
  sender.on('message', (message: any) => {
    it('message received', () => {
      assert.equal(message.code, 1, 'message received (code)')
      assert.equal(message.payload, 5, 'message received (payload)')
    })
  })
  rlpxProtocol.events.emit('message', 1, 5)
})

describe('should catch errors', async () => {
  const rlpxProtocol = { events: new EventEmitter() }
  const sender = new RlpxSender(rlpxProtocol as Devp2pETH)
  it('throws sendStatus error', () => {
    assert.throws(() => sender.sendStatus({ id: 5 }), /not a function/, 'sendStatus error')
  })
  it('throws sendMessage error', () => {
    assert.throws(() => sender.sendMessage(1, 5), /not a function/, 'sendMessage error')
  })
})
