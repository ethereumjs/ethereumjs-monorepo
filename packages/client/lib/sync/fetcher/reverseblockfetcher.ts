import { Event } from '../../types'
import { Skeleton, errSyncMerged } from '../skeleton'
import { BlockFetcherOptions } from './blockfetcherbase'
import { BlockFetcher } from './blockfetcher'
import type { Block } from '@ethereumjs/block'

interface ReverseBlockFetcherOptions extends BlockFetcherOptions {
  /** Skeleton */
  skeleton: Skeleton
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
    super({ ...options, reverse: true })
    this.skeleton = options.skeleton
  }

  /**
   * Store fetch result. Resolves once store operation is complete.
   * @param blocks fetch result
   */
  async store(blocks: Block[]) {
    try {
      const num = await this.skeleton.putBlocks(blocks)
      this.debug(
        `Fetcher results stored in skeleton chain (blocks num=${blocks.length} first=${
          blocks[0]?.header.number
        } last=${blocks[blocks.length - 1]?.header.number})`
      )
      this.config.events.emit(Event.SYNC_FETCHED_BLOCKS, blocks.slice(0, num))
    } catch (e: any) {
      if (e == errSyncMerged) {
        // Tear down the syncer to restart from new subchain segments
        this.debug('Skeleton subchains merged, restarting sync')
        this.running = false
        this.clear()
        this.destroy()
      } else {
        this.debug(
          `Error storing fetcher results in skeleton chain (blocks num=${blocks.length} first=${
            blocks[0]?.header.number
          } last=${blocks[blocks.length - 1]?.header.number}): ${e}`
        )
        throw e
      }
    }
  }
}
