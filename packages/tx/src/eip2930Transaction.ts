import Common from '@ethereumjs/common'
import { Address, BN, rlp, toBuffer } from 'ethereumjs-util'
import { DEFAULT_COMMON, EIP2930TxData, TxOptions } from './types'

export class UnsignedEIP2930Transaction {
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
}

export class SignedEIP2930Transaction extends UnsignedEIP2930Transaction {
  public static fromTxData(txData: EIP2930TxData, opts?: TxOptions) {
    return new SignedEIP2930Transaction(txData, opts ?? {})
  }

  public static fromValuesArray(values: Buffer[], opts?: TxOptions) {
    if (values.length != 11) {
      throw new Error('Expected 11 elements')
    }

    const [chainId, nonce, gasPrice, gasLimit, to, value, data, accessList, yParity, r, s] = values
    const emptyBuffer = Buffer.from([])

    return new SignedEIP2930Transaction(
      {
        chainId: new BN(chainId),
        nonce: new BN(nonce),
        gasPrice: new BN(gasPrice),
        gasLimit: new BN(gasLimit),
        to: to && to.length > 0 ? new Address(to) : undefined,
        value: new BN(value),
        data: data ?? emptyBuffer,
        accessList: accessList ?? emptyBuffer,
        yParity: !yParity?.equals(emptyBuffer) ? parseInt(yParity.toString('hex'), 16) : undefined,
        r: !r?.equals(emptyBuffer) ? new BN(r) : undefined,
        s: !s?.equals(emptyBuffer) ? new BN(s) : undefined,
      },
      opts ?? {}
    )
  }

  protected constructor(txData: EIP2930TxData, opts: TxOptions) {
    super(txData, opts)

    // TODO: save the extra yParity, r, s data.
    // TODO: verify the signature.
  }
}
