// NOTE: this file is in cleanup mode and will likely be completely removed once the PR is moved into review state

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
 * Returns an object with the JSON representation of the transaction.
 */
export function toJSON(tx: LegacyTxInterface): JSONTx {
  // TODO this is just copied. Make this execution-api compliant

  const baseJSON = Generic.getBaseJSON(tx) as JSONTx
  // TODO: fix type error below
  baseJSON.gasPrice = bigIntToHex(tx.gasPrice)

  return baseJSON
}

export function getUpfrontCost(tx: LegacyTxInterface): bigint {
  return tx.gasLimit * tx.gasPrice + tx.value
}
