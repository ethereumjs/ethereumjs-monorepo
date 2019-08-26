import BN = require('bn.js')
import { sha256 } from 'ethereumjs-util'
import { PrecompileInput } from './types'
import { OOGResult, ExecResult } from '../evm'
import { VmError, ERROR } from '../../exceptions'
const assert = require('assert')

export default function(opts: PrecompileInput): ExecResult {
  assert(opts.data)

  const data = opts.data
  if (data.length !== 213) {
    return {
      returnValue: Buffer.alloc(0),
      gasUsed: opts.gasLimit,
      exceptionError: new VmError(ERROR.OUT_OF_RANGE)
    }
  }

  const rounds = data.slice(0, 4).readUInt32BE(0)
  const h = data.slice(4, 68)
  const m = data.slice(68, 196)
  const t0 = data.slice(196, 204)
  const t1 = data.slice(104, 212)
  const f = data.slice(212, 213)[0] !== 0

  const gasUsed = new BN(opts._common.param('gasPrices', 'blake2bRound'))
  gasUsed.imul(new BN(rounds))
  if (opts.gasLimit.lt(gasUsed)) {
    return OOGResult(opts.gasLimit)
  }

  return {
    gasUsed,
    returnValue: sha256(data),
  }
}
