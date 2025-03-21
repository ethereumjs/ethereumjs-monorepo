import * as EIP2930 from './eip2930.ts'
import * as Legacy from './legacy.ts'

import {
  EthereumJSErrorWithoutCode,
  MAX_INTEGER,
  MAX_UINT64,
  bytesToBigInt,
  bytesToHex,
  hexToBytes,
  validateNoLeadingZeroes,
} from '@ethereumjs/util'
import type {
  AuthorizationList,
  AuthorizationListBytes,
  AuthorizationListItem,
  EIP7702CompatibleTx,
} from '../types.ts'

/**
 * The amount of gas paid for the data in this tx
 */
export function getDataGas(tx: EIP7702CompatibleTx): bigint {
  const eip2930Cost = BigInt(EIP2930.getAccessListDataGas(tx.accessList, tx.common))
  const eip7702Cost = BigInt(
    tx.authorizationList.length * Number(tx.common.param('perEmptyAccountCost')),
  )
  return Legacy.getDataGas(tx, eip2930Cost + eip7702Cost)
}

/**
 * Checks if the authorization list is valid. Throws if invalid.
 * @param authorizationList
 */
export function verifyAuthorizationList(authorizationList: AuthorizationListBytes) {
  if (authorizationList.length === 0) {
    throw EthereumJSErrorWithoutCode('Invalid EIP-7702 transaction: authorization list is empty')
  }
  for (let key = 0; key < authorizationList.length; key++) {
    const authorizationListItem = authorizationList[key]
    const chainId = authorizationListItem[0]
    const address = authorizationListItem[1]
    const nonce = authorizationListItem[2]
    const yParity = authorizationListItem[3]
    const r = authorizationListItem[4]
    const s = authorizationListItem[5]
    validateNoLeadingZeroes({ yParity, r, s, nonce, chainId })
    if (address.length !== 20) {
      throw EthereumJSErrorWithoutCode(
        'Invalid EIP-7702 transaction: address length should be 20 bytes',
      )
    }
    if (bytesToBigInt(chainId) > MAX_INTEGER) {
      throw EthereumJSErrorWithoutCode('Invalid EIP-7702 transaction: chainId exceeds 2^256 - 1')
    }
    if (bytesToBigInt(nonce) > MAX_UINT64) {
      throw EthereumJSErrorWithoutCode('Invalid EIP-7702 transaction: nonce exceeds 2^64 - 1')
    }
    const yParityBigInt = bytesToBigInt(yParity)
    if (yParityBigInt >= BigInt(2 ** 8)) {
      throw EthereumJSErrorWithoutCode(
        'Invalid EIP-7702 transaction: yParity should be fit within 1 byte (0 - 255)',
      )
    }
    if (bytesToBigInt(r) > MAX_INTEGER) {
      throw EthereumJSErrorWithoutCode('Invalid EIP-7702 transaction: r exceeds 2^256 - 1')
    }
    if (bytesToBigInt(s) > MAX_INTEGER) {
      throw EthereumJSErrorWithoutCode('Invalid EIP-7702 transaction: s exceeds 2^256 - 1')
    }
  }
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
  const json: AuthorizationList = []
  for (let i = 0; i < authorizationList.length; i++) {
    const data = authorizationList[i]
    const chainId = bytesToHex(data[0])
    const address = bytesToHex(data[1])
    const nonce = bytesToHex(data[2])
    const yParity = bytesToHex(data[3])
    const r = bytesToHex(data[4])
    const s = bytesToHex(data[5])
    const jsonItem: AuthorizationListItem = {
      chainId,
      address,
      nonce,
      yParity,
      r,
      s,
    }
    json.push(jsonItem)
  }
  return json
}

/**
 * Converts an authority list in JSON to a bytes format
 * @param authorizationList
 * @returns bytes format of the authority list
 */
export function authorizationListJSONToBytes(
  authorizationList: AuthorizationList,
): AuthorizationListBytes {
  const authorizationListBytes: AuthorizationListBytes = []
  const jsonItems = ['chainId', 'address', 'nonce', 'yParity', 'r', 's']
  for (let i = 0; i < authorizationList.length; i++) {
    const item: AuthorizationListItem = authorizationList[i]
    for (const key of jsonItems) {
      if (item[key as keyof typeof item] === undefined) {
        throw EthereumJSErrorWithoutCode(
          `EIP-7702 authorization list invalid: ${key} is not defined`,
        )
      }
    }
    const chainId = hexToBytes(item.chainId)
    const addressBytes = hexToBytes(item.address)
    const nonce = hexToBytes(item.nonce)
    const yParity = hexToBytes(item.yParity)
    const r = hexToBytes(item.r)
    const s = hexToBytes(item.s)

    authorizationListBytes.push([chainId, addressBytes, nonce, yParity, r, s])
  }
  return authorizationListBytes
}
