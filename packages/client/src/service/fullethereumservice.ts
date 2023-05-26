import { Hardfork } from '@ethereumjs/common'
import { encodeReceipt } from '@ethereumjs/vm'
import { concatBytes } from 'ethereum-cryptography/utils'

import { SyncMode } from '../config'
import { VMExecution } from '../execution'
import { Miner } from '../miner'
import { EthProtocol } from '../net/protocol/ethprotocol'
import { LesProtocol } from '../net/protocol/lesprotocol'
import { SnapProtocol } from '../net/protocol/snapprotocol'
import { BeaconSynchronizer, FullSynchronizer, SnapSynchronizer } from '../sync'
import { Skeleton } from '../sync/skeleton'

import { EthereumService } from './ethereumservice'
import { TxPool } from './txpool'

import type { Peer } from '../net/peer/peer'
import type { Protocol } from '../net/protocol'
import type { EthereumServiceOptions } from './ethereumservice'
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
  public synchronizer?: BeaconSynchronizer | FullSynchronizer | SnapSynchronizer
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

    // This flag is just to run and test snap sync, when fully ready, this needs to
    // be replaced by a more sophisticated condition based on how far back we are
    // from the head, and how to run it in conjunction with the beacon sync
    if (this.config.forceSnapSync) {
      this.synchronizer = new SnapSynchronizer({
        config: this.config,
        pool: this.pool,
        chain: this.chain,
        interval: this.interval,
      })
    } else {
      if (this.config.chainCommon.gteHardfork(Hardfork.Paris) === true) {
        if (!this.config.disableBeaconSync) {
          void this.switchToBeaconSync()
        }
        this.config.logger.info(`Post-merge 🐼 client mode: run with CL client.`)
      } else {
        if (this.config.syncmode === SyncMode.Full) {
          this.synchronizer = new FullSynchronizer({
            config: this.config,
            pool: this.pool,
            chain: this.chain,
            txPool: this.txPool,
            execution: this.execution,
            interval: this.interval,
          })
        }
      }
    }

    if (this.config.mine) {
      this.miner = new Miner({
        config: this.config,
        service: this,
      })
    }
  }

  /**
   * Public accessor for {@link BeaconSynchronizer}. Returns undefined if unavailable.
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
  }

  async open() {
    if (this.synchronizer !== undefined) {
      this.config.logger.info(
        `Preparing for sync using FullEthereumService with ${
          this.synchronizer instanceof BeaconSynchronizer
            ? 'BeaconSynchronizer'
            : 'FullSynchronizer'
        }.`
      )
    } else {
      this.config.logger.info('Starting FullEthereumService with no syncing.')
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
    await this.execution.start()
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
    await this.synchronizer?.stop()
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
      new SnapProtocol({
        config: this.config,
        chain: this.chain,
        timeout: this.timeout,
        convertSlimBody: true,
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
    switch (message.name) {
      case 'GetBlockHeaders': {
        const { reqId, block, max, skip, reverse } = message.data
        if (typeof block === 'bigint') {
          if (
            (reverse === true && block > this.chain.headers.height) ||
            (reverse !== true && block + BigInt(max * skip) > this.chain.headers.height)
          ) {
            // Respond with an empty list in case the header is higher than the current height
            // This is to ensure Geth does not disconnect with "useless peer"
            // TODO: in batch queries filter out the headers we do not have and do not send
            // the empty list in case one or more headers are not available
            peer.eth!.send('BlockHeaders', { reqId, headers: [] })
            return
          }
        }
        const headers = await this.chain.getHeaders(block, max, skip, reverse)
        peer.eth!.send('BlockHeaders', { reqId, headers })
        break
      }

      case 'GetBlockBodies': {
        const { reqId, hashes } = message.data
        const blocks: Block[] = await Promise.all(
          hashes.map((hash: Uint8Array) => this.chain.getBlock(hash))
        )
        const bodies = blocks.map((block) => block.raw().slice(1))
        peer.eth!.send('BlockBodies', { reqId, bodies })
        break
      }
      case 'NewBlockHashes': {
        if (this.config.chainCommon.gteHardfork(Hardfork.Paris) === true) {
          this.config.logger.debug(
            `Dropping peer ${peer.id} for sending NewBlockHashes after merge (EIP-3675)`
          )
          this.pool.ban(peer, 9000000)
        } else if (this.synchronizer instanceof FullSynchronizer) {
          this.synchronizer.handleNewBlockHashes(message.data)
        }
        break
      }
      case 'Transactions': {
        await this.txPool.handleAnnouncedTxs(message.data, peer, this.pool)
        break
      }
      case 'NewBlock': {
        if (this.config.chainCommon.gteHardfork(Hardfork.Paris) === true) {
          this.config.logger.debug(
            `Dropping peer ${peer.id} for sending NewBlock after merge (EIP-3675)`
          )
          this.pool.ban(peer, 9000000)
        } else if (this.synchronizer instanceof FullSynchronizer) {
          await this.synchronizer.handleNewBlock(message.data[0], peer)
        }
        break
      }
      case 'NewPooledTransactionHashes': {
        await this.txPool.handleAnnouncedTxHashes(message.data, peer, this.pool)
        break
      }
      case 'GetPooledTransactions': {
        const { reqId, hashes } = message.data
        const txs = this.txPool.getByHash(hashes)
        // Always respond, also on an empty list
        peer.eth?.send('PooledTransactions', { reqId, txs })
        break
      }
      case 'GetReceipts': {
        const [reqId, hashes] = message.data
        const { receiptsManager } = this.execution
        if (!receiptsManager) return
        const receipts = []
        let receiptsSize = 0
        for (const hash of hashes) {
          const blockReceipts = await receiptsManager.getReceipts(hash, true, true)
          if (blockReceipts === undefined) continue
          receipts.push(...blockReceipts)
          const receiptsBytes = concatBytes(...receipts.map((r) => encodeReceipt(r, r.txType)))
          receiptsSize += receiptsBytes.byteLength
          // From spec: The recommended soft limit for Receipts responses is 2 MiB.
          if (receiptsSize >= 2097152) {
            break
          }
        }
        peer.eth?.send('Receipts', { reqId, receipts })
        break
      }
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
        if (typeof block === 'bigint') {
          if (
            (reverse === true && block > this.chain.headers.height) ||
            (reverse !== true && block + BigInt(max * skip) > this.chain.headers.height)
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
