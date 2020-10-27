import { Fetcher } from './fetcher'
import { Block, BlockBodyBuffer } from '@ethereumjs/block'
import { BN } from 'ethereumjs-util'
import { Peer } from '../../net/peer'
import { Chain } from '../../blockchain'

const defaultOptions = {
  maxPerRequest: 128,
}

/**
 * Implements an eth/62 based block fetcher
 * @memberof module:sync/fetcher
 */
export class BlockFetcher extends Fetcher {
  protected chain: Chain
  protected first: BN
  protected count: BN

  /**
   * Create new block fetcher
   * @param {Object}       options constructor parameters
   * @param {PeerPool}     options.pool peer pool
   * @param {Chain}        options.chain blockchain
   * @param {BN}           options.first block number to start fetching from
   * @param {BN}           options.count how many blocks to fetch
   * @param {number}       [options.timeout] fetch task timeout
   * @param {number}       [options.banTime] how long to ban misbehaving peers
   * @param {number}       [options.interval] retry interval
   * @param {number}       [options.maxPerRequest=128] max items per request
   * @param {Logger}       [options.logger] Logger instance
   */
  constructor(options: any) {
    super(options)
    options = { ...defaultOptions, ...options }
    this.maxPerRequest = options.maxPerRequest
    this.chain = options.chain
    this.first = BN.isBN(options.first) ? options.first : new BN(options.first)
    this.count = BN.isBN(options.count) ? options.count : new BN(options.count)
  }

  /**
   * Generate list of tasks to fetch
   * @return {Object[]} tasks
   */
  tasks(): object[] {
    const { first, count } = this
    const max = this.maxPerRequest
    const tasks = []
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
   * @param  job
   */
  async request(job: any): Promise<any> {
    const { task, peer } = job
    const { first, count } = task
    const headers = await peer.eth.getBlockHeaders({ block: first, max: count })
    const bodies = await peer.eth.getBlockBodies(headers.map((h: any) => h.hash()))
    const blocks = bodies.map(([txsData, unclesData]: BlockBodyBuffer, i: number) =>
      Block.fromValuesArray([headers[i].raw(), txsData, unclesData], { common: this.common })
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
