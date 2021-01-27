import Common from '@ethereumjs/common'
import { Address, BN, toBuffer } from 'ethereumjs-util'
import { BaseTransactionData, BaseTxOptions, DEFAULT_COMMON } from './types'

export abstract class BaseTransaction<SignedTxType, JsonTx> {
  public readonly to?: Address
  public readonly common: Common

  constructor(txData: BaseTransactionData, txOptions?: BaseTxOptions) {
    const { to } = txData

    this.to = to ? new Address(toBuffer(to)) : undefined

    this.common = txOptions?.common ?? DEFAULT_COMMON
  }

  /**
   * If the tx's `to` is to the creation address
   */
  toCreationAddress(): boolean {
    return this.to === undefined || this.to.buf.length === 0
  }

  /**
   * Computes a sha3-256 hash of the serialized unsigned tx, which is used to sign the transaction.
   */
  rawTxHash(): Buffer {
    return this.getMessageToSign()
  }

  abstract getMessageToSign(): Buffer

  /**
   * Returns chain ID
   */
  getChainId(): number {
    return this.common.chainId()
  }

  abstract sign(privateKey: Buffer): SignedTxType

  /**
   * The amount of gas paid for the data in this tx
   */
  abstract getDataFee(): BN

  /**
   * The minimum amount of gas the tx must have (DataFee + TxFee + Creation Fee)
   */
  abstract getBaseFee(): BN

  /**
   * The up front amount that an account must have for this transaction to be valid
   */
  abstract getUpfrontCost(): BN

  /**
   * Checks if the transaction has the minimum amount of gas required
   * (DataFee + TxFee + Creation Fee).
   */
  abstract validate(): boolean
  abstract validate(stringError: false): boolean | string[]
  abstract validate(stringError: true): string[]

  /**
   * Returns a Buffer Array of the raw Buffers of this transaction, in order.
   */
  abstract raw(): Buffer[]

  /**
   * Returns the encoding of the transaction.
   */
  abstract serialize(): Buffer

  /**
   * Returns an object with the JSON representation of the transaction
   */
  abstract toJSON(): JsonTx

  abstract isSigned(): boolean
}

export interface SignedTransactionInterface {
  raw(): Buffer[]
  hash(): Buffer

  getMessageToVerifySignature(): Buffer
  getSenderAddress(): Address
  getSenderPublicKey(): Buffer

  verifySignature(): boolean

  sign(privateKey: Buffer): never
}
