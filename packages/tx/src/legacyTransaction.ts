import {
  BN,
  bnToHex,
  bnToRlp,
  ecrecover,
  rlp,
  rlphash,
  toBuffer,
  unpadBuffer,
} from 'ethereumjs-util'
import { TxOptions, TxData, JsonTx, N_DIV_2 } from './types'
import { BaseTransaction } from './baseTransaction'

const TRANSACTION_TYPE = 0

/**
 * An Ethereum non-typed (legacy) transaction
 */
export default class Transaction extends BaseTransaction<Transaction> {
  public readonly gasPrice: BN

  /**
   * Instantiate a transaction from a data dictionary
   */
  public static fromTxData(txData: TxData, opts: TxOptions = {}) {
    return new Transaction(txData, opts)
  }

  /**
   * Instantiate a transaction from the serialized tx.
   */
  public static fromSerializedTx(serialized: Buffer, opts: TxOptions = {}) {
    const values = rlp.decode(serialized)

    if (!Array.isArray(values)) {
      throw new Error('Invalid serialized tx input. Must be array')
    }

    return this.fromValuesArray(values, opts)
  }

  /**
   * Instantiate a transaction from the serialized tx.
   * (alias of `fromSerializedTx()`)
   *
   * @deprecated this constructor alias is deprecated and will be removed
   * in favor of the `fromSerializedTx()` constructor
   */
  public static fromRlpSerializedTx(serialized: Buffer, opts: TxOptions = {}) {
    return Transaction.fromSerializedTx(serialized, opts)
  }

  /**
   * Create a transaction from a values array.
   *
   * The format is:
   * nonce, gasPrice, gasLimit, to, value, data, v, r, s
   */
  public static fromValuesArray(values: Buffer[], opts: TxOptions = {}) {
    // If length is not 6, it has length 9. If v/r/s are empty Buffers, it is still an unsigned transaction
    // This happens if you get the RLP data from `raw()`
    if (values.length !== 6 && values.length !== 9) {
      throw new Error(
        'Invalid transaction. Only expecting 6 values (for unsigned tx) or 9 values (for signed tx).'
      )
    }

    const [nonce, gasPrice, gasLimit, to, value, data, v, r, s] = values

    return new Transaction(
      {
        nonce,
        gasPrice,
        gasLimit,
        to,
        value,
        data,
        v,
        r,
        s,
      },
      opts
    )
  }

  /**
   * This constructor takes the values, validates them, assigns them and freezes the object.
   *
   * It is not recommended to use this constructor directly. Instead use
   * the static factory methods to assist in creating a Transaction object from
   * varying data types.
   */
  public constructor(txData: TxData, opts: TxOptions = {}) {
    super({ ...txData, type: TRANSACTION_TYPE }, opts)

    this.gasPrice = new BN(toBuffer(txData.gasPrice === '' ? '0x' : txData.gasPrice))

    this._validateCannotExceedMaxInteger({ gasPrice: this.gasPrice })

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
   * Returns the rlp encoding of the transaction.
   */
  serialize(): Buffer {
    return rlp.encode(this.raw())
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
      values.push(toBuffer(this.common.chainIdBN()))
      values.push(unpadBuffer(toBuffer(0)))
      values.push(unpadBuffer(toBuffer(0)))
    }

    return values
  }

  /**
   * Returns the serialized unsigned tx (hashed or raw), which is used to sign the transaction.
   *
   * @param hashMessage - Return hashed message if set to true (default: true)
   */
  getMessageToSign(hashMessage: false): Buffer[]
  getMessageToSign(hashMessage?: true): Buffer
  getMessageToSign(hashMessage = true) {
    const message = this._getMessageToSign(this._unsignedTxImplementsEIP155())
    if (hashMessage) {
      return rlphash(message)
    } else {
      return message
    }
  }

  /**
   * The up front amount that an account must have for this transaction to be valid
   * @param baseFee If present, return the upfront cost if the transaction is in an EIP1559 block
   */
  getUpfrontCost(baseFee?: BN): BN {
    if (baseFee) {
      const inclusionFeePerGas = BN.min(this.gasPrice, this.gasPrice.sub(baseFee!))
      const gasPrice = inclusionFeePerGas.add(baseFee!)
      return this.gasLimit.mul(gasPrice).add(this.value)
    } else {
      return this.gasLimit.mul(this.gasPrice).add(this.value)
    }
  }

  /**
   * Computes a sha3-256 hash of the serialized tx
   */
  hash(): Buffer {
    return rlphash(this.raw())
  }

  /**
   * Computes a sha3-256 hash which can be used to verify the signature
   */
  getMessageToVerifySignature() {
    const withEIP155 = this._signedTxImplementsEIP155()
    const message = this._getMessageToSign(withEIP155)
    return rlphash(message)
  }

  /**
   * Returns the public key of the sender
   */
  getSenderPublicKey(): Buffer {
    const msgHash = this.getMessageToVerifySignature()

    // All transaction signatures whose s-value is greater than secp256k1n/2 are considered invalid.
    if (this.common.gteHardfork('homestead') && this.s?.gt(N_DIV_2)) {
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
        v,
        bnToRlp(r),
        bnToRlp(s),
        this._signedTxImplementsEIP155() ? this.common.chainIdBN() : undefined
      )
    } catch (e) {
      throw new Error('Invalid Signature')
    }
  }

  /**
   * Process the v, r, s values from the `sign` method of the base transaction.
   */
  protected _processSignature(v: number, r: Buffer, s: Buffer) {
    const vBN = new BN(v)
    if (this._unsignedTxImplementsEIP155()) {
      vBN.iadd(this.common.chainIdBN().muln(2).addn(8))
    }

    const opts = {
      common: this.common,
    }

    return Transaction.fromTxData(
      {
        nonce: this.nonce,
        gasPrice: this.gasPrice,
        gasLimit: this.gasLimit,
        to: this.to,
        value: this.value,
        data: this.data,
        v: vBN,
        r: new BN(r),
        s: new BN(s),
      },
      opts
    )
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
      v: this.v !== undefined ? bnToHex(this.v) : undefined,
      r: this.r !== undefined ? bnToHex(this.r) : undefined,
      s: this.s !== undefined ? bnToHex(this.s) : undefined,
    }
  }

  /**
   * Validates tx's `v` value
   */
  private _validateTxV(v: BN | undefined): void {
    if (v === undefined || v.eqn(0)) {
      return
    }

    if (!this.common.gteHardfork('spuriousDragon')) {
      return
    }

    if (v.eqn(27) || v.eqn(28)) {
      return
    }

    const chainIdDoubled = this.common.chainIdBN().muln(2)

    const isValidEIP155V = v.eq(chainIdDoubled.addn(35)) || v.eq(chainIdDoubled.addn(36))

    if (!isValidEIP155V) {
      throw new Error(
        `Incompatible EIP155-based V ${v.toString()} and chain id ${this.common
          .chainIdBN()
          .toString()}. See the Common parameter of the Transaction constructor to set the chain id.`
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
    const v = this.v!

    const chainIdDoubled = this.common.chainIdBN().muln(2)

    const vAndChainIdMeetEIP155Conditions =
      v.eq(chainIdDoubled.addn(35)) || v.eq(chainIdDoubled.addn(36))

    return vAndChainIdMeetEIP155Conditions && onEIP155BlockOrLater
  }
}
