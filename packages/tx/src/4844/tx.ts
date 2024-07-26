import {
  BIGINT_0,
  BIGINT_27,
  MAX_INTEGER,
  bigIntToHex,
  bigIntToUnpaddedBytes,
  bytesToBigInt,
  bytesToHex,
  toBytes,
} from '@ethereumjs/util'

import { BaseTransaction } from '../baseTransaction.js'
import * as EIP1559 from '../capabilities/eip1559.js'
import * as EIP2718 from '../capabilities/eip2718.js'
import * as EIP2930 from '../capabilities/eip2930.js'
import * as Legacy from '../capabilities/legacy.js'
import { LIMIT_BLOBS_PER_TX } from '../constants.js'
import { paramsTx } from '../index.js'
import { TransactionType } from '../types.js'
import { AccessLists, validateNotArray } from '../util.js'

import { create4844BlobTx } from './constructors.js'

import type {
  AccessList,
  AccessListBytes,
  TxData as AllTypesTxData,
  TxValuesArray as AllTypesTxValuesArray,
  JsonTx,
  TxOptions,
} from '../types.js'
import type { Common } from '@ethereumjs/common'

export type TxData = AllTypesTxData[TransactionType.BlobEIP4844]
export type TxValuesArray = AllTypesTxValuesArray[TransactionType.BlobEIP4844]

/**
 * Typed transaction with a new gas fee market mechanism for transactions that include "blobs" of data
 *
 * - TransactionType: 3
 * - EIP: [EIP-4844](https://eips.ethereum.org/EIPS/eip-4844)
 */
export class BlobEIP4844Transaction extends BaseTransaction<TransactionType.BlobEIP4844> {
  public readonly chainId: bigint
  public readonly accessList: AccessListBytes
  public readonly AccessListJSON: AccessList
  public readonly maxPriorityFeePerGas: bigint
  public readonly maxFeePerGas: bigint
  public readonly maxFeePerBlobGas: bigint

  public readonly common: Common
  public blobVersionedHashes: Uint8Array[]
  blobs?: Uint8Array[] // This property should only be populated when the transaction is in the "Network Wrapper" format
  kzgCommitments?: Uint8Array[] // This property should only be populated when the transaction is in the "Network Wrapper" format
  kzgProofs?: Uint8Array[] // This property should only be populated when the transaction is in the "Network Wrapper" format

  /**
   * This constructor takes the values, validates them, assigns them and freezes the object.
   *
   * It is not recommended to use this constructor directly. Instead use
   * the static constructors or factory methods to assist in creating a Transaction object from
   * varying data types.
   */
  constructor(txData: TxData, opts: TxOptions = {}) {
    super({ ...txData, type: TransactionType.BlobEIP4844 }, opts)
    const { chainId, accessList, maxFeePerGas, maxPriorityFeePerGas, maxFeePerBlobGas } = txData

    this.common = this._getCommon(opts.common, chainId)
    this.common.updateParams(opts.params ?? paramsTx)
    this.chainId = this.common.chainId()

    if (!this.common.isActivatedEIP(1559)) {
      throw new Error('EIP-1559 not enabled on Common')
    }

    if (!this.common.isActivatedEIP(4844)) {
      throw new Error('EIP-4844 not enabled on Common')
    }
    this.activeCapabilities = this.activeCapabilities.concat([1559, 2718, 2930])

    // Populate the access list fields
    const accessListData = AccessLists.getAccessListData(accessList ?? [])
    this.accessList = accessListData.accessList
    this.AccessListJSON = accessListData.AccessListJSON
    // Verify the access list format.
    AccessLists.verifyAccessList(this.accessList)

    this.maxFeePerGas = bytesToBigInt(toBytes(maxFeePerGas))
    this.maxPriorityFeePerGas = bytesToBigInt(toBytes(maxPriorityFeePerGas))

    this._validateCannotExceedMaxInteger({
      maxFeePerGas: this.maxFeePerGas,
      maxPriorityFeePerGas: this.maxPriorityFeePerGas,
    })

    validateNotArray(txData)

    if (this.gasLimit * this.maxFeePerGas > MAX_INTEGER) {
      const msg = this._errorMsg('gasLimit * maxFeePerGas cannot exceed MAX_INTEGER (2^256-1)')
      throw new Error(msg)
    }

    if (this.maxFeePerGas < this.maxPriorityFeePerGas) {
      const msg = this._errorMsg(
        'maxFeePerGas cannot be less than maxPriorityFeePerGas (The total must be the larger of the two)',
      )
      throw new Error(msg)
    }

    this.maxFeePerBlobGas = bytesToBigInt(
      toBytes((maxFeePerBlobGas ?? '') === '' ? '0x' : maxFeePerBlobGas),
    )

    this.blobVersionedHashes = (txData.blobVersionedHashes ?? []).map((vh) => toBytes(vh))
    EIP2718.validateYParity(this)
    Legacy.validateHighS(this)

    for (const hash of this.blobVersionedHashes) {
      if (hash.length !== 32) {
        const msg = this._errorMsg('versioned hash is invalid length')
        throw new Error(msg)
      }
      if (BigInt(hash[0]) !== this.common.param('blobCommitmentVersionKzg')) {
        const msg = this._errorMsg('versioned hash does not start with KZG commitment version')
        throw new Error(msg)
      }
    }
    if (this.blobVersionedHashes.length > LIMIT_BLOBS_PER_TX) {
      const msg = this._errorMsg(`tx can contain at most ${LIMIT_BLOBS_PER_TX} blobs`)
      throw new Error(msg)
    } else if (this.blobVersionedHashes.length === 0) {
      const msg = this._errorMsg(`tx should contain at least one blob`)
      throw new Error(msg)
    }
    if (this.to === undefined) {
      const msg = this._errorMsg(
        `tx should have a "to" field and cannot be used to create contracts`,
      )
      throw new Error(msg)
    }

    this.blobs = txData.blobs?.map((blob) => toBytes(blob))
    this.kzgCommitments = txData.kzgCommitments?.map((commitment) => toBytes(commitment))
    this.kzgProofs = txData.kzgProofs?.map((proof) => toBytes(proof))
    const freeze = opts?.freeze ?? true
    if (freeze) {
      Object.freeze(this)
    }
  }

  /**
   * Returns the minimum of calculated priority fee (from maxFeePerGas and baseFee) and maxPriorityFeePerGas
   * @param baseFee Base fee retrieved from block
   */
  getEffectivePriorityFee(baseFee: bigint): bigint {
    return EIP1559.getEffectivePriorityFee(this, baseFee)
  }

  /**
   * The amount of gas paid for the data in this tx
   */
  getDataGas(): bigint {
    return EIP2930.getDataGas(this)
  }

  /**
   * The up front amount that an account must have for this transaction to be valid
   * @param baseFee The base fee of the block (will be set to 0 if not provided)
   */
  getUpfrontCost(baseFee: bigint = BIGINT_0): bigint {
    return EIP1559.getUpfrontCost(this, baseFee)
  }

  /**
   * Returns a Uint8Array Array of the raw Bytes of the EIP-4844 transaction, in order.
   *
   * Format: [chain_id, nonce, max_priority_fee_per_gas, max_fee_per_gas, gas_limit, to, value, data,
   * access_list, max_fee_per_data_gas, blob_versioned_hashes, y_parity, r, s]`.
   *
   * Use {@link BlobEIP4844Transaction.serialize} to add a transaction to a block
   * with {@link createBlockFromValuesArray}.
   *
   * For an unsigned tx this method uses the empty Bytes values for the
   * signature parameters `v`, `r` and `s` for encoding. For an EIP-155 compliant
   * representation for external signing use {@link BlobEIP4844Transaction.getMessageToSign}.
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
      bigIntToUnpaddedBytes(this.maxFeePerBlobGas),
      this.blobVersionedHashes,
      this.v !== undefined ? bigIntToUnpaddedBytes(this.v) : new Uint8Array(0),
      this.r !== undefined ? bigIntToUnpaddedBytes(this.r) : new Uint8Array(0),
      this.s !== undefined ? bigIntToUnpaddedBytes(this.s) : new Uint8Array(0),
    ]
  }

  /**
   * Returns the serialized encoding of the EIP-4844 transaction.
   *
   * Format: `0x03 || rlp([chainId, nonce, maxPriorityFeePerGas, maxFeePerGas, gasLimit, to, value, data,
   * access_list, max_fee_per_data_gas, blob_versioned_hashes, y_parity, r, s])`.
   *
   * Note that in contrast to the legacy tx serialization format this is not
   * valid RLP any more due to the raw tx type preceding and concatenated to
   * the RLP encoding of the values.
   */
  serialize(): Uint8Array {
    return EIP2718.serialize(this)
  }

  /**
   * @returns the serialized form of a blob transaction in the network wrapper format (used for gossipping mempool transactions over devp2p)
   */
  serializeNetworkWrapper(): Uint8Array {
    if (
      this.blobs === undefined ||
      this.kzgCommitments === undefined ||
      this.kzgProofs === undefined
    ) {
      throw new Error(
        'cannot serialize network wrapper without blobs, KZG commitments and KZG proofs provided',
      )
    }

    return EIP2718.serialize(this, [this.raw(), this.blobs, this.kzgCommitments, this.kzgProofs])
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
    return EIP2718.serialize(this, this.raw().slice(0, 11))
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
   * Use {@link BlobEIP4844Transaction.getMessageToSign} to get a tx hash for the purpose of signing.
   */
  public hash(): Uint8Array {
    return Legacy.hash(this)
  }

  getMessageToVerifySignature(): Uint8Array {
    return this.getHashedMessageToSign()
  }

  /**
   * Returns the public key of the sender
   */
  public getSenderPublicKey(): Uint8Array {
    return Legacy.getSenderPublicKey(this)
  }

  toJSON(): JsonTx {
    const accessListJSON = AccessLists.getAccessListJSON(this.accessList)
    const baseJson = super.toJSON()

    return {
      ...baseJson,
      chainId: bigIntToHex(this.chainId),
      maxPriorityFeePerGas: bigIntToHex(this.maxPriorityFeePerGas),
      maxFeePerGas: bigIntToHex(this.maxFeePerGas),
      accessList: accessListJSON,
      maxFeePerBlobGas: bigIntToHex(this.maxFeePerBlobGas),
      blobVersionedHashes: this.blobVersionedHashes.map((hash) => bytesToHex(hash)),
    }
  }

  addSignature(
    v: bigint,
    r: Uint8Array | bigint,
    s: Uint8Array | bigint,
    convertV: boolean = false,
  ): BlobEIP4844Transaction {
    r = toBytes(r)
    s = toBytes(s)
    const opts = { ...this.txOptions, common: this.common }

    return create4844BlobTx(
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
        v: convertV ? v - BIGINT_27 : v, // This looks extremely hacky: @ethereumjs/util actually adds 27 to the value, the recovery bit is either 0 or 1.
        r: bytesToBigInt(r),
        s: bytesToBigInt(s),
        maxFeePerBlobGas: this.maxFeePerBlobGas,
        blobVersionedHashes: this.blobVersionedHashes,
        blobs: this.blobs,
        kzgCommitments: this.kzgCommitments,
        kzgProofs: this.kzgProofs,
      },
      opts,
    )
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

  /**
   * @returns the number of blobs included with this transaction
   */
  public numBlobs(): number {
    return this.blobVersionedHashes.length
  }
}
