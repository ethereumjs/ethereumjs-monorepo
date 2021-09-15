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
   * @param {BlockFetcherOptions}
   */
  constructor(options: BlockFetcherOptions) {
    super(options)

    this.chain = options.chain
    this.first = options.first
    this.count = options.count
  }

  /**
   * Generate list of tasks to fetch
   * @return {Object[]} tasks
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
    return tasks
  }

  /**
   * Create new tasks based on the list with
   * block/header numbers provided.
   *
   * If numbers are sequential request is created
   * as bulk request.
   *
   * @param numberList Block/header numbers
   * @param min Start block number
   */
  enqueueByNumberList(numberList: BN[], min: BN) {
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
  }
}
