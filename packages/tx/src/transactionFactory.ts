import { bytesToBigInt, fetchFromProvider, getProvider, toBytes } from '@ethereumjs/util'

import { FeeMarketEIP1559Transaction } from './eip1559Transaction'
import { AccessListEIP2930Transaction } from './eip2930Transaction'
import { BlobEIP4844Transaction } from './eip4844Transaction'
import { normalizeTxParams } from './fromRpc'
import { Transaction } from './legacyTransaction'

import type {
  AccessListEIP2930TxData,
  BlobEIP4844TxData,
  FeeMarketEIP1559TxData,
  TxData,
  TxOptions,
  TypedTransaction,
} from './types'
import type { EthersProvider } from '@ethereumjs/util'

export class TransactionFactory {
  // It is not possible to instantiate a TransactionFactory object.
  private constructor() {}

  /**
   * Create a transaction from a `txData` object
   *
   * @param txData - The transaction data. The `type` field will determine which transaction type is returned (if undefined, creates a legacy transaction)
   * @param txOptions - Options to pass on to the constructor of the transaction
   */
  public static fromTxData(
    txData: TxData | AccessListEIP2930TxData | FeeMarketEIP1559TxData | BlobEIP4844TxData,
    txOptions: TxOptions = {}
  ): TypedTransaction {
    if (!('type' in txData) || txData.type === undefined) {
      // Assume legacy transaction
      return Transaction.fromTxData(<TxData>txData, txOptions)
    } else {
      const txType = Number(bytesToBigInt(toBytes(txData.type)))
      if (txType === 0) {
        return Transaction.fromTxData(<TxData>txData, txOptions)
      } else if (txType === 1) {
        return AccessListEIP2930Transaction.fromTxData(<AccessListEIP2930TxData>txData, txOptions)
      } else if (txType === 2) {
        return FeeMarketEIP1559Transaction.fromTxData(<FeeMarketEIP1559TxData>txData, txOptions)
      } else if (txType === 3) {
        return BlobEIP4844Transaction.fromTxData(<BlobEIP4844TxData>txData, txOptions)
      } else {
        throw new Error(`Tx instantiation with type ${txType} not supported`)
      }
    }
  }

  /**
   * This method tries to decode serialized data.
   *
   * @param data - The data Uint8Array
   * @param txOptions - The transaction options
   */
  public static fromSerializedData(data: Uint8Array, txOptions: TxOptions = {}): TypedTransaction {
    if (data[0] <= 0x7f) {
      // Determine the type.
      switch (data[0]) {
        case 1:
          return AccessListEIP2930Transaction.fromSerializedTx(data, txOptions)
        case 2:
          return FeeMarketEIP1559Transaction.fromSerializedTx(data, txOptions)
        case 3:
          return BlobEIP4844Transaction.fromSerializedTx(data, txOptions)
        default:
          throw new Error(`TypedTransaction with ID ${data[0]} unknown`)
      }
    } else {
      return Transaction.fromSerializedTx(data, txOptions)
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
  public static fromBlockBodyData(data: Uint8Array | Uint8Array[], txOptions: TxOptions = {}) {
    if (data instanceof Uint8Array) {
      return this.fromSerializedData(data, txOptions)
    } else if (Array.isArray(data)) {
      // It is a legacy transaction
      return Transaction.fromValuesArray(data, txOptions)
    } else {
      throw new Error('Cannot decode transaction: unknown type input')
    }
  }

  /**
   *  Method to retrieve a transaction from the provider
   * @param provider - a url string for a JSON-RPC provider or an Ethers JsonRPCProvider object
   * @param txHash - Transaction hash
   * @param txOptions - The transaction options
   * @returns the transaction specified by `txHash`
   */
  public static async fromJsonRpcProvider(
    provider: string | EthersProvider,
    txHash: string,
    txOptions?: TxOptions
  ) {
    const prov = getProvider(provider)
    const txData = await fetchFromProvider(prov, {
      method: 'eth_getTransactionByHash',
      params: [txHash],
    })
    if (txData === null) {
      throw new Error('No data returned from provider')
    }
    return TransactionFactory.fromRPCTx(txData, txOptions)
  }

  /**
   * Method to decode data retrieved from RPC, such as `eth_getTransactionByHash`
   * Note that this normalizes some of the parameters
   * @param txData The RPC-encoded data
   * @param txOptions The transaction options
   * @returns
   */
  public static async fromRPCTx(
    txData: TxData | AccessListEIP2930TxData | FeeMarketEIP1559TxData | BlobEIP4844TxData,
    txOptions: TxOptions = {}
  ) {
    return TransactionFactory.fromTxData(normalizeTxParams(txData), txOptions)
  }
}
