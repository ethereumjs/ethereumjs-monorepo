// Utility helpers to convert authorization lists from the byte format and JSON format and vice versa

import { EthereumJSErrorWithoutCode, RLP } from '@ethereumjs/rlp'
import { keccak256 } from 'ethereum-cryptography/keccak.js'
import { secp256k1 } from 'ethereum-cryptography/secp256k1.js'
import { publicToAddress } from './account.ts'
import { Address } from './address.ts'
import {
  bigIntToUnpaddedBytes,
  bytesToBigInt,
  bytesToHex,
  concatBytes,
  hexToBytes,
  setLengthLeft,
  unpadBytes,
} from './bytes.ts'
import { ecrecover } from './signature.ts'
import type {
  EOACode7702AuthorizationListBytesItem,
  EOACode7702AuthorizationListBytesItemUnsigned,
  EOACode7702AuthorizationListItem,
  EOACode7702AuthorizationListItemUnsigned,
} from './types.ts'

export const EOA_CODE_7702_AUTHORITY_SIGNING_MAGIC = hexToBytes('0x05')

/**
 * Converts an authorization list to a JSON format
 * @param authorizationList
 * @returns authorizationList in JSON format
 */
export function eoaCode7702AuthorizationListBytesItemToJSON(
  authorizationList: EOACode7702AuthorizationListBytesItem,
): EOACode7702AuthorizationListItem {
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
export function eoaCode7702AuthorizationListJSONItemToBytes(
  authorizationList: EOACode7702AuthorizationListItem,
): EOACode7702AuthorizationListBytesItem {
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
function unsignedAuthorizationListToBytes(input: EOACode7702AuthorizationListItemUnsigned) {
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
export function eoaCode7702AuthorizationMessageToSign(
  input: EOACode7702AuthorizationListItemUnsigned | EOACode7702AuthorizationListBytesItemUnsigned,
) {
  if (Array.isArray(input)) {
    // The address is validated, the chainId and nonce will be `unpadBytes` such that these are valid
    const [chainId, address, nonce] = input
    if (address.length !== 20) {
      throw EthereumJSErrorWithoutCode('Cannot sign authority: address length should be 20 bytes')
    }
    return concatBytes(
      EOA_CODE_7702_AUTHORITY_SIGNING_MAGIC,
      RLP.encode([unpadBytes(chainId), address, unpadBytes(nonce)]),
    )
  } else {
    const [chainId, address, nonce] = unsignedAuthorizationListToBytes(input)
    return concatBytes(EOA_CODE_7702_AUTHORITY_SIGNING_MAGIC, RLP.encode([chainId, address, nonce]))
  }
}

/**
 * Hashes the RLP-encoded message to sign
 * @param input
 * @returns
 */
export function eoaCode7702AuthorizationHashedMessageToSign(
  input: EOACode7702AuthorizationListItemUnsigned | EOACode7702AuthorizationListBytesItemUnsigned,
) {
  return keccak256(eoaCode7702AuthorizationMessageToSign(input))
}

/**
 * Signs an authorization list item and returns it in `bytes` format.
 * To get the JSON format, use `authorizationListBytesToJSON([signed])[0] to convert it`
 * @param input
 * @param privateKey
 * @param ecSign
 * @returns
 */
export function eoaCode7702SignAuthorization(
  input: EOACode7702AuthorizationListItemUnsigned | EOACode7702AuthorizationListBytesItemUnsigned,
  privateKey: Uint8Array,
  ecSign?: (
    msg: Uint8Array,
    pk: Uint8Array,
    ecSignOpts?: { extraEntropy?: Uint8Array | boolean },
  ) => Pick<ReturnType<typeof secp256k1.sign>, 'recovery' | 'r' | 's'>,
): EOACode7702AuthorizationListBytesItem {
  const msgHash = eoaCode7702AuthorizationHashedMessageToSign(input)
  const secp256k1Sign = ecSign ?? secp256k1.sign
  const signed = secp256k1Sign(msgHash, privateKey)
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

export function eoaCode7702RecoverAuthority(
  input: EOACode7702AuthorizationListItem | EOACode7702AuthorizationListBytesItem,
): Address {
  const inputBytes = Array.isArray(input)
    ? input
    : eoaCode7702AuthorizationListJSONItemToBytes(input)
  const [chainId, address, nonce, yParity, r, s] = inputBytes
  const msgHash = eoaCode7702AuthorizationHashedMessageToSign([chainId, address, nonce])
  const pubKey = ecrecover(msgHash, bytesToBigInt(yParity), r, s)
  return new Address(publicToAddress(pubKey))
}
