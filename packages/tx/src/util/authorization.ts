// Utility helpers to convert authorization lists from the byte format and JSON format and vice versa

import { RLP } from '@ethereumjs/rlp'
import {
  Address,
  EthereumJSErrorWithoutCode,
  bigIntToUnpaddedBytes,
  bytesToBigInt,
  bytesToHex,
  concatBytes,
  ecrecover,
  hexToBytes,
  publicToAddress,
  setLengthLeft,
  unpadBytes,
} from '@ethereumjs/util'
import { keccak256 } from 'ethereum-cryptography/keccak'
import { secp256k1 } from 'ethereum-cryptography/secp256k1'
import { AUTHORITY_SIGNING_MAGIC } from '../constants.ts'
import type {
  AuthorizationListBytesItem,
  AuthorizationListBytesItemUnsigned,
  AuthorizationListItem,
  AuthorizationListItemUnsigned,
} from '../types.ts'

/**
 * Converts an authorization list to a JSON format
 * @param authorizationList
 * @returns authorizationList in JSON format
 */
export function authorizationListBytesItemToJSON(
  authorizationList: AuthorizationListBytesItem,
): AuthorizationListItem {
  const [chainId, address, nonce, yParity, r, s] = authorizationList
  return {
    chainId: bytesToHex(chainId),
    address: bytesToHex(address),
    nonce: bytesToHex(nonce),
    yParity: bytesToHex(yParity),
    r: bytesToHex(r),
    s: bytesToHex(s),
  }
}

/**
 * Converts an authority list in JSON to a bytes format
 * @param authorizationList
 * @returns bytes format of the authority list
 */
export function authorizationListJSONItemToBytes(
  authorizationList: AuthorizationListItem,
): AuthorizationListBytesItem {
  const requiredFields = ['chainId', 'address', 'nonce', 'yParity', 'r', 's'] as const

  // Validate all required fields are present
  for (const field of requiredFields) {
    if (authorizationList[field] === undefined) {
      throw EthereumJSErrorWithoutCode(
        `EIP-7702 authorization list invalid: ${field} is not defined`,
      )
    }
  }

  return [
    hexToBytes(authorizationList.chainId),
    hexToBytes(authorizationList.address),
    hexToBytes(authorizationList.nonce),
    hexToBytes(authorizationList.yParity),
    hexToBytes(authorizationList.r),
    hexToBytes(authorizationList.s),
  ]
}

/** Authorization signing utility methods */
function unsignedAuthorizationListToBytes(input: AuthorizationListItemUnsigned) {
  const { chainId: chainIdHex, address: addressHex, nonce: nonceHex } = input
  const chainId = hexToBytes(chainIdHex)
  const address = setLengthLeft(hexToBytes(addressHex), 20)
  const nonce = hexToBytes(nonceHex)
  return [chainId, address, nonce]
}

/**
 * Returns the bytes (RLP-encoded) to sign
 * @param input Either the bytes or the object format of the authorization list item
 * @returns
 */
export function authorizationMessageToSign(
  input: AuthorizationListItemUnsigned | AuthorizationListBytesItemUnsigned,
) {
  if (Array.isArray(input)) {
    // The address is validated, the chainId and nonce will be `unpadBytes` such that these are valid
    const [chainId, address, nonce] = input
    if (address.length !== 20) {
      throw EthereumJSErrorWithoutCode('Cannot sign authority: address length should be 20 bytes')
    }
    return concatBytes(
      AUTHORITY_SIGNING_MAGIC,
      RLP.encode([unpadBytes(chainId), address, unpadBytes(nonce)]),
    )
  } else {
    const [chainId, address, nonce] = unsignedAuthorizationListToBytes(input)
    return concatBytes(AUTHORITY_SIGNING_MAGIC, RLP.encode([chainId, address, nonce]))
  }
}

/**
 * Hashes the RLP-encoded message to sign
 * @param input
 * @returns
 */
export function authorizationHashedMessageToSign(
  input: AuthorizationListItemUnsigned | AuthorizationListBytesItemUnsigned,
) {
  return keccak256(authorizationMessageToSign(input))
}

/**
 * Signs an authorization list item and returns it in `bytes` format.
 * To get the JSON format, use `authorizationListBytesToJSON([signed])[0] to convert it`
 * @param input
 * @param privateKey
 * @returns
 */
export function signAuthorization(
  input: AuthorizationListItemUnsigned | AuthorizationListBytesItemUnsigned,
  privateKey: Uint8Array,
): AuthorizationListBytesItem {
  const msgHash = authorizationHashedMessageToSign(input)
  // TODO: always uses the JS version: read ecsign from crypto
  const signed = secp256k1.sign(msgHash, privateKey)
  const [chainId, address, nonce] = Array.isArray(input)
    ? input
    : unsignedAuthorizationListToBytes(input)

  return [
    chainId,
    address,
    nonce,
    bigIntToUnpaddedBytes(BigInt(signed.recovery)),
    bigIntToUnpaddedBytes(signed.r),
    bigIntToUnpaddedBytes(signed.s),
  ]
}

export function recoverAuthority(
  input: AuthorizationListItem | AuthorizationListBytesItem,
): Address {
  const inputBytes = Array.isArray(input) ? input : authorizationListJSONItemToBytes(input)
  const [chainId, address, nonce, yParity, r, s] = inputBytes
  const msgHash = authorizationHashedMessageToSign([chainId, address, nonce])
  const pubKey = ecrecover(msgHash, bytesToBigInt(yParity), r, s)
  return new Address(publicToAddress(pubKey))
}
