/// <reference path="./testdouble-timers.d.ts" />
/// <reference path="./testdouble.d.ts" />
import { assert, describe, it, vi } from 'vitest'

import { FlowControl } from '../../../src/net/protocol/index.js'

vi.useFakeTimers()

describe('[FlowControl]', () => {
  const settings = {
    bl: 1000,
    mrc: {
      test: { base: 100, req: 100 },
    },
    mrr: 10,
  }
  const peer = { id: '1', les: { status: settings } } as any

  it('should handle incoming flow control', () => {
    const expected = [700, 410, 120, -170]
    const flow = new FlowControl(settings)
    let correct = 0
    for (let count = 0; count < 4; count++) {
      const bv = flow.handleRequest(peer, 'test', 2)
      if (bv === expected[count]) correct++
      vi.advanceTimersByTime(1)
    }
    assert.equal(correct, 4, 'correct bv values')
    assert.notOk(flow.out.get(peer.id), 'peer should be dropped')
  })

  it('should handle outgoing flow control', () => {
    const expected = [9, 6, 3, 0, 0]
    const flow = new FlowControl()
    let correct = 0
    for (let count = 0; count < 5; count++) {
      flow.handleReply(peer, 1000 - count * 300)
      const max = flow.maxRequestCount(peer, 'test')
      if (max === expected[count]) correct++
      vi.advanceTimersByTime(1)
    }
    assert.equal(correct, 5, 'correct max values')
  })
})
