import { EventEmitter } from 'eventemitter3'
import * as td from 'testdouble'
import { assert, describe, it } from 'vitest'

import { RlpxSender } from '../../../src/net/protocol/index.ts'

import type { ETH as Devp2pETH } from '@ethereumjs/devp2p'

describe('should send status', async () => {
  const rlpxProtocol = td.object() as any
  const status = { id: 5 }
  const sender = new RlpxSender(rlpxProtocol)
  sender.sendStatus(status)
  td.verify(rlpxProtocol.sendStatus(status))
  td.reset()
  it('sent status', () => {
    assert.isTrue(true, 'status sent')
  })
})

describe('should send message', async () => {
  const rlpxProtocol = td.object() as any
  const sender = new RlpxSender(rlpxProtocol)
  sender.sendMessage(1, 5)
  td.verify(rlpxProtocol.sendMessage(1, 5))
  td.reset()
  it('sent message', () => {
    assert.isTrue(true, 'message sent')
  })
})

describe('should receive status', async () => {
  const rlpxProtocol = { events: new EventEmitter() }
  const sender = new RlpxSender(rlpxProtocol as never as Devp2pETH)
  sender.on('status', (status: any) => {
    it('status received', () => {
      assert.strictEqual(status.id, 5, 'status received')
      assert.strictEqual(sender.status.id, 5, 'status getter')
    })
  })
  rlpxProtocol.events.emit('status', { id: 5 })
})

describe('should receive message', async () => {
  const rlpxProtocol = { events: new EventEmitter() }
  const sender = new RlpxSender(rlpxProtocol as any)
  sender.on('message', (message: any) => {
    it('message received', () => {
      assert.strictEqual(message.code, 1, 'message received (code)')
      assert.strictEqual(message.payload, 5, 'message received (payload)')
    })
  })
  rlpxProtocol.events.emit('message', 1, 5)
})
