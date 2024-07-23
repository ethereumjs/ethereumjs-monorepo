import { RLP } from '@ethereumjs/rlp'
import { validateNoLeadingZeroes } from '@ethereumjs/util'

import { LegacyTransaction } from './tx.js'

import type { TxOptions } from '../types.js'
import type { TxData, TxValuesArray } from './tx.js'

/**
 * Instantiate a transaction from a data dictionary.
 *
 * Format: { nonce, gasPrice, gasLimit, to, value, data, v, r, s }
 *
 * Notes:
 * - All parameters are optional and have some basic default values
 */
export function createLegacyTx(txData: TxData, opts: TxOptions = {}) {
  return new LegacyTransaction(txData, opts)
}

/**
 * Create a transaction from a values array.
 *
 * Format: `[nonce, gasPrice, gasLimit, to, value, data, v, r, s]`
 */
export function createLegacyTxFromBytesArray(values: TxValuesArray, opts: TxOptions = {}) {
  // If length is not 6, it has length 9. If v/r/s are empty Uint8Arrays, it is still an unsigned transaction
  // This happens if you get the RLP data from `raw()`
  if (values.length !== 6 && values.length !== 9) {
    throw new Error(
      'Invalid transaction. Only expecting 6 values (for unsigned tx) or 9 values (for signed tx).'
    )
  }

  const [nonce, gasPrice, gasLimit, to, value, data, v, r, s] = values

  validateNoLeadingZeroes({ nonce, gasPrice, gasLimit, value, v, r, s })

  return new LegacyTransaction(
    {
      nonce,
      gasPrice,
      gasLimit,
      to,
      value,
      data,
      v,
      r,
      s,
    },
    opts
  )
}

export function createLegacyTxFromRLP(serialized: Uint8Array, opts: TxOptions = {}) {
  const values = RLP.decode(serialized)

  if (!Array.isArray(values)) {
    throw new Error('Invalid serialized tx input. Must be array')
  }

  return createLegacyTxFromBytesArray(values as TxValuesArray, opts)
}
