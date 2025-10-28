import {
  BIGINT_0,
  EthereumJSErrorWithoutCode,
  MAX_INTEGER,
  TypeOutput,
  bigIntToHex,
  bigIntToUnpaddedBytes,
  bytesToBigInt,
  bytesToInt,
  hexToBytes,
  intToUnpaddedBytes,
  toBytes,
  toType,
} from '@ethereumjs/util'

import * as EIP1559 from '../capabilities/eip1559.ts'
import * as EIP2718 from '../capabilities/eip2718.ts'
import * as EIP2930 from '../capabilities/eip2930.ts'
import * as Legacy from '../capabilities/legacy.ts'
import { TransactionType, isAccessList } from '../types.ts'
import { accessListBytesToJSON, accessListJSONToBytes } from '../util/access.ts'
import {
  getBaseJSON,
  sharedConstructor,
  validateNotArray,
  valueOverflowCheck,
} from '../util/internal.ts'

import { createBlob4844Tx } from './constructors.ts'

import type { Common } from '@ethereumjs/common'
import type { Address, PrefixedHexString } from '@ethereumjs/util'
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

export type TxData = AllTypesTxData[typeof TransactionType.BlobEIP4844]
export type TxValuesArray = AllTypesTxValuesArray[typeof TransactionType.BlobEIP4844]

export const NetworkWrapperType = {
  EIP4844: 0,
  EIP7594: 1,
} as const
export type NetworkWrapperType = (typeof NetworkWrapperType)[keyof typeof NetworkWrapperType]

/**
 * Typed transaction with a new gas fee market mechanism for transactions that include "blobs" of data
 *
 * - TransactionType: 3
 * - EIP: [EIP-4844](https://eips.ethereum.org/EIPS/eip-4844)
 *
 * This tx type has two "modes": the plain canonical format only contains `blobVersionedHashes`.
 * If blobs are passed in the tx automatically switches to "Network Wrapper" format and the
 * `networkWrapperVersion` will be set or validated.
 */
export class Blob4844Tx implements TransactionInterface<typeof TransactionType.BlobEIP4844> {
  public type = TransactionType.BlobEIP4844 // 4844 tx type

  // Tx data part (part of the RLP)
  public readonly nonce!: bigint
  public readonly gasLimit!: bigint
  public readonly value!: bigint
  public readonly data!: Uint8Array
  public readonly to?: Address
  public readonly accessList: AccessListBytes
  public readonly chainId: bigint
  public readonly maxPriorityFeePerGas: bigint
  public readonly maxFeePerGas: bigint
  public readonly maxFeePerBlobGas: bigint
  public blobVersionedHashes: PrefixedHexString[]

  // Props only for signed txs
  public readonly v?: bigint
  public readonly r?: bigint
  public readonly s?: bigint
  // End of Tx data part

  /**
   * This property is set if the tx is in "Network Wrapper" format.
   *
   * Possible values:
   * - 0 (EIP-4844)
   * - 1 (EIP-4844 + EIP-7594)
   */
  networkWrapperVersion?: NetworkWrapperType

  // "Network Wrapper" Format
  blobs?: PrefixedHexString[] // EIP-4844 + EIP-7594
  kzgCommitments?: PrefixedHexString[] // EIP-4844 + EIP-7594
  kzgProofs?: PrefixedHexString[] // EIP-4844: per-Blob proofs, EIP-7594: per-Cell proofs

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
   * the static constructors or factory methods to assist in creating a Transaction object from
   * varying data types.
   */
  constructor(txData: TxData, opts: TxOptions = {}) {
    sharedConstructor(this, { ...txData, type: TransactionType.BlobEIP4844 }, opts)
    const {
      chainId,
      accessList: rawAccessList,
      maxFeePerGas,
      maxPriorityFeePerGas,
      maxFeePerBlobGas,
    } = txData
    const accessList = rawAccessList ?? []

    if (chainId !== undefined && bytesToBigInt(toBytes(chainId)) !== this.common.chainId()) {
      throw EthereumJSErrorWithoutCode(
        `Common chain ID ${this.common.chainId} not matching the derived chain ID ${chainId}`,
      )
    }
    this.chainId = this.common.chainId()

    if (!this.common.isActivatedEIP(1559)) {
      throw EthereumJSErrorWithoutCode('EIP-1559 not enabled on Common')
    }

    if (!this.common.isActivatedEIP(4844)) {
      throw EthereumJSErrorWithoutCode('EIP-4844 not enabled on Common')
    }
    this.activeCapabilities = this.activeCapabilities.concat([1559, 2718, 2930])

    // Populate the access list fields
    this.accessList = isAccessList(accessList) ? accessListJSONToBytes(accessList) : accessList
    // Verify the access list format.
    EIP2930.verifyAccessList(this)

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

    this.maxFeePerBlobGas = bytesToBigInt(
      toBytes((maxFeePerBlobGas ?? '') === '' ? '0x' : maxFeePerBlobGas),
    )

    this.blobVersionedHashes = (txData.blobVersionedHashes ?? []).map((vh) =>
      toType(vh, TypeOutput.PrefixedHexString),
    )
    EIP2718.validateYParity(this)
    Legacy.validateHighS(this)

    for (const hash of this.blobVersionedHashes) {
      if (hash.length !== 66) {
        // 66 is the length of a 32 byte hash as a PrefixedHexString
        const msg = Legacy.errorMsg(this, 'versioned hash is invalid length')
        throw EthereumJSErrorWithoutCode(msg)
      }
      if (BigInt(parseInt(hash.slice(2, 4))) !== this.common.param('blobCommitmentVersionKzg')) {
        // We check the first "byte" of the hash (starts at position 2 since hash is a PrefixedHexString)
        const msg = Legacy.errorMsg(
          this,
          'versioned hash does not start with KZG commitment version',
        )
        throw EthereumJSErrorWithoutCode(msg)
      }
    }

    // EIP-7594 PeerDAS: Limit of 6 blobs per transaction
    if (this.common.isActivatedEIP(7594)) {
      const maxBlobsPerTx = this.common.param('maxBlobsPerTx')
      if (this.blobVersionedHashes.length > maxBlobsPerTx) {
        const msg = Legacy.errorMsg(
          this,
          `tx can contain at most ${maxBlobsPerTx} blobs (EIP-7594)`,
        )
        throw EthereumJSErrorWithoutCode(msg)
      }
    }

    // "Old" limit (superseded by EIP-7594 starting with Osaka)
    const limitBlobsPerTx =
      this.common.param('maxBlobGasPerBlock') / this.common.param('blobGasPerBlob')
    if (this.blobVersionedHashes.length > limitBlobsPerTx) {
      const msg = Legacy.errorMsg(
        this,
        `tx can contain at most ${limitBlobsPerTx} blobs (maxBlobGasPerBlock/blobGasPerBlob)`,
      )
      throw EthereumJSErrorWithoutCode(msg)
    } else if (this.blobVersionedHashes.length === 0) {
      const msg = Legacy.errorMsg(this, `tx should contain at least one blob`)
      throw EthereumJSErrorWithoutCode(msg)
    }

    if (this.to === undefined) {
      const msg = Legacy.errorMsg(
        this,
        `tx should have a "to" field and cannot be used to create contracts`,
      )
      throw EthereumJSErrorWithoutCode(msg)
    }

    this.networkWrapperVersion =
      txData.networkWrapperVersion !== undefined
        ? (bytesToInt(toBytes(txData.networkWrapperVersion)) as NetworkWrapperType)
        : undefined

    if (this.networkWrapperVersion !== undefined) {
      switch (this.networkWrapperVersion) {
        case NetworkWrapperType.EIP7594:
          if (!this.common.isActivatedEIP(7594)) {
            throw EthereumJSErrorWithoutCode(
              'EIP-7594 not enabled on Common for EIP-7594 network wrapper version',
            )
          }
          break

        case NetworkWrapperType.EIP4844:
          if (this.common.isActivatedEIP(7594)) {
            throw EthereumJSErrorWithoutCode(
              'EIP-7594 is active on Common for EIP-4844 network wrapper version',
            )
          }
          break

        default:
          throw EthereumJSErrorWithoutCode(
            `Invalid networkWrapperVersion=${this.networkWrapperVersion}`,
          )
      }
    }

    this.blobs = txData.blobs?.map((blob) => toType(blob, TypeOutput.PrefixedHexString))

    if (this.networkWrapperVersion === undefined && this.blobs !== undefined) {
      if (this.common.isActivatedEIP(7594)) {
        this.networkWrapperVersion = 1
      } else {
        this.networkWrapperVersion = 0
      }
    }
    if (this.networkWrapperVersion !== undefined && this.blobs === undefined) {
      const msg = Legacy.errorMsg(
        this,
        'tx is not allowed to be in network wrapper format if no blob list is provided',
      )
      throw EthereumJSErrorWithoutCode(msg)
    }

    this.kzgCommitments = txData.kzgCommitments?.map((commitment) =>
      toType(commitment, TypeOutput.PrefixedHexString),
    )
    this.kzgProofs = txData.kzgProofs?.map((proof) => toType(proof, TypeOutput.PrefixedHexString))

    if (this.blobs !== undefined) {
      if (this.kzgCommitments === undefined) {
        const msg = Legacy.errorMsg(this, 'kzgCommitments are mandatory if blobs are provided')
        throw EthereumJSErrorWithoutCode(msg)
      }
      if (this.kzgProofs === undefined) {
        const msg = Legacy.errorMsg(this, 'kzgProofs are mandatory if blobs are provided')
        throw EthereumJSErrorWithoutCode(msg)
      }
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
   * Blob4844Tx cannot create contracts
   */
  toCreationAddress(): never {
    throw EthereumJSErrorWithoutCode('Blob4844Tx cannot create contracts')
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

  /**
   * Returns a Uint8Array Array of the raw Bytes of the EIP-4844 transaction, in order.
   *
   * Format: [chain_id, nonce, max_priority_fee_per_gas, max_fee_per_gas, gas_limit, to, value, data,
   * access_list, max_fee_per_data_gas, blob_versioned_hashes, y_parity, r, s]`.
   *
   * Use {@link Blob4844Tx.serialize} to add a transaction to a block
   * with {@link createBlockFromBytesArray}.
   *
   * For an unsigned tx this method uses the empty Bytes values for the
   * signature parameters `v`, `r` and `s` for encoding. For an EIP-155 compliant
   * representation for external signing use {@link Blob4844Tx.getMessageToSign}.
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
      this.blobVersionedHashes.map((hash) => hexToBytes(hash)),
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
   * @returns the serialized form of a blob transaction in the network wrapper format
   * This format is used for gossipping mempool transactions over devp2p or when
   * submitting a transaction via RPC.
   */
  serializeNetworkWrapper(): Uint8Array {
    if (
      this.networkWrapperVersion === undefined ||
      this.blobs === undefined ||
      this.kzgCommitments === undefined ||
      this.kzgProofs === undefined
    ) {
      throw EthereumJSErrorWithoutCode(
        'cannot serialize network wrapper without networkWrapperVersion, blobs, KZG commitments and KZG proofs provided',
      )
    }

    const networkSerialized =
      this.networkWrapperVersion === NetworkWrapperType.EIP4844
        ? EIP2718.serialize(this, [this.raw(), this.blobs, this.kzgCommitments, this.kzgProofs])
        : EIP2718.serialize(this, [
            this.raw(),
            intToUnpaddedBytes(this.networkWrapperVersion),
            this.blobs,
            this.kzgCommitments,
            this.kzgProofs,
          ])

    return networkSerialized
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
   * Use {@link Blob4844Tx.getMessageToSign} to get a tx hash for the purpose of signing.
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

  toJSON(): JSONTx {
    const accessListJSON = accessListBytesToJSON(this.accessList)
    const baseJSON = getBaseJSON(this)

    return {
      ...baseJSON,
      chainId: bigIntToHex(this.chainId),
      maxPriorityFeePerGas: bigIntToHex(this.maxPriorityFeePerGas),
      maxFeePerGas: bigIntToHex(this.maxFeePerGas),
      accessList: accessListJSON,
      maxFeePerBlobGas: bigIntToHex(this.maxFeePerBlobGas),
      blobVersionedHashes: this.blobVersionedHashes,
    }
  }

  addSignature(v: bigint, r: Uint8Array | bigint, s: Uint8Array | bigint): Blob4844Tx {
    r = toBytes(r)
    s = toBytes(s)
    const opts = { ...this.txOptions, common: this.common }

    return createBlob4844Tx(
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
        v,
        r: bytesToBigInt(r),
        s: bytesToBigInt(s),
        maxFeePerBlobGas: this.maxFeePerBlobGas,
        networkWrapperVersion: this.networkWrapperVersion,
        blobVersionedHashes: this.blobVersionedHashes,
        blobs: this.blobs,
        kzgCommitments: this.kzgCommitments,
        kzgProofs: this.kzgProofs,
      },
      opts,
    )
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

  sign(privateKey: Uint8Array, extraEntropy: Uint8Array | boolean = false): Blob4844Tx {
    return Legacy.sign(this, privateKey, extraEntropy) as Blob4844Tx
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

  /**
   * @returns the number of blobs included with this transaction
   */
  public numBlobs(): number {
    return this.blobVersionedHashes.length
  }
}
