import { SECP256K1_ORDER_DIV_2, bigIntToUnpaddedBytes, ecrecover } from '@ethereumjs/util'
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

/**
 * EIP-2: All transaction signatures whose s-value is greater than secp256k1n/2are considered invalid.
 * Reasoning: https://ethereum.stackexchange.com/a/55728
 */
export function validateHighS(this: TypedTransaction): void {
  const { s } = this
  if (this.common.gteHardfork('homestead') && s !== undefined && s > SECP256K1_ORDER_DIV_2) {
    const msg = errorMsg.bind(this)(
      'Invalid Signature: s-values greater than secp256k1n/2 are considered invalid'
    )
    throw new Error(msg)
  }
}

export function validateYParity(this: TypedTransaction) {
  const { v } = this
  if (v !== undefined && v !== BigInt(0) && v !== BigInt(1)) {
    const msg = errorMsg.bind(this)('The y-parity of the transaction should either be 0 or 1')
    throw new Error(msg)
  }
}

export function getSenderPublicKey(this: TypedTransaction): Uint8Array {
  if (this['cache'].senderPubKey !== undefined) {
    return this['cache'].senderPubKey
  }

  const msgHash = this.getMessageToVerifySignature()

  const { v, r, s } = this

  validateHighS.bind(this)()

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
