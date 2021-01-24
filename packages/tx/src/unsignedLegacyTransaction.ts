/* eslint-disable no-dupe-class-members */

import { Buffer } from 'buffer'
import {
  Address,
  BN,
  bnToHex,
  bnToRlp,
  ecsign,
  rlp,
  rlphash,
  toBuffer,
  unpadBuffer,
  MAX_INTEGER,
} from 'ethereumjs-util'
import Common from '@ethereumjs/common'
import { TxOptions, LegacyTxData, JsonTx, DEFAULT_COMMON } from './types'
import { default as SignedLegacyTransaction } from './signedLegacyTransaction'

/**
 * An Ethereum transaction.
 */
export default class UnsignedLegacyTransaction {
  public readonly common: Common
  public readonly nonce: BN
  public readonly gasLimit: BN
  public readonly gasPrice: BN
  public readonly to?: Address
  public readonly value: BN
  public readonly data: Buffer

  public static fromTxData(txData: LegacyTxData, opts?: TxOptions) {
    if (txData.v && txData.r && txData.s) {
      return SignedLegacyTransaction.fromTxData(txData, opts)
    } else {
      return new UnsignedLegacyTransaction(txData, opts)
    }
  }

  public static fromRlpSerializedTx(serialized: Buffer, opts?: TxOptions) {
    const values = rlp.decode(serialized)

    if (!Array.isArray(values)) {
      throw new Error('Invalid serialized tx input. Must be array')
    }

    return this.fromValuesArray(values, opts)
  }

  public static fromValuesArray(values: Buffer[], opts?: TxOptions) {
    if (values.length !== 6 && values.length !== 9) {
      throw new Error(
        'Invalid transaction. Only expecting 6 values (for unsigned tx) or 9 values (for signed tx).'
      )
    }

    if (values.length === 6) {
      const [nonce, gasPrice, gasLimit, to, value, data] = values

      const emptyBuffer = Buffer.from([])

      return new UnsignedLegacyTransaction(
        {
          nonce: new BN(nonce),
          gasPrice: new BN(gasPrice),
          gasLimit: new BN(gasLimit),
          to: to && to.length > 0 ? new Address(to) : undefined,
          value: new BN(value),
          data: data ?? emptyBuffer,
        },
        opts
      )
    } else if (values.length === 9) {
      return SignedLegacyTransaction.fromValuesArray(values, opts)
    } else {
      throw new Error(
        'Invalid transaction. Only expecting 6 values (for unsigned tx) or 9 values (for signed tx).'
      )
    }
  }

  /**
   * This constructor takes the values, validates them, assigns them and freezes the object.
   * Use the static factory methods to assist in creating a Transaction object from varying data types.
   * @note Transaction objects implement EIP155 by default. To disable it, pass in an `@ethereumjs/common` object set before EIP155 activation (i.e. before Spurious Dragon).
   */
  protected constructor(txData: LegacyTxData, opts?: TxOptions) {
    const { nonce, gasPrice, gasLimit, to, value, data } = txData

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
    for (const [key, value] of Object.entries(validateCannotExceedMaxInteger)) {
      if (value && value.gt(MAX_INTEGER)) {
        throw new Error(`${key} cannot exceed MAX_INTEGER, given ${value}`)
      }
    }

    if (opts?.common) {
      this.common = Object.assign(Object.create(Object.getPrototypeOf(opts.common)), opts.common)
    } else {
      this.common = DEFAULT_COMMON
    }

    const freeze = opts?.freeze ?? true
    if (freeze) {
      Object.freeze(this)
    }
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

  getMessageToSign() {
    return this._getMessageToSign(this._unsignedTxImplementsEIP155())
  }

  /**
   * Returns chain ID
   */
  getChainId(): number {
    return this.common.chainId()
  }

  /**
   * Sign a transaction with a given private key.
   * Returns a new Transaction object (the original tx will not be modified).
   * Example:
   * ```typescript
   * const unsignedTx = Transaction.fromTxData(txData)
   * const signedTx = unsignedTx.sign(privKey)
   * ```
   * @param privateKey Must be 32 bytes in length.
   */
  sign(privateKey: Buffer) {
    if (privateKey.length !== 32) {
      throw new Error('Private key must be 32 bytes in length.')
    }

    const msgHash = this.getMessageToSign()

    // Only `v` is reassigned.
    /* eslint-disable-next-line prefer-const */
    let { v, r, s } = ecsign(msgHash, privateKey)

    if (this._unsignedTxImplementsEIP155()) {
      v += this.getChainId() * 2 + 8
    }

    const opts = {
      common: this.common,
    }

    return SignedLegacyTransaction.fromTxData(
      {
        nonce: this.nonce,
        gasPrice: this.gasPrice,
        gasLimit: this.gasLimit,
        to: this.to,
        value: this.value,
        data: this.data,
        v: new BN(v),
        r: new BN(r),
        s: new BN(s),
      },
      opts
    )
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
   * The up front amount that an account must have for this transaction to be valid
   */
  getUpfrontCost(): BN {
    return this.gasLimit.mul(this.gasPrice).add(this.value)
  }

  /**
   * Validates the signature and checks if
   * the transaction has the minimum amount of gas required
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

    return stringError ? errors : errors.length === 0
  }

  /**
   * Returns a Buffer Array of the raw Buffers of this transaction, in order.
   */
  raw(): Buffer[] {
    return [
      bnToRlp(this.nonce),
      bnToRlp(this.gasPrice),
      bnToRlp(this.gasLimit),
      this.to !== undefined ? this.to.buf : Buffer.from([]),
      bnToRlp(this.value),
      this.data,
    ]
  }

  /**
   * Returns the rlp encoding of the transaction.
   */
  serialize(): Buffer {
    return rlp.encode(this.raw())
  }

  /**
   * Returns an object with the JSON representation of the transaction
   */
  toJSON(): JsonTx {
    return {
      nonce: bnToHex(this.nonce),
      gasPrice: bnToHex(this.gasPrice),
      gasLimit: bnToHex(this.gasLimit),
      to: this.to !== undefined ? this.to.toString() : undefined,
      value: bnToHex(this.value),
      data: '0x' + this.data.toString('hex'),
    }
  }

  public isSigned(): boolean {
    return false
  }

  private _unsignedTxImplementsEIP155() {
    return this.common.gteHardfork('spuriousDragon')
  }

  protected _getMessageToSign(withEIP155: boolean) {
    const values = this.raw()

    if (withEIP155) {
      values.push(toBuffer(this.getChainId()))
      values.push(unpadBuffer(toBuffer(0)))
      values.push(unpadBuffer(toBuffer(0)))
    }

    return rlphash(values)
  }
}
