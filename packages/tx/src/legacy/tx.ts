import { BIGINT_2, MAX_INTEGER, bytesToBigInt, toBytes } from '@ethereumjs/util'
import { keccak256 } from 'ethereum-cryptography/keccak.js'

import * as Legacy from '../capabilities/legacy.js'
import { sharedConstructor, valueBoundaryCheck } from '../features/util.js'
import { paramsTx } from '../index.js'
import { Capability, TransactionType } from '../types.js'

import type {
  TxData as AllTypesTxData,
  TxValuesArray as AllTypesTxValuesArray,
  LegacyTxInterface,
  TransactionCache,
  TxOptions,
} from '../types.js'
import type { Common } from '@ethereumjs/common'
import type { Address } from '@ethereumjs/util'

export type TxData = AllTypesTxData[TransactionType.Legacy]
export type TxValuesArray = AllTypesTxValuesArray[TransactionType.Legacy]

function meetsEIP155(_v: bigint, chainId: bigint) {
  const v = Number(_v)
  const chainIdDoubled = Number(chainId) * 2
  return v === chainIdDoubled + 35 || v === chainIdDoubled + 36
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

/**
 * An Ethereum non-typed (legacy) transaction
 */
export class LegacyTx implements LegacyTxInterface {
  /* Tx public data fields */
  public type: number = TransactionType.Legacy // Legacy tx type

  // Tx data part (part of the RLP)
  public readonly gasPrice: bigint
  public readonly nonce!: bigint
  public readonly gasLimit!: bigint
  public readonly value!: bigint
  public readonly data!: Uint8Array
  public readonly to?: Address

  // Props only for signed txs
  public readonly v?: bigint
  public readonly r?: bigint
  public readonly s?: bigint

  // End of Tx data part

  /* Other handy tx props */
  public readonly common!: Common
  private keccakFunction: (msg: Uint8Array) => Uint8Array

  readonly txOptions!: TxOptions

  readonly cache: TransactionCache = {}

  /**
   * List of tx type defining EIPs,
   * e.g. 1559 (fee market) and 2930 (access lists)
   * for FeeMarket1559Tx objects
   */
  public activeCapabilities: number[] = []

  /**
   * This constructor takes the values, validates them, assigns them and freezes the object.
   *
   * It is not recommended to use this constructor directly. Instead use
   * the static factory methods to assist in creating a Transaction object from
   * varying data types.
   */
  public constructor(txData: TxData, opts: TxOptions = {}) {
    sharedConstructor(this, txData, opts)

    this.gasPrice = bytesToBigInt(toBytes(txData.gasPrice))
    valueBoundaryCheck({ gasPrice: this.gasPrice })

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
      if (!Legacy.isSigned(this)) {
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
}
