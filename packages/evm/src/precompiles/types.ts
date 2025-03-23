import type { Common } from '@ethereumjs/common'
import type { debug } from 'debug'
import type { EVMInterface, ExecResult } from '../types.ts'

export interface PrecompileFunc {
  (input: PrecompileInput): Promise<ExecResult> | ExecResult
}

export interface PrecompileInput {
  data: Uint8Array
  gasLimit: bigint
  common: Common
  _EVM: EVMInterface
  _debug?: debug.Debugger
}
