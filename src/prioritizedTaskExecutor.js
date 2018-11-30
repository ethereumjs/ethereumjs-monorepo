module.exports = class PrioritizedTaskExecutor {
  /**
   * Executes tasks up to maxPoolSize at a time, other items are put in a priority queue.
   * @class PrioritizedTaskExecutor
   * @private
   * @param {Number} maxPoolSize The maximum size of the pool
   * @prop {Number} maxPoolSize The maximum size of the pool
   * @prop {Number} currentPoolSize The current size of the pool
   * @prop {Array} queue The task queue
   */
  constructor (maxPoolSize) {
    this.maxPoolSize = maxPoolSize
    this.currentPoolSize = 0
    this.queue = []
  }

  /**
   * Executes the task.
   * @private
   * @param {Number} priority The priority of the task
   * @param {Function} task The function that accepts the callback, which must be called upon the task completion.
   */
  execute (priority, task) {
    if (this.currentPoolSize < this.maxPoolSize) {
      this.currentPoolSize++
      task(() => {
        this.currentPoolSize--
        if (this.queue.length > 0) {
          this.queue.sort((a, b) => b.priority - a.priority)
          const item = this.queue.shift()
          this.execute(item.priority, item.task)
        }
      })
    } else {
      this.queue.push({
        priority: priority,
        task: task
      })
    }
  }
}
