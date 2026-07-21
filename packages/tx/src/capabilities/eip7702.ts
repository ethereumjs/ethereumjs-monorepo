import * as EIP2930 from './eip2930.ts'

import {
  EthereumJSErrorWithoutCode,
  MAX_INTEGER,
  MAX_UINT64,
  bytesToBigInt,
  eoaCode7702AuthorizationListBytesItemToJSON,
  validateNoLeadingZeroes,
} from '@ethereumjs/util'
import type { EOACode7702AuthorizationList } from '@ethereumjs/util'
import type { EIP7702CompatibleTx } from '../types.ts'

/**
 * The amount of gas paid for the data in this tx
 */
export function getDataGas(tx: EIP7702CompatibleTx): bigint {
  const eip2930Cost = EIP2930.getDataGas(tx)
  const eip7702Cost = BigInt(
    tx.authorizationList.length * Number(tx.common.param('perEmptyAccountCost')),
  )
  return eip2930Cost + eip7702Cost
}

/**
 * Returns the authorization list of the tx in JSON format.
 *
 * For frozen txs the result is computed once, frozen (the tx cannot change
 * anymore, so neither can its JSON representation) and cached, and repeated
 * calls return the same frozen object. For non-frozen txs a fresh (mutable)
 * copy is returned on every call, since the underlying authorization list
 * bytes could still change.
 */
export function getAuthorizationListJSON(tx: EIP7702CompatibleTx): EOACode7702AuthorizationList {
  if (tx.cache.authorityListJSON !== undefined) {
    return tx.cache.authorityListJSON
  }

  const authorityListJSON = tx.authorizationList.map((item) =>
    eoaCode7702AuthorizationListBytesItemToJSON(item),
  )

  if (Object.isFrozen(tx)) {
    for (const item of authorityListJSON) {
      Object.freeze(item)
    }
    Object.freeze(authorityListJSON)
    tx.cache.authorityListJSON = authorityListJSON
  }

  return authorityListJSON
}

/**
 * Checks if the authorization list is valid. Throws if invalid.
 * @param tx - Transaction whose authorization list should be validated
 */
export function verifyAuthorizationList(tx: EIP7702CompatibleTx) {
  const authorizationList = tx.authorizationList
  if (authorizationList.length === 0) {
    throw EthereumJSErrorWithoutCode('Invalid EIP-7702 transaction: authorization list is empty')
  }

  for (const item of authorizationList) {
    if (item.length !== 6) {
      throw EthereumJSErrorWithoutCode(
        'Invalid EIP-7702 transaction: authorization list item should have 6 elements',
      )
    }

    for (const member of item) {
      // This checks if the `member` is a list, not bytes
      // This checks that the authority list does not have any embedded lists in it
      if (Array.isArray(member)) {
        throw EthereumJSErrorWithoutCode(
          'Invalid EIP-7702 transaction: authority list element is a list, not bytes',
        )
      }
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
}
