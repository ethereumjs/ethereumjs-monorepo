import { toHexString } from '@chainsafe/ssz'
import {
  Address,
  MAX_INTEGER,
  bigIntToUnpaddedBuffer,
  bufferToBigInt,
  ecrecover,
  toBuffer,
} from '@ethereumjs/util'
import { keccak256 } from 'ethereum-cryptography/keccak'

import { BaseTransaction } from './baseTransaction'
import {
  BLOB_COMMITMENT_VERSION_KZG,
  BlobTransactionType,
  LIMIT_BLOBS_PER_TX,
  SignedBlobTransactionType,
} from './types'
import { AccessLists, checkMaxInitCodeSize } from './util'

import type {
  AccessList,
  AccessListBuffer,
  AccessListBufferItem,
  BlobEIP4844TxData,
  JsonTx,
  TxOptions,
  TxValuesArray,
} from './types'
import type { Common } from '@ethereumjs/common'

const TRANSACTION_TYPE = 0x05
const TRANSACTION_TYPE_BUFFER = Buffer.from(TRANSACTION_TYPE.toString(16).padStart(2, '0'), 'hex')

export class BlobEIP4844Transaction extends BaseTransaction<BlobEIP4844Transaction> {
  public readonly chainId: bigint
  public readonly accessList: AccessListBuffer
  public readonly AccessListJSON: AccessList
  public readonly maxPriorityFeePerGas: bigint
  public readonly maxFeePerGas: bigint
  public readonly maxFeePerDataGas: bigint

  public readonly common: Common
  private versionedHashes: Buffer[]

  constructor(txData: BlobEIP4844TxData, opts: TxOptions = {}) {
    super({ ...txData, type: TRANSACTION_TYPE }, opts)
    const { chainId, accessList, maxFeePerGas, maxPriorityFeePerGas } = txData

    this.common = this._getCommon(opts.common, chainId)
    this.chainId = this.common.chainId()

    if (this.common.isActivatedEIP(1559) === false) {
      throw new Error('EIP-1559 not enabled on Common')
    }
    this.activeCapabilities = this.activeCapabilities.concat([1559, 2718, 2930])

    // Populate the access list fields
    const accessListData = AccessLists.getAccessListData(accessList ?? [])
    this.accessList = accessListData.accessList
    this.AccessListJSON = accessListData.AccessListJSON
    // Verify the access list format.
    AccessLists.verifyAccessList(this.accessList)

    this.maxFeePerGas = bufferToBigInt(toBuffer(maxFeePerGas === '' ? '0x' : maxFeePerGas))
    this.maxPriorityFeePerGas = bufferToBigInt(
      toBuffer(maxPriorityFeePerGas === '' ? '0x' : maxPriorityFeePerGas)
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

    this.maxFeePerDataGas = txData.maxFeePerDataGas

    this._validateYParity()
    this._validateHighS()

    if (this.common.isActivatedEIP(3860)) {
      checkMaxInitCodeSize(this.common, this.data.length)
    }

    for (const hash of txData.versionedHashes) {
      if (hash.length !== 32) {
        const msg = this._errorMsg('versioned hash is invalid length')
        throw new Error(msg)
      }
      if (hash[0] !== BLOB_COMMITMENT_VERSION_KZG) {
        const msg = this._errorMsg('versioned hash does not start with KZG commitment version')
        throw new Error(msg)
      }
    }
    if (txData.versionedHashes.length > LIMIT_BLOBS_PER_TX) {
      const msg = this._errorMsg(`tx can contain at most ${LIMIT_BLOBS_PER_TX} blobs`)
      throw new Error(msg)
    }

    this.versionedHashes = txData.versionedHashes

    const freeze = opts?.freeze ?? true
    if (freeze) {
      Object.freeze(this)
    }
  }

  public static fromTxData(txData: BlobEIP4844TxData, opts?: TxOptions) {
    return new BlobEIP4844Transaction(txData, opts)
  }

  public static fromSerializedTx(serialized: Buffer, opts?: TxOptions): BlobEIP4844Transaction {
    const decodedTx = BlobTransactionType.deserialize(serialized.slice(1))
    const versionedHashes = decodedTx.blobVersionedHash.map((el) => Buffer.from(el))
    const accessList: AccessListBuffer = []
    for (const listItem of decodedTx.accessList) {
      const address = Buffer.from(listItem.address)
      const storageKeys = listItem.storageKeys.map((key) => Buffer.from(key))
      const accessListItem: AccessListBufferItem = [address, storageKeys]
      accessList.push(accessListItem)
    }

    const to =
      decodedTx.to.value === null ? undefined : Address.fromString(toHexString(decodedTx.to.value))
    const txData = {
      ...decodedTx,
      ...{ versionedHashes, accessList, to },
    }
    return new BlobEIP4844Transaction(txData, opts)
  }

  getUpfrontCost(): bigint {
    throw new Error('Method not implemented.')
  }

  raw(): TxValuesArray {
    throw new Error('Method not implemented.')
  }

  /**
   * Serialize a blob transaction to the execution payload variant
   * @returns the minimum (execution payload) serialization of a transaction
   */
  serialize(): Buffer {
    const to = {
      selector: this.to !== undefined ? 1 : 0,
      value: this.to?.toBuffer() ?? null,
    }
    const sszEncodedTx = SignedBlobTransactionType.serialize({
      message: {
        chainId: this.common.chainId(),
        nonce: this.nonce,
        priorityFeePerGas: this.maxPriorityFeePerGas,
        maxFeePerGas: this.maxFeePerGas,
        gas: this.gasLimit,
        to,
        value: this.value,
        data: this.data,
        accessList: this.accessList.map((listItem) => {
          return { address: listItem[0], storageKeys: listItem[1] }
        }),
        blobVersionedHash: this.versionedHashes,
        maxFeePerDataGas: this.maxFeePerDataGas,
      },
      // TODO: Decide how to serialize an unsigned transaction
      signature: {
        r: this.r ?? BigInt(0),
        s: this.s ?? BigInt(0),
        yParity: this.v === BigInt(1) ? true : false,
      },
    })
    return Buffer.concat([TRANSACTION_TYPE_BUFFER, sszEncodedTx])
  }

  getMessageToSign(hashMessage: false): Buffer | Buffer[]
  getMessageToSign(hashMessage?: true | undefined): Buffer
  getMessageToSign(_hashMessage?: unknown): Buffer | Buffer[] {
    throw new Error('Method not implemented.')
  }

  hash(): Buffer {
    return Buffer.from(keccak256(this.serialize()))
  }
  getMessageToVerifySignature(): Buffer {
    throw new Error('Method not implemented.')
  }

  /**
   * Returns the public key of the sender
   */
  public getSenderPublicKey(): Buffer {
    if (!this.isSigned()) {
      const msg = this._errorMsg('Cannot call this method if transaction is not signed')
      throw new Error(msg)
    }

    const msgHash = this.hash()
    const { v, r, s } = this

    this._validateHighS()

    try {
      return ecrecover(
        msgHash,
        v! + BigInt(27), // Recover the 27 which was stripped from ecsign
        bigIntToUnpaddedBuffer(r!),
        bigIntToUnpaddedBuffer(s!)
      )
    } catch (e: any) {
      const msg = this._errorMsg('Invalid Signature')
      throw new Error(msg)
    }
  }

  toJSON(): JsonTx {
    throw new Error('Method not implemented.')
  }
  _processSignature(_v: bigint, _r: Buffer, _s: Buffer): BlobEIP4844Transaction {
    throw new Error('Method not implemented.')
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
    return `${msg} (${this.errorStr()})`
  }
}
