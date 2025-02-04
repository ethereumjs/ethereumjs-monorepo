import { StatelessVerkleStateManager } from '@ethereumjs/statemanager'

import { createEVM } from '../constructors.js'
import { EvmErrorResult, OOGResult } from '../evm.js'
import { ERROR, EvmError } from '../exceptions.js'

import { gasLimitCheck } from './util.js'

import { getPrecompileName } from './index.js'

import type { ExecResult } from '../types.js'
import type { PrecompileInput } from './types.js'

export function precompile12(opts: PrecompileInput): ExecResult {
  const pName = getPrecompileName('12')
  const data = opts.data

  const gasUsed = opts.common.param('executeGasCost')
  if (!gasLimitCheck(opts, gasUsed, pName)) {
    return OOGResult(opts.gasLimit)
  }

  if (data.length < 128) {
    return EvmErrorResult(new EvmError(ERROR.INVALID_INPUT_LENGTH), opts.gasLimit)
  }

  const preStateRoot = data.subarray(0, 32) // prestateroot for L2 state
  const postStateRoot = data.subarray(32, 64) // post state root for L2 state
  const trace = data.subarray(64, 96) // reference to state access and
  const executeGasUsed = data.subarray(96)

  const executionResult = true

  const stateManager = new StatelessVerkleStateManager({ common: opts.common })
  const evm = createEVM({ stateManager, common: opts.common })

  opts._debug?.(`${pName} trace executed successfully=${executionResult}`)

  const returnValue = executionResult ? new Uint8Array(1).fill(1) : new Uint8Array(1).fill(0)

  return {
    executionGasUsed: gasUsed,
    returnValue,
  }
}
