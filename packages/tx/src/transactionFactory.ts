import { EthereumJSErrorWithoutCode, fetchFromProvider, getProvider } from '@ethereumjs/util'

import { createFeeMarket1559Tx, createFeeMarket1559TxFromRLP } from './1559/constructors.ts'
import { createAccessList2930Tx, createAccessList2930TxFromRLP } from './2930/constructors.ts'
import { createBlob4844Tx, createBlob4844TxFromRLP } from './4844/constructors.ts'
import { createEOACode7702Tx, createEOACode7702TxFromRLP } from './7702/constructors.ts'
import {
  createLegacyTx,
  createLegacyTxFromBytesArray,
  createLegacyTxFromRLP,
} from './legacy/constructors.ts'
import {
  TransactionType,
  isAccessList2930TxData,
  isBlob4844TxData,
  isEOACode7702TxData,
  isFeeMarket1559TxData,
  isLegacyTxData,
} from './types.ts'
import { normalizeTxParams } from './util/general.ts'

import type { EthersProvider } from '@ethereumjs/util'
import type { Transaction, TxData, TxOptions, TypedTxData } from './types.ts'
/**
 * Instantiate a transaction; the `type` field selects the concrete {@link TypedTransaction} class.
 *
 * When `type` is omitted a legacy transaction is created.
 *
 * @throws If the `type` field is not supported
 * @throws If delegated type-specific factory validation fails
 */
export function createTx<T extends TransactionType>(
  txData: TypedTxData,
  txOptions: TxOptions = {},
): Transaction[T] {
  if (!('type' in txData) || txData.type === undefined) {
    // Assume legacy transaction
    return createLegacyTx(txData, txOptions) as Transaction[T]
  } else {
    if (isLegacyTxData(txData)) {
      return createLegacyTx(txData, txOptions) as Transaction[T]
    } else if (isAccessList2930TxData(txData)) {
      return createAccessList2930Tx(txData, txOptions) as Transaction[T]
    } else if (isFeeMarket1559TxData(txData)) {
      return createFeeMarket1559Tx(txData, txOptions) as Transaction[T]
    } else if (isBlob4844TxData(txData)) {
      return createBlob4844Tx(txData, txOptions) as Transaction[T]
    } else if (isEOACode7702TxData(txData)) {
      return createEOACode7702Tx(txData, txOptions) as Transaction[T]
    } else {
      throw EthereumJSErrorWithoutCode(
        `Tx instantiation with type ${(txData as TypedTxData)?.type} not supported`,
      )
    }
  }
}

/**
 * Decode an RLP-serialized transaction (legacy or EIP-2718 typed).
 *
 * @throws If the typed tx ID is unknown
 * @throws If delegated type-specific factory validation fails
 */
export function createTxFromRLP<T extends TransactionType>(
  data: Uint8Array,
  txOptions: TxOptions = {},
): Transaction[T] {
  if (data[0] <= 0x7f) {
    // Determine the type.
    switch (data[0]) {
      case TransactionType.AccessListEIP2930:
        return createAccessList2930TxFromRLP(data, txOptions) as Transaction[T]
      case TransactionType.FeeMarketEIP1559:
        return createFeeMarket1559TxFromRLP(data, txOptions) as Transaction[T]
      case TransactionType.BlobEIP4844:
        return createBlob4844TxFromRLP(data, txOptions) as Transaction[T]
      case TransactionType.EOACodeEIP7702:
        return createEOACode7702TxFromRLP(data, txOptions) as Transaction[T]
      default:
        throw EthereumJSErrorWithoutCode(`TypedTransaction with ID ${data[0]} unknown`)
    }
  } else {
    return createLegacyTxFromRLP(data, txOptions) as Transaction[T]
  }
}

/**
 * Decode a transaction from block-body RLP (typed bytes or legacy value array).
 *
 * @throws If `data` is neither a `Uint8Array` nor a `Uint8Array[]`
 * @throws If delegated factory validation fails
 */
export function createTxFromBlockBodyData(
  data: Uint8Array | Uint8Array[],
  txOptions: TxOptions = {},
) {
  if (data instanceof Uint8Array) {
    return createTxFromRLP(data, txOptions)
  } else if (Array.isArray(data)) {
    // It is a legacy transaction
    return createLegacyTxFromBytesArray(data, txOptions)
  } else {
    throw EthereumJSErrorWithoutCode('Cannot decode transaction: unknown type input')
  }
}

/**
 * Instantiate a transaction from JSON-RPC fields (`eth_getTransactionByHash` shape).
 *
 * Numeric and hex fields are normalized before construction.
 *
 * @throws If delegated {@link createTx} validation fails
 */
export async function createTxFromRPC<T extends TransactionType>(
  txData: TxData[T],
  txOptions: TxOptions = {},
): Promise<Transaction[T]> {
  return createTx(normalizeTxParams(txData), txOptions)
}

/**
 * Fetch a transaction by hash from a JSON-RPC provider and instantiate it.
 *
 * @throws If the provider returns no data for the hash
 * @throws If delegated {@link createTxFromRPC} validation fails
 */
export async function createTxFromJSONRPCProvider(
  provider: string | EthersProvider,
  txHash: string,
  txOptions?: TxOptions,
) {
  const prov = getProvider(provider)
  const txData = await fetchFromProvider(prov, {
    method: 'eth_getTransactionByHash',
    params: [txHash],
  })
  if (txData === null) {
    throw EthereumJSErrorWithoutCode('No data returned from provider')
  }
  return createTxFromRPC(txData, txOptions)
}
