import { bigIntToHex, bytesToPrefixedHexString, hexStringToBytes } from '@ethereumjs/util'

import { INTERNAL_ERROR, INVALID_PARAMS } from '../error-code'
import { middleware, validators } from '../validation'

import type { EthereumClient } from '../..'
import type { FullEthereumService } from '../../service'

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
  /**
   * Create debug_* RPC module
   * @param client Client to which the module binds
   */
  constructor(client: EthereumClient) {
    this.service = client.services.find((s) => s.name === 'eth') as FullEthereumService
    this.traceTransaction = middleware(this.traceTransaction.bind(this), 1, [[validators.hex]])
  }

  /**
   * Returns a call trace for the requested transaction or null if not available
   * @param params string representing the transaction hash
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
        hexStringToBytes(txHash)
      )
      if (!result) return null
      const [_, blockHash, txIndex] = result
      const block = await this.service.chain.getBlock(blockHash)
      const parentBlock = await this.service.chain.getBlock(block.header.parentHash)
      const tx = block.transactions[txIndex]

      // Copy VM so as to not modify state when running transactions being traced
      const vmCopy = await this.service.execution.vm.copy()
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
            const word = bytesToPrefixedHexString(step.memory.slice(x * 32, 32))
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
      trace.returnValue = bytesToPrefixedHexString(res.execResult.returnValue)
      return trace
    } catch (err: any) {
      throw {
        code: INTERNAL_ERROR,
        message: err.message.toString(),
      }
    }
  }
}
