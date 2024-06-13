import { RLP } from '@ethereumjs/rlp'
import {
  bigIntToUnpaddedBytes,
  bytesToBigInt,
  bytesToHex,
  equalsBytes,
  validateNoLeadingZeroes,
} from '@ethereumjs/util'

import { TransactionType } from '../types.js'
import { txTypeBytes, validateNotArray } from '../util.js'

import { FeeMarket1559Tx } from './tx.js'

import type { TxOptions } from '../types.js'
import type { TxData, TxValuesArray } from './tx.js'
import type { ValueOf } from '@chainsafe/ssz'
import type { ssz } from '@ethereumjs/util'
export type Eip1559TransactionType = ValueOf<typeof ssz.Eip1559Transaction>

/**
 * Instantiate a transaction from a data dictionary.
 *
 * Format: { chainId, nonce, maxPriorityFeePerGas, maxFeePerGas, gasLimit, to, value, data,
 * accessList, v, r, s }
 *
 * Notes:
 * - `chainId` will be set automatically if not provided
 * - All parameters are optional and have some basic default values
 */
export function createFeeMarket1559Tx(txData: TxData, opts: TxOptions = {}) {
  return new FeeMarket1559Tx(txData, opts)
}

/**
 * Create a transaction from an array of byte encoded values ordered according to the devp2p network encoding - format noted below.
 *
 * Format: `[chainId, nonce, maxPriorityFeePerGas, maxFeePerGas, gasLimit, to, value, data,
 * accessList, signatureYParity, signatureR, signatureS]`
 */
export function create1559FeeMarketTxFromBytesArray(values: TxValuesArray, opts: TxOptions = {}) {
  if (values.length !== 9 && values.length !== 12) {
    throw new Error(
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
 * Instantiate a transaction from an RLP serialized tx.
 *
 * Format: `0x02 || rlp([chainId, nonce, maxPriorityFeePerGas, maxFeePerGas, gasLimit, to, value, data,
 * accessList, signatureYParity, signatureR, signatureS])`
 */
export function createFeeMarket1559TxFromRLP(serialized: Uint8Array, opts: TxOptions = {}) {
  if (
    equalsBytes(serialized.subarray(0, 1), txTypeBytes(TransactionType.FeeMarketEIP1559)) === false
  ) {
    throw new Error(
      `Invalid serialized tx input: not an EIP-1559 transaction (wrong tx type, expected: ${
        TransactionType.FeeMarketEIP1559
      }, received: ${bytesToHex(serialized.subarray(0, 1))}`,
    )
  }

  const values = RLP.decode(serialized.subarray(1))

  if (!Array.isArray(values)) {
    throw new Error('Invalid serialized tx input: must be array')
  }

  return create1559FeeMarketTxFromBytesArray(values as TxValuesArray, opts)
}

export function createFeeMarket1559TxFromSszTx(
  sszWrappedTx: Eip1559TransactionType,
  opts: TxOptions = {},
) {
  const {
    payload: {
      nonce,
      chainId,
      maxFeesPerGas: { regular: maxFeePerGas },
      gas: gasLimit,
      to,
      value,
      input: data,
      accessList,
      maxPriorityFeesPerGas: { regular: maxPriorityFeePerGas },
    },
    signature: { secp256k1 },
  } = sszWrappedTx

  // TODO: bytes to bigint => bigint to unpadded bytes seem redundant and set for optimization
  const r = bytesToBigInt(secp256k1.slice(0, 32))
  const s = bytesToBigInt(secp256k1.slice(32, 64))
  const v = bytesToBigInt(secp256k1.slice(64))

  return create1559FeeMarketTxFromBytesArray(
    [
      bigIntToUnpaddedBytes(chainId),
      bigIntToUnpaddedBytes(nonce),
      bigIntToUnpaddedBytes(maxPriorityFeePerGas),
      bigIntToUnpaddedBytes(maxFeePerGas),
      bigIntToUnpaddedBytes(gasLimit),
      to ?? new Uint8Array(0),
      bigIntToUnpaddedBytes(value),
      data,
      accessList.map(({ address, storageKeys }) => [address, storageKeys]),
      bigIntToUnpaddedBytes(v),
      bigIntToUnpaddedBytes(r),
      bigIntToUnpaddedBytes(s),
    ],
    opts,
  )
}
