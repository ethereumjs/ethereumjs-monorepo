import { Fetcher, FetcherOptions } from './fetcher'
import { BN } from 'ethereumjs-util'
import { Chain } from '../../blockchain'

export interface BlockFetcherOptions extends FetcherOptions {
  /* Blockchain */
  chain: Chain

  /* Block number to start fetching from */
  first: BN

  /* How many blocks to fetch */
  count: BN

  /* Destroy fetcher once all tasks are done */
  destroyWhenDone?: boolean
}

export type JobTask = {
  first: BN
  count: number
}

export abstract class BlockFetcherBase<JobResult, StorageItem> extends Fetcher<
  JobTask,
  JobResult,
  StorageItem
> {
  protected chain: Chain
  /**
   * `first` is from where the fetcher pendancy starts apart from the jobs/tasks already
   *  in the `in` queue.
   */
  first: BN
  /**
   * `count` are the number of items in fetcher pendancy starting from (and including)
   * `first`. `first + count - 1` gives the height fetcher is attempting to reach
   */
  count: BN

  /**
   * Create new block fetcher
   */
  constructor(options: BlockFetcherOptions) {
    super(options)

    this.chain = options.chain
    this.first = options.first
    this.count = options.count
    this.debug(
      `Block fetcher instantiated interval=${this.interval} first=${this.first} count=${this.count} destroyWhenDone=${this.destroyWhenDone}`
    )
  }

  /**
   * Generate list of tasks to fetch, modifies `first`` and `count` to indicate any
   * remaning pendancy of the fetcher apart from jobs/tasks it pushes in the queue
   */
  tasks(first = this.first, count = this.count, maxTasks = Infinity): JobTask[] {
    const max = this.config.maxPerRequest
    const tasks: JobTask[] = []
    let debugStr = `first=${first}`
    const pushedCount = new BN(0)

    while (count.gten(max) && tasks.length < maxTasks) {
      tasks.push({ first: first.clone(), count: max })
      first.iaddn(max)
      count.isubn(max)
      pushedCount.iaddn(max)
    }
    if (count.gtn(0) && tasks.length < maxTasks) {
      tasks.push({ first: first.clone(), count: count.toNumber() })
      pushedCount.iadd(count)
    }
    debugStr = `${debugStr} count=${pushedCount}`
    this.debug(`Created new tasks num=${tasks.length} ${debugStr}`)
    return tasks
  }

  nextTasks(): void {
    if (this.in.length === 0 && this.count.gten(0)) {
      this.debug(`Fetcher has pendancy with first=${this.first} count=${this.count}`)
      const tasks = this.tasks(this.first, this.count, this.config.maxFetcherJobs)
      for (const task of tasks) {
        this.enqueueTask(task)
      }
      this.debug(`Enqueued num=${tasks.length} tasks`)
    }
  }

  /**
   * Clears all outstanding tasks from the fetcher
   */
  clear() {
    let first = this.first
    let last = this.first.add(this.count).subn(1)

    // we have to loop and figure out because the jobs won't always be an monotonically
    // increasing order, some jobs could have refetch tasks enqueued. So better to find
    // the first and last examining each job
    while (this.in.length > 0) {
      const job = this.in.remove()
      if (!job) break
      if (job.task.first.lt(first)) {
        first = job.task.first
      }
      const jobLast = job.task.first.addn(job.task.count).subn(1)
      if (jobLast.gt(last)) {
        last = jobLast
      }
    }
    this.first = first
    this.count = last.sub(this.first).addn(1)
    // already removed jobs from the `in` heap, just pass to super for further cleanup
    super.clear()
  }

  /**
   * Create new tasks based on a provided list of block numbers.
   *
   * If numbers are sequential the request is created as bulk request.
   *
   * If there are no tasks in the fetcher and `min` is behind head,
   * inserts the requests for the missing blocks first.
   *
   * @param numberList List of block numbers
   * @param min Start block number
   */
  enqueueByNumberList(numberList: BN[], min: BN, max: BN) {
    // Check and update the height
    const last = this.first.add(this.count).subn(1)
    let updateHeightStr = ''
    if (max.gt(last)) {
      this.count.iadd(max.sub(last))
      updateHeightStr = `updated height=${max}`
    }
    // Re enqueue the numbers which are < `this.first`  to refetch them else they will be
    // fetched in the future automatically on the jobs created by `nextTasks`
    numberList = numberList.filter((num) => num.lte(this.first))
    const numBlocks = numberList.length
    let bulkRequest = true
    const seqCheckNum = min.clone()
    for (let num = 1; num <= numBlocks; num++) {
      if (!numberList.map((num) => num.toString()).includes(seqCheckNum.toString())) {
        bulkRequest = false
        break
      }
      seqCheckNum.iaddn(1)
    }

    if (bulkRequest && numBlocks > 0) {
      this.enqueueTask(
        {
          first: min,
          count: numBlocks,
        },
        true
      )
    } else {
      numberList.forEach((first) => {
        this.enqueueTask(
          {
            first,
            count: 1,
          },
          true
        )
      })
    }
    this.debug(
      `Enqueued tasks by number list num=${numberList.length} min=${min} bulkRequest=${bulkRequest} ${updateHeightStr}`
    )
    if (this.in.length === 0) {
      this.nextTasks()
    }
  }
}
