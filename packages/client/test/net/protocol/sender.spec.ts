import { assert, describe, it } from 'vitest'

const { Sender } = require('../../../src/net/protocol')

describe('[Sender]', () => {
  it('should get/set status', () => {
    const sender = new Sender()
    assert.deepEqual(sender.status, null, 'empty status')
    sender.status = { id: 1 }
    assert.deepEqual(sender.status, { id: 1 }, 'status correct')
  })

  it('should error on abstract method calls', () => {
    const sender = new Sender()
    assert.throws(() => sender.sendStatus(), /Unimplemented/)
    assert.throws(() => sender.sendMessage(), /Unimplemented/)
  })
})
