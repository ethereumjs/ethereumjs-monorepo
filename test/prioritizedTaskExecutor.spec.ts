import * as tape from 'tape'
import { PrioritizedTaskExecutor } from '../src/prioritizedTaskExecutor'

const taskExecutor = new PrioritizedTaskExecutor(2)

tape('prioritized task executor test', function (t) {
  let tasks = [1, 2, 3, 4]
  let callbacks = [] as any
  let executionOrder = [] as any
  tasks.forEach(function (task) {
    taskExecutor.execute(task, function (cb: Function) {
      executionOrder.push(task)
      callbacks.push(cb)
    })
  })

  callbacks.forEach(function (callback: Function) {
    callback()
  })

  let expectedExecutionOrder = [1, 2, 4, 3]
  t.deepEqual(executionOrder, expectedExecutionOrder)
  t.end()
})
