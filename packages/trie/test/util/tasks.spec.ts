import { assert, describe, it } from 'vitest'

import { PrioritizedTaskExecutor } from '../../src/index.js'

const taskExecutor = new PrioritizedTaskExecutor(2)

describe('prioritized task executor test', () => {
  it('should work', () => {
    const tasks = [1, 2, 3, 4]
    const callbacks = [] as any
    const executionOrder = [] as any
    for (const task of tasks) {
      taskExecutor.executeOrQueue(task, function (cb: Function) {
        executionOrder.push(task)
        callbacks.push(cb)
      })
    }

    for (const callback of callbacks) {
      callback()
    }

    const expectedExecutionOrder = [1, 2, 4, 3]
    assert.deepEqual(executionOrder, expectedExecutionOrder)
  })
})
