import Heap from 'qheap'
import {
  Capability,
  FeeMarketEIP1559Transaction,
  Transaction,
  TypedTransaction,
} from '@ethereumjs/tx'
import { Address } from 'ethereumjs-util'
import { Config } from '../config'
import { Peer } from '../net/peer'
import type { PeerPool } from '../net/peerpool'
import type { Block } from '@ethereumjs/block'
import type { VmState } from '@ethereumjs/vm/dist/vmState'

export interface TxPoolOptions {
  /* Config */
  config: Config

  /* Return number of connected peers for stats logging */
  getPeerCount?: () => number
}

type TxPoolObject = {
  tx: TypedTransaction
  hash: UnprefixedHash
  added: number
}

type HandledObject = {
  address: UnprefixedAddress
  added: number
}

type SentObject = {
  hash: UnprefixedHash
  added: number
}

type UnprefixedAddress = string
type UnprefixedHash = string
type PeerId = string

/**
 * @module service
 */

/**
 * Tx pool (mempool)
 * @memberof module:service
 */
export class TxPool {
  public config: Config
  public running: boolean

  private opened: boolean
  private getPeerCount?: () => number

  /* global NodeJS */
  private _logInterval: NodeJS.Timeout | undefined

  /**
   * List of pending tx hashes to avoid double requests
   */
  private pending: UnprefixedHash[] = []

  /**
   * The central pool dataset.
   *
   * Maps an address to a `TxPoolObject`
   */
  public pool: Map<UnprefixedAddress, TxPoolObject[]>

  /**
   * Map for handled tx hashes
   * (have been added to the pool at some point)
   *
   * This is meant to be a superset of the tx pool
   * so at any point it time containing minimally
   * all txs from the pool.
   */
  private handled: Map<UnprefixedHash, HandledObject>

  /**
   * Map for tx hashes a peer is already aware of
   * (so no need to re-broadcast)
   */
  private knownByPeer: Map<PeerId, SentObject[]>

  /**
   * Activate before chain head is reached to start
   * tx pool preparation (sorting out included txs)
   */
  public BLOCKS_BEFORE_TARGET_HEIGHT_ACTIVATION = 20

  /**
   * Max number of txs to request
   */
  private TX_RETRIEVAL_LIMIT = 256

  /**
   * Number of minutes to keep txs in the pool
   */
  public POOLED_STORAGE_TIME_LIMIT = 20

  /**
   * Number of minutes to forget about handled
   * txs (for cleanup/memory reasons)
   */
  public HANDLED_CLEANUP_TIME_LIMIT = 60

  /**
   * Rebroadcast full txs and new blocks to a fraction
   * of peers by doing
   * `min(1, floor(NUM_PEERS/NUM_PEERS_REBROADCAST_QUOTIENT))`
   */
  public NUM_PEERS_REBROADCAST_QUOTIENT = 4

  /**
   * Log pool statistics on the given interval
   */
  private LOG_STATISTICS_INTERVAL = 20000 // ms

  /**
   * Create new tx pool
   * @param options constructor parameters
   */
  constructor(options: TxPoolOptions) {
    this.config = options.config

    this.getPeerCount = options.getPeerCount
    this.pool = new Map<UnprefixedAddress, TxPoolObject[]>()
    this.handled = new Map<UnprefixedHash, HandledObject>()
    this.knownByPeer = new Map<PeerId, SentObject[]>()

    this.opened = false
    this.running = false
  }

  /**
   * Open pool
   */
  open(): boolean {
    if (this.opened) {
      return false
    }
    this.opened = true

    return true
  }

  /**
   * Start tx processing
   */
  start(): boolean {
    if (this.running) {
      return false
    }
    this._logInterval = setInterval(this._logPoolStats.bind(this), this.LOG_STATISTICS_INTERVAL)
    this.running = true
    this.config.logger.info('TxPool started.')
    return true
  }

  /**
   * Adds a tx to the pool.
   *
   * If there is a tx in the pool with the same address and
   * nonce it will be replaced by the new tx.
   * @param tx Transaction
   */
  add(tx: TypedTransaction) {
    const sender: UnprefixedAddress = tx.getSenderAddress().toString().slice(2)
    const inPool = this.pool.get(sender)
    let add: TxPoolObject[] = []
    if (inPool) {
      // Replace pooled txs with the same nonce
      add = inPool.filter((poolObj) => poolObj.tx.nonce !== tx.nonce)
    }
    const address: UnprefixedAddress = tx.getSenderAddress().toString().slice(2)
    const hash: UnprefixedHash = tx.hash().toString('hex')
    const added = Date.now()
    add.push({ tx, added, hash })
    this.pool.set(address, add)

    this.handled.set(hash, { address, added })
  }

  /**
   * Returns the available txs from the pool
   * @param txHashes
   * @returns Array with tx objects
   */
  getByHash(txHashes: Buffer[]): TypedTransaction[] {
    const found = []
    for (const txHash of txHashes) {
      const txHashStr = txHash.toString('hex')
      const handled = this.handled.get(txHashStr)
      if (!handled) {
        continue
      }
      const inPool = this.pool.get(handled.address)?.filter((poolObj) => poolObj.hash === txHashStr)
      if (inPool && inPool.length === 1) {
        found.push(inPool[0].tx)
      }
    }
    return found
  }

  /**
   * Removes the given tx from the pool
   * @param txHash Hash of the transaction
   */
  removeByHash(txHash: UnprefixedHash) {
    if (!this.handled.has(txHash)) {
      return
    }
    const address = this.handled.get(txHash)!.address
    if (!this.pool.has(address)) {
      return
    }
    const newPoolObjects = this.pool.get(address)!.filter((poolObj) => poolObj.hash !== txHash)
    if (newPoolObjects.length === 0) {
      // List of txs for address is now empty, can delete
      this.pool.delete(address)
    } else {
      // There are more txs from this address
      this.pool.set(address, newPoolObjects)
    }
  }

  /**
   * Adds passed in txs to the map keeping track
   * of tx hashes known by a peer.
   * @param txHashes
   * @param peer
   * @returns Array with txs which are new to the list
   */
  addToKnownByPeer(txHashes: Buffer[], peer: Peer): Buffer[] {
    // Make sure data structure is initialized
    if (!this.knownByPeer.has(peer.id)) {
      this.knownByPeer.set(peer.id, [])
    }

    const newHashes: Buffer[] = []
    for (const hash of txHashes) {
      const inSent = this.knownByPeer
        .get(peer.id)!
        .filter((sentObject) => sentObject.hash === hash.toString('hex')).length
      if (inSent === 0) {
        const added = Date.now()
        const add = {
          hash: hash.toString('hex'),
          added,
        }
        this.knownByPeer.get(peer.id)!.push(add)
        newHashes.push(hash)
      }
    }
    return newHashes
  }

  /**
   * Send (broadcast) tx hashes from the pool to connected
   * peers.
   *
   * Double sending is avoided by compare towards the
   * `SentTxHashes` map.
   * @param txHashes Array with transactions to send
   * @param peers
   */
  async sendNewTxHashes(txHashes: Buffer[], peers: Peer[]) {
    for (const peer of peers) {
      // Make sure data structure is initialized
      if (!this.knownByPeer.has(peer.id)) {
        this.knownByPeer.set(peer.id, [])
      }
      // Add to known tx hashes and get hashes still to send to peer
      const hashesToSend = this.addToKnownByPeer(txHashes, peer)

      // Broadcast to peer if at least 1 new tx hash to announce
      if (hashesToSend.length > 0) {
        peer.eth?.send('NewPooledTransactionHashes', hashesToSend)
      }
    }
  }

  /**
   * Send transactions to other peers in the peer pool
   *
   * Note that there is currently no data structure to avoid
   * double sending to a peer, so this has to be made sure
   * by checking on the context the sending is performed.
   * @param txs Array with transactions to send
   * @param peers
   */
  sendTransactions(txs: TypedTransaction[], peers: Peer[]) {
    if (txs.length > 0) {
      const hashes = txs.map((tx) => tx.hash())
      for (const peer of peers) {
        // This is used to avoid re-sending along pooledTxHashes
        // announcements/re-broadcasts
        this.addToKnownByPeer(hashes, peer)
        peer.eth?.send('Transactions', txs)
      }
    }
  }

  /**
   * Include new announced txs in the pool
   * and re-broadcast to other peers
   * @param txs
   * @param peer Announcing peer
   * @param peerPool Reference to the {@link PeerPool}
   */
  async handleAnnouncedTxs(txs: TypedTransaction[], peer: Peer, peerPool: PeerPool) {
    if (!this.running || txs.length === 0) {
      return
    }
    this.config.logger.debug(`TxPool: received new transactions number=${txs.length}`)
    this.addToKnownByPeer(
      txs.map((tx) => tx.hash()),
      peer
    )
    this.cleanup()

    const newTxHashes = []
    for (const tx of txs) {
      this.add(tx)
      newTxHashes.push(tx.hash())
    }
    const peers = peerPool.peers
    const numPeers = peers.length
    const sendFull = Math.min(1, Math.floor(numPeers / this.NUM_PEERS_REBROADCAST_QUOTIENT))
    this.sendTransactions(txs, peers.slice(0, sendFull))
    await this.sendNewTxHashes(newTxHashes, peers.slice(sendFull))
  }

  /**
   * Request new pooled txs from tx hashes announced and include them in the pool
   * and re-broadcast to other peers
   * @param txHashes new tx hashes announced
   * @param peer Announcing peer
   * @param peerPool Reference to the peer pool
   */
  async handleAnnouncedTxHashes(txHashes: Buffer[], peer: Peer, peerPool: PeerPool) {
    if (!this.running || txHashes.length === 0) {
      return
    }
    this.config.logger.debug(`TxPool: received new pooled hashes number=${txHashes.length}`)
    this.addToKnownByPeer(txHashes, peer)
    this.cleanup()

    const reqHashes = []
    for (const txHash of txHashes) {
      const txHashStr: UnprefixedHash = txHash.toString('hex')
      if (this.pending.includes(txHashStr) || this.handled.has(txHashStr)) {
        continue
      }
      reqHashes.push(txHash)
    }

    if (reqHashes.length === 0) {
      return
    }

    const reqHashesStr: UnprefixedHash[] = reqHashes.map((hash) => hash.toString('hex'))
    this.pending.concat(reqHashesStr)
    this.config.logger.debug(
      `TxPool: requesting txs number=${reqHashes.length} pending=${this.pending.length}`
    )
    const getPooledTxs = await peer.eth!.getPooledTransactions({
      hashes: reqHashes.slice(0, this.TX_RETRIEVAL_LIMIT),
    })

    // Remove from pending list regardless if tx is in result
    this.pending = this.pending.filter((hash) => !reqHashesStr.includes(hash))

    if (!getPooledTxs) return
    const [_, txs] = getPooledTxs
    this.config.logger.debug(`TxPool: received requested txs number=${txs.length}`)

    const newTxHashes = []
    for (const tx of txs) {
      this.add(tx)
      newTxHashes.push(tx.hash())
    }
    await this.sendNewTxHashes(newTxHashes, peerPool.peers)
  }

  /**
   * Remove txs included in the latest blocks from the tx pool
   */
  removeNewBlockTxs(newBlocks: Block[]) {
    if (!this.running) {
      return
    }
    for (const block of newBlocks) {
      for (const tx of block.transactions) {
        const txHash: UnprefixedHash = tx.hash().toString('hex')
        this.removeByHash(txHash)
      }
    }
  }

  /**
   * Regular tx pool cleanup
   */
  cleanup() {
    // Remove txs older than POOLED_STORAGE_TIME_LIMIT from the pool
    // as well as the list of txs being known by a peer
    let compDate = Date.now() - this.POOLED_STORAGE_TIME_LIMIT * 60
    for (const mapToClean of [this.pool, this.knownByPeer]) {
      mapToClean.forEach((objects, key) => {
        const updatedObjects = objects.filter((obj) => obj.added >= compDate)
        if (updatedObjects.length < objects.length) {
          if (updatedObjects.length === 0) {
            mapToClean.delete(key)
          } else {
            mapToClean.set(key, updatedObjects)
          }
        }
      })
    }

    // Cleanup handled txs
    compDate = Date.now() - this.HANDLED_CLEANUP_TIME_LIMIT * 60
    this.handled.forEach((handleObj, address) => {
      if (handleObj.added < compDate) {
        this.handled.delete(address)
      }
    })
  }

  /**
   * Helper to return a normalized gas price across different
   * transaction types. Providing the baseFee param returns the
   * priority tip, and omitting it returns the max total fee.
   * @param tx The tx
   * @param baseFee Provide a baseFee to subtract from the legacy
   * gasPrice to determine the leftover priority tip.
   */
  private txGasPrice(tx: TypedTransaction, baseFee?: bigint) {
    const supports1559 = tx.supports(Capability.EIP1559FeeMarket)
    if (baseFee) {
      if (supports1559) {
        return (tx as FeeMarketEIP1559Transaction).maxPriorityFeePerGas
      } else {
        return (tx as Transaction).gasPrice - baseFee
      }
    } else {
      if (supports1559) {
        return (tx as FeeMarketEIP1559Transaction).maxFeePerGas
      } else {
        return (tx as Transaction).gasPrice
      }
    }
  }

  /**
   * Returns eligible txs to be mined sorted by price in such a way that the
   * nonce orderings within a single account are maintained.
   *
   * Note, this is not as trivial as it seems from the first look as there are three
   * different criteria that need to be taken into account (price, nonce, account
   * match), which cannot be done with any plain sorting method, as certain items
   * cannot be compared without context.
   *
   * This method first sorts the separates the list of transactions into individual
   * sender accounts and sorts them by nonce. After the account nonce ordering is
   * satisfied, the results are merged back together by price, always comparing only
   * the head transaction from each account. This is done via a heap to keep it fast.
   *
   * @param vmState Account nonces are queried to only include executable txs
   * @param baseFee Provide a baseFee to exclude txs with a lower gasPrice
   */
  async txsByPriceAndNonce(vmState: VmState, baseFee?: bigint) {
    const txs: TypedTransaction[] = []
    // Separate the transactions by account and sort by nonce
    const byNonce = new Map<string, TypedTransaction[]>()
    for (const [address, poolObjects] of this.pool) {
      let txsSortedByNonce = poolObjects
        .map((obj) => obj.tx)
        .sort((a, b) => Number(a.nonce - b.nonce))
      // Check if the account nonce matches the lowest known tx nonce
      const { nonce } = await vmState.getAccount(new Address(Buffer.from(address, 'hex')))
      if (txsSortedByNonce[0].nonce !== nonce) {
        // Account nonce does not match the lowest known tx nonce,
        // therefore no txs from this address are currently exectuable
        continue
      }
      if (baseFee) {
        // If any tx has an insiffucient gasPrice,
        // remove all txs after that since they cannot be executed
        const found = txsSortedByNonce.findIndex((tx) => this.txGasPrice(tx) < baseFee)
        if (found > -1) {
          txsSortedByNonce = txsSortedByNonce.slice(0, found)
        }
      }
      byNonce.set(address, txsSortedByNonce)
    }
    // Initialize a price based heap with the head transactions
    const byPrice = new Heap<TypedTransaction>({
      comparBefore: (a: TypedTransaction, b: TypedTransaction) =>
        this.txGasPrice(b, baseFee) - this.txGasPrice(a, baseFee) < BigInt(0),
    })
    byNonce.forEach((txs, address) => {
      byPrice.insert(txs[0])
      byNonce.set(address, txs.slice(1))
    })
    // Merge by replacing the best with the next from the same account
    while (byPrice.length > 0) {
      // Retrieve the next best transaction by price
      const best = byPrice.remove()
      if (!best) break
      // Push in its place the next transaction from the same account
      const address = best.getSenderAddress().toString().slice(2)
      const accTxs = byNonce.get(address)!
      if (accTxs.length > 0) {
        byPrice.insert(accTxs[0])
        byNonce.set(address, accTxs.slice(1))
      }
      // Accumulate the best priced transaction
      txs.push(best)
    }
    return txs
  }

  /**
   * Stop pool execution
   */
  stop(): boolean {
    if (!this.running) {
      return false
    }
    clearInterval(this._logInterval as NodeJS.Timeout)

    this.running = false
    this.config.logger.info('TxPool stopped.')
    return true
  }

  /**
   * Close pool
   */
  close() {
    this.pool.clear()
    this.opened = false
  }

  _logPoolStats() {
    let count = 0
    this.pool.forEach((poolObjects) => {
      count += poolObjects.length
    })
    this.config.logger.info(
      `TxPool Statistics txs=${count} senders=${this.pool.size} peers=${this.getPeerCount?.() ?? 0}`
    )
  }
}
