import { ConsensusType } from '@ethereumjs/common'
import { RLP } from '@ethereumjs/rlp'
import { Trie } from '@ethereumjs/trie'
import { BlobEIP4844Transaction, Capability, TransactionFactory } from '@ethereumjs/tx'
import {
  KECCAK256_RLP,
  Withdrawal,
  bigIntToHex,
  bytesToHex,
  bytesToPrefixedHexString,
  equalsBytes,
  fetchFromProvider,
  getProvider,
  hexStringToBytes,
  intToHex,
  isHexPrefixed,
} from '@ethereumjs/util'
import { keccak256 } from 'ethereum-cryptography/keccak'

import { executionPayloadFromBeaconPayload } from './from-beacon-payload'
import { blockFromRpc } from './from-rpc'
import { BlockHeader } from './header'

import type { BeaconPayloadJson } from './from-beacon-payload'
import type {
  BlockBytes,
  BlockData,
  BlockOptions,
  ExecutionPayload,
  HeaderData,
  JsonBlock,
  JsonRpcBlock,
} from './types'
import type { Common } from '@ethereumjs/common'
import type {
  FeeMarketEIP1559Transaction,
  Transaction,
  TxOptions,
  TypedTransaction,
} from '@ethereumjs/tx'
import type { EthersProvider, WithdrawalBytes } from '@ethereumjs/util'

/**
 * An object that represents the block.
 */
export class Block {
  public readonly header: BlockHeader
  public readonly transactions: TypedTransaction[] = []
  public readonly uncleHeaders: BlockHeader[] = []
  public readonly withdrawals?: Withdrawal[]
  public readonly txTrie = new Trie()
  public readonly _common: Common

  /**
   * Returns the withdrawals trie root for array of Withdrawal.
   * @param wts array of Withdrawal to compute the root of
   * @param optional emptyTrie to use to generate the root
   */
  public static async genWithdrawalsTrieRoot(wts: Withdrawal[], emptyTrie?: Trie) {
    const trie = emptyTrie ?? new Trie()
    for (const [i, wt] of wts.entries()) {
      await trie.put(RLP.encode(i), RLP.encode(wt.raw()))
    }
    return trie.root()
  }

  /**
   * Returns the txs trie root for array of TypedTransaction
   * @param txs array of TypedTransaction to compute the root of
   * @param optional emptyTrie to use to generate the root
   */
  public static async genTransactionsTrieRoot(txs: TypedTransaction[], emptyTrie?: Trie) {
    const trie = emptyTrie ?? new Trie()
    for (const [i, tx] of txs.entries()) {
      await trie.put(RLP.encode(i), tx.serialize())
    }
    return trie.root()
  }

  /**
   * Static constructor to create a block from a block data dictionary
   *
   * @param blockData
   * @param opts
   */
  public static fromBlockData(blockData: BlockData = {}, opts?: BlockOptions) {
    const {
      header: headerData,
      transactions: txsData,
      uncleHeaders: uhsData,
      withdrawals: withdrawalsData,
    } = blockData
    const header = BlockHeader.fromHeaderData(headerData, opts)

    // parse transactions
    const transactions = []
    for (const txData of txsData ?? []) {
      const tx = TransactionFactory.fromTxData(txData, {
        ...opts,
        // Use header common in case of hardforkByBlockNumber being activated
        common: header._common,
      } as TxOptions)
      transactions.push(tx)
    }

    // parse uncle headers
    const uncleHeaders = []
    const uncleOpts: BlockOptions = {
      hardforkByBlockNumber: true,
      ...opts,
      // Use header common in case of hardforkByBlockNumber being activated
      common: header._common,
      // Disable this option here (all other options carried over), since this overwrites the provided Difficulty to an incorrect value
      calcDifficultyFromHeader: undefined,
      // This potentially overwrites hardforkBy options but we will set them cleanly just below
      hardforkByTTD: undefined,
    }
    // Uncles are obsolete post-merge, any hardfork by option implies hardforkByBlockNumber
    if (opts?.hardforkByTTD !== undefined) {
      uncleOpts.hardforkByBlockNumber = true
    }
    for (const uhData of uhsData ?? []) {
      const uh = BlockHeader.fromHeaderData(uhData, uncleOpts)
      uncleHeaders.push(uh)
    }

    const withdrawals = withdrawalsData?.map(Withdrawal.fromWithdrawalData)

    return new Block(header, transactions, uncleHeaders, withdrawals, opts)
  }

  /**
   * Static constructor to create a block from a RLP-serialized block
   *
   * @param serialized
   * @param opts
   */
  public static fromRLPSerializedBlock(serialized: Uint8Array, opts?: BlockOptions) {
    const values = RLP.decode(Uint8Array.from(serialized)) as BlockBytes

    if (!Array.isArray(values)) {
      throw new Error('Invalid serialized block input. Must be array')
    }

    return Block.fromValuesArray(values, opts)
  }

  /**
   * Static constructor to create a block from an array of Bytes values
   *
   * @param values
   * @param opts
   */
  public static fromValuesArray(values: BlockBytes, opts?: BlockOptions) {
    if (values.length > 4) {
      throw new Error('invalid block. More values than expected were received')
    }

    // First try to load header so that we can use its common (in case of hardforkByBlockNumber being activated)
    // to correctly make checks on the hardforks
    const [headerData, txsData, uhsData, withdrawalBytes] = values
    const header = BlockHeader.fromValuesArray(headerData, opts)

    if (
      header._common.isActivatedEIP(4895) &&
      (values[3] === undefined || !Array.isArray(values[3]))
    ) {
      throw new Error(
        'Invalid serialized block input: EIP-4895 is active, and no withdrawals were provided as array'
      )
    }

    // parse transactions
    const transactions = []
    for (const txData of txsData ?? []) {
      transactions.push(
        TransactionFactory.fromBlockBodyData(txData, {
          ...opts,
          // Use header common in case of hardforkByBlockNumber being activated
          common: header._common,
        })
      )
    }

    // parse uncle headers
    const uncleHeaders = []
    const uncleOpts: BlockOptions = {
      hardforkByBlockNumber: true,
      ...opts,
      // Use header common in case of hardforkByBlockNumber being activated
      common: header._common,
      // Disable this option here (all other options carried over), since this overwrites the provided Difficulty to an incorrect value
      calcDifficultyFromHeader: undefined,
      // This potentially overwrites hardforkBy options but we will set them cleanly just below
      hardforkByTTD: undefined,
    }
    // Uncles are obsolete post-merge, any hardfork by option implies hardforkByBlockNumber
    if (opts?.hardforkByTTD !== undefined) {
      uncleOpts.hardforkByBlockNumber = true
    }
    for (const uncleHeaderData of uhsData ?? []) {
      uncleHeaders.push(BlockHeader.fromValuesArray(uncleHeaderData, uncleOpts))
    }

    const withdrawals = (withdrawalBytes as WithdrawalBytes[])
      ?.map(([index, validatorIndex, address, amount]) => ({
        index,
        validatorIndex,
        address,
        amount,
      }))
      ?.map(Withdrawal.fromWithdrawalData)

    return new Block(header, transactions, uncleHeaders, withdrawals, opts)
  }

  /**
   * Creates a new block object from Ethereum JSON RPC.
   *
   * @param blockParams - Ethereum JSON RPC of block (eth_getBlockByNumber)
   * @param uncles - Optional list of Ethereum JSON RPC of uncles (eth_getUncleByBlockHashAndIndex)
   * @param options - An object describing the blockchain
   */
  public static fromRPC(blockData: JsonRpcBlock, uncles?: any[], opts?: BlockOptions) {
    return blockFromRpc(blockData, uncles, opts)
  }

  /**
   *  Method to retrieve a block from a JSON-RPC provider and format as a {@link Block}
   * @param provider either a url for a remote provider or an Ethers JsonRpcProvider object
   * @param blockTag block hash or block number to be run
   * @param opts {@link BlockOptions}
   * @returns the block specified by `blockTag`
   */
  public static fromJsonRpcProvider = async (
    provider: string | EthersProvider,
    blockTag: string | bigint,
    opts: BlockOptions
  ) => {
    let blockData
    const providerUrl = getProvider(provider)

    if (typeof blockTag === 'string' && blockTag.length === 66) {
      blockData = await fetchFromProvider(providerUrl, {
        method: 'eth_getBlockByHash',
        params: [blockTag, true],
      })
    } else if (typeof blockTag === 'bigint') {
      blockData = await fetchFromProvider(providerUrl, {
        method: 'eth_getBlockByNumber',
        params: [bigIntToHex(blockTag), true],
      })
    } else if (
      isHexPrefixed(blockTag) ||
      blockTag === 'latest' ||
      blockTag === 'earliest' ||
      blockTag === 'pending' ||
      blockTag === 'finalized' ||
      blockTag === 'safe'
    ) {
      blockData = await fetchFromProvider(providerUrl, {
        method: 'eth_getBlockByNumber',
        params: [blockTag, true],
      })
    } else {
      throw new Error(
        `expected blockTag to be block hash, bigint, hex prefixed string, or earliest/latest/pending; got ${blockTag}`
      )
    }

    if (blockData === null) {
      throw new Error('No block data returned from provider')
    }

    const uncleHeaders = []
    if (blockData.uncles.length > 0) {
      for (let x = 0; x < blockData.uncles.length; x++) {
        const headerData = await fetchFromProvider(providerUrl, {
          method: 'eth_getUncleByBlockHashAndIndex',
          params: [blockData.hash, intToHex(x)],
        })
        uncleHeaders.push(headerData)
      }
    }

    return blockFromRpc(blockData, uncleHeaders, opts)
  }

  /**
   *  Method to retrieve a block from an execution payload
   * @param execution payload constructed from beacon payload
   * @param opts {@link BlockOptions}
   * @returns the block constructed block
   */
  public static async fromExecutionPayload(
    payload: ExecutionPayload,
    options?: BlockOptions
  ): Promise<Block> {
    const {
      blockNumber: number,
      receiptsRoot: receiptTrie,
      prevRandao: mixHash,
      feeRecipient: coinbase,
      transactions,
      withdrawals: withdrawalsData,
    } = payload

    const txs = []
    for (const [index, serializedTx] of transactions.entries()) {
      try {
        const tx = TransactionFactory.fromSerializedData(hexStringToBytes(serializedTx), {
          common: options?.common,
        })
        txs.push(tx)
      } catch (error) {
        const validationError = `Invalid tx at index ${index}: ${error}`
        throw validationError
      }
    }

    const transactionsTrie = await Block.genTransactionsTrieRoot(txs)
    const withdrawals = withdrawalsData?.map((wData) => Withdrawal.fromWithdrawalData(wData))
    const withdrawalsRoot = withdrawals
      ? await Block.genWithdrawalsTrieRoot(withdrawals)
      : undefined
    const header: HeaderData = {
      ...payload,
      number,
      receiptTrie,
      transactionsTrie,
      withdrawalsRoot,
      mixHash,
      coinbase,
    }

    // we are not setting hardforkByBlockNumber or hardforkByTTD as common is already
    // correctly set to the correct hf
    const block = Block.fromBlockData({ header, transactions: txs, withdrawals }, options)
    // Verify blockHash matches payload
    if (!equalsBytes(block.hash(), hexStringToBytes(payload.blockHash))) {
      const validationError = `Invalid blockHash, expected: ${
        payload.blockHash
      }, received: ${bytesToPrefixedHexString(block.hash())}`
      throw Error(validationError)
    }

    return block
  }

  /**
   *  Method to retrieve a block from a beacon payload json
   * @param payload json of a beacon beacon fetched from beacon apis
   * @param opts {@link BlockOptions}
   * @returns the block constructed block
   */
  public static async fromBeaconPayloadJson(
    payload: BeaconPayloadJson,
    options?: BlockOptions
  ): Promise<Block> {
    const executionPayload = executionPayloadFromBeaconPayload(payload)
    return Block.fromExecutionPayload(executionPayload, options)
  }

  /**
   * This constructor takes the values, validates them, assigns them and freezes the object.
   * Use the static factory methods to assist in creating a Block object from varying data types and options.
   */
  constructor(
    header?: BlockHeader,
    transactions: TypedTransaction[] = [],
    uncleHeaders: BlockHeader[] = [],
    withdrawals?: Withdrawal[],
    opts: BlockOptions = {}
  ) {
    this.header = header ?? BlockHeader.fromHeaderData({}, opts)
    this._common = this.header._common

    this.transactions = transactions
    this.withdrawals = withdrawals ?? (this._common.isActivatedEIP(4895) ? [] : undefined)
    this.uncleHeaders = uncleHeaders
    if (uncleHeaders.length > 0) {
      this.validateUncles()
      if (this._common.consensusType() === ConsensusType.ProofOfAuthority) {
        const msg = this._errorMsg(
          'Block initialization with uncleHeaders on a PoA network is not allowed'
        )
        throw new Error(msg)
      }
      if (this._common.consensusType() === ConsensusType.ProofOfStake) {
        const msg = this._errorMsg(
          'Block initialization with uncleHeaders on a PoS network is not allowed'
        )
        throw new Error(msg)
      }
    }

    if (!this._common.isActivatedEIP(4895) && withdrawals !== undefined) {
      throw new Error('Cannot have a withdrawals field if EIP 4895 is not active')
    }

    const freeze = opts?.freeze ?? true
    if (freeze) {
      Object.freeze(this)
    }
  }

  /**
   * Returns a Array of the raw Bytes Arays of this block, in order.
   */
  raw(): BlockBytes {
    const bytesArray = <BlockBytes>[
      this.header.raw(),
      this.transactions.map((tx) =>
        tx.supports(Capability.EIP2718TypedTransaction) ? tx.serialize() : tx.raw()
      ) as Uint8Array[],
      this.uncleHeaders.map((uh) => uh.raw()),
    ]
    const withdrawalsRaw = this.withdrawals?.map((wt) => wt.raw())
    if (withdrawalsRaw) {
      bytesArray.push(withdrawalsRaw)
    }
    return bytesArray
  }

  /**
   * Returns the hash of the block.
   */
  hash(): Uint8Array {
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
  serialize(): Uint8Array {
    return RLP.encode(this.raw())
  }

  /**
   * Generates transaction trie for validation.
   */
  async genTxTrie(): Promise<void> {
    const { transactions, txTrie } = this
    await Block.genTransactionsTrieRoot(transactions, txTrie)
  }

  /**
   * Validates the transaction trie by generating a trie
   * and do a check on the root hash.
   */
  async validateTransactionsTrie(): Promise<boolean> {
    let result
    if (this.transactions.length === 0) {
      result = equalsBytes(this.header.transactionsTrie, KECCAK256_RLP)
      return result
    }

    if (equalsBytes(this.txTrie.root(), KECCAK256_RLP)) {
      await this.genTxTrie()
    }
    result = equalsBytes(this.txTrie.root(), this.header.transactionsTrie)
    return result
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
    let dataGasUsed = BigInt(0)
    const dataGasLimit = this._common.param('gasConfig', 'maxDataGasPerBlock')
    const dataGasPerBlob = this._common.param('gasConfig', 'dataGasPerBlob')

    // eslint-disable-next-line prefer-const
    for (let [i, tx] of this.transactions.entries()) {
      const errs = <string[]>tx.validate(true)
      if (this._common.isActivatedEIP(1559) === true) {
        if (tx.supports(Capability.EIP1559FeeMarket)) {
          tx = tx as FeeMarketEIP1559Transaction
          if (tx.maxFeePerGas < this.header.baseFeePerGas!) {
            errs.push('tx unable to pay base fee (EIP-1559 tx)')
          }
        } else {
          tx = tx as Transaction
          if (tx.gasPrice < this.header.baseFeePerGas!) {
            errs.push('tx unable to pay base fee (non EIP-1559 tx)')
          }
        }
      }
      if (this._common.isActivatedEIP(4844) === true) {
        if (tx instanceof BlobEIP4844Transaction) {
          dataGasUsed += BigInt(tx.numBlobs()) * dataGasPerBlob
          if (dataGasUsed > dataGasLimit) {
            errs.push(
              `tx causes total data gas of ${dataGasUsed} to exceed maximum data gas per block of ${dataGasLimit}`
            )
          }
        }
      }
      if (errs.length > 0) {
        errors.push(`errors at tx ${i}: ${errs.join(', ')}`)
      }
    }

    if (this._common.isActivatedEIP(4844) === true) {
      if (dataGasUsed !== this.header.dataGasUsed) {
        errors.push(`invalid dataGasUsed expected=${this.header.dataGasUsed} actual=${dataGasUsed}`)
      }
    }

    return stringError ? errors : errors.length === 0
  }

  /**
   * Validates the block data, throwing if invalid.
   * This can be checked on the Block itself without needing access to any parent block
   * It checks:
   * - All transactions are valid
   * - The transactions trie is valid
   * - The uncle hash is valid
   * @param onlyHeader if only passed the header, skip validating txTrie and unclesHash (default: false)
   */
  async validateData(onlyHeader: boolean = false): Promise<void> {
    const txErrors = this.validateTransactions(true)
    if (txErrors.length > 0) {
      const msg = this._errorMsg(`invalid transactions: ${txErrors.join(' ')}`)
      throw new Error(msg)
    }

    if (onlyHeader) {
      return
    }

    const validateTxTrie = await this.validateTransactionsTrie()
    if (!validateTxTrie) {
      const msg = this._errorMsg('invalid transaction trie')
      throw new Error(msg)
    }

    if (!this.validateUnclesHash()) {
      const msg = this._errorMsg('invalid uncle hash')
      throw new Error(msg)
    }

    if (this._common.isActivatedEIP(4895) && !(await this.validateWithdrawalsTrie())) {
      const msg = this._errorMsg('invalid withdrawals trie')
      throw new Error(msg)
    }
  }

  /**
   * Validates that data gas fee for each transaction is greater than or equal to the
   * dataGasPrice for the block and that total data gas in block is less than maximum
   * data gas per block
   * @param parentHeader header of parent block
   */
  validateBlobTransactions(parentHeader: BlockHeader) {
    if (this._common.isActivatedEIP(4844)) {
      const dataGasLimit = this._common.param('gasConfig', 'maxDataGasPerBlock')
      const dataGasPerBlob = this._common.param('gasConfig', 'dataGasPerBlob')
      let dataGasUsed = BigInt(0)

      for (const tx of this.transactions) {
        if (tx instanceof BlobEIP4844Transaction) {
          const dataGasPrice = this.header.getDataGasPrice()
          if (tx.maxFeePerDataGas < dataGasPrice) {
            throw new Error(
              `blob transaction maxFeePerDataGas ${
                tx.maxFeePerDataGas
              } < than block data gas price ${dataGasPrice} - ${this.errorStr()}`
            )
          }

          dataGasUsed += BigInt(tx.versionedHashes.length) * dataGasPerBlob

          if (dataGasUsed > dataGasLimit) {
            throw new Error(
              `tx causes total data gas of ${dataGasUsed} to exceed maximum data gas per block of ${dataGasLimit}`
            )
          }
        }
      }

      if (this.header.dataGasUsed !== dataGasUsed) {
        throw new Error(
          `block dataGasUsed mismatch: have ${this.header.dataGasUsed}, want ${dataGasUsed}`
        )
      }

      const expectedExcessDataGas = parentHeader.calcNextExcessDataGas()
      if (this.header.excessDataGas !== expectedExcessDataGas) {
        throw new Error(
          `block excessDataGas mismatch: have ${this.header.excessDataGas}, want ${expectedExcessDataGas}`
        )
      }
    }
  }

  /**
   * Validates the uncle's hash.
   */
  validateUnclesHash(): boolean {
    const uncles = this.uncleHeaders.map((uh) => uh.raw())
    const raw = RLP.encode(uncles)
    return equalsBytes(keccak256(raw), this.header.uncleHash)
  }

  /**
   * Validates the withdrawal root
   */
  async validateWithdrawalsTrie(): Promise<boolean> {
    if (!this._common.isActivatedEIP(4895)) {
      throw new Error('EIP 4895 is not activated')
    }
    const withdrawalsRoot = await Block.genWithdrawalsTrieRoot(this.withdrawals!)
    return equalsBytes(withdrawalsRoot, this.header.withdrawalsRoot!)
  }

  /**
   * Consistency checks for uncles included in the block, if any.
   *
   * Throws if invalid.
   *
   * The rules for uncles checked are the following:
   * Header has at most 2 uncles.
   * Header does not count an uncle twice.
   */
  validateUncles() {
    if (this.isGenesis()) {
      return
    }

    // Header has at most 2 uncles
    if (this.uncleHeaders.length > 2) {
      const msg = this._errorMsg('too many uncle headers')
      throw new Error(msg)
    }

    // Header does not count an uncle twice.
    const uncleHashes = this.uncleHeaders.map((header) => bytesToHex(header.hash()))
    if (!(new Set(uncleHashes).size === uncleHashes.length)) {
      const msg = this._errorMsg('duplicate uncles')
      throw new Error(msg)
    }
  }

  /**
   * Returns the canonical difficulty for this block.
   *
   * @param parentBlock - the parent of this `Block`
   */
  ethashCanonicalDifficulty(parentBlock: Block): bigint {
    return this.header.ethashCanonicalDifficulty(parentBlock.header)
  }

  /**
   * Validates if the block gasLimit remains in the boundaries set by the protocol.
   * Throws if invalid
   *
   * @param parentBlock - the parent of this `Block`
   */
  validateGasLimit(parentBlock: Block) {
    return this.header.validateGasLimit(parentBlock.header)
  }

  /**
   * Returns the block in JSON format.
   */
  toJSON(): JsonBlock {
    const withdrawalsAttr = this.withdrawals
      ? {
          withdrawals: this.withdrawals.map((wt) => wt.toJSON()),
        }
      : {}
    return {
      header: this.header.toJSON(),
      transactions: this.transactions.map((tx) => tx.toJSON()),
      uncleHeaders: this.uncleHeaders.map((uh) => uh.toJSON()),
      ...withdrawalsAttr,
    }
  }

  /**
   * Return a compact error string representation of the object
   */
  public errorStr() {
    let hash = ''
    try {
      hash = bytesToHex(this.hash())
    } catch (e: any) {
      hash = 'error'
    }
    let hf = ''
    try {
      hf = this._common.hardfork()
    } catch (e: any) {
      hf = 'error'
    }
    let errorStr = `block number=${this.header.number} hash=${hash} `
    errorStr += `hf=${hf} baseFeePerGas=${this.header.baseFeePerGas ?? 'none'} `
    errorStr += `txs=${this.transactions.length} uncles=${this.uncleHeaders.length}`
    return errorStr
  }

  /**
   * Internal helper function to create an annotated error message
   *
   * @param msg Base error message
   * @hidden
   */
  protected _errorMsg(msg: string) {
    return `${msg} (${this.errorStr()})`
  }
}
