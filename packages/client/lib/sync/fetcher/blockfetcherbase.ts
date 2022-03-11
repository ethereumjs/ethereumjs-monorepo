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
  protected first: BN
  protected count: BN

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
  tasks(): JobTask[] {
    const { first, count } = this
    const max = this.config.maxPerRequest
    const tasks: JobTask[] = []
    while (count.gten(max)) {
      tasks.push({ first: first.clone(), count: max })
      first.iaddn(max)
      count.isubn(max)
    }
    if (count.gtn(0)) {
      tasks.push({ first: first.clone(), count: count.toNumber() })
    }
    this.debug(`Created new tasks num=${tasks.length} first=${first} count=${count}`)
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
  enqueueByNumberList(numberList: BN[], min: BN) {
    const nextChainHeight = this.chain.headers.height.addn(1)
    if (this.in.length === 0 && nextChainHeight.lt(min)) {
      // If fetcher queue is empty and head is behind `min`,
      // enqueue tasks for missing block numbers so head can reach `min`
      const first = nextChainHeight
      const count = min.sub(nextChainHeight).toNumber()
      this.enqueueTask({ first, count })
      this.debug(
        `Enqueued missing blocks between chain head and newBlockHashes first=${first} count=${count}`
      )
    }
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
