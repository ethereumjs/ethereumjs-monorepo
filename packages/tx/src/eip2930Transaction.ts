import {
  BN,
  bnToHex,
  bnToUnpaddedBuffer,
  ecrecover,
  keccak256,
  rlp,
  toBuffer,
} from 'ethereumjs-util'
import Common from '@ethereumjs/common'
import { BaseTransaction } from './baseTransaction'
import {
  AccessList,
  AccessListBuffer,
  AccessListEIP2930TxData,
  AccessListEIP2930ValuesArray,
  JsonTx,
  TxOptions,
  N_DIV_2,
} from './types'

import { AccessLists } from './util'

const TRANSACTION_TYPE = 1
const TRANSACTION_TYPE_BUFFER = Buffer.from(TRANSACTION_TYPE.toString(16).padStart(2, '0'), 'hex')

/**
 * Typed transaction with optional access lists
 *
 * - TransactionType: 1
 * - EIP: [EIP-2930](https://eips.ethereum.org/EIPS/eip-2930)
 */
export default class AccessListEIP2930Transaction extends BaseTransaction<AccessListEIP2930Transaction> {
  public readonly chainId: BN
  public readonly accessList: AccessListBuffer
  public readonly AccessListJSON: AccessList
  public readonly gasPrice: BN

  public readonly common: Common

  /**
   * The default HF if the tx type is active on that HF
   * or the first greater HF where the tx is active.
   *
   * @hidden
   */
  protected DEFAULT_HARDFORK = 'berlin'

  /**
   * EIP-2930 alias for `r`
   *
   * @deprecated use `r` instead
   */
  get senderR() {
    return this.r
  }

  /**
   * EIP-2930 alias for `s`
   *
   * @deprecated use `s` instead
   */
  get senderS() {
    return this.s
  }

  /**
   * EIP-2930 alias for `v`
   *
   * @deprecated use `v` instead
   */
  get yParity() {
    return this.v
  }

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
  public static fromTxData(txData: AccessListEIP2930TxData, opts: TxOptions = {}) {
    return new AccessListEIP2930Transaction(txData, opts)
  }

  /**
   * Instantiate a transaction from the serialized tx.
   *
   * Format: `0x01 || rlp([chainId, nonce, gasPrice, gasLimit, to, value, data, accessList,
   * signatureYParity (v), signatureR (r), signatureS (s)])`
   */
  public static fromSerializedTx(serialized: Buffer, opts: TxOptions = {}) {
    if (!serialized.slice(0, 1).equals(TRANSACTION_TYPE_BUFFER)) {
      throw new Error(
        `Invalid serialized tx input: not an EIP-2930 transaction (wrong tx type, expected: ${TRANSACTION_TYPE}, received: ${serialized
          .slice(0, 1)
          .toString('hex')}`
      )
    }

    const values = rlp.decode(serialized.slice(1))

    if (!Array.isArray(values)) {
      throw new Error('Invalid serialized tx input: must be array')
    }

    return AccessListEIP2930Transaction.fromValuesArray(values as any, opts)
  }

  /**
   * Instantiate a transaction from the serialized tx.
   * (alias of {@link AccessListEIP2930Transaction.fromSerializedTx})
   *
   * Note: This means that the Buffer should start with 0x01.
   *
   * @deprecated this constructor alias is deprecated and will be removed
   * in favor of the {@link AccessListEIP2930Transaction.fromSerializedTx} constructor
   */
  public static fromRlpSerializedTx(serialized: Buffer, opts: TxOptions = {}) {
    return AccessListEIP2930Transaction.fromSerializedTx(serialized, opts)
  }

  /**
   * Create a transaction from a values array.
   *
   * Format: `[chainId, nonce, gasPrice, gasLimit, to, value, data, accessList,
   * signatureYParity (v), signatureR (r), signatureS (s)]`
   */
  public static fromValuesArray(values: AccessListEIP2930ValuesArray, opts: TxOptions = {}) {
    if (values.length !== 8 && values.length !== 11) {
      throw new Error(
        'Invalid EIP-2930 transaction. Only expecting 8 values (for unsigned tx) or 11 values (for signed tx).'
      )
    }

    const [chainId, nonce, gasPrice, gasLimit, to, value, data, accessList, v, r, s] = values

    const emptyAccessList: AccessList = []

    return new AccessListEIP2930Transaction(
      {
        chainId: new BN(chainId),
        nonce,
        gasPrice,
        gasLimit,
        to,
        value,
        data,
        accessList: accessList ?? emptyAccessList,
        v: v !== undefined ? new BN(v) : undefined, // EIP2930 supports v's with value 0 (empty Buffer)
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
  public constructor(txData: AccessListEIP2930TxData, opts: TxOptions = {}) {
    super({ ...txData, type: TRANSACTION_TYPE })
    const { chainId, accessList, gasPrice } = txData

    this.common = this._getCommon(opts.common, chainId)
    this.chainId = this.common.chainIdBN()

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

    this.gasPrice = new BN(toBuffer(gasPrice === '' ? '0x' : gasPrice))

    this._validateCannotExceedMaxInteger({ gasPrice: this.gasPrice })

    if (this.v && !this.v.eqn(0) && !this.v.eqn(1)) {
      throw new Error('The y-parity of the transaction should either be 0 or 1')
    }

    if (this.common.gteHardfork('homestead') && this.s?.gt(N_DIV_2)) {
      throw new Error(
        'Invalid Signature: s-values greater than secp256k1n/2 are considered invalid'
      )
    }

    const freeze = opts?.freeze ?? true
    if (freeze) {
      Object.freeze(this)
    }
  }

  /**
   * The amount of gas paid for the data in this tx
   */
  getDataFee(): BN {
    const cost = super.getDataFee()
    cost.iaddn(AccessLists.getDataFeeEIP2930(this.accessList, this.common))
    return cost
  }

  /**
   * The up front amount that an account must have for this transaction to be valid
   */
  getUpfrontCost(): BN {
    return this.gasLimit.mul(this.gasPrice).add(this.value)
  }

  /**
   * Returns a Buffer Array of the raw Buffers of the EIP-2930 transaction, in order.
   *
   * Format: `[chainId, nonce, gasPrice, gasLimit, to, value, data, accessList,
   * signatureYParity (v), signatureR (r), signatureS (s)]`
   *
   * Use {@link AccessListEIP2930Transaction.serialize} to add to block data for {@link Block.fromValuesArray}.
   */
  raw(): AccessListEIP2930ValuesArray {
    return [
      bnToUnpaddedBuffer(this.chainId),
      bnToUnpaddedBuffer(this.nonce),
      bnToUnpaddedBuffer(this.gasPrice),
      bnToUnpaddedBuffer(this.gasLimit),
      this.to !== undefined ? this.to.buf : Buffer.from([]),
      bnToUnpaddedBuffer(this.value),
      this.data,
      this.accessList,
      this.v !== undefined ? bnToUnpaddedBuffer(this.v) : Buffer.from([]),
      this.r !== undefined ? bnToUnpaddedBuffer(this.r) : Buffer.from([]),
      this.s !== undefined ? bnToUnpaddedBuffer(this.s) : Buffer.from([]),
    ]
  }

  /**
   * Returns the serialized encoding of the EIP-2930 transaction.
   *
   * Format: `0x01 || rlp([chainId, nonce, gasPrice, gasLimit, to, value, data, accessList,
   * signatureYParity (v), signatureR (r), signatureS (s)])`
   *
   * Note that in contrast to the legacy tx serialization format this is not
   * valid RLP any more due to the raw tx type preceeding and concatenated to
   * the RLP encoding of the values.
   */
  serialize(): Buffer {
    const base = this.raw()
    return Buffer.concat([TRANSACTION_TYPE_BUFFER, rlp.encode(base as any)])
  }

  /**
   * Returns the serialized unsigned tx (hashed or raw), which can be used
   * to sign the transaction (e.g. for sending to a hardware wallet).
   *
   * Note: in contrast to the legacy tx the raw message format is already
   * serialized and doesn't need to be RLP encoded any more.
   *
   * ```javascript
   * const serializedMessage = tx.getMessageToSign(false) // use this for the HW wallet input
   * ```
   *
   * @param hashMessage - Return hashed message if set to true (default: true)
   */
  getMessageToSign(hashMessage = true): Buffer {
    const base = this.raw().slice(0, 8)
    const message = Buffer.concat([TRANSACTION_TYPE_BUFFER, rlp.encode(base as any)])
    if (hashMessage) {
      return keccak256(message)
    } else {
      return message
    }
  }

  /**
   * Computes a sha3-256 hash of the serialized tx.
   *
   * This method can only be used for signed txs (it throws otherwise).
   * Use {@link AccessListEIP2930Transaction.getMessageToSign} to get a tx hash for the purpose of signing.
   */
  public hash(): Buffer {
    if (!this.isSigned()) {
      throw new Error('Cannot call hash method if transaction is not signed')
    }

    return keccak256(this.serialize())
  }

  /**
   * Computes a sha3-256 hash which can be used to verify the signature
   */
  public getMessageToVerifySignature(): Buffer {
    return this.getMessageToSign()
  }

  /**
   * Returns the public key of the sender
   */
  public getSenderPublicKey(): Buffer {
    if (!this.isSigned()) {
      throw new Error('Cannot call this method if transaction is not signed')
    }

    const msgHash = this.getMessageToVerifySignature()

    // EIP-2: All transaction signatures whose s-value is greater than secp256k1n/2 are considered invalid.
    // Reasoning: https://ethereum.stackexchange.com/a/55728
    if (this.common.gteHardfork('homestead') && this.s?.gt(N_DIV_2)) {
      throw new Error(
        'Invalid Signature: s-values greater than secp256k1n/2 are considered invalid'
      )
    }

    const { yParity, r, s } = this
    try {
      return ecrecover(
        msgHash,
        yParity!.addn(27), // Recover the 27 which was stripped from ecsign
        bnToUnpaddedBuffer(r!),
        bnToUnpaddedBuffer(s!)
      )
    } catch (e) {
      throw new Error('Invalid Signature')
    }
  }

  _processSignature(v: number, r: Buffer, s: Buffer) {
    const opts = {
      common: this.common,
    }

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
        v: new BN(v - 27), // This looks extremely hacky: ethereumjs-util actually adds 27 to the value, the recovery bit is either 0 or 1.
        r: new BN(r),
        s: new BN(s),
      },
      opts
    )
  }

  /**
   * Returns an object with the JSON representation of the transaction
   */
  toJSON(): JsonTx {
    const accessListJSON = AccessLists.getAccessListJSON(this.accessList)

    return {
      chainId: bnToHex(this.chainId),
      nonce: bnToHex(this.nonce),
      gasPrice: bnToHex(this.gasPrice),
      gasLimit: bnToHex(this.gasLimit),
      to: this.to !== undefined ? this.to.toString() : undefined,
      value: bnToHex(this.value),
      data: '0x' + this.data.toString('hex'),
      accessList: accessListJSON,
      v: this.v !== undefined ? bnToHex(this.v) : undefined,
      r: this.r !== undefined ? bnToHex(this.r) : undefined,
      s: this.s !== undefined ? bnToHex(this.s) : undefined,
    }
  }
}
