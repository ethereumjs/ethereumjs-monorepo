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

  // eslint-disable-next-line no-undef
  private _logInterval: NodeJS.Timeout | null

  /**
   * List of pending tx hashes to avoid double requests
   *
   * (plain strings without hex prefix)
   */
  private pending: string[] = []

  /**
   * List of handled tx hashes
   * (have been added to the pool at some point)
   *
   * (plain strings without hex prefix)
   */
  private handled: string[] = []

  public pool: Map<string, TxPoolObject[]>

  private TX_RETRIEVAL_LIMIT = 256
  private LOG_STATISTICS_INTERVAL = 10000 // ms

  /**
   * Create new tx pool
   * @param options constructor parameters
   */
  constructor(options: TxPoolOptions) {
    super()

    this.config = options.config
    this._logInterval = null

    this.pool = new Map<string, TxPoolObject[]>()
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

    this._logInterval = setInterval(this._logPoolStats.bind(this), this.LOG_STATISTICS_INTERVAL)
    return true
  }

  /**
   * New pooled txs announced
   * @param  announcements new block hash announcements
   * @param  peer peer
   */
  async announcedTxHashes(txHashes: Buffer[], peer: Peer) {
    if (txHashes.length) {
      //this.config.logger.info(`Tx pool: received new pooled tx hashes number=${txHashes.length}`)

      const reqHashes = []
      for (const txHash of txHashes) {
        const txHashStr = txHash.toString('hex')
        if (this.pending.includes(txHashStr) || this.handled.includes(txHashStr)) {
          continue
        }
        reqHashes.push(txHash)
      }

      if (reqHashes.length > 0) {
        const reqHashesStr = reqHashes.map((hash) => hash.toString('hex'))
        this.pending.concat(reqHashesStr)
        //console.log(`txHashes: ${txHashes.length} reqHashes: ${reqHashes.length} pending: ${this.pending.length}`)
        const txsResult = await (peer!.eth as EthProtocolMethods).getPooledTransactions({
          hashes: reqHashes.slice(0, this.TX_RETRIEVAL_LIMIT),
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
            add = inPool.filter((poolObj) => !poolObj.tx.nonce.eq(tx.nonce))
          }
          add.push({ tx, added: Date.now() })

          this.pool.set(tx.getSenderAddress().toString(), add)
          this.handled.push(tx.hash().toString('hex'))
        }
      }
    }
  }

  /**
   * Close pool
   */
  async close() {
    this.pool.clear()
    this.opened = false
    // eslint-disable-next-line no-undef
    clearInterval(this._logInterval as NodeJS.Timeout)
  }

  _logPoolStats() {
    let count = 0
    this.pool.forEach((poolObjects) => {
      count += poolObjects.length
    })
    this.config.logger.info(`TxPool Statistics transactions=${count} senders=${this.pool.size}`)
  }
}
