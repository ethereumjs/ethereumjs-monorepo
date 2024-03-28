import { RLP } from '@ethereumjs/rlp'
import {
  BIGINT_0,
  BIGINT_27,
  MAX_INTEGER,
  bigIntToHex,
  bigIntToUnpaddedBytes,
  bytesToBigInt,
  bytesToHex,
  equalsBytes,
  toBytes,
  validateNoLeadingZeroes,
} from '@ethereumjs/util'

import { BaseTransaction } from './baseTransaction.js'
import * as EIP1559 from './capabilities/eip1559.js'
import * as EIP2718 from './capabilities/eip2718.js'
import * as EIP2930 from './capabilities/eip2930.js'
import * as Legacy from './capabilities/legacy.js'
import { TransactionType } from './types.js'
import { AccessLists, txTypeBytes } from './util.js'

import type {
  AccessList,
  AccessListBytes,
  TxData as AllTypesTxData,
  TxValuesArray as AllTypesTxValuesArray,
  JsonTx,
  TxOptions,
} from './types.js'
import type { Common } from '@ethereumjs/common'

type TxData = AllTypesTxData[TransactionType.DelegateEIP5806]
type TxValuesArray = AllTypesTxValuesArray[TransactionType.DelegateEIP5806]

/**
 * Typed transaction with a new gas fee market mechanism
 *
 * - TransactionType: 4
 * - EIP: [EIP-5806](https://eips.ethereum.org/EIPS/eip-5806)
 */
export class DelegateEIP5806Transaction extends BaseTransaction<TransactionType.DelegateEIP5806> {
  // implements EIP5806CompatibleTx<TransactionType.DelegateEIP5806>
  public readonly value = 0n
  public readonly chainId: bigint
  public readonly accessList: AccessListBytes
  public readonly AccessListJSON: AccessList
  public readonly maxPriorityFeePerGas: bigint
  public readonly maxFeePerGas: bigint

  public readonly common: Common

  /**
   * Instantiate a transaction from a data dictionary.
   *
   * Format: { chainId, nonce, maxPriorityFeePerGas, maxFeePerGas, gasLimit, to, data,
   * accessList, v, r, s }
   *
   * Notes:
   * - `chainId` will be set automatically if not provided
   * - All parameters are optional and have some basic default values
   */
  public static fromTxData(txData: TxData, opts: TxOptions = {}) {
    return new DelegateEIP5806Transaction(txData, opts)
  }

  /**
   * Instantiate a transaction from the serialized tx.
   *
   * Format: `0x04 || rlp([chainId, nonce, maxPriorityFeePerGas, maxFeePerGas, gasLimit, to, data,
   * accessList, signatureYParity, signatureR, signatureS])`
   */
  public static fromSerializedTx(serialized: Uint8Array, opts: TxOptions = {}) {
    if (
      equalsBytes(serialized.subarray(0, 1), txTypeBytes(TransactionType.DelegateEIP5806)) === false
    ) {
      throw new Error(
        `Invalid serialized tx input: not an EIP-5806 transaction (wrong tx type, expected: ${
          TransactionType.DelegateEIP5806
        }, received: ${bytesToHex(serialized.subarray(0, 1))}`
      )
    }

    const values = RLP.decode(serialized.subarray(1))

    if (!Array.isArray(values)) {
      throw new Error('Invalid serialized tx input: must be array')
    }

    return DelegateEIP5806Transaction.fromValuesArray(values as TxValuesArray, opts)
  }

  /**
   * Create a transaction from a values array.
   *
   * Format: `[chainId, nonce, maxPriorityFeePerGas, maxFeePerGas, gasLimit, to, data,
   * accessList, signatureYParity, signatureR, signatureS]`
   */
  public static fromValuesArray(values: TxValuesArray, opts: TxOptions = {}) {
    if (values.length !== 8 && values.length !== 11) {
      throw new Error(
        'Invalid EIP-5806 transaction. Only expecting 8 values (for unsigned tx) or 11 values (for signed tx).'
      )
    }

    const [
      chainId,
      nonce,
      maxPriorityFeePerGas,
      maxFeePerGas,
      gasLimit,
      to,
      data,
      accessList,
      v,
      r,
      s,
    ] = values

    this._validateNotArray({ chainId, v })
    validateNoLeadingZeroes({ nonce, maxPriorityFeePerGas, maxFeePerGas, gasLimit, v, r, s })

    return new DelegateEIP5806Transaction(
      {
        chainId: bytesToBigInt(chainId),
        nonce,
        maxPriorityFeePerGas,
        maxFeePerGas,
        gasLimit,
        to,
        value: 0n,
        data,
        accessList: accessList ?? [],
        v: v !== undefined ? bytesToBigInt(v) : undefined, // EIP2930 supports v's with value 0 (empty Uint8Array)
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
    super({ ...txData, type: TransactionType.DelegateEIP5806 }, opts)
    const { chainId, accessList, maxFeePerGas, maxPriorityFeePerGas } = txData

    this.common = this._getCommon(opts.common, chainId)
    this.chainId = this.common.chainId()

    if (this.common.isActivatedEIP(5806) === false) {
      throw new Error('EIP-5806 not enabled on Common')
    }
    this.activeCapabilities = this.activeCapabilities.concat([1559, 2718, 2930, 5806])

    // Populate the access list fields
    const accessListData = AccessLists.getAccessListData(accessList ?? [])
    this.accessList = accessListData.accessList
    this.AccessListJSON = accessListData.AccessListJSON
    // Verify the access list format.
    AccessLists.verifyAccessList(this.accessList)

    this.maxFeePerGas = bytesToBigInt(toBytes(maxFeePerGas === '' ? '0x' : maxFeePerGas))
    this.maxPriorityFeePerGas = bytesToBigInt(
      toBytes(maxPriorityFeePerGas === '' ? '0x' : maxPriorityFeePerGas)
    )

    this._validateCannotExceedMaxInteger({
      maxFeePerGas: this.maxFeePerGas,
      maxPriorityFeePerGas: this.maxPriorityFeePerGas,
    })

    BaseTransaction._validateNotArray(txData)

    if (this.gasLimit * this.maxFeePerGas > MAX_INTEGER) {
      const msg = this._errorMsg('gasLimit * maxFeePerGas cannot exceed MAX_INTEGER (2^256-1)')
      throw new Error(msg)
    }

    if (this.maxFeePerGas < this.maxPriorityFeePerGas) {
      const msg = this._errorMsg(
        'maxFeePerGas cannot be less than maxPriorityFeePerGas (The total must be the larger of the two)'
      )
      throw new Error(msg)
    }

    EIP2718.validateYParity(this)
    Legacy.validateHighS(this)

    const freeze = opts?.freeze ?? true
    if (freeze) {
      Object.freeze(this)
    }
  }

  /**
   * The amount of gas paid for the data in this tx
   */
  getDataFee(): bigint {
    return EIP2930.getDataFee(this)
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
   * Returns a Uint8Array Array of the raw Bytes of the EIP-5806 transaction, in order.
   *
   * Format: `[chainId, nonce, maxPriorityFeePerGas, maxFeePerGas, gasLimit, to, data,
   * accessList, signatureYParity, signatureR, signatureS]`
   *
   * Use {@link DelegateEIP5806Transaction.serialize} to add a transaction to a block
   * with {@link Block.fromValuesArray}.
   *
   * For an unsigned tx this method uses the empty Bytes values for the
   * signature parameters `v`, `r` and `s` for encoding. For an EIP-155 compliant
   * representation for external signing use {@link DelegateEIP5806Transaction.getMessageToSign}.
   */
  raw(): TxValuesArray {
    return [
      bigIntToUnpaddedBytes(this.chainId),
      bigIntToUnpaddedBytes(this.nonce),
      bigIntToUnpaddedBytes(this.maxPriorityFeePerGas),
      bigIntToUnpaddedBytes(this.maxFeePerGas),
      bigIntToUnpaddedBytes(this.gasLimit),
      this.to !== undefined ? this.to.bytes : new Uint8Array(0),
      this.data,
      this.accessList,
      this.v !== undefined ? bigIntToUnpaddedBytes(this.v) : new Uint8Array(0),
      this.r !== undefined ? bigIntToUnpaddedBytes(this.r) : new Uint8Array(0),
      this.s !== undefined ? bigIntToUnpaddedBytes(this.s) : new Uint8Array(0),
    ]
  }

  /**
   * Returns the serialized encoding of the EIP-5806 transaction.
   *
   * Format: `0x02 || rlp([chainId, nonce, maxPriorityFeePerGas, maxFeePerGas, gasLimit, to, data,
   * accessList, signatureYParity, signatureR, signatureS])`
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
    return EIP2718.serialize(this, this.raw().slice(0, 8))
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
   * Use {@link DelegateEIP5806Transaction.getMessageToSign} to get a tx hash for the purpose of signing.
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

  addSignature(
    v: bigint,
    r: Uint8Array | bigint,
    s: Uint8Array | bigint,
    convertV: boolean = false
  ): DelegateEIP5806Transaction {
    r = toBytes(r)
    s = toBytes(s)
    const opts = { ...this.txOptions, common: this.common }

    return DelegateEIP5806Transaction.fromTxData(
      {
        chainId: this.chainId,
        nonce: this.nonce,
        maxPriorityFeePerGas: this.maxPriorityFeePerGas,
        maxFeePerGas: this.maxFeePerGas,
        gasLimit: this.gasLimit,
        to: this.to,
        value: 0n,
        data: this.data,
        accessList: this.accessList,
        v: convertV ? v - BIGINT_27 : v, // This looks extremely hacky: @ethereumjs/util actually adds 27 to the value, the recovery bit is either 0 or 1.
        r: bytesToBigInt(r),
        s: bytesToBigInt(s),
      },
      opts
    )
  }

  /**
   * Returns an object with the JSON representation of the transaction
   */
  toJSON(): JsonTx {
    const accessListJSON = AccessLists.getAccessListJSON(this.accessList)
    const baseJson = super.toJSON()

    return {
      ...baseJson,
      chainId: bigIntToHex(this.chainId),
      maxPriorityFeePerGas: bigIntToHex(this.maxPriorityFeePerGas),
      maxFeePerGas: bigIntToHex(this.maxFeePerGas),
      accessList: accessListJSON,
    }
  }

  /**
   * Return a compact error string representation of the object
   */
  public errorStr() {
    let errorStr = this._getSharedErrorPostfix()
    errorStr += ` maxFeePerGas=${this.maxFeePerGas} maxPriorityFeePerGas=${this.maxPriorityFeePerGas}`
    return errorStr
  }

  /**
   * Internal helper function to create an annotated error message
   *
   * @param msg Base error message
   * @hidden
   */
  protected _errorMsg(msg: string) {
    return Legacy.errorMsg(this, msg)
  }
}
