import {
  BIGINT_0,
  EthereumJSErrorWithoutCode,
  MAX_INTEGER,
  bigIntToHex,
  bigIntToUnpaddedBytes,
  bytesToBigInt,
  eoaCode7702AuthorizationListBytesItemToJSON,
  eoaCode7702AuthorizationListJSONItemToBytes,
  isEOACode7702AuthorizationList,
  toBytes,
} from '@ethereumjs/util'
import type { Address, EOACode7702AuthorizationListBytes } from '@ethereumjs/util'

import * as EIP1559 from '../capabilities/eip1559.ts'
import * as EIP2718 from '../capabilities/eip2718.ts'
import * as EIP2930 from '../capabilities/eip2930.ts'
import * as EIP7702 from '../capabilities/eip7702.ts'
import * as Legacy from '../capabilities/legacy.ts'
import { TransactionType, isAccessList } from '../types.ts'
import {
  getBaseJSON,
  sharedConstructor,
  validateNotArray,
  valueOverflowCheck,
} from '../util/internal.ts'

import { createEOACode7702Tx } from './constructors.ts'

import type { Common } from '@ethereumjs/common'

import type {
  AccessListBytes,
  TxData as AllTypesTxData,
  TxValuesArray as AllTypesTxValuesArray,
  Capability,
  JSONTx,
  TransactionCache,
  TransactionInterface,
  TxOptions,
} from '../types.ts'
import { accessListBytesToJSON, accessListJSONToBytes } from '../util/access.ts'

export type TxData = AllTypesTxData[typeof TransactionType.EOACodeEIP7702]
export type TxValuesArray = AllTypesTxValuesArray[typeof TransactionType.EOACodeEIP7702]

/**
 * Typed transaction with the ability to set codes on EOA accounts
 *
 * - TransactionType: 4
 * - EIP: [EIP-7702](https://github.com/ethereum/EIPs/blob/62419ca3f45375db00b04a368ea37c0bfb05386a/EIPS/eip-7702.md)
 */
export class EOACode7702Tx implements TransactionInterface<typeof TransactionType.EOACodeEIP7702> {
  public type = TransactionType.EOACodeEIP7702 // 7702 tx type

  // Tx data part (part of the RLP)
  public readonly nonce!: bigint
  public readonly gasLimit!: bigint
  public readonly value!: bigint
  public readonly data!: Uint8Array
  public readonly to?: Address
  public readonly accessList: AccessListBytes
  public readonly authorizationList: EOACode7702AuthorizationListBytes
  public readonly chainId: bigint
  public readonly maxPriorityFeePerGas: bigint
  public readonly maxFeePerGas: bigint

  // Props only for signed txs
  public readonly v?: bigint
  public readonly r?: bigint
  public readonly s?: bigint

  // End of Tx data part

  public readonly common!: Common

  readonly txOptions!: TxOptions

  readonly cache: TransactionCache = {}

  /**
   * List of tx type defining EIPs,
   * e.g. 1559 (fee market) and 2930 (access lists)
   * for FeeMarket1559Tx objects
   */
  protected activeCapabilities: number[] = []

  /**
   * This constructor takes the values, validates them, assigns them and freezes the object.
   *
   * It is not recommended to use this constructor directly. Instead use
   * the static factory methods to assist in creating a Transaction object from
   * varying data types.
   */
  public constructor(txData: TxData, opts: TxOptions = {}) {
    sharedConstructor(this, { ...txData, type: TransactionType.EOACodeEIP7702 }, opts)
    const {
      chainId,
      accessList: rawAccessList,
      authorizationList: rawAuthorizationList,
      maxFeePerGas,
      maxPriorityFeePerGas,
    } = txData
    const accessList = rawAccessList ?? []
    const authorizationList = rawAuthorizationList ?? []

    if (chainId !== undefined && bytesToBigInt(toBytes(chainId)) !== this.common.chainId()) {
      throw EthereumJSErrorWithoutCode(
        `Common chain ID ${this.common.chainId} not matching the derived chain ID ${chainId}`,
      )
    }
    this.chainId = this.common.chainId()

    if (!this.common.isActivatedEIP(7702)) {
      throw EthereumJSErrorWithoutCode('EIP-7702 not enabled on Common')
    }
    this.activeCapabilities = this.activeCapabilities.concat([1559, 2718, 2930, 7702])

    // Populate the access list fields
    this.accessList = isAccessList(accessList) ? accessListJSONToBytes(accessList) : accessList
    // Verify the access list format.
    EIP2930.verifyAccessList(this)

    // Populate the authority list fields
    this.authorizationList = isEOACode7702AuthorizationList(authorizationList)
      ? authorizationList.map((item) => eoaCode7702AuthorizationListJSONItemToBytes(item))
      : authorizationList
    // Verify the authority list format.
    EIP7702.verifyAuthorizationList(this)

    this.maxFeePerGas = bytesToBigInt(toBytes(maxFeePerGas))
    this.maxPriorityFeePerGas = bytesToBigInt(toBytes(maxPriorityFeePerGas))

    valueOverflowCheck({
      maxFeePerGas: this.maxFeePerGas,
      maxPriorityFeePerGas: this.maxPriorityFeePerGas,
    })

    validateNotArray(txData)

    if (this.gasLimit * this.maxFeePerGas > MAX_INTEGER) {
      const msg = Legacy.errorMsg(
        this,
        'gasLimit * maxFeePerGas cannot exceed MAX_INTEGER (2^256-1)',
      )
      throw EthereumJSErrorWithoutCode(msg)
    }

    if (this.maxFeePerGas < this.maxPriorityFeePerGas) {
      const msg = Legacy.errorMsg(
        this,
        'maxFeePerGas cannot be less than maxPriorityFeePerGas (The total must be the larger of the two)',
      )
      throw EthereumJSErrorWithoutCode(msg)
    }

    EIP2718.validateYParity(this)
    Legacy.validateHighS(this)

    if (this.to === undefined) {
      const msg = Legacy.errorMsg(
        this,
        `tx should have a "to" field and cannot be used to create contracts`,
      )
      throw EthereumJSErrorWithoutCode(msg)
    }

    const freeze = opts?.freeze ?? true
    if (freeze) {
      Object.freeze(this)
    }
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
   * See `Capabilities` in the `types` module for a reference
   * on all supported capabilities.
   */
  supports(capability: Capability) {
    return this.activeCapabilities.includes(capability)
  }

  /**
   * The amount of gas paid for the data in this tx
   */
  getDataGas(): bigint {
    return EIP7702.getDataGas(this)
  }

  /**
   * Returns the minimum of calculated priority fee (from maxFeePerGas and baseFee) and maxPriorityFeePerGas
   * @param baseFee Base fee retrieved from block
   */
  getEffectivePriorityFee(baseFee: bigint): bigint {
    return EIP1559.getEffectivePriorityFee(this, baseFee)
  }

  /**
   * The up front amount that an account must have for this transaction to be valid
   * @param baseFee The base fee of the block (will be set to 0 if not provided)
   */
  getUpfrontCost(baseFee: bigint = BIGINT_0): bigint {
    return EIP1559.getUpfrontCost(this, baseFee)
  }

  /**
   * The minimum gas limit which the tx to have to be valid.
   * This covers costs as the standard fee (21000 gas), the data fee (paid for each calldata byte),
   * the optional creation fee (if the transaction creates a contract), and if relevant the gas
   * to be paid for access lists (EIP-2930) and authority lists (EIP-7702).
   */
  getIntrinsicGas(): bigint {
    return Legacy.getIntrinsicGas(this)
  }

  // TODO figure out if this is necessary
  /**
   * If the tx's `to` is to the creation address
   */
  toCreationAddress(): boolean {
    return Legacy.toCreationAddress(this)
  }

  /**
   * Returns a Uint8Array Array of the raw Bytes of the EIP-7702 transaction, in order.
   *
   * Format: `[chainId, nonce, maxPriorityFeePerGas, maxFeePerGas, gasLimit, to, value, data,
   * accessList, authorizationList, signatureYParity, signatureR, signatureS]`
   *
   * Use {@link EOACode7702Transaction.serialize} to add a transaction to a block
   * with {@link createBlockFromBytesArray}.
   *
   * For an unsigned tx this method uses the empty Bytes values for the
   * signature parameters `v`, `r` and `s` for encoding. For an EIP-155 compliant
   * representation for external signing use {@link EOACode7702Transaction.getMessageToSign}.
   */
  raw(): TxValuesArray {
    return [
      bigIntToUnpaddedBytes(this.chainId),
      bigIntToUnpaddedBytes(this.nonce),
      bigIntToUnpaddedBytes(this.maxPriorityFeePerGas),
      bigIntToUnpaddedBytes(this.maxFeePerGas),
      bigIntToUnpaddedBytes(this.gasLimit),
      this.to !== undefined ? this.to.bytes : new Uint8Array(0),
      bigIntToUnpaddedBytes(this.value),
      this.data,
      this.accessList,
      this.authorizationList,
      this.v !== undefined ? bigIntToUnpaddedBytes(this.v) : new Uint8Array(0),
      this.r !== undefined ? bigIntToUnpaddedBytes(this.r) : new Uint8Array(0),
      this.s !== undefined ? bigIntToUnpaddedBytes(this.s) : new Uint8Array(0),
    ]
  }

  /**
   * Returns the serialized encoding of the EIP-7702 transaction.
   *
   * Format: `0x02 || rlp([chainId, nonce, maxPriorityFeePerGas, maxFeePerGas, gasLimit, to, value, data,
   * accessList, authorizationList, signatureYParity, signatureR, signatureS])`
   *
   * Note that in contrast to the legacy tx serialization format this is not
   * valid RLP any more due to the raw tx type preceding and concatenated to
   * the RLP encoding of the values.
   */
  serialize(): Uint8Array {
    return EIP2718.serialize(this)
  }

  /**
   * Returns the raw serialized unsigned tx, which can be used
   * to sign the transaction (e.g. for sending to a hardware wallet).
   *
   * Note: in contrast to the legacy tx the raw message format is already
   * serialized and doesn't need to be RLP encoded any more.
   *
   * ```javascript
   * const serializedMessage = tx.getMessageToSign() // use this for the HW wallet input
   * ```
   */
  getMessageToSign(): Uint8Array {
    return EIP2718.serialize(this, this.raw().slice(0, 10))
  }

  /**
   * Returns the hashed serialized unsigned tx, which can be used
   * to sign the transaction (e.g. for sending to a hardware wallet).
   *
   * Note: in contrast to the legacy tx the raw message format is already
   * serialized and doesn't need to be RLP encoded any more.
   */
  getHashedMessageToSign(): Uint8Array {
    return EIP2718.getHashedMessageToSign(this)
  }

  /**
   * Computes a sha3-256 hash of the serialized tx.
   *
   * This method can only be used for signed txs (it throws otherwise).
   * Use {@link EOACode7702Transaction.getMessageToSign} to get a tx hash for the purpose of signing.
   */
  public hash(): Uint8Array {
    return Legacy.hash(this)
  }

  /**
   * Computes a sha3-256 hash which can be used to verify the signature
   */
  public getMessageToVerifySignature(): Uint8Array {
    return this.getHashedMessageToSign()
  }

  /**
   * Returns the public key of the sender
   */
  public getSenderPublicKey(): Uint8Array {
    return Legacy.getSenderPublicKey(this)
  }

  addSignature(v: bigint, r: Uint8Array | bigint, s: Uint8Array | bigint): EOACode7702Tx {
    r = toBytes(r)
    s = toBytes(s)
    const opts = { ...this.txOptions, common: this.common }

    return createEOACode7702Tx(
      {
        chainId: this.chainId,
        nonce: this.nonce,
        maxPriorityFeePerGas: this.maxPriorityFeePerGas,
        maxFeePerGas: this.maxFeePerGas,
        gasLimit: this.gasLimit,
        to: this.to,
        value: this.value,
        data: this.data,
        accessList: this.accessList,
        authorizationList: this.authorizationList,
        v,
        r: bytesToBigInt(r),
        s: bytesToBigInt(s),
      },
      opts,
    )
  }

  /**
   * Returns an object with the JSON representation of the transaction
   */
  toJSON(): JSONTx {
    const accessListJSON = accessListBytesToJSON(this.accessList)
    const authorizationList = this.authorizationList.map((item) =>
      eoaCode7702AuthorizationListBytesItemToJSON(item),
    )

    const baseJSON = getBaseJSON(this)

    return {
      ...baseJSON,
      chainId: bigIntToHex(this.chainId),
      maxPriorityFeePerGas: bigIntToHex(this.maxPriorityFeePerGas),
      maxFeePerGas: bigIntToHex(this.maxFeePerGas),
      accessList: accessListJSON,
      authorizationList,
    }
  }

  getValidationErrors(): string[] {
    return Legacy.getValidationErrors(this)
  }

  isValid(): boolean {
    return Legacy.isValid(this)
  }

  verifySignature(): boolean {
    return Legacy.verifySignature(this)
  }

  getSenderAddress(): Address {
    return Legacy.getSenderAddress(this)
  }

  sign(privateKey: Uint8Array, extraEntropy: Uint8Array | boolean = false): EOACode7702Tx {
    return Legacy.sign(this, privateKey, extraEntropy) as EOACode7702Tx
  }

  public isSigned(): boolean {
    const { v, r, s } = this
    if (v === undefined || r === undefined || s === undefined) {
      return false
    } else {
      return true
    }
  }

  /**
   * Return a compact error string representation of the object
   */
  public errorStr() {
    let errorStr = Legacy.getSharedErrorPostfix(this)
    errorStr += ` maxFeePerGas=${this.maxFeePerGas} maxPriorityFeePerGas=${this.maxPriorityFeePerGas}`
    return errorStr
  }
}
