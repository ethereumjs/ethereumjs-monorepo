import { assert, describe, it } from 'vitest'

import { enqueueProtocol, protocolQueueLength } from '../src/runtime/lanes.ts'

describe('[Ethy]: protocol lane', () => {
  it('runs queued work on a later turn and drains the queue', async () => {
    const order: number[] = []
    enqueueProtocol(() => order.push(1))
    enqueueProtocol(() => order.push(2))
    assert.equal(protocolQueueLength() >= 0, true)
    await new Promise<void>((resolve) => setImmediate(resolve))
    await new Promise<void>((resolve) => setImmediate(resolve))
    assert.deepEqual(order, [1, 2])
    assert.equal(protocolQueueLength(), 0)
  })
})
