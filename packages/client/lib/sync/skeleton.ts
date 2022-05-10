import { Block } from '@ethereumjs/block'
import { BN, rlp } from 'ethereumjs-util'
import { DBKey, MetaDBManager, MetaDBManagerOptions } from '../util/metaDBManager'
import { short, timeDuration } from '../util'

// Thanks to go-ethereum for the skeleton design

type SkeletonStatus = {
  progress: SkeletonProgress
}

/**
 * Database entry to allow suspending and resuming a chain
 * sync. As the skeleton header chain is downloaded backwards, restarts can and
 * will produce temporarily disjoint subchains. There is no way to restart a
 * suspended skeleton sync without prior knowledge of all prior suspension points.
 */
type SkeletonProgress = {
  subchains: SkeletonSubchain[]
}

/**
 * Contiguous header chain segment that is backed by the database,
 * but may not be linked to the live chain. The skeleton downloader may produce
 * a new one of these every time it is restarted until the subchain grows large
 * enough to connect with a previous subchain.
 */
type SkeletonSubchain = {
  head: BN /** Block number of the newest header in the subchain */
  tail: BN /** Block number of the oldest header in the subchain */
  next: Buffer /** Block hash of the next oldest header in the subchain */
}
type SkeletonSubchainRLP = [head: Buffer, tail: Buffer, next: Buffer]

/**
 * errSyncReorged is an internal helper error to signal that the head chain of
 * the current sync cycle was (partially) reorged, thus the skeleton syncer
 * should abort and restart with the new state.
 */
export const errSyncReorged = new Error('sync reorged')

/**
 * errReorgDenied is returned if an attempt is made to extend the beacon chain
 * with a new header, but it does not link up to the existing sync.
 */
export const errReorgDenied = new Error('non-forced head reorg denied')

/**
 * errSyncMerged is an internal helper error to signal that the current sync
 * cycle merged with a previously aborted subchain, thus the skeleton syncer
 * should abort and restart with the new state.
 */
export const errSyncMerged = new Error('sync merged')

/**
 * The Skeleton chain class helps support beacon sync by accepting head blocks
 * while backfill syncing the rest of the chain.
 */
export class Skeleton extends MetaDBManager {
  private status: SkeletonStatus

  private started: number /** Timestamp when the skeleton syncer was created */
  private logged = 0 /** Timestamp when progress was last logged to user */
  private pulled = new BN(0) /** Number of headers downloaded in this run */
  private filling = false /** Whether we are actively filling the canonical chain */

  private STATUS_LOG_INTERVAL = 8000 /** How often to log sync status (in ms) */

  constructor(opts: MetaDBManagerOptions) {
    super(opts)
    this.status = { progress: { subchains: [] } }
    this.started = new Date().getTime()
  }

  async open() {
    await this.getSyncStatus()
    this.started = new Date().getTime()
  }

  /**
   * Announce and integrate a new head.
   * @throws if the new head causes a reorg.
   */
  async setHead(head: Block, force = false): Promise<void> {
    this.config.logger.debug(
      `New skeleton head announced number=${head.header.number} hash=${short(
        head.hash()
      )} force=${force}`
    )
    const reorged = await this.processNewHead(head, force)

    // If linked, fill the canonical chain.
    if (force && this.isLinked()) {
      void this.fillCanonicalChain()
    }

    if (reorged) {
      if (force) {
        throw errSyncReorged
      } else {
        throw errReorgDenied
      }
    }
  }

  /**
   * Attempts to get the skeleton sync into a consistent state wrt any
   * past state on disk and the newly requested head to sync to.
   */
  async initSync(head: Block): Promise<void> {
    const { number } = head.header

    if (this.status.progress.subchains.length === 0) {
      // Start a fresh sync with a single subchain represented by the currently sent
      // chain head.
      this.status.progress.subchains.push({
        head: number.clone(),
        tail: number.clone(),
        next: head.header.parentHash,
      })
      this.config.logger.debug(`Created initial skeleton subchain head=${number} tail=${number}`)
    } else {
      // Print some continuation logs
      this.config.logger.debug(
        `Restarting skeleton subchain subchains=${this.status.progress.subchains
          .map((s) => `[head=${s.head} tail=${s.tail} next=${short(s.next)}]`)
          .join(',')}`
      )

      // Create a new subchain for the head (unless the last can be extended),
      // trimming anything it would overwrite
      const headchain = {
        head: number.clone(),
        tail: number.clone(),
        next: head.header.parentHash,
      }

      for (const _subchain of this.status.progress.subchains) {
        // If the last chain is above the new head, delete altogether
        const lastchain = this.status.progress.subchains[0]
        if (lastchain.tail.gte(headchain.tail)) {
          this.config.logger.debug(
            `Dropping skeleton subchain head=${lastchain.head} tail=${lastchain.tail}`
          )
          this.status.progress.subchains = this.status.progress.subchains.slice(1)
          continue
        }
        // Otherwise truncate the last chain if needed and abort trimming
        if (lastchain.head.gte(headchain.tail)) {
          this.config.logger.debug(
            `Trimming skeleton subchain oldHead=${lastchain.head} newHead=${headchain.tail.subn(
              1
            )} tail=${lastchain.tail}`
          )
          lastchain.head = headchain.tail.subn(1)
        }
        break
      }
      // If the last subchain can be extended, we're lucky. Otherwise create
      // a new subchain sync task.
      let extended = false
      if (this.status.progress.subchains.length > 0) {
        const lastchain = this.status.progress.subchains[0]
        if (lastchain.head.eq(headchain.tail.subn(1))) {
          const lasthead = await this.getBlock(lastchain.head)
          if (lasthead?.hash().equals(head.header.parentHash)) {
            this.config.logger.debug(
              `Extended skeleton subchain with new head=${headchain.tail} tail=${lastchain.tail}`
            )
            lastchain.head = headchain.tail
            extended = true
          }
        }
      }
      if (!extended) {
        this.config.logger.debug(`Created new skeleton subchain head=${number} tail=${number}`)
        this.status.progress.subchains.unshift(headchain)
      }
    }

    await this.putBlock(head)
    await this.writeSyncStatus()
  }

  /**
   * processNewHead does the internal shuffling for a new head marker and either
   * accepts and integrates it into the skeleton or requests a reorg. Upon reorg,
   * the syncer will tear itself down and restart with a fresh head. It is simpler
   * to reconstruct the sync state than to mutate it.
   *
   * @returns true if the chain was reorged
   */
  async processNewHead(head: Block, force = false): Promise<boolean> {
    // If the header cannot be inserted without interruption, return an error for
    // the outer loop to tear down the skeleton sync and restart it
    const { number } = head.header

    const [lastchain] = this.status.progress.subchains
    if (lastchain?.tail.gte(number)) {
      // If the chain is down to a single beacon header, and it is re-announced
      // once more, ignore it instead of tearing down sync for a noop.
      if (lastchain.head.eq(lastchain.tail)) {
        const block = await this.getBlock(number)
        if (block?.hash().equals(head.hash())) {
          return false
        }
      }
      // Not a noop / double head announce, abort with a reorg
      if (force) {
        this.config.logger.warn(
          `Beacon chain reorged tail=${lastchain.tail} head=${lastchain.head} newHead=${number}`
        )
      }
      return true
    }
    if (lastchain?.head.addn(1).lt(number)) {
      if (force) {
        this.config.logger.warn(`Beacon chain gapped head=${lastchain.head} newHead=${number}`)
      }
      return true
    }
    const parent = await this.getBlock(number.subn(1))
    if (parent && !parent.hash().equals(head.header.parentHash)) {
      if (force) {
        this.config.logger.warn(
          `Beacon chain forked ancestor=${parent.header.number} hash=${short(
            parent.hash()
          )} want=${short(head.header.parentHash)}`
        )
      }
      return true
    }

    // Update the database with the new sync stats and insert the new
    // head header. We won't delete any trimmed skeleton headers since
    // those will be outside the index space of the many subchains and
    // the database space will be reclaimed eventually when processing
    // blocks above the current head.
    await this.putBlock(head)
    lastchain.head = number
    await this.writeSyncStatus()

    return false
  }

  /**
   * Bounds returns the current head and tail tracked by the skeleton syncer.
   */
  bounds(): SkeletonSubchain {
    return this.status.progress.subchains[0]
  }

  /**
   * Writes skeleton blocks to the db by number
   * @returns number of blocks saved
   */
  async putBlocks(blocks: Block[]): Promise<number> {
    let merged = false
    for (const block of blocks) {
      await this.putBlock(block)
      this.pulled.iaddn(1)
      const { number } = block.header
      // Extend subchain or create new segment if necessary
      if (this.status.progress.subchains[0].next.equals(block.hash())) {
        this.status.progress.subchains[0].tail.isubn(1)
        this.status.progress.subchains[0].next = block.header.parentHash
      } else {
        // See if the block can fit in an existing subchain. If not, create a new one.
        const foundSubchain = this.status.progress.subchains.find((subchain) =>
          subchain.next.equals(block.hash())
        )
        if (foundSubchain) {
          // Extend
          foundSubchain.tail.isubn(1)
          foundSubchain.next = block.header.parentHash
        } else {
          // New subchain
          if (
            number.lt(
              this.status.progress.subchains[this.status.progress.subchains.length - 1].tail
            )
          ) {
            const subchain = {
              head: number.clone(),
              tail: number.clone(),
              next: block.header.parentHash,
            }
            this.status.progress.subchains.push(subchain)
          }
        }
      }

      // If the subchain extended into the next subchain, we need to handle
      // the overlap. Since there could be many overlaps, do this in a loop.
      while (
        this.status.progress.subchains.length > 1 &&
        this.status.progress.subchains[1].head.gte(this.status.progress.subchains[0].tail)
      ) {
        // Extract some stats from the second subchain
        const { head, tail, next } = this.status.progress.subchains[1]

        // Since we just overwrote part of the next subchain, we need to trim
        // its head independent of matching or mismatching content
        if (tail.gte(this.status.progress.subchains[0].tail)) {
          // Fully overwritten, get rid of the subchain as a whole
          this.config.logger.debug(
            `Previous subchain fully overwritten head=${head} tail=${tail} next=${short(next)}`
          )
          this.status.progress.subchains = this.status.progress.subchains.slice(1)
          continue
        } else {
          // Partially overwritten, trim the head to the overwritten size
          this.config.logger.debug(
            `Previous subchain partially overwritten head=${head} tail=${tail} next=${short(next)}`
          )
          this.status.progress.subchains[1].head = this.status.progress.subchains[0].tail.subn(1)
        }
        // If the old subchain is an extension of the new one, merge the two
        // and let the skeleton syncer restart (to clean internal state)
        if (
          (await this.getBlock(this.status.progress.subchains[1].head))
            ?.hash()
            .equals(this.status.progress.subchains[0].next)
        ) {
          this.config.logger.debug(
            `Previous subchain merged head=${head} tail=${tail} next=${short(next)}`
          )
          this.status.progress.subchains[0].tail = tail
          this.status.progress.subchains[0].next = next
          this.status.progress.subchains = [
            this.status.progress.subchains[0],
            ...this.status.progress.subchains.slice(2),
          ]
          // If subchains were merged, all further available headers
          // are invalid since we skipped ahead.
          merged = true
          break
        }
      }
    }

    await this.writeSyncStatus()

    // Print a progress report making the UX a bit nicer
    if (new Date().getTime() - this.logged > this.STATUS_LOG_INTERVAL) {
      let left = this.bounds().tail.subn(1)
      if (this.isLinked()) left = new BN(0)
      if (left.gtn(0)) {
        this.logged = new Date().getTime()
        if (this.pulled.isZero()) {
          this.config.logger.info(`Beacon sync starting left=${left}`)
        } else {
          const sinceStarted = (new Date().getTime() - this.started) / 1000
          const eta = timeDuration((sinceStarted / this.pulled.toNumber()) * left.toNumber())
          this.config.logger.info(
            `Syncing beacon headers downloaded=${this.pulled} left=${left} eta=${eta}`
          )
        }
      }
    }

    // If the sync is finished, start filling the canonical chain.
    if (this.isLinked()) {
      void this.fillCanonicalChain()
    }

    if (merged) throw errSyncMerged

    return blocks.length
  }

  /**
   * Returns true if the skeleton chain is linked to canonical
   */
  isLinked() {
    if (this.status.progress.subchains.length !== 1) return false
    const { tail } = this.bounds()
    if (tail.lte(this.chain.blocks.height.addn(1))) {
      return true
    }
    return false
  }

  /**
   * Inserts skeleton blocks into canonical chain and runs execution.
   */
  private async fillCanonicalChain() {
    if (this.filling) return
    this.filling = true
    const canonicalHead = this.chain.blocks.height.clone()
    const start = canonicalHead.clone()
    const { head } = this.bounds()
    this.config.logger.debug(
      `Starting canonical chain fill canonicalHead=${this.chain.blocks.height} subchainHead=${head}`
    )
    while (this.filling && canonicalHead.lt(head)) {
      // Get next block
      const number = canonicalHead.addn(1)
      const block = await this.getBlock(number)
      if (!block) break
      // Insert into chain
      const num = await this.chain.putBlocks([block], true)
      if (num !== 1) {
        this.config.logger.error(
          `Failed to put block num=${number} from skeleton chain to canonical`
        )
        break
      }
      // Delete skeleton block to clean up as we go
      await this.deleteBlock(block)
      canonicalHead.iaddn(1)
    }
    this.filling = false
    this.config.logger.debug(
      `Successfully put blocks start=${start} end=${canonicalHead} from skeleton chain to canonical`
    )
  }

  /**
   * Writes a skeleton block to the db by number
   */
  private async putBlock(block: Block): Promise<boolean> {
    await this.put(DBKey.SkeletonBlock, block.header.number.toArrayLike(Buffer), block.serialize())
    await this.put(
      DBKey.SkeletonBlockHashToNumber,
      block.hash(),
      block.header.number.toArrayLike(Buffer)
    )
    return true
  }

  /**
   * Gets a block from the skeleton or canonical db by number.
   */
  async getBlock(number: BN, onlySkeleton = false): Promise<Block | undefined> {
    try {
      const rlp = await this.get(DBKey.SkeletonBlock, number.toArrayLike(Buffer))
      const block = Block.fromRLPSerializedBlock(rlp!, {
        common: this.config.chainCommon,
      })
      return block
    } catch (error: any) {
      if (onlySkeleton) return undefined
      // As a fallback, try to get the block from the canonical chain in case it is available there
      try {
        return await this.chain.getBlock(number)
      } catch (error) {
        return undefined
      }
    }
  }

  /**
   * Gets a skeleton block from the db by hash
   */
  async getBlockByHash(hash: Buffer): Promise<Block | undefined> {
    const number = await this.get(DBKey.SkeletonBlockHashToNumber, hash)
    if (!number) return undefined
    return this.getBlock(new BN(number))
  }

  /**
   * Deletes a skeleton block from the db by number
   */
  async deleteBlock(block: Block): Promise<boolean> {
    try {
      await this.delete(DBKey.SkeletonBlock, block.header.number.toArrayLike(Buffer))
      await this.delete(DBKey.SkeletonBlockHashToNumber, block.hash())
      return true
    } catch (error: any) {
      return false
    }
  }

  /**
   * Writes the {@link SkeletonStatus} to db
   */
  private async writeSyncStatus(): Promise<boolean> {
    this.config.logger.debug(
      `Writing sync status subchains=${this.status.progress.subchains
        .map((s) => `[head=${s.head} tail=${s.tail} next=${short(s.next)}]`)
        .join(',')}`
    )
    const encodedStatus = this.statusToRLP()
    await this.put(DBKey.SkeletonStatus, Buffer.alloc(0), encodedStatus)
    return true
  }

  /**
   * Reads the {@link SkeletonStatus} from db
   */
  private async getSyncStatus(): Promise<SkeletonStatus | undefined> {
    const rawStatus = await this.get(DBKey.SkeletonStatus, Buffer.alloc(0))
    if (!rawStatus) return
    const status = this.statusRLPtoObject(rawStatus)
    this.status = status
    return status
  }

  /**
   * Encodes a {@link SkeletonStatus} to RLP for saving to the db
   */
  private statusToRLP(): Buffer {
    const subchains: SkeletonSubchainRLP[] = this.status.progress.subchains.map((subchain) => [
      subchain.head.toArrayLike(Buffer),
      subchain.tail.toArrayLike(Buffer),
      subchain.next,
    ])
    return rlp.encode(subchains)
  }

  /**
   * Decodes an RLP encoded {@link SkeletonStatus}
   */
  private statusRLPtoObject(rawStatus: Buffer): SkeletonStatus {
    const status: SkeletonStatus = { progress: { subchains: [] } }
    const rawSubchains = rlp.decode(rawStatus) as unknown as SkeletonSubchainRLP[]
    const subchains: SkeletonSubchain[] = rawSubchains.map((raw) => ({
      head: new BN(raw[0]),
      tail: new BN(raw[1]),
      next: raw[2],
    }))
    status.progress.subchains = subchains
    return status
  }
}
