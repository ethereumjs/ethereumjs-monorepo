import { Fetcher, FetcherOptions } from './fetcher'
import { Block, BlockBodyBuffer } from '@ethereumjs/block'
import { Peer } from '../../net/peer'
import { EthProtocolMethods } from '../../net/protocol'

/**
 * Implements an eth/62 based block fetcher
 * @memberof module:sync/fetcher
 */
export class BlockFetcher extends Fetcher {
  /**
   * Create new block fetcher
   * @param {FetcherOptions}
   */
  constructor(options: FetcherOptions) {
    super(options)
  }

  /**
   * Requests blocks associated with this job
   * @param job
   */
  async request(job: any): Promise<any> {
    const { task, peer } = job
    const { first, count } = task
    const headers = await (peer.eth as EthProtocolMethods).getBlockHeaders({
      block: first,
      max: count,
    })
    const bodies = await peer.eth.getBlockBodies(headers.map((h) => h.hash()))
    const blocks = bodies.map(([txsData, unclesData]: BlockBodyBuffer, i: number) =>
      Block.fromValuesArray([headers[i].raw(), txsData, unclesData], { common: this.config.common })
    )
    return { blocks }
  }

  /**
   * Process fetch result
   * @param  job fetch job
   * @param  result fetch result
   * @return {*} results of processing job or undefined if job not finished
   */
  process(job: any, result: any) {
    if (result.blocks && result.blocks.length === job.task.count) {
      return result.blocks
    }
  }

  /**
   * Store fetch result. Resolves once store operation is complete.
   * @param {Block[]} blocks fetch result
   * @return {Promise}
   */
  async store(blocks: Array<any>) {
    await this.chain.putBlocks(blocks)
  }

  /**
   * Returns a peer that can process the given job
   * @param  job job
   * @return {Peer}
   */
  // TODO: find out what _job is supposed to be doing here...
  peer(_job: any): Peer {
    return this.pool.idle((p: any) => p.eth)
  }
}
