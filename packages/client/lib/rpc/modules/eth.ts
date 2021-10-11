import { Block } from '@ethereumjs/block'
import { ConsensusType } from '@ethereumjs/common'
import { Transaction, TransactionFactory, JsonTx } from '@ethereumjs/tx'
import {
  Account,
  Address,
  BN,
  bufferToHex,
  bnToHex,
  intToHex,
  toBuffer,
  stripHexPrefix,
  setLengthLeft,
} from 'ethereumjs-util'
import { decode } from 'rlp'
import { middleware, validators } from '../validation'
import { INTERNAL_ERROR, INVALID_PARAMS, PARSE_ERROR } from '../error-code'
import { RpcTx } from '../types'
import type { Chain } from '../../blockchain'
import type { EthereumClient } from '../..'
import { EthereumService } from '../../service'
import { FullSynchronizer } from '../../sync'
import type { EthProtocol } from '../../net/protocol'
import type VM from '@ethereumjs/vm'

// Based on https://eth.wiki/json-rpc/API
type StandardJsonRpcBlockParams = {
  number: string // the block number. null when pending block.
  hash: string // hash of the block. null when pending block.
  parentHash: string // hash of the parent block.
  nonce: string // hash of the generated proof-of-work. null when pending block.
  sha3Uncles: string // SHA3 of the uncles data in the block.
  logsBloom: string // the bloom filter for the logs of the block. null when pending block.
  transactionsRoot: string // the root of the transaction trie of the block.
  stateRoot: string // the root of the final state trie of the block.
  receiptsRoot: string // the root of the receipts trie of the block.
  miner: string // the address of the beneficiary to whom the mining rewards were given.
  difficulty: string // integer of the difficulty for this block.
  totalDifficulty: string // integer of the total difficulty of the chain until this block.
  extraData: string // the “extra data” field of this block.
  size: string // integer the size of this block in bytes.
  gasLimit: string // the maximum gas allowed in this block.
  gasUsed: string // the total used gas by all transactions in this block.
  timestamp: string // the unix timestamp for when the block was collated.
  transactions: JsonTx[] | string[] // Array of transaction objects, or 32 Bytes transaction hashes depending on the last given parameter.
  uncles: string[] // Array of uncle hashes
  baseFeePerGas?: string // If EIP-1559 is enabled for this block, returns the base fee per gas
}

type GetLogsParamsObject = {
  fromBlock?: string // QUANTITY, integer block number or "earliest" or "latest"
  toBlock?: string // QUANTITY, integer block number or "earliest" or "latest"
  address?: string // DATA, 20 Bytes, address
  topics?: string[] // DATA, array
  blockHash?: string // DATA, 32 Bytes. With the addition of EIP-234,
  // blockHash restricts the logs returned to the single block with
  // the 32-byte hash blockHash. Using blockHash is equivalent to
  // fromBlock = toBlock = the block number with hash blockHash.
  // If blockHash is present in in the filter criteria, then
  // neither fromBlock nor toBlock are allowed.
}

const blockToStandardJsonRpcFields = async (
  block: Block,
  chain: Chain,
  includeTransactions: boolean
): Promise<StandardJsonRpcBlockParams> => {
  const json = block.toJSON()
  const header = json!.header!

  let transactions
  if (includeTransactions) {
    transactions = block.transactions.map((tx) => bufferToHex(tx.serialize()))
  } else {
    transactions = block.transactions.map((tx) => bufferToHex(tx.hash()))
  }

  const td = await chain.getTd(block.hash(), block.header.number)

  return {
    number: header.number!,
    hash: bufferToHex(block.hash()),
    parentHash: header.parentHash!,
    nonce: header.nonce!,
    sha3Uncles: header.uncleHash!,
    logsBloom: header.logsBloom!,
    transactionsRoot: header.transactionsTrie!,
    stateRoot: header.stateRoot!,
    receiptsRoot: header.receiptTrie!,
    miner: header.coinbase!,
    difficulty: header.difficulty!,
    totalDifficulty: bnToHex(td),
    extraData: header.extraData!,
    size: intToHex(Buffer.byteLength(JSON.stringify(json))),
    gasLimit: header.gasLimit!,
    gasUsed: header.gasUsed!,
    timestamp: header.timestamp!,
    transactions,
    uncles: block.uncleHeaders.map((uh) => bufferToHex(uh.hash())),
    baseFeePerGas: header.baseFeePerGas,
  }
}

/**
 * eth_* RPC module
 * @memberof module:rpc/modules
 */
export class Eth {
  private client: EthereumClient
  private service: EthereumService
  private _chain: Chain
  private _vm: VM | undefined
  public ethVersion: number

  /**
   * Create eth_* RPC module
   * @param client Client to which the module binds
   */
  constructor(client: EthereumClient) {
    this.client = client
    this.service = client.services.find((s) => s.name === 'eth') as EthereumService
    this._chain = this.service.chain
    this._vm = (this.service.synchronizer as any)?.execution?.vm

    const ethProtocol = this.service.protocols.find((p) => p.name === 'eth') as EthProtocol
    this.ethVersion = Math.max(...ethProtocol.versions)

    this.blockNumber = middleware(this.blockNumber.bind(this), 0)

    this.call = middleware(this.call.bind(this), 2, [
      [validators.transaction(['to'])],
      [validators.blockOption],
    ])

    this.chainId = middleware(this.chainId.bind(this), 0, [])

    this.estimateGas = middleware(this.estimateGas.bind(this), 2, [
      [validators.transaction()],
      [validators.blockOption],
    ])

    this.getBalance = middleware(this.getBalance.bind(this), 2, [
      [validators.address],
      [validators.blockOption],
    ])

    this.getBlockByNumber = middleware(this.getBlockByNumber.bind(this), 2, [
      [validators.blockOption],
      [validators.bool],
    ])

    this.getBlockByHash = middleware(this.getBlockByHash.bind(this), 2, [
      [validators.hex, validators.blockHash],
      [validators.bool],
    ])

    this.getBlockTransactionCountByHash = middleware(
      this.getBlockTransactionCountByHash.bind(this),
      1,
      [[validators.hex, validators.blockHash]]
    )

    this.getCode = middleware(this.getCode.bind(this), 2, [
      [validators.address],
      [validators.blockOption],
    ])

    this.getStorageAt = middleware(this.getStorageAt.bind(this), 3, [
      [validators.address],
      [validators.hex],
      [validators.blockOption],
    ])

    this.getTransactionCount = middleware(this.getTransactionCount.bind(this), 2, [
      [validators.address],
      [validators.blockOption],
    ])

    this.getLogs = middleware(this.getLogs.bind(this), 1, [
      [
        validators.object({
          fromBlock: validators.blockOption,
          toBlock: validators.blockOption,
          address: validators.address,
          topics: validators.array(validators.hex),
          // TODO: blockHash would be nice to have
          // (but not required for first iteration)
          // also...create a validators.optional() modifier
          // so we can do:
          //blockHash: validators.optional(validators.blockHash),
        }),
      ],
    ])

    this.sendRawTransaction = middleware(this.sendRawTransaction.bind(this), 1, [[validators.hex]])

    this.protocolVersion = middleware(this.protocolVersion.bind(this), 0, [])

    this.syncing = middleware(this.syncing.bind(this), 0, [])
  }

  /**
   * Returns number of the most recent block.
   * @param params An empty array
   */
  async blockNumber(_params = []) {
    const latestHeader = await this._chain.getLatestHeader()
    return bnToHex(latestHeader.number)
  }

  /**
   * Executes a new message call immediately without creating a transaction on the block chain.
   * Currently only "latest" block is supported.
   * @param params An array of two parameters:
   *   1. The transaction object
   *       * from (optional) - The address the transaction is sent from
   *       * to - The address the transaction is directed to
   *       * gas (optional) - Integer of the gas provided for the transaction execution
   *       * gasPrice (optional) - Integer of the gasPrice used for each paid gas
   *       * value (optional) - Integer of the value sent with this transaction
   *       * data (optional) - Hash of the method signature and encoded parameters.
   *   2. integer block number, or the string "latest", "earliest" or "pending"
   * @returns The return value of the executed contract.
   */
  async call(params: [RpcTx, string]) {
    const [transaction, blockOpt] = params

    if (!this._vm) {
      throw new Error('missing vm')
    }

    // use a copy of the vm in case new blocks are executed,
    // and to not make any underlying changes during the call
    const vm = this._vm.copy()

    if (blockOpt !== 'latest') {
      const latest = await vm.blockchain.getLatestHeader()
      if (blockOpt !== bnToHex(latest.number)) {
        throw {
          code: INVALID_PARAMS,
          message: `Currently only "latest" block supported`,
        }
      }
    }

    if (!transaction.gas) {
      // If no gas limit is specified use the last block gas limit as an upper bound.
      const latest = await vm.blockchain.getLatestHeader()
      transaction.gas = latest.gasLimit as any
    }

    const txData = { ...transaction, gasLimit: transaction.gas }
    const tx = Transaction.fromTxData(txData, { common: vm._common, freeze: false })

    // set from address
    const from = transaction.from ? Address.fromString(transaction.from) : Address.zero()
    tx.getSenderAddress = () => {
      return from
    }

    const { execResult } = await vm.runTx({ tx, skipNonce: true })
    return bufferToHex(execResult.returnValue)
  }

  /**
   * Returns the currently configured chain id, a value used in replay-protected transaction signing as introduced by EIP-155.
   * @param _params An empty array
   * @returns The chain ID.
   */
  async chainId(_params = []) {
    const chainId = this._chain.config.chainCommon.chainIdBN()
    return bnToHex(chainId)
  }

  /**
   * Generates and returns an estimate of how much gas is necessary to allow the transaction to complete.
   * The transaction will not be added to the blockchain.
   * Note that the estimate may be significantly more than the amount of gas actually used by the transaction,
   * for a variety of reasons including EVM mechanics and node performance.
   * Currently only "latest" block is supported.
   * @param params An array of two parameters:
   *   1. The transaction object
   *       * from (optional) - The address the transaction is sent from
   *       * to - The address the transaction is directed to
   *       * gas (optional) - Integer of the gas provided for the transaction execution
   *       * gasPrice (optional) - Integer of the gasPrice used for each paid gas
   *       * value (optional) - Integer of the value sent with this transaction
   *       * data (optional) - Hash of the method signature and encoded parameters.
   *   2. integer block number, or the string "latest", "earliest" or "pending"
   * @returns The amount of gas used.
   */
  async estimateGas(params: [RpcTx, string]) {
    const [transaction, blockOpt] = params

    if (!this._vm) {
      throw new Error('missing vm')
    }

    // use a copy of the vm in case new blocks are executed
    const vm = this._vm.copy()

    if (blockOpt !== 'latest') {
      const latest = await vm.blockchain.getLatestHeader()
      if (blockOpt !== bnToHex(latest.number)) {
        throw {
          code: INVALID_PARAMS,
          message: `Currently only "latest" block supported`,
        }
      }
    }

    if (!transaction.gas) {
      // If no gas limit is specified use the last block gas limit as an upper bound.
      const latest = await this._chain.getLatestHeader()
      transaction.gas = latest.gasLimit as any
    }

    const txData = { ...transaction, gasLimit: transaction.gas }
    const tx = Transaction.fromTxData(txData, { common: vm._common, freeze: false })

    // set from address
    const from = transaction.from ? Address.fromString(transaction.from) : Address.zero()
    tx.getSenderAddress = () => {
      return from
    }

    const { gasUsed } = await vm.runTx({
      tx,
      skipNonce: true,
      skipBalance: true,
      skipBlockGasLimitValidation: true,
    })
    return bnToHex(gasUsed)
  }

  /**
   * Returns the balance of the account at the given address.
   * Currently only "latest" block is supported.
   * @param params An array of two parameters:
   *   1. address of the account
   *   2. integer block number, or the string "latest", "earliest" or "pending"
   */
  async getBalance(params: [string, string]) {
    const [addressHex, blockOpt] = params

    if (!this._vm) {
      throw new Error('missing vm')
    }

    // use a copy of the vm in case new blocks are sync'd
    const vm = this._vm.copy()

    if (blockOpt !== 'latest') {
      const latest = await vm.blockchain.getLatestHeader()
      if (blockOpt !== bnToHex(latest.number)) {
        throw {
          code: INVALID_PARAMS,
          message: `Currently only "latest" block supported`,
        }
      }
    }

    const address = Address.fromString(addressHex)
    const account: Account = await vm.stateManager.getAccount(address)
    return bnToHex(account.balance)
  }

  /**
   * Returns information about a block by hash.
   * @param params An array of two parameters:
   *   1. a block hash
   *   2. boolean - if true returns the full transaction objects, if false only the hashes of the transactions.
   */
  async getBlockByHash(params: [string, boolean]) {
    const [blockHash, includeTransactions] = params

    try {
      const block = await this._chain.getBlock(toBuffer(blockHash))
      return await blockToStandardJsonRpcFields(block, this._chain, includeTransactions)
    } catch (error) {
      throw {
        code: INVALID_PARAMS,
        message: 'Unknown block',
      }
    }
  }

  /**
   * Returns information about a block by block number.
   * @param params An array of two parameters:
   *   1. integer of a block number, or the string "latest", "earliest" or "pending"
   *   2. boolean - if true returns the full transaction objects, if false only the hashes of the transactions.
   */
  async getBlockByNumber(params: [string, boolean]) {
    const [blockOpt, includeTransactions] = params
    let block: Block
    if (blockOpt === 'latest') {
      block = await this._chain.getLatestBlock()
    } else if (blockOpt === 'pending') {
      throw {
        code: INVALID_PARAMS,
        message: `"pending" is not yet supported`,
      }
    } else if (blockOpt === 'earliest') {
      block = await this._chain.getBlock(new BN(0))
    } else {
      const blockNumberBN = new BN(stripHexPrefix(blockOpt), 16)
      const latest = (await this._chain.getLatestHeader()).number

      if (blockNumberBN.gt(latest)) {
        throw {
          code: INVALID_PARAMS,
          message: 'specified block greater than current height',
        }
      }
      block = await this._chain.getBlock(blockNumberBN)
    }

    return await blockToStandardJsonRpcFields(block, this._chain, includeTransactions)
  }

  /**
   * Returns the transaction count for a block given by the block hash.
   * @param params An array of one parameter: A block hash
   */
  async getBlockTransactionCountByHash(params: [string]) {
    const [blockHash] = params
    try {
      const block = await this._chain.getBlock(toBuffer(blockHash))
      return intToHex(block.transactions.length)
    } catch (error) {
      throw {
        code: INVALID_PARAMS,
        message: 'Unknown block',
      }
    }
  }

  /**
   * Returns code of the account at the given address.
   * Currently only "latest" block is supported.
   * @param params An array of two parameters:
   *   1. address of the account
   *   2. integer block number, or the string "latest", "earliest" or "pending"
   */
  async getCode(params: [string, string]) {
    const [addressHex, blockOpt] = params

    if (!this._vm) {
      throw new Error('missing vm')
    }

    // use a copy of the vm in case new blocks are sync'd
    const vm = this._vm.copy()

    if (blockOpt !== 'latest') {
      const latest = await vm.blockchain.getLatestHeader()
      if (blockOpt !== bnToHex(latest.number)) {
        throw {
          code: INVALID_PARAMS,
          message: `Currently only "latest" block supported`,
        }
      }
    }

    const address = Address.fromString(addressHex)
    const code = await vm.stateManager.getContractCode(address)
    return bufferToHex(code)
  }

  /**
   * Returns the value from a storage position at a given address.
   * Currently only "latest" block is supported.
   * @param params An array of three parameters:
   *   1. address of the storage
   *   2. integer of the position in the storage
   *   3. integer block number, or the string "latest", "earliest" or "pending"
   */
  async getStorageAt(params: [string, string, string]) {
    const [addressHex, positionHex, blockOpt] = params

    if (!this._vm) {
      throw new Error('missing vm')
    }

    // use a copy of the vm in case new blocks are executed
    const vm = this._vm.copy()

    if (blockOpt !== 'latest') {
      const latest = await vm.blockchain.getLatestHeader()
      if (blockOpt !== bnToHex(latest.number)) {
        throw {
          code: INVALID_PARAMS,
          message: `Currently only "latest" block supported`,
        }
      }
    }

    const address = Address.fromString(addressHex)
    const storageTrie = await (vm.stateManager as any)._getStorageTrie(address)
    const position = setLengthLeft(toBuffer(positionHex), 32)
    const storage = await storageTrie.get(position)
    return storage ? bufferToHex(setLengthLeft(decode(storage), 32)) : '0x'
  }

  /**
   * Returns the number of transactions sent from an address.
   * Currently only "latest" block is supported.
   * @param params An array of two parameters:
   *   1. address of the account
   *   2. integer block number, or the string "latest", "earliest" or "pending"
   */
  async getTransactionCount(params: [string, string]) {
    const [addressHex, blockOpt] = params

    if (!this._vm) {
      throw new Error('missing vm')
    }

    // use a copy of the vm in case new blocks are executed
    const vm = this._vm.copy()

    if (blockOpt !== 'latest') {
      const latest = await vm.blockchain.getLatestHeader()
      if (blockOpt !== bnToHex(latest.number)) {
        throw {
          code: INVALID_PARAMS,
          message: `Currently only "latest" block supported`,
        }
      }
    }

    const address = Address.fromString(addressHex)
    const account: Account = await vm.stateManager.getAccount(address)
    return bnToHex(account.nonce)
  }

  /**
   * Returns the current ethereum protocol version as a hex-encoded string
   * @param params An empty array
   */
  protocolVersion(_params = []) {
    return intToHex(this.ethVersion)
  }

  /**
   * Returns the number of uncles in a block from a block matching the given block number
   * @param params An array of one parameter:
   *   1: hexadecimal representation of a block number
   */
  async getUncleCountByBlockNumber(params: [string]) {
    const [blockNumber] = params
    const blockNumberBN = new BN(stripHexPrefix(blockNumber), 16)
    const latest = (await this._chain.getLatestHeader()).number

    if (blockNumberBN.gt(latest)) {
      throw {
        code: INVALID_PARAMS,
        message: 'specified block greater than current height',
      }
    }

    const block = await this._chain.getBlock(blockNumberBN)
    return block.uncleHeaders.length
  }

  // MERGE-INTEROP-HACK: stubbed method to satify Lodestar needs
  // TODO: do proper implementation (would need to store logs in db for retrieval)
  // https://github.com/ethereumjs/ethereumjs-monorepo/issues/1520
  async getLogs(_params: GetLogsParamsObject) {
    return []
  }

  /**
   * Creates new message call transaction or a contract creation for signed transactions.
   * @param params An array of one parameter:
   *   1. the signed transaction data
   * @returns a 32-byte tx hash or the zero hash if the tx is not yet available.
   */
  async sendRawTransaction(params: [string]) {
    const [serializedTx] = params

    const common = this.client.config.chainCommon.copy()
    const { syncTargetHeight } = this.service.synchronizer
    if (!syncTargetHeight && !this.client.config.mine) {
      throw {
        code: INTERNAL_ERROR,
        message: `client is not aware of the current chain height yet (give sync some more time)`,
      }
    }
    // Set the tx common to an appropriate HF to create a tx
    // with matching HF rules
    if (syncTargetHeight) {
      common.setHardforkByBlockNumber(syncTargetHeight)
    }

    let tx
    try {
      tx = TransactionFactory.fromSerializedData(toBuffer(serializedTx), { common })
    } catch (e: any) {
      throw {
        code: PARSE_ERROR,
        message: `serialized tx data could not be parsed (${e.message})`,
      }
    }

    if (!tx.isSigned()) {
      throw {
        code: INVALID_PARAMS,
        message: `tx needs to be signed`,
      }
    }

    // Add the tx to own tx pool
    const { txPool } = this.service.synchronizer as FullSynchronizer
    txPool.add(tx)

    const peerPool = this.service.pool
    if (
      peerPool.peers.length === 0 &&
      !this.client.config.mine &&
      this._chain.config.chainCommon.consensusType() !== ConsensusType.ProofOfStake
    ) {
      throw {
        code: INTERNAL_ERROR,
        message: `no peer connection available`,
      }
    }
    txPool.sendTransactions([tx], peerPool.peers)

    return bufferToHex(tx.hash())
  }
  /**
   * Returns an object with data about the sync status or false.
   * @param params An empty array
   * @returns An object with sync status data or false (when not syncing)
   *   * startingBlock - The block at which the import started (will only be reset after the sync reached his head)
   *   * currentBlock - The current block, same as eth_blockNumber
   *   * highestBlock - The estimated highest block
   */
  async syncing(_params = []) {
    if (this.client.config.synchronized) {
      return false
    }

    const currentBlockHeader = await this._chain.getLatestHeader()
    const currentBlock = bnToHex(currentBlockHeader.number)

    const synchronizer = this.client.services[0].synchronizer
    const startingBlock = bnToHex(synchronizer.startingBlock)
    const bestPeer = synchronizer.best()
    if (!bestPeer) {
      throw {
        code: INTERNAL_ERROR,
        message: `no peer available for synchronization`,
      }
    }

    const highestBlockHeader = await synchronizer.latest(bestPeer)
    if (!highestBlockHeader) {
      throw {
        code: INTERNAL_ERROR,
        message: `highest block header unavailable`,
      }
    }
    const highestBlock = bnToHex(highestBlockHeader.number)

    return { startingBlock, currentBlock, highestBlock }
  }
}
