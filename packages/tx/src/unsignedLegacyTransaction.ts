/* eslint-disable no-dupe-class-members */

import { Buffer } from 'buffer'
import {
  Address,
  BN,
  bnToHex,
  bnToRlp,
  rlp,
  rlphash,
  toBuffer,
  unpadBuffer,
  ecrecover,
} from 'ethereumjs-util'
import { TxOptions, LegacyTxData, JsonLegacyTx } from './types'
import { BaseTransaction } from './baseTransaction'

// secp256k1n/2
const N_DIV_2 = new BN('7fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a0', 16)

/**
 * An Ethereum transaction.
 */
export class LegacyTransaction extends BaseTransaction<JsonLegacyTx, LegacyTransaction> {
  public readonly v?: BN
  public readonly r?: BN
  public readonly s?: BN

  public static fromTxData(txData: LegacyTxData, opts?: TxOptions) {
    return new LegacyTransaction(txData, opts)
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

    // If length is not 6, it has length 9. If v/r/s are empty Buffers, it is still an unsigned transaction
    // This happens if you get the RLP data from `raw()`
    if (values.length === 6 || values.length == 9) {
      const [nonce, gasPrice, gasLimit, to, value, data, v, r, s] = values

      const emptyBuffer = Buffer.from([])

      return new LegacyTransaction(
        {
          nonce: new BN(nonce),
          gasPrice: new BN(gasPrice),
          gasLimit: new BN(gasLimit),
          to: to && to.length > 0 ? new Address(to) : undefined,
          value: new BN(value),
          data: data ?? emptyBuffer,
          v: v !== undefined && !v?.equals(emptyBuffer) ? new BN(v) : undefined,
          r: r !== undefined && !r?.equals(emptyBuffer) ? new BN(r) : undefined,
          s: s !== undefined && !s?.equals(emptyBuffer) ? new BN(s) : undefined,
        },
        opts
      )
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
    const { nonce, gasPrice, gasLimit, to, value, data, v, r, s } = txData

    super({ nonce, gasPrice, gasLimit, to, value, data }, opts)

    this.v = v ? new BN(toBuffer(v)) : undefined
    this.r = r ? new BN(toBuffer(r)) : undefined
    this.s = s ? new BN(toBuffer(s)) : undefined

    const validateCannotExceedMaxInteger = {
      r: this.r ?? new BN(0),
      s: this.s ?? new BN(0),
    }

    this.validateExcdeedsMaxInteger(validateCannotExceedMaxInteger)

    if (this.v) {
      this._validateTxV(this.v)
    }

    const freeze = opts?.freeze ?? true
    if (freeze) {
      Object.freeze(this)
    }
  }

  /**
   * Returns the rlp encoding of the transaction.
   */
  serialize(): Buffer {
    return rlp.encode(this.raw())
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
      v: this.v !== undefined ? bnToHex(this.v) : undefined,
      r: this.r !== undefined ? bnToHex(this.r) : undefined,
      s: this.s !== undefined ? bnToHex(this.s) : undefined,
    }
  }

  public isSigned(): boolean {
    const { v, r, s } = this
    return !!v && !!r && !!s
  }

  private _unsignedTxImplementsEIP155() {
    return this.common.gteHardfork('spuriousDragon')
  }

  private _getMessageToSign(withEIP155: boolean) {
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

  getMessageToSign() {
    return this._getMessageToSign(this._unsignedTxImplementsEIP155())
  }

  /**
   * Process the v, r, s values from the `sign` method of the base transaction.
   */
  protected processSignature(v: number, r: Buffer, s: Buffer) {
    if (this._unsignedTxImplementsEIP155()) {
      v += this.getChainId() * 2 + 8
    }

    const opts = {
      common: this.common,
    }

    return LegacyTransaction.fromTxData(
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

  getMessageToVerifySignature() {
    const withEIP155 = this._signedTxImplementsEIP155()

    return this._getMessageToSign(withEIP155)
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
