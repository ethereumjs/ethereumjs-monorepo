import Common from '@ethereumjs/common'
import {
  Address,
  BN,
  toBuffer,
  MAX_INTEGER,
  TWO_POW256,
  unpadBuffer,
  ecsign,
  publicToAddress,
  BNLike,
} from 'ethereumjs-util'
import {
  TxData,
  JsonTx,
  AccessListEIP2930ValuesArray,
  AccessListEIP2930TxData,
  FeeMarketEIP1559ValuesArray,
  FeeMarketEIP1559TxData,
  TxValuesArray,
  Capability,
} from './types'

/**
 * This base class will likely be subject to further
 * refactoring along the introduction of additional tx types
 * on the Ethereum network.
 *
 * It is therefore not recommended to use directly.
 */
export abstract class BaseTransaction<TransactionObject> {
  private readonly _type: number

  public readonly nonce: BN
  public readonly gasLimit: BN
  public readonly to?: Address
  public readonly value: BN
  public readonly data: Buffer

  public readonly v?: BN
  public readonly r?: BN
  public readonly s?: BN

  public readonly common!: Common

  /**
   * List of tx type defining EIPs,
   * e.g. 1559 (fee market) and 2930 (access lists)
   * for FeeMarketEIP1559Transaction objects
   */
  protected activeCapabilities: number[] = []

  /**
   * The default chain the tx falls back to if no Common
   * is provided and if the chain can't be derived from
   * a passed in chainId (only EIP-2718 typed txs) or
   * EIP-155 signature (legacy txs).
   *
   * @hidden
   */
  protected DEFAULT_CHAIN = 'mainnet'

  /**
   * The default HF if the tx type is active on that HF
   * or the first greater HF where the tx is active.
   *
   * @hidden
   */
  protected DEFAULT_HARDFORK = 'istanbul'

  constructor(txData: TxData | AccessListEIP2930TxData | FeeMarketEIP1559TxData) {
    const { nonce, gasLimit, to, value, data, v, r, s, type } = txData
    this._type = new BN(toBuffer(type)).toNumber()

    const toB = toBuffer(to === '' ? '0x' : to)
    const vB = toBuffer(v === '' ? '0x' : v)
    const rB = toBuffer(r === '' ? '0x' : r)
    const sB = toBuffer(s === '' ? '0x' : s)

    this.nonce = new BN(toBuffer(nonce === '' ? '0x' : nonce))
    this.gasLimit = new BN(toBuffer(gasLimit === '' ? '0x' : gasLimit))
    this.to = toB.length > 0 ? new Address(toB) : undefined
    this.value = new BN(toBuffer(value === '' ? '0x' : value))
    this.data = toBuffer(data === '' ? '0x' : data)

    this.v = vB.length > 0 ? new BN(vB) : undefined
    this.r = rB.length > 0 ? new BN(rB) : undefined
    this.s = sB.length > 0 ? new BN(sB) : undefined

    this._validateCannotExceedMaxInteger({
      nonce: this.nonce,
      gasLimit: this.gasLimit,
      value: this.value,
      r: this.r,
      s: this.s,
    })
  }

  /**
   * Alias for {@link BaseTransaction.type}
   *
   * @deprecated Use `type` instead
   */
  get transactionType(): number {
    return this.type
  }

  /**
   * Returns the transaction type.
   *
   * Note: legacy txs will return tx type `0`.
   */
  get type() {
    return this._type
  }

  /**
   * Checks if a tx type defining capability is active
   * on a tx, for example the EIP-1559 fee market mechanism
   * or the EIP-2930 access list feature.
   *
   * Note that this is different from the tx type itself,
   * so EIP-2930 access lists can very well be active
   * on an EIP-1559 tx for example.
   *
   * This method can be useful for feature checks if the
   * tx type is unknown (e.g. when instantiated with
   * the tx factory).
   *
   * See `Capabilites` in the `types` module for a reference
   * on all supported capabilities.
   */
  supports(capability: Capability) {
    return this.activeCapabilities.includes(capability)
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
  abstract getUpfrontCost(): BN

  /**
   * If the tx's `to` is to the creation address
   */
  toCreationAddress(): boolean {
    return this.to === undefined || this.to.buf.length === 0
  }

  /**
   * Returns a Buffer Array of the raw Buffers of this transaction, in order.
   */
  abstract raw(): TxValuesArray | AccessListEIP2930ValuesArray | FeeMarketEIP1559ValuesArray

  /**
   * Returns the encoding of the transaction.
   */
  abstract serialize(): Buffer

  // Returns the serialized unsigned tx (hashed or raw), which is used to sign the transaction.
  //
  // Note: do not use code docs here since VS Studio is then not able to detect the
  // comments from the inherited methods
  abstract getMessageToSign(hashMessage: false): Buffer | Buffer[]
  abstract getMessageToSign(hashMessage?: true): Buffer

  abstract hash(): Buffer

  abstract getMessageToVerifySignature(): Buffer

  public isSigned(): boolean {
    const { v, r, s } = this
    if (this.type === 0) {
      if (!v || !r || !s) {
        return false
      } else {
        return true
      }
    } else {
      if (v === undefined || !r || !s) {
        return false
      } else {
        return true
      }
    }
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
   * Signs a transaction.
   *
   * Note that the signed tx is returned as a new object,
   * use as follows:
   * ```javascript
   * const signedTx = tx.sign(privateKey)
   * ```
   */
  sign(privateKey: Buffer): TransactionObject {
    if (privateKey.length !== 32) {
      throw new Error('Private key must be 32 bytes in length.')
    }

    // Hack for the constellation that we have got a legacy tx after spuriousDragon with a non-EIP155 conforming signature
    // and want to recreate a signature (where EIP155 should be applied)
    // Leaving this hack lets the legacy.spec.ts -> sign(), verifySignature() test fail
    // 2021-06-23
    let hackApplied = false
    if (
      this.type === 0 &&
      this.common.gteHardfork('spuriousDragon') &&
      !this.supports(Capability.EIP155ReplayProtection)
    ) {
      this.activeCapabilities.push(Capability.EIP155ReplayProtection)
      hackApplied = true
    }

    const msgHash = this.getMessageToSign(true)
    const { v, r, s } = ecsign(msgHash, privateKey)
    const tx = this._processSignature(v, r, s)

    // Hack part 2
    if (hackApplied) {
      const index = this.activeCapabilities.indexOf(Capability.EIP155ReplayProtection)
      if (index > -1) {
        this.activeCapabilities.splice(index, 1)
      }
    }

    return tx
  }

  /**
   * Returns an object with the JSON representation of the transaction
   */
  abstract toJSON(): JsonTx

  // Accept the v,r,s values from the `sign` method, and convert this into a TransactionObject
  protected abstract _processSignature(v: number, r: Buffer, s: Buffer): TransactionObject

  /**
   * Does chain ID checks on common and returns a common
   * to be used on instantiation
   * @hidden
   *
   * @param common - {@link Common} instance from tx options
   * @param chainId - Chain ID from tx options (typed txs) or signature (legacy tx)
   */
  protected _getCommon(common?: Common, chainId?: BNLike) {
    // Chain ID provided
    if (chainId) {
      const chainIdBN = new BN(toBuffer(chainId))
      if (common) {
        if (!common.chainIdBN().eq(chainIdBN)) {
          throw new Error('The chain ID does not match the chain ID of Common')
        }
        // Common provided, chain ID does match
        // -> Return provided Common
        return common.copy()
      } else {
        if (Common.isSupportedChainId(chainIdBN)) {
          // No Common, chain ID supported by Common
          // -> Instantiate Common with chain ID
          return new Common({ chain: chainIdBN, hardfork: this.DEFAULT_HARDFORK })
        } else {
          // No Common, chain ID not supported by Common
          // -> Instantiate custom Common derived from DEFAULT_CHAIN
          return Common.forCustomChain(
            this.DEFAULT_CHAIN,
            {
              name: 'custom-chain',
              networkId: chainIdBN,
              chainId: chainIdBN,
            },
            this.DEFAULT_HARDFORK
          )
        }
      }
    } else {
      // No chain ID provided
      // -> return Common provided or create new default Common
      return (
        common?.copy() ?? new Common({ chain: this.DEFAULT_CHAIN, hardfork: this.DEFAULT_HARDFORK })
      )
    }
  }

  protected _validateCannotExceedMaxInteger(values: { [key: string]: BN | undefined }, bits = 53) {
    for (const [key, value] of Object.entries(values)) {
      if (bits === 53) {
        if (value?.gt(MAX_INTEGER)) {
          throw new Error(`${key} cannot exceed MAX_INTEGER, given ${value}`)
        }
      } else if (bits === 256) {
        if (value?.gte(TWO_POW256)) {
          throw new Error(`${key} must be less than 2^256, given ${value}`)
        }
      } else {
        throw new Error('unimplemented bits value')
      }
    }
  }
}
