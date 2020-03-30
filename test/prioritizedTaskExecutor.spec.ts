import * as tape from 'tape'
const PrioritizedTaskExecutor = require('../dist/prioritizedTaskExecutor').PrioritizedTaskExecutor
const taskExecutor = new PrioritizedTaskExecutor(2)

tape('prioritized task executor test', function (t) {
  var tasks = [1, 2, 3, 4]
  var callbacks = [] as any
  var executionOrder = [] as any
  tasks.forEach(function (task) {
    taskExecutor.execute(task, function (cb: Function) {
      executionOrder.push(task)
      callbacks.push(cb)
    })
  })

  callbacks.forEach(function (callback: Function) {
    callback()
  })

  var expectedExecutionOrder = [1, 2, 4, 3]
  t.deepEqual(executionOrder, expectedExecutionOrder)
  t.end()
})
