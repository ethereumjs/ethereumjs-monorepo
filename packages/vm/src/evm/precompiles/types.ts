import Common from '@ethereumjs/common'
import { ExecResult } from '../evm'
import EVM from '../evm'

export interface PrecompileFunc {
  (opts: PrecompileInput): Promise<ExecResult> | ExecResult
}

export interface PrecompileInput {
  data: Buffer
  gasLimit: bigint
  _common: Common
  _EVM: EVM
}
