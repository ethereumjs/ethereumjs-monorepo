import EventEmitter from 'events'
import { Config } from '../config'
import { Peer } from '../net/peer'
import { EthProtocolMethods } from '../net/protocol'
import { TransactionFactory, TypedTransaction } from '@ethereumjs/tx'

export interface TxPoolOptions {
  /* Config */
  config: Config
}

export type TxPoolObject = {
  tx: TypedTransaction
  added: number
}

const TX_RETRIEVAL_LIMIT = 256
const LOG_STATISTICS_INTERVAL = 3000 // ms

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
   * List of handled tx hashes
   * (have been added to the pool at some point)
   */
  private handled: string[] = []

  public pool: Map<string, TxPoolObject[]>

  /**
   * Create new tx pool
   * @param options constructor parameters
   */
  constructor(options: TxPoolOptions) {
    super()

    this.config = options.config

    this.pool = new Map<string, TxPoolObject[]>()
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

    setInterval(this._logPoolStats.bind(this), LOG_STATISTICS_INTERVAL)
    return true
  }

  /**
   * New pooled txs announced
   * @param  announcements new block hash announcements
   * @param  peer peer
   */
  async announced(txHashes: Buffer[], peer: Peer) {
    if (txHashes.length) {
      //this.config.logger.info(`Tx pool: received new pooled tx hashes number=${txHashes.length}`)

      const reqHashes = []
      for (const txHash of txHashes) {
        const txHashStr = txHash.toString('hex')
        if (txHashStr in this.pending || txHashStr in this.handled) {
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

        //this.config.logger.info(`Tx pool: received txs number=${txsResult.length}`)
        for (const txData of txsResult[1]) {
          const tx = TransactionFactory.fromBlockBodyData(txData)
          const sender = tx.getSenderAddress().toString()
          const inPool = this.pool.get(sender)
          let add: TxPoolObject[] = []
          if (inPool) {
            // Replace pooled txs with the same nonce
            add = inPool.filter((poolObj) => poolObj.tx.nonce !== tx.nonce)
          }
          add.push({ tx, added: Date.now() })

          this.pool.set(tx.getSenderAddress().toString(), add)
          this.handled.push(tx.hash().toString('hex'))
        }
      }
    }
  }

  _logPoolStats() {
    let count = 0
    this.pool.forEach((poolObjects) => {
      count += poolObjects.length
    })
    this.config.logger.info(`TxPool Statistics transactions=${count} senders=${this.pool.size}`)
  }

  /**
   * Close pool
   */
  async close() {
    //this.pool.clear()
    this.opened = false
  }
}
