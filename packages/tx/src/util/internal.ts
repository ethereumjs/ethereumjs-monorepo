import { Common, Mainnet } from '@ethereumjs/common'
import {
  Address,
  EthereumJSErrorWithoutCode,
  MAX_INTEGER,
  MAX_UINT64,
  bigIntToHex,
  bytesToBigInt,
  bytesToHex,
  hexToBytes,
  toBytes,
} from '@ethereumjs/util'

import { paramsTx } from '../params.ts'

import type { TransactionInterface, TransactionType, TxData, TxOptions } from '../types.ts'

/**
 * Gets a Common instance, creating a new one if none provided
 * @param common - Optional Common instance
 * @returns Common instance (copied if provided, new Mainnet instance if not)
 */
export function getCommon(common?: Common): Common {
  return common?.copy() ?? new Common({ chain: Mainnet })
}

/**
 * Converts a transaction type to its byte representation
 * @param txType - The transaction type
 * @returns Uint8Array representation of the transaction type
 */
export function txTypeBytes(txType: TransactionType): Uint8Array {
  return hexToBytes(`0x${txType.toString(16).padStart(2, '0')}`)
}

/**
 * Validates that transaction data fields are not arrays
 * @param values - Object containing transaction data fields
 * @throws EthereumJSErrorWithoutCode if any transaction field is an array
 */
export function validateNotArray(values: { [key: string]: any }) {
  const txDataKeys = [
    'nonce',
    'gasPrice',
    'gasLimit',
    'to',
    'value',
    'data',
    'v',
    'r',
    's',
    'type',
    'baseFee',
    'maxFeePerGas',
    'chainId',
  ]
  for (const [key, value] of Object.entries(values)) {
    if (txDataKeys.includes(key)) {
      if (Array.isArray(value)) {
        throw EthereumJSErrorWithoutCode(`${key} cannot be an array`)
      }
    }
  }
}

function checkMaxInitCodeSize(common: Common, length: number) {
  const maxInitCodeSize = common.param('maxInitCodeSize')
  if (maxInitCodeSize && BigInt(length) > maxInitCodeSize) {
    throw EthereumJSErrorWithoutCode(
      `the initcode size of this transaction is too large: it is ${length} while the max is ${common.param(
        'maxInitCodeSize',
      )}`,
    )
  }
}

/**
 * Validates that an object with BigInt values cannot exceed the specified bit limit.
 * @param values Object containing string keys and BigInt values
 * @param bits Number of bits to check (64 or 256)
 * @param cannotEqual Pass true if the number also cannot equal one less than the maximum value
 */
export function valueOverflowCheck(
  values: { [key: string]: bigint | undefined },
  bits = 256,
  cannotEqual = false,
) {
  for (const [key, value] of Object.entries(values)) {
    switch (bits) {
      case 64:
        if (cannotEqual) {
          if (value !== undefined && value >= MAX_UINT64) {
            // TODO: error msgs got raised to a error string handler first, now throws "generic" error
            throw EthereumJSErrorWithoutCode(
              `${key} cannot equal or exceed MAX_UINT64 (2^64-1), given ${value}`,
            )
          }
        } else {
          if (value !== undefined && value > MAX_UINT64) {
            throw EthereumJSErrorWithoutCode(
              `${key} cannot exceed MAX_UINT64 (2^64-1), given ${value}`,
            )
          }
        }
        break
      case 256:
        if (cannotEqual) {
          if (value !== undefined && value >= MAX_INTEGER) {
            throw EthereumJSErrorWithoutCode(
              `${key} cannot equal or exceed MAX_INTEGER (2^256-1), given ${value}`,
            )
          }
        } else {
          if (value !== undefined && value > MAX_INTEGER) {
            throw EthereumJSErrorWithoutCode(
              `${key} cannot exceed MAX_INTEGER (2^256-1), given ${value}`,
            )
          }
        }
        break
      default: {
        throw EthereumJSErrorWithoutCode('unimplemented bits value')
      }
    }
  }
}

type Mutable<T> = {
  -readonly [P in keyof T]: T[P]
}

/**
 * Shared constructor logic for all transaction types
 * Note: Uses Mutable type to write to readonly properties. Only call this in transaction constructors.
 * @param tx - Mutable transaction interface to initialize
 * @param txData - Transaction data
 * @param opts - Transaction options
 */
export function sharedConstructor(
  tx: Mutable<TransactionInterface>,
  txData: TxData[TransactionType],
  opts: TxOptions = {},
) {
  // LOAD base tx super({ ...txData, type: TransactionType.Legacy }, opts)
  tx.common = getCommon(opts.common)
  tx.common.updateParams(opts.params ?? paramsTx)

  validateNotArray(txData) // is this necessary?

  const { nonce, gasLimit, to, value, data, v, r, s } = txData

  tx.txOptions = opts // TODO: freeze?

  // Set the tx properties
  const toB = toBytes(to === '' ? '0x' : to)
  tx.to = toB.length > 0 ? new Address(toB) : undefined // TODO mark this explicitly as null if create-contract-tx?

  const vB = toBytes(v)
  const rB = toBytes(r)
  const sB = toBytes(s)

  tx.nonce = bytesToBigInt(toBytes(nonce))
  tx.gasLimit = bytesToBigInt(toBytes(gasLimit))
  tx.to = toB.length > 0 ? new Address(toB) : undefined
  tx.value = bytesToBigInt(toBytes(value))
  tx.data = toBytes(data === '' ? '0x' : data)

  // Set signature values (if the tx is signed)
  tx.v = vB.length > 0 ? bytesToBigInt(vB) : undefined
  tx.r = rB.length > 0 ? bytesToBigInt(rB) : undefined
  tx.s = sB.length > 0 ? bytesToBigInt(sB) : undefined

  // Start validating the data

  // Validate value/r/s
  valueOverflowCheck({ value: tx.value, r: tx.r, s: tx.s })

  // geth limits gasLimit to 2^64-1
  valueOverflowCheck({ gasLimit: tx.gasLimit }, 64)

  // EIP-2681 limits nonce to 2^64-1 (cannot equal 2^64-1)
  valueOverflowCheck({ nonce: tx.nonce }, 64, true)

  // EIP-7825: Transaction Gas Limit Cap
  if (tx.common.isActivatedEIP(7825)) {
    const maxGasLimit = tx.common.param('maxTransactionGasLimit')
    if (tx.gasLimit > maxGasLimit) {
      throw EthereumJSErrorWithoutCode(
        `Transaction gas limit ${tx.gasLimit} exceeds the maximum allowed by EIP-7825 (${maxGasLimit})`,
      )
    }
  }

  const createContract = tx.to === undefined || tx.to === null
  const allowUnlimitedInitCodeSize = opts.allowUnlimitedInitCodeSize ?? false

  if (createContract && tx.common.isActivatedEIP(3860) && allowUnlimitedInitCodeSize === false) {
    checkMaxInitCodeSize(tx.common, tx.data.length)
  }
}

/**
 * Converts a transaction to its base JSON representation
 * @param tx - The transaction interface
 * @returns JSON object with base transaction fields
 */
export function getBaseJSON(tx: TransactionInterface) {
  return {
    type: bigIntToHex(BigInt(tx.type)),
    nonce: bigIntToHex(tx.nonce),
    gasLimit: bigIntToHex(tx.gasLimit),
    to: tx.to !== undefined ? tx.to.toString() : undefined,
    value: bigIntToHex(tx.value),
    data: bytesToHex(tx.data),
    v: tx.v !== undefined ? bigIntToHex(tx.v) : undefined,
    r: tx.r !== undefined ? bigIntToHex(tx.r) : undefined,
    s: tx.s !== undefined ? bigIntToHex(tx.s) : undefined,
    chainId: bigIntToHex(tx.common.chainId()),
    yParity: tx.v === 0n || tx.v === 1n ? bigIntToHex(tx.v) : undefined,
  }
}
