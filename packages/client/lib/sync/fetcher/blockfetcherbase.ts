import { Fetcher, FetcherOptions } from './fetcher'
import { Chain } from '../../blockchain'

export interface BlockFetcherOptions extends FetcherOptions {
  /* Blockchain */
  chain: Chain

  /* Block number to start fetching from */
  first: bigint

  /* How many blocks to fetch */
  count: bigint

  /* Destroy fetcher once all tasks are done */
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
  protected first: bigint
  protected count: bigint

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
   * Generate list of tasks to fetch
   */
  tasks(first = this.first, count = this.count): JobTask[] {
    const max = this.config.maxPerRequest
    const tasks: JobTask[] = []
    const debugStr = `first=${first} count=${count}`
    while (count >= BigInt(max)) {
      tasks.push({ first: first, count: max })
      first += BigInt(max)
      count -= BigInt(max)
    }
    if (count > BigInt(0)) {
      tasks.push({ first: first, count: Number(count) })
    }
    this.debug(`Created new tasks num=${tasks.length} ${debugStr}`)
    return tasks
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
  enqueueByNumberList(numberList: bigint[], min: bigint) {
    const nextChainHeight = this.chain.headers.height + BigInt(1)
    if (this.in.length === 0 && nextChainHeight < min) {
      // If fetcher queue is empty and head is behind `min`,
      // enqueue tasks for missing block numbers so head can reach `min`
      this.debug(`Enqueuing missing blocks between chain head and newBlockHashes...`)
      const tasks = this.tasks(nextChainHeight, min - nextChainHeight)
      for (const task of tasks) {
        this.enqueueTask(task)
      }
    }
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

    if (bulkRequest) {
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
      `Enqueued tasks by number list num=${numberList.length} min=${min} bulkRequest=${bulkRequest}`
    )
  }
}
