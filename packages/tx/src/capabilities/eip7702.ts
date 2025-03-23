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
  AuthorizationListBytesItem,
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
 * Validates a single authorization list item
 */
function validateAuthorizationListItem(item: AuthorizationListBytesItem) {
  if (item.length !== 6) {
    throw EthereumJSErrorWithoutCode(
      'Invalid EIP-7702 transaction: authorization list item should have 6 elements',
    )
  }
  const [chainId, address, nonce, yParity, r, s] = item

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

/**
 * Checks if the authorization list is valid. Throws if invalid.
 * @param authorizationList
 */
export function verifyAuthorizationList(authorizationList: AuthorizationListBytes) {
  if (authorizationList.length === 0) {
    throw EthereumJSErrorWithoutCode('Invalid EIP-7702 transaction: authorization list is empty')
  }

  for (const item of authorizationList) {
    validateAuthorizationListItem(item)
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
