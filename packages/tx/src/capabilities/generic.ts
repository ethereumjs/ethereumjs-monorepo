import { bigIntToUnpaddedBytes, ecrecover } from '@ethereumjs/util'
import { keccak256 } from 'ethereum-cryptography/keccak.js'

import { Capability, type TypedTransaction } from '../types.js'

export function isSigned(this: TypedTransaction): boolean {
  const { v, r, s } = this
  if (v === undefined || r === undefined || s === undefined) {
    return false
  } else {
    return true
  }
}

export function errorMsg(this: TypedTransaction, msg: string) {
  return `${msg} (${this.errorStr()})`
}

export function hash(this: TypedTransaction): Uint8Array {
  if (!this.isSigned()) {
    const msg = errorMsg.bind(this)('Cannot call hash method if transaction is not signed')
    throw new Error(msg)
  }

  if (Object.isFrozen(this)) {
    if (!this['cache'].hash) {
      this['cache'].hash = keccak256(this.serialize())
    }
    return this['cache'].hash
  }

  return keccak256(this.serialize())
}

export function getSenderPublicKey(this: TypedTransaction): Uint8Array {
  if (this['cache'].senderPubKey !== undefined) {
    return this['cache'].senderPubKey
  }

  const msgHash = this.getMessageToVerifySignature()

  const { v, r, s } = this

  this['_validateHighS']()

  try {
    const sender = ecrecover(
      msgHash,
      v!,
      bigIntToUnpaddedBytes(r!),
      bigIntToUnpaddedBytes(s!),
      this.supports(Capability.EIP155ReplayProtection) ? this.common.chainId() : undefined
    )
    if (Object.isFrozen(this)) {
      this['cache'].senderPubKey = sender
    }
    return sender
  } catch (e: any) {
    const msg = errorMsg.bind(this)('Invalid Signature')
    throw new Error(msg)
  }
}
