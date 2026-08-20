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

import { FeeMarket1559Tx } from './tx.ts'

import type { TxOptions } from '../types.ts'
import type { TxData, TxValuesArray } from './tx.ts'

/**
 * Instantiate an EIP-1559 fee-market transaction from a plain data object.
 *
 * `chainId` defaults from {@link TxOptions.common} when omitted.
 *
 * @throws If fee or value fields overflow or are non-numeric
 * @throws If gas limit or nonce exceed EIP bounds
 * @throws If init code size exceeds EIP-3860 on contract-creation txs
 */
export function createFeeMarket1559Tx(txData: TxData, opts: TxOptions = {}) {
  return new FeeMarket1559Tx(txData, opts)
}

/**
 * Instantiate an EIP-1559 transaction from devp2p byte-array encoding.
 *
 * Format: `[chainId, nonce, maxPriorityFeePerGas, maxFeePerGas, gasLimit, to, value, data,
 * accessList, signatureYParity, signatureR, signatureS]`
 *
 * @throws If the values array length is not 9 (unsigned) or 12 (signed)
 * @throws If `chainId` or signature fields are nested arrays
 * @throws If numeric fields contain leading zeroes
 * @throws If constructor validation fails (see {@link createFeeMarket1559Tx})
 */
export function create1559FeeMarketTxFromBytesArray(values: TxValuesArray, opts: TxOptions = {}) {
  if (values.length !== 9 && values.length !== 12) {
    throw EthereumJSErrorWithoutCode(
      'Invalid EIP-1559 transaction. Only expecting 9 values (for unsigned tx) or 12 values (for signed tx).',
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
    v,
    r,
    s,
  ] = values

  validateNotArray({ chainId, v })
  validateNoLeadingZeroes({ nonce, maxPriorityFeePerGas, maxFeePerGas, gasLimit, value, v, r, s })

  return new FeeMarket1559Tx(
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
      v: v !== undefined ? bytesToBigInt(v) : undefined, // EIP2930 supports v's with value 0 (empty Uint8Array)
      r,
      s,
    },
    opts,
  )
}

/**
 * Instantiate an EIP-1559 transaction from RLP-serialized bytes.
 *
 * Format: `0x02 || rlp([chainId, nonce, maxPriorityFeePerGas, maxFeePerGas, gasLimit, to, value, data,
 * accessList, signatureYParity, signatureR, signatureS])`
 *
 * @throws If the leading type byte is not `0x02`
 * @throws If RLP decode result is not an array
 * @throws If decoded values fail {@link create1559FeeMarketTxFromBytesArray} checks
 */
export function createFeeMarket1559TxFromRLP(serialized: Uint8Array, opts: TxOptions = {}) {
  if (
    equalsBytes(serialized.subarray(0, 1), txTypeBytes(TransactionType.FeeMarketEIP1559)) === false
  ) {
    throw EthereumJSErrorWithoutCode(
      `Invalid serialized tx input: not an EIP-1559 transaction (wrong tx type, expected: ${
        TransactionType.FeeMarketEIP1559
      }, received: ${bytesToHex(serialized.subarray(0, 1))}`,
    )
  }

  const values = RLP.decode(serialized.subarray(1))

  if (!Array.isArray(values)) {
    throw EthereumJSErrorWithoutCode('Invalid serialized tx input: must be array')
  }

  return create1559FeeMarketTxFromBytesArray(values as TxValuesArray, opts)
}
