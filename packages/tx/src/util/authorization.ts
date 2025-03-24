// Utility helpers to convert authorization lists from the byte format and JSON format and vice versa

import { EthereumJSErrorWithoutCode, bytesToHex, hexToBytes } from '@ethereumjs/util'
import type { AuthorizationList, AuthorizationListBytes } from '../types.ts'

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
