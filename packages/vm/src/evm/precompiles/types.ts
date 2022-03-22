import Common from '@ethereumjs/common'
import { ExecResult } from '../evm'
import VM from '../../index'

export interface PrecompileFunc {
  (input: PrecompileInput): Promise<ExecResult> | ExecResult
}

export interface PrecompileInput {
  data: Buffer
  gasLimit: bigint
  _common: Common
  _VM: VM
}
