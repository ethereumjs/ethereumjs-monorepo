import {
  Address,
  TypeOutput,
  bigIntToHex,
  bytesToBigInt,
  bytesToHex,
  hexToBytes,
  toType,
} from '@ethereumjs/util'

import { INTERNAL_ERROR, INVALID_PARAMS } from '../error-code'
import { getBlockByOption } from '../helpers'
import { middleware, validators } from '../validation'

import type { EthereumClient } from '../..'
import type { Chain } from '../../blockchain'
import type { FullEthereumService } from '../../service'
import type { RpcTx } from '../types'
import type { Block } from '@ethereumjs/block'
import type { VM } from '@ethereumjs/vm'

export interface tracerOpts {
  disableStack?: boolean
  disableStorage?: boolean
  enableMemory?: boolean
  enableReturnData?: boolean
  tracer?: string
  timeout?: string
  tracerConfig?: any
}

export interface structLog {
  depth: number
  gas: number
  gasCost: number
  op: string
  pc: number
  stack: string[] | undefined
  memory: string[] | undefined
  returnData: string[] | undefined
  storage: {
    [key: string]: string
  }
  error: boolean | undefined | null
}
/**
 * Validate tracer opts to ensure only supports opts are provided
 * @param opts a dictionary of {@link tracerOpts}
 * @returns a dictionary of valid {@link tracerOpts}
 * @throws if invalid tracer options are provided
 */
const validateTracerConfig = (opts: tracerOpts): tracerOpts => {
  if (opts.tracerConfig !== undefined) {
    throw {
      code: INVALID_PARAMS,
      message: 'custom tracers and tracer configurations are not implemented',
    }
  }
  if (opts.tracer !== undefined) {
    throw {
      code: INVALID_PARAMS,
      message: 'custom tracers not implemented',
    }
  }
  if (opts.timeout !== undefined) {
    throw {
      code: INVALID_PARAMS,
      message: 'custom tracer timeouts not implemented',
    }
  }

  if (opts.enableReturnData === true) {
    throw {
      code: INVALID_PARAMS,
      message: 'enabling return data not implemented',
    }
  }
  return {
    ...{ disableStack: false, disableStorage: false, enableMemory: false, enableReturnData: false },
    ...opts,
  }
}
/**
 * debug_* RPC module
 * @memberof module:rpc/modules
 */
export class Debug {
  private service: FullEthereumService
  private chain: Chain
  private vm: VM
  /**
   * Create debug_* RPC module
   * @param client Client to which the module binds
   */
  constructor(client: EthereumClient) {
    this.service = client.services.find((s) => s.name === 'eth') as FullEthereumService
    this.chain = this.service.chain
    this.vm = (this.service as FullEthereumService).execution?.vm
    this.traceTransaction = middleware(this.traceTransaction.bind(this), 1, [[validators.hex]])
    this.traceCall = middleware(this.traceCall.bind(this), 2, [
      [validators.transaction()],
      [validators.blockOption],
    ])
    this.storageRangeAt = middleware(this.storageRangeAt.bind(this), 5, [[validators.hex]])
  }

  /**
   * Returns a call trace for the requested transaction or null if not available
   * @param params an array of two parameters:
   *     1. string representing the transaction hash
   *     2. an optional tracer options object
   */
  async traceTransaction(params: [string, tracerOpts]) {
    const [txHash, config] = params

    // Validate configuration and parameters
    if (!this.service.execution.receiptsManager) {
      throw {
        message: 'missing receiptsManager',
        code: INTERNAL_ERROR,
      }
    }

    const opts = validateTracerConfig(config)

    try {
      const result = await this.service.execution.receiptsManager.getReceiptByTxHash(
        hexToBytes(txHash)
      )
      if (!result) return null
      const [_, blockHash, txIndex] = result
      const block = await this.service.chain.getBlock(blockHash)
      const parentBlock = await this.service.chain.getBlock(block.header.parentHash)
      const tx = block.transactions[txIndex]

      // Copy VM so as to not modify state when running transactions being traced
      const vmCopy = await this.service.execution.vm.shallowCopy()
      await vmCopy.stateManager.setStateRoot(parentBlock.header.stateRoot)
      for (let x = 0; x < txIndex; x++) {
        // Run all txns in the block prior to the traced transaction
        await vmCopy.runTx({ tx: block.transactions[x], block })
      }

      const trace = {
        gas: '',
        returnValue: '',
        failed: false,
        structLogs: [] as structLog[],
      }
      vmCopy.evm.events?.on('step', async (step, next) => {
        const memory = []
        let storage = {}
        if (opts.disableStorage === false) {
          storage = await vmCopy.stateManager.dumpStorage(step.address)
        }
        if (opts.enableMemory === true) {
          for (let x = 0; x < step.memoryWordCount; x++) {
            const word = bytesToHex(step.memory.slice(x * 32, 32))
            memory.push(word)
          }
        }
        const log = {
          pc: step.pc,
          op: step.opcode.name,
          gasCost: step.opcode.fee + Number(step.opcode.dynamicFee),
          gas: Number(step.gasLeft),
          depth: step.depth,
          error: null,
          stack: opts.disableStack !== true ? step.stack.map(bigIntToHex) : undefined,
          storage,
          memory,
          returnData: undefined,
        }
        trace.structLogs.push(log)
        next?.()
      })

      vmCopy.evm.events?.on('afterMessage', (data, next) => {
        if (data.execResult.exceptionError !== undefined && trace.structLogs.length > 0) {
          // Mark last opcode trace as error if exception occurs
          trace.structLogs[trace.structLogs.length - 1].error = true
        }
        next?.()
      })
      const res = await vmCopy.runTx({ tx, block })
      trace.gas = bigIntToHex(res.totalGasSpent)
      trace.failed = res.execResult.exceptionError !== undefined
      trace.returnValue = bytesToHex(res.execResult.returnValue)
      return trace
    } catch (err: any) {
      throw {
        code: INTERNAL_ERROR,
        message: err.message.toString(),
      }
    }
  }

  /**
   * Returns a trace of an eth_call within the context of the given block execution using the final state of the parent block
   * @param params an array of 3 parameters:
   *    1. an {@link RpcTx} object that mirrors the eth_call parameters object
   *    2. A block hash or number formatted as a hex prefixed string
   *    3. An optional tracer options object
   * @returns an execution trace of an {@link eth_call} in the context of a given block execution
   * mirroring the output from {@link traceTransaction}
   */
  async traceCall(params: [RpcTx, string, tracerOpts]) {
    const [callArgs, blockOpt, tracerOpts] = params
    // Validate configuration and parameters
    if (!this.service.execution.receiptsManager) {
      throw {
        message: 'missing receiptsManager',
        code: INTERNAL_ERROR,
      }
    }

    if (this.vm === undefined) {
      throw new Error('missing vm')
    }

    const opts = validateTracerConfig(tracerOpts)

    const block = await getBlockByOption(blockOpt, this.chain)
    const parentBlock = await this.service.chain.getBlock(block.header.parentHash)

    const vm = await this.vm.shallowCopy()
    await vm.stateManager.setStateRoot(parentBlock.header.stateRoot)
    const { from, to, gas: gasLimit, gasPrice, value, data } = callArgs

    const trace = {
      gas: '',
      returnValue: '',
      failed: false,
      structLogs: [] as structLog[],
    }
    vm.evm.events?.on('step', async (step, next) => {
      const memory = []
      let storage = {}
      if (opts.disableStorage === false) {
        storage = await vm.stateManager.dumpStorage(step.address)
      }
      if (opts.enableMemory === true) {
        for (let x = 0; x < step.memoryWordCount; x++) {
          const word = bytesToHex(step.memory.slice(x * 32, 32))
          memory.push(word)
        }
      }
      const log = {
        pc: step.pc,
        op: step.opcode.name,
        gasCost: step.opcode.fee + Number(step.opcode.dynamicFee),
        gas: Number(step.gasLeft),
        depth: step.depth,
        error: null,
        stack: opts.disableStack !== true ? step.stack.map(bigIntToHex) : undefined,
        storage,
        memory,
        returnData: undefined,
      }
      trace.structLogs.push(log)
      next?.()
    })

    vm.evm.events?.on('afterMessage', (data, next) => {
      if (data.execResult.exceptionError !== undefined && trace.structLogs.length > 0) {
        // Mark last opcode trace as error if exception occurs
        trace.structLogs[trace.structLogs.length - 1].error = true
      }
      next?.()
    })
    const runCallOpts = {
      caller: from !== undefined ? Address.fromString(from) : undefined,
      to: to !== undefined ? Address.fromString(to) : undefined,
      gasLimit: toType(gasLimit, TypeOutput.BigInt),
      gasPrice: toType(gasPrice, TypeOutput.BigInt),
      value: toType(value, TypeOutput.BigInt),
      data: data !== undefined ? hexToBytes(data) : undefined,
    }
    const res = await vm.evm.runCall(runCallOpts)
    trace.gas = bigIntToHex(res.execResult.executionGasUsed)
    trace.failed = res.execResult.exceptionError !== undefined
    trace.returnValue = bytesToHex(res.execResult.returnValue)
    return trace
  }
  catch(err: any) {
    throw {
      code: INTERNAL_ERROR,
      message: err.message.toString(),
    }
  }

  /**
   * Returns a limited set of storage keys belonging to an account.
   * @param params An array of 5 parameters:
   *    1. The hash of the block that contains the requested account storage.
   *    2. The number index of the requested transaction within the block.
   *    3. The address of the account.
   *    4. The smallest (hashed) storage key that will be returned. To include the entire range, pass '0x00'.
   *    5. The maximum number of storage values that will be returned.
   * @returns A {@link StorageRange} object that will contain at most `limit` entries in its `storage` field.
   * The object will also contain `nextKey`, the next (hashed) storage key after the range included in `storage`.
   */
  async storageRangeAt(params: [string, number, string, string, number]) {
    const [blockHash, txIndex, account, startKey, limit] = params

    if (txIndex < 0) {
      throw {
        code: INTERNAL_ERROR,
        message: 'txIndex cannot be smaller than 0.',
      }
    }

    let address: Address
    let blockHashBytes: Uint8Array
    let startKeyBytes: Uint8Array
    try {
      address = Address.fromString(account)
      blockHashBytes = hexToBytes(blockHash)
      startKeyBytes = hexToBytes(startKey)
    } catch (err: any) {
      throw {
        code: INVALID_PARAMS,
        message: err.message.toString(),
      }
    }

    let block: Block
    try {
      block = await this.service.chain.getBlock(blockHashBytes)
    } catch (err: any) {
      throw {
        code: INTERNAL_ERROR,
        message: 'Could not get requested block hash.',
      }
    }

    if (txIndex + 1 > block.transactions.length) {
      throw {
        code: INTERNAL_ERROR,
        message: 'txIndex cannot be larger than the number of transactions in the block.',
      }
    }

    try {
      const block = await this.service.chain.getBlock(hexToBytes(blockHash))
      const parentBlock = await this.service.chain.getBlock(block.header.parentHash)

      // Copy the VM and run transactions including the relevant transaction.
      const vmCopy = await this.service.execution.vm.shallowCopy()
      await vmCopy.stateManager.setStateRoot(parentBlock.header.stateRoot)
      for (let i = 0; i <= txIndex; i++) {
        await vmCopy.runTx({ tx: block.transactions[i], block })
      }

      return await vmCopy.stateManager.dumpStorageRange(
        address,
        bytesToBigInt(startKeyBytes),
        limit
      )
    } catch (err: any) {
      throw {
        code: INTERNAL_ERROR,
        message: err.message.toString(),
      }
    }
  }
}
