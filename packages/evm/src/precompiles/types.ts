import type { EVM, ExecResult } from '../evm.js'
import type { Common } from '@ethereumjs/common'
import type { debug } from 'debug'

export interface PrecompileFunc {
  (input: PrecompileInput): Promise<ExecResult> | ExecResult
}

export interface PrecompileInput {
  data: Uint8Array
  gasLimit: bigint
  common: Common
  _EVM: EVM
  _debug?: debug.Debugger
}
