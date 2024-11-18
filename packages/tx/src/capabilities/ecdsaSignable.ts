import type { ECDSASignableInterface } from '../types.js'

// TODO: likely add `addSignature`, `getSenderPublicKey`, `getSenderAddress`, `verifySignature`, `sign`
// to this capability as well!

// TxInterface does not support v/r/s by default
export function isSigned(tx: ECDSASignableInterface): boolean {
  const { v, r, s } = tx
  if (v === undefined || r === undefined || s === undefined) {
    return false
  } else {
    return true
  }
}
