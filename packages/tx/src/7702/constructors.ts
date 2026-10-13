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

import { EOACode7702Tx } from './tx.ts'

import type { TxOptions } from '../types.ts'
import type { TxData, TxValuesArray } from './tx.ts'

/**
 * Instantiate an EIP-7702 EOA-code transaction from a plain data object.
 *
 * `chainId` defaults from {@link TxOptions.common} when omitted.
 *
 * @throws If fee or value fields overflow or are non-numeric
 * @throws If gas limit or nonce exceed EIP bounds
 * @throws If init code size exceeds EIP-3860 on contract-creation txs
 */
export function createEOACode7702Tx(txData: TxData, opts: TxOptions = {}) {
  return new EOACode7702Tx(txData, opts)
}

/**
 * Instantiate an EIP-7702 transaction from devp2p byte-array encoding.
 *
 * Format: `[chainId, nonce, maxPriorityFeePerGas, maxFeePerGas, gasLimit, to, value, data,
 * accessList, authorityList, signatureYParity, signatureR, signatureS]`
 *
 * @throws If the values array length is not 10 (unsigned) or 13 (signed)
 * @throws If `chainId` or signature fields are nested arrays
 * @throws If numeric fields contain leading zeroes
 * @throws If constructor validation fails (see {@link createEOACode7702Tx})
 */
export function createEOACode7702TxFromBytesArray(values: TxValuesArray, opts: TxOptions = {}) {
  if (values.length !== 10 && values.length !== 13) {
    throw EthereumJSErrorWithoutCode(
      'Invalid EIP-7702 transaction. Only expecting 10 values (for unsigned tx) or 13 values (for signed tx).',
    )
  }

  const [
    chainId,
    nonce,
    maxPriorityFeePerGas,
    maxFeePerGas,
    gasLimit,
    to,
    value,
    data,
    accessList,
    authorityList,
    v,
    r,
    s,
  ] = values

  validateNotArray({ chainId, v })
  validateNoLeadingZeroes({ nonce, maxPriorityFeePerGas, maxFeePerGas, gasLimit, value, v, r, s })

  return new EOACode7702Tx(
    {
      chainId: bytesToBigInt(chainId),
      nonce,
      maxPriorityFeePerGas,
      maxFeePerGas,
      gasLimit,
      to,
      value,
      data,
      accessList: accessList ?? [],
      authorizationList: authorityList ?? [],
      v: v !== undefined ? bytesToBigInt(v) : undefined, // EIP2930 supports v's with value 0 (empty Uint8Array)
      r,
      s,
    },
    opts,
  )
}

/**
 * Instantiate an EIP-7702 transaction from RLP-serialized bytes.
 *
 * Format: `0x04 || rlp([chainId, nonce, maxPriorityFeePerGas, maxFeePerGas, gasLimit, to, value, data,
 * accessList, authorityList, signatureYParity, signatureR, signatureS])`
 *
 * @throws If the leading type byte is not `0x04`
 * @throws If RLP decode result is not an array
 * @throws If decoded values fail {@link createEOACode7702TxFromBytesArray} checks
 */
export function createEOACode7702TxFromRLP(serialized: Uint8Array, opts: TxOptions = {}) {
  if (
    equalsBytes(serialized.subarray(0, 1), txTypeBytes(TransactionType.EOACodeEIP7702)) === false
  ) {
    throw EthereumJSErrorWithoutCode(
      `Invalid serialized tx input: not an EIP-7702 transaction (wrong tx type, expected: ${
        TransactionType.EOACodeEIP7702
      }, received: ${bytesToHex(serialized.subarray(0, 1))}`,
    )
  }

  const values = RLP.decode(serialized.subarray(1))

  if (!Array.isArray(values)) {
    throw EthereumJSErrorWithoutCode('Invalid serialized tx input: must be array')
  }

  return createEOACode7702TxFromBytesArray(values as TxValuesArray, opts)
}
