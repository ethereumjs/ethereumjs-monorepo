import { Block } from '@ethereumjs/block'
import { RLP } from '@ethereumjs/rlp'
import {
  BIGINT_0,
  BIGINT_1,
  Lock,
  bigIntToBytes,
  bytesToBigInt,
  bytesToInt,
  equalsBytes,
  intToBytes,
  utf8ToBytes,
  zeros,
} from '@ethereumjs/util'

import { short, timeDuration } from '../util'
import { DBKey, MetaDBManager } from '../util/metaDBManager'

import type { MetaDBManagerOptions } from '../util/metaDBManager'
import type { Hardfork } from '@ethereumjs/common'

// Thanks to go-ethereum for the skeleton design

type SkeletonStatus = {
  progress: SkeletonProgress
  linked: boolean
  canonicalHeadReset: boolean
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
  next: Uint8Array /** Block hash of the next oldest header in the subchain */
}
type SkeletonSubchainRLP = [head: Uint8Array, tail: Uint8Array, next: Uint8Array]

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
  private _lock = new Lock()

  private status: SkeletonStatus

  private started: number /** Timestamp when the skeleton syncer was created */
  private logged = 0 /** Timestamp when progress was last logged to user */
  private pulled = BIGINT_0 /** Number of headers downloaded in this run */
  private filling = false /** Whether we are actively filling the canonical chain */

  private fillLogIndex = 0

  private STATUS_LOG_INTERVAL = 8000 /** How often to log sync status (in ms) */

  constructor(opts: MetaDBManagerOptions) {
    super(opts)
    this.status = { progress: { subchains: [] }, linked: false, canonicalHeadReset: false }
    this.started = 0
  }

  /**
   * Run a function after acquiring a lock. It is implied that we have already
   * initialized the module (or we are calling this from the init function, like
   * `_setCanonicalGenesisBlock`)
   * @param action - function to run after acquiring a lock
   * @hidden
   */
  private async runWithLock<T>(action: () => Promise<T>): Promise<T> {
    try {
      await this._lock.acquire()
      const value = await action()
      return value
    } finally {
      this._lock.release()
    }
  }

  async open() {
    // make sure to open chain before this can be opened
    await this.chain.open()

    await this.runWithLock<void>(async () => {
      await this.getSyncStatus()
      this.logSyncStatus('Read')
      this.started = new Date().getTime()
    })
  }

  async close() {
    await this.runWithLock<void>(async () => {
      await this.writeSyncStatus()
      this.started = 0
    })
  }

  /**
   * Returns true if the skeleton chain is linked to canonical
   */
  private async checkLinked() {
    if (this.status.progress.subchains.length === 0) return false
    const { tail, next } = this.bounds()
    // if its genesis we are linked
    if (tail === BIGINT_0) return true
    if (tail <= this.chain.blocks.height + BIGINT_1) {
      const nextBlock = await this.chain.getBlock(tail - BIGINT_1)
      const linked = equalsBytes(next, nextBlock.hash())
      if (linked && this.status.progress.subchains.length > 1) {
        // Remove all other subchains as no more relevant
        const junkedSubChains = this.status.progress.subchains.splice(1)
        this.config.logger.debug(
          `Canonical subchain linked with main, removing junked chains ${junkedSubChains
            .map((s) => `[head=${s.head} tail=${s.tail} next=${short(s.next)}]`)
            .join(',')}`
        )
        await this.writeSyncStatus()
      }
      return linked
    }
    return false
  }

  isLinked() {
    return this.status.linked
  }

  isStarted() {
    return this.started > 0
  }

  async isLastAnnoucement(): Promise<boolean> {
    const subchain0 = this.status.progress.subchains[0]
    if (subchain0 !== undefined) {
      return this.getBlock(subchain0.head + BIGINT_1) !== undefined
    } else {
      return true
    }
  }

  /**
   * Try fast forwarding the chain head to the number
   */
  private async fastForwardHead(lastchain: SkeletonSubchain, target: bigint) {
    const head = lastchain.head
    let headBlock = await this.getBlock(head, true)
    if (headBlock === undefined) {
      return
    }

    for (let newHead = head + BIGINT_1; newHead <= target; newHead += BIGINT_1) {
      const newBlock = await this.getBlock(newHead, true)
      if (newBlock === undefined || !equalsBytes(newBlock.header.parentHash, headBlock.hash())) {
        // Head can't be updated forward
        break
      }
      headBlock = newBlock
    }
    lastchain.head = headBlock.header.number
    this.config.logger.debug(
      `lastchain head fast forwarded from=${head} to=${lastchain.head} tail=${lastchain.tail}`
    )
  }

  /**
   * processNewHead does the internal shuffling for a new head marker and either
   * accepts and integrates it into the skeleton or requests a reorg. Upon reorg,
   * the syncer will tear itself down and restart with a fresh head. It is simpler
   * to reconstruct the sync state than to mutate it.
   *
   * @returns true if the chain was reorged
   */
  private async processNewHead(head: Block, force = false): Promise<boolean> {
    // If the header cannot be inserted without interruption, return an error for
    // the outer loop to tear down the skeleton sync and restart it
    const { number } = head.header
    if (number === BIGINT_0) {
      if (!equalsBytes(this.chain.genesis.hash(), head.hash())) {
        throw Error(
          `Invalid genesis setHead announcement number=${number} hash=${short(
            head.hash()
          )} genesisHash=${short(this.chain.genesis.hash())}`
        )
      }
      // genesis announcement
      return false
    }

    let [lastchain] = this.status.progress.subchains
    if (lastchain === undefined) {
      this.config.logger.info(
        `Skeleton empty, comparing against genesis head=0 tail=0 newHead=${number}`
      )
      // set the lastchain to genesis for comparison in following conditions
      lastchain = { head: BIGINT_0, tail: BIGINT_0, next: zeroBlockHash }
    }

    if (lastchain.tail > number) {
      // Not a noop / double head announce, abort with a reorg
      if (force) {
        this.config.logger.warn(
          `Skeleton setHead before tail, resetting skeleton tail=${lastchain.tail} head=${lastchain.head} newHead=${number}`
        )
        lastchain.head = number
        lastchain.tail = number
        lastchain.next = head.header.parentHash
      } else {
        this.config.logger.debug(
          `Skeleton announcement before tail, will reset skeleton tail=${lastchain.tail} head=${lastchain.head} newHead=${number}`
        )
      }
      return true
    } else if (lastchain.head >= number) {
      // Check if its duplicate announcement, if not trim the head and let the match run
      // post this if block
      const mayBeDupBlock = await this.getBlock(number)
      if (mayBeDupBlock !== undefined && equalsBytes(mayBeDupBlock.header.hash(), head.hash())) {
        this.config.logger.debug(
          `Skeleton duplicate ${force ? 'setHead' : 'announcement'} tail=${lastchain.tail} head=${
            lastchain.head
          } number=${number} hash=${short(head.hash())}`
        )
        return false
      } else {
        // Since its not a dup block, so there is reorg in the chain or at least in the head
        // which we will let it get addressed post this if else block
        if (force) {
          this.config.logger.debug(
            `Skeleton differing announcement tail=${lastchain.tail} head=${
              lastchain.head
            } number=${number} expected=${short(
              mayBeDupBlock?.hash() ?? zeroBlockHash
            )} actual=${short(head.hash())}`
          )
        } else {
          this.config.logger.debug(
            `Skeleton stale announcement tail=${lastchain.tail} head=${lastchain.head} number=${number}`
          )
        }
        return true
      }
    } else if (lastchain.head + BIGINT_1 < number) {
      if (force) {
        await this.fastForwardHead(lastchain, number - BIGINT_1)
        // If its still less than number then its gapped head
        if (lastchain.head + BIGINT_1 < number) {
          this.config.logger.debug(
            `Beacon chain gapped setHead head=${lastchain.head} newHead=${number}`
          )
          return true
        }
      } else {
        this.config.logger.debug(
          `Beacon chain gapped announcement head=${lastchain.head} newHead=${number}`
        )
        return true
      }
    }
    const parent = await this.getBlock(number - BIGINT_1)
    if (parent === undefined || !equalsBytes(parent.hash(), head.header.parentHash)) {
      if (force) {
        this.config.logger.warn(
          `Beacon chain forked ancestor=${parent?.header.number} hash=${short(
            parent?.hash() ?? 'NA'
          )} want=${short(head.header.parentHash)}`
        )
      }
      return true
    }
    if (force) {
      lastchain.head = number
      if (this.status.progress.subchains.length === 0) {
        // If there was no subchain to being with i.e. initialized from genesis and no reorg
        // then push in subchains else the reorg handling will push the new chain
        this.status.progress.subchains.push(lastchain)
        this.status.linked = await this.checkLinked()
      }
      this.config.logger.debug(
        `Beacon chain extended new head=${lastchain.head} tail=${lastchain.tail} next=${short(
          lastchain.next
        )}`
      )
    }
    return false
  }

  /**
   * Announce and integrate a new head.
   * @params head - The block being attempted as a new head
   * @params force - Flag to indicate if this is just a check of worthiness or a actually new head
   * @params init - Flag this is the first time since the beacon sync start to perform additional tasks
   * @params reorgthrow - Flag to indicate if we would actually like to throw if there is a reorg
   *         instead of just returning the boolean
   *
   * @returns True if the head (will) cause a reorg in the canonical skeleton subchain
   */
  async setHead(head: Block, force = true, init = false, reorgthrow = false): Promise<boolean> {
    return this.runWithLock<boolean>(async () => {
      if (this.started === 0) {
        throw Error(`skeleton setHead called before being opened`)
      }

      this.config.logger.debug(
        `New skeleton head announced number=${head.header.number} hash=${short(
          head.hash()
        )} force=${force}`
      )

      const subchain0Head = this.status.progress.subchains[0]?.head ?? BIGINT_0
      const reorg = await this.processNewHead(head, force)

      // see if just the head needs to be updated or a new subchain needs to be created
      if (force && reorg) {
        // It could just be a reorg at this head with previous tail preserved unless
        //   1. parent is not present in skeleton (it could be in chain for whatever reason) or
        //   2. the parent < current skeleton tail
        // then we need to reset the subchain itself
        const subchain = this.status.progress.subchains[0]
        const parent = await this.getBlock(head.header.number - BIGINT_1, true)
        if (
          subchain === undefined ||
          parent === undefined ||
          !equalsBytes(parent.hash(), head.header.parentHash) ||
          parent.header.number < subchain.tail
        ) {
          const s = {
            head: head.header.number,
            tail: head.header.number,
            next: head.header.parentHash,
          }
          this.status.progress.subchains.unshift(s)
          this.config.logger.info(
            `Created new subchain head=${s.head} tail=${s.tail} next=${short(s.next)}`
          )
          // Reset the filling of canonical head from tail only on tail reorg and exit any ongoing fill
          this.status.canonicalHeadReset = s.tail > BIGINT_0
        } else {
          // Only the head differed, tail is preserved
          subchain.head = head.header.number
        }
      }

      // Put block if this is forced i.e. fcU update or if this is forward announcement i.e. new blocks
      // after the current head. putting this block on annoucement i.e force=false on <=current head changes the
      // skeleton canonical relationship. for > current head, this is treated more like optimistic cache
      if (force || head.header.number > subchain0Head) {
        await this.putBlock(head)
      }

      if (init) {
        await this.trySubChainsMerge()
      }
      if ((force && reorg) || init) {
        this.status.linked = await this.checkLinked()
      }
      if (force && this.status.linked && head.header.number > subchain0Head) {
        void this.fillCanonicalChain()
      }
      if (force || init) {
        await this.writeSyncStatus()
      }

      // Earlier we were throwing on reorg, essentially for the purposes for killing the reverse fetcher
      // but it can be handled properly in the calling fn without erroring
      if (reorg && reorgthrow) {
        if (force) {
          throw errSyncReorged
        } else {
          throw errReorgDenied
        }
      }
      return reorg
    })
  }

  /**
   * Setup the skeleton to init sync with head
   * @params head - The block with which we want to init the skeleton head
   * @params reorgthrow - If we would like the function to throw instead of silently
   *         return if there is reorg of the skeleton head
   *
   * @returns True if the skeleton was reorged trying to init else false
   */
  async initSync(head: Block, reorgthrow = false): Promise<boolean> {
    return this.setHead(head, true, true, reorgthrow)
  }

  /**
   * Bounds returns the current head and tail tracked by the skeleton syncer.
   */
  bounds(): SkeletonSubchain {
    return this.status.progress.subchains[0]
  }

  private async trySubChainsMerge(): Promise<boolean> {
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
        this.status.progress.subchains[1].head = this.status.progress.subchains[0].tail - BIGINT_1
        this.config.logger.debug(
          `Previous subchain partially overwritten head=${head} tail=${tail} next=${short(
            next
          )} with newHead=${this.status.progress.subchains[1].head}`
        )
        edited = true
      }
      // If the old subchain is an extension of the new one, merge the two
      // and let the skeleton syncer restart (to clean internal state)

      // subchains are useful if subChain1Head is in skeleton only and its tail correct
      const subChain1Head = await this.getBlock(this.status.progress.subchains[1].head, true)
      // tail lookup also needs to be from skeleton because we set resetCanonicalHead true if merged
      const subChain1Tail = await this.getBlock(this.status.progress.subchains[1].tail, true)
      if (
        subChain1Head === undefined ||
        subChain1Tail === undefined ||
        !equalsBytes(subChain1Tail.header.parentHash, this.status.progress.subchains[1].next)
      ) {
        // if subChain1Head is not in the skeleton then all previous subchains are not useful
        // and better to junk
        this.config.logger.debug(
          `Removing all previous subchains as skeleton missing block at previous subchain head=${this.status.progress.subchains[1].head} or its tail=${this.status.progress.subchains[1].tail}`
        )
        this.status.progress.subchains.splice(1, this.status.progress.subchains.length - 1)
      } else if (
        equalsBytes(subChain1Head.hash(), this.status.progress.subchains[0].next) === true
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
    return this.runWithLock<number>(async () => {
      // if no subchain or linked chain throw error as this will exit the fetcher
      if (this.status.progress.subchains.length === 0) {
        throw Error(`Skeleton no subchain set for sync`)
      }
      if (this.status.linked) {
        throw Error(`Chain already linked`)
      }

      let merged = false
      let tailUpdated = false
      this.config.logger.debug(
        `Skeleton putBlocks start=${blocks[0]?.header.number} hash=${short(
          blocks[0]?.hash()
        )} fork=${blocks[0].common.hardfork()} end=${
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
        } else if (number === BIGINT_0) {
          if (!equalsBytes(this.chain.genesis.hash(), block.hash())) {
            throw Error(
              `Skeleton pubBlocks with invalid genesis block number=${number} hash=${short(
                block.hash()
              )} genesisHash=${short(this.chain.genesis.hash())}`
            )
          }
          continue
        } else if (number < BIGINT_0) {
          throw Error(`Skeleton putBlocks with invalid block number=${number}`)
        }

        // Extend subchain or create new segment if necessary
        if (equalsBytes(this.status.progress.subchains[0].next, block.hash())) {
          await this.putBlock(block)
          this.pulled += BIGINT_1
          this.status.progress.subchains[0].tail = block.header.number
          this.status.progress.subchains[0].next = block.header.parentHash
          tailUpdated = true
        } else {
          // Critical error, we expect new incoming blocks to extend the canonical
          // subchain which is the [0]'th
          const tailBlock = await this.getBlock(this.status.progress.subchains[0].tail)
          this.config.logger.warn(
            `Blocks don't extend canonical subchain head=${
              this.status.progress.subchains[0].head
            } tail=${this.status.progress.subchains[0].tail} next=${short(
              this.status.progress.subchains[0].next
            )} tailHash=${short(
              tailBlock?.hash() ?? zeroBlockHash
            )} tailFork=${tailBlock?.common.hardfork()}, block number=${number} tailparent=${short(
              tailBlock?.header.parentHash ?? zeroBlockHash
            )} hash=${short(block.hash())} fork=${block.common.hardfork()}`
          )
          throw Error(`Blocks don't extend canonical subchain`)
        }
        merged = await this.trySubChainsMerge()
        // If tail is updated normally or because of merge, we should now fill from
        // the tail to modify the canonical
        if (tailUpdated || merged) {
          this.status.canonicalHeadReset = true
        }
        // If its merged, we need to break as the new tail could be quite ahead
        // so we need to clear out and run the reverse block fetcher again
        if (merged) break
      }

      await this.writeSyncStatus()

      // Print a progress report making the UX a bit nicer
      if (new Date().getTime() - this.logged > this.STATUS_LOG_INTERVAL) {
        let left = this.bounds().tail - BIGINT_1 - this.chain.blocks.height
        if (this.status.linked) left = BIGINT_0
        if (left > BIGINT_0) {
          this.logged = new Date().getTime()
          if (this.pulled === BIGINT_0) {
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

      if (!this.status.linked) {
        this.status.linked = await this.checkLinked()
      }

      // If the sync is finished, start filling the canonical chain.
      if (this.status.linked) {
        void this.fillCanonicalChain()
      }

      if (merged) throw errSyncMerged
      return blocks.length
    })
  }

  private async backStep(fromBlock: bigint): Promise<bigint | null> {
    try {
      if (this.config.skeletonFillCanonicalBackStep <= 0) return null
      const { head, tail } = this.bounds()
      // by default we try back stepping from tail or fromBlock whichever is bigger
      let newTail: bigint | null = tail < fromBlock ? fromBlock : tail

      let tailBlock
      do {
        newTail = newTail + BigInt(this.config.skeletonFillCanonicalBackStep)
        tailBlock = await this.getBlock(newTail, true)
      } while (tailBlock === undefined && newTail <= head)
      if (newTail > head) {
        newTail = head
        tailBlock = await this.getBlock(newTail, true)
      }

      if (tailBlock !== undefined && newTail) {
        this.config.logger.info(`Backstepped skeleton head=${head} tail=${newTail}`)
        this.status.progress.subchains[0].tail = tailBlock.header.number
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
    } finally {
      this.status.canonicalHeadReset = true
      this.status.linked = await this.checkLinked()
    }
  }

  /**
   * Inserts skeleton blocks into canonical chain and runs execution.
   */
  async fillCanonicalChain() {
    if (this.filling) return
    this.filling = true

    let canonicalHead = this.chain.blocks.height
    let oldHead = null
    const subchain = this.status.progress.subchains[0]!
    if (this.status.canonicalHeadReset) {
      oldHead = this.chain.blocks.latest // Grab previous head block in case of resettng canonical head
      if (subchain.tail > canonicalHead + BIGINT_1) {
        throw Error(
          `Canonical head should already be on or ahead subchain tail canonicalHead=${canonicalHead} tail=${subchain.tail}`
        )
      }
      let newHead = subchain.tail - BIGINT_1
      if (newHead < BIGINT_0) {
        newHead = BIGINT_0
      }
      this.config.logger.debug(
        `Resetting canonicalHead for fillCanonicalChain from=${canonicalHead} to=${newHead}`
      )
      canonicalHead = newHead
      await this.chain.resetCanonicalHead(canonicalHead)

      // update in lock so as to not conflict/overwrite sethead/putblock updates
      await this.runWithLock<void>(async () => {
        this.status.canonicalHeadReset = false
      })
    }

    const start = canonicalHead
    // This subchain is a reference to update the tail for the very subchain we are filling the data for
    this.config.logger.debug(
      `Starting canonical chain fill canonicalHead=${canonicalHead} subchainHead=${subchain.head}`
    )

    // run till it has not been determined that tail reset is required by concurrent setHead calls
    // filling is switched on and off by fillCanonicalChain only so no need to monitor that
    while (!this.status.canonicalHeadReset && canonicalHead < subchain.head) {
      // Get next block
      const number = canonicalHead + BIGINT_1
      const block = await this.getBlock(number)

      if (block === undefined) {
        // This can happen
        //   i) Only if canonicalHeadReset was flagged on causing skeleton to change its tail canonicality
        // Else we should back step and fetch again as it indicates some concurrency/db errors
        if (!this.status.canonicalHeadReset) {
          this.config.logger.debug(
            `fillCanonicalChain block number=${number} not found, backStepping...`
          )
          await this.runWithLock<void>(async () => {
            // backstep the subchain from the block that was not found only if the canonicalHeadReset
            // has not been flagged on, else the chain tail has already been reset by sethead
            await this.backStep(number)
          })
        } else {
          this.config.logger.debug(
            `fillCanonicalChain block number=${number} not found canonicalHeadReset=${this.status.canonicalHeadReset}, breaking out...`
          )
        }
        break
      }

      // Insert into chain
      let numBlocksInserted = 0
      try {
        numBlocksInserted = await this.chain.putBlocks([block], true)
      } catch (e) {
        this.config.logger.error(`fillCanonicalChain putBlock error=${(e as Error).message}`)
        if (oldHead !== null && oldHead.header.number >= block.header.number) {
          // Put original canonical head block back if reorg fails
          // UPDATE
          // not sure we can put oldHead because the oldHead chain might have been partially overwritten
          // skipping for now, leaving code here for future cleanup/debugging
          //
          // await this.chain.putBlocks([oldHead], true)
        }
      }

      // handle insertion failures
      if (numBlocksInserted !== 1) {
        this.config.logger.error(
          `Failed to put block number=${number} fork=${block.common.hardfork()} hash=${short(
            block.hash()
          )} parentHash=${short(block.header.parentHash)}from skeleton chain to canonical`
        )
        // Lets log some parent by number and parent by hash, that may help to understand whats going on
        let parent = null
        try {
          parent = await this.chain.getBlock(number - BIGINT_1)
          this.config.logger.info(
            `ParentByNumber number=${parent?.header.number}, hash=${short(
              parent?.hash() ?? 'undefined'
            )} hf=${parent?.common.hardfork()}`
          )
        } catch (e) {
          this.config.logger.error(`Failed to fetch parent of number=${number}`)
        }

        let parentWithHash = null
        try {
          parentWithHash = await this.chain.getBlock(block.header.parentHash)
          this.config.logger.info(
            `parentByHash number=${parentWithHash?.header.number}, hash=${short(
              parentWithHash?.hash() ?? 'undefined'
            )} hf=${parentWithHash?.common.hardfork()}  `
          )
        } catch (e) {
          this.config.logger.error(
            `Failed to fetch parent with parentWithHash=${short(block.header.parentHash)}`
          )
        }

        // see if backstepping is required ot this is just canonicalHeadReset
        await this.runWithLock<void>(async () => {
          if (!this.status.canonicalHeadReset) {
            this.config.logger.debug(
              `fillCanonicalChain canonicalHeadReset=${this.status.canonicalHeadReset}, backStepping...`
            )
            await this.backStep(number)
          } else {
            this.config.logger.debug(
              `fillCanonicalChain canonicalHeadReset=${this.status.canonicalHeadReset}, breaking out...`
            )
          }
        })
        break
      }

      canonicalHead += BigInt(numBlocksInserted)
      this.fillLogIndex += numBlocksInserted
      // Delete skeleton block to clean up as we go, if block is fetched and chain is linked
      // it will be fetched from the chain without any issues
      //
      // however delete it in a lock as the parent lookup of a reorged block in skeleton is used
      // to determine if the tail is to be reset or now
      await this.runWithLock<void>(async () => {
        await this.deleteBlock(block)
      })
      if (this.fillLogIndex >= this.config.numBlocksPerIteration) {
        this.config.logger.info(
          `Skeleton canonical chain fill status: canonicalHead=${canonicalHead} chainHead=${this.chain.blocks.height} subchainHead=${subchain.head}`
        )
        this.fillLogIndex = 0
      }
    }
    this.filling = false
    this.config.logger.debug(
      `Successfully put blocks start=${start} end=${canonicalHead} skeletonHead=${subchain.head} from skeleton chain to canonical syncTargetHeight=${this.config.syncTargetHeight}`
    )
  }

  serialize({
    hardfork,
    blockRLP,
  }: {
    hardfork: Hardfork | string
    blockRLP: Uint8Array
  }): Uint8Array {
    const skeletonArr = [utf8ToBytes(hardfork), blockRLP]
    return RLP.encode(skeletonArr)
  }

  deserialize(rlp: Uint8Array): { hardfork: Hardfork | string; blockRLP: Uint8Array } {
    const [hardfork, blockRLP] = RLP.decode(rlp) as Uint8Array[]
    return { hardfork: hardfork.toString(), blockRLP }
  }

  /**
   * Writes a skeleton block to the db by number
   */
  private async putBlock(block: Block): Promise<boolean> {
    // Serialize the block with its hardfork so that its easy to load the block latter
    const rlp = this.serialize({ hardfork: block.common.hardfork(), blockRLP: block.serialize() })
    await this.put(DBKey.SkeletonBlock, bigIntToBytes(block.header.number), rlp)
    await this.put(
      DBKey.SkeletonBlockHashToNumber,
      block.hash(),
      bigIntToBytes(block.header.number)
    )
    return true
  }

  /**
   * Gets a block from the skeleton or canonical db by number.
   */
  async getBlock(number: bigint, onlySkeleton = false): Promise<Block | undefined> {
    try {
      const rlp = await this.get(DBKey.SkeletonBlock, bigIntToBytes(number))
      const { hardfork, blockRLP } = this.deserialize(rlp!)
      const common = this.config.chainCommon.copy()
      common.setHardfork(hardfork)

      const block = Block.fromRLPSerializedBlock(blockRLP, {
        common,
      })
      return block
    } catch (error: any) {
      // If skeleton is linked, it probably has deleted the block and put it into the chain
      if (onlySkeleton || !this.status.linked) return undefined
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
  async getBlockByHash(hash: Uint8Array, onlySkeleton?: boolean): Promise<Block | undefined> {
    const number = await this.get(DBKey.SkeletonBlockHashToNumber, hash)
    if (number) {
      const block = await this.getBlock(bytesToBigInt(number), onlySkeleton)
      if (block !== undefined && equalsBytes(block.hash(), hash)) {
        return block
      }
    }

    if (onlySkeleton === true) {
      return undefined
    } else {
      try {
        return await this.chain.getBlock(hash)
      } catch (e) {
        return undefined
      }
    }
  }

  /**
   * Deletes a skeleton block from the db by number
   */
  async deleteBlock(block: Block): Promise<boolean> {
    try {
      await this.delete(DBKey.SkeletonBlock, bigIntToBytes(block.header.number))
      await this.delete(DBKey.SkeletonBlockHashToNumber, block.hash())
      return true
    } catch (error: any) {
      return false
    }
  }

  logSyncStatus(logPrefix: string, showInfo: boolean = false): void {
    const vmHead = this.chain.blocks.vm
    const subchain0 = this.status.progress.subchains[0]
    const isValid =
      vmHead !== undefined &&
      this.status.linked &&
      (vmHead?.header.number ?? BIGINT_0) === (subchain0?.head ?? BIGINT_0)
    const isSynced =
      this.status.linked &&
      (this.chain.blocks.latest?.header.number ?? BIGINT_0) === (subchain0?.head ?? BIGINT_0)
    const status = isValid ? 'VALID' : isSynced ? 'SYNCED' : 'SYNCING'
    const chainHead = `chain head=${this.chain.blocks.latest?.header.number ?? 'na'} hash=${short(
      this.chain.blocks.latest?.hash() ?? 'na'
    )}`

    if (showInfo) {
      let logInfo
      if (isValid) {
        logInfo = `vm = cl = ${chainHead}`
      } else {
        logInfo = `vm=${vmHead?.header.number} hash=${short(vmHead?.hash() ?? 'na')}`

        // if not synced add subchain info
        if (!isSynced) {
          logInfo = `${logInfo} cl=${subchain0?.head} ${chainHead}`
          const subchainLen = this.status.progress.subchains.length
          logInfo = `${logInfo} subchains(${subchainLen}) linked=${
            this.status.linked
          } ${this.status.progress.subchains
            // if info log show only first subchain to be succinct
            .slice(0, showInfo ? 1 : this.status.progress.subchains.length)
            .map((s) => `[head=${s.head} tail=${s.tail} next=${short(s.next)}]`)
            .join(',')}${subchainLen > 0 ? '…' : ''} will reset chain=${
            this.status.canonicalHeadReset
          }`
        } else {
          logInfo = `${logInfo} cl = ${chainHead}`
        }
      }
      this.config.logger.info(`${logPrefix}: ${status} ${logInfo}`)
    } else {
      this.config.logger.debug(
        `${logPrefix} ${status} linked=${
          this.status.linked
        } subchains=${this.status.progress.subchains
          // if info log show only first subchain to be succinct
          .slice(0, showInfo ? 1 : this.status.progress.subchains.length)
          .map((s) => `[head=${s.head} tail=${s.tail} next=${short(s.next)}]`)
          .join(',')} reset=${this.status.canonicalHeadReset} ${chainHead}`
      )
    }
  }

  /**
   * Writes the {@link SkeletonStatus} to db
   */
  private async writeSyncStatus(showInfo: boolean = false): Promise<boolean> {
    this.logSyncStatus('Writing', showInfo)
    const encodedStatus = this.statusToRLP()
    await this.put(DBKey.SkeletonStatus, new Uint8Array(0), encodedStatus)
    return true
  }

  /**
   * Reads the {@link SkeletonStatus} from db
   */
  private async getSyncStatus(): Promise<SkeletonStatus | undefined> {
    const rawStatus = await this.get(DBKey.SkeletonStatus, new Uint8Array(0))
    if (!rawStatus) return
    const status = this.statusRLPtoObject(rawStatus)
    this.status = status
    return status
  }

  /**
   * Encodes a {@link SkeletonStatus} to RLP for saving to the db
   */
  private statusToRLP(): Uint8Array {
    const subchains: SkeletonSubchainRLP[] = this.status.progress.subchains.map((subchain) => [
      bigIntToBytes(subchain.head),
      bigIntToBytes(subchain.tail),
      subchain.next,
    ])
    return RLP.encode([
      subchains,
      // linked
      intToBytes(this.status.linked ? 1 : 0),
      // canonocalHeadReset
      intToBytes(this.status.canonicalHeadReset ? 1 : 0),
    ])
  }

  /**
   * Decodes an RLP encoded {@link SkeletonStatus}
   */
  private statusRLPtoObject(serializedStatus: Uint8Array): SkeletonStatus {
    const status: SkeletonStatus = {
      progress: { subchains: [] },
      linked: false,
      canonicalHeadReset: true,
    }
    const rawStatus = RLP.decode(serializedStatus) as unknown as [
      SkeletonSubchainRLP[],
      Uint8Array,
      Uint8Array
    ]
    const subchains: SkeletonSubchain[] = rawStatus[0].map((raw) => ({
      head: bytesToBigInt(raw[0]),
      tail: bytesToBigInt(raw[1]),
      next: raw[2],
    }))
    status.progress.subchains = subchains
    status.linked = bytesToInt(rawStatus[1]) === 1
    status.canonicalHeadReset = bytesToInt(rawStatus[2]) === 1
    return status
  }
}
