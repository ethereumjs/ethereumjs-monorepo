import { Hardfork } from '@ethereumjs/common'
import { TransactionType } from '@ethereumjs/tx'
import { concatBytes, hexToBytes } from '@ethereumjs/util'
import { encodeReceipt } from '@ethereumjs/vm'

import { SyncMode } from '../config'
import { VMExecution } from '../execution'
import { Miner } from '../miner'
import { EthProtocol } from '../net/protocol/ethprotocol'
import { LesProtocol } from '../net/protocol/lesprotocol'
import { SnapProtocol } from '../net/protocol/snapprotocol'
import { BeaconSynchronizer, FullSynchronizer, SnapSynchronizer } from '../sync'
import { Event } from '../types'

import { Service, type ServiceOptions } from './service'
import { Skeleton } from './skeleton'
import { TxPool } from './txpool'

import type { Peer } from '../net/peer/peer'
import type { Protocol } from '../net/protocol'
import type { Block } from '@ethereumjs/block'
import type { BlobEIP4844Transaction } from '@ethereumjs/tx'

interface FullEthereumServiceOptions extends ServiceOptions {
  /** Serve LES requests (default: false) */
  lightserv?: boolean
}

/**
 * Full Ethereum service
 * @memberof module:service
 */
export class FullEthereumService extends Service {
  /* synchronizer for syncing the chain */
  public synchronizer?: BeaconSynchronizer | FullSynchronizer
  public lightserv: boolean
  public miner: Miner | undefined
  public txPool: TxPool
  public skeleton?: Skeleton

  // objects dealing with state
  public snapsync?: SnapSynchronizer
  public execution: VMExecution

  /** building head state via snapsync or vmexecution */
  private building = false

  /**
   * Create new ETH service
   */
  constructor(options: FullEthereumServiceOptions) {
    super(options)

    this.lightserv = options.lightserv ?? false

    this.config.logger.info('Full sync mode')

    const { metaDB } = options
    if (metaDB !== undefined) {
      this.skeleton = new Skeleton({
        config: this.config,
        chain: this.chain,
        metaDB,
      })
    }

    this.execution = new VMExecution({
      config: options.config,
      stateDB: options.stateDB,
      metaDB,
      chain: this.chain,
    })

    this.snapsync = this.config.enableSnapSync
      ? new SnapSynchronizer({
          config: this.config,
          pool: this.pool,
          chain: this.chain,
          interval: this.interval,
          skeleton: this.skeleton,
          execution: this.execution,
        })
      : undefined

    this.txPool = new TxPool({
      config: this.config,
      service: this,
    })

    if (this.config.syncmode === SyncMode.Full) {
      if (this.config.chainCommon.gteHardfork(Hardfork.Paris) === true) {
        // skip opening the beacon synchronizer before everything else (chain, execution etc)
        // as it resets and messes up the entire chain
        //
        // also with skipOpen this call is a sync call as no async operation is executed
        // as good as creating the synchronizer here
        void this.switchToBeaconSync(true)
        this.config.logger.info(`Post-merge 🐼 client mode: run with CL client.`)
      } else {
        this.synchronizer = new FullSynchronizer({
          config: this.config,
          pool: this.pool,
          chain: this.chain,
          txPool: this.txPool,
          execution: this.execution,
          interval: this.interval,
        })

        if (this.config.mine) {
          this.miner = new Miner({
            config: this.config,
            service: this,
          })
        }
      }
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
  async switchToBeaconSync(skipOpen: boolean = false) {
    if (this.synchronizer instanceof FullSynchronizer) {
      await this.synchronizer.stop()
      await this.synchronizer.close()
      this.miner?.stop()
      this.config.superMsg(`Transitioning to beacon sync`)
    }

    if (this.config.syncmode !== SyncMode.None && this.beaconSync === undefined) {
      this.synchronizer = new BeaconSynchronizer({
        config: this.config,
        pool: this.pool,
        chain: this.chain,
        interval: this.interval,
        execution: this.execution,
        skeleton: this.skeleton!,
      })
      if (!skipOpen) {
        await this.synchronizer.open()
      }
    }
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
    // Broadcast pending txs to newly connected peer
    this.config.events.on(Event.POOL_PEER_ADDED, (peer) => {
      // TODO: Should we do this if the txPool isn't started?
      const txs: [number[], number[], Uint8Array[]] = [[], [], []]
      for (const addr of this.txPool.pool) {
        for (const tx of addr[1]) {
          const rawTx = tx.tx
          txs[0].push(rawTx.type)
          if (rawTx.type !== TransactionType.BlobEIP4844) {
            txs[1].push(rawTx.serialize().byteLength)
          } else {
            txs[1].push((rawTx as BlobEIP4844Transaction).serializeNetworkWrapper().byteLength)
          }
          txs[2].push(hexToBytes('0x' + tx.hash))
        }
      }
      if (txs[0].length > 0) this.txPool.sendNewTxHashes(txs, [peer])
    })

    // skeleton needs to be opened before synchronizers are opened
    // but after chain is opened, which skeleton.open() does internally
    await this.skeleton?.open()
    await super.open()

    // open snapsync instead of execution if instantiated
    // it will open execution when done (or if doesn't need to snap sync)
    if (this.snapsync !== undefined) {
      // set up execution vm to avoid undefined error in syncWithPeer when vm is being passed to accountfetcher
      if (this.execution.config.execCommon.gteHardfork(Hardfork.Prague)) {
        if (!this.execution.config.statelessVerkle) {
          throw Error(`Currently stateful verkle execution not supported`)
        }
        this.execution.config.logger.info(
          `Skipping VM verkle statemanager genesis hardfork=${this.execution.hardfork}`
        )
        await this.execution.setupVerkleVM()
        this.execution.vm = this.execution.verkleVM!
      } else {
        this.execution.config.logger.info(
          `Initializing VM merkle statemanager genesis hardfork=${this.execution.hardfork}`
        )
        await this.execution.setupMerkleVM()
        this.execution.vm = this.execution.merkleVM!
      }

      await this.snapsync.open()
    } else {
      await this.execution.open()
    }

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
    if (this.snapsync === undefined) {
      await this.execution.start()
    }
    void this.buildHeadState()
    return true
  }

  /**
   * if the vm head is not recent enough, trigger building a recent state by snapsync or by running
   * vm execution
   */
  async buildHeadState(): Promise<void> {
    if (this.building) return
    this.building = true

    try {
      if (this.execution.started && this.synchronizer !== undefined) {
        await this.synchronizer.runExecution()
      } else if (this.snapsync !== undefined) {
        if (this.config.synchronized === true || this.skeleton?.synchronized === true) {
          const syncResult = await this.snapsync.checkAndSync()
          if (syncResult !== null) {
            const transition = await this.skeleton?.setVmHead(syncResult)
            if (transition === true) {
              this.config.superMsg('Snapsync completed, transitioning to VMExecution')
              await this.execution.open()
              await this.execution.start()
            }
          }
        } else {
          this.config.logger.debug(
            `skipping snapsync since cl (skeleton) synchronized=${this.skeleton?.synchronized}`
          )
        }
      } else {
        this.config.logger.warn(
          'skipping building head state as neither execution is started nor snapsync is available'
        )
      }
    } catch (error) {
      this.config.logger.error(`Error building headstate error=${error}`)
    } finally {
      this.building = false
    }
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

    await this.snapsync?.stop()
    // independently close execution even if it might have been opened by snapsync
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
        let hashes = []
        if (peer.eth!['versions'].includes(68)) {
          // eth/68 message data format - [tx_types: number[], tx_sizes: number[], tx_hashes: uint8array[]]
          // With eth/68, we can check transaction types and transaction sizes to
          // decide whether or not to download the transactions announced by this message.  This
          // can be used to prevent mempool spamming or decide whether or not to filter out certain
          // transactions - though this is not prescribed in eth/68 (EIP 5793)
          // https://eips.ethereum.org/EIPS/eip-5793
          hashes = message.data[2] as Uint8Array[]
        } else {
          hashes = message.data
        }
        await this.txPool.handleAnnouncedTxHashes(hashes, peer, this.pool)
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
