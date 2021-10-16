import { Hardfork } from '@ethereumjs/common'
import { BN } from 'ethereumjs-util'
import { EthereumService, EthereumServiceOptions } from './ethereumservice'
import { FullSynchronizer } from '../sync/fullsync'
import { EthProtocol } from '../net/protocol/ethprotocol'
import { LesProtocol } from '../net/protocol/lesprotocol'
import { Peer } from '../net/peer/peer'
import { Protocol } from '../net/protocol'
import { Miner } from '../miner'

interface FullEthereumServiceOptions extends EthereumServiceOptions {
  /* Serve LES requests (default: false) */
  lightserv?: boolean
}

/**
 * Full Ethereum service
 * @memberof module:service
 */
export class FullEthereumService extends EthereumService {
  public synchronizer: FullSynchronizer
  public lightserv: boolean
  public miner: Miner | undefined

  /**
   * Create new ETH service
   * @param {FullEthereumServiceOptions}
   */
  constructor(options: FullEthereumServiceOptions) {
    super(options)

    this.lightserv = options.lightserv ?? false

    this.config.logger.info('Full sync mode')

    this.synchronizer = new FullSynchronizer({
      config: this.config,
      pool: this.pool,
      chain: this.chain,
      stateDB: options.stateDB,
      interval: this.interval,
    })

    if (this.config.mine) {
      this.miner = new Miner({
        config: this.config,
        synchronizer: this.synchronizer,
      })
    }
  }

  /**
   * Start service
   * @return {Promise}
   */
  async start(): Promise<void | boolean> {
    await super.start()
    this.miner?.start()
  }

  /**
   * Stop service
   * @return {Promise}
   */
  async stop(): Promise<void | boolean> {
    this.miner?.stop()
    await super.stop()
  }

  /**
   * Returns all protocols required by this service
   * @type {Protocol[]} required protocols
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
   * @param  {Object}  message message object
   * @param  protocol protocol name
   * @param  peer peer
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
   * @param  {Object}  message message object
   * @param  peer peer
   */
  async handleEth(message: any, peer: Peer): Promise<void> {
    if (message.name === 'GetBlockHeaders') {
      const { reqId, block, max, skip, reverse } = message.data
      const headers: any = await this.chain.getHeaders(block, max, skip, reverse)
      peer.eth!.send('BlockHeaders', { reqId, headers })
    } else if (message.name === 'GetBlockBodies') {
      const { reqId, hashes } = message.data
      const blocks = await Promise.all(hashes.map((hash: any) => this.chain.getBlock(hash)))
      const bodies: any = blocks.map((block: any) => block.raw().slice(1))
      peer.eth!.send('BlockBodies', { reqId, bodies })
    } else if (message.name === 'NewBlockHashes') {
      const blockNumbers: BN[] = message.data.map((v: [Buffer, BN]) => v[1])
      const { mergeFirstFinalizedBlock } = this.chain
      if (
        mergeFirstFinalizedBlock &&
        blockNumbers.some((n) => n.gte(mergeFirstFinalizedBlock.header.number))
      ) {
        this.config.logger.debug(
          `Dropping peer ${peer.id} for sending NewBlockHashes after merge (EIP-3675)`
        )
        this.pool.ban(peer, 9000000)
      } else {
        this.synchronizer.handleNewBlockHashes(message.data)
      }
    } else if (message.name === 'Transactions') {
      await this.synchronizer.txPool.handleAnnouncedTxs(message.data, peer, this.pool)
    } else if (message.name === 'NewBlock') {
      const blockTD: BN = message.data[1]
      const terminalTD = this.config.chainCommon.hardforkTD(Hardfork.Merge)
      if (terminalTD && blockTD.gt(terminalTD)) {
        this.config.logger.debug(
          `Dropping peer ${peer.id} for sending NewBlock after merge (EIP-3675)`
        )
        this.pool.ban(peer, 9000000)
      } else {
        await this.synchronizer.handleNewBlock(message.data[0], peer)
      }
    } else if (message.name === 'NewPooledTransactionHashes') {
      await this.synchronizer.txPool.handleAnnouncedTxHashes(message.data, peer, this.pool)
    } else if (message.name === 'GetPooledTransactions') {
      const { reqId, hashes } = message.data
      const txs = this.synchronizer.txPool.getByHash(hashes)
      // Always respond, also on an empty list
      peer.eth?.send('PooledTransactions', { reqId, txs })
    }
  }

  /**
   * Handles incoming LES message from connected peer
   * @param  {Object}  message message object
   * @param  peer peer
   */
  async handleLes(message: any, peer: Peer): Promise<void> {
    if (message.name === 'GetBlockHeaders' && this.config.lightserv) {
      const { reqId, block, max, skip, reverse } = message.data
      const bv = this.flow.handleRequest(peer, message.name, max)
      if (bv < 0) {
        this.pool.ban(peer, 300000)
        this.config.logger.debug(`Dropping peer for violating flow control ${peer}`)
      } else {
        const headers: any = await this.chain.getHeaders(block, max, skip, reverse)
        peer.les!.send('BlockHeaders', { reqId, bv, headers })
      }
    }
  }
}
