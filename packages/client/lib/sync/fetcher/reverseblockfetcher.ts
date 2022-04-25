import { BlockFetcherOptions } from './blockfetcherbase'
import { BlockFetcher } from './blockfetcher'
import { Event } from '../../types'
import type { Block } from '@ethereumjs/block'
import type { Skeleton } from '../skeleton'

interface ReverseBlockFetcherOptions extends BlockFetcherOptions {
  /** Skeleton */
  skeleton: Skeleton

  /** Reverse must be true */
  reverse: true
}

/**
 * Implements an eth/66 based reverse block fetcher
 * @memberof module:sync/fetcher
 */
export class ReverseBlockFetcher extends BlockFetcher {
  private skeleton: Skeleton

  /**
   * Create new block fetcher
   */
  constructor(options: ReverseBlockFetcherOptions) {
    super(options)
    this.skeleton = options.skeleton
  }

  /**
   * Store fetch result. Resolves once store operation is complete.
   * @param blocks fetch result
   */
  async store(blocks: Block[]) {
    try {
      const num = await this.skeleton.putBlocks(blocks.reverse())
      this.debug(
        `Fetcher results stored in skeleton chain (blocks num=${blocks.length} first=${
          blocks[0]?.header.number
        } last=${blocks[blocks.length - 1]?.header.number})`
      )
      this.config.events.emit(Event.SYNC_FETCHED_BLOCKS, blocks.slice(0, num))
    } catch (e: any) {
      this.debug(
        `Error storing fetcher results in skeleton chain (blocks num=${blocks.length} first=${
          blocks[0]?.header.number
        } last=${blocks[blocks.length - 1]?.header.number}): ${e}`
      )
      throw e
    }
  }
}
