import { Buffer } from 'buffer'
import {
  Address,
  BN,
  bnToHex,
  bnToRlp,
  ecrecover,
  rlp,
  rlphash,
  toBuffer,
  unpadBuffer,
  publicToAddress,
  MAX_INTEGER,
} from 'ethereumjs-util'
import { TxOptions, LegacyTxData, JsonTx } from './types'
import { default as UnsignedLegacyTransaction } from './unsignedLegacyTransaction'

// secp256k1n/2
const N_DIV_2 = new BN('7fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a0', 16)

export default class SignedLegacyTransaction extends UnsignedLegacyTransaction {
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
    super(txData, opts)

    const { v, r, s } = txData

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
    const values = [
      bnToRlp(this.nonce),
      bnToRlp(this.gasPrice),
      bnToRlp(this.gasLimit),
      this.to !== undefined ? this.to.buf : Buffer.from([]),
      bnToRlp(this.value),
      this.data,
      this.v ? bnToRlp(this.v) : Buffer.from([]),
      this.r ? bnToRlp(this.r) : Buffer.from([]),
      this.s ? bnToRlp(this.s) : Buffer.from([]),
    ]

    return rlphash(values)
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
      v: bnToHex(this.v),
      r: bnToHex(this.r),
      s: bnToHex(this.s),
    }
  }

  public isSigned(): boolean {
    return true
  }

  getMessageToVerifySignature() {
    return this._getMessageToSign(this._signedTxImplementsEIP155())
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
