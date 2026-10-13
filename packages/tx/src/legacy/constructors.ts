import { RLP } from '@ethereumjs/rlp'
import { EthereumJSErrorWithoutCode, validateNoLeadingZeroes } from '@ethereumjs/util'

import { LegacyTx } from './tx.ts'

import type { TxOptions } from '../types.ts'
import type { TxData, TxValuesArray } from './tx.ts'

/**
 * Instantiate a legacy transaction from a plain data object.
 *
 * All {@link LegacyTxData} fields are optional; unsigned txs omit `v`/`r`/`s`.
 *
 * @throws If fee or value fields overflow or are non-numeric
 * @throws If gas limit or nonce exceed EIP bounds
 * @throws If init code size exceeds EIP-3860 on contract-creation txs
 */
export function createLegacyTx(txData: TxData, opts: TxOptions = {}) {
  return new LegacyTx(txData, opts)
}

/**
 * Instantiate a legacy transaction from devp2p byte-array encoding.
 *
 * Format: `[nonce, gasPrice, gasLimit, to, value, data, v, r, s]`
 *
 * @throws If the values array length is not 6 (unsigned) or 9 (signed)
 * @throws If numeric fields contain leading zeroes
 * @throws If constructor validation fails (see {@link createLegacyTx})
 */
export function createLegacyTxFromBytesArray(values: TxValuesArray, opts: TxOptions = {}) {
  // If length is not 6, it has length 9. If v/r/s are empty Uint8Arrays, it is still an unsigned transaction
  // This happens if you get the RLP data from `raw()`
  if (values.length !== 6 && values.length !== 9) {
    throw EthereumJSErrorWithoutCode(
      'Invalid transaction. Only expecting 6 values (for unsigned tx) or 9 values (for signed tx).',
    )
  }

  const [nonce, gasPrice, gasLimit, to, value, data, v, r, s] = values

  validateNoLeadingZeroes({ nonce, gasPrice, gasLimit, value, v, r, s })

  return new LegacyTx(
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
    opts,
  )
}

/**
 * Instantiate a legacy transaction from RLP-serialized bytes.
 *
 * Format: `rlp([nonce, gasPrice, gasLimit, to, value, data, v, r, s])`
 *
 * @throws If RLP decode result is not an array
 * @throws If decoded values fail {@link createLegacyTxFromBytesArray} checks
 */
export function createLegacyTxFromRLP(serialized: Uint8Array, opts: TxOptions = {}) {
  const values = RLP.decode(serialized)

  if (!Array.isArray(values)) {
    throw EthereumJSErrorWithoutCode('Invalid serialized tx input. Must be array')
  }

  return createLegacyTxFromBytesArray(values as TxValuesArray, opts)
}
