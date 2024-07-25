import { fetchFromProvider, getProvider } from '@ethereumjs/util'

import { create1559FeeMarketTx, create1559FeeMarketTxFromRLP } from './1559/constructors.js'
import { create2930AccessListTx, create2930AccessListTxFromRLP } from './2930/constructors.js'
import { create4844BlobTx, create4844BlobTxFromRLP } from './4844/constructors.js'
import { create7702EOACodeTx, create7702EOACodeTxFromRLP } from './7702/constructors.js'
import { normalizeTxParams } from './fromRpc.js'
import {
  createLegacyTx,
  createLegacyTxFromBytesArray,
  createLegacyTxFromRLP,
} from './legacy/constructors.js'
import {
  TransactionType,
  isAccessListEIP2930TxData,
  isBlobEIP4844TxData,
  isEOACodeEIP7702TxData,
  isFeeMarketEIP1559TxData,
  isLegacyTxData,
} from './types.js'

import type { Transaction, TxData, TxOptions, TypedTxData } from './types.js'
import type { EthersProvider } from '@ethereumjs/util'
/**
 * Create a transaction from a `txData` object
 *
 * @param txData - The transaction data. The `type` field will determine which transaction type is returned (if undefined, creates a legacy transaction)
 * @param txOptions - Options to pass on to the constructor of the transaction
 */
export function createTxFromTxData<T extends TransactionType>(
  txData: TypedTxData,
  txOptions: TxOptions = {},
): Transaction[T] {
  if (!('type' in txData) || txData.type === undefined) {
    // Assume legacy transaction
    return createLegacyTx(txData, txOptions) as Transaction[T]
  } else {
    if (isLegacyTxData(txData)) {
      return createLegacyTx(txData, txOptions) as Transaction[T]
    } else if (isAccessListEIP2930TxData(txData)) {
      return create2930AccessListTx(txData, txOptions) as Transaction[T]
    } else if (isFeeMarketEIP1559TxData(txData)) {
      return create1559FeeMarketTx(txData, txOptions) as Transaction[T]
    } else if (isBlobEIP4844TxData(txData)) {
      return create4844BlobTx(txData, txOptions) as Transaction[T]
    } else if (isEOACodeEIP7702TxData(txData)) {
      return create7702EOACodeTx(txData, txOptions) as Transaction[T]
    } else {
      throw new Error(`Tx instantiation with type ${(txData as TypedTxData)?.type} not supported`)
    }
  }
}

/**
 * This method tries to decode serialized data.
 *
 * @param data - The data Uint8Array
 * @param txOptions - The transaction options
 */
export function createTxFromSerializedData<T extends TransactionType>(
  data: Uint8Array,
  txOptions: TxOptions = {},
): Transaction[T] {
  if (data[0] <= 0x7f) {
    // Determine the type.
    switch (data[0]) {
      case TransactionType.AccessListEIP2930:
        return create2930AccessListTxFromRLP(data, txOptions) as Transaction[T]
      case TransactionType.FeeMarketEIP1559:
        return create1559FeeMarketTxFromRLP(data, txOptions) as Transaction[T]
      case TransactionType.BlobEIP4844:
        return create4844BlobTxFromRLP(data, txOptions) as Transaction[T]
      case TransactionType.EOACodeEIP7702:
        return create7702EOACodeTxFromRLP(data, txOptions) as Transaction[T]
      default:
        throw new Error(`TypedTransaction with ID ${data[0]} unknown`)
    }
  } else {
    return createLegacyTxFromRLP(data, txOptions) as Transaction[T]
  }
}

/**
 * When decoding a BlockBody, in the transactions field, a field is either:
 * A Uint8Array (a TypedTransaction - encoded as TransactionType || rlp(TransactionPayload))
 * A Uint8Array[] (Legacy Transaction)
 * This method returns the right transaction.
 *
 * @param data - A Uint8Array or Uint8Array[]
 * @param txOptions - The transaction options
 */
export function createTxFromBlockBodyData(
  data: Uint8Array | Uint8Array[],
  txOptions: TxOptions = {},
) {
  if (data instanceof Uint8Array) {
    return createTxFromSerializedData(data, txOptions)
  } else if (Array.isArray(data)) {
    // It is a legacy transaction
    return createLegacyTxFromBytesArray(data, txOptions)
  } else {
    throw new Error('Cannot decode transaction: unknown type input')
  }
}

/**
 * Method to decode data retrieved from RPC, such as `eth_getTransactionByHash`
 * Note that this normalizes some of the parameters
 * @param txData The RPC-encoded data
 * @param txOptions The transaction options
 * @returns
 */
export async function createTxFromRPC<T extends TransactionType>(
  txData: TxData[T],
  txOptions: TxOptions = {},
): Promise<Transaction[T]> {
  return createTxFromTxData(normalizeTxParams(txData), txOptions)
}

/**
 *  Method to retrieve a transaction from the provider
 * @param provider - a url string for a JSON-RPC provider or an Ethers JsonRPCProvider object
 * @param txHash - Transaction hash
 * @param txOptions - The transaction options
 * @returns the transaction specified by `txHash`
 */
export async function createTxFromJsonRpcProvider(
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
    throw new Error('No data returned from provider')
  }
  return createTxFromRPC(txData, txOptions)
}
