import { TypedTransaction } from '@ethereumjs/tx'
import { Config } from '../config'
import { Peer } from '../net/peer'
import { EthProtocolMethods } from '../net/protocol'
import type { Block } from '@ethereumjs/block'
import { PeerPool } from '../net/peerpool'

export interface TxPoolOptions {
  /* Config */
  config: Config
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

  private opened: boolean
  public running: boolean

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
  private LOG_STATISTICS_INTERVAL = 10000 // ms

  /**
   * Create new tx pool
   * @param options constructor parameters
   */
  constructor(options: TxPoolOptions) {
    this.config = options.config

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
    const sender: UnprefixedAddress = tx.getSenderAddress().toString()
    const inPool = this.pool.get(sender)
    let add: TxPoolObject[] = []
    if (inPool) {
      // Replace pooled txs with the same nonce
      add = inPool.filter((poolObj) => !poolObj.tx.nonce.eq(tx.nonce))
    }
    const address: UnprefixedAddress = tx.getSenderAddress().toString()
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
   * @param peerPool Reference to the peer pool
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
    const [_, txs] = await (peer!.eth as EthProtocolMethods).getPooledTransactions({
      hashes: reqHashes.slice(0, this.TX_RETRIEVAL_LIMIT),
    })

    this.config.logger.debug(`TxPool: received requested txs number=${txs.length}`)

    // Remove from pending list regardless if tx is in result
    for (const reqHashStr of reqHashesStr) {
      this.pending = this.pending.filter((hash) => hash !== reqHashStr)
    }

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
    this.config.logger.info(`TxPool Statistics transactions=${count} senders=${this.pool.size}`)
  }
}
