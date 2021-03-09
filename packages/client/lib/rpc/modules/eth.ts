import { Transaction } from '@ethereumjs/tx'
import {
  Account,
  Address,
  BN,
  bufferToHex,
  toBuffer,
  stripHexPrefix,
  setLengthLeft,
} from 'ethereumjs-util'
import { decode } from 'rlp'
import { middleware, validators } from '../validation'
import { INVALID_PARAMS } from '../error-code'
import { RpcTx } from '../types'
import type { Chain } from '../../blockchain'
import type { EthereumClient } from '../..'
import type { EthereumService } from '../../service'
import type { EthProtocol } from '../../net/protocol'
import type VM from '@ethereumjs/vm'

/**
 * eth_* RPC module
 * @memberof module:rpc/modules
 */
export class Eth {
  private _chain: Chain
  private _vm: VM | undefined
  public ethVersion: number

  /**
   * Create eth_* RPC module
   * @param client Client to which the module binds
   */
  constructor(client: EthereumClient) {
    const service = client.services.find((s) => s.name === 'eth') as EthereumService
    this._chain = service.chain
    this._vm = (service.synchronizer as any)?.execution?.vm

    const ethProtocol = service.protocols.find((p) => p.name === 'eth') as EthProtocol
    this.ethVersion = Math.max(...ethProtocol.versions)

    this.blockNumber = middleware(this.blockNumber.bind(this), 0)

    this.call = middleware(this.call.bind(this), 2, [
      [validators.transaction(['to'])],
      [validators.blockOption],
    ])

    this.estimateGas = middleware(this.estimateGas.bind(this), 2, [
      [validators.transaction()],
      [validators.blockOption],
    ])

    this.getBalance = middleware(this.getBalance.bind(this), 2, [
      [validators.address],
      [validators.blockOption],
    ])

    this.getBlockByNumber = middleware(this.getBlockByNumber.bind(this), 2, [
      [validators.hex],
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

    this.protocolVersion = middleware(this.protocolVersion.bind(this), 0, [])
  }

  /**
   * Returns number of the most recent block.
   * @param params An empty array
   */
  async blockNumber(_params = []) {
    const latestHeader = await this._chain.getLatestHeader()
    return `0x${latestHeader.number.toString(16)}`
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
      const number = latest.number.toString(16)
      if (blockOpt !== `0x${number}`) {
        return {
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

    const { execResult } = await vm.runTx({ tx })
    return bufferToHex(execResult.returnValue)
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
      const number = latest.number.toString(16)
      if (blockOpt !== `0x${number}`) {
        return {
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
    return `0x${gasUsed.toString(16)}`
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
      const number = latest.number.toString(16)
      if (blockOpt !== `0x${number}`) {
        return {
          code: INVALID_PARAMS,
          message: `Currently only "latest" block supported`,
        }
      }
    }

    const address = Address.fromString(addressHex)
    const account: Account = await vm.stateManager.getAccount(address)
    return `0x${account.balance.toString(16)}`
  }

  /**
   * Returns information about a block by block number.
   * @param params An array of two parameters:
   *   1. integer of a block number
   *   2. boolean - if true returns the full transaction objects, if false only the hashes of the transactions.
   */
  async getBlockByNumber(params: [string, boolean]) {
    const [blockNumber, includeTransactions] = params
    const blockNumberBN = new BN(stripHexPrefix(blockNumber), 16)
    const block = await this._chain.getBlock(blockNumberBN)
    const json = block.toJSON()
    if (!includeTransactions) {
      json.transactions = block.transactions.map((tx) => bufferToHex(tx.hash())) as any
    }
    return json
  }

  /**
   * Returns information about a block by hash.
   * @param params An array of two parameters:
   *   1. a block hash
   *   2. boolean - if true returns the full transaction objects, if false only the hashes of the transactions.
   */
  async getBlockByHash(params: [string, boolean]) {
    const [blockHash, includeTransactions] = params

    const block = await this._chain.getBlock(toBuffer(blockHash))
    const json = block.toJSON()
    if (!includeTransactions) {
      json.transactions = block.transactions.map((tx) => bufferToHex(tx.hash())) as any
    }
    return json
  }

  /**
   * Returns the transaction count for a block given by the block hash.
   * @param params An array of one parameter: A block hash
   */
  async getBlockTransactionCountByHash(params: [string]) {
    const [blockHash] = params
    const block = await this._chain.getBlock(toBuffer(blockHash))
    const json = block.toJSON()
    return `0x${json.transactions!.length.toString(16)}`
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
      const number = latest.number.toString(16)
      if (blockOpt !== `0x${number}`) {
        return {
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
      const number = latest.number.toString(16)
      if (blockOpt !== `0x${number}`) {
        return {
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
      const number = latest.number.toString(16)
      if (blockOpt !== `0x${number}`) {
        return {
          code: INVALID_PARAMS,
          message: `Currently only "latest" block supported`,
        }
      }
    }

    const address = Address.fromString(addressHex)
    const account: Account = await vm.stateManager.getAccount(address)
    return `0x${account.nonce.toString(16)}`
  }

  /**
   * Returns the current ethereum protocol version as a hex-encoded string
   * @param params An empty array
   */
  protocolVersion(_params = []) {
    return `0x${this.ethVersion.toString(16)}`
  }
}
