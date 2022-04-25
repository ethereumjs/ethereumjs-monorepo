import { Hardfork } from '@ethereumjs/common'
import { BN } from 'ethereumjs-util'
import { Skeleton } from '../sync/skeleton'
import { EthereumService, EthereumServiceOptions } from './ethereumservice'
import { TxPool } from './txpool'
import { BeaconSynchronizer, FullSynchronizer } from '../sync'
import { EthProtocol } from '../net/protocol/ethprotocol'
import { LesProtocol } from '../net/protocol/lesprotocol'
import { Peer } from '../net/peer/peer'
import { Protocol } from '../net/protocol'
import { Miner } from '../miner'
import { VMExecution } from '../execution'

import type { Block } from '@ethereumjs/block'

interface FullEthereumServiceOptions extends EthereumServiceOptions {
  /** Serve LES requests (default: false) */
  lightserv?: boolean
}

/**
 * Full Ethereum service
 * @memberof module:service
 */
export class FullEthereumService extends EthereumService {
  public synchronizer!: BeaconSynchronizer | FullSynchronizer
  public lightserv: boolean
  public miner: Miner | undefined
  public execution: VMExecution
  public txPool: TxPool

  /**
   * Create new ETH service
   */
  constructor(options: FullEthereumServiceOptions) {
    super(options)

    this.lightserv = options.lightserv ?? false

    this.config.logger.info('Full sync mode')

    this.execution = new VMExecution({
      config: options.config,
      stateDB: options.stateDB,
      metaDB: options.metaDB,
      chain: this.chain,
    })

    this.txPool = new TxPool({
      config: this.config,
      service: this,
    })

    if (this.config.chainCommon.gteHardfork(Hardfork.Merge) && !this.config.disableBeaconSync) {
      void this.switchToBeaconSync()
    } else {
      this.synchronizer = new FullSynchronizer({
        config: this.config,
        pool: this.pool,
        chain: this.chain,
        txPool: this.txPool,
        execution: this.execution,
        interval: this.interval,
      })
    }

    if (this.config.mine) {
      this.miner = new Miner({
        config: this.config,
        service: this,
      })
    }
  }

  /**
   * Public accessor for {@link BeaconSynchronizer}
   */
  get beaconSync() {
    if (this.synchronizer instanceof BeaconSynchronizer) {
      return this.synchronizer
    }
    return undefined
  }

  /**
   * Helper to switch to {@link BeaconSynchronizer}
   */
  async switchToBeaconSync() {
    if (this.synchronizer instanceof FullSynchronizer) {
      await this.synchronizer.stop()
      await this.synchronizer.close()
      this.miner?.stop()
      this.config.logger.info(`Transitioning to beacon sync`)
    }
    const skeleton = new Skeleton({
      config: this.config,
      chain: this.chain,
      metaDB: (this.execution as any).metaDB,
    })
    this.synchronizer = new BeaconSynchronizer({
      config: this.config,
      pool: this.pool,
      chain: this.chain,
      interval: this.interval,
      execution: this.execution,
      skeleton,
    })
    await this.synchronizer.open()
    await this.synchronizer.start()
  }

  async open() {
    if (this.synchronizer instanceof FullSynchronizer) {
      this.config.logger.info('Opening FullEthereumService with FullSynchronizer')
    } else {
      this.config.logger.info('Opening FullEthereumService with BeaconSynchronizer')
    }
    await super.open()
    await this.execution.open()
    this.txPool.open()
    if (this.config.mine) {
      // Start the TxPool immediately if mining
      this.txPool.start()
    }
    return true
  }

  /**
   * Start service
   */
  async start(): Promise<boolean> {
    if (this.running) {
      return false
    }
    await super.start()
    this.miner?.start()
    return true
  }

  /**
   * Stop service
   */
  async stop(): Promise<boolean> {
    if (!this.running) {
      return false
    }
    this.txPool.stop()
    this.miner?.stop()
    await this.execution.stop()
    await super.stop()
    return true
  }

  /**
   * Close service
   */
  async close() {
    if (!this.opened) return
    this.txPool.close()
    await super.close()
  }

  /**
   * Returns all protocols required by this service
   */
  get protocols(): Protocol[] {
    const protocols: Protocol[] = [
      new EthProtocol({
        config: this.config,
        chain: this.chain,
        timeout: this.timeout,
      }),
    ]
    if (this.config.lightserv) {
      protocols.push(
        new LesProtocol({
          config: this.config,
          chain: this.chain,
          flow: this.flow,
          timeout: this.timeout,
        })
      )
    }
    return protocols
  }

  /**
   * Handles incoming message from connected peer
   * @param message message object
   * @param protocol protocol name
   * @param peer peer
   */
  async handle(message: any, protocol: string, peer: Peer): Promise<any> {
    if (protocol === 'eth') {
      return this.handleEth(message, peer)
    } else {
      return this.handleLes(message, peer)
    }
  }

  /**
   * Handles incoming ETH message from connected peer
   * @param message message object
   * @param peer peer
   */
  async handleEth(message: any, peer: Peer): Promise<void> {
    if (message.name === 'GetBlockHeaders') {
      const { reqId, block, max, skip, reverse } = message.data
      if (BN.isBN(block)) {
        if (
          (reverse && block.gt(this.chain.headers.height)) ||
          (!reverse && block.addn(max * skip).gt(this.chain.headers.height))
        ) {
          // Don't respond to requests greater than the current height
          return
        }
      }
      let headers = await this.chain.getHeaders(block, max, skip, reverse)
      headers = headers.filter((h) => !h._common.gteHardfork(Hardfork.Merge))
      peer.eth!.send('BlockHeaders', { reqId, headers })
    } else if (message.name === 'GetBlockBodies') {
      const { reqId, hashes } = message.data
      const blocks: Block[] = await Promise.all(
        hashes.map((hash: Buffer) => this.chain.getBlock(hash))
      )
      const bodies = blocks.map((block) => block.raw().slice(1))
      peer.eth!.send('BlockBodies', { reqId, bodies })
    } else if (message.name === 'NewBlockHashes') {
      if (this.config.chainCommon.gteHardfork(Hardfork.Merge)) {
        this.config.logger.debug(
          `Dropping peer ${peer.id} for sending NewBlockHashes after merge (EIP-3675)`
        )
        this.pool.ban(peer, 9000000)
      } else {
        if (this.synchronizer instanceof FullSynchronizer) {
          this.synchronizer.handleNewBlockHashes(message.data)
        }
      }
    } else if (message.name === 'Transactions') {
      await this.txPool.handleAnnouncedTxs(message.data, peer, this.pool)
    } else if (message.name === 'NewBlock') {
      if (this.config.chainCommon.gteHardfork(Hardfork.Merge)) {
        this.config.logger.debug(
          `Dropping peer ${peer.id} for sending NewBlock after merge (EIP-3675)`
        )
        this.pool.ban(peer, 9000000)
      } else {
        if (this.synchronizer instanceof FullSynchronizer) {
          await this.synchronizer.handleNewBlock(message.data[0], peer)
        }
      }
    } else if (message.name === 'NewPooledTransactionHashes') {
      await this.txPool.handleAnnouncedTxHashes(message.data, peer, this.pool)
    } else if (message.name === 'GetPooledTransactions') {
      const { reqId, hashes } = message.data
      const txs = this.txPool.getByHash(hashes)
      // Always respond, also on an empty list
      peer.eth?.send('PooledTransactions', { reqId, txs })
    } else if (message.name === 'GetReceipts') {
      const [reqId, hashes] = message.data
      const { receiptsManager } = this.execution
      if (!receiptsManager) return
      const receipts = []
      let receiptsSize = 0
      for (const hash of hashes) {
        const blockReceipts = await receiptsManager.getReceipts(hash, true, true)
        if (!blockReceipts) continue
        receipts.push(...blockReceipts)
        receiptsSize += Buffer.byteLength(JSON.stringify(blockReceipts))
        // From spec: The recommended soft limit for Receipts responses is 2 MiB.
        if (receiptsSize >= 2097152) {
          break
        }
      }
      peer.eth?.send('Receipts', { reqId, receipts })
    }
  }

  /**
   * Handles incoming LES message from connected peer
   * @param message message object
   * @param peer peer
   */
  async handleLes(message: any, peer: Peer): Promise<void> {
    if (message.name === 'GetBlockHeaders' && this.config.lightserv) {
      const { reqId, block, max, skip, reverse } = message.data
      const bv = this.flow.handleRequest(peer, message.name, max)
      if (bv < 0) {
        this.pool.ban(peer, 300000)
        this.config.logger.debug(`Dropping peer for violating flow control ${peer}`)
      } else {
        if (BN.isBN(block)) {
          if (
            (reverse && block.gt(this.chain.headers.height)) ||
            (!reverse && block.addn(max * skip).gt(this.chain.headers.height))
          ) {
            // Don't respond to requests greater than the current height
            return
          }
        }
        const headers = await this.chain.getHeaders(block, max, skip, reverse)
        peer.les!.send('BlockHeaders', { reqId, bv, headers })
      }
    }
  }
}
