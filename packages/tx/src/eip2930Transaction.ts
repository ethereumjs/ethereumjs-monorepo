import { RLP } from '@ethereumjs/rlp'
import {
  MAX_INTEGER,
  bigIntToHex,
  bigIntToUnpaddedBytes,
  bytesToBigInt,
  bytesToHex,
  concatBytes,
  ecrecover,
  equalsBytes,
  hexToBytes,
  toBytes,
  validateNoLeadingZeroes,
} from '@ethereumjs/util'
import { keccak256 } from 'ethereum-cryptography/keccak.js'

import { BaseTransaction } from './baseTransaction.js'
import { TransactionType } from './types.js'
import { AccessLists } from './util.js'

import type {
  AccessList,
  AccessListBytes,
  TxData as AllTypesTxData,
  TxValuesArray as AllTypesTxValuesArray,
  JsonTx,
  TxOptions,
} from './types.js'
import type { Common } from '@ethereumjs/common'

type TxData = AllTypesTxData[TransactionType.AccessListEIP2930]
type TxValuesArray = AllTypesTxValuesArray[TransactionType.AccessListEIP2930]

const TRANSACTION_TYPE_BYTES = hexToBytes(
  '0x' + TransactionType.AccessListEIP2930.toString(16).padStart(2, '0')
)

/**
 * Typed transaction with optional access lists
 *
 * - TransactionType: 1
 * - EIP: [EIP-2930](https://eips.ethereum.org/EIPS/eip-2930)
 */
export class AccessListEIP2930Transaction extends BaseTransaction<TransactionType.AccessListEIP2930> {
  public readonly chainId: bigint
  public readonly accessList: AccessListBytes
  public readonly AccessListJSON: AccessList
  public readonly gasPrice: bigint

  public readonly common: Common

  /**
   * Instantiate a transaction from a data dictionary.
   *
   * Format: { chainId, nonce, gasPrice, gasLimit, to, value, data, accessList,
   * v, r, s }
   *
   * Notes:
   * - `chainId` will be set automatically if not provided
   * - All parameters are optional and have some basic default values
   */
  public static fromTxData(txData: TxData, opts: TxOptions = {}) {
    return new AccessListEIP2930Transaction(txData, opts)
  }

  /**
   * Instantiate a transaction from the serialized tx.
   *
   * Format: `0x01 || rlp([chainId, nonce, gasPrice, gasLimit, to, value, data, accessList,
   * signatureYParity (v), signatureR (r), signatureS (s)])`
   */
  public static fromSerializedTx(serialized: Uint8Array, opts: TxOptions = {}) {
    if (equalsBytes(serialized.subarray(0, 1), TRANSACTION_TYPE_BYTES) === false) {
      throw new Error(
        `Invalid serialized tx input: not an EIP-2930 transaction (wrong tx type, expected: ${
          TransactionType.AccessListEIP2930
        }, received: ${bytesToHex(serialized.subarray(0, 1))}`
      )
    }

    const values = RLP.decode(Uint8Array.from(serialized.subarray(1)))

    if (!Array.isArray(values)) {
      throw new Error('Invalid serialized tx input: must be array')
    }

    return AccessListEIP2930Transaction.fromValuesArray(values as TxValuesArray, opts)
  }

  /**
   * Create a transaction from a values array.
   *
   * Format: `[chainId, nonce, gasPrice, gasLimit, to, value, data, accessList,
   * signatureYParity (v), signatureR (r), signatureS (s)]`
   */
  public static fromValuesArray(values: TxValuesArray, opts: TxOptions = {}) {
    if (values.length !== 8 && values.length !== 11) {
      throw new Error(
        'Invalid EIP-2930 transaction. Only expecting 8 values (for unsigned tx) or 11 values (for signed tx).'
      )
    }

    const [chainId, nonce, gasPrice, gasLimit, to, value, data, accessList, v, r, s] = values

    this._validateNotArray({ chainId, v })
    validateNoLeadingZeroes({ nonce, gasPrice, gasLimit, value, v, r, s })

    const emptyAccessList: AccessList = []

    return new AccessListEIP2930Transaction(
      {
        chainId: bytesToBigInt(chainId),
        nonce,
        gasPrice,
        gasLimit,
        to,
        value,
        data,
        accessList: accessList ?? emptyAccessList,
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
    super({ ...txData, type: TransactionType.AccessListEIP2930 }, opts)
    const { chainId, accessList, gasPrice } = txData

    this.common = this._getCommon(opts.common, chainId)
    this.chainId = this.common.chainId()

    // EIP-2718 check is done in Common
    if (!this.common.isActivatedEIP(2930)) {
      throw new Error('EIP-2930 not enabled on Common')
    }
    this.activeCapabilities = this.activeCapabilities.concat([2718, 2930])

    // Populate the access list fields
    const accessListData = AccessLists.getAccessListData(accessList ?? [])
    this.accessList = accessListData.accessList
    this.AccessListJSON = accessListData.AccessListJSON
    // Verify the access list format.
    AccessLists.verifyAccessList(this.accessList)

    this.gasPrice = bytesToBigInt(toBytes(gasPrice === '' ? '0x' : gasPrice))

    this._validateCannotExceedMaxInteger({
      gasPrice: this.gasPrice,
    })

    BaseTransaction._validateNotArray(txData)

    if (this.gasPrice * this.gasLimit > MAX_INTEGER) {
      const msg = this._errorMsg('gasLimit * gasPrice cannot exceed MAX_INTEGER')
      throw new Error(msg)
    }

    this._validateYParity()
    this._validateHighS()

    const freeze = opts?.freeze ?? true
    if (freeze) {
      Object.freeze(this)
    }
  }

  /**
   * The amount of gas paid for the data in this tx
   */
  getDataFee(): bigint {
    if (this.cache.dataFee && this.cache.dataFee.hardfork === this.common.hardfork()) {
      return this.cache.dataFee.value
    }

    let cost = super.getDataFee()
    cost += BigInt(AccessLists.getDataFeeEIP2930(this.accessList, this.common))

    if (Object.isFrozen(this)) {
      this.cache.dataFee = {
        value: cost,
        hardfork: this.common.hardfork(),
      }
    }

    return cost
  }

  /**
   * The up front amount that an account must have for this transaction to be valid
   */
  getUpfrontCost(): bigint {
    return this.gasLimit * this.gasPrice + this.value
  }

  /**
   * Returns a Uint8Array Array of the raw Bytess of the EIP-2930 transaction, in order.
   *
   * Format: `[chainId, nonce, gasPrice, gasLimit, to, value, data, accessList,
   * signatureYParity (v), signatureR (r), signatureS (s)]`
   *
   * Use {@link AccessListEIP2930Transaction.serialize} to add a transaction to a block
   * with {@link Block.fromValuesArray}.
   *
   * For an unsigned tx this method uses the empty Bytes values for the
   * signature parameters `v`, `r` and `s` for encoding. For an EIP-155 compliant
   * representation for external signing use {@link AccessListEIP2930Transaction.getMessageToSign}.
   */
  raw(): TxValuesArray {
    return [
      bigIntToUnpaddedBytes(this.chainId),
      bigIntToUnpaddedBytes(this.nonce),
      bigIntToUnpaddedBytes(this.gasPrice),
      bigIntToUnpaddedBytes(this.gasLimit),
      this.to !== undefined ? this.to.bytes : new Uint8Array(0),
      bigIntToUnpaddedBytes(this.value),
      this.data,
      this.accessList,
      this.v !== undefined ? bigIntToUnpaddedBytes(this.v) : new Uint8Array(0),
      this.r !== undefined ? bigIntToUnpaddedBytes(this.r) : new Uint8Array(0),
      this.s !== undefined ? bigIntToUnpaddedBytes(this.s) : new Uint8Array(0),
    ]
  }

  /**
   * Returns the serialized encoding of the EIP-2930 transaction.
   *
   * Format: `0x01 || rlp([chainId, nonce, gasPrice, gasLimit, to, value, data, accessList,
   * signatureYParity (v), signatureR (r), signatureS (s)])`
   *
   * Note that in contrast to the legacy tx serialization format this is not
   * valid RLP any more due to the raw tx type preceding and concatenated to
   * the RLP encoding of the values.
   */
  serialize(): Uint8Array {
    const base = this.raw()
    return concatBytes(TRANSACTION_TYPE_BYTES, RLP.encode(base))
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
    const base = this.raw().slice(0, 8)
    const message = concatBytes(TRANSACTION_TYPE_BYTES, RLP.encode(base))
    return message
  }

  /**
   * Returns the hashed serialized unsigned tx, which can be used
   * to sign the transaction (e.g. for sending to a hardware wallet).
   *
   * Note: in contrast to the legacy tx the raw message format is already
   * serialized and doesn't need to be RLP encoded any more.
   */
  getHashedMessageToSign(): Uint8Array {
    return keccak256(this.getMessageToSign())
  }

  /**
   * Computes a sha3-256 hash of the serialized tx.
   *
   * This method can only be used for signed txs (it throws otherwise).
   * Use {@link AccessListEIP2930Transaction.getMessageToSign} to get a tx hash for the purpose of signing.
   */
  public hash(): Uint8Array {
    if (!this.isSigned()) {
      const msg = this._errorMsg('Cannot call hash method if transaction is not signed')
      throw new Error(msg)
    }

    if (Object.isFrozen(this)) {
      if (!this.cache.hash) {
        this.cache.hash = keccak256(this.serialize())
      }
      return this.cache.hash
    }

    return keccak256(this.serialize())
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
    if (!this.isSigned()) {
      const msg = this._errorMsg('Cannot call this method if transaction is not signed')
      throw new Error(msg)
    }

    const msgHash = this.getMessageToVerifySignature()
    const { v, r, s } = this

    this._validateHighS()

    try {
      return ecrecover(
        msgHash,
        v! + BigInt(27), // Recover the 27 which was stripped from ecsign
        bigIntToUnpaddedBytes(r!),
        bigIntToUnpaddedBytes(s!)
      )
    } catch (e: any) {
      const msg = this._errorMsg('Invalid Signature')
      throw new Error(msg)
    }
  }

  protected _processSignature(v: bigint, r: Uint8Array, s: Uint8Array) {
    const opts = { ...this.txOptions, common: this.common }

    return AccessListEIP2930Transaction.fromTxData(
      {
        chainId: this.chainId,
        nonce: this.nonce,
        gasPrice: this.gasPrice,
        gasLimit: this.gasLimit,
        to: this.to,
        value: this.value,
        data: this.data,
        accessList: this.accessList,
        v: v - BigInt(27), // This looks extremely hacky: @ethereumjs/util actually adds 27 to the value, the recovery bit is either 0 or 1.
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
      gasPrice: bigIntToHex(this.gasPrice),
      accessList: accessListJSON,
    }
  }

  /**
   * Return a compact error string representation of the object
   */
  public errorStr() {
    let errorStr = this._getSharedErrorPostfix()
    // Keep ? for this.accessList since this otherwise causes Hardhat E2E tests to fail
    errorStr += ` gasPrice=${this.gasPrice} accessListCount=${this.accessList?.length ?? 0}`
    return errorStr
  }

  /**
   * Internal helper function to create an annotated error message
   *
   * @param msg Base error message
   * @hidden
   */
  protected _errorMsg(msg: string) {
    return `${msg} (${this.errorStr()})`
  }
}
