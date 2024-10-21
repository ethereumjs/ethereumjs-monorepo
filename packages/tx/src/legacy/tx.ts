import { RLP } from '@ethereumjs/rlp'
import {
  Address,
  BIGINT_2,
  BIGINT_8,
  MAX_INTEGER,
  bigIntToHex,
  bigIntToUnpaddedBytes,
  bytesToBigInt,
  bytesToHex,
  toBytes,
  unpadBytes,
} from '@ethereumjs/util'
import { keccak256 } from 'ethereum-cryptography/keccak.js'

import { BaseTransaction } from '../baseTransaction.js'
import * as Legacy from '../capabilities/legacy.js'
import { getCommon, valueBoundaryCheck } from '../features/util.js'
import { paramsTx } from '../index.js'
import { Capability, TransactionType } from '../types.js'
import { checkMaxInitCodeSize, validateNotArray } from '../util.js'

import { createLegacyTx } from './constructors.js'

import type {
  TxData as AllTypesTxData,
  TxValuesArray as AllTypesTxValuesArray,
  JSONTx,
  TransactionInterface,
  TxOptions,
} from '../types.js'
import type { Common } from '@ethereumjs/common'

export type TxData = AllTypesTxData[TransactionType.Legacy]
export type TxValuesArray = AllTypesTxValuesArray[TransactionType.Legacy]

function meetsEIP155(_v: bigint, chainId: bigint) {
  const v = Number(_v)
  const chainIdDoubled = Number(chainId) * 2
  return v === chainIdDoubled + 35 || v === chainIdDoubled + 36
}

/**
 * An Ethereum non-typed (legacy) transaction
 */
export class LegacyTx implements TransactionInterface<TransactionType.Legacy> {
  /* Tx public data fields */
  public type: number = TransactionType.Legacy // Legacy tx type

  public readonly gasPrice: bigint
  public readonly nonce: bigint
  public readonly gasLimit: bigint
  public readonly value: bigint
  public readonly data: Uint8Array
  public readonly to?: Address

  // Props only for signed txs
  public readonly v?: bigint
  public readonly r?: bigint
  public readonly s?: bigint

  /* Other handy tx props */
  public readonly common: Common
  private keccakFunction: (msg: Uint8Array) => Uint8Array

  protected readonly txOptions: TxOptions

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
   * the static factory methods to assist in creating a Transaction object from
   * varying data types.
   */
  public constructor(txData: TxData, opts: TxOptions = {}) {
    // LOAD base tx super({ ...txData, type: TransactionType.Legacy }, opts)
    this.common = getCommon(opts.common)

    validateNotArray(txData) // is this necessary?

    const { nonce, gasLimit, gasPrice, to, value, data, v, r, s } = txData

    this.txOptions = opts // TODO: freeze?

    // Set the tx properties
    const toB = toBytes(to === '' ? '0x' : to)
    this.to = toB.length > 0 ? new Address(toB) : undefined // TODO mark this explicitly as null if create-contract-tx?

    const vB = toBytes(v)
    const rB = toBytes(r)
    const sB = toBytes(s)

    this.nonce = bytesToBigInt(toBytes(nonce))
    this.gasLimit = bytesToBigInt(toBytes(gasLimit))
    this.gasPrice = bytesToBigInt(toBytes(gasPrice))
    this.to = toB.length > 0 ? new Address(toB) : undefined
    this.value = bytesToBigInt(toBytes(value))
    this.data = toBytes(data === '' ? '0x' : data)

    // Set signature values (if the tx is signed)
    this.v = vB.length > 0 ? bytesToBigInt(vB) : undefined
    this.r = rB.length > 0 ? bytesToBigInt(rB) : undefined
    this.s = sB.length > 0 ? bytesToBigInt(sB) : undefined

    // Start validating the data

    // Validate value/r/s
    valueBoundaryCheck({ value: this.value, r: this.r, s: this.s, gasPrice: this.gasPrice })

    // geth limits gasLimit to 2^64-1
    valueBoundaryCheck({ gasLimit: this.gasLimit }, 64)

    // EIP-2681 limits nonce to 2^64-1 (cannot equal 2^64-1)
    valueBoundaryCheck({ nonce: this.nonce }, 64, true)

    const createContract = this.to === undefined || this.to === null
    const allowUnlimitedInitCodeSize = opts.allowUnlimitedInitCodeSize ?? false

    if (
      createContract &&
      this.common.isActivatedEIP(3860) &&
      allowUnlimitedInitCodeSize === false
    ) {
      checkMaxInitCodeSize(this.common, this.data.length)
    }

    // Everything from BaseTransaction done here
    this.common.updateParams(opts.params ?? paramsTx) // TODO should this move higher?

    const chainId = validateVAndExtractChainID(this.common, this.v)
    if (chainId !== undefined && chainId !== this.common.chainId()) {
      throw new Error(
        `Common chain ID ${this.common.chainId} not matching the derived chain ID ${chainId}`,
      )
    }

    this.keccakFunction = this.common.customCrypto.keccak256 ?? keccak256

    if (this.gasPrice * this.gasLimit > MAX_INTEGER) {
      throw new Error('gas limit * gasPrice cannot exceed MAX_INTEGER (2^256-1)')
    }

    if (this.common.gteHardfork('spuriousDragon')) {
      if (!this.isSigned()) {
        this.activeCapabilities.push(Capability.EIP155ReplayProtection)
      } else {
        // EIP155 spec:
        // If block.number >= 2,675,000 and v = CHAIN_ID * 2 + 35 or v = CHAIN_ID * 2 + 36
        // then when computing the hash of a transaction for purposes of signing or recovering
        // instead of hashing only the first six elements (i.e. nonce, gasprice, startgas, to, value, data)
        // hash nine elements, with v replaced by CHAIN_ID, r = 0 and s = 0.
        // v and chain ID meet EIP-155 conditions
        if (meetsEIP155(this.v!, this.common.chainId())) {
          this.activeCapabilities.push(Capability.EIP155ReplayProtection)
        }
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

  public isSigned(): boolean {
    const { v, r, s } = this
    if (v === undefined || r === undefined || s === undefined) {
      return false
    } else {
      return true
    }
  }

  getEffectivePriorityFee(baseFee?: bigint): bigint {
    return Legacy.getEffectivePriorityFee(this.gasPrice, baseFee)
  }

  /**
   * Returns a Uint8Array Array of the raw Bytes of the legacy transaction, in order.
   *
   * Format: `[nonce, gasPrice, gasLimit, to, value, data, v, r, s]`
   *
   * For legacy txs this is also the correct format to add transactions
   * to a block with {@link createBlockFromBytesArray} (use the `serialize()` method
   * for typed txs).
   *
   * For an unsigned tx this method returns the empty Bytes values
   * for the signature parameters `v`, `r` and `s`. For an EIP-155 compliant
   * representation have a look at {@link Transaction.getMessageToSign}.
   */
  raw(): TxValuesArray {
    return [
      bigIntToUnpaddedBytes(this.nonce),
      bigIntToUnpaddedBytes(this.gasPrice),
      bigIntToUnpaddedBytes(this.gasLimit),
      this.to !== undefined ? this.to.bytes : new Uint8Array(0),
      bigIntToUnpaddedBytes(this.value),
      this.data,
      this.v !== undefined ? bigIntToUnpaddedBytes(this.v) : new Uint8Array(0),
      this.r !== undefined ? bigIntToUnpaddedBytes(this.r) : new Uint8Array(0),
      this.s !== undefined ? bigIntToUnpaddedBytes(this.s) : new Uint8Array(0),
    ]
  }

  /**
   * Returns the serialized encoding of the legacy transaction.
   *
   * Format: `rlp([nonce, gasPrice, gasLimit, to, value, data, v, r, s])`
   *
   * For an unsigned tx this method uses the empty Uint8Array values for the
   * signature parameters `v`, `r` and `s` for encoding. For an EIP-155 compliant
   * representation for external signing use {@link Transaction.getMessageToSign}.
   */
  serialize(): Uint8Array {
    return RLP.encode(this.raw())
  }

  /**
   * Returns the raw unsigned tx, which can be used
   * to sign the transaction (e.g. for sending to a hardware wallet).
   *
   * Note: the raw message message format for the legacy tx is not RLP encoded
   * and you might need to do yourself with:
   *
   * ```javascript
   * import { RLP } from '@ethereumjs/rlp'
   * const message = tx.getMessageToSign()
   * const serializedMessage = RLP.encode(message)) // use this for the HW wallet input
   * ```
   */
  getMessageToSign(): Uint8Array[] {
    const message = [
      bigIntToUnpaddedBytes(this.nonce),
      bigIntToUnpaddedBytes(this.gasPrice),
      bigIntToUnpaddedBytes(this.gasLimit),
      this.to !== undefined ? this.to.bytes : new Uint8Array(0),
      bigIntToUnpaddedBytes(this.value),
      this.data,
    ]

    if (this.supports(Capability.EIP155ReplayProtection)) {
      message.push(bigIntToUnpaddedBytes(this.common.chainId()))
      message.push(unpadBytes(toBytes(0)))
      message.push(unpadBytes(toBytes(0)))
    }

    return message
  }

  /**
   * Returns the hashed serialized unsigned tx, which can be used
   * to sign the transaction (e.g. for sending to a hardware wallet).
   */
  getHashedMessageToSign() {
    const message = this.getMessageToSign()
    return this.keccakFunction(RLP.encode(message))
  }

  /**
   * The amount of gas paid for the data in this tx
   */
  getDataGas(): bigint {
    return Legacy.getDataGas(this)
  }

  /**
   * The up front amount that an account must have for this transaction to be valid
   */
  getUpfrontCost(): bigint {
    return this.gasLimit * this.gasPrice + this.value
  }

  /**
   * Computes a sha3-256 hash of the serialized tx.
   *
   * This method can only be used for signed txs (it throws otherwise).
   * Use {@link Transaction.getMessageToSign} to get a tx hash for the purpose of signing.
   */
  hash(): Uint8Array {
    return Legacy.hash(this)
  }

  /**
   * Computes a sha3-256 hash which can be used to verify the signature
   */
  getMessageToVerifySignature() {
    if (!this.isSigned()) {
      const msg = this._errorMsg('This transaction is not signed')
      throw new Error(msg)
    }
    return this.getHashedMessageToSign()
  }

  /**
   * Returns the public key of the sender
   */
  getSenderPublicKey(): Uint8Array {
    return Legacy.getSenderPublicKey(this)
  }

  addSignature(
    v: bigint,
    r: Uint8Array | bigint,
    s: Uint8Array | bigint,
    convertV: boolean = false,
  ): LegacyTx {
    r = toBytes(r)
    s = toBytes(s)
    if (convertV && this.supports(Capability.EIP155ReplayProtection)) {
      v += this.common.chainId() * BIGINT_2 + BIGINT_8
    }

    const opts = { ...this.txOptions, common: this.common }

    return createLegacyTx(
      {
        nonce: this.nonce,
        gasPrice: this.gasPrice,
        gasLimit: this.gasLimit,
        to: this.to,
        value: this.value,
        data: this.data,
        v,
        r: bytesToBigInt(r),
        s: bytesToBigInt(s),
      },
      opts,
    )
  }

  /**
   * Returns an object with the JSON representation of the transaction.
   */
  toJSON(): JSONTx {
    // TODO this is just copied. Make this execution-api compliant
    // See: https://github.com/ethereum/execution-apis/blob/4140e528360fea53c34a766d86a000c6c039100e/src/eth/transaction.yaml#L19
    return {
      type: bigIntToHex(BigInt(this.type)),
      nonce: bigIntToHex(this.nonce),
      gasLimit: bigIntToHex(this.gasLimit),
      gasPrice: bigIntToHex(this.gasPrice),
      to: this.to !== undefined ? this.to.toString() : undefined,
      value: bigIntToHex(this.value),
      data: bytesToHex(this.data),
      v: this.v !== undefined ? bigIntToHex(this.v) : undefined,
      r: this.r !== undefined ? bigIntToHex(this.r) : undefined,
      s: this.s !== undefined ? bigIntToHex(this.s) : undefined,
      chainId: bigIntToHex(this.common.chainId()),
      yParity: this.v === 0n || this.v === 1n ? bigIntToHex(this.v) : undefined,
    }
  }

  /**
   * Return a compact error string representation of the object
   */
  /*public errorStr() {
    let errorStr = this._getSharedErrorPostfix()
    errorStr += ` gasPrice=${this.gasPrice}`
    return errorStr
  }*/

  /**
   * Internal helper function to create an annotated error message
   *
   * @param msg Base error message
   * @hidden
   */
  /*protected _errorMsg(msg: string) {
    return Legacy.errorMsg(this, msg)
  }*/
}

/**
 * Validates tx's `v` value and extracts the chain id
 */
function validateVAndExtractChainID(common: Common, _v?: bigint): BigInt | undefined {
  let chainIdBigInt
  const v = _v !== undefined ? Number(_v) : undefined
  // Check for valid v values in the scope of a signed legacy tx
  if (v !== undefined) {
    // v is 1. not matching the EIP-155 chainId included case and...
    // v is 2. not matching the classic v=27 or v=28 case
    if (v < 37 && v !== 27 && v !== 28) {
      throw new Error(
        `Legacy txs need either v = 27/28 or v >= 37 (EIP-155 replay protection), got v = ${v}`,
      )
    }
  }

  // No unsigned tx and EIP-155 activated and chain ID included
  if (v !== undefined && v !== 0 && common.gteHardfork('spuriousDragon') && v !== 27 && v !== 28) {
    if (!meetsEIP155(BigInt(v), common.chainId())) {
      throw new Error(
        `Incompatible EIP155-based V ${v} and chain id ${common.chainId()}. See the Common parameter of the Transaction constructor to set the chain id.`,
      )
    }
    // Derive the original chain ID
    let numSub
    if ((v - 35) % 2 === 0) {
      numSub = 35
    } else {
      numSub = 36
    }
    // Use derived chain ID to create a proper Common
    chainIdBigInt = BigInt(v - numSub) / BIGINT_2
  }
  return chainIdBigInt
}
