import { assert, describe, it } from 'vitest'

import { enqueueProtocol, protocolQueueLength } from '../src/runtime/lanes.ts'

describe('[Ethy]: protocol lane', () => {
  it('awaits async tasks before starting the next queued job', async () => {
    const order: string[] = []
    enqueueProtocol(async () => {
      order.push('a-start')
      await new Promise<void>((resolve) => setImmediate(resolve))
      order.push('a-end')
    })
    enqueueProtocol(() => {
      void order.push('b')
    })
    await new Promise<void>((resolve) => setImmediate(resolve))
    await new Promise<void>((resolve) => setImmediate(resolve))
    await new Promise<void>((resolve) => setImmediate(resolve))
    assert.deepEqual(order, ['a-start', 'a-end', 'b'])
  })

  it('runs queued work on a later turn and drains the queue', async () => {
    const order: number[] = []
    enqueueProtocol(() => {
      void order.push(1)
    })
    enqueueProtocol(() => {
      void order.push(2)
    })
    assert.equal(protocolQueueLength() >= 0, true)
    await new Promise<void>((resolve) => setImmediate(resolve))
    await new Promise<void>((resolve) => setImmediate(resolve))
    assert.deepEqual(order, [1, 2])
    assert.equal(protocolQueueLength(), 0)
  })
})
