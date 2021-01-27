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
  publicToAddress,
  ecrecover,
} from 'ethereumjs-util'
import { TxOptions, LegacyTxData, JsonLegacyTx } from './types'
import { BaseTransaction, SignedTransactionInterface } from './baseTransaction'

/**
 * An Ethereum transaction.
 */
export class UnsignedLegacyTransaction extends BaseTransaction<
  SignedLegacyTransaction,
  JsonLegacyTx
> {
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

    const emptyBuffer = Buffer.from('')
    // If length is not 6, it has length 9. If v/r/s are empty Buffers, it is still an unsigned transaction
    // This happens if you get the RLP data from `raw()`
    if (
      values.length === 6 ||
      (values[6].equals(values[7]) && values[7].equals(values[8]) && values[8].equals(emptyBuffer))
    ) {
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

    super({ to }, opts)

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

    const freeze = opts?.freeze ?? true
    if (freeze) {
      Object.freeze(this)
    }
  }

  getMessageToSign() {
    return this._getMessageToSign(this._unsignedTxImplementsEIP155())
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
      // Since v/r/s is undefined, have to input empty buffers here.
      Buffer.from([]),
      Buffer.from([]),
      Buffer.from([]),
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
  toJSON(): JsonLegacyTx {
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
    const values = [
      bnToRlp(this.nonce),
      bnToRlp(this.gasPrice),
      bnToRlp(this.gasLimit),
      this.to !== undefined ? this.to.buf : Buffer.from([]),
      bnToRlp(this.value),
      this.data,
    ]

    if (withEIP155) {
      values.push(toBuffer(this.getChainId()))
      values.push(unpadBuffer(toBuffer(0)))
      values.push(unpadBuffer(toBuffer(0)))
    }

    return rlphash(values)
  }
}

// secp256k1n/2
const N_DIV_2 = new BN('7fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a0', 16)

export class SignedLegacyTransaction
  extends UnsignedLegacyTransaction
  implements SignedTransactionInterface {
  public readonly v: BN
  public readonly r: BN
  public readonly s: BN

  public static fromTxData(txData: LegacyTxData, opts?: TxOptions) {
    return new SignedLegacyTransaction(txData, opts)
  }

  public static fromRlpSerializedTx(serialized: Buffer, opts?: TxOptions) {
    const values = rlp.decode(serialized)

    if (!Array.isArray(values)) {
      throw new Error('Invalid serialized tx input. Must be array')
    }

    return this.fromValuesArray(values, opts)
  }

  public static fromValuesArray(values: Buffer[], opts?: TxOptions) {
    if (values.length !== 9) {
      throw new Error('Expected 9 elements')
    }

    const [nonce, gasPrice, gasLimit, to, value, data, v, r, s] = values

    const emptyBuffer = Buffer.from([])

    return new SignedLegacyTransaction(
      {
        nonce: new BN(nonce),
        gasPrice: new BN(gasPrice),
        gasLimit: new BN(gasLimit),
        to: to && to.length > 0 ? new Address(to) : undefined,
        value: new BN(value),
        data: data ?? emptyBuffer,
        v: !v?.equals(emptyBuffer) ? new BN(v) : undefined,
        r: !r?.equals(emptyBuffer) ? new BN(r) : undefined,
        s: !s?.equals(emptyBuffer) ? new BN(s) : undefined,
      },
      opts
    )
  }

  private constructor(txData: LegacyTxData, opts?: TxOptions) {
    super(txData, {
      ...opts,
      freeze: false,
    })

    const { v, r, s } = txData

    if (!!v || !!r || !!s) {
      throw new Error('Transaction is not signed')
    }

    this.v = new BN(toBuffer(v))
    this.r = new BN(toBuffer(r))
    this.s = new BN(toBuffer(s))

    const validateCannotExceedMaxInteger = {
      r: this.r,
      s: this.s,
    }

    for (const [key, value] of Object.entries(validateCannotExceedMaxInteger)) {
      if (value && value.gt(MAX_INTEGER)) {
        throw new Error(`${key} cannot exceed MAX_INTEGER, given ${value}`)
      }
    }

    this._validateTxV(this.v)

    const freeze = opts?.freeze ?? true
    if (freeze) {
      Object.freeze(this)
    }
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
      this.v !== undefined ? bnToRlp(this.v) : Buffer.from([]),
      this.r !== undefined ? bnToRlp(this.r) : Buffer.from([]),
      this.s !== undefined ? bnToRlp(this.s) : Buffer.from([]),
    ]
  }

  /**
   * Computes a sha3-256 hash of the serialized tx
   */
  hash(): Buffer {
    return rlphash(this.raw())
  }

  /**
   * Returns an object with the JSON representation of the transaction
   */
  toJSON(): JsonLegacyTx {
    return {
      nonce: bnToHex(this.nonce),
      gasPrice: bnToHex(this.gasPrice),
      gasLimit: bnToHex(this.gasLimit),
      to: this.to !== undefined ? this.to.toString() : undefined,
      value: bnToHex(this.value),
      data: '0x' + this.data.toString('hex'),
      v: bnToHex(this.v),
      r: bnToHex(this.r),
      s: bnToHex(this.s),
    }
  }

  public isSigned(): boolean {
    return true
  }

  getMessageToVerifySignature() {
    const withEIP155 = this._signedTxImplementsEIP155()

    return this._getMessageToSign(withEIP155)
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
  getSenderPublicKey(): Buffer {
    const msgHash = this.getMessageToVerifySignature()

    // All transaction signatures whose s-value is greater than secp256k1n/2 are considered invalid.
    if (this.common.gteHardfork('homestead') && this.s && this.s.gt(N_DIV_2)) {
      throw new Error(
        'Invalid Signature: s-values greater than secp256k1n/2 are considered invalid'
      )
    }

    const { v, r, s } = this
    if (!v || !r || !s) {
      throw new Error('Missing values to derive sender public key from signed tx')
    }

    try {
      return ecrecover(
        msgHash,
        v.toNumber(),
        bnToRlp(r),
        bnToRlp(s),
        this._signedTxImplementsEIP155() ? this.getChainId() : undefined
      )
    } catch (e) {
      throw new Error('Invalid Signature')
    }
  }

  /**
   * Validates the signature and checks if
   * the transaction has the minimum amount of gas required
   * (DataFee + TxFee + Creation Fee).
   */
  validate(): boolean
  // eslint-disable-next-line no-dupe-class-members
  validate(stringError: false): boolean
  // eslint-disable-next-line no-dupe-class-members
  validate(stringError: true): string[]
  // eslint-disable-next-line no-dupe-class-members
  validate(stringError: boolean = false): boolean | string[] {
    const errors = super.validate(true)

    if (!this.verifySignature()) {
      errors.push('Invalid Signature')
    }

    return stringError ? errors : errors.length === 0
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

  sign(privateKey: Buffer): never {
    throw new Error('Cannot re-sign an already signed message')
  }

  /**
   * Validates tx's `v` value
   */
  private _validateTxV(v: BN | undefined): void {
    if (v === undefined || v.toNumber() === 0) {
      return
    }

    if (!this.common.gteHardfork('spuriousDragon')) {
      return
    }

    const vInt = v.toNumber()

    if (vInt === 27 || vInt === 28) {
      return
    }

    const isValidEIP155V =
      vInt === this.getChainId() * 2 + 35 || vInt === this.getChainId() * 2 + 36

    if (!isValidEIP155V) {
      throw new Error(
        `Incompatible EIP155-based V ${vInt} and chain id ${this.getChainId()}. See the Common parameter of the Transaction constructor to set the chain id.`
      )
    }
  }

  private _signedTxImplementsEIP155() {
    if (!this.isSigned()) {
      throw Error('This transaction is not signed')
    }

    const onEIP155BlockOrLater = this.common.gteHardfork('spuriousDragon')

    // EIP155 spec:
    // If block.number >= 2,675,000 and v = CHAIN_ID * 2 + 35 or v = CHAIN_ID * 2 + 36, then when computing the hash of a transaction for purposes of signing or recovering, instead of hashing only the first six elements (i.e. nonce, gasprice, startgas, to, value, data), hash nine elements, with v replaced by CHAIN_ID, r = 0 and s = 0.
    const v = this.v?.toNumber()

    const vAndChainIdMeetEIP155Conditions =
      v === this.getChainId() * 2 + 35 || v === this.getChainId() * 2 + 36

    return vAndChainIdMeetEIP155Conditions && onEIP155BlockOrLater
  }
}
