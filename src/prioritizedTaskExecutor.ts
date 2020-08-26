interface Task {
  priority: number
  fn: Function
}

export class PrioritizedTaskExecutor {
  /** The maximum size of the pool */
  private maxPoolSize: number
  /** The current size of the pool */
  private currentPoolSize: number
  /** The task queue */
  private queue: Task[]

  /**
   * Executes tasks up to maxPoolSize at a time, other items are put in a priority queue.
   * @class PrioritizedTaskExecutor
   * @private
   * @param maxPoolSize The maximum size of the pool
   */
  constructor(maxPoolSize: number) {
    this.maxPoolSize = maxPoolSize
    this.currentPoolSize = 0
    this.queue = []
  }

  /**
   * Executes the task.
   * @private
   * @param priority The priority of the task
   * @param fn The function that accepts the callback, which must be called upon the task completion.
   */
  execute(priority: number, fn: Function) {
    if (this.currentPoolSize < this.maxPoolSize) {
      this.currentPoolSize++
      fn(() => {
        this.currentPoolSize--
        if (this.queue.length > 0) {
          this.queue.sort((a, b) => b.priority - a.priority)
          const item = this.queue.shift()
          this.execute(item!.priority, item!.fn)
        }
      })
    } else {
      this.queue.push({ priority, fn })
    }
  }

  /**
   * Checks if the taskExecutor is finished.
   * @private
   * @returns Returns `true` if the taskExecutor is finished, otherwise returns `false`.
   */
  finished(): boolean {
    return this.currentPoolSize === 0
  }
}
