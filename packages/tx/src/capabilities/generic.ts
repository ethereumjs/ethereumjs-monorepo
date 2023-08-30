import { SECP256K1_ORDER_DIV_2, bigIntToUnpaddedBytes, ecrecover } from '@ethereumjs/util'
import { keccak256 } from 'ethereum-cryptography/keccak.js'

import { Capability, type TypedTransaction } from '../types.js'

export function isSigned(tx: TypedTransaction): boolean {
  const { v, r, s } = tx
  if (v === undefined || r === undefined || s === undefined) {
    return false
  } else {
    return true
  }
}

export function errorMsg(tx: TypedTransaction, msg: string) {
  return `${msg} (${tx.errorStr()})`
}

export function hash(tx: TypedTransaction): Uint8Array {
  if (!tx.isSigned()) {
    const msg = errorMsg(tx, 'Cannot call hash method if transaction is not signed')
    throw new Error(msg)
  }

  if (Object.isFrozen(tx)) {
    if (!tx['cache'].hash) {
      tx['cache'].hash = keccak256(tx.serialize())
    }
    return tx['cache'].hash
  }

  return keccak256(tx.serialize())
}

/**
 * EIP-2: All transaction signatures whose s-value is greater than secp256k1n/2are considered invalid.
 * Reasoning: https://ethereum.stackexchange.com/a/55728
 */
export function validateHighS(tx: TypedTransaction): void {
  const { s } = tx
  if (tx.common.gteHardfork('homestead') && s !== undefined && s > SECP256K1_ORDER_DIV_2) {
    const msg = errorMsg(
      tx,
      'Invalid Signature: s-values greater than secp256k1n/2 are considered invalid'
    )
    throw new Error(msg)
  }
}

export function validateYParity(tx: TypedTransaction) {
  const { v } = tx
  if (v !== undefined && v !== BigInt(0) && v !== BigInt(1)) {
    const msg = errorMsg(tx, 'The y-parity of the transaction should either be 0 or 1')
    throw new Error(msg)
  }
}

export function getSenderPublicKey(tx: TypedTransaction): Uint8Array {
  if (tx['cache'].senderPubKey !== undefined) {
    return tx['cache'].senderPubKey
  }

  const msgHash = tx.getMessageToVerifySignature()

  const { v, r, s } = tx

  validateHighS(tx)

  try {
    const sender = ecrecover(
      msgHash,
      v!,
      bigIntToUnpaddedBytes(r!),
      bigIntToUnpaddedBytes(s!),
      tx.supports(Capability.EIP155ReplayProtection) ? tx.common.chainId() : undefined
    )
    if (Object.isFrozen(tx)) {
      tx['cache'].senderPubKey = sender
    }
    return sender
  } catch (e: any) {
    const msg = errorMsg(tx, 'Invalid Signature')
    throw new Error(msg)
  }
}
