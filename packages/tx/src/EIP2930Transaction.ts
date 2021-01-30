import {
  Address,
  BN,
  bnToHex,
  bnToRlp,
  bufferToHex,
  ecrecover,
  keccak256,
  rlp,
  rlphash,
  toBuffer,
} from 'ethereumjs-util'
import { BaseTransaction } from './baseTransaction'
import {
  AccessList,
  AccessListBuffer,
  AccessListItem,
  isAccessList,
  JsonTx,
  TxData,
  TxOptions,
} from './types'

// secp256k1n/2
const N_DIV_2 = new BN('7fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a0', 16)

type EIP2930ValuesArray = [
  Buffer,
  Buffer,
  Buffer,
  Buffer,
  Buffer,
  Buffer,
  Buffer,
  AccessListBuffer,
  Buffer?,
  Buffer?,
  Buffer?
]

export class EIP2930Transaction extends BaseTransaction<EIP2930Transaction> {
  public readonly chainId: BN
  public readonly accessList: AccessListBuffer
  public readonly v?: BN
  public readonly r?: BN
  public readonly s?: BN

  public readonly AccessListJSON: AccessList

  // EIP-2930 alias for `s`
  get senderS() {
    return this.s
  }

  // EIP-2930 alias for `r`
  get senderR() {
    return this.r
  }

  // EIP-2930 alias for `v`

  get yParity() {
    return this.v
  }

  public static fromTxData(txData: TxData, opts: TxOptions = {}) {
    return new EIP2930Transaction(txData, opts)
  }

  // Instantiate a transaction from the raw RLP serialized tx. This means that the RLP should start with 0x01.
  public static fromRlpSerializedTx(serialized: Buffer, opts: TxOptions = {}) {
    if (serialized[0] !== 1) {
      throw 'This is not an EIP-2930 transaction'
    }

    const values = rlp.decode(serialized.slice(1))

    if (!Array.isArray(values)) {
      throw new Error('Invalid serialized tx input. Must be array')
    }

    return EIP2930Transaction.fromValuesArray(values, opts)
  }

  // Create a transaction from a values array.
  // The format is: chainId, nonce, gasPrice, gasLimit, to, value, data, access_list, [yParity, senderR, senderS]
  public static fromValuesArray(values: (Buffer | AccessListBuffer)[], opts: TxOptions = {}) {
    if (values.length == 8 || values.length == 11) {
      const [chainId, nonce, gasPrice, gasLimit, to, value, data, accessList, v, r, s] = <
        EIP2930ValuesArray
      >values
      const emptyBuffer = Buffer.from([])

      return new EIP2930Transaction(
        {
          chainId: new BN(chainId),
          nonce: new BN(nonce),
          gasPrice: new BN(gasPrice),
          gasLimit: new BN(gasLimit),
          to: to && to.length > 0 ? new Address(to) : undefined,
          value: new BN(value),
          data: data ?? emptyBuffer,
          accessList: accessList ?? emptyBuffer,
          v: v !== undefined ? new BN(v) : undefined, // EIP2930 supports v's with value 0 (empty Buffer)
          r: r !== undefined && !r.equals(emptyBuffer) ? new BN(r) : undefined,
          s: s !== undefined && !s.equals(emptyBuffer) ? new BN(s) : undefined,
        },
        opts ?? {}
      )
    } else {
      throw new Error(
        'Invalid EIP-2930 transaction. Only expecting 8 values (for unsigned tx) or 11 values (for signed tx).'
      )
    }
  }

  private constructor(txData: TxData, opts: TxOptions = {}) {
    const { chainId, nonce, gasPrice, gasLimit, to, value, data, accessList, v, r, s } = txData

    super({ nonce, gasPrice, gasLimit, to, value, data }, opts)

    if (!this.common.eips().includes(2718)) {
      throw new Error('EIP-2718 not enabled on Common')
    } else if (!this.common.eips().includes(2930)) {
      throw new Error('EIP-2930 not enabled on Common')
    }

    // TODO: verify the signature.

    // check  the type of AccessList. If it's a JSON-type, we have to convert it to a buffer.

    let usedAccessList
    if (accessList && isAccessList(accessList)) {
      this.AccessListJSON = accessList

      const newAccessList: AccessListBuffer = []

      for (let i = 0; i < accessList.length; i++) {
        const item: AccessListItem = accessList[i]
        //const addItem: AccessListBufferItem = []
        const addressBuffer = toBuffer(item.address)
        const storageItems: Buffer[] = []
        for (let index = 0; index < item.storageKeys.length; index++) {
          storageItems.push(toBuffer(item.storageKeys[index]))
        }
        newAccessList.push([addressBuffer, storageItems])
      }
      usedAccessList = newAccessList
    } else {
      usedAccessList = accessList ?? []
      // build the JSON
      const json: AccessList = []
      for (let i = 0; i < usedAccessList.length; i++) {
        const data = usedAccessList[i]
        const address = bufferToHex(data[0])
        const storageKeys: string[] = []
        for (let item = 0; item < data[1].length; item++) {
          storageKeys.push(bufferToHex(data[1][item]))
        }
        const jsonItem: AccessListItem = {
          address,
          storageKeys,
        }
        json.push(jsonItem)
      }
      this.AccessListJSON = json
    }

    this.chainId = new BN(toBuffer(chainId))
    this.accessList = usedAccessList
    this.v = v ? new BN(v) : undefined
    this.r = r ? new BN(toBuffer(r)) : undefined
    this.s = s ? new BN(toBuffer(s)) : undefined

    if (!this.chainId.eq(new BN(this.common.chainId()))) {
      throw new Error('The chain ID does not match the chain ID of Common')
    }

    if (this.v && !this.v.eqn(0) && !this.v.eqn(1)) {
      throw new Error('The y-parity of the transaction should either be 0 or 1')
    }

    // todo verify max BN of r,s

    // Verify the access list format.
    for (let key = 0; key < this.accessList.length; key++) {
      const accessListItem = this.accessList[key]
      const address = <Buffer>accessListItem[0]
      const storageSlots = <Buffer[]>accessListItem[1]
      if ((<any>accessListItem)[2] !== undefined) {
        throw new Error(
          'Access list item cannot have 3 elements. It can only have an address, and an array of storage slots.'
        )
      }
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

  getMessageToSign() {
    const base = [
      Buffer.from('01', 'hex'),
      bnToRlp(this.chainId),
      bnToRlp(this.nonce),
      bnToRlp(this.gasPrice),
      bnToRlp(this.gasLimit),
      this.to !== undefined ? this.to.buf : Buffer.from([]),
      bnToRlp(this.value),
      this.data,
      this.accessList,
    ]
    return rlphash(base)
  }

  /**
   * The amount of gas paid for the data in this tx
   */
  getDataFee(): BN {
    const cost = super.getDataFee()
    const accessListStorageKeyCost = this.common.param('gasPrices', 'accessListStorageKeyCost')
    const accessListAddressCost = this.common.param('gasPrices', 'accessListAddressCost')

    let slots = 0
    for (let index = 0; index < this.accessList.length; index++) {
      const item = this.accessList[index]
      const storageSlots = item[1]
      slots += storageSlots.length
    }

    const addresses = this.accessList.length
    cost.iaddn(addresses * accessListAddressCost + slots * accessListStorageKeyCost)
    return cost
  }

  /**
   * Returns a Buffer Array of the raw Buffers of this transaction, in order.
   * TODO: check what raw means - is this the raw transaction as in block body?
   * If that is the case, it is only callable if it is signed.
   */
  raw(): Buffer[] {
    const base = <Buffer[]>[
      bnToRlp(this.chainId),
      bnToRlp(this.nonce),
      bnToRlp(this.gasPrice),
      bnToRlp(this.gasLimit),
      this.to !== undefined ? this.to.buf : Buffer.from([]),
      bnToRlp(this.value),
      this.data,
      this.accessList,
    ]
    if (this.isSigned()) {
      return base.concat([
        this.v?.eqn(0) ? Buffer.from('00', 'hex') : Buffer.from('01', 'hex'),
        bnToRlp(this.r!),
        bnToRlp(this.s!),
      ])
    } else {
      return base
    }
  }

  /**
   * Returns the rlp encoding of the transaction.
   */
  serialize(): Buffer {
    const RLPEncodedTx = rlp.encode(this.raw())

    return Buffer.concat([Buffer.from('01', 'hex'), RLPEncodedTx])
  }

  /**
   * Returns an object with the JSON representation of the transaction
   */
  toJSON(): JsonTx {
    // TODO: fix type
    const accessListJSON = []
    for (let index = 0; index < this.accessList.length; index++) {
      const item: any = this.accessList[index]
      const JSONItem: any = ['0x' + (<Buffer>item[0]).toString('hex')]
      const storageSlots: Buffer[] = item[1]
      const JSONSlots = []
      for (let slot = 0; slot < storageSlots.length; slot++) {
        const storageSlot = storageSlots[slot]
        JSONSlots.push('0x' + storageSlot.toString('hex'))
      }
      JSONItem.push(JSONSlots)
      accessListJSON.push(JSONItem)
    }

    return {
      chainId: bnToHex(this.chainId),
      nonce: bnToHex(this.nonce),
      gasPrice: bnToHex(this.gasPrice),
      gasLimit: bnToHex(this.gasLimit),
      to: this.to !== undefined ? this.to.toString() : undefined,
      value: bnToHex(this.value),
      data: '0x' + this.data.toString('hex'),
      accessList: accessListJSON,
    }
  }

  public isSigned(): boolean {
    const { yParity, r, s } = this
    return yParity !== undefined && !!r && !!s
  }

  public hash(): Buffer {
    // TODO add decorator
    if (!this.isSigned()) {
      throw new Error('Cannot call hash method if transaction is not signed')
    }

    return keccak256(Buffer.from(this.raw()))
  }

  public getMessageToVerifySignature(): Buffer {
    return this.getMessageToSign()
  }

  public getSenderPublicKey(): Buffer {
    if (!this.isSigned()) {
      throw new Error('Cannot call this method if transaction is not signed')
    }

    const msgHash = this.getMessageToVerifySignature()

    // All transaction signatures whose s-value is greater than secp256k1n/2 are considered invalid.
    // TODO: verify if this is the case for EIP-2930
    if (this.common.gteHardfork('homestead') && this.s && this.s.gt(N_DIV_2)) {
      throw new Error(
        'Invalid Signature: s-values greater than secp256k1n/2 are considered invalid'
      )
    }

    const { yParity, r, s } = this
    if (yParity === undefined || !r || !s) {
      throw new Error('Missing values to derive sender public key from signed tx')
    }

    try {
      return ecrecover(
        msgHash,
        yParity.toNumber() + 27, // Recover the 27 which was stripped from ecsign
        bnToRlp(r),
        bnToRlp(s)
      )
    } catch (e) {
      throw new Error('Invalid Signature')
    }
  }

  processSignature(v: number, r: Buffer, s: Buffer) {
    const opts = {
      common: this.common,
    }

    return EIP2930Transaction.fromTxData(
      {
        chainId: this.chainId,
        nonce: this.nonce,
        gasPrice: this.gasPrice,
        gasLimit: this.gasLimit,
        to: this.to,
        value: this.value,
        data: this.data,
        accessList: this.accessList,
        v: new BN(v - 27), // This looks extremely hacky: ethereumjs-util actually adds 27 to the value, the recovery bit is either 0 or 1.
        r: new BN(r),
        s: new BN(s),
      },
      opts
    )
  }
}
