import EventEmitter from 'events'
import { Config } from '../config'
import { Peer } from '../net/peer'
import { EthProtocolMethods } from '../net/protocol'
import { TransactionFactory } from '@ethereumjs/tx'

export interface TxPoolOptions {
  /* Config */
  config: Config
}

const TX_RETRIEVAL_LIMIT = 256

/**
 * @module service
 */

/**
 * Tx pool (mempool)
 * @memberof module:service
 */
export class TxPool extends EventEmitter {
  public config: Config

  private opened: boolean

  /**
   * List of pending tx hashes to avoid double requests
   */
  private pending: string[] = []

  /**
   * List of pooled tx hashes
   */
  private pooled: string[] = []

  /**
   * List of outdated tx hashes
   *
   * Simple FIFO list to avoid double requests on outdated txs
   */
  private outdated: string[] = []

  /**
   * Create new tx pool
   * @param options constructor parameters
   */
  constructor(options: TxPoolOptions) {
    super()

    this.config = options.config

    //this.pool = new Map<string, Peer>()
    this.opened = false

    this.init()
  }

  init() {
    this.opened = false
  }

  /**
   * Open pool
   */
  async open(): Promise<boolean> {
    if (this.opened) {
      return false
    }
    this.opened = true
    return true
  }

  /**
   * New pooled txs announced
   * @param  announcements new block hash announcements
   * @param  peer peer
   */
  async announced(txHashes: Buffer[], peer: Peer) {
    if (txHashes.length) {
      this.config.logger.info(`Tx pool: received new pooled tx hashes number=${txHashes.length}`)

      const reqHashes = []
      for (const txHash of txHashes) {
        const txHashStr = txHash.toString('hex')
        if (txHashStr in this.pending || txHashStr in this.pooled || txHashStr in this.outdated) {
          continue
        }
        reqHashes.push(txHash)
      }

      if (reqHashes.length > 0) {
        const reqHashesStr = reqHashes.map((hash) => hash.toString('hex'))
        this.pending.concat(reqHashesStr)
        //console.log(`txHashes: ${txHashes.length} reqHashes: ${reqHashes.length} pending: ${this.pending.length}`)
        const txsResult = await (peer!.eth as EthProtocolMethods).getPooledTransactions({
          hashes: reqHashes.slice(0, TX_RETRIEVAL_LIMIT),
        })

        // Remove from pending list regardless if tx is in result
        for (const reqHashStr of reqHashesStr) {
          this.pending = this.pending.filter((hash) => hash !== reqHashStr)
        }

        this.config.logger.info(`Tx pool: received txs number=${txsResult.length}`)
        for (const txData of txsResult[1]) {
          const tx = TransactionFactory.fromBlockBodyData(txData)
          this.config.logger.info(`Nonce: ${tx.nonce}`)
        }
      }
    }
  }

  /**
   * Close pool
   */
  async close() {
    //this.pool.clear()
    this.opened = false
  }
}
