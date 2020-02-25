import BN = require('bn.js')
import Common from 'ethereumjs-common'
import { ExecResult } from '../evm'

export interface PrecompileFunc {
  (opts: PrecompileInput): ExecResult
}

export interface PrecompileInput {
  data: Buffer
  gasLimit: BN
  _common: Common
}
