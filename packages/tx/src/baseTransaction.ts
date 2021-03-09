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
import { TxData, TxOptions, JsonTx } from './types'

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

  constructor(txData: TxData, txOptions: TxOptions = {}) {
    const { nonce, gasLimit, gasPrice, to, value, data, v, r, s } = txData

    this.nonce = new BN(toBuffer(nonce))
    this.gasPrice = new BN(toBuffer(gasPrice))
    this.gasLimit = new BN(toBuffer(gasLimit))
    this.to = to ? new Address(toBuffer(to)) : undefined
    this.value = new BN(toBuffer(value))
    this.data = toBuffer(data)

    this.v = v ? new BN(toBuffer(v)) : undefined
    this.r = r ? new BN(toBuffer(r)) : undefined
    this.s = s ? new BN(toBuffer(s)) : undefined

    this._validateCannotExceedMaxInteger({
      nonce: this.nonce,
      gasPrice: this.gasPrice,
      gasLimit: this.gasLimit,
      value: this.value,
    })

    this.common = txOptions.common?.copy() ?? new Common({ chain: 'mainnet' })
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
  validate(stringError: false): boolean
  validate(stringError: true): string[]
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
   * Returns a Buffer Array of the raw Buffers of this transaction, in order.
   */
  abstract raw(): Buffer[]

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

  public isSigned(): boolean {
    const { v, r, s } = this
    return !!v && !!r && !!s
  }

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

  /**
   * Returns the public key of the sender
   */
  abstract getSenderPublicKey(): Buffer

  /**
   * Signs a tx and returns a new signed tx object
   */
  sign(privateKey: Buffer): TransactionObject {
    if (privateKey.length !== 32) {
      throw new Error('Private key must be 32 bytes in length.')
    }
    const msgHash = this.getMessageToSign()
    const { v, r, s } = ecsign(msgHash, privateKey)
    return this._processSignature(v, r, s)
  }

  /**
   * Returns an object with the JSON representation of the transaction
   */
  abstract toJSON(): JsonTx

  // Accept the v,r,s values from the `sign` method, and convert this into a TransactionObject
  protected abstract _processSignature(v: number, r: Buffer, s: Buffer): TransactionObject

  protected _validateCannotExceedMaxInteger(values: { [key: string]: BN | undefined }) {
    for (const [key, value] of Object.entries(values)) {
      if (value?.gt(MAX_INTEGER)) {
        throw new Error(`${key} cannot exceed MAX_INTEGER, given ${value}`)
      }
    }
  }
}
