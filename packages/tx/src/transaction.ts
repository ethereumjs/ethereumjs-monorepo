import { Buffer } from 'buffer'
import {
  BN,
  ecrecover,
  rlphash,
  publicToAddress,
  ecsign,
  toBuffer,
  rlp,
  unpadBuffer,
  MAX_INTEGER,
  Address
} from 'ethereumjs-util'
import Common from '@ethereumjs/common'
import { TxData, JsonTx, bnToRlp, bnToHex } from './types'

// secp256k1n/2
const N_DIV_2 = new BN('7fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a0', 16)

/**
 * An Ethereum transaction.
 */
export default class Transaction {
  public readonly common: Common
  public readonly nonce: BN
  public readonly gasLimit: BN
  public readonly gasPrice: BN
  public readonly to?: Address
  public readonly value: BN
  public readonly data: Buffer
  public readonly v?: BN
  public readonly r?: BN
  public readonly s?: BN

  public static fromTxData(txData: TxData, common?: Common) {
    const { nonce, gasLimit, gasPrice, to, value, data, v, r, s } = txData

    return new Transaction(
      common,
      new BN(toBuffer(nonce || '0x')),
      new BN(toBuffer(gasPrice || '0x')),
      new BN(toBuffer(gasLimit || '0x')),
      to ? new Address(toBuffer(to)) : undefined,
      new BN(toBuffer(value || '0x')),
      toBuffer(data || '0x'),
      new BN(toBuffer(v || '0x')),
      new BN(toBuffer(r || '0x')),
      new BN(toBuffer(s || '0x')),
    )
  }

  public static fromRlpSerializedTx(serialized: Buffer, common?: Common) {
    const values = rlp.decode(serialized)

    if (!Array.isArray(values)) {
      throw new Error('Invalid serialized tx input. Must be array')
    }

    return this.fromValuesArray(values, common)
  }

  public static fromValuesArray(values: Buffer[], common?: Common) {
    if (values.length !== 6 && values.length !== 9) {
      throw new Error(
        'Invalid transaction. Only expecting 6 values (for unsigned tx) or 9 values (for signed tx).',
      )
    }

    const [nonce, gasPrice, gasLimit, to, value, data, v, r, s] = values

    return new Transaction(
      common,
      new BN(nonce),
      new BN(gasPrice),
      new BN(gasLimit),
      to && to.length > 0 ? new Address(to) : undefined,
      new BN(value),
      data || Buffer.from([]),
      v ? new BN(v) : undefined,
      r ? new BN(r) : undefined,
      s ? new BN(s) : undefined,
    )
  }

  /**
   * This constructor takes the values, validates them, assigns them and freezes the object.
   * Use the public static factory methods to assist in creating a Transaction object from varying data types.
   * @note Transaction objects implement EIP155 by default. To disable it, pass in an `@ethereumjs/common` object set before EIP155 activation (i.e. before Spurious Dragon.)
   */
  constructor(
    common: Common | undefined,
    nonce: BN,
    gasPrice: BN,
    gasLimit: BN,
    to: Address | undefined,
    value: BN,
    data: Buffer,
    v?: BN,
    r?: BN,
    s?: BN,
  ) {
    const validateCannotExceedMaxInteger = { nonce, gasPrice, gasLimit, value, r, s }
    for (const [key, value] of Object.entries(validateCannotExceedMaxInteger)) {
      if (value && value.gt(MAX_INTEGER)) {
        throw new Error(`${key} cannot exceed MAX_INTEGER, given ${value}`)
      }
    }

    if (common) {
      this.common = common
    } else {
      const DEFAULT_CHAIN = 'mainnet'
      this.common = new Common({ chain: DEFAULT_CHAIN })
    }

    this._validateTxV(v)

    this.nonce = nonce
    this.gasPrice = gasPrice
    this.gasLimit = gasLimit
    this.to = to
    this.value = value
    this.data = data
    this.v = v
    this.r = r
    this.s = s

    Object.freeze(this)
  }

  /**
   * If the tx's `to` is to the creation address
   */
  toCreationAddress(): boolean {
    return this.to === undefined || this.to.buf.length === 0
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
      bnToRlp(this.v),
      bnToRlp(this.r),
      bnToRlp(this.s),
    ]

    return rlphash(values)
  }

  getMessageToSign() {
    return this._getMessageToSign(this._unsignedTxImplementsEIP155())
  }

  getMessageToVerifySignature() {
    return this._getMessageToSign(this._signedTxImplementsEIP155())
  }

  /**
   * Returns chain ID
   */
  getChainId(): number {
    return this.common.chainId()
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
        'Invalid Signature: s-values greater than secp256k1n/2 are considered invalid',
      )
    }

    try {
      return ecrecover(
        msgHash,
        this.v!.toNumber(),
        bnToRlp(this.r),
        bnToRlp(this.s),
        this._signedTxImplementsEIP155() ? this.getChainId() : undefined,
      )
    } catch (e) {
      throw new Error('Invalid Signature')
    }
  }

  /**
   * Determines if the signature is valid
   */
  verifySignature(): boolean {
    try {
      return unpadBuffer(this.getSenderPublicKey()).length !== 0
    } catch (e) {
      return false
    }
  }

  /**
   * Sign a transaction with a given private key
   * @param privateKey - Must be 32 bytes in length
   */
  sign(privateKey: Buffer) {
    if (privateKey.length !== 32) {
      throw new Error('Private key must be 32 bytes in length.')
    }

    const msgHash = this.getMessageToSign()

    let { v, r, s } = ecsign(msgHash, privateKey)

    if (this._unsignedTxImplementsEIP155()) {
      v += this.getChainId() * 2 + 8
    }

    return new Transaction(
      this.common,
      this.nonce,
      this.gasPrice,
      this.gasLimit,
      this.to,
      this.value,
      this.data,
      new BN(v),
      new BN(r),
      new BN(s),
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
   * Validates the signature and checks to see if it has enough gas.
   */
  validate(): boolean
  validate(stringError: false): boolean
  validate(stringError: true): string[]
  validate(stringError: boolean = false): boolean | string[] {
    const errors = []

    if (!this.verifySignature()) {
      errors.push('Invalid Signature')
    }

    if (this.getBaseFee().gt(this.gasLimit)) {
      errors.push(`gasLimit is too low. given ${this.gasLimit}, need at least ${this.getBaseFee()}`)
    }

    return stringError ? errors : errors.length === 0
  }

  /**
   * Returns the rlp encoding of the transaction
   */
  serialize(): Buffer {
    return rlp.encode([
      bnToRlp(this.nonce),
      bnToRlp(this.gasPrice),
      bnToRlp(this.gasLimit),
      this.to !== undefined ? this.to.buf : Buffer.from([]),
      bnToRlp(this.value),
      this.data,
      this.v !== undefined ? bnToRlp(this.v) : Buffer.from([]),
      this.r !== undefined ? bnToRlp(this.r) : Buffer.from([]),
      this.s !== undefined ? bnToRlp(this.s) : Buffer.from([]),
    ])
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

  public isSigned(): boolean {
    const { v, r, s } = this
    return !!v && !!r && !!s
  }

  private _unsignedTxImplementsEIP155() {
    return this.common.gteHardfork('spuriousDragon')
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
        `Incompatible EIP155-based V ${vInt} and chain id ${this.getChainId()}. See the Common parameter of the Transaction constructor to set the chain id.`,
      )
    }
  }
}
