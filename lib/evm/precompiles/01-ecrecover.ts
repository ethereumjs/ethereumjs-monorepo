import BN = require('bn.js')
import { setLengthLeft, setLengthRight, ecrecover, publicToAddress } from 'ethereumjs-util'
import { PrecompileInput, PrecompileResult, OOGResult } from './types'
const assert = require('assert')

export default function(opts: PrecompileInput): PrecompileResult {
  assert(opts.data)

  const gasUsed = new BN(opts._common.param('gasPrices', 'ecRecover'))

  if (opts.gasLimit.lt(gasUsed)) {
    return OOGResult(opts.gasLimit)
  }

  const data = setLengthRight(opts.data, 128)

  var msgHash = data.slice(0, 32)
  const v = data.slice(32, 64)
  const r = data.slice(64, 96)
  const s = data.slice(96, 128)

  let publicKey
  try {
    publicKey = ecrecover(msgHash, new BN(v).toNumber(), r, s)
  } catch (e) {
    return {
      gasUsed,
      return: Buffer.alloc(0),
      exception: 1,
    }
  }

  return {
    gasUsed,
    return: setLengthLeft(publicToAddress(publicKey), 32),
    exception: 1,
  }
}
