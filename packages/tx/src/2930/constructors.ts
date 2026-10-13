import { RLP } from '@ethereumjs/rlp'
import {
  EthereumJSErrorWithoutCode,
  bytesToBigInt,
  bytesToHex,
  equalsBytes,
  validateNoLeadingZeroes,
} from '@ethereumjs/util'

import { TransactionType } from '../types.ts'
import { txTypeBytes, validateNotArray } from '../util/internal.ts'

import { AccessList2930Tx } from './tx.ts'

import type { AccessList, TxOptions } from '../types.ts'
import type { TxData, TxValuesArray } from './tx.ts'

/**
 * Instantiate an EIP-2930 access-list transaction from a plain data object.
 *
 * `chainId` defaults from {@link TxOptions.common} when omitted.
 *
 * @throws If fee or value fields overflow or are non-numeric
 * @throws If gas limit or nonce exceed EIP bounds
 * @throws If init code size exceeds EIP-3860 on contract-creation txs
 */
export function createAccessList2930Tx(txData: TxData, opts: TxOptions = {}) {
  return new AccessList2930Tx(txData, opts)
}

/**
 * Instantiate an EIP-2930 transaction from devp2p byte-array encoding.
 *
 * Format: `[chainId, nonce, gasPrice, gasLimit, to, value, data, accessList, v, r, s]`
 *
 * @throws If the values array length is not 8 (unsigned) or 11 (signed)
 * @throws If `chainId` or signature fields are nested arrays
 * @throws If numeric fields contain leading zeroes
 * @throws If constructor validation fails (see {@link createAccessList2930Tx})
 */
export function createAccessList2930TxFromBytesArray(values: TxValuesArray, opts: TxOptions = {}) {
  if (values.length !== 8 && values.length !== 11) {
    throw EthereumJSErrorWithoutCode(
      'Invalid EIP-2930 transaction. Only expecting 8 values (for unsigned tx) or 11 values (for signed tx).',
    )
  }

  const [chainId, nonce, gasPrice, gasLimit, to, value, data, accessList, v, r, s] = values

  validateNotArray({ chainId, v })
  validateNoLeadingZeroes({ nonce, gasPrice, gasLimit, value, v, r, s })

  const emptyAccessList: AccessList = []

  return new AccessList2930Tx(
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
 * Instantiate an EIP-2930 transaction from RLP-serialized bytes.
 *
 * Format: `0x01 || rlp([chainId, nonce, gasPrice, gasLimit, to, value, data, accessList, v, r, s])`
 *
 * @throws If the leading type byte is not `0x01`
 * @throws If RLP decode result is not an array
 * @throws If decoded values fail {@link createAccessList2930TxFromBytesArray} checks
 */
export function createAccessList2930TxFromRLP(serialized: Uint8Array, opts: TxOptions = {}) {
  if (
    equalsBytes(serialized.subarray(0, 1), txTypeBytes(TransactionType.AccessListEIP2930)) === false
  ) {
    throw EthereumJSErrorWithoutCode(
      `Invalid serialized tx input: not an EIP-2930 transaction (wrong tx type, expected: ${
        TransactionType.AccessListEIP2930
      }, received: ${bytesToHex(serialized.subarray(0, 1))}`,
    )
  }

  const values = RLP.decode(Uint8Array.from(serialized.subarray(1)))

  if (!Array.isArray(values)) {
    throw EthereumJSErrorWithoutCode('Invalid serialized tx input: must be array')
  }

  return createAccessList2930TxFromBytesArray(values as TxValuesArray, opts)
}
