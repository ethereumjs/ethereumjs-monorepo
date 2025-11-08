import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

import type { InterpreterStep } from '@ethereumjs/evm'
import { bytesToHex } from '@ethereumjs/util'
import type { AfterTxEvent } from '../../src/types.ts'
import type { VM } from '../../src/vm.ts'
import type { T8NOptions } from './types.ts'

export function getArguments() {
  const argsParsed = yargs(hideBin(process.argv))
    .parserConfiguration({
      'dot-notation': false,
    })
    .option('state.fork', {
      describe: 'Fork to use',
      type: 'string',
      demandOption: true,
    })
    .option('state.chainid', {
      describe: 'ChainID to use',
      type: 'string',
      default: '1',
    })
    .option('state.reward', {
      describe:
        'Coinbase reward after running txs. If 0: coinbase account is touched and rewarded 0 wei. If -1, the coinbase account is not touched (default)',
      type: 'string',
      default: '-1',
    })
    .option('input.alloc', {
      describe: 'Initial state allocation',
      type: 'string',
      demandOption: true,
    })
    .option('input.txs', {
      describe: 'JSON input of txs to run on top of the initial state allocation',
      type: 'string',
      demandOption: true,
    })
    .option('input.env', {
      describe: 'Input environment (coinbase, difficulty, etc.)',
      type: 'string',
      demandOption: true,
    })
    .option('output.basedir', {
      describe: 'Base directory to write output to',
      type: 'string',
      demandOption: true,
    })
    .option('output.result', {
      describe: 'File to write output results to (relative to `output.basedir`)',
      type: 'string',
      demandOption: true,
    })
    .option('output.alloc', {
      describe: 'File to write output allocation to (after running the transactions)',
      type: 'string',
      demandOption: true,
    })
    .option('output.body', {
      deprecate: true,
      description: 'File to write transaction RLPs to (currently unused)',
      type: 'string',
    })
    .option('log', {
      describe: 'Optionally write light-trace logs to stdout',
      type: 'boolean',
      default: false,
    })
    .option('trace', {
      describe: 'Write EVM traces as JSON to trace-<tx-number>-<tx-hash>.json',
      type: 'boolean',
      default: false,
    })
    .strict()
    .help().argv

  const args = argsParsed as any as T8NOptions

  args.input = {
    alloc: (args as any)['input.alloc'],
    txs: (args as any)['input.txs'],
    env: (args as any)['input.env'],
  }
  args.output = {
    basedir: (args as any)['output.basedir'],
    result: (args as any)['output.result'],
    alloc: (args as any)['output.alloc'],
  }
  args.state = {
    fork: (args as any)['state.fork'],
    reward: BigInt((args as any)['state.reward']),
    chainid: BigInt((args as any)['state.chainid']),
  }
  args.trace = (args as any)['trace']
  return args
}

/**
 * This function accepts an `inputs.env` which converts non-hex-prefixed numbers
 * to a BigInt value, to avoid errors when converting non-prefixed hex strings to
 * numbers
 * @param input
 * @returns converted input
 */
export function normalizeNumbers(input: any) {
  const keys = [
    'currentGasLimit',
    'currentNumber',
    'currentTimestamp',
    'currentRandom',
    'currentDifficulty',
    'currentBaseFee',
    'currentBlobGasUsed',
    'currentExcessBlobGas',
    'parentDifficulty',
    'parentTimestamp',
    'parentBaseFee',
    'parentGasUsed',
    'parentGasLimit',
    'parentBlobGasUsed',
    'parentExcessBlobGas',
  ]

  for (const key of keys) {
    const value = input[key]
    if (value !== undefined) {
      if (value.substring(0, 2) !== '0x') {
        input[key] = BigInt(value)
      }
    }
  }
  return input
}

/**
 * Formats an individual EVM step trace as a JSON object
 * @param step an {@link InterpreterStep} emitted by the EVM `step` event
 * @param memory whether to include the memory in the trace
 * @returns a JSON object that matches the EIP-7756 trace format
 */
export const stepTraceJSON = (step: InterpreterStep, memory: boolean = false) => {
  let hexStack = []
  hexStack = step.stack.map((item: bigint) => {
    return '0x' + item.toString(16)
  })
  let memWords = undefined
  const memSize = Number(step.memoryWordCount) * 8 // memSize is reported in bytes, not words (i.e 32 bytes)
  if (memory) {
    memWords = []
    for (let i = 0; i < step.memoryWordCount; i++) {
      memWords.push(bytesToHex(step.memory.slice(i * 32, (i + 1) * 32))) // memory is returned in 32 byte words
    }
  }

  const opTrace = {
    pc: step.pc,
    op: '0x' + step.opcode.code.toString(16),
    gas: Number(step.gasLeft),
    gasCost: Number(step.opcode.dynamicFee ?? BigInt(step.opcode.fee)), // if `dynamicFee` is set, it includes base fee
    memory: memory ? memWords : undefined,
    memSize,
    stack: hexStack,
    depth: step.depth + 1, // Depth starts at 1 - EIP-7756
    refund: Number(step.gasRefund),
    opName: step.opcode.name,
    section: step.eofSection,
    immediate: step.immediate !== undefined ? bytesToHex(step.immediate) : undefined,
    functionDepth: step.eofFunctionDepth,
    error: step.error !== undefined ? step.error.toString() : undefined,
  }
  return opTrace
}

/**
 * Formats an individual EVM summary trace as a JSON object
 * @param event an {@link AfterTxEvent} emitted by the vm `afterTx` event
 * @param vm a {@link VM} instance
 * @returns a JSON object that matches the EIP-7756 summary object format
 */
export const summaryTraceJSON = async (event: AfterTxEvent, vm: VM) => {
  const summary = {
    stateRoot: bytesToHex(await vm.stateManager.getStateRoot()),
    output: event.execResult.returnValue.length > 0 ? bytesToHex(event.execResult.returnValue) : '',
    gasUsed: Number(event.totalGasSpent),
    pass: event.execResult.exceptionError === undefined,
    fork: vm.common.hardfork(),
  }
  return summary
}
