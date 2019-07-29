import Common from 'ethereumjs-common'
import * as ethUtil from 'ethereumjs-util'
import { BN, rlp } from 'ethereumjs-util'
import { Transaction } from 'ethereumjs-tx'

import { BlockHeader } from './header'
import { Blockchain, BlockData, NetworkOptions } from './types'

const Trie = require('merkle-patricia-tree')

/**
 * Creates a new block object
 * @constructor the raw serialized or the deserialized block.
 * @param {Array|Buffer|Object} data
 * @param {Array} opts Options
 * @param {String|Number} opts.chain The chain for the block [default: 'mainnet']
 * @param {String} opts.hardfork Hardfork for the block [default: null, block number-based behaviour]
 * @param {Object} opts.common Alternatively pass a Common instance (ethereumjs-common) instead of setting chain/hardfork directly
 * @prop {Header} header the block's header
 * @prop {Array.<Header>} uncleList an array of uncle headers
 * @prop {Array.<Buffer>} raw an array of buffers containing the raw blocks.
 */
export class Block {
  public readonly header: BlockHeader
  public readonly transactions: Transaction[] = []
  public readonly uncleHeaders: BlockHeader[] = []
  public readonly txTrie = new Trie()

  private readonly _common: Common

  constructor(
    data: Buffer | [Buffer[], Buffer[], Buffer[]] | BlockData = {},
    opts: NetworkOptions = {},
  ) {
    if (opts.common) {
      if (opts.chain !== undefined || opts.hardfork !== undefined) {
        throw new Error(
          'Instantiation with both opts.common and opts.chain / opts.hardfork parameter not allowed!',
        )
      }

      this._common = opts.common
    } else {
      const chain = opts.chain ? opts.chain : 'mainnet'
      const hardfork = opts.hardfork ? opts.hardfork : null
      this._common = new Common(chain, hardfork)
    }

    let rawTransactions
    let rawUncleHeaders

    if (Buffer.isBuffer(data)) {
      // We do this to silence a TS error. We know that after this statement, data is
      // a [Buffer[], Buffer[], Buffer[]]
      const dataAsAny = rlp.decode(data) as any
      data = dataAsAny as [Buffer[], Buffer[], Buffer[]]
    }

    if (Array.isArray(data)) {
      // TODO: Pass the common object
      this.header = new BlockHeader(data[0], opts)
      rawTransactions = data[1]
      rawUncleHeaders = data[2]
    } else {
      // TODO: Pass the common object
      this.header = new BlockHeader(data.header, opts)
      rawTransactions = data.transactions || []
      rawUncleHeaders = data.uncleHeaders || []
    }

    // parse uncle headers
    for (let i = 0; i < rawUncleHeaders.length; i++) {
      this.uncleHeaders.push(new BlockHeader(rawUncleHeaders[i], opts))
    }

    // parse transactions
    for (let i = 0; i < rawTransactions.length; i++) {
      const tx = new Transaction(rawTransactions[i], opts)
      this.transactions.push(tx)
    }
  }

  get raw() {
    return this.serialize(false)
  }

  /**
   * Produces a hash the RLP of the block
   * @method hash
   */
  hash() {
    return this.header.hash()
  }

  /**
   * Determines if a given block is the genesis block
   * @method isGenisis
   * @return Boolean
   */
  isGenesis() {
    return this.header.isGenesis()
  }

  /**
   * turns the block into the canonical genesis block
   * @method setGenesisParams
   */
  setGenesisParams() {
    this.header.setGenesisParams()
  }

  /**
   * Produces a serialization of the block.
   */
  serialize(): Buffer
  serialize(rlpEncode: true): Buffer
  serialize(rlpEncode: false): [Buffer[], Buffer[], Buffer[]]
  serialize(rlpEncode = true) {
    const raw = [
      this.header.raw,
      this.transactions.map(tx => tx.raw),
      this.uncleHeaders.map(uh => uh.raw),
    ]

    return rlpEncode ? rlp.encode(raw) : raw
  }

  /**
   * Generate transaction trie. The tx trie must be generated before the transaction trie can
   * be validated with `validateTransactionTrie`
   */
  async genTxTrie() {
    for (let i = 0; i < this.transactions.length; i++) {
      const tx = this.transactions[i]
      await this._putTxInTrie(i, tx)
    }
  }

  private async _putTxInTrie(txIndex: number, tx: Transaction) {
    await new Promise((resolve, reject) => {
      this.txTrie.put(rlp.encode(txIndex), tx.serialize(), (err: any) => {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
    })
  }

  /**
   * Validates the transaction trie
   * @method validateTransactionTrie
   * @return {Boolean}
   */
  validateTransactionsTrie(): boolean {
    const txT = this.header.transactionsTrie.toString('hex')
    if (this.transactions.length) {
      return txT === this.txTrie.root.toString('hex')
    } else {
      return txT === ethUtil.KECCAK256_RLP.toString('hex')
    }
  }

  /**
   * Validates the transactions
   */
  validateTransactions(): boolean
  validateTransactions(stringError: false): boolean
  validateTransactions(stringError: true): string
  validateTransactions(stringError = false) {
    const errors: string[] = []

    this.transactions.forEach(function(tx, i) {
      const error = tx.validate(true)
      if (error) {
        errors.push(`${error} at tx ${i}`)
      }
    })

    if (!stringError) {
      return errors.length === 0
    }

    return errors.join(' ')
  }

  /**
   * Validates the entire block. Returns a string to the callback if block is invalid
   * @method validate
   * @param blockChain the blockchain that this block wants to be part of
   */
  async validate(blockChain: Blockchain) {
    await Promise.all([
      this.validateUncles(blockChain),
      this.genTxTrie(),
      this.header.validate(blockChain),
    ])

    if (!this.validateTransactionsTrie()) {
      throw new Error('invalid transaction trie')
    }

    const txErrors = this.validateTransactions(true)
    if (txErrors !== '') {
      throw new Error(txErrors)
    }

    if (!this.validateUnclesHash()) {
      throw new Error('invalid uncle hash')
    }
  }

  /**
   * Validates the uncle's hash
   */
  validateUnclesHash(): boolean {
    const raw = rlp.encode(this.uncleHeaders.map(uh => uh.raw))

    return ethUtil.keccak256(raw).toString('hex') === this.header.uncleHash.toString('hex')
  }

  /**
   * Validates the uncles that are in the block if any. Returns a string to the callback if uncles are invalid
   * @method validateUncles
   * @param {Blockchain} blockChain an instance of the Blockchain
   * @param {Function} cb the callback
   */
  async validateUncles(blockchain: Blockchain) {
    if (this.isGenesis()) {
      return
    }

    if (this.uncleHeaders.length > 2) {
      throw new Error('too many uncle headers')
    }

    const uncleHashes = this.uncleHeaders.map(header => header.hash().toString('hex'))

    if (!(new Set(uncleHashes).size === uncleHashes.length)) {
      throw new Error('duplicate uncles')
    }

    return Promise.all(this.uncleHeaders.map(async uh => this._validateUncleHeader(uh, blockchain)))
  }

  /**
   * Returns the block in JSON format
   * @see {@link https://github.com/ethereumjs/ethereumjs-util/blob/master/docs/index.md#defineproperties|ethereumjs-util}
   */
  toJSON(labeled: boolean = false) {
    if (labeled) {
      return {
        header: this.header.toJSON(true),
        transactions: this.transactions.map(tx => tx.toJSON(true)),
        uncleHeaders: this.uncleHeaders.forEach(uh => uh.toJSON(true)),
      }
    } else {
      return ethUtil.baToJSON(this.raw)
    }
  }

  private _validateUncleHeader(uncleHeader: BlockHeader, blockchain: Blockchain) {
    // TODO: Validate that the uncle header hasn't been included in the blockchain yet.
    // This is not possible in ethereumjs-blockchain since this PR was merged:
    // https://github.com/ethereumjs/ethereumjs-blockchain/pull/47

    const height = new BN(this.header.number)
    return uncleHeader.validate(blockchain, height)
  }
}
