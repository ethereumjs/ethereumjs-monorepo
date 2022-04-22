import { Fetcher, FetcherOptions } from './fetcher'
import { BN } from 'ethereumjs-util'
import { Chain } from '../../blockchain'

export interface BlockFetcherOptions extends FetcherOptions {
  /** Blockchain */
  chain: Chain

  /** Block number to start fetching from */
  first: BN

  /** How many blocks to fetch */
  count: BN

  /** Whether to fetch the blocks in reverse order (e.g. for beacon sync). Default: false */
  reverse?: boolean

  /** Destroy fetcher once all tasks are done */
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
   * Where the fetcher starts apart from the tasks already in the `in` queue
   */
  first: BN
  /**
   * Number of items in the fetcher starting from (and including) `first`.
   * `first + count - 1` gives the height fetcher is attempting to reach
   */
  count: BN

  protected reverse: boolean

  /**
   * Create new block fetcher
   */
  constructor(options: BlockFetcherOptions) {
    super(options)

    this.chain = options.chain
    this.first = options.first
    this.count = options.count
    this.reverse = options.reverse ?? false
    this.debug(
      `Block fetcher instantiated interval=${this.interval} ${!this.reverse ? 'first' : 'last'}=${
        this.first
      } count=${this.count} reverse=${this.reverse} destroyWhenDone=${this.destroyWhenDone}`
    )
  }

  /**
   * Generate list of tasks to fetch. Modifies `first` and `count` to indicate
   * remaining items apart from the tasks it pushes in the queue
   */
  tasks(first = this.first, count = this.count, maxTasks = this.config.maxFetcherJobs): JobTask[] {
    const max = this.config.maxPerRequest
    const tasks: JobTask[] = []
    let debugStr = !this.reverse ? `first=${first}` : `last=${first}`
    const pushedCount = new BN(0)
    if (!this.reverse) {
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
    } else {
      // Sync in reverse order (e.g. for beacon sync)
      while (count.gten(max) && tasks.length < maxTasks) {
        tasks.push({ first: first.subn(max).addn(1), count: max })
        first.isubn(max)
        count.isubn(max)
        pushedCount.iaddn(max)
      }
      if (count.gtn(0) && tasks.length < maxTasks) {
        tasks.push({ first: first.sub(count).addn(1), count: count.toNumber() })
        pushedCount.iadd(count)
      }
    }
    debugStr += ` count=${pushedCount}`
    this.debug(`Created new tasks num=${tasks.length} ${debugStr}`)
    return tasks
  }

  nextTasks(): void {
    if (this.in.length === 0 && this.count.gten(0)) {
      this.debug(
        `Fetcher pending with ${!this.reverse ? 'first' : 'last'}=${this.first} count=${this.count}`
      )
      const tasks = this.tasks(this.first, this.count)
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

    // We have to loop because the jobs won't always be in increasing order.
    // Some jobs could have refetch tasks enqueued, so it is better to find
    // the first and last by examining each job.
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
    // Already removed jobs from the `in` heap, just pass to super for further cleanup
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
    // Re-enqueue the numbers which are less than `first` to refetch them,
    // else they will be fetched in the future with the jobs created by `nextTasks`.
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
