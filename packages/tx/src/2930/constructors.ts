import { RLP } from '@ethereumjs/rlp'
import { bytesToBigInt, bytesToHex, equalsBytes, validateNoLeadingZeroes } from '@ethereumjs/util'

import { TransactionType } from '../types.js'
import { txTypeBytes, validateNotArray } from '../util.js'

import { AccessListEIP2930Transaction } from './tx.js'

import type { AccessList, TxOptions } from '../types.js'
import type { TxData, TxValuesArray } from './tx.js'

/**
 * Instantiate a transaction from a data dictionary.
 *
 * Format: { chainId, nonce, gasPrice, gasLimit, to, value, data, accessList,
 * v, r, s }
 *
 * Notes:
 * - `chainId` will be set automatically if not provided
 * - All parameters are optional and have some basic default values
 */
export function create2930AccessListTx(txData: TxData, opts: TxOptions = {}) {
  return new AccessListEIP2930Transaction(txData, opts)
}

/**
 * Create a transaction from an array of byte encoded values ordered according to the devp2p network encoding - format noted below.
 *
 * Format: `[chainId, nonce, gasPrice, gasLimit, to, value, data, accessList,
 * signatureYParity (v), signatureR (r), signatureS (s)]`
 */
export function create2930AccessListTxFromBytesArray(values: TxValuesArray, opts: TxOptions = {}) {
  if (values.length !== 8 && values.length !== 11) {
    throw new Error(
      'Invalid EIP-2930 transaction. Only expecting 8 values (for unsigned tx) or 11 values (for signed tx).',
    )
  }

  const [chainId, nonce, gasPrice, gasLimit, to, value, data, accessList, v, r, s] = values

  validateNotArray({ chainId, v })
  validateNoLeadingZeroes({ nonce, gasPrice, gasLimit, value, v, r, s })

  const emptyAccessList: AccessList = []

  return new AccessListEIP2930Transaction(
    {
      chainId: bytesToBigInt(chainId),
      nonce,
      gasPrice,
      gasLimit,
      to,
      value,
      data,
      accessList: accessList ?? emptyAccessList,
      v: v !== undefined ? bytesToBigInt(v) : undefined, // EIP2930 supports v's with value 0 (empty Uint8Array)
      r,
      s,
    },
    opts,
  )
}

/**
 * Instantiate a transaction from a RLP serialized tx.
 *
 * Format: `0x01 || rlp([chainId, nonce, gasPrice, gasLimit, to, value, data, accessList,
 * signatureYParity (v), signatureR (r), signatureS (s)])`
 */
export function create2930AccessListTxFromRLP(serialized: Uint8Array, opts: TxOptions = {}) {
  if (
    equalsBytes(serialized.subarray(0, 1), txTypeBytes(TransactionType.AccessListEIP2930)) === false
  ) {
    throw new Error(
      `Invalid serialized tx input: not an EIP-2930 transaction (wrong tx type, expected: ${
        TransactionType.AccessListEIP2930
      }, received: ${bytesToHex(serialized.subarray(0, 1))}`,
    )
  }

  const values = RLP.decode(Uint8Array.from(serialized.subarray(1)))

  if (!Array.isArray(values)) {
    throw new Error('Invalid serialized tx input: must be array')
  }

  return create2930AccessListTxFromBytesArray(values as TxValuesArray, opts)
}
