import type { ExecResult } from '../evm'
import type { EVMInterface } from '../types'
import type { Common } from '@ethereumjs/common'
import type { debug } from 'debug'

export interface PrecompileFunc {
  (input: PrecompileInput): Promise<ExecResult> | ExecResult
}

export interface PrecompileInput {
  data: Buffer
  gasLimit: bigint
  _common: Common
  _EVM: EVMInterface
  _debug?: debug.Debugger
}
