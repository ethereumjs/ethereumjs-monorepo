import Common from 'ethereumjs-common'
import * as ethUtil from 'ethereumjs-util'
import { BN, rlp } from 'ethereumjs-util'
import { Transaction } from 'ethereumjs-tx'

import { BlockHeader } from './header'
import { Blockchain, BlockData, ChainOptions } from './types'

const Trie = require('merkle-patricia-tree')

/**
 * An object that represents the block
 */
export class Block {
  public readonly header: BlockHeader
  public readonly transactions: Transaction[] = []
  public readonly uncleHeaders: BlockHeader[] = []
  public readonly txTrie = new Trie()

  private readonly _common: Common

  /**
   * Creates a new block object
   *
   * @param data - The block's data.
   * @param opts - The network options for this block, and its header, uncle headers and txs.
   */
  constructor(
    data: Buffer | [Buffer[], Buffer[], Buffer[]] | BlockData = {},
    opts: ChainOptions = {},
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
      // TODO: Compute the hardfork based on this block's number. It can be implemented right now
      // because the block number is not immutable, so the Common can get out of sync.
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
      this.header = new BlockHeader(data[0], { common: this._common })
      rawTransactions = data[1]
      rawUncleHeaders = data[2]
    } else {
      this.header = new BlockHeader(data.header, { common: this._common })
      rawTransactions = data.transactions || []
      rawUncleHeaders = data.uncleHeaders || []
    }

    // parse uncle headers
    for (let i = 0; i < rawUncleHeaders.length; i++) {
      this.uncleHeaders.push(new BlockHeader(rawUncleHeaders[i], opts))
    }

    // parse transactions
    for (let i = 0; i < rawTransactions.length; i++) {
      // TODO: Pass the common object instead of the options. It can't be implemented right now
      // because the hardfork may be `null`. Read the above TODO for more info.
      const tx = new Transaction(rawTransactions[i], opts)
      this.transactions.push(tx)
    }
  }

  get raw(): [Buffer[], Buffer[], Buffer[]] {
    return this.serialize(false)
  }

  /**
   * Produces a hash the RLP of the block
   */
  hash(): Buffer {
    return this.header.hash()
  }

  /**
   * Determines if this block is the genesis block
   */
  isGenesis(): boolean {
    return this.header.isGenesis()
  }

  /**
   * Turns the block into the canonical genesis block
   */
  setGenesisParams(): void {
    this.header.setGenesisParams()
  }

  /**
   * Produces a serialization of the block.
   *
   * @param rlpEncode - If `true`, the returned object is the RLP encoded data as seen by the
   * Ethereum wire protocol. If `false`, a tuple with the raw data of the header, the txs and the
   * uncle headers is returned.
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
  async genTxTrie(): Promise<void> {
    for (let i = 0; i < this.transactions.length; i++) {
      const tx = this.transactions[i]
      await this._putTxInTrie(i, tx)
    }
  }

  /**
   * Validates the transaction trie
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
   *
   * @param stringError - If `true`, a string with the indices of the invalid txs is returned.
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
   * Validates the entire block, throwing if invalid.
   *
   * @param blockChain - the blockchain that this block wants to be part of
   */
  async validate(blockChain: Blockchain): Promise<void> {
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
   * Validates the uncles that are in the block, if any. This method throws if they are invalid.
   *
   * @param blockChain - the blockchain that this block wants to be part of
   */
  async validateUncles(blockchain: Blockchain): Promise<void> {
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

    await Promise.all(this.uncleHeaders.map(async uh => this._validateUncleHeader(uh, blockchain)))
  }

  /**
   * Returns the block in JSON format
   *
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

  private _validateUncleHeader(uncleHeader: BlockHeader, blockchain: Blockchain) {
    // TODO: Validate that the uncle header hasn't been included in the blockchain yet.
    // This is not possible in ethereumjs-blockchain since this PR was merged:
    // https://github.com/ethereumjs/ethereumjs-blockchain/pull/47

    const height = new BN(this.header.number)
    return uncleHeader.validate(blockchain, height)
  }
}
