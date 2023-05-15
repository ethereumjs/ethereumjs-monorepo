import { RLP } from '@ethereumjs/rlp'
import { BlobEIP4844Transaction, Capability, TransactionFactory } from '@ethereumjs/tx'
import {
  Address,
  TypeOutput,
  bigIntToHex,
  bytesToPrefixedHexString,
  hexStringToBytes,
  intToHex,
  setLengthLeft,
  toType,
  utf8ToBytes,
} from '@ethereumjs/util'

import { INTERNAL_ERROR, INVALID_PARAMS, PARSE_ERROR } from '../error-code'
import { jsonRpcTx } from '../helpers'
import { middleware, validators } from '../validation'

import type { EthereumClient } from '../..'
import type { Chain } from '../../blockchain'
import type { ReceiptsManager } from '../../execution/receipt'
import type { EthProtocol } from '../../net/protocol'
import type { EthereumService, FullEthereumService } from '../../service'
import type { RpcTx } from '../types'
import type { Block, JsonRpcBlock } from '@ethereumjs/block'
import type { Log } from '@ethereumjs/evm'
import type { Proof } from '@ethereumjs/statemanager'
import type { FeeMarketEIP1559Transaction, Transaction, TypedTransaction } from '@ethereumjs/tx'
import type {
  EIP4844BlobTxReceipt,
  PostByzantiumTxReceipt,
  PreByzantiumTxReceipt,
  TxReceipt,
  VM,
} from '@ethereumjs/vm'

type GetLogsParams = {
  fromBlock?: string // QUANTITY, block number or "earliest" or "latest" (default: "latest")
  toBlock?: string // QUANTITY, block number or "latest" (default: "latest")
  address?: string // DATA, 20 Bytes, contract address from which logs should originate
  topics?: string[] // DATA, array, topics are order-dependent
  blockHash?: string // DATA, 32 Bytes. With the addition of EIP-234,
  // blockHash restricts the logs returned to the single block with
  // the 32-byte hash blockHash. Using blockHash is equivalent to
  // fromBlock = toBlock = the block number with hash blockHash.
  // If blockHash is present in in the filter criteria, then
  // neither fromBlock nor toBlock are allowed.
}

type JsonRpcReceipt = {
  transactionHash: string // DATA, 32 Bytes - hash of the transaction.
  transactionIndex: string // QUANTITY - integer of the transactions index position in the block.
  blockHash: string // DATA, 32 Bytes - hash of the block where this transaction was in.
  blockNumber: string // QUANTITY - block number where this transaction was in.
  from: string // DATA, 20 Bytes - address of the sender.
  to: string | null // DATA, 20 Bytes - address of the receiver. null when it's a contract creation transaction.
  cumulativeGasUsed: string // QUANTITY  - The total amount of gas used when this transaction was executed in the block.
  effectiveGasPrice: string // QUANTITY - The final gas price per gas paid by the sender in wei.
  gasUsed: string // QUANTITY - The amount of gas used by this specific transaction alone.
  contractAddress: string | null // DATA, 20 Bytes - The contract address created, if the transaction was a contract creation, otherwise null.
  logs: JsonRpcLog[] // Array - Array of log objects, which this transaction generated.
  logsBloom: string // DATA, 256 Bytes - Bloom filter for light clients to quickly retrieve related logs.
  // It also returns either:
  root?: string // DATA, 32 bytes of post-transaction stateroot (pre Byzantium)
  status?: string // QUANTITY, either 1 (success) or 0 (failure)
  dataGasUsed?: string // QUANTITY, data gas consumed by transaction (if blob transaction)
  dataGasPrice?: string // QUAntity, data gas price for block including this transaction (if blob transaction)
}
type JsonRpcLog = {
  removed: boolean // TAG - true when the log was removed, due to a chain reorganization. false if it's a valid log.
  logIndex: string | null // QUANTITY - integer of the log index position in the block. null when it's pending.
  transactionIndex: string | null // QUANTITY - integer of the transactions index position log was created from. null when it's pending.
  transactionHash: string | null // DATA, 32 Bytes - hash of the transactions this log was created from. null when it's pending.
  blockHash: string | null // DATA, 32 Bytes - hash of the block where this log was in. null when it's pending.
  blockNumber: string | null // QUANTITY - the block number where this log was in. null when it's pending.
  address: string // DATA, 20 Bytes - address from which this log originated.
  data: string // DATA - contains one or more 32 Bytes non-indexed arguments of the log.
  topics: string[] // Array of DATA - Array of 0 to 4 32 Bytes DATA of indexed log arguments.
  // (In solidity: The first topic is the hash of the signature of the event
  // (e.g. Deposit(address,bytes32,uint256)), except you declared the event with the anonymous specifier.)
}

/**
 * Returns block formatted to the standard JSON-RPC fields
 */
const jsonRpcBlock = async (
  block: Block,
  chain: Chain,
  includeTransactions: boolean
): Promise<JsonRpcBlock> => {
  const json = block.toJSON()
  const header = json!.header!
  const transactions = block.transactions.map((tx, txIndex) =>
    includeTransactions ? jsonRpcTx(tx, block, txIndex) : bytesToPrefixedHexString(tx.hash())
  )
  const withdrawalsAttr =
    header.withdrawalsRoot !== undefined
      ? {
          withdrawalsRoot: header.withdrawalsRoot!,
          withdrawals: json.withdrawals,
        }
      : {}
  const td = await chain.getTd(block.hash(), block.header.number)
  return {
    number: header.number!,
    hash: bytesToPrefixedHexString(block.hash()),
    parentHash: header.parentHash!,
    mixHash: header.mixHash,
    nonce: header.nonce!,
    sha3Uncles: header.uncleHash!,
    logsBloom: header.logsBloom!,
    transactionsRoot: header.transactionsTrie!,
    stateRoot: header.stateRoot!,
    receiptsRoot: header.receiptTrie!,
    miner: header.coinbase!,
    difficulty: header.difficulty!,
    totalDifficulty: bigIntToHex(td),
    extraData: header.extraData!,
    size: intToHex(utf8ToBytes(JSON.stringify(json)).byteLength),
    gasLimit: header.gasLimit!,
    gasUsed: header.gasUsed!,
    timestamp: header.timestamp!,
    transactions,
    uncles: block.uncleHeaders.map((uh) => bytesToPrefixedHexString(uh.hash())),
    baseFeePerGas: header.baseFeePerGas,
    ...withdrawalsAttr,
    excessDataGas: header.excessDataGas,
  }
}

/**
 * Returns log formatted to the standard JSON-RPC fields
 */
const jsonRpcLog = async (
  log: Log,
  block?: Block,
  tx?: TypedTransaction,
  txIndex?: number,
  logIndex?: number
): Promise<JsonRpcLog> => ({
  removed: false, // TODO implement
  logIndex: logIndex !== undefined ? intToHex(logIndex) : null,
  transactionIndex: txIndex !== undefined ? intToHex(txIndex) : null,
  transactionHash: tx ? bytesToPrefixedHexString(tx.hash()) : null,
  blockHash: block ? bytesToPrefixedHexString(block.hash()) : null,
  blockNumber: block ? bigIntToHex(block.header.number) : null,
  address: bytesToPrefixedHexString(log[0]),
  topics: log[1].map(bytesToPrefixedHexString),
  data: bytesToPrefixedHexString(log[2]),
})

/**
 * Returns receipt formatted to the standard JSON-RPC fields
 */
const jsonRpcReceipt = async (
  receipt: TxReceipt,
  gasUsed: bigint,
  effectiveGasPrice: bigint,
  block: Block,
  tx: TypedTransaction,
  txIndex: number,
  logIndex: number,
  contractAddress?: Address,
  dataGasUsed?: bigint,
  dataGasPrice?: bigint
): Promise<JsonRpcReceipt> => ({
  transactionHash: bytesToPrefixedHexString(tx.hash()),
  transactionIndex: intToHex(txIndex),
  blockHash: bytesToPrefixedHexString(block.hash()),
  blockNumber: bigIntToHex(block.header.number),
  from: tx.getSenderAddress().toString(),
  to: tx.to?.toString() ?? null,
  cumulativeGasUsed: bigIntToHex(receipt.cumulativeBlockGasUsed),
  effectiveGasPrice: bigIntToHex(effectiveGasPrice),
  gasUsed: bigIntToHex(gasUsed),
  contractAddress: contractAddress?.toString() ?? null,
  logs: await Promise.all(
    receipt.logs.map((l, i) => jsonRpcLog(l, block, tx, txIndex, logIndex + i))
  ),
  logsBloom: bytesToPrefixedHexString(receipt.bitvector),
  root:
    (receipt as PreByzantiumTxReceipt).stateRoot instanceof Uint8Array
      ? bytesToPrefixedHexString((receipt as PreByzantiumTxReceipt).stateRoot)
      : undefined,
  status:
    ((receipt as PostByzantiumTxReceipt).status as unknown) instanceof Uint8Array
      ? intToHex((receipt as PostByzantiumTxReceipt).status)
      : undefined,
  dataGasUsed: dataGasUsed !== undefined ? bigIntToHex(dataGasUsed) : undefined,
  dataGasPrice: dataGasPrice !== undefined ? bigIntToHex(dataGasPrice) : undefined,
})

/**
 * Get block by option
 */
const getBlockByOption = async (blockOpt: string, chain: Chain) => {
  if (blockOpt === 'pending') {
    throw {
      code: INVALID_PARAMS,
      message: `"pending" is not yet supported`,
    }
  }

  let block: Block
  const latest = chain.blocks.latest ?? (await chain.getCanonicalHeadBlock())

  switch (blockOpt) {
    case 'earliest':
      block = await chain.getBlock(BigInt(0))
      break
    case 'latest':
      block = latest
      break
    case 'safe':
      block = chain.blocks.safe ?? (await chain.getCanonicalSafeBlock())
      break
    case 'finalized':
      block = chain.blocks.finalized ?? (await chain.getCanonicalFinalizedBlock())
      break
    default: {
      const blockNumber = BigInt(blockOpt)
      if (blockNumber === latest.header.number) {
        block = latest
      } else if (blockNumber > latest.header.number) {
        throw {
          code: INVALID_PARAMS,
          message: 'specified block greater than current height',
        }
      } else {
        block = await chain.getBlock(blockNumber)
      }
    }
  }
  return block
}

/**
 * eth_* RPC module
 * @memberof module:rpc/modules
 */
export class Eth {
  private client: EthereumClient
  private service: EthereumService
  private receiptsManager: ReceiptsManager | undefined
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
    this._vm = (this.service as FullEthereumService).execution?.vm
    this.receiptsManager = (this.service as FullEthereumService).execution?.receiptsManager

    const ethProtocol = this.service.protocols.find((p) => p.name === 'eth') as EthProtocol
    this.ethVersion = Math.max(...ethProtocol.versions)

    this.blockNumber = middleware(this.blockNumber.bind(this), 0)

    this.call = middleware(this.call.bind(this), 2, [
      [validators.transaction()],
      [validators.blockOption],
    ])

    this.chainId = middleware(this.chainId.bind(this), 0, [])

    this.estimateGas = middleware(this.estimateGas.bind(this), 1, [
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

    this.getUncleCountByBlockNumber = middleware(this.getUncleCountByBlockNumber.bind(this), 1, [
      [validators.hex],
    ])

    this.getStorageAt = middleware(this.getStorageAt.bind(this), 3, [
      [validators.address],
      [validators.hex],
      [validators.blockOption],
    ])

    this.getTransactionByBlockHashAndIndex = middleware(
      this.getTransactionByBlockHashAndIndex.bind(this),
      2,
      [[validators.hex, validators.blockHash], [validators.hex]]
    )

    this.getTransactionByHash = middleware(this.getTransactionByHash.bind(this), 1, [
      [validators.hex],
    ])

    this.getTransactionCount = middleware(this.getTransactionCount.bind(this), 2, [
      [validators.address],
      [validators.blockOption],
    ])

    this.getTransactionReceipt = middleware(this.getTransactionReceipt.bind(this), 1, [
      [validators.hex],
    ])

    this.getUncleCountByBlockNumber = middleware(this.getUncleCountByBlockNumber.bind(this), 1, [
      [validators.hex],
    ])

    this.getLogs = middleware(this.getLogs.bind(this), 1, [
      [
        validators.object({
          fromBlock: validators.optional(validators.blockOption),
          toBlock: validators.optional(validators.blockOption),
          address: validators.optional(
            validators.either(validators.array(validators.address), validators.address)
          ),
          topics: validators.optional(
            validators.array(
              validators.optional(
                validators.either(validators.hex, validators.array(validators.hex))
              )
            )
          ),
          blockHash: validators.optional(validators.blockHash),
        }),
      ],
    ])

    this.sendRawTransaction = middleware(this.sendRawTransaction.bind(this), 1, [[validators.hex]])

    this.protocolVersion = middleware(this.protocolVersion.bind(this), 0, [])

    this.syncing = middleware(this.syncing.bind(this), 0, [])

    this.getProof = middleware(this.getProof.bind(this), 3, [
      [validators.address],
      [validators.array(validators.hex)],
      [validators.blockOption],
    ])

    this.getBlockTransactionCountByNumber = middleware(
      this.getBlockTransactionCountByNumber.bind(this),
      1,
      [[validators.blockOption]]
    )

    this.gasPrice = middleware(this.gasPrice.bind(this), 0, [])
  }

  /**
   * Returns number of the most recent block.
   * @param params An empty array
   */
  async blockNumber(_params = []) {
    return bigIntToHex(this._chain.headers.latest?.number ?? BigInt(0))
  }

  /**
   * Executes a new message call immediately without creating a transaction on the block chain.
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
    const block = await getBlockByOption(blockOpt, this._chain)

    if (this._vm === undefined) {
      throw new Error('missing vm')
    }

    const vm = await this._vm.copy()
    await vm.stateManager.setStateRoot(block.header.stateRoot)

    const { from, to, gas: gasLimit, gasPrice, value, data } = transaction

    try {
      const runCallOpts = {
        caller: from !== undefined ? Address.fromString(from) : undefined,
        to: to !== undefined ? Address.fromString(to) : undefined,
        gasLimit: toType(gasLimit, TypeOutput.BigInt),
        gasPrice: toType(gasPrice, TypeOutput.BigInt),
        value: toType(value, TypeOutput.BigInt),
        data: data !== undefined ? hexStringToBytes(data) : undefined,
      }
      const { execResult } = await vm.evm.runCall(runCallOpts)
      return bytesToPrefixedHexString(execResult.returnValue)
    } catch (error: any) {
      throw {
        code: INTERNAL_ERROR,
        message: error.message.toString(),
      }
    }
  }

  /**
   * Returns the currently configured chain id, a value used in replay-protected transaction signing as introduced by EIP-155.
   * @param _params An empty array
   * @returns The chain ID.
   */
  async chainId(_params = []) {
    const chainId = this._chain.config.chainCommon.chainId()
    return bigIntToHex(chainId)
  }

  /**
   * Generates and returns an estimate of how much gas is necessary to allow the transaction to complete.
   * The transaction will not be added to the blockchain.
   * Note that the estimate may be significantly more than the amount of gas actually used by the transaction,
   * for a variety of reasons including EVM mechanics and node performance.
   * @param params An array of two parameters:
   *   1. The transaction object
   *       * from (optional) - The address the transaction is sent from
   *       * to - The address the transaction is directed to
   *       * gas (optional) - Integer of the gas provided for the transaction execution
   *       * gasPrice (optional) - Integer of the gasPrice used for each paid gas
   *       * value (optional) - Integer of the value sent with this transaction
   *       * data (optional) - Hash of the method signature and encoded parameters.
   *   2. integer block number, or the string "latest", "earliest" or "pending" (optional)
   * @returns The amount of gas used.
   */
  async estimateGas(params: [RpcTx, string?]) {
    const [transaction, blockOpt] = params
    const block = await getBlockByOption(blockOpt ?? 'latest', this._chain)

    if (this._vm === undefined) {
      throw new Error('missing vm')
    }

    const vm = await this._vm.copy()
    await vm.stateManager.setStateRoot(block.header.stateRoot)

    if (transaction.gas === undefined) {
      // If no gas limit is specified use the last block gas limit as an upper bound.
      const latest = await this._chain.getCanonicalHeadHeader()
      transaction.gas = latest.gasLimit as any
    }

    if (transaction.gasPrice === undefined && transaction.maxFeePerGas === undefined) {
      // If no gas price or maxFeePerGas provided, use current block base fee for gas estimates
      if (transaction.type !== undefined && parseInt(transaction.type) === 2) {
        transaction.maxFeePerGas = '0x' + block.header.baseFeePerGas?.toString(16)
      } else if (block.header.baseFeePerGas !== undefined) {
        transaction.gasPrice = '0x' + block.header.baseFeePerGas?.toString(16)
      }
    }

    const txData = {
      ...transaction,
      gasLimit: transaction.gas,
    }

    const tx = TransactionFactory.fromTxData(txData, { common: vm._common, freeze: false })

    // set from address
    const from =
      transaction.from !== undefined ? Address.fromString(transaction.from) : Address.zero()
    tx.getSenderAddress = () => {
      return from
    }

    try {
      const { totalGasSpent } = await vm.runTx({
        tx,
        skipNonce: true,
        skipBalance: true,
        skipBlockGasLimitValidation: true,
        block,
      })
      return `0x${totalGasSpent.toString(16)}`
    } catch (error: any) {
      throw {
        code: INTERNAL_ERROR,
        message: error.message.toString(),
      }
    }
  }

  /**
   * Returns the balance of the account at the given address.
   * @param params An array of two parameters:
   *   1. address of the account
   *   2. integer block number, or the string "latest", "earliest" or "pending"
   */
  async getBalance(params: [string, string]) {
    const [addressHex, blockOpt] = params
    const address = Address.fromString(addressHex)
    const block = await getBlockByOption(blockOpt, this._chain)

    if (this._vm === undefined) {
      throw new Error('missing vm')
    }

    const vm = await this._vm.copy()
    await vm.stateManager.setStateRoot(block.header.stateRoot)
    const account = await vm.stateManager.getAccount(address)
    if (account === undefined) {
      return '0x0'
    }
    return bigIntToHex(account.balance)
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
      const block = await this._chain.getBlock(hexStringToBytes(blockHash))
      return await jsonRpcBlock(block, this._chain, includeTransactions)
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
    const block = await getBlockByOption(blockOpt, this._chain)
    return jsonRpcBlock(block, this._chain, includeTransactions)
  }

  /**
   * Returns the transaction count for a block given by the block hash.
   * @param params An array of one parameter: A block hash
   */
  async getBlockTransactionCountByHash(params: [string]) {
    const [blockHash] = params
    try {
      const block = await this._chain.getBlock(hexStringToBytes(blockHash))
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
   * @param params An array of two parameters:
   *   1. address of the account
   *   2. integer block number, or the string "latest", "earliest" or "pending"
   */
  async getCode(params: [string, string]) {
    const [addressHex, blockOpt] = params
    const block = await getBlockByOption(blockOpt, this._chain)

    if (this._vm === undefined) {
      throw new Error('missing vm')
    }

    const vm = await this._vm.copy()
    await vm.stateManager.setStateRoot(block.header.stateRoot)

    const address = Address.fromString(addressHex)
    const code = await vm.stateManager.getContractCode(address)
    return bytesToPrefixedHexString(code)
  }

  /**
   * Returns the value from a storage position at a given address.
   * @param params An array of three parameters:
   *   1. address of the storage
   *   2. integer of the position in the storage
   *   3. integer block number, or the string "latest", "earliest" or "pending"
   */
  async getStorageAt(params: [string, string, string]) {
    const [addressHex, positionHex, blockOpt] = params
    const block = await getBlockByOption(blockOpt, this._chain)

    if (this._vm === undefined) {
      throw new Error('missing vm')
    }

    const vm = await this._vm.copy()
    await vm.stateManager.setStateRoot(block.header.stateRoot)

    const address = Address.fromString(addressHex)
    const storageTrie = await (vm.stateManager as any)._getStorageTrie(address)
    const position = setLengthLeft(hexStringToBytes(positionHex), 32)
    const storage = await storageTrie.get(position)
    return storage !== null && storage !== undefined
      ? bytesToPrefixedHexString(
          setLengthLeft(RLP.decode(Uint8Array.from(storage)) as Uint8Array, 32)
        )
      : '0x'
  }

  /**
   * Returns information about a transaction given a block hash and a transaction's index position.
   * @param params An array of two parameter:
   *   1. a block hash
   *   2. an integer of the transaction index position encoded as a hexadecimal.
   */
  async getTransactionByBlockHashAndIndex(params: [string, string]) {
    try {
      const [blockHash, txIndexHex] = params
      const txIndex = parseInt(txIndexHex, 16)
      const block = await this._chain.getBlock(hexStringToBytes(blockHash))
      if (block.transactions.length <= txIndex) {
        return null
      }

      const tx = block.transactions[txIndex]
      return jsonRpcTx(tx, block, txIndex)
    } catch (error: any) {
      throw {
        code: INVALID_PARAMS,
        message: error.message.toString(),
      }
    }
  }

  /**
   * Returns the transaction by hash when available within `--txLookupLimit`
   * @param params An array of one parameter:
   *   1. hash of the transaction
   */
  async getTransactionByHash(params: [string]) {
    const [txHash] = params

    try {
      if (!this.receiptsManager) throw new Error('missing receiptsManager')
      const result = await this.receiptsManager.getReceiptByTxHash(hexStringToBytes(txHash))
      if (!result) return null
      const [_receipt, blockHash, txIndex] = result
      const block = await this._chain.getBlock(blockHash)
      const tx = block.transactions[txIndex]
      return jsonRpcTx(tx, block, txIndex)
    } catch (error: any) {
      throw {
        code: INTERNAL_ERROR,
        message: error.message.toString(),
      }
    }
  }

  /**
   * Returns the number of transactions sent from an address.
   * @param params An array of two parameters:
   *   1. address of the account
   *   2. integer block number, or the string "latest", "earliest" or "pending"
   */
  async getTransactionCount(params: [string, string]) {
    const [addressHex, blockOpt] = params
    const block = await getBlockByOption(blockOpt, this._chain)

    if (this._vm === undefined) {
      throw new Error('missing vm')
    }

    const vm = await this._vm.copy()
    await vm.stateManager.setStateRoot(block.header.stateRoot)

    const address = Address.fromString(addressHex)
    const account = await vm.stateManager.getAccount(address)
    if (account === undefined) {
      return '0x0'
    }
    return bigIntToHex(account.nonce)
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
    const [blockNumberHex] = params
    const blockNumber = BigInt(blockNumberHex)
    const latest =
      this._chain.headers.latest?.number ?? (await this._chain.getCanonicalHeadHeader()).number

    if (blockNumber > latest) {
      throw {
        code: INVALID_PARAMS,
        message: 'specified block greater than current height',
      }
    }

    const block = await this._chain.getBlock(blockNumber)
    return block.uncleHeaders.length
  }

  /**
   * Returns the receipt of a transaction by transaction hash.
   * *Note* That the receipt is not available for pending transactions.
   * Only available with `--saveReceipts` enabled
   * Will return empty if tx is past set `--txLookupLimit`
   * (default = 2350000 = about one year, 0 = entire chain)
   * @param params An array of one parameter:
   *  1: Transaction hash
   */
  async getTransactionReceipt(params: [string]) {
    const [txHash] = params

    try {
      if (!this.receiptsManager) throw new Error('missing receiptsManager')
      const result = await this.receiptsManager.getReceiptByTxHash(hexStringToBytes(txHash))
      if (!result) return null
      const [receipt, blockHash, txIndex, logIndex] = result
      const block = await this._chain.getBlock(blockHash)
      const parentBlock = await this._chain.getBlock(block.header.parentHash)
      const tx = block.transactions[txIndex]
      const effectiveGasPrice = tx.supports(Capability.EIP1559FeeMarket)
        ? (tx as FeeMarketEIP1559Transaction).maxPriorityFeePerGas <
          (tx as FeeMarketEIP1559Transaction).maxFeePerGas - block.header.baseFeePerGas!
          ? (tx as FeeMarketEIP1559Transaction).maxPriorityFeePerGas
          : (tx as FeeMarketEIP1559Transaction).maxFeePerGas -
            block.header.baseFeePerGas! +
            block.header.baseFeePerGas!
        : (tx as Transaction).gasPrice

      const vmCopy = await this._vm!.copy()
      vmCopy._common.setHardfork(tx.common.hardfork())
      // Run tx through copied vm to get tx gasUsed and createdAddress
      const runBlockResult = await vmCopy.runBlock({
        block,
        root: parentBlock.header.stateRoot,
        skipBlockValidation: true,
      })

      const { totalGasSpent, createdAddress } = runBlockResult.results[txIndex]
      const { dataGasPrice, dataGasUsed } = runBlockResult.receipts[txIndex] as EIP4844BlobTxReceipt
      return await jsonRpcReceipt(
        receipt,
        totalGasSpent,
        effectiveGasPrice,
        block,
        tx,
        txIndex,
        logIndex,
        createdAddress,
        dataGasUsed,
        dataGasPrice
      )
    } catch (error: any) {
      throw {
        code: INTERNAL_ERROR,
        message: error.message.toString(),
      }
    }
  }

  /**
   * Returns an array of all logs matching a given filter object.
   * Only available with `--saveReceipts` enabled
   * @param params An object of the filter options {@link GetLogsParams}
   */
  async getLogs(params: [GetLogsParams]) {
    const { fromBlock, toBlock, blockHash, address, topics } = params[0]
    if (!this.receiptsManager) throw new Error('missing receiptsManager')
    if (blockHash !== undefined && (fromBlock !== undefined || toBlock !== undefined)) {
      throw {
        code: INVALID_PARAMS,
        message: `Can only specify a blockHash if fromBlock or toBlock are not provided`,
      }
    }
    let from: Block, to: Block
    if (blockHash !== undefined) {
      try {
        from = to = await this._chain.getBlock(hexStringToBytes(blockHash))
      } catch (error: any) {
        throw {
          code: INVALID_PARAMS,
          message: 'unknown blockHash',
        }
      }
    } else {
      if (fromBlock === 'earliest') {
        from = await this._chain.getBlock(BigInt(0))
      } else if (fromBlock === 'latest' || fromBlock === undefined) {
        from = this._chain.blocks.latest!
      } else {
        const blockNum = BigInt(fromBlock)
        if (blockNum > this._chain.headers.height) {
          throw {
            code: INVALID_PARAMS,
            message: 'specified `fromBlock` greater than current height',
          }
        }
        from = await this._chain.getBlock(blockNum)
      }
      if (toBlock === fromBlock) {
        to = from
      } else if (toBlock === 'latest' || toBlock === undefined) {
        to = this._chain.blocks.latest!
      } else {
        const blockNum = BigInt(toBlock)
        if (blockNum > this._chain.headers.height) {
          throw {
            code: INVALID_PARAMS,
            message: 'specified `toBlock` greater than current height',
          }
        }
        to = await this._chain.getBlock(blockNum)
      }
    }
    if (
      to.header.number - from.header.number >
      BigInt(this.receiptsManager.GET_LOGS_BLOCK_RANGE_LIMIT)
    ) {
      throw {
        code: INVALID_PARAMS,
        message: `block range limit is ${this.receiptsManager.GET_LOGS_BLOCK_RANGE_LIMIT} blocks`,
      }
    }
    try {
      const formattedTopics = topics?.map((t) => {
        if (t === null) {
          return null
        } else if (Array.isArray(t)) {
          return t.map((x) => hexStringToBytes(x))
        } else {
          return hexStringToBytes(t)
        }
      })
      let addrs
      if (address !== undefined) {
        if (Array.isArray(address)) {
          addrs = address.map((a) => hexStringToBytes(a))
        } else {
          addrs = [hexStringToBytes(address)]
        }
      }
      const logs = await this.receiptsManager.getLogs(from, to, addrs, formattedTopics)
      return await Promise.all(
        logs.map(({ log, block, tx, txIndex, logIndex }) =>
          jsonRpcLog(log, block, tx, txIndex, logIndex)
        )
      )
    } catch (error: any) {
      throw {
        code: INTERNAL_ERROR,
        message: error.message.toString(),
      }
    }
  }

  /**
   * Creates new message call transaction or a contract creation for signed transactions.
   * @param params An array of one parameter:
   *   1. the signed transaction data
   * @returns a 32-byte tx hash or the zero hash if the tx is not yet available.
   */
  async sendRawTransaction(params: [string]) {
    const [serializedTx] = params

    const { syncTargetHeight } = this.client.config
    if (!this.client.config.synchronized) {
      throw {
        code: INTERNAL_ERROR,
        message: `client is not aware of the current chain height yet (give sync some more time)`,
      }
    }
    const common = this.client.config.chainCommon.copy()
    const chainHeight = this.client.chain.headers.height
    let txTargetHeight = syncTargetHeight ?? BigInt(0)
    // Following step makes sure txTargetHeight > 0
    if (txTargetHeight <= chainHeight) {
      txTargetHeight = chainHeight + BigInt(1)
    }
    common.setHardforkByBlockNumber(txTargetHeight, undefined, Math.floor(Date.now() / 1000))

    let tx
    try {
      const txBuf = hexStringToBytes(serializedTx)
      if (txBuf[0] === 0x03) {
        // Blob Transactions sent over RPC are expected to be in Network Wrapper format
        tx = BlobEIP4844Transaction.fromSerializedBlobTxNetworkWrapper(txBuf, { common })

        const dataGasLimit = common.param('gasConfig', 'maxDataGasPerBlock')
        const dataGasPerBlob = common.param('gasConfig', 'dataGasPerBlob')

        if (BigInt((tx.blobs ?? []).length) * dataGasPerBlob > dataGasLimit) {
          throw Error(
            `tx blobs=${(tx.blobs ?? []).length} exceeds block limit=${
              dataGasLimit / dataGasPerBlob
            }`
          )
        }
      } else {
        tx = TransactionFactory.fromSerializedData(txBuf, { common })
      }
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
    const { txPool, pool } = this.service as FullEthereumService

    try {
      await txPool.add(tx, true)
      await txPool.sendNewTxHashes([tx.hash()], pool.peers)
    } catch (error: any) {
      throw {
        code: INVALID_PARAMS,
        message: error.message ?? error.toString(),
      }
    }

    const peerPool = this.service.pool
    if (
      peerPool.peers.length === 0 &&
      !this.client.config.mine &&
      this.client.config.isSingleNode === false
    ) {
      throw {
        code: INTERNAL_ERROR,
        message: `no peer connection available`,
      }
    }
    txPool.sendTransactions([tx], peerPool.peers)

    return bytesToPrefixedHexString(tx.hash())
  }

  /**
   * Returns an account object along with data about the proof.
   * @param params An array of three parameters:
   *   1. address of the account
   *   2. array of storage keys which should be proofed and included
   *   3. integer block number, or the string "latest" or "earliest"
   * @returns The {@link Proof}
   */
  async getProof(params: [string, string[], string]): Promise<Proof> {
    const [addressHex, slotsHex, blockOpt] = params
    const block = await getBlockByOption(blockOpt, this._chain)

    if (this._vm === undefined) {
      throw new Error('missing vm')
    }

    const vm = await this._vm.copy()

    if (!('getProof' in vm.stateManager)) {
      throw new Error('getProof RPC method not supported with the StateManager provided')
    }
    await vm.stateManager.setStateRoot(block.header.stateRoot)

    const address = Address.fromString(addressHex)
    const slots = slotsHex.map((slotHex) => setLengthLeft(hexStringToBytes(slotHex), 32))
    const proof = await vm.stateManager.getProof!(address, slots)
    return proof
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

    const currentBlockHeader =
      this._chain.headers?.latest ?? (await this._chain.getCanonicalHeadHeader())
    const currentBlock = bigIntToHex(currentBlockHeader.number)

    const synchronizer = this.client.services[0].synchronizer
    if (!synchronizer) {
      return false
    }
    const { syncTargetHeight } = this.client.config
    const startingBlock = bigIntToHex(synchronizer.startingBlock)

    let highestBlock
    if (typeof syncTargetHeight === 'bigint' && syncTargetHeight !== BigInt(0)) {
      highestBlock = bigIntToHex(syncTargetHeight)
    } else {
      const bestPeer = await synchronizer.best()
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
      highestBlock = bigIntToHex(highestBlockHeader.number)
    }

    return { startingBlock, currentBlock, highestBlock }
  }

  /**
   * Returns the transaction count for a block given by the block number.
   * @param params An array of one parameter:
   *  1. integer of a block number, or the string "latest", "earliest" or "pending"
   */
  async getBlockTransactionCountByNumber(params: [string]) {
    const [blockOpt] = params
    const block = await getBlockByOption(blockOpt, this._chain)
    return intToHex(block.transactions.length)
  }

  /**
   * Gas price oracle.
   *
   * Returns a suggested gas price.
   * @returns a hex code of an integer representing the suggested gas price in wei.
   */
  async gasPrice() {
    const minGasPrice: bigint = this._chain.config.chainCommon.param('gasConfig', 'minPrice')
    let gasPrice = BigInt(0)
    const latest = await this._chain.getCanonicalHeadHeader()
    if (this._vm !== undefined && this._vm._common.isActivatedEIP(1559)) {
      const baseFee = latest.calcNextBaseFee()
      let priorityFee = BigInt(0)
      const block = await this._chain.getBlock(latest.number)
      for (const tx of block.transactions) {
        const maxPriorityFeePerGas = (tx as FeeMarketEIP1559Transaction).maxPriorityFeePerGas
        priorityFee += maxPriorityFeePerGas
      }

      priorityFee =
        priorityFee !== BigInt(0) ? priorityFee / BigInt(block.transactions.length) : BigInt(1)
      gasPrice = baseFee + priorityFee > minGasPrice ? baseFee + priorityFee : minGasPrice
    } else {
      // For chains that don't support EIP-1559 we iterate over the last 20
      // blocks to get an average gas price.
      const blockIterations = 20 < latest.number ? 20 : latest.number
      let txCount = BigInt(0)
      for (let i = 0; i < blockIterations; i++) {
        const block = await this._chain.getBlock(latest.number - BigInt(i))
        if (block.transactions.length === 0) {
          continue
        }

        for (const tx of block.transactions) {
          const txGasPrice = (tx as Transaction).gasPrice
          gasPrice += txGasPrice
          txCount++
        }
      }

      if (txCount > 0) {
        const avgGasPrice = gasPrice / txCount
        gasPrice = avgGasPrice > minGasPrice ? avgGasPrice : minGasPrice
      } else {
        gasPrice = minGasPrice
      }
    }

    return bigIntToHex(gasPrice)
  }
}
