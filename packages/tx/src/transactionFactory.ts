import Common from '@ethereumjs/common'
import { default as Transaction } from './legacyTransaction'
import { default as AccessListEIP2930Transaction } from './eip2930Transaction'
import { TxOptions, TypedTransaction, TxData, AccessListEIP2930TxData } from './types'
import { BN } from 'ethereumjs-util'

const DEFAULT_COMMON = new Common({ chain: 'mainnet' })

export default class TransactionFactory {
  // It is not possible to instantiate a TransactionFactory object.
  private constructor() {}

  /**
   * Create a transaction from a `txData` object
   * @param txData - The transaction data. The `type` field will determine which transaction type is returned (if undefined, create a Transaction)
   * @param txOptions - Options to pass on to the constructor of the transaction
   */
  public static fromTxData(txData: TxData | AccessListEIP2930TxData, txOptions: TxOptions = {}): TypedTransaction {
    const common = txOptions.common ?? DEFAULT_COMMON
    if (!('type' in txData) || txData.type === undefined) {
      // Assume Transaction
      return Transaction.fromTxData(<TxData>txData, txOptions)
    } else {
      const txType = new BN(txData.type).toNumber()
      return TransactionFactory.getTransactionClass(txType, common).fromTxData(<AccessListEIP2930TxData>txData, txOptions)
    }
  }

  /**
   * This method tries to decode `raw` data. It is somewhat equivalent to `fromRlpSerializedTx`.
   * However, it could be that the data is not directly RLP-encoded (it is a Typed Transaction)
   * @param rawData - The raw data buffer
   * @param txOptions - The transaction options
   */
  public static fromRawData(rawData: Buffer, txOptions: TxOptions = {}): TypedTransaction {
    const common = txOptions.common ?? DEFAULT_COMMON
    if (rawData[0] <= 0x7f) {
      // It is an EIP-2718 Typed Transaction
      if (!common.isActivatedEIP(2718)) {
        throw new Error('Common support for TypedTransactions (EIP-2718) not activated')
      }
      // Determine the type.
      let EIP: number
      switch (rawData[0]) {
        case 1:
          EIP = 2930
          break
        default:
          throw new Error(`TypedTransaction with ID ${rawData[0]} unknown`)
      }

      if (!TransactionFactory.eipSupport(common, EIP)) {
        throw new Error(
          `Cannot create TypedTransaction with ID ${rawData[0]}: EIP ${EIP} not activated`
        )
      }

      return AccessListEIP2930Transaction.fromRlpSerializedTx(rawData, txOptions)
    } else {
      return Transaction.fromRlpSerializedTx(rawData, txOptions)
    }
  }

  /**
   * When decoding a BlockBody, in the transactions field, a field is either:
   * A Buffer (a TypedTransaction - encoded as TransactionType || rlp(TransactionPayload))
   * A Buffer[] (Transaction)
   * This method returns the right transaction.
   * @param rawData - Either a Buffer or a Buffer[]
   * @param txOptions - The transaction options
   */
  public static fromBlockBodyData(rawData: Buffer | Buffer[], txOptions: TxOptions = {}) {
    if (Buffer.isBuffer(rawData)) {
      return this.fromRawData(rawData, txOptions)
    } else if (Array.isArray(rawData)) {
      // It is a Transaction
      return Transaction.fromValuesArray(rawData, txOptions)
    } else {
      throw new Error('Cannot decode transaction: unknown type input')
    }
  }

  /**
   * This helper method allows one to retrieve the class which matches the transactionID
   * If transactionID is undefined, return the Transaction class.
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

  /**
   * Check if a typed transaction eip is supported by common
   * @param common - The common to use
   * @param eip - The EIP to check
   */
  public static eipSupport(common: Common, eip: number): boolean {
    if (!common.isActivatedEIP(2718)) {
      return false
    }
    return common.isActivatedEIP(eip)
  }
}
