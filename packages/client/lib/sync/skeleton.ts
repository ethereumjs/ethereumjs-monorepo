import { Block } from '@ethereumjs/block'
import { Hardfork } from '@ethereumjs/common'
import { RLP } from '@ethereumjs/rlp'
import { arrToBufArr, bigIntToBuffer, bufferToBigInt, zeros } from '@ethereumjs/util'

import { short, timeDuration } from '../util'
import { DBKey, MetaDBManager } from '../util/metaDBManager'

import type { MetaDBManagerOptions } from '../util/metaDBManager'
import type { BigIntLike } from '@ethereumjs/util'

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
  head: bigint /** Block number of the newest header in the subchain */
  tail: bigint /** Block number of the oldest header in the subchain */
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

const zeroBlockHash = zeros(32)
/**
 * The Skeleton chain class helps support beacon sync by accepting head blocks
 * while backfill syncing the rest of the chain.
 */
export class Skeleton extends MetaDBManager {
  private status: SkeletonStatus

  private started: number /** Timestamp when the skeleton syncer was created */
  private logged = 0 /** Timestamp when progress was last logged to user */
  private pulled = BigInt(0) /** Number of headers downloaded in this run */
  private filling = false /** Whether we are actively filling the canonical chain */

  private STATUS_LOG_INTERVAL = 8000 /** How often to log sync status (in ms) */
  private chainTTD: BigIntLike

  constructor(opts: MetaDBManagerOptions) {
    super(opts)
    this.status = { progress: { subchains: [] } }
    this.started = new Date().getTime()
    const chainTTD = this.config.chainCommon.hardforkTTD(Hardfork.Merge)
    if (chainTTD === undefined || chainTTD === null) {
      throw Error('Cannot create skeleton as merge not set')
    }
    this.chainTTD = chainTTD
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

    // Put this block irrespective of the force
    await this.putBlock(head)
    if (force) {
      await this.writeSyncStatus()
    }

    // If linked, fill the canonical chain.
    if (force && (await this.isLinked())) {
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
        head: number,
        tail: number,
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
        head: number,
        tail: number,
        next: head.header.parentHash,
      }

      for (const _subchain of this.status.progress.subchains) {
        // If the last chain is above the new head, delete altogether
        const lastchain = this.status.progress.subchains[0]
        if (lastchain.tail >= headchain.tail) {
          this.config.logger.debug(
            `Dropping skeleton subchain head=${lastchain.head} tail=${lastchain.tail}`
          )
          this.status.progress.subchains = this.status.progress.subchains.slice(1)
          continue
        }
        // Otherwise truncate the last chain if needed and abort trimming
        if (lastchain.head >= headchain.tail) {
          this.config.logger.debug(
            `Trimming skeleton subchain oldHead=${lastchain.head} newHead=${
              headchain.tail - BigInt(1)
            } tail=${lastchain.tail}`
          )
          lastchain.head = headchain.tail - BigInt(1)
        }
        break
      }
      // If the last subchain can be extended, we're lucky. Otherwise create
      // a new subchain sync task.
      let extended = false
      if (this.status.progress.subchains.length > 0) {
        const lastchain = this.status.progress.subchains[0]
        if (lastchain.head === headchain.tail - BigInt(1)) {
          const lasthead = await this.getBlock(lastchain.head)
          if (lasthead?.hash().equals(head.header.parentHash) === true) {
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

    // If the sync is finished, start filling the canonical chain.
    if (await this.isLinked()) {
      void this.fillCanonicalChain()
    }
  }

  /**
   * Try fast forwarding the chain head to the number
   */
  async fastForwardHead(lastchain: SkeletonSubchain, target: bigint) {
    const head = lastchain.head
    let headBlock = await this.getBlock(head, true)
    if (headBlock === undefined) {
      return
    }

    for (let newHead = head + BigInt(1); newHead <= target; newHead += BigInt(1)) {
      const newBlock = await this.getBlock(newHead, true)
      if (newBlock === undefined || !newBlock.header.parentHash.equals(headBlock.hash())) {
        // Head can't be updated forward
        break
      }
      headBlock = newBlock
    }
    lastchain.head = headBlock.header.number
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
    if (lastchain === undefined) {
      this.config.logger.warn(`Skeleton reorged and cleaned, no current subchain newHead=${number}`)
      return true
    }
    if (lastchain.tail > number) {
      // Not a noop / double head announce, abort with a reorg
      if (force) {
        this.config.logger.warn(
          `Beacon chain reorged tail=${lastchain.tail} head=${lastchain.head} newHead=${number}`
        )
      }
      return true
    } else if (lastchain.head >= number) {
      if (force) {
        // Check if its duplicate announcement, if not trim the head and let the match run
        // post this if block
        const mayBeDupBlock = await this.getBlock(number, true)
        if (mayBeDupBlock !== undefined && mayBeDupBlock.header.hash().equals(head.hash())) {
          this.config.logger.debug(
            `Skeleton duplicate annoucement tail=${lastchain.tail} head=${
              lastchain.head
            } number=${number} hash=${short(head.hash())}`
          )
          return false
        } else {
          // Since its not a dup block, so there is reorg in the chain or atleast in the head
          // which we will let it get addressed post this if else block
          this.config.logger.debug(
            `Skeleton differing annoucement tail=${lastchain.tail} head=${
              lastchain.head
            } number=${number} expected=${short(
              mayBeDupBlock?.hash() ?? zeroBlockHash
            )} actual=${short(head.hash())}`
          )
        }
      } else {
        this.config.logger.debug(
          `Skeleton stale annoucement tail=${lastchain.tail} head=${lastchain.head} number=${number}`
        )
        return true
      }
    } else if (lastchain.head + BigInt(1) < number) {
      if (force) {
        await this.fastForwardHead(lastchain, number - BigInt(1))
        // If its still less than number then its gapped head
        if (lastchain.head + BigInt(1) < number) {
          return true
        }
      } else {
        this.config.logger.debug(
          `Beacon chain gapped annoucement head=${lastchain.head} newHead=${number}`
        )
        return true
      }
    }
    const parent = await this.getBlock(number - BigInt(1))
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
    if (force) {
      lastchain.head = number
    }
    return false
  }

  /**
   * Bounds returns the current head and tail tracked by the skeleton syncer.
   */
  bounds(): SkeletonSubchain {
    return this.status.progress.subchains[0]
  }

  async trySubChainsMerge(): Promise<boolean> {
    let merged = false
    let edited = false

    // If the subchain extended into the next subchain, we need to handle
    // the overlap. Since there could be many overlaps, do this in a loop.
    while (
      this.status.progress.subchains.length > 1 &&
      this.status.progress.subchains[1].head >= this.status.progress.subchains[0].tail
    ) {
      // Extract some stats from the second subchain
      const { head, tail, next } = this.status.progress.subchains[1]

      // Since we just overwrote part of the next subchain, we need to trim
      // its head independent of matching or mismatching content
      if (tail >= this.status.progress.subchains[0].tail) {
        // Fully overwritten, get rid of the subchain as a whole
        this.config.logger.debug(
          `Previous subchain fully overwritten head=${head} tail=${tail} next=${short(next)}`
        )
        this.status.progress.subchains.splice(1, 1)
        edited = true
        continue
      } else {
        // Partially overwritten, trim the head to the overwritten size
        this.config.logger.debug(
          `Previous subchain partially overwritten head=${head} tail=${tail} next=${short(next)}`
        )
        this.status.progress.subchains[1].head = this.status.progress.subchains[0].tail - BigInt(1)
        edited = true
      }
      // If the old subchain is an extension of the new one, merge the two
      // and let the skeleton syncer restart (to clean internal state)
      if (
        (await this.getBlock(this.status.progress.subchains[1].head))
          ?.hash()
          .equals(this.status.progress.subchains[0].next) === true
      ) {
        // only merge is we can integrate a big progress, as each merge leads
        // to disruption of the block fetcher to start a fresh
        if (head - tail > this.config.skeletonSubchainMergeMinimum) {
          this.config.logger.debug(
            `Previous subchain merged head=${head} tail=${tail} next=${short(next)}`
          )
          this.status.progress.subchains[0].tail = tail
          this.status.progress.subchains[0].next = next
          this.status.progress.subchains.splice(1, 1)
          // If subchains were merged, all further available headers
          // are invalid since we skipped ahead.
          merged = true
        } else {
          this.config.logger.debug(
            `Subchain ignored for merge head=${head} tail=${tail} count=${head - tail}`
          )
          this.status.progress.subchains.splice(1, 1)
        }
        edited = true
      }
    }
    if (edited) await this.writeSyncStatus()
    return merged
  }

  /**
   * Writes skeleton blocks to the db by number
   * @returns number of blocks saved
   */
  async putBlocks(blocks: Block[]): Promise<number> {
    let merged = false
    this.config.logger.debug(
      `Skeleton putBlocks start=${blocks[0]?.header.number} hash=${short(
        blocks[0]?.hash()
      )} fork=${blocks[0]._common.hardfork()} end=${
        blocks[blocks.length - 1]?.header.number
      } count=${blocks.length}, subchain head=${this.status.progress.subchains[0]?.head} tail = ${
        this.status.progress.subchains[0].tail
      } next=${short(this.status.progress.subchains[0]?.next)}`
    )
    for (const block of blocks) {
      const { number } = block.header
      if (number >= this.status.progress.subchains[0].tail) {
        // These blocks should already be in skeleton, and might be coming in
        // from previous events especially if the previous subchains merge
        continue
      }

      // Extend subchain or create new segment if necessary
      if (this.status.progress.subchains[0].next.equals(block.hash())) {
        await this.putBlock(block)
        this.pulled += BigInt(1)
        this.status.progress.subchains[0].tail -= BigInt(1)
        this.status.progress.subchains[0].next = block.header.parentHash
      } else {
        // Critical error, we expect new incoming blocks to extend the canonical
        // subchain which is the [0]'th
        this.config.logger.warn(
          `Blocks don't extend canonical subchain head=${
            this.status.progress.subchains[0].head
          } tail=${this.status.progress.subchains[0].tail} next=${short(
            this.status.progress.subchains[0].next
          )}, block number=${number} hash=${short(block.hash())} fork=${block._common.hardfork()}`
        )
        throw Error(`Blocks don't extend canonical subchain`)
      }
      merged = await this.trySubChainsMerge()
      // If its merged, we need to break as the new tail could be quite ahead
      // so we need to clear out and run the reverse block fetcher again
      if (merged) break
    }

    await this.writeSyncStatus()

    // Print a progress report making the UX a bit nicer
    if (new Date().getTime() - this.logged > this.STATUS_LOG_INTERVAL) {
      let left = this.bounds().tail - BigInt(1) - this.chain.blocks.height
      if (await this.isLinked()) left = BigInt(0)
      if (left > BigInt(0)) {
        this.logged = new Date().getTime()
        if (this.pulled === BigInt(0)) {
          this.config.logger.info(`Beacon sync starting left=${left}`)
        } else {
          const sinceStarted = (new Date().getTime() - this.started) / 1000
          const eta = timeDuration((sinceStarted / Number(this.pulled)) * Number(left))
          this.config.logger.info(
            `Syncing beacon headers downloaded=${this.pulled} left=${left} eta=${eta}`
          )
        }
      }
    }

    // If the sync is finished, start filling the canonical chain.
    if (await this.isLinked()) {
      void this.fillCanonicalChain()
    }

    if (merged) throw errSyncMerged
    return blocks.length
  }

  /**
   * Returns true if the skeleton chain is linked to canonical
   */
  async isLinked() {
    if (this.status.progress.subchains.length === 0) return false
    const { tail, next } = this.bounds()
    // make check for genesis if tail is 1?
    if (tail <= this.chain.blocks.height + BigInt(1)) {
      const nextBlock = await this.chain.getBlock(tail - BigInt(1))
      return next.equals(nextBlock.hash())
    }
    return false
  }

  async backStep(): Promise<bigint | null> {
    if (this.config.skeletonFillCanonicalBackStep <= 0) return null
    const { head, tail } = this.bounds()

    let tailBlock
    let newTail: bigint | null = tail
    do {
      newTail = newTail + BigInt(this.config.skeletonFillCanonicalBackStep)
      tailBlock = await this.getBlock(newTail, true)
    } while (!tailBlock && newTail <= head)
    if (newTail > head) {
      newTail = head
      tailBlock = await this.getBlock(newTail, true)
    }

    if (tailBlock && newTail) {
      this.config.logger.info(`Backstepped skeleton head=${head} tail=${newTail}`)
      this.status.progress.subchains[0].tail = newTail
      this.status.progress.subchains[0].next = tailBlock.header.parentHash
      await this.writeSyncStatus()
      return newTail
    } else {
      // we need a new head, emptying the subchains
      this.status.progress.subchains = []
      await this.writeSyncStatus()
      this.config.logger.warn(
        `Couldn't backStep subchain 0, dropping subchains for new head signal`
      )
      return null
    }
  }

  /**
   * Inserts skeleton blocks into canonical chain and runs execution.
   */
  async fillCanonicalChain() {
    if (this.filling) return
    this.filling = true
    let canonicalHead = this.chain.blocks.height
    const start = canonicalHead
    const { head } = this.bounds()
    this.config.logger.debug(
      `Starting canonical chain fill canonicalHead=${this.chain.blocks.height} subchainHead=${head}`
    )
    let fillLogIndex = 0
    while (this.filling && canonicalHead < head) {
      // Get next block
      const number = canonicalHead + BigInt(1)
      const block = await this.getBlock(number)
      if (!block) {
        // This shouldn't happen, but if it does because of some issues, we should back step
        // and fetch again
        this.config.logger.debug(
          `fillCanonicalChain block number=${number} not found, backStepping`
        )
        await this.backStep()
        break
      }
      // Insert into chain
      let numBlocksInserted = 0
      try {
        numBlocksInserted = await this.chain.putBlocks([block], true)
      } catch (e) {
        this.config.logger.error(`fillCanonicalChain putBlock error=${(e as Error).message}`)
      }

      if (numBlocksInserted !== 1) {
        this.config.logger.error(
          `Failed to put block number=${number} fork=${block._common.hardfork()} hash=${short(
            block.hash()
          )} from skeleton chain to canonical`
        )
        await this.backStep()
        break
      }
      // Delete skeleton block to clean up as we go
      await this.deleteBlock(block)
      canonicalHead += BigInt(numBlocksInserted)
      fillLogIndex += numBlocksInserted
      if (fillLogIndex > 50) {
        this.config.logger.info(
          `Skeleton canonical chain fill status: canonicalHead=${canonicalHead} chainHead=${this.chain.blocks.height} subchainHead=${head}`
        )
        fillLogIndex = 0
      }
    }
    this.filling = false
    this.config.logger.info(
      `Successfully put blocks start=${start} end=${canonicalHead} skeletonHead=${head} from skeleton chain to canonical syncTargetHeight=${this.config.syncTargetHeight}`
    )
  }

  serialize({ hardfork, blockRLP }: { hardfork: Hardfork | string; blockRLP: Buffer }): Buffer {
    const skeletonArr = [Buffer.from(hardfork), blockRLP]
    return Buffer.from(RLP.encode(skeletonArr))
  }

  deserialize(rlp: Buffer): { hardfork: Hardfork | string; blockRLP: Buffer } {
    const [hardfork, blockRLP] = arrToBufArr(RLP.decode(Uint8Array.from(rlp))) as Buffer[]
    return { hardfork: hardfork.toString(), blockRLP }
  }

  /**
   * Writes a skeleton block to the db by number
   */
  private async putBlock(block: Block): Promise<boolean> {
    // Serialize the block with its hardfork so that its easy to load the block latter
    const rlp = this.serialize({ hardfork: block._common.hardfork(), blockRLP: block.serialize() })
    await this.put(DBKey.SkeletonBlock, bigIntToBuffer(block.header.number), rlp)
    await this.put(
      DBKey.SkeletonBlockHashToNumber,
      block.hash(),
      bigIntToBuffer(block.header.number)
    )
    return true
  }

  /**
   * Gets a block from the skeleton or canonical db by number.
   */
  async getBlock(number: bigint, onlySkeleton = false): Promise<Block | undefined> {
    try {
      const rlp = await this.get(DBKey.SkeletonBlock, bigIntToBuffer(number))
      const { hardfork, blockRLP } = this.deserialize(rlp!)
      const common = this.config.chainCommon.copy()
      common.setHardfork(hardfork)

      const block = Block.fromRLPSerializedBlock(blockRLP, {
        common,
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
    return this.getBlock(bufferToBigInt(number))
  }

  /**
   * Deletes a skeleton block from the db by number
   */
  async deleteBlock(block: Block): Promise<boolean> {
    try {
      await this.delete(DBKey.SkeletonBlock, bigIntToBuffer(block.header.number))
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
      bigIntToBuffer(subchain.head),
      bigIntToBuffer(subchain.tail),
      subchain.next,
    ])
    return Buffer.from(RLP.encode(subchains))
  }

  /**
   * Decodes an RLP encoded {@link SkeletonStatus}
   */
  private statusRLPtoObject(rawStatus: Buffer): SkeletonStatus {
    const status: SkeletonStatus = { progress: { subchains: [] } }
    const rawSubchains = RLP.decode(rawStatus) as unknown as SkeletonSubchainRLP[]
    const subchains: SkeletonSubchain[] = rawSubchains.map((raw) => ({
      head: bufferToBigInt(raw[0]),
      tail: bufferToBigInt(raw[1]),
      next: raw[2],
    }))
    status.progress.subchains = subchains
    return status
  }
}
