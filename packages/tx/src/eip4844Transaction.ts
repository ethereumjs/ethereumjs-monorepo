import { toHexString } from '@chainsafe/ssz'
import { Address } from '@ethereumjs/util'

import { FeeMarketEIP1559Transaction } from './eip1559Transaction'
import { BlobTransactionType } from './types'

import type {
  AccessListBuffer,
  AccessListBufferItem,
  BlobEip4844TxData,
  JsonTx,
  TxOptions,
} from './types'

const TRANSACTION_TYPE = 0x05
const TRANSACTION_TYPE_BUFFER = Buffer.from(TRANSACTION_TYPE.toString(16).padStart(2, '0'), 'hex')

export class BlobEIP4844Transaction extends FeeMarketEIP1559Transaction {
  private versionedHashes: Buffer[]

  constructor(txData: BlobEip4844TxData, opts?: TxOptions) {
    super({ ...txData, type: TRANSACTION_TYPE }, opts)
    this.versionedHashes = txData.versionedHashes
  }

  public static fromSerializedTx(serialized: Buffer, opts?: TxOptions): BlobEIP4844Transaction {
    const decodedTx = BlobTransactionType.deserialize(serialized)
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

  serialize(): Buffer {
    const to = {
      selector: this.to !== undefined ? 1 : 0,
      value: this.to?.toBuffer() ?? null,
    }
    const sszEncodedTx = BlobTransactionType.serialize({
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
    })
    return Buffer.concat([TRANSACTION_TYPE_BUFFER, sszEncodedTx])
  }

  getMessageToSign(hashMessage: false): Buffer | Buffer[]
  getMessageToSign(hashMessage?: true | undefined): Buffer
  getMessageToSign(_hashMessage?: unknown): Buffer | Buffer[] {
    throw new Error('Method not implemented.')
  }
  hash(): Buffer {
    throw new Error('Method not implemented.')
  }
  getMessageToVerifySignature(): Buffer {
    throw new Error('Method not implemented.')
  }
  getSenderPublicKey(): Buffer {
    throw new Error('Method not implemented.')
  }
  toJSON(): JsonTx {
    throw new Error('Method not implemented.')
  }
  _processSignature(_v: bigint, _r: Buffer, _s: Buffer): BlobEIP4844Transaction {
    throw new Error('Method not implemented.')
  }
  public errorStr(): string {
    throw new Error('Method not implemented.')
  }
  _errorMsg(_msg: string): string {
    throw new Error('Method not implemented.')
  }
}
