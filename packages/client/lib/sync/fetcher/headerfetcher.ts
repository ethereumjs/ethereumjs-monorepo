import { BlockFetcher, BlockFetcherOptions } from './blockfetcher'
import { Peer } from '../../net/peer'
import { FlowControl } from '../../net/protocol'

export interface HeaderFetcherOptions extends BlockFetcherOptions {
  /* Flow control manager */
  flow: FlowControl
}

/**
 * Implements an les/1 based header fetcher
 * @memberof module:sync/fetcher
 */
export class HeaderFetcher extends BlockFetcher {
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
   * @param  job
   * @return {Promise}
   */
  async request(job: any): Promise<any[] | boolean> {
    const { task, peer } = job
    if (this.flow.maxRequestCount(peer, 'GetBlockHeaders') < this.maxPerRequest) {
      // we reached our request limit. try with a different peer.
      return false
    }
    return peer.les.getBlockHeaders({ block: task.first, max: task.count })
  }

  /**
   * Process fetch result
   * @param  job fetch job
   * @param  result fetch result
   * @return {*} results of processing job or undefined if job not finished
   */
  process(job: any, result: any) {
    this.flow.handleReply(job.peer, result.bv)
    if (result.headers && result.headers.length === job.task.count) {
      return result.headers
    }
  }

  /**
   * Store fetch result. Resolves once store operation is complete.
   * @param {Header[]} headers fetch result
   * @return {Promise}
   */
  async store(headers: any[]) {
    await this.chain.putHeaders(headers)
  }

  /**
   * Returns a peer that can process the given job
   * @param  job job
   * @return {Peer}
   */
  // TODO: what is job supposed to be?
  peer(_job: any): Peer {
    return this.pool.idle((p: any) => p.les && p.les.status.serveHeaders)
  }
}
