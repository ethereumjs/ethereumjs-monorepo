import tape from 'tape'
import { Sender } from '../../../lib/net/protocol/index.js'

tape('[Sender]', (t) => {
  t.test('should get/set status', (t) => {
    const sender = new Sender()
    t.deepEquals(sender.status, null, 'empty status')
    sender.status = { id: 1 }
    t.deepEquals(sender.status, { id: 1 }, 'status correct')
    t.end()
  })

  t.test('should error on abstract method calls', (t) => {
    const sender = new Sender()
    t.throws(() => sender.sendStatus({}), /Unimplemented/)
    t.throws(() => sender.sendMessage(0, []), /Unimplemented/)
    t.end()
  })
})
