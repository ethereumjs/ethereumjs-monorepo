import { Fetcher, FetcherOptions } from './fetcher'
import { Chain } from '../../blockchain'

export interface BlockFetcherOptions extends FetcherOptions {
  /** Blockchain */
  chain: Chain

  /* Block number to start fetching from */
  first: bigint

  /* How many blocks to fetch */
  count: bigint

  /** Whether to fetch the blocks in reverse order (e.g. for beacon sync). Default: false */
  reverse?: boolean

  /** Destroy fetcher once all tasks are done */
  destroyWhenDone?: boolean
}

export type JobTask = {
  first: bigint
  count: number
}

export abstract class BlockFetcherBase<JobResult, StorageItem> extends Fetcher<
  JobTask,
  JobResult,
  StorageItem
> {
  protected chain: Chain
  /**
   * Where the fetcher starts apart from the tasks already in the `in` queue.
   */
  first: bigint
  /**
   * Number of items for the fetcher to fetch starting from (and including) `first`.
   */
  count: bigint

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
      `Block fetcher instantiated interval=${this.interval} first=${this.first} count=${this.count} reverse=${this.reverse} destroyWhenDone=${this.destroyWhenDone}`
    )
  }

  /**
   * Generate list of tasks to fetch. Modifies `first` and `count` to indicate
   * remaining items apart from the tasks it pushes in the queue
   */
  tasks(first = this.first, count = this.count, maxTasks = this.config.maxFetcherJobs): JobTask[] {
    const max = this.config.maxPerRequest
    const tasks: JobTask[] = []
    let debugStr = `first=${first}`
    let pushedCount = BigInt(0)
    const startedWith = first

    while (count >= BigInt(max) && tasks.length < maxTasks) {
      tasks.push({ first: first, count: max })
      !this.reverse ? (first += BigInt(max)) : (first -= BigInt(max))
      count -= BigInt(max)
      pushedCount += BigInt(max)
    }
    if (count > BigInt(0) && tasks.length < maxTasks) {
      tasks.push({ first: first, count: Number(count) })
      !this.reverse ? (first += BigInt(count)) : (first -= BigInt(count))
      pushedCount += count
      count = BigInt(0)
    }

    // If we started with where this.first was, i.e. there are no gaps and hence
    // we can move this.first to where its now, and reduce count by pushedCount
    if (startedWith === this.first) {
      this.first = first
      this.count = this.count - pushedCount
    }

    debugStr += ` count=${pushedCount} reverse=${this.reverse}`
    this.debug(`Created new tasks num=${tasks.length} ${debugStr}`)
    return tasks
  }

  nextTasks(): void {
    if (this.in.length === 0 && this.count > BigInt(0)) {
      this.debug(
        `Fetcher pending with first=${this.first} count=${this.count} reverse=${this.reverse}`
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
    let last = this.first + this.count - BigInt(1)

    // We have to loop because the jobs won't always be in increasing order.
    // Some jobs could have refetch tasks enqueued, so it is better to find
    // the first and last by examining each job.
    while (this.in.length > 0) {
      const job = this.in.remove()
      if (!job) break
      if (job.task.first < first) {
        first = job.task.first
      }
      const jobLast = job.task.first + BigInt(job.task.count) - BigInt(1)
      if (jobLast > last) {
        last = jobLast
      }
    }
    this.first = first
    this.count = last - this.first + BigInt(1)
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
  enqueueByNumberList(numberList: bigint[], min: bigint, max: bigint) {
    // Check and update the height
    const last = this.first + this.count - BigInt(1)
    let updateHeightStr = ''
    if (max > last) {
      this.count += max - last
      updateHeightStr = `updated height=${max}`
    }
    // Re-enqueue the numbers which are less than `first` to refetch them,
    // else they will be fetched in the future with the jobs created by `nextTasks`.
    numberList = numberList.filter((num) => num <= this.first)
    const numBlocks = numberList.length
    let bulkRequest = true
    let seqCheckNum = min
    for (let num = 1; num <= numBlocks; num++) {
      if (!numberList.includes(seqCheckNum)) {
        bulkRequest = false
        break
      }
      seqCheckNum++
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
