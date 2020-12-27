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
    if (this.flow.maxRequestCount(peer!, 'GetBlockHeaders') < this.maxPerRequest) {
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
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (result.headers && result.headers.length === job.task.count) {
      return result.headers
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
   * Returns a peer that can process the given job
   * @param  job job
   * @return {Peer}
   */
  // TODO: what is job supposed to be?
  peer(_job: Job<JobTask, BlockHeaderResult, BlockHeader>): Peer {
    return this.pool.idle((p: any) => p.les && p.les.status.serveHeaders)
  }
}
