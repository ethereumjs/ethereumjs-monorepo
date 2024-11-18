import { RLP } from '@ethereumjs/rlp'
import {
  BIGINT_2,
  BIGINT_8,
  bigIntToUnpaddedBytes,
  bytesToBigInt,
  bytesToHex,
  ecsign,
  toBytes,
  unpadBytes,
} from '@ethereumjs/util'
import { keccak256 } from 'ethereum-cryptography/keccak'

import { createLegacyTx } from '../legacy/constructors.js'
import { Capability, TransactionType, isLegacyTx } from '../types.js'

import { isSigned } from './ecdsaSignable.js'

import type { LegacyTxInterface, TxValuesArray } from '../types.js'

function errorMsg(tx: LegacyTxInterface, msg: string) {
  return `${msg} (${errorStr(tx)})`
}

// TODO maybe move this to shared methods (util.ts in features)
export function getSharedErrorPostfix(tx: LegacyTxInterface) {
  let hashStr = ''
  try {
    hashStr = isSigned(tx) ? bytesToHex(hash(tx)) : 'not available (unsigned)'
  } catch (e: any) {
    hashStr = 'error'
  }
  let signStr = ''
  try {
    signStr = isSigned(tx).toString()
  } catch (e: any) {
    hashStr = 'error'
  }
  let hf = ''
  try {
    hf = tx.common.hardfork()
  } catch (e: any) {
    hf = 'error'
  }

  let postfix = `tx type=${tx.type} hash=${hashStr} nonce=${tx.nonce} value=${tx.value} `
  postfix += `signed=${signStr} hf=${hf}`

  return postfix
}

/**
 * Return a compact error string representation of the object
 */
export function errorStr(tx: LegacyTxInterface) {
  let errorStr = getSharedErrorPostfix(tx)
  errorStr += ` gasPrice=${tx.gasPrice}`
  return errorStr
}

/**
 * Returns the hashed serialized unsigned tx, which can be used
 * to sign the transaction (e.g. for sending to a hardware wallet).
 */
export function getHashedMessageToSign(tx: LegacyTxInterface) {
  if (!isLegacyTx(tx)) {
    throw new Error('Transaction is not a legacy tx')
  }
  const message = getMessageToSign(tx)
  const keccak = tx.common.customCrypto.keccak256 ?? keccak256
  return keccak(RLP.encode(message))
}

/**
 * Computes a sha3-256 hash which can be used to verify the signature
 */
export function getMessageToVerifySignature(tx: LegacyTxInterface) {
  if (!isLegacyTx(tx)) {
    throw new Error('Transaction is not a legacy tx')
  }
  if (!isSigned(tx)) {
    const msg = errorMsg(tx, 'This transaction is not signed')
    throw new Error(msg)
  }
  return getHashedMessageToSign(tx)
}

/**
 * Returns the raw unsigned tx, which can be used
 * to sign the transaction (e.g. for sending to a hardware wallet).
 *
 * Note: the raw message message format for the legacy tx is not RLP encoded
 * and you might need to do yourself with:
 *
 * ```javascript
 * import { RLP } from '@ethereumjs/rlp'
 * const message = tx.getMessageToSign()
 * const serializedMessage = RLP.encode(message)) // use this for the HW wallet input
 * ```
 */
export function getMessageToSign(tx: LegacyTxInterface): Uint8Array[] {
  if (!isLegacyTx(tx)) {
    throw new Error('Transaction is not a legacy tx')
  }
  const message = [
    bigIntToUnpaddedBytes(tx.nonce),
    bigIntToUnpaddedBytes(tx.gasPrice),
    bigIntToUnpaddedBytes(tx.gasLimit),
    tx.to !== undefined ? tx.to.bytes : new Uint8Array(0),
    bigIntToUnpaddedBytes(tx.value),
    tx.data,
  ]

  if (tx.activeCapabilities.includes(Capability.EIP155ReplayProtection)) {
    message.push(bigIntToUnpaddedBytes(tx.common.chainId()))
    message.push(unpadBytes(toBytes(0)))
    message.push(unpadBytes(toBytes(0)))
  }

  return message
}

/**
 * Returns a Uint8Array Array of the raw Bytes of the legacy transaction, in order.
 *
 * Format: `[nonce, gasPrice, gasLimit, to, value, data, v, r, s]`
 *
 * For legacy txs this is also the correct format to add transactions
 * to a block with {@link createBlockFromBytesArray} (use the `serialize()` method
 * for typed txs).
 *
 * For an unsigned tx this method returns the empty Bytes values
 * for the signature parameters `v`, `r` and `s`. For an EIP-155 compliant
 * representation have a look at {@link Transaction.getMessageToSign}.
 */
export function raw(tx: LegacyTxInterface): TxValuesArray[TransactionType.Legacy] {
  if (!isLegacyTx(tx)) {
    throw new Error('Transaction is not a legacy tx')
  }
  return [
    bigIntToUnpaddedBytes(tx.nonce),
    bigIntToUnpaddedBytes(tx.gasPrice),
    bigIntToUnpaddedBytes(tx.gasLimit),
    tx.to !== undefined ? tx.to.bytes : new Uint8Array(0),
    bigIntToUnpaddedBytes(tx.value),
    tx.data,
    tx.v !== undefined ? bigIntToUnpaddedBytes(tx.v) : new Uint8Array(0),
    tx.r !== undefined ? bigIntToUnpaddedBytes(tx.r) : new Uint8Array(0),
    tx.s !== undefined ? bigIntToUnpaddedBytes(tx.s) : new Uint8Array(0),
  ]
}

/**
 * Returns the serialized encoding of the legacy transaction.
 *
 * Format: `rlp([nonce, gasPrice, gasLimit, to, value, data, v, r, s])`
 *
 * For an unsigned tx this method uses the empty Uint8Array values for the
 * signature parameters `v`, `r` and `s` for encoding. For an EIP-155 compliant
 * representation for external signing use {@link Transaction.getMessageToSign}.
 */
export function serialize(tx: LegacyTxInterface): Uint8Array {
  if (!isLegacyTx(tx)) {
    throw new Error('Transaction is not a legacy tx')
  }
  return RLP.encode(raw(tx))
}

/**
 * Signs a transaction.
 *
 * Note that the signed tx is returned as a new object,
 * use as follows:
 * ```javascript
 * const signedTx = tx.sign(privateKey)
 * ```
 */
export function sign(tx: LegacyTxInterface, privateKey: Uint8Array): LegacyTxInterface {
  if (!isLegacyTx(tx)) {
    throw new Error('Transaction is not a legacy tx')
  }
  if (privateKey.length !== 32) {
    throw new Error('Private key must be 32 bytes in length.')
  }

  // TODO (Jochem, 05 nov 2024): figure out what this hack does and clean it up

  // Hack for the constellation that we have got a legacy tx after spuriousDragon with a non-EIP155 conforming signature
  // and want to recreate a signature (where EIP155 should be applied)
  // Leaving this hack lets the legacy.spec.ts -> sign(), verifySignature() test fail
  // 2021-06-23
  let hackApplied = false
  if (
    tx.type === TransactionType.Legacy &&
    tx.common.gteHardfork('spuriousDragon') &&
    !tx.activeCapabilities.includes(Capability.EIP155ReplayProtection)
  ) {
    // cast as any to edit the protected `activeCapabilities`
    ;(tx as any).activeCapabilities.push(Capability.EIP155ReplayProtection)
    hackApplied = true
  }

  const msgHash = getHashedMessageToSign(tx)
  const ecSignFunction = tx.common.customCrypto?.ecsign ?? ecsign
  const { v, r, s } = ecSignFunction(msgHash, privateKey)
  const signedTx = addSignature(tx, v, r, s, true)

  // Hack part 2
  if (hackApplied) {
    // cast as any to edit the protected `activeCapabilities`
    const index = (<any>tx).activeCapabilities.indexOf(Capability.EIP155ReplayProtection)
    if (index > -1) {
      // cast as any to edit the protected `activeCapabilities`
      ;(<any>tx).activeCapabilities.splice(index, 1)
    }
  }

  return signedTx
}

// TODO: this should likely be added to `ecdsaSignable.ts`
// Then this would need an extra param, which would represent the constructor of the tx (here: `createLegacyTx`)
export function addSignature(
  tx: LegacyTxInterface,
  v: bigint,
  r: Uint8Array | bigint,
  s: Uint8Array | bigint,
  convertV: boolean = false,
): LegacyTxInterface {
  r = toBytes(r)
  s = toBytes(s)
  if (convertV && tx.activeCapabilities.includes(Capability.EIP155ReplayProtection)) {
    v += tx.common.chainId() * BIGINT_2 + BIGINT_8
  }

  const opts = { ...tx.txOptions, common: tx.common }

  return createLegacyTx(
    {
      nonce: tx.nonce,
      gasPrice: tx.gasPrice,
      gasLimit: tx.gasLimit,
      to: tx.to,
      value: tx.value,
      data: tx.data,
      v,
      r: bytesToBigInt(r),
      s: bytesToBigInt(s),
    },
    opts,
  )
}

// TODO: move this to generic and replace the LegacyTxInterface with something better
export function hash(tx: LegacyTxInterface): Uint8Array {
  if (!isSigned(tx)) {
    const msg = errorMsg(tx, 'Cannot call hash method if transaction is not signed')
    throw new Error(msg)
  }

  const keccakFunction = tx.common.customCrypto.keccak256 ?? keccak256

  if (Object.isFrozen(tx)) {
    if (!tx.cache.hash) {
      tx.cache.hash = keccakFunction(serialize(tx))
    }
    return tx.cache.hash
  }

  return keccakFunction(serialize(tx))
}
