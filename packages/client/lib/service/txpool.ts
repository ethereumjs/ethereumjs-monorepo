import Heap from 'qheap'
import {
  AccessListEIP2930Transaction,
  Capability,
  FeeMarketEIP1559Transaction,
  Transaction,
  TypedTransaction,
} from '@ethereumjs/tx'
import { Address, BN, bufferToHex } from 'ethereumjs-util'
import { Config } from '../config'
import { Peer } from '../net/peer'
import type VM from '@ethereumjs/vm'
import type { FullEthereumService } from './fullethereumservice'
import type { PeerPool } from '../net/peerpool'
import type { Block } from '@ethereumjs/block'

// Configuration constants
const MIN_GAS_PRICE_BUMP_PERCENT = 10
const MIN_GAS_PRICE = new BN(1000000000) // 1 GWei
const TX_MAX_DATA_SIZE = 128 * 1024 // 128KB
const MAX_POOL_SIZE = 5000
const MAX_TXS_PER_ACCOUNT = 100

export interface TxPoolOptions {
  /* Config */
  config: Config

  /* FullEthereumService */
  service: FullEthereumService
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

type GasPrice = {
  tip: BN
  maxFee: BN
}

/**
 * @module service
 */

/**
 * Tx pool (mempool)
 * @memberof module:service
 */
export class TxPool {
  private config: Config
  private service: FullEthereumService
  private vm: VM

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
   * The number of txs currently in the pool
   */
  public txsInPool: number

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
   * `max(1, floor(NUM_PEERS/NUM_PEERS_REBROADCAST_QUOTIENT))`
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
    this.service = options.service
    this.vm = this.service.execution.vm

    this.pool = new Map<UnprefixedAddress, TxPoolObject[]>()
    this.txsInPool = 0
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
   * Checks if tx pool should be started
   */
  checkRunState() {
    if (this.running || !this.config.syncTargetHeight) return
    // If height gte target, we are close enough to the
    // head of the chain that the tx pool can be started
    const target = this.config.syncTargetHeight.subn(this.BLOCKS_BEFORE_TARGET_HEIGHT_ACTIVATION)
    if (this.service.chain.headers.height.gte(target)) {
      this.start()
    }
  }

  /**
   * Returns the GasPrice object to provide information of the tx' gas prices
   * @param tx Tx to use
   * @returns Gas price (both tip and max fee)
   */
  private txGasPrice(tx: TypedTransaction): GasPrice {
    switch (tx.type) {
      case 0:
        return {
          maxFee: (tx as Transaction).gasPrice,
          tip: (tx as Transaction).gasPrice,
        }
      case 1:
        return {
          maxFee: (tx as AccessListEIP2930Transaction).gasPrice,
          tip: (tx as AccessListEIP2930Transaction).gasPrice,
        }
      case 2:
        return {
          maxFee: (tx as FeeMarketEIP1559Transaction).maxFeePerGas,
          tip: (tx as FeeMarketEIP1559Transaction).maxPriorityFeePerGas,
        }
      default:
        throw new Error(`tx of type ${tx.type} unknown`)
    }
  }

  private validateTxGasBump(existingTx: TypedTransaction, addedTx: TypedTransaction) {
    const existingTxGasPrice = this.txGasPrice(existingTx)
    const newGasPrice = this.txGasPrice(addedTx)
    const minTipCap = existingTxGasPrice.tip.add(
      existingTxGasPrice.tip.muln(MIN_GAS_PRICE_BUMP_PERCENT).divn(100)
    )
    const minFeeCap = existingTxGasPrice.maxFee.add(
      existingTxGasPrice.maxFee.muln(MIN_GAS_PRICE_BUMP_PERCENT).divn(100)
    )
    if (newGasPrice.tip.lt(minTipCap) || newGasPrice.maxFee.lt(minFeeCap)) {
      throw new Error('replacement gas too low')
    }
  }

  /**
   * Validates a transaction against the pool and other constraints
   * @param tx The tx to validate
   */
  private async validate(tx: TypedTransaction, isLocalTransaction: boolean = false) {
    if (!tx.isSigned()) {
      throw new Error('Attempting to add tx to txpool which is not signed')
    }
    if (tx.data.length > TX_MAX_DATA_SIZE) {
      throw new Error(
        `Tx is too large (${tx.data.length} bytes) and exceeds the max data size of ${TX_MAX_DATA_SIZE} bytes`
      )
    }
    const currentGasPrice = this.txGasPrice(tx)
    // This is the tip which the miner receives: miner does not want
    // to mine underpriced txs where miner gets almost no fees
    const currentTip = currentGasPrice.tip
    if (!isLocalTransaction) {
      const txsInPool = this.txsInPool
      if (txsInPool >= MAX_POOL_SIZE) {
        throw new Error('Cannot add tx: pool is full')
      }
      // Local txs are not checked against MIN_GAS_PRICE
      if (currentTip.lt(MIN_GAS_PRICE)) {
        throw new Error(`Tx does not pay the minimum gas price of ${MIN_GAS_PRICE}`)
      }
    }
    const senderAddress = tx.getSenderAddress()
    const sender: UnprefixedAddress = senderAddress.toString().slice(2)
    const inPool = this.pool.get(sender)
    if (inPool) {
      if (!isLocalTransaction && inPool.length >= MAX_TXS_PER_ACCOUNT) {
        throw new Error(
          `Cannot add tx for ${senderAddress}: already have max amount of txs for this account`
        )
      }
      // Replace pooled txs with the same nonce
      const existingTxn = inPool.find((poolObj) => poolObj.tx.nonce.eq(tx.nonce))
      if (existingTxn) {
        if (existingTxn.tx.hash().equals(tx.hash())) {
          throw new Error(`${bufferToHex(tx.hash())}: this transaction is already in the TxPool`)
        }
        this.validateTxGasBump(existingTxn.tx, tx)
      }
    }
    const block = await this.service.chain.getLatestHeader()
    if (block.baseFeePerGas) {
      if (currentGasPrice.maxFee.lt(block.baseFeePerGas)) {
        throw new Error(
          `Tx cannot pay basefee of ${block.baseFeePerGas}, have ${currentGasPrice.maxFee}.`
        )
      }
    }
    if (tx.gasLimit.gt(block.gasLimit)) {
      throw new Error(`Tx gaslimit of ${tx.gasLimit} exceeds block gas limit of ${block.gasLimit}`)
    }
    const account = await this.vm.stateManager.getAccount(senderAddress)
    if (account.nonce.gt(tx.nonce)) {
      throw new Error(
        `0x${sender} tries to send a tx with nonce ${tx.nonce}, but account has nonce ${account.nonce} (tx nonce too low)`
      )
    }
    const minimumBalance = tx.value.add(currentGasPrice.maxFee.mul(tx.gasLimit))
    if (account.balance.lt(minimumBalance)) {
      throw new Error(
        `0x${sender} does not have enough balance to cover transaction costs, need ${minimumBalance}, but have ${account.balance}`
      )
    }
  }

  /**
   * Adds a tx to the pool.
   *
   * If there is a tx in the pool with the same address and
   * nonce it will be replaced by the new tx, if it has a sufficent gas bump.
   * This also verifies certain constraints, if these are not met, tx will not be added to the pool.
   * @param tx Transaction
   * @param isLocalTransaction Boolean which is true if this is a local transaction (this drops some constraint checks)
   */
  async add(tx: TypedTransaction, isLocalTransaction: boolean = false) {
    await this.validate(tx, isLocalTransaction)
    const address: UnprefixedAddress = tx.getSenderAddress().toString().slice(2)
    let add: TxPoolObject[] = this.pool.get(address) ?? []
    const inPool = this.pool.get(address)
    if (inPool) {
      // Replace pooled txs with the same nonce
      add = inPool.filter((poolObj) => !poolObj.tx.nonce.eq(tx.nonce))
    }
    const hash: UnprefixedHash = tx.hash().toString('hex')
    const added = Date.now()
    add.push({ tx, added, hash })
    this.pool.set(address, add)
    this.txsInPool++
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
    this.txsInPool--
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
      try {
        await this.add(tx)
        newTxHashes.push(tx.hash())
      } catch (error: any) {
        this.config.logger.debug(
          `Error adding tx to TxPool: ${error.message} (tx hash: ${bufferToHex(tx.hash())})`
        )
      }
    }
    const peers = peerPool.peers
    const numPeers = peers.length
    const sendFull = Math.max(1, Math.floor(numPeers / this.NUM_PEERS_REBROADCAST_QUOTIENT))
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
      try {
        await this.add(tx)
      } catch (error: any) {
        this.config.logger.debug(
          `Error adding tx to TxPool: ${error.message} (tx hash: ${bufferToHex(tx.hash())})`
        )
      }
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
  private normalizedGasPrice(tx: TypedTransaction, baseFee?: BN) {
    const supports1559 = tx.supports(Capability.EIP1559FeeMarket)
    if (baseFee) {
      if (supports1559) {
        return (tx as FeeMarketEIP1559Transaction).maxPriorityFeePerGas
      } else {
        return (tx as Transaction).gasPrice.sub(baseFee)
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
   * @param baseFee Provide a baseFee to exclude txs with a lower gasPrice
   */
  async txsByPriceAndNonce(baseFee?: BN) {
    const txs: TypedTransaction[] = []
    // Separate the transactions by account and sort by nonce
    const byNonce = new Map<string, TypedTransaction[]>()
    for (const [address, poolObjects] of this.pool) {
      let txsSortedByNonce = poolObjects
        .map((obj) => obj.tx)
        .sort((a, b) => a.nonce.sub(b.nonce).toNumber())
      // Check if the account nonce matches the lowest known tx nonce
      const { nonce } = await this.vm.stateManager.getAccount(
        new Address(Buffer.from(address, 'hex'))
      )
      if (!txsSortedByNonce[0].nonce.eq(nonce)) {
        // Account nonce does not match the lowest known tx nonce,
        // therefore no txs from this address are currently exectuable
        continue
      }
      if (baseFee) {
        // If any tx has an insiffucient gasPrice,
        // remove all txs after that since they cannot be executed
        const found = txsSortedByNonce.findIndex((tx) => this.normalizedGasPrice(tx).lt(baseFee))
        if (found > -1) {
          txsSortedByNonce = txsSortedByNonce.slice(0, found)
        }
      }
      byNonce.set(address, txsSortedByNonce)
    }
    // Initialize a price based heap with the head transactions
    const byPrice = new Heap<TypedTransaction>({
      comparBefore: (a: TypedTransaction, b: TypedTransaction) =>
        this.normalizedGasPrice(b, baseFee).sub(this.normalizedGasPrice(a, baseFee)).ltn(0),
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
    const count = this.txsInPool
    this.config.logger.info(
      `TxPool Statistics txs=${count} senders=${this.pool.size} peers=${this.service.pool.peers.length}`
    )
  }
}
