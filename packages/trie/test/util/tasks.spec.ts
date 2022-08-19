import * as tape from 'tape'

import { PrioritizedTaskExecutor } from '../../src'

const taskExecutor = new PrioritizedTaskExecutor(2)

tape('prioritized task executor test', function (t) {
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
  t.deepEqual(executionOrder, expectedExecutionOrder)
  t.end()
})
