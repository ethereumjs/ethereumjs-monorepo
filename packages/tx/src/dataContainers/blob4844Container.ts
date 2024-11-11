import { RLP } from '@ethereumjs/rlp'
import { Address, TypeOutput, bytesToBigInt, toBytes, toType } from '@ethereumjs/util'

import { Feature } from '../dataContainerTypes.js'
import { TransactionType } from '../types.js'
import { AccessLists } from '../util.js'

import type {
  AccessList2930Interface,
  BlobInterface,
  DefaultContainerInterface,
  ECDSAMaybeSignedInterface,
  ECDSASignedInterface,
  FeeMarketInterface,
  ToInterface,
  TxConstructorFields,
  TxContainerMethods,
} from '../dataContainerTypes.js'
import type { AccessListBytes, TxOptions } from '../types.js'
import type { PrefixedHexString } from '@ethereumjs/util'

type TxType = TransactionType.BlobEIP4844

const feeMarketFeatures = new Set<Feature>([
  Feature.ECDSASignable,
  Feature.FeeMarket,
  Feature.AccessLists,
  Feature.Blobs,
])

export class Blob4844Container
  implements
    TxContainerMethods,
    DefaultContainerInterface,
    ToInterface,
    FeeMarketInterface,
    ECDSAMaybeSignedInterface,
    AccessList2930Interface,
    BlobInterface
{
  public type: number = TransactionType.BlobEIP4844 // Legacy tx type

  // Tx data part (part of the RLP)
  public readonly maxFeePerGas: bigint
  public readonly maxPriorityFeePerGas: bigint
  public readonly maxFeePerBlobGas: bigint
  public readonly nonce: bigint
  public readonly gasLimit: bigint
  public readonly value: bigint
  public readonly data: Uint8Array
  public readonly to: Address
  public readonly accessList: AccessListBytes
  public readonly chainId: bigint
  public readonly blobVersionedHashes: PrefixedHexString[]

  // Props only for signed txs
  public readonly v?: bigint
  public readonly r?: bigint
  public readonly s?: bigint

  // Blob related properties

  public readonly blobs?: PrefixedHexString[] // This property should only be populated when the transaction is in the "Network Wrapper" format
  public readonly kzgCommitments?: PrefixedHexString[] // This property should only be populated when the transaction is in the "Network Wrapper" format
  public readonly kzgProofs?: PrefixedHexString[] // This property should only be populated when the transaction is in the "Network Wrapper" format

  constructor(txData: TxConstructorFields[TxType], txOptions: TxOptions) {
    const {
      nonce,
      gasLimit,
      to,
      value,
      data,
      v,
      r,
      s,
      maxPriorityFeePerGas,
      maxFeePerGas,
      maxFeePerBlobGas,
    } = txData

    // Set the tx properties
    const toB = toBytes(to)
    if (toB.length === 0) {
      // TODO: better check
      throw new Error('The to: field should be defined')
    }
    this.to = new Address(toB)

    this.nonce = bytesToBigInt(toBytes(nonce))
    this.gasLimit = bytesToBigInt(toBytes(gasLimit))
    this.value = bytesToBigInt(toBytes(value))
    this.data = toBytes(data === '' ? '0x' : data)
    this.maxFeePerGas = bytesToBigInt(toBytes(maxFeePerGas))
    this.maxPriorityFeePerGas = bytesToBigInt(toBytes(maxPriorityFeePerGas))

    // Set signature values (if the tx is signed)

    const vB = toBytes(v)
    const rB = toBytes(r)
    const sB = toBytes(s)
    this.v = vB.length > 0 ? bytesToBigInt(vB) : undefined
    this.r = rB.length > 0 ? bytesToBigInt(rB) : undefined
    this.s = sB.length > 0 ? bytesToBigInt(sB) : undefined

    const { chainId, accessList } = txData

    // NOTE: previously there was a check against common's chainId, this is not here
    // Common is not available in the tx container
    // Likely, we should now check this chain id when signing the tx (to prevent people signing on the wrong chain)
    this.chainId = bytesToBigInt(toBytes(chainId))

    const accessListData = AccessLists.getAccessListData(accessList ?? [])
    this.accessList = accessListData.accessList

    // Blob related stuff here
    this.maxFeePerBlobGas = bytesToBigInt(
      toBytes((maxFeePerBlobGas ?? '') === '' ? '0x' : maxFeePerBlobGas),
    )

    this.blobVersionedHashes = (txData.blobVersionedHashes ?? []).map((vh) =>
      toType(vh, TypeOutput.PrefixedHexString),
    )

    /* Validation, should be done elsewhere
      for (const hash of this.blobVersionedHashes) {
        if (hash.length !== 66) {
          // 66 is the length of a 32 byte hash as a PrefixedHexString
          const msg = Legacy.errorMsg(this, 'versioned hash is invalid length')
          throw new Error(msg)
        }
        if (BigInt(parseInt(hash.slice(2, 4))) !== this.common.param('blobCommitmentVersionKzg')) {
          // We check the first "byte" of the hash (starts at position 2 since hash is a PrefixedHexString)
          const msg = Legacy.errorMsg(
            this,
            'versioned hash does not start with KZG commitment version',
          )
          throw new Error(msg)
        }
      }
      if (this.blobVersionedHashes.length > LIMIT_BLOBS_PER_TX) {
        const msg = Legacy.errorMsg(this, `tx can contain at most ${LIMIT_BLOBS_PER_TX} blobs`)
        throw new Error(msg)
      } else if (this.blobVersionedHashes.length === 0) {
        const msg = Legacy.errorMsg(this, `tx should contain at least one blob`)
        throw new Error(msg)
      }
      if (this.to === undefined) {
        const msg = Legacy.errorMsg(
          this,
          `tx should have a "to" field and cannot be used to create contracts`,
        )
        throw new Error(msg)
      } */

    this.blobs = txData.blobs?.map((blob) => toType(blob, TypeOutput.PrefixedHexString))
    this.kzgCommitments = txData.kzgCommitments?.map((commitment) =>
      toType(commitment, TypeOutput.PrefixedHexString),
    )
    this.kzgProofs = txData.kzgProofs?.map((proof) => toType(proof, TypeOutput.PrefixedHexString))
  }

  raw() {
    // TODO
    return [new Uint8Array(), new Uint8Array()]
  }
  serialize() {
    return RLP.encode(this.raw())
  }

  supports(feature: Feature) {
    return feeMarketFeatures.has(feature)
  }

  toJSON() {
    return {}
  }

  // TODO likely add common here: should check against the chain id in this container to prevent
  // signing against the wrong chain id
  sign(privateKey: Uint8Array): Blob4844Container & ECDSASignedInterface {
    // TODO
    return this as Blob4844Container & ECDSASignedInterface // Type return value to have v/r/s set
  }
}
