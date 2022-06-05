import Common from '@ethereumjs/common'
import { ExecResult } from '../evm.js'
import EVM from '../evm.js'

export interface PrecompileFunc {
  (input: PrecompileInput): Promise<ExecResult> | ExecResult
}

export interface PrecompileInput {
  data: Buffer
  gasLimit: bigint
  _common: Common
  _EVM: EVM
}
