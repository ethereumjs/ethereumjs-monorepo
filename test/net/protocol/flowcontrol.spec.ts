/// <reference path="./testdouble-timers.d.ts" />
import tape from 'tape-catch'
import td from 'testdouble'
import timers from 'testdouble-timers'
import { FlowControl } from '../../../lib/net/protocol'

timers.use(td)

tape('[FlowControl]', (t) => {
  const settings = {
    bl: 1000,
    mrc: {
      test: { base: 100, req: 100 },
    },
    mrr: 10,
  }
  const peer = { id: '1', les: { status: settings } } as any
  const clock = (td as any).timers()

  t.test('should handle incoming flow control', (t) => {
    const expected = [700, 700, 410, 120, -170]
    const flow = new FlowControl(settings)
    let correct = 0
    for (let count = 0; count < 5; count++) {
      const bv = flow.handleRequest(peer, 'test', 2)
      if (bv === expected[count]) correct++
      clock.tick(1)
    }
    t.equals(correct, 5, 'correct bv values')
    t.notOk(flow.out.get(peer.id), 'peer should be dropped')
    t.end()
  })

  t.test('should handle outgoing flow control', (t) => {
    const expected = [9, 6, 3, 0, 0]
    const flow = new FlowControl()
    let correct = 0
    for (let count = 0; count < 5; count++) {
      flow.handleReply(peer, 1000 - count * 300)
      const max = flow.maxRequestCount(peer, 'test')
      if (max === expected[count]) correct++
      clock.tick(1)
    }
    t.equals(correct, 5, 'correct max values')
    t.end()
  })
})
