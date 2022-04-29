import { Block } from '@ethereumjs/block'
import { BN, rlp } from 'ethereumjs-util'
import { DBKey, MetaDBManager, MetaDBManagerOptions } from '../util/metaDBManager'
import { short, timeDuration } from '../util'

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
   * processNewHead does the internal shuffling for a new head marker and either
   * accepts and integrates it into the skeleton or requests a reorg. Upon reorg,
   * the syncer will tear itself down and restart with a fresh head. It is simpler
   * to reconstruct the sync state than to mutate it and hope for the best.
   *
   * @returns true if the chain was reorged
   */
  async processNewHead(head: Block, force = false): Promise<boolean> {
    // If the header cannot be inserted without interruption, return an error for
    // the outer loop to tear down the skeleton sync and restart it
    const { number } = head.header

    /*
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
      // TODO uncommenting the below doesn't allow us to resume a new run due to the gap
      // return true
    }
    const parent = await this.getBlock(number.subn(1))
    if (parent && !parent.hash().equals(head.header.parentHash)) {
      if (force) {
        this.config.logger.warn(
          `Beacon chain forked ancestor=${parent.header.number} hash=${parent.hash()} want=${
            head.header.parentHash
          }`
        )
      }
      return true
    }*/

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

    // Update the database with the new sync stats and insert the new
    // head header. We won't delete any trimmed skeleton headers since
    // those will be outside the index space of the many subchains and
    // the database space will be reclaimed eventually when processing
    // blocks above the current head.
    await this.putBlock(head)
    await this.writeSyncStatus()

    if (this.isLinked()) {
      await this.fillCanonicalChain()
    }

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
          // If subchains were merged, all further available headers in the scratch
          // space are invalid since we skipped ahead. Stop processing the scratch
          // space to avoid dropping peers thinking they delivered invalid data.
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
          const sinceStarted = new BN(new Date().getTime() - this.started).divn(1000)
          const eta = timeDuration(sinceStarted.div(this.pulled).mul(left).toNumber())
          this.config.logger.info(
            `Syncing beacon headers downloaded=${this.pulled} left=${left} eta=${eta}`
          )
        }
      }
    }

    // If our tail reaches genesis, start filling.
    if (this.isLinked()) {
      void this.fillCanonicalChain()
    }

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
   * Inserts skeleton blocks into canonical chain and runs execution when linked.
   */
  private async fillCanonicalChain() {
    if (this.filling) return
    this.filling = true
    this.config.logger.debug('Starting canonical chain fill')
    const canonicalHead = this.chain.blocks.height.clone()
    const { head, tail } = this.bounds()
    while (canonicalHead.lt(tail)) {
      // Get next block
      const block = await this.getBlock(canonicalHead.addn(1))
      // Insert into chain
      if (!block) break
      const num = await this.chain.putBlocks([block])
      // Delete skeleton block to clean up as we go
      if (num === 1) await this.deleteBlock(block)
      this.config.logger.debug(
        `Successfully put block num=${canonicalHead.addn(1)} from skeleton chain to canonical`
      )
      canonicalHead.iaddn(1)
      if (head.eq(tail)) {
        this.status.progress.subchains = []
        break
      }
      tail.isubn(1)
    }
    this.config.logger.debug(`Finished canonical chain fill end=${tail}`)
    this.filling = false
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
   * Gets a skeleton block from the db by number
   */
  async getBlock(number: BN): Promise<Block | undefined> {
    try {
      const rlp = await this.get(DBKey.SkeletonBlock, number.toArrayLike(Buffer))
      const block = Block.fromRLPSerializedBlock(rlp!, {
        common: this.config.chainCommon,
      })
      return block
    } catch (error: any) {
      if (error.type === 'NotFoundError') {
        return undefined
      }
    }
  }

  /**
   * Gets a skeleton block from the db by hash
   */
  async getBlockByHash(hash: Buffer): Promise<Block | undefined> {
    try {
      const number = await this.get(DBKey.SkeletonBlockHashToNumber, hash)
      if (!number) return undefined
      return this.getBlock(new BN(number))
    } catch (error: any) {
      if (error.type === 'NotFoundError') {
        return undefined
      }
    }
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
