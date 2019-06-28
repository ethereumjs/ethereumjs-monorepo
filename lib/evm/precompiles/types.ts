import BN = require('bn.js')
import Common from 'ethereumjs-common'
import { ERROR, VmError } from '../../exceptions'

export interface PrecompileFunc {
  (opts: PrecompileInput): PrecompileResult
}

export interface PrecompileInput {
  data: Buffer
  gasLimit: BN
  _common: Common
}

export interface PrecompileResult {
  gasUsed: BN
  return: Buffer
  exception: 0 | 1
  exceptionError?: VmError
}

export function OOGResult(gasLimit: BN): PrecompileResult {
  return {
    return: Buffer.alloc(0),
    gasUsed: gasLimit,
    exception: 0, // 0 means VM fail (in this case because of OOG)
    exceptionError: new VmError(ERROR.OUT_OF_GAS),
  }
}
