import { RLP } from '@ethereumjs/rlp'
import {
  Address,
  BIGINT_0,
  BIGINT_2,
  BIGINT_8,
  SECP256K1_ORDER_DIV_2,
  bigIntToHex,
  bigIntToUnpaddedBytes,
  bytesToBigInt,
  bytesToHex,
  ecrecover,
  ecsign,
  publicToAddress,
  toBytes,
  unpadBytes,
} from '@ethereumjs/util'
import { keccak256 } from 'ethereum-cryptography/keccak.js'

import { createLegacyTx } from '../legacy/constructors.js'
import { Capability, TransactionType } from '../types.js'

import * as Generic from './generic.js'

import type { LegacyTx } from '../legacy/tx.js'
import type { JSONTx, LegacyTxInterface, Transaction, TxValuesArray } from '../types.js'

export function errorMsg(tx: LegacyTxInterface, msg: string) {
  return `${msg} (${tx.errorStr()})`
}

export function isSigned(tx: LegacyTxInterface): boolean {
  const { v, r, s } = tx
  if (v === undefined || r === undefined || s === undefined) {
    return false
  } else {
    return true
  }
}

/**
 * The amount of gas paid for the data in this tx
 */
export function getDataGas(tx: LegacyTxInterface, extraCost?: bigint): bigint {
  if (tx.cache.dataFee && tx.cache.dataFee.hardfork === tx.common.hardfork()) {
    return tx.cache.dataFee.value
  }

  const txDataZero = tx.common.param('txDataZeroGas')
  const txDataNonZero = tx.common.param('txDataNonZeroGas')

  let cost = extraCost ?? BIGINT_0
  for (let i = 0; i < tx.data.length; i++) {
    tx.data[i] === 0 ? (cost += txDataZero) : (cost += txDataNonZero)
  }

  if ((tx.to === undefined || tx.to === null) && tx.common.isActivatedEIP(3860)) {
    const dataLength = BigInt(Math.ceil(tx.data.length / 32))
    const initCodeCost = tx.common.param('initCodeWordGas') * dataLength
    cost += initCodeCost
  }

  if (Object.isFrozen(tx)) {
    tx.cache.dataFee = {
      value: cost,
      hardfork: tx.common.hardfork(),
    }
  }

  return cost
}

/**
 * The minimum gas limit which the tx to have to be valid.
 * This covers costs as the standard fee (21000 gas), the data fee (paid for each calldata byte),
 * the optional creation fee (if the transaction creates a contract), and if relevant the gas
 * to be paid for access lists (EIP-2930) and authority lists (EIP-7702).
 */
export function getIntrinsicGas(tx: LegacyTxInterface): bigint {
  const txFee = tx.common.param('txGas')
  let fee = tx.getDataGas()
  if (txFee) fee += txFee
  if (tx.common.gteHardfork('homestead') && tx.toCreationAddress()) {
    const txCreationFee = tx.common.param('txCreationGas')
    if (txCreationFee) fee += txCreationFee
  }
  return fee
}

export function toCreationAddress(tx: LegacyTxInterface): boolean {
  return tx.to === undefined || tx.to.bytes.length === 0
}

export function hash(tx: LegacyTxInterface): Uint8Array {
  if (!tx.isSigned()) {
    const msg = errorMsg(tx, 'Cannot call hash method if transaction is not signed')
    throw new Error(msg)
  }

  const keccakFunction = tx.common.customCrypto.keccak256 ?? keccak256

  if (Object.isFrozen(tx)) {
    if (!tx.cache.hash) {
      tx.cache.hash = keccakFunction(tx.serialize())
    }
    return tx.cache.hash
  }

  return keccakFunction(tx.serialize())
}

/**
 * EIP-2: All transaction signatures whose s-value is greater than secp256k1n/2are considered invalid.
 * Reasoning: https://ethereum.stackexchange.com/a/55728
 */
export function validateHighS(tx: LegacyTxInterface): void {
  const { s } = tx
  if (tx.common.gteHardfork('homestead') && s !== undefined && s > SECP256K1_ORDER_DIV_2) {
    const msg = errorMsg(
      tx,
      'Invalid Signature: s-values greater than secp256k1n/2 are considered invalid',
    )
    throw new Error(msg)
  }
}

export function getSenderPublicKey(tx: LegacyTxInterface): Uint8Array {
  if (tx.cache.senderPubKey !== undefined) {
    return tx.cache.senderPubKey
  }

  const msgHash = tx.getMessageToVerifySignature()

  const { v, r, s } = tx

  validateHighS(tx)

  try {
    const ecrecoverFunction = tx.common.customCrypto.ecrecover ?? ecrecover
    const sender = ecrecoverFunction(
      msgHash,
      v!,
      bigIntToUnpaddedBytes(r!),
      bigIntToUnpaddedBytes(s!),
      tx.supports(Capability.EIP155ReplayProtection) ? tx.common.chainId() : undefined,
    )
    if (Object.isFrozen(tx)) {
      tx.cache.senderPubKey = sender
    }
    return sender
  } catch (e: any) {
    const msg = errorMsg(tx, 'Invalid Signature')
    throw new Error(msg)
  }
}

export function getEffectivePriorityFee(gasPrice: bigint, baseFee: bigint | undefined): bigint {
  if (baseFee !== undefined && baseFee > gasPrice) {
    throw new Error('Tx cannot pay baseFee')
  }

  if (baseFee === undefined) {
    return gasPrice
  }

  return gasPrice - baseFee
}

/**
 * Validates the transaction signature and minimum gas requirements.
 * @returns {string[]} an array of error strings
 */
export function getValidationErrors(tx: LegacyTxInterface): string[] {
  const errors = []

  if (tx.isSigned() && !tx.verifySignature()) {
    errors.push('Invalid Signature')
  }

  if (tx.getIntrinsicGas() > tx.gasLimit) {
    errors.push(`gasLimit is too low. given ${tx.gasLimit}, need at least ${tx.getIntrinsicGas()}`)
  }

  return errors
}

/**
 * Validates the transaction signature and minimum gas requirements.
 * @returns {boolean} true if the transaction is valid, false otherwise
 */
export function isValid(tx: LegacyTxInterface): boolean {
  const errors = tx.getValidationErrors()

  return errors.length === 0
}

/**
 * Determines if the signature is valid
 */
export function verifySignature(tx: LegacyTxInterface): boolean {
  try {
    // Main signature verification is done in `getSenderPublicKey()`
    const publicKey = tx.getSenderPublicKey()
    return unpadBytes(publicKey).length !== 0
  } catch (e: any) {
    return false
  }
}

/**
 * Returns the sender's address
 */
export function getSenderAddress(tx: LegacyTxInterface): Address {
  return new Address(publicToAddress(tx.getSenderPublicKey()))
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
export function sign(tx: LegacyTxInterface, privateKey: Uint8Array): Transaction[TransactionType] {
  if (privateKey.length !== 32) {
    // TODO figure out this errorMsg logic how this diverges on other txs
    const msg = errorMsg(tx, 'Private key must be 32 bytes in length.')
    throw new Error(msg)
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
    !tx.supports(Capability.EIP155ReplayProtection)
  ) {
    // cast as any to edit the protected `activeCapabilities`
    ;(tx as any).activeCapabilities.push(Capability.EIP155ReplayProtection)
    hackApplied = true
  }

  const msgHash = tx.getHashedMessageToSign()
  const ecSignFunction = tx.common.customCrypto?.ecsign ?? ecsign
  const { v, r, s } = ecSignFunction(msgHash, privateKey)
  const signedTx = tx.addSignature(v, r, s, true)

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

// TODO maybe move this to shared methods (util.ts in features)
export function getSharedErrorPostfix(tx: LegacyTxInterface) {
  let hash = ''
  try {
    hash = tx.isSigned() ? bytesToHex(tx.hash()) : 'not available (unsigned)'
  } catch (e: any) {
    hash = 'error'
  }
  let isSigned = ''
  try {
    isSigned = tx.isSigned().toString()
  } catch (e: any) {
    hash = 'error'
  }
  let hf = ''
  try {
    hf = tx.common.hardfork()
  } catch (e: any) {
    hf = 'error'
  }

  let postfix = `tx type=${tx.type} hash=${hash} nonce=${tx.nonce} value=${tx.value} `
  postfix += `signed=${isSigned} hf=${hf}`

  return postfix
}

/**
 * Returns an object with the JSON representation of the transaction.
 */
export function toJSON(tx: LegacyTxInterface): JSONTx {
  // TODO this is just copied. Make this execution-api compliant

  const baseJSON = Generic.getBaseJSON(tx) as JSONTx
  // TODO: fix type error below
  baseJSON.gasPrice = bigIntToHex(tx.gasPrice)

  return baseJSON
}

export function addSignature(
  tx: LegacyTxInterface,
  v: bigint,
  r: Uint8Array | bigint,
  s: Uint8Array | bigint,
  convertV: boolean = false,
): LegacyTx {
  r = toBytes(r)
  s = toBytes(s)
  if (convertV && tx.supports(Capability.EIP155ReplayProtection)) {
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

/**
 * Returns the hashed serialized unsigned tx, which can be used
 * to sign the transaction (e.g. for sending to a hardware wallet).
 */
export function getHashedMessageToSign(tx: LegacyTxInterface) {
  const message = tx.getMessageToSign()
  const keccak = tx.common.customCrypto.keccak256 ?? keccak256
  return keccak(RLP.encode(message))
}

/**
 * Computes a sha3-256 hash which can be used to verify the signature
 */
export function getMessageToVerifySignature(tx: LegacyTxInterface) {
  if (!isSigned(tx)) {
    const msg = errorMsg(tx, 'This transaction is not signed')
    throw new Error(msg)
  }
  return getHashedMessageToSign(tx)
}

export function getUpfrontCost(tx: LegacyTxInterface): bigint {
  return tx.gasLimit * tx.gasPrice + tx.value
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
  const message = [
    bigIntToUnpaddedBytes(tx.nonce),
    bigIntToUnpaddedBytes(tx.gasPrice),
    bigIntToUnpaddedBytes(tx.gasLimit),
    tx.to !== undefined ? tx.to.bytes : new Uint8Array(0),
    bigIntToUnpaddedBytes(tx.value),
    tx.data,
  ]

  if (tx.supports(Capability.EIP155ReplayProtection)) {
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
  return RLP.encode(raw(tx))
}
