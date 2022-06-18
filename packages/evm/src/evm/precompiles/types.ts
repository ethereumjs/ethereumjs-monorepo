import Common from '@ethereumjs/common'
import { ExecResult } from '../evm'
import { EVMInterface } from '../types'

export interface PrecompileFunc {
  (input: PrecompileInput): Promise<ExecResult> | ExecResult
}

export interface PrecompileInput {
  data: Buffer
  gasLimit: bigint
  _common: Common
  _EVM: EVMInterface
}
