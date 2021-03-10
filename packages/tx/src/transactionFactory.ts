import { BN } from 'ethereumjs-util'
import Common from '@ethereumjs/common'
import { default as Transaction } from './legacyTransaction'
import { default as AccessListEIP2930Transaction } from './eip2930Transaction'
import { TxOptions, TypedTransaction, TxData, AccessListEIP2930TxData } from './types'

const DEFAULT_COMMON = new Common({ chain: 'mainnet' })

export default class TransactionFactory {
  // It is not possible to instantiate a TransactionFactory object.
  private constructor() {}

  /**
   * Create a transaction from a `txData` object
   *
   * @param txData - The transaction data. The `type` field will determine which transaction type is returned (if undefined, creates a legacy transaction)
   * @param txOptions - Options to pass on to the constructor of the transaction
   */
  public static fromTxData(
    txData: TxData | AccessListEIP2930TxData,
    txOptions: TxOptions = {}
  ): TypedTransaction {
    const common = txOptions.common ?? DEFAULT_COMMON
    if (!('type' in txData) || txData.type === undefined) {
      // Assume legacy transaction
      return Transaction.fromTxData(<TxData>txData, txOptions)
    } else {
      const txType = new BN(txData.type).toNumber()
      return TransactionFactory.getTransactionClass(txType, common).fromTxData(
        <AccessListEIP2930TxData>txData,
        txOptions
      )
    }
  }

  /**
   * This method tries to decode serialized data.
   *
   * @param data - The data Buffer
   * @param txOptions - The transaction options
   */
  public static fromSerializedData(data: Buffer, txOptions: TxOptions = {}): TypedTransaction {
    const common = txOptions.common ?? DEFAULT_COMMON
    if (data[0] <= 0x7f) {
      // It is an EIP-2718 Typed Transaction
      if (!common.isActivatedEIP(2718)) {
        throw new Error('Common support for TypedTransactions (EIP-2718) not activated')
      }
      // Determine the type.
      let EIP: number
      switch (data[0]) {
        case 1:
          EIP = 2930
          break
        default:
          throw new Error(`TypedTransaction with ID ${data[0]} unknown`)
      }

      if (!common.isActivatedEIP(EIP)) {
        throw new Error(
          `Cannot create TypedTransaction with ID ${data[0]}: EIP ${EIP} not activated`
        )
      }

      return AccessListEIP2930Transaction.fromSerializedTx(data, txOptions)
    } else {
      return Transaction.fromSerializedTx(data, txOptions)
    }
  }

  /**
   * When decoding a BlockBody, in the transactions field, a field is either:
   * A Buffer (a TypedTransaction - encoded as TransactionType || rlp(TransactionPayload))
   * A Buffer[] (Legacy Transaction)
   * This method returns the right transaction.
   *
   * @param data - A Buffer or Buffer[]
   * @param txOptions - The transaction options
   */
  public static fromBlockBodyData(data: Buffer | Buffer[], txOptions: TxOptions = {}) {
    if (Buffer.isBuffer(data)) {
      return this.fromSerializedData(data, txOptions)
    } else if (Array.isArray(data)) {
      if (data.length === 6 || data.length === 9) {
        // It is a legacy transaction
        return Transaction.fromValuesArray(data, txOptions)
      } else if (data.length === 8 || data.length === 11) {
        // It is an Access List Transaction
        return AccessListEIP2930Transaction.fromValuesArray(data, txOptions)
      } else {
        throw new Error('Cannot decode transaction: unknown array length')
      }
    } else {
      throw new Error('Cannot decode transaction: unknown type input')
    }
  }

  /**
   * This helper method allows one to retrieve the class which matches the transactionID
   * If transactionID is undefined, returns the legacy transaction class.
   *
   * @param transactionID
   * @param common
   */
  public static getTransactionClass(transactionID: number = 0, common?: Common) {
    const usedCommon = common ?? DEFAULT_COMMON
    if (transactionID !== 0) {
      if (!usedCommon.isActivatedEIP(2718)) {
        throw new Error('Common support for TypedTransactions (EIP-2718) not activated')
      }
    }

    const legacyTxn = transactionID == 0 || (transactionID >= 0x80 && transactionID <= 0xff)

    if (legacyTxn) {
      return Transaction
    }

    switch (transactionID) {
      case 1:
        return AccessListEIP2930Transaction
      default:
        throw new Error(`TypedTransaction with ID ${transactionID} unknown`)
    }
  }
}
