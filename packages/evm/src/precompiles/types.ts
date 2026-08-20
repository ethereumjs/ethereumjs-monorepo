import type { Common } from '@ethereumjs/common'
import type { debug } from 'debug'
import type { EVMInterface, ExecResult } from '../types.ts'

/** Precompile implementation invoked at a fixed address when the EVM calls compiled code. */
export interface PrecompileFunc {
  (input: PrecompileInput): Promise<ExecResult> | ExecResult
}

/** Inputs passed to every precompile handler (calldata, gas limit, host EVM). */
export interface PrecompileInput {
  data: Uint8Array
  gasLimit: bigint
  common: Common
  _EVM: EVMInterface
  _debug?: debug.Debugger
}
