import { Hardfork } from '@ethereumjs/common'
import { BN } from 'ethereumjs-util'
import { Peer } from '../net/peer/peer'
import { short } from '../util'
import { Event } from '../types'
import { Synchronizer, SynchronizerOptions } from './sync'
import { BlockFetcher } from './fetcher'
import { VMExecution } from '../execution'
import { TxPool } from './txpool'
import type { Block, BlockHeader } from '@ethereumjs/block'

interface HandledObject {
  hash: Buffer
  added: number
}

type PeerId = string
/**
 * Implements an ethereum full sync synchronizer
 * @memberof module:sync
 */
export class FullSynchronizer extends Synchronizer {
  public txPool: TxPool

  private newBlocksKnownByPeer: Map<PeerId, HandledObject[]>

  constructor(options: SynchronizerOptions) {
    super(options)

    this.newBlocksKnownByPeer = new Map()
    this.txPool = new TxPool({
      config: this.config,
      getPeerCount: () => this.pool.peers.length,
    })

    this.config.events.on(Event.SYNC_EXECUTION_VM_ERROR, async () => {
      await this.stop()
    })

    void this.chain.update()
  }

  /**
   * Returns synchronizer type
   */
  get type() {
    return 'full'
  }

  /**
   * Open synchronizer. Must be called before sync() is called
   */
  async open(): Promise<void> {
    await super.open()
    await this.chain.open()
    this.txPool.open()
    await this.pool.open()
    const { height: number, td } = this.chain.blocks
    const hash = this.chain.blocks.latest!.hash()
    this.startingBlock = number
    this.config.chainCommon.setHardforkByBlockNumber(number, td)
    this.config.logger.info(
      `Latest local block: number=${number} td=${td} hash=${short(
        hash
      )} hardfork=${this.config.chainCommon.hardfork()}`
    )
    if (this.config.mine) {
      // Start the TxPool immediately if mining
      this.txPool.start()
    }
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
  best(): Peer | undefined {
    let best
    const peers = this.pool.peers.filter(this.syncable.bind(this))
    if (peers.length < this.config.minPeers && !this.forceSync) return
    for (const peer of peers) {
      if (peer.eth?.status) {
        const td = peer.eth.status.td
        if (
          (!best && td.gte(this.chain.blocks.td)) ||
          (best && best.eth && best.eth.status.td.lt(td))
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
    if (!this.syncTargetHeight || this.txPool.running) {
      return
    }
    // If height gte target, we are close enough to the
    // head of the chain that the tx pool can be started
    const target = this.syncTargetHeight.subn(this.txPool.BLOCKS_BEFORE_TARGET_HEIGHT_ACTIVATION)
    if (this.chain.headers.height.gte(target)) {
      this.txPool.start()
    }
  }

  /**
   * Sync all blocks and state from peer starting from current height.
   * @param peer remote peer to sync with
   * @return Resolves when sync completed
   */
  async syncWithPeer(peer?: Peer): Promise<boolean> {
    // eslint-disable-next-line no-async-promise-executor
    return await new Promise(async (resolve, reject) => {
      if (!peer) return resolve(false)
      const latest = await this.latest(peer)
      if (!latest) return resolve(false)

      const height = latest.number
      if (!this.syncTargetHeight || this.syncTargetHeight.lt(latest.number)) {
        this.syncTargetHeight = height
        this.config.logger.info(`New sync target height=${height} hash=${short(latest.hash())}`)
      }

      // Start fetcher from a safe distance behind because if the previous fetcher exited
      // due to a reorg, it would make sense to step back and refetch.
      const first = BN.max(
        this.chain.blocks.height.addn(1).subn(this.config.safeReorgDistance),
        new BN(1)
      )
      const count = height.sub(first).addn(1)

      if (count.lten(0)) return resolve(false)
      const resolveSync = () => {
        resolve(true)
      }
      this.config.events.on(Event.SYNC_SYNCHRONIZED, resolveSync)
      this.config.logger.debug(`Syncing with peer: ${peer.toString(true)} height=${height}`)

      this.clearFetcher()
      this.fetcher = new BlockFetcher({
        config: this.config,
        pool: this.pool,
        chain: this.chain,
        interval: this.interval,
        first,
        count,
        destroyWhenDone: false,
      })
      try {
        if (this.fetcher) {
          await this.fetcher.fetch()
        }
        resolve(true)
      } catch (error: any) {
        // Since the fetcher has errored, likely because of bad data fed by the peer,
        // the peer should be banned for at least a couple of seconds (default: 60s)
        // to refresh its status to find the next best peer to start a new fetcher.
        this.pool.ban(peer)
        this.config.logger.debug(
          `Fetcher error, temporarily banning ${peer.toString(true)}: ${error}`
        )
        reject(error)
      } finally {
        this.config.events.removeListener(Event.SYNC_SYNCHRONIZED, resolveSync)
        this.clearFetcher()
      }
    })
  }

  async processBlocks(execution: VMExecution, blocks: Block[] | BlockHeader[]) {
    if (this.config.chainCommon.gteHardfork(Hardfork.Merge)) {
      if (this.fetcher !== null) {
        // If we are beyond the merge block we should stop the fetcher
        this.config.logger.info('Merge hardfork reached, stopping block fetcher')
        this.clearFetcher()
      }
    }

    if (blocks.length === 0) {
      if (this.fetcher !== null) {
        this.config.logger.warn('No blocks fetched are applicable for import')
      }
      return
    }

    blocks = blocks as Block[]
    const first = blocks[0].header.number
    const last = blocks[blocks.length - 1].header.number
    const hash = short(blocks[0].hash())
    const baseFeeAdd = this.config.chainCommon.gteHardfork(Hardfork.London)
      ? `baseFee=${blocks[0].header.baseFeePerGas} `
      : ''

    let attentionHF: string | null = null
    const nextHFBlockNum = this.config.chainCommon.nextHardforkBlockBN()
    if (nextHFBlockNum !== null) {
      const remaining = nextHFBlockNum.sub(last)
      if (remaining.lten(10000)) {
        const nextHF = this.config.chainCommon.getHardforkByBlockNumber(nextHFBlockNum)
        attentionHF = `${nextHF} HF in ${remaining} blocks`
      }
    } else {
      if (this.config.chainCommon.hardfork() === Hardfork.PreMerge) {
        const mergeTD = this.config.chainCommon.hardforkTD(Hardfork.Merge)!
        const td = this.chain.blocks.td
        const remaining = mergeTD.sub(td)
        if (remaining.lte(mergeTD.divn(10))) {
          attentionHF = `Merge HF in ${remaining} TD`
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
    await execution.run()
    this.checkTxPoolState()
  }

  private clearFetcher() {
    if (this.fetcher) {
      this.fetcher.clear()
      this.fetcher.destroy()
      this.fetcher = null
    }
  }

  /**
   * Add newly broadcasted blocks to peer record
   * @param blockHash hash of block received in NEW_BLOCK message
   * @param peer
   * @returns true if block has already been sent to peer
   */
  private addToKnownByPeer(blockHash: Buffer, peer: Peer): boolean {
    const knownBlocks = this.newBlocksKnownByPeer.get(peer.id) ?? []
    if (knownBlocks.find((knownBlock) => knownBlock.hash.equals(blockHash))) {
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
    if (block.header.number.gt(this.chain.headers.height.addn(1))) {
      // If the block number exceeds one past our height we cannot validate it
      return
    }
    try {
      await block.header.validate(this.chain.blockchain)
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
    if (this.chain.blocks.latest?.hash().equals(block.header.parentHash)) {
      // If new block is child of current chain tip, insert new block into chain
      await this.chain.putBlocks([block])
      // Check if new sync target height can be set
      const blockNumber = block.header.number
      if (!this.syncTargetHeight || blockNumber.gt(this.syncTargetHeight)) {
        this.syncTargetHeight = blockNumber
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
  handleNewBlockHashes(data: [Buffer, BN][]) {
    if (!data.length || !this.fetcher) return
    let min = new BN(-1)
    let newSyncHeight
    const blockNumberList: BN[] = []
    data.forEach((value) => {
      const blockNumber = value[1]
      blockNumberList.push(blockNumber)
      if (min.eqn(-1) || blockNumber.lt(min)) {
        min = blockNumber
      }

      // Check if new sync target height can be set
      if (!this.syncTargetHeight || blockNumber.gt(this.syncTargetHeight)) {
        newSyncHeight = blockNumber
      }
    })

    if (!newSyncHeight) return
    this.syncTargetHeight = newSyncHeight
    const [hash, height] = data[data.length - 1]
    this.config.logger.info(`New sync target height number=${height} hash=${short(hash)}`)
    // enqueue if we are close enough to chain head
    if (min.lt(this.chain.headers.height.addn(3000))) {
      this.fetcher.enqueueByNumberList(blockNumberList, min)
    }
  }

  /**
   * Stop synchronization. Returns a promise that resolves once its stopped.
   */
  async stop(): Promise<boolean> {
    this.txPool.stop()

    if (!this.running) {
      return false
    }

    if (this.fetcher) {
      this.fetcher.destroy()
      this.fetcher = null
    }
    await super.stop()

    return true
  }

  /**
   * Close synchronizer.
   */
  async close() {
    if (this.opened) {
      this.txPool.close()
    }
    await super.close()
  }
}
