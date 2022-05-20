import { Block, BlockBuffer } from '@ethereumjs/block'
import { KECCAK256_RLP, KECCAK256_RLP_ARRAY } from 'ethereumjs-util'
import { Peer } from '../../net/peer'
import { Job } from './types'
import { BlockFetcherBase, JobTask, BlockFetcherOptions } from './blockfetcherbase'
import { Event } from '../../types'

/**
 * Implements an eth/66 based block fetcher
 * @memberof module:sync/fetcher
 */
export class BlockFetcher extends BlockFetcherBase<Block[], Block> {
  /**
   * Create new block fetcher
   */
  constructor(options: BlockFetcherOptions) {
    super(options)
  }

  /**
   * Requests blocks associated with this job
   * @param job
   */
  async request(job: Job<JobTask, Block[], Block>): Promise<Block[]> {
    const { task, peer, partialResult } = job
    let { first, count } = task
    if (partialResult) {
      first = !this.reverse ? first.addn(partialResult.length) : first.subn(partialResult.length)
      count -= partialResult.length
    }
    const blocksRange = !this.reverse
      ? `${first}-${first.addn(count - 1)}`
      : `${first}-${first.subn(count - 1)}`
    const peerInfo = `id=${peer?.id.slice(0, 8)} address=${peer?.address}`

    const headersResult = await peer!.eth!.getBlockHeaders({
      block: first,
      max: count,
      reverse: this.reverse,
    })
    if (!headersResult || headersResult[1].length === 0) {
      // Catch occasional null or empty responses
      this.debug(`Peer ${peerInfo} returned no headers for blocks=${blocksRange}`)
      return []
    }
    const headers = headersResult[1]
    const bodiesResult = await peer!.eth!.getBlockBodies({ hashes: headers.map((h) => h.hash()) })
    if (!bodiesResult || bodiesResult[1].length === 0) {
      // Catch occasional null or empty responses
      this.debug(`Peer ${peerInfo} returned no bodies for blocks=${blocksRange}`)
      return []
    }
    const bodies = bodiesResult[1]
    this.debug(
      `Requested blocks=${blocksRange} from ${peerInfo} (received: ${headers.length} headers / ${bodies.length} bodies)`
    )
    const blocks: Block[] = []
    const blockOpts = {
      common: this.config.chainCommon,
      hardforkByBlockNumber: true,
    }
    for (const [i, [txsData, unclesData]] of bodies.entries()) {
      if (
        (!headers[i].transactionsTrie.equals(KECCAK256_RLP) && txsData.length === 0) ||
        (!headers[i].uncleHash.equals(KECCAK256_RLP_ARRAY) && unclesData.length === 0)
      ) {
        this.debug(
          `Requested block=${headers[i].number}} from peer ${peerInfo} missing non-empty txs or uncles`
        )
        return []
      }
      const values: BlockBuffer = [headers[i].raw(), txsData, unclesData]
      blocks.push(Block.fromValuesArray(values, blockOpts))
    }
    return blocks
  }

  /**
   * Process fetch result
   * @param job fetch job
   * @param result fetch result
   * @returns results of processing job or undefined if job not finished
   */
  process(job: Job<JobTask, Block[], Block>, result: Block[]) {
    result = (job.partialResult ?? []).concat(result)
    job.partialResult = undefined
    if (result.length === job.task.count) {
      return result
    } else if (result.length > 0 && result.length < job.task.count) {
      // Save partial result to re-request missing items.
      job.partialResult = result
      this.debug(`Partial result received=${result.length} expected=${job.task.count}`)
    }
    return
  }

  /**
   * Store fetch result. Resolves once store operation is complete.
   * @param blocks fetch result
   */
  async store(blocks: Block[]) {
    try {
      const num = await this.chain.putBlocks(blocks)
      this.debug(
        `Fetcher results stored in blockchain (blocks num=${blocks.length} first=${
          blocks[0]?.header.number
        } last=${blocks[blocks.length - 1]?.header.number})`
      )
      this.config.events.emit(Event.SYNC_FETCHED_BLOCKS, blocks.slice(0, num))
    } catch (e: any) {
      this.debug(
        `Error storing fetcher results in blockchain (blocks num=${blocks.length} first=${
          blocks[0]?.header.number
        } last=${blocks[blocks.length - 1]?.header.number}): ${e}`
      )
      throw e
    }
  }

  /**
   * Returns an idle peer that can process a next job.
   */
  peer(): Peer | undefined {
    return this.pool.idle((peer) => 'eth' in peer)
  }
}
