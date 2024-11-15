import { RLP } from '@ethereumjs/rlp'
import { bigIntToUnpaddedBytes, toBytes, unpadBytes } from '@ethereumjs/util'

import { Capability, isLegacyTxInterface } from '../types.js'

import type { LegacyTxInterface, TransactionType, TxValuesArray } from '../types.js'

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
  if (!isLegacyTxInterface(tx)) {
    throw new Error('Transaction does not support legacy tx interface')
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
  if (!isLegacyTxInterface(tx)) {
    throw new Error('Transaction does not support legacy tx interface')
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
  if (!isLegacyTxInterface(tx)) {
    throw new Error('Transaction does not support legacy tx interface')
  }
  return RLP.encode(raw(tx))
}
