import { Block, BlockBodyBuffer, BlockBuffer } from '@ethereumjs/block'
import { Peer } from '../../net/peer'
import { EthProtocolMethods } from '../../net/protocol'
import { Job } from './types'
import { BlockFetcherBase, JobTask, BlockFetcherOptions } from './blockfetcherbase'

/**
 * Implements an eth/62 based block fetcher
 * @memberof module:sync/fetcher
 */
export class BlockFetcher extends BlockFetcherBase<Block[], Block> {
  /**
   * Create new block fetcher
   * @param {BlockFetcherOptions}
   */
  constructor(options: BlockFetcherOptions) {
    super(options)
  }

  /**
   * Generate list of tasks to fetch
   * @return {Object[]} tasks
   */
  tasks(): JobTask[] {
    const { first, count } = this
    const max = this.maxPerRequest
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
   * Requests blocks associated with this job
   * @param job
   */
  async request(job: Job<JobTask, Block[], Block>): Promise<Block[]> {
    const { task, peer } = job
    const { first, count } = task
    const headers = await (peer!.eth as EthProtocolMethods).getBlockHeaders({
      block: first,
      max: count,
    })
    const bodies: BlockBodyBuffer[] = <BlockBodyBuffer[]>(
      await peer!.eth!.getBlockBodies(headers.map((h) => h.hash()))
    )
    const blocks: Block[] = bodies.map(([txsData, unclesData]: BlockBodyBuffer, i: number) => {
      const opts = {
        common: this.config.chainCommon,
        hardforkByBlockNumber: true,
      }
      const values: BlockBuffer = [headers[i].raw(), txsData, unclesData]
      return Block.fromValuesArray(values, opts)
    })
    return blocks
  }

  /**
   * Process fetch result
   * @param  job fetch job
   * @param  result fetch result
   * @return {*} results of processing job or undefined if job not finished
   */
  process(job: Job<JobTask, Block[], Block>, result: Block[]) {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (result && result.length === job.task.count) {
      return result
    }
    return
  }

  /**
   * Store fetch result. Resolves once store operation is complete.
   * @param {Block[]} blocks fetch result
   * @return {Promise}
   */
  async store(blocks: Block[]) {
    await this.chain.putBlocks(blocks)
  }

  /**
   * Returns a peer that can process the given job
   * @param  job job
   * @return {Peer}
   */
  // TODO: find out what _job is supposed to be doing here...
  peer(): Peer {
    return this.pool.idle((p: any) => p.eth)
  }
}
