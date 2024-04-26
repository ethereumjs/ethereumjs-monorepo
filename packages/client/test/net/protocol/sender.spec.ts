import { assert, describe, it } from 'vitest'

import { Sender } from '../../../src/net/protocol/index.js'

describe('[Sender]', () => {
  it('should get/set status', () => {
    const sender = new Sender()
    assert.deepEqual(sender.status, null, 'empty status')
    sender.status = { id: 1 }
    assert.deepEqual(sender.status, { id: 1 }, 'status correct')
  })

  it('should error on abstract method calls', () => {
    const sender = new Sender()
    assert.throws(() => sender.sendStatus(undefined), /Unimplemented/)
    assert.throws(() => sender.sendMessage(0, []), /Unimplemented/)
  })
})
