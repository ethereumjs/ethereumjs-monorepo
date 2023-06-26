import type { ExecResult } from '../evm.js'
import type { EVMInterface } from '../types.js'
import type { Common } from '@ethereumjs/common'
import type { debug } from 'debug'

export interface PrecompileFunc {
  (input: PrecompileInput): Promise<ExecResult> | ExecResult
}

export interface PrecompileInput {
  data: Uint8Array
  gasLimit: bigint
  _common: Common
  _EVM: EVMInterface
  _debug?: debug.Debugger
}
