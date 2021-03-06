import Common from '@ethereumjs/common'
import {
  Address,
  BN,
  toBuffer,
  MAX_INTEGER,
  unpadBuffer,
  ecsign,
  publicToAddress,
} from 'ethereumjs-util'
import { BaseTransactionData, BaseTxOptions, JsonTx } from './types'

export abstract class BaseTransaction<TransactionObject> {
  public readonly nonce: BN
  public readonly gasLimit: BN
  public readonly gasPrice: BN
  public readonly to?: Address
  public readonly value: BN
  public readonly data: Buffer
  public readonly common: Common

  public readonly v?: BN
  public readonly r?: BN
  public readonly s?: BN

  constructor(txData: BaseTransactionData, txOptions: BaseTxOptions = {}) {
    const { nonce, gasLimit, gasPrice, to, value, data } = txData

    this.nonce = new BN(toBuffer(nonce))
    this.gasPrice = new BN(toBuffer(gasPrice))
    this.gasLimit = new BN(toBuffer(gasLimit))
    this.to = to ? new Address(toBuffer(to)) : undefined
    this.value = new BN(toBuffer(value))
    this.data = toBuffer(data)

    const validateCannotExceedMaxInteger = {
      nonce: this.nonce,
      gasPrice: this.gasPrice,
      gasLimit: this.gasLimit,
      value: this.value,
    }

    this._validateExceedsMaxInteger(validateCannotExceedMaxInteger)

    this.common =
      (txOptions.common &&
        Object.assign(Object.create(Object.getPrototypeOf(txOptions.common)), txOptions.common)) ??
      new Common({ chain: 'mainnet' })
  }

  /**
   * Checks if the transaction has the minimum amount of gas required
   * (DataFee + TxFee + Creation Fee).
   */
  /**
   * Checks if the transaction has the minimum amount of gas required
   * (DataFee + TxFee + Creation Fee).
   */
  validate(): boolean
  /* eslint-disable-next-line no-dupe-class-members */
  validate(stringError: false): boolean
  /* eslint-disable-next-line no-dupe-class-members */
  validate(stringError: true): string[]
  /* eslint-disable-next-line no-dupe-class-members */
  validate(stringError: boolean = false): boolean | string[] {
    const errors = []

    if (this.getBaseFee().gt(this.gasLimit)) {
      errors.push(`gasLimit is too low. given ${this.gasLimit}, need at least ${this.getBaseFee()}`)
    }

    if (this.isSigned() && !this.verifySignature()) {
      errors.push('Invalid Signature')
    }

    return stringError ? errors : errors.length === 0
  }

  /**
   * The minimum amount of gas the tx must have (DataFee + TxFee + Creation Fee)
   */
  getBaseFee(): BN {
    const fee = this.getDataFee().addn(this.common.param('gasPrices', 'tx'))
    if (this.common.gteHardfork('homestead') && this.toCreationAddress()) {
      fee.iaddn(this.common.param('gasPrices', 'txCreation'))
    }
    return fee
  }

  /**
   * The amount of gas paid for the data in this tx
   */
  getDataFee(): BN {
    const txDataZero = this.common.param('gasPrices', 'txDataZero')
    const txDataNonZero = this.common.param('gasPrices', 'txDataNonZero')

    let cost = 0
    for (let i = 0; i < this.data.length; i++) {
      this.data[i] === 0 ? (cost += txDataZero) : (cost += txDataNonZero)
    }
    return new BN(cost)
  }

  /**
   * The up front amount that an account must have for this transaction to be valid
   */
  getUpfrontCost(): BN {
    return this.gasLimit.mul(this.gasPrice).add(this.value)
  }

  /**
   * If the tx's `to` is to the creation address
   */
  toCreationAddress(): boolean {
    return this.to === undefined || this.to.buf.length === 0
  }

  /**
   * Returns the raw `Buffer[]` (Transaction) or `Buffer` (typed transaction).
   * This is the data which is found in the transactions of the block body.
   *
   * Note that if you want to use this function in a tx type independent way
   * to then use the raw data output for tx instantiation with
   * `Tx.fromValuesArray()` you should set the `asList` parameter to `true` -
   * which is ignored on a legacy tx but provides the correct format on
   * a typed tx.
   *
   * To prepare a tx to be added as block data with `Block.fromValuesArray()`
   * just use the plain `raw()` method.
   */
  abstract raw(asList: boolean): Buffer[] | Buffer

  /**
   * Returns the encoding of the transaction.
   */
  abstract serialize(): Buffer

  /**
   * Computes a sha3-256 hash of the serialized unsigned tx, which is used to sign the transaction.
   */
  abstract getMessageToSign(): Buffer

  abstract hash(): Buffer

  abstract getMessageToVerifySignature(): Buffer

  abstract isSigned(): boolean

  /**
   * Determines if the signature is valid
   */
  verifySignature(): boolean {
    try {
      // Main signature verification is done in `getSenderPublicKey()`
      const publicKey = this.getSenderPublicKey()
      return unpadBuffer(publicKey).length !== 0
    } catch (e) {
      return false
    }
  }

  /**
   * Returns the sender's address
   */
  getSenderAddress(): Address {
    return new Address(publicToAddress(this.getSenderPublicKey()))
  }

  abstract getSenderPublicKey(): Buffer

  sign(privateKey: Buffer): TransactionObject {
    if (privateKey.length !== 32) {
      throw new Error('Private key must be 32 bytes in length.')
    }

    const msgHash = this.getMessageToSign()

    // Only `v` is reassigned.
    /* eslint-disable-next-line prefer-const */
    let { v, r, s } = ecsign(msgHash, privateKey)

    return this._processSignature(v, r, s)
  }

  // Accept the v,r,s values from the `sign` method, and convert this into a TransactionObject
  protected abstract _processSignature(v: number, r: Buffer, s: Buffer): TransactionObject

  /**
   * Returns an object with the JSON representation of the transaction
   */
  abstract toJSON(): JsonTx

  protected _validateExceedsMaxInteger(validateCannotExceedMaxInteger: { [key: string]: BN }) {
    for (const [key, value] of Object.entries(validateCannotExceedMaxInteger)) {
      if (value && value.gt(MAX_INTEGER)) {
        throw new Error(`${key} cannot exceed MAX_INTEGER, given ${value}`)
      }
    }
  }
}
