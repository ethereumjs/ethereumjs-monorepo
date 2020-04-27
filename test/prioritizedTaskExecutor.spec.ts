import * as tape from 'tape'
import { PrioritizedTaskExecutor } from '../src/prioritizedTaskExecutor'

const taskExecutor = new PrioritizedTaskExecutor(2)

tape('prioritized task executor test', function (t) {
  const tasks = [1, 2, 3, 4]
  const callbacks = [] as any
  const executionOrder = [] as any
  tasks.forEach(function (task) {
    taskExecutor.execute(task, function (cb: Function) {
      executionOrder.push(task)
      callbacks.push(cb)
    })
  })

  callbacks.forEach(function (callback: Function) {
    callback()
  })

  const expectedExecutionOrder = [1, 2, 4, 3]
  t.deepEqual(executionOrder, expectedExecutionOrder)
  t.end()
})
