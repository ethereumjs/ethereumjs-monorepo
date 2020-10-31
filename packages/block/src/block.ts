/* eslint-disable no-dupe-class-members */

import { BaseTrie as Trie } from 'merkle-patricia-tree'
import { BN, rlp, keccak256, KECCAK256_RLP } from 'ethereumjs-util'
import Common from '@ethereumjs/common'
import { Transaction, TxOptions } from '@ethereumjs/tx'
import { BlockHeader } from './header'
import { BlockData, BlockOptions, JsonBlock, BlockBuffer, Blockchain } from './types'

/**
 * An object that represents the block.
 */
export class Block {
  public readonly header: BlockHeader
  public readonly transactions: Transaction[] = []
  public readonly uncleHeaders: BlockHeader[] = []
  public readonly txTrie = new Trie()
  public readonly _common: Common

  public static fromBlockData(blockData: BlockData = {}, opts?: BlockOptions) {
    const { header: headerData, transactions: txsData, uncleHeaders: uhsData } = blockData

    const header = BlockHeader.fromHeaderData(headerData, opts)

    // parse transactions
    const transactions = []
    for (const txData of txsData || []) {
      const tx = Transaction.fromTxData(txData, opts as TxOptions)
      transactions.push(tx)
    }

    // parse uncle headers
    const uncleHeaders = []
    for (const uhData of uhsData || []) {
      const uh = BlockHeader.fromHeaderData(uhData, opts)
      uncleHeaders.push(uh)
    }

    return new Block(header, transactions, uncleHeaders, opts)
  }

  public static fromRLPSerializedBlock(serialized: Buffer, opts?: BlockOptions) {
    const values = (rlp.decode(serialized) as any) as BlockBuffer

    if (!Array.isArray(values)) {
      throw new Error('Invalid serialized block input. Must be array')
    }

    return Block.fromValuesArray(values, opts)
  }

  public static fromValuesArray(values: BlockBuffer, opts?: BlockOptions) {
    if (values.length > 3) {
      throw new Error('invalid block. More values than expected were received')
    }

    const [headerData, txsData, uhsData] = values

    const header = BlockHeader.fromValuesArray(headerData, opts)

    // parse transactions
    const transactions = []
    for (const txData of txsData || []) {
      transactions.push(Transaction.fromValuesArray(txData, opts))
    }

    // parse uncle headers
    const uncleHeaders = []
    for (const uncleHeaderData of uhsData || []) {
      uncleHeaders.push(BlockHeader.fromValuesArray(uncleHeaderData, opts))
    }

    return new Block(header, transactions, uncleHeaders, opts)
  }

  /**
   * Alias for Block.fromBlockData() with initWithGenesisHeader set to true.
   */
  public static genesis(blockData: BlockData = {}, opts?: BlockOptions) {
    opts = { ...opts, initWithGenesisHeader: true }
    return Block.fromBlockData(blockData, opts)
  }

  /**
   * This constructor takes the values, validates them, assigns them and freezes the object.
   * Use the static factory methods to assist in creating a Block object from varying data types and options.
   */
  constructor(
    header?: BlockHeader,
    transactions: Transaction[] = [],
    uncleHeaders: BlockHeader[] = [],
    opts: BlockOptions = {}
  ) {
    this.header = header || BlockHeader.fromHeaderData({}, opts)
    this.transactions = transactions
    this.uncleHeaders = uncleHeaders
    this._common = this.header._common

    const freeze = opts?.freeze ?? true
    if (freeze) {
      Object.freeze(this)
    }
  }

  /**
   *  Returns a Buffer Array of the raw Buffers of this block, in order.
   */
  raw(): BlockBuffer {
    return [
      this.header.raw(),
      this.transactions.map((tx) => tx.raw()),
      this.uncleHeaders.map((uh) => uh.raw()),
    ]
  }

  /**
   * Produces a hash the RLP of the block.
   */
  hash(): Buffer {
    return this.header.hash()
  }

  /**
   * Determines if this block is the genesis block.
   */
  isGenesis(): boolean {
    return this.header.isGenesis()
  }

  /**
   * Returns the rlp encoding of the block.
   */
  serialize(): Buffer {
    return rlp.encode(this.raw())
  }

  /**
   * Generates transaction trie for validation.
   */
  async genTxTrie(): Promise<void> {
    const { transactions, txTrie } = this
    for (let i = 0; i < transactions.length; i++) {
      const tx = transactions[i]
      const key = rlp.encode(i)
      const value = tx.serialize()
      await txTrie.put(key, value)
    }
  }

  /**
   * Validates the transaction trie by generating a trie
   * and do a check on the root hash.
   */
  async validateTransactionsTrie(): Promise<boolean> {
    if (this.transactions.length === 0) {
      return this.header.transactionsTrie.equals(KECCAK256_RLP)
    }

    if (this.txTrie.root.equals(KECCAK256_RLP)) {
      await this.genTxTrie()
    }

    return this.txTrie.root.equals(this.header.transactionsTrie)
  }

  /**
   * Validates transaction signatures and minimum gas requirements.
   *
   * @param stringError - If `true`, a string with the indices of the invalid txs is returned.
   */
  validateTransactions(): boolean
  validateTransactions(stringError: false): boolean
  validateTransactions(stringError: true): string[]
  validateTransactions(stringError = false) {
    const errors: string[] = []

    this.transactions.forEach(function (tx, i) {
      const errs = tx.validate(true)
      if (errs.length > 0) {
        errors.push(`errors at tx ${i}: ${errs.join(', ')}`)
      }
    })

    return stringError ? errors : errors.length === 0
  }

  /**
   * Performs the following consistency checks on the block:
   *
   * - Value checks on the header fields
   * - Signature and gasLimit validation for included txs
   * - Validation of the tx trie
   * - Consistency checks and header validation of included uncles
   *
   * Throws if invalid.
   *
   * @param blockchain - validate against a @ethereumjs/blockchain
   */
  async validate(blockchain: Blockchain): Promise<void> {
    await this.header.validate(blockchain)
    await this.validateUncles(blockchain)
    await this.validateData()
  }
  /**
   * Validates the block data, throwing if invalid.
   * This can be checked on the Block itself without needing access to any parent block
   * It checks:
   * - All transactions are valid
   * - The transactions trie is valid
   * - The uncle hash is valid
   */
  async validateData(): Promise<void> {
    const txErrors = this.validateTransactions(true)
    if (txErrors.length > 0) {
      throw new Error(`invalid transactions: ${txErrors.join(' ')}`)
    }

    const validateTxTrie = await this.validateTransactionsTrie()
    if (!validateTxTrie) {
      throw new Error('invalid transaction trie')
    }

    if (!this.validateUnclesHash()) {
      throw new Error('invalid uncle hash')
    }
  }

  /**
   * Validates the uncle's hash.
   */
  validateUnclesHash(): boolean {
    const raw = rlp.encode(this.uncleHeaders.map((uh) => uh.raw()))
    return keccak256(raw).equals(this.header.uncleHash)
  }

  /**
   * Consistency checks and header validation for uncles included
   * in the block, if any.
   *
   * Throws if invalid.
   *
   * @param blockchain - additionally validate against an @ethereumjs/blockchain instance
   */
  async validateUncles(blockchain: Blockchain): Promise<void> {
    /*
      The rules of uncles are the following:
      Uncle Header is not in canonical chain
      Uncle Header has a parentHash which points to the Canonical Chain. This parentHash is within the last 7 blocks.
      Uncle Header is not included in the canonical chain.
      Header has at most 2 uncles
      Header does not count an uncle twice.
    */

    if (this.isGenesis()) {
      return
    }

    if (this.uncleHeaders.length > 2) {
      throw new Error('too many uncle headers')
    }

    const uncleHashes = this.uncleHeaders.map((header) => header.hash().toString('hex'))
    if (!(new Set(uncleHashes).size === uncleHashes.length)) {
      throw new Error('duplicate uncles')
    }

    await this._validateUncleHeaders(this.uncleHeaders, blockchain)
  }

  /**
   * Returns the canonical difficulty for this block.
   *
   * @param parentBlock - the parent of this `Block`
   */
  canonicalDifficulty(parentBlock: Block): BN {
    return this.header.canonicalDifficulty(parentBlock.header)
  }

  /**
   * Checks that the block's `difficulty` matches the canonical difficulty.
   *
   * @param parentBlock - the parent of this `Block`
   */
  validateDifficulty(parentBlock: Block): boolean {
    return this.header.validateDifficulty(parentBlock.header)
  }

  /**
   * Validates if the block gasLimit remains in the
   * boundaries set by the protocol.
   *
   * @param parentBlock - the parent of this `Block`
   */
  validateGasLimit(parentBlock: Block): boolean {
    return this.header.validateGasLimit(parentBlock.header)
  }

  /**
   * Returns the block in JSON format.
   */
  toJSON(): JsonBlock {
    return {
      header: this.header.toJSON(),
      transactions: this.transactions.map((tx) => tx.toJSON()),
      uncleHeaders: this.uncleHeaders.map((uh) => uh.toJSON()),
    }
  }

  private async _validateUncleHeaders(uncleHeaders: BlockHeader[], blockchain: Blockchain) {
    // TODO: Validate that the uncle header hasn't been included in the blockchain yet.
    // This is not possible in ethereumjs-blockchain since this PR was merged:
    // https://github.com/ethereumjs/ethereumjs-blockchain/pull/47

    if (uncleHeaders.length == 0) {
      return
    }

    // validate the header
    for (let i = 0; i < uncleHeaders.length; i++) {
      const header = uncleHeaders[i]
      await header.validate(blockchain, this.header.number)
    }

    const canonicalBlockMap: Block[] = []

    let lowestUncleNumber = this.header.number.clone()

    uncleHeaders.map((header) => {
      if (header.number.lt(lowestUncleNumber)) {
        lowestUncleNumber = header.number.clone()
      }
    })

    const getBlocks = this.header.number.clone().sub(lowestUncleNumber).addn(1).toNumber()

    // See Geth: https://github.com/ethereum/go-ethereum/blob/b63bffe8202d46ea10ac8c4f441c582642193ac8/consensus/ethash/consensus.go#L207
    let parentHash = this.header.parentHash
    for (let i = 0; i < getBlocks; i++) {
      const parentBlock = await this._getBlockByHash(blockchain, parentHash)
      if (!parentBlock) {
        throw new Error('could not find parent block')
      }
      canonicalBlockMap.push(parentBlock)
      parentHash = parentBlock.header.parentHash
    }

    canonicalBlockMap.map((block) => {
      uncleHeaders.map((uh) => {
        if (uh.hash().equals(block.hash())) {
          // the uncle is part of the canonical chain.
          throw new Error('The uncle is part of the canonical chain.')
        }
      })
    })

    uncleHeaders.map((uh: BlockHeader) => {
      const hash = uh.parentHash
      const filterCanonicalBlocks = canonicalBlockMap.filter((block: Block) => {
        return block.hash().equals(hash)
      })
      if (filterCanonicalBlocks.length == 0) {
        throw 'The parent hash of the uncle header is not part of the canonical chain.'
      }
    })
  }

  private async _getBlockByHash(blockchain: Blockchain, hash: Buffer): Promise<Block | undefined> {
    try {
      const block = await blockchain.getBlock(hash)
      return block
    } catch (error) {
      if (error.type === 'NotFoundError') {
        return undefined
      } else {
        throw error
      }
    }
  }
}
