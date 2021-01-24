import Common from '@ethereumjs/common'
import { Address, BN, ecsign, rlp, rlphash, toBuffer } from 'ethereumjs-util'
import { default as SignedEIP2930Transaction } from './signedEIP2930Transaction'
import { DEFAULT_COMMON, EIP2930TxData, TxOptions } from './types'

export default class UnsignedEIP2930Transaction {
  public readonly common: Common
  public readonly chainId: BN
  public readonly nonce: BN
  public readonly gasLimit: BN
  public readonly gasPrice: BN
  public readonly to?: Address
  public readonly value: BN
  public readonly data: Buffer
  public readonly accessList: any
  public readonly yParity?: number
  public readonly r?: BN
  public readonly s?: BN

  get senderS() {
    return this.s
  }

  get senderR() {
    return this.r
  }

  public static fromTxData(txData: EIP2930TxData, opts?: TxOptions) {
    if (txData.yParity && txData.r && txData.s) {
      return SignedEIP2930Transaction.fromTxData(txData, opts ?? {})
    } else {
      return new UnsignedEIP2930Transaction(txData, opts ?? {})
    }
  }

  // Instantiate a transaction from the raw RLP serialized tx. This means that the RLP should start with 0x01.
  public static fromRlpSerializedTx(serialized: Buffer, opts?: TxOptions) {
    if (serialized[0] !== 1) {
      throw 'This is not an EIP-2930 transaction'
    }

    const values = rlp.decode(serialized)

    if (!Array.isArray(values)) {
      throw new Error('Invalid serialized tx input. Must be array')
    }

    return UnsignedEIP2930Transaction.fromValuesArray(values, opts)
  }

  // Create a transaction from a values array.
  // The format is: chainId, nonce, gasPrice, gasLimit, to, value, data, access_list, [yParity, senderR, senderS]
  public static fromValuesArray(values: Buffer[], opts?: TxOptions) {
    if (values.length == 8) {
      const [chainId, nonce, gasPrice, gasLimit, to, value, data, accessList] = values
      const emptyBuffer = Buffer.from([])

      return new UnsignedEIP2930Transaction(
        {
          chainId: new BN(chainId),
          nonce: new BN(nonce),
          gasPrice: new BN(gasPrice),
          gasLimit: new BN(gasLimit),
          to: to && to.length > 0 ? new Address(to) : undefined,
          value: new BN(value),
          data: data ?? emptyBuffer,
          accessList: accessList ?? emptyBuffer,
        },
        opts ?? {}
      )
    } else if (values.length == 11) {
      return SignedEIP2930Transaction.fromValuesArray(values, opts)
    } else {
      throw new Error(
        'Invalid EIP-2930 transaction. Only expecting 8 values (for unsigned tx) or 11 values (for signed tx).'
      )
    }
  }

  protected constructor(txData: EIP2930TxData, opts: TxOptions) {
    this.common = opts.common ?? DEFAULT_COMMON

    const {
      chainId,
      nonce,
      gasPrice,
      gasLimit,
      to,
      value,
      data,
      accessList,
      yParity,
      r,
      s,
    } = txData

    if (!this.common.eips().includes(2718)) {
      throw new Error('EIP-2718 not enabled on Common')
    } else if (!this.common.eips().includes(2930)) {
      throw new Error('EIP-2930 not enabled on Common')
    }

    if (txData.chainId?.eqn(this.common.chainId())) {
      throw new Error('The chain ID does not match the chain ID of Common')
    }

    this.chainId = new BN(toBuffer(chainId))
    this.nonce = new BN(toBuffer(nonce))
    this.gasPrice = new BN(toBuffer(gasPrice))
    this.gasLimit = new BN(toBuffer(gasLimit))
    this.to = to ? new Address(toBuffer(to)) : undefined
    this.value = new BN(toBuffer(value))
    this.data = toBuffer(data)
    this.accessList = accessList ?? []
    this.yParity = yParity ?? 0
    this.r = r ? new BN(toBuffer(r)) : undefined
    this.s = s ? new BN(toBuffer(s)) : undefined

    // Verify the access list format.
    for (let key = 0; key < this.accessList.length; key++) {
      const accessListItem = this.accessList[key]
      const address: Buffer = accessListItem[0]
      const storageSlots: Buffer[] = accessListItem[1]
      if (address.length != 20) {
        throw new Error('Invalid EIP-2930 transaction: address length should be 20 bytes')
      }
      for (let storageSlot = 0; storageSlot < storageSlots.length; storageSlot++) {
        if (storageSlots[storageSlot].length != 32) {
          throw new Error('Invalid EIP-2930 transaction: storage slot length should be 32 bytes')
        }
      }
    }

    const freeze = opts?.freeze ?? true
    if (freeze) {
      Object.freeze(this)
    }
  }

  /**
   * If the tx's `to` is to the creation address
   */
  toCreationAddress(): boolean {
    return this.to === undefined || this.to.buf.length === 0
  }

  /**
   * Computes a sha3-256 hash of the unserialized tx.
   * This hash is signed by the private key. It is different from the transaction hash, which are put in blocks.
   * The transaction hash also hashes the data used to sign the transaction.
   */
  rawTxHash(): Buffer {
    const values = [
      Buffer.from('01', 'hex'),
      this.chainId.toBuffer(),
      this.nonce.toBuffer(),
      this.gasPrice.toBuffer(),
      this.gasLimit.toBuffer(),
      this.to !== undefined ? this.to.buf : Buffer.from([]),
      this.value.toBuffer(),
      this.data,
      this.accessList,
    ]

    return rlphash(values)
  }

  getMessageToSign() {
    return this.rawTxHash()
  }

  /**
   * Returns chain ID
   */
  getChainId(): number {
    return this.common.chainId()
  }

  sign(privateKey: Buffer) {
    if (privateKey.length !== 32) {
      throw new Error('Private key must be 32 bytes in length.')
    }

    const msgHash = this.getMessageToSign()

    // Only `v` is reassigned.
    /* eslint-disable-next-line prefer-const */
    let { v, r, s } = ecsign(msgHash, privateKey)

    const opts = {
      common: this.common,
    }

    return SignedEIP2930Transaction.fromTxData(
      {
        chainId: this.chainId,
        nonce: this.nonce,
        gasPrice: this.gasPrice,
        gasLimit: this.gasLimit,
        to: this.to,
        value: this.value,
        data: this.data,
        accessList: this.accessList,
        yParity: v, // TODO: check if this is correct. Should be a number between 0/1
        r: new BN(r),
        s: new BN(s),
      },
      opts
    )
  }
}
