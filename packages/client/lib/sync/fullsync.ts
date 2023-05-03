import { Hardfork } from '@ethereumjs/common'
import { equalsBytes } from 'ethereum-cryptography/utils'

import { Event } from '../types'
import { short } from '../util'

import { BlockFetcher } from './fetcher'
import { Synchronizer } from './sync'

import type { VMExecution } from '../execution'
import type { Peer } from '../net/peer/peer'
import type { TxPool } from '../service/txpool'
import type { SynchronizerOptions } from './sync'
import type { Block } from '@ethereumjs/block'

interface FullSynchronizerOptions extends SynchronizerOptions {
  /** Tx Pool */
  txPool: TxPool
  execution: VMExecution
}

interface HandledObject {
  hash: Uint8Array
  added: number
}

type PeerId = string
/**
 * Implements an ethereum full sync synchronizer
 * @memberof module:sync
 */
export class FullSynchronizer extends Synchronizer {
  private txPool: TxPool
  private execution: VMExecution
  private newBlocksKnownByPeer: Map<PeerId, HandledObject[]>

  constructor(options: FullSynchronizerOptions) {
    super(options)
    this.txPool = options.txPool
    this.execution = options.execution
    this.newBlocksKnownByPeer = new Map()

    this.processBlocks = this.processBlocks.bind(this)
    this.runExecution = this.runExecution.bind(this)
    this.stop = this.stop.bind(this)

    void this.chain.update()
  }

  /**
   * Returns synchronizer type
   */
  get type() {
    return 'full'
  }

  get fetcher(): BlockFetcher | null {
    if (this._fetcher !== null && !(this._fetcher instanceof BlockFetcher)) {
      throw Error(`Invalid Fetcher, expected BlockFetcher`)
    }
    return this._fetcher
  }

  set fetcher(fetcher: BlockFetcher | null) {
    this._fetcher = fetcher
  }

  /**
   * Open synchronizer. Must be called before sync() is called
   */
  async open(): Promise<void> {
    if (this.opened) return
    await super.open()
    await this.chain.open()

    this.config.events.on(Event.SYNC_FETCHED_BLOCKS, this.processBlocks)
    this.config.events.on(Event.SYNC_EXECUTION_VM_ERROR, this.stop)
    if (this.config.execution) {
      this.config.events.on(Event.CHAIN_UPDATED, this.runExecution)
    }

    await this.pool.open()
    const { height: number, td } = this.chain.blocks
    const hash = this.chain.blocks.latest!.hash()
    this.startingBlock = number
    const timestamp = this.chain.blocks.latest?.header.timestamp
    this.config.chainCommon.setHardforkByBlockNumber(number, td, timestamp)

    this.config.logger.info(
      `Latest local block number=${Number(number)} td=${td} hash=${short(
        hash
      )} hardfork=${this.config.chainCommon.hardfork()}`
    )
  }

  /**
   * Returns true if peer can be used for syncing
   */
  syncable(peer: Peer): boolean {
    return peer.eth !== undefined
  }

  /**
   * Finds the best peer to sync with. We will synchronize to this peer's
   * blockchain. Returns null if no valid peer is found
   */
  async best(): Promise<Peer | undefined> {
    let best
    const peers = this.pool.peers.filter(this.syncable.bind(this))
    if (peers.length < this.config.minPeers && !this.forceSync) return
    for (const peer of peers) {
      if (peer.eth?.status !== undefined) {
        const td = peer.eth.status.td
        if (
          (!best && td >= this.chain.blocks.td) ||
          (best && best.eth && best.eth.status.td < td)
        ) {
          best = peer
        }
      }
    }
    return best
  }

  /**
   * Get latest header of peer
   */
  async latest(peer: Peer) {
    const result = await peer.eth?.getBlockHeaders({
      block: peer.eth!.status.bestHash,
      max: 1,
    })
    return result ? result[1][0] : undefined
  }

  /**
   * Checks if tx pool should be started
   */
  checkTxPoolState() {
    if (
      this.config.syncTargetHeight === undefined ||
      this.config.syncTargetHeight === BigInt(0) ||
      this.txPool.running
    ) {
      return
    }
    // If height gte target, we are close enough to the
    // head of the chain that the tx pool can be started
    const target =
      this.config.syncTargetHeight - BigInt(this.txPool.BLOCKS_BEFORE_TARGET_HEIGHT_ACTIVATION)
    if (this.chain.headers.height >= target) {
      this.txPool.start()
    }
  }

  /**
   * Sync all blocks and state from peer starting from current height.
   * @param peer remote peer to sync with
   * @returns a boolean if the setup was successful
   */
  async syncWithPeer(peer?: Peer): Promise<boolean> {
    const latest = peer ? await this.latest(peer) : undefined
    if (!latest) return false

    const height = latest.number
    if (
      this.config.syncTargetHeight === undefined ||
      this.config.syncTargetHeight === BigInt(0) ||
      this.config.syncTargetHeight < latest.number
    ) {
      this.config.syncTargetHeight = height
      this.config.logger.info(`New sync target height=${height} hash=${short(latest.hash())}`)
    }

    // Start fetcher from a safe distance behind because if the previous fetcher exited
    // due to a reorg, it would make sense to step back and refetch.
    const first =
      this.chain.blocks.height >= BigInt(this.config.safeReorgDistance)
        ? this.chain.blocks.height - BigInt(this.config.safeReorgDistance) + BigInt(1)
        : BigInt(1)
    const count = height - first + BigInt(1)
    if (count < BigInt(0)) return false
    if (!this.fetcher || this.fetcher.syncErrored) {
      this.fetcher = new BlockFetcher({
        config: this.config,
        pool: this.pool,
        chain: this.chain,
        interval: this.interval,
        first,
        count,
        destroyWhenDone: false,
      })
    } else {
      const fetcherHeight = this.fetcher.first + this.fetcher.count - BigInt(1)
      if (height > fetcherHeight) {
        this.fetcher.count += height - fetcherHeight
        this.config.logger.info(`Updated fetcher target to height=${height} peer=${peer} `)
      }
    }
    return true
  }

  /**
   * Process blocks fetched from the fetcher.
   */
  async processBlocks(blocks: Block[]) {
    if (this.config.chainCommon.gteHardfork(Hardfork.Paris) === true) {
      if (this.fetcher !== null) {
        // If we are beyond the merge block we should stop the fetcher
        this.config.logger.info('Paris (Merge) hardfork reached, stopping block fetcher')
        this.clearFetcher()
      }
    }

    if (blocks.length === 0) {
      if (this.fetcher !== null) {
        this.config.logger.warn('No blocks fetched are applicable for import')
      }
      return
    }

    const first = BigInt(blocks[0].header.number)
    const last = BigInt(blocks[blocks.length - 1].header.number)
    const hash = short(blocks[0].hash())
    const baseFeeAdd =
      this.config.chainCommon.gteHardfork(Hardfork.London) === true
        ? `baseFee=${blocks[0].header.baseFeePerGas} `
        : ''

    let attentionHF: string | null = null
    const nextHFBlockNum = this.config.chainCommon.nextHardforkBlockOrTimestamp()
    if (nextHFBlockNum !== null) {
      const remaining = nextHFBlockNum - last
      if (remaining <= BigInt(10000)) {
        const nextHF = this.config.chainCommon.getHardforkByBlockNumber(nextHFBlockNum)
        attentionHF = `${nextHF} HF in ${remaining} blocks`
      }
    } else {
      if (
        this.config.chainCommon.hardfork() === Hardfork.MergeForkIdTransition &&
        this.config.chainCommon.gteHardfork(Hardfork.Paris) === false
      ) {
        const mergeTTD = this.config.chainCommon.hardforkTTD(Hardfork.Paris)!
        const td = this.chain.blocks.td
        const remaining = mergeTTD - td
        if (remaining <= mergeTTD / BigInt(10)) {
          attentionHF = `Paris (Merge) HF in ${remaining} TD`
        }
      }
    }

    this.config.logger.info(
      `Imported blocks count=${
        blocks.length
      } first=${first} last=${last} hash=${hash} ${baseFeeAdd}hardfork=${this.config.chainCommon.hardfork()} peers=${
        this.pool.size
      }`,
      { attentionHF }
    )

    this.txPool.removeNewBlockTxs(blocks)

    if (!this.running) return
    this.txPool.checkRunState()
    return true
  }

  /**
   * Add newly broadcasted blocks to peer record
   * @param blockHash hash of block received in NEW_BLOCK message
   * @param peer
   * @returns true if block has already been sent to peer
   */
  private addToKnownByPeer(blockHash: Uint8Array, peer: Peer): boolean {
    const knownBlocks = this.newBlocksKnownByPeer.get(peer.id) ?? []
    if (knownBlocks.find((knownBlock) => equalsBytes(knownBlock.hash, blockHash))) {
      return true
    }
    knownBlocks.push({ hash: blockHash, added: Date.now() })
    this.newBlocksKnownByPeer.set(peer.id, knownBlocks)
    return false
  }

  /**
   * Send (broadcast) a new block to connected peers.
   * @param Block
   * @param peers
   */
  async sendNewBlock(block: Block, peers: Peer[]) {
    for (const peer of peers) {
      const alreadyKnownByPeer = this.addToKnownByPeer(block.hash(), peer)
      if (!alreadyKnownByPeer) {
        peer.eth?.send('NewBlock', [block, this.chain.blocks.td])
      }
    }
  }

  /**
   * Handles `NEW_BLOCK` announcement from a peer and inserts into local chain if child of chain tip
   * @param blockData `NEW_BLOCK` received from peer
   * @param peer `Peer` that sent `NEW_BLOCK` announcement
   */
  async handleNewBlock(block: Block, peer?: Peer) {
    if (peer) {
      // Don't send NEW_BLOCK announcement to peer that sent original new block message
      this.addToKnownByPeer(block.hash(), peer)
    }
    if (block.header.number > this.chain.headers.height + BigInt(1)) {
      // If the block number exceeds one past our height we cannot validate it
      return
    }
    try {
      await this.chain.blockchain.validateHeader(block.header)
    } catch (err) {
      this.config.logger.debug(
        `Error processing new block from peer ${
          peer ? `id=${peer.id.slice(0, 8)}` : '(no peer)'
        } hash=${short(block.hash())}`
      )
      this.config.logger.debug(err)
      return
    }
    // Send NEW_BLOCK to square root of total number of peers in pool
    // https://github.com/ethereum/devp2p/blob/master/caps/eth.md#block-propagation
    const numPeersToShareWith = Math.floor(Math.sqrt(this.pool.peers.length))
    await this.sendNewBlock(block, this.pool.peers.slice(0, numPeersToShareWith))
    const latestBlockHash = this.chain.blocks.latest?.hash()
    if (
      latestBlockHash !== undefined &&
      equalsBytes(latestBlockHash, block.header.parentHash) === true
    ) {
      // If new block is child of current chain tip, insert new block into chain
      await this.chain.putBlocks([block])
      // Check if new sync target height can be set
      const blockNumber = block.header.number
      if (
        this.config.syncTargetHeight === undefined ||
        this.config.syncTargetHeight === BigInt(0) ||
        blockNumber > this.config.syncTargetHeight
      ) {
        this.config.syncTargetHeight = blockNumber
      }
    } else {
      // Call handleNewBlockHashes to retrieve all blocks between chain tip and new block
      this.handleNewBlockHashes([[block.hash(), block.header.number]])
    }
    for (const peer of this.pool.peers.slice(numPeersToShareWith)) {
      // Send `NEW_BLOCK_HASHES` message for received block to all other peers
      const alreadyKnownByPeer = this.addToKnownByPeer(block.hash(), peer)
      if (!alreadyKnownByPeer) {
        peer.eth?.send('NewBlockHashes', [[block.hash(), block.header.number]])
      }
    }
  }

  /**
   * Chain was updated, new block hashes received
   * @param data new block hash announcements
   */
  handleNewBlockHashes(data: [Uint8Array, bigint][]) {
    if (!data.length || !this.fetcher || this.fetcher.syncErrored) return
    let min = BigInt(-1)
    let newSyncHeight: [Uint8Array, bigint] | undefined
    const blockNumberList: bigint[] = []
    for (const value of data) {
      const blockNumber = value[1]
      blockNumberList.push(blockNumber)
      if (min === BigInt(-1) || blockNumber < min) {
        min = blockNumber
      }
      // Check if new sync target height can be set
      if (newSyncHeight && blockNumber <= newSyncHeight[1]) continue
      if (
        typeof this.config.syncTargetHeight === 'bigint' &&
        this.config.syncTargetHeight !== BigInt(0) &&
        blockNumber <= this.config.syncTargetHeight
      )
        continue
      newSyncHeight = value
    }

    if (!newSyncHeight) return
    const [hash, height] = newSyncHeight
    this.config.syncTargetHeight = height
    this.config.logger.info(`New sync target height=${height} hash=${short(hash)}`)
    // Enqueue if we are close enough to chain head
    if (min < this.chain.headers.height + BigInt(3000)) {
      this.fetcher.enqueueByNumberList(blockNumberList, min, height)
    }
  }

  /**
   * Runs vm execution on {@link Event.CHAIN_UPDATED}
   */
  async runExecution(): Promise<void> {
    // Batch the execution if we are not close to the head
    const shouldRunOnlyBatched =
      typeof this.config.syncTargetHeight === 'bigint' &&
      this.config.syncTargetHeight !== BigInt(0) &&
      this.chain.blocks.height <= this.config.syncTargetHeight - BigInt(50)
    this.execution.run(true, shouldRunOnlyBatched).catch((e) => {
      this.config.logger.error(`Full sync execution trigger errored`, {}, e)
    })
  }

  async stop(): Promise<boolean> {
    this.config.events.removeListener(Event.SYNC_FETCHED_BLOCKS, this.processBlocks)
    this.config.events.removeListener(Event.SYNC_EXECUTION_VM_ERROR, this.stop)
    if (this.config.execution) {
      this.config.events.removeListener(Event.CHAIN_UPDATED, this.runExecution)
    }
    return super.stop()
  }

  /**
   * Close synchronizer.
   */
  async close() {
    if (!this.opened) return
    await super.close()
  }
}
