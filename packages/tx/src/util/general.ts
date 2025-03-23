import {
  EthereumJSErrorWithoutCode,
  TypeOutput,
  bytesToHex,
  hexToBytes,
  setLengthLeft,
  toBytes,
  toType,
} from '@ethereumjs/util'

import type { Common } from '@ethereumjs/common'
import type {
  AccessList,
  AccessListBytes,
  AuthorizationList,
  AuthorizationListBytes,
  TransactionType,
  TypedTxData,
} from '../types.ts'

export function checkMaxInitCodeSize(common: Common, length: number) {
  const maxInitCodeSize = common.param('maxInitCodeSize')
  if (maxInitCodeSize && BigInt(length) > maxInitCodeSize) {
    throw EthereumJSErrorWithoutCode(
      `the initcode size of this transaction is too large: it is ${length} while the max is ${common.param(
        'maxInitCodeSize',
      )}`,
    )
  }
}

export function txTypeBytes(txType: TransactionType): Uint8Array {
  return hexToBytes(`0x${txType.toString(16).padStart(2, '0')}`)
}

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

/**
 * Normalizes values for transactions that are received from an RPC provider to be properly usable within
 * the ethereumjs context
 * @param txParamsFromRPC a transaction in the standard JSON-RPC format
 * @returns a normalized {@link TypedTxData} object with valid values
 */
export const normalizeTxParams = (txParamsFromRPC: any): TypedTxData => {
  const txParams = Object.assign({}, txParamsFromRPC)

  txParams.gasLimit = toType(txParams.gasLimit ?? txParams.gas, TypeOutput.BigInt)
  txParams.data = txParams.data === undefined ? txParams.input : txParams.data

  // check and convert gasPrice and value params
  txParams.gasPrice = txParams.gasPrice !== undefined ? BigInt(txParams.gasPrice) : undefined
  txParams.value = txParams.value !== undefined ? BigInt(txParams.value) : undefined

  // strict byte length checking
  txParams.to =
    txParams.to !== null && txParams.to !== undefined
      ? setLengthLeft(toBytes(txParams.to), 20)
      : null

  // Normalize the v/r/s values. If RPC returns '0x0', ensure v/r/s are set to `undefined` in the tx.
  // If this is not done, then the transaction creation will throw, because `v` is `0`.
  // Note: this still means that `isSigned` will return `false`.
  // v/r/s values are `0x0` on networks like Optimism, where the tx is a system tx.
  // For instance: https://optimistic.etherscan.io/tx/0xf4304cb09b3f58a8e5d20fec5f393c96ccffe0269aaf632cb2be7a8a0f0c91cc

  txParams.v = txParams.v === '0x0' ? '0x' : txParams.v
  txParams.r = txParams.r === '0x0' ? '0x' : txParams.r
  txParams.s = txParams.s === '0x0' ? '0x' : txParams.s

  if (txParams.v !== '0x' || txParams.r !== '0x' || txParams.s !== '0x') {
    txParams.v = toType(txParams.v, TypeOutput.BigInt)
  }

  return txParams
}

// Utility helpers to convert access lists from the byte format and JSON format and vice versa

/**
 * Converts an access list in bytes to a JSON format
 * @param accessList
 * @returns JSON format of the access list
 */
export function accessListBytesToJSON(accessList: AccessListBytes): AccessList {
  return accessList.map(([address, storageSlots]) => ({
    address: bytesToHex(setLengthLeft(address, 20)),
    storageKeys: storageSlots.map((slot) => bytesToHex(setLengthLeft(slot, 32))),
  }))
}

/**
 * Converts an access list in JSON to a bytes format
 * @param accessList
 * @returns bytes format of the access list
 */
export function accessListJSONToBytes(accessList: AccessList): AccessListBytes {
  return accessList.map((item) => [
    hexToBytes(item.address),
    item.storageKeys.map((key) => hexToBytes(key)),
  ])
}

// Utility helpers to convert authorization lists from the byte format and JSON format and vice versa

/**
 * Converts an authorization list to a JSON format
 * @param authorizationList
 * @returns authorizationList in JSON format
 */
export function authorizationListBytesToJSON(
  authorizationList: AuthorizationListBytes,
): AuthorizationList {
  return authorizationList.map(([chainId, address, nonce, yParity, r, s]) => ({
    chainId: bytesToHex(chainId),
    address: bytesToHex(address),
    nonce: bytesToHex(nonce),
    yParity: bytesToHex(yParity),
    r: bytesToHex(r),
    s: bytesToHex(s),
  }))
}

/**
 * Converts an authority list in JSON to a bytes format
 * @param authorizationList
 * @returns bytes format of the authority list
 */
export function authorizationListJSONToBytes(
  authorizationList: AuthorizationList,
): AuthorizationListBytes {
  const requiredFields = ['chainId', 'address', 'nonce', 'yParity', 'r', 's'] as const

  return authorizationList.map((item) => {
    // Validate all required fields are present
    for (const field of requiredFields) {
      if (item[field] === undefined) {
        throw EthereumJSErrorWithoutCode(
          `EIP-7702 authorization list invalid: ${field} is not defined`,
        )
      }
    }

    return [
      hexToBytes(item.chainId),
      hexToBytes(item.address),
      hexToBytes(item.nonce),
      hexToBytes(item.yParity),
      hexToBytes(item.r),
      hexToBytes(item.s),
    ]
  })
}
