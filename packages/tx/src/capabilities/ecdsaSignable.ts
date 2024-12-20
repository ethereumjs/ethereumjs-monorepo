import {
  Address,
  SECP256K1_ORDER_DIV_2,
  bigIntToUnpaddedBytes,
  ecrecover,
  publicToAddress,
  unpadBytes,
} from '@ethereumjs/util'

import { Capability, type ECDSASignableInterface, type TxInterface } from '../types.js'

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

/**
 * EIP-2: All transaction signatures whose s-value is greater than secp256k1n/2are considered invalid.
 * Reasoning: https://ethereum.stackexchange.com/a/55728
 */
export function validateHighS(tx: ECDSASignableInterface): void {
  const { s } = tx
  if (tx.common.gteHardfork('homestead') && s !== undefined && s > SECP256K1_ORDER_DIV_2) {
    /*const msg = errorMsg(
        tx,
        'Invalid Signature: s-values greater than secp256k1n/2 are considered invalid',
      )*/
    throw new Error('Invalid Signature: s-values greater than secp256k1n/2 are considered invalid')
  }
}

export function getSenderPublicKey(
  tx: ECDSASignableInterface,
  getHashedMessageToSign: (tx: TxInterface) => Uint8Array,
): Uint8Array {
  if (tx.cache.senderPubKey !== undefined) {
    return tx.cache.senderPubKey
  }

  const msgHash = getHashedMessageToSign(tx)

  const { v, r, s } = tx

  validateHighS(tx)

  try {
    const ecrecoverFunction = tx.common.customCrypto.ecrecover ?? ecrecover
    const sender = ecrecoverFunction(
      msgHash,
      v!,
      bigIntToUnpaddedBytes(r!),
      bigIntToUnpaddedBytes(s!),
      tx.activeCapabilities.includes(Capability.EIP155ReplayProtection)
        ? tx.common.chainId()
        : undefined,
    )
    if (Object.isFrozen(tx)) {
      tx.cache.senderPubKey = sender
    }
    return sender
  } catch (e: any) {
    //const msg = errorMsg(tx, 'Invalid Signature') // TODO: generic errorMsg handling?
    throw new Error('Invalid Signature')
  }
}

/**
 * Determines if the signature is valid
 */
export function verifySignature(
  tx: ECDSASignableInterface,
  getMessageToVerifySignature: (tx: TxInterface) => Uint8Array,
): boolean {
  try {
    // Main signature verification is done in `getSenderPublicKey()`
    const publicKey = getSenderPublicKey(tx, getMessageToVerifySignature)
    return unpadBytes(publicKey).length !== 0
  } catch (e: any) {
    return false
  }
}

/**
 * Validates the transaction signature and minimum gas requirements.
 * @returns {boolean} true if the transaction is valid, false otherwise
 */
// TODO: we can likely remove this method, it is used nowhere (?)
/*export function isValid(tx: LegacyTxInterface): boolean {
  const errors = tx.getValidationErrors()

  return errors.length === 0
}*/

export function getSenderAddress(tx: ECDSASignableInterface): Address {
  return new Address(publicToAddress(getSenderPublicKey(tx)))
}
