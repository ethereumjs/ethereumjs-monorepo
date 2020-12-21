<<<<<<< HEAD
import { Block, BlockBodyBuffer } from '@ethereumjs/block'
import { Peer } from '../../net/peer'
import { EthProtocolMethods } from '../../net/protocol'
import { Job } from './types'
import { BlockFetcherBase, JobTask, BlockFetcherOptions } from './blockfetcherbase'
=======
const level = require('level')
import { Fetcher, FetcherOptions } from './fetcher'
import { Block, BlockBodyBuffer } from '@ethereumjs/block'
import { Peer } from '../../net/peer'
import { EthProtocolMethods } from '../../net/protocol'
import VM from '@ethereumjs/vm'
import { DefaultStateManager } from '@ethereumjs/vm/dist/state'
import { SecureTrie as Trie } from '@ethereumjs/trie'
>>>>>>> client -> vm execution: use vm.runBlockchain(), fix execution run, added state persistence by introducing StateManager

/**
 * Implements an eth/62 based block fetcher
 * @memberof module:sync/fetcher
 */
export class BlockFetcher extends BlockFetcherBase<Block[], Block> {
  /**
   * Create new block fetcher
   * @param {FetcherOptions}
   */
  constructor(options: FetcherOptions) {
    super(options)

    if (!this.config.vm) {
      const db = level('./statedir')
      const trie = new Trie(db)

      const stateManager = new DefaultStateManager({
        common: this.config.common,
        trie,
      })

      this.vm = new VM({
        common: this.config.common,
        blockchain: this.chain.blockchain,
        stateManager,
      })
    } else {
      this.vm = this.config.vm
      //@ts-ignore blockchain has readonly property
      this.vm.blockchain = this.chain.blockchain
    }
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
    const blocks: Block[] = bodies.map(([txsData, unclesData]: BlockBodyBuffer, i: number) =>
      Block.fromValuesArray([headers[i].raw(), txsData, unclesData], { common: this.config.common })
    )
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
<<<<<<< HEAD
  async store(blocks: Block[]) {
    await this.chain.putBlocks(blocks)
=======
  async store(blocks: Array<any>) {
    if (blocks.length === 0) {
      return
    }
    await this.chain.open()
    blocks = blocks.map((b: Block) =>
      Block.fromValuesArray(b.raw(), { common: this.config.common })
    )
    await this.chain.blockchain.initPromise
    for (let i = 0; i < blocks.length; i++) {
      const block: Block = blocks[i]

      await this.chain.blockchain.putBlock(block)
      await this.vm.runBlockchain()
    }
    await this.chain.update()
>>>>>>> client -> vm execution: use vm.runBlockchain(), fix execution run, added state persistence by introducing StateManager
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
