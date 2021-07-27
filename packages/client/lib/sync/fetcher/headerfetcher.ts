import { BlockFetcherBase, BlockFetcherOptions, JobTask } from './blockfetcherbase'
import { Peer } from '../../net/peer'
import { FlowControl, LesProtocolMethods } from '../../net/protocol'
import { BlockHeader } from '@ethereumjs/block'
import { Job } from './types'
import { BN } from 'ethereumjs-util'

export interface HeaderFetcherOptions extends BlockFetcherOptions {
  /* Flow control manager */
  flow: FlowControl
}

type BlockHeaderResult = { reqId: BN; bv: BN; headers: BlockHeader[] }

/**
 * Implements an les/1 based header fetcher
 * @memberof module:sync/fetcher
 */
export class HeaderFetcher extends BlockFetcherBase<BlockHeaderResult, BlockHeader> {
  private flow: FlowControl

  /**
   * Create new header fetcher
   * @param {HeaderFetcherOptions}
   */
  constructor(options: any) {
    super(options)

    this.flow = options.flow
  }

  /**
   * Requests block headers for the given task
   * @param job
   */
  async request(job: Job<JobTask, BlockHeaderResult, BlockHeader>) {
    const { task, peer } = job
    if (this.flow.maxRequestCount(peer!, 'GetBlockHeaders') < this.config.maxPerRequest) {
      // we reached our request limit. try with a different peer.
      return
    }
    const response = await (peer!.les as LesProtocolMethods).getBlockHeaders({
      block: task.first,
      max: task.count,
    })
    return response
  }

  /**
   * Process fetch result
   * @param  job fetch job
   * @param  result fetch result
   * @return {*} results of processing job or undefined if job not finished
   */
  process(job: Job<JobTask, BlockHeaderResult, BlockHeader>, result: BlockHeaderResult) {
    this.flow.handleReply(job.peer!, result.bv.toNumber())
    const { headers } = result
    if (headers.length === job.task.count) {
      return headers
    } else if (headers.length > 0 && headers.length < job.task.count) {
      // Adopt the start block/header number from the remaining jobs
      // if the number of the results provided is lower than the expected count
      const lengthDiff = job.task.count - headers.length
      const adoptedJobs = []
      while (this.in.length > 0) {
        const job = this.in.remove()
        if (job) {
          job.task.first = job.task.first.subn(lengthDiff)
          adoptedJobs.push(job)
        }
      }
      for (const job of adoptedJobs) {
        this.in.insert(job)
      }
      return headers
    }
    return
  }

  /**
   * Store fetch result. Resolves once store operation is complete.
   * @param {Header[]} headers fetch result
   * @return {Promise}
   */
  async store(headers: BlockHeader[]) {
    await this.chain.putHeaders(headers)
  }

  /**
   * Returns an idle peer that can process a next job.
   */
  peer(): Peer | undefined {
    return this.pool.idle((peer) => peer.les && peer.les.status.serveHeaders)
  }
}
