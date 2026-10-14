import { EthereumJSErrorWithoutCode, fetchFromProvider, getProvider } from '@ethereumjs/util'

import { createLegacyTxFromBytesArray } from './legacy/constructors.ts'
import {
  TX_TYPE_REGISTRY,
  registryEntryForTxData,
  registryEntryForTypeByte,
} from './txTypeRegistry.ts'
import { TransactionType } from './types.ts'
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
  const entry =
    !('type' in txData) || txData.type === undefined
      ? TX_TYPE_REGISTRY.get(TransactionType.Legacy)
      : registryEntryForTxData(txData)
  if (entry === undefined) {
    throw EthereumJSErrorWithoutCode(
      `Tx instantiation with type ${(txData as TypedTxData)?.type} not supported`,
    )
  }
  return entry.create(txData, txOptions) as Transaction[T]
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
    const entry = registryEntryForTypeByte(data[0])
    if (entry === undefined) {
      throw EthereumJSErrorWithoutCode(`TypedTransaction with ID ${data[0]} unknown`)
    }
    return entry.createFromRLP(data, txOptions) as Transaction[T]
  }
  const legacy = TX_TYPE_REGISTRY.get(TransactionType.Legacy)!
  return legacy.createFromRLP(data, txOptions) as Transaction[T]
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
