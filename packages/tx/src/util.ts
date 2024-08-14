import {
  type PrefixedHexString,
  TypeOutput,
  bytesToHex,
  hexToBytes,
  setLengthLeft,
  toBytes,
  toType,
  validateNoLeadingZeroes,
} from '@ethereumjs/util'

import { isAccessList, isAuthorizationList } from './types.js'

import type {
  AccessList,
  AccessListBytes,
  AccessListItem,
  AuthorizationList,
  AuthorizationListBytes,
  AuthorizationListItem,
  TransactionType,
  TypedTxData,
} from './types.js'
import type { Common } from '@ethereumjs/common'

export function checkMaxInitCodeSize(common: Common, length: number) {
  const maxInitCodeSize = common.param('maxInitCodeSize')
  if (maxInitCodeSize && BigInt(length) > maxInitCodeSize) {
    throw new Error(
      `the initcode size of this transaction is too large: it is ${length} while the max is ${common.param(
        'maxInitCodeSize',
      )}`,
    )
  }
}

export class AccessLists {
  public static getAccessListData(accessList: AccessListBytes | AccessList) {
    let AccessListJSON
    let bufferAccessList
    if (isAccessList(accessList)) {
      AccessListJSON = accessList
      const newAccessList: AccessListBytes = []

      for (let i = 0; i < accessList.length; i++) {
        const item: AccessListItem = accessList[i]
        const addressBytes = hexToBytes(item.address)
        const storageItems: Uint8Array[] = []
        for (let index = 0; index < item.storageKeys.length; index++) {
          storageItems.push(hexToBytes(item.storageKeys[index]))
        }
        newAccessList.push([addressBytes, storageItems])
      }
      bufferAccessList = newAccessList
    } else {
      bufferAccessList = accessList ?? []
      // build the JSON
      const json: AccessList = []
      for (let i = 0; i < bufferAccessList.length; i++) {
        const data = bufferAccessList[i]
        const address = bytesToHex(data[0])
        const storageKeys: PrefixedHexString[] = []
        for (let item = 0; item < data[1].length; item++) {
          storageKeys.push(bytesToHex(data[1][item]))
        }
        const jsonItem: AccessListItem = {
          address,
          storageKeys,
        }
        json.push(jsonItem)
      }
      AccessListJSON = json
    }

    return {
      AccessListJSON,
      accessList: bufferAccessList,
    }
  }

  public static verifyAccessList(accessList: AccessListBytes) {
    for (let key = 0; key < accessList.length; key++) {
      const accessListItem = accessList[key]
      const address = accessListItem[0]
      const storageSlots = accessListItem[1]
      if ((<any>accessListItem)[2] !== undefined) {
        throw new Error(
          'Access list item cannot have 3 elements. It can only have an address, and an array of storage slots.',
        )
      }
      if (address.length !== 20) {
        throw new Error('Invalid EIP-2930 transaction: address length should be 20 bytes')
      }
      for (let storageSlot = 0; storageSlot < storageSlots.length; storageSlot++) {
        if (storageSlots[storageSlot].length !== 32) {
          throw new Error('Invalid EIP-2930 transaction: storage slot length should be 32 bytes')
        }
      }
    }
  }

  public static getAccessListJSON(accessList: AccessListBytes) {
    const accessListJSON = []
    for (let index = 0; index < accessList.length; index++) {
      const item: any = accessList[index]
      const JSONItem: any = {
        address: bytesToHex(setLengthLeft(item[0], 20)),
        storageKeys: [],
      }
      const storageSlots: Uint8Array[] = item[1]
      for (let slot = 0; slot < storageSlots.length; slot++) {
        const storageSlot = storageSlots[slot]
        JSONItem.storageKeys.push(bytesToHex(setLengthLeft(storageSlot, 32)))
      }
      accessListJSON.push(JSONItem)
    }
    return accessListJSON
  }

  public static getDataGasEIP2930(accessList: AccessListBytes, common: Common): number {
    const accessListStorageKeyCost = common.param('accessListStorageKeyGas')
    const accessListAddressCost = common.param('accessListAddressGas')

    let slots = 0
    for (let index = 0; index < accessList.length; index++) {
      const item = accessList[index]
      const storageSlots = item[1]
      slots += storageSlots.length
    }

    const addresses = accessList.length
    return addresses * Number(accessListAddressCost) + slots * Number(accessListStorageKeyCost)
  }
}

export class AuthorizationLists {
  public static getAuthorizationListData(
    authorizationList: AuthorizationListBytes | AuthorizationList,
  ) {
    let AuthorizationListJSON
    let bufferAuthorizationList
    if (isAuthorizationList(authorizationList)) {
      AuthorizationListJSON = authorizationList
      const newAuthorizationList: AuthorizationListBytes = []
      const jsonItems = ['chainId', 'address', 'nonce', 'yParity', 'r', 's']
      for (let i = 0; i < authorizationList.length; i++) {
        const item: AuthorizationListItem = authorizationList[i]
        for (const key of jsonItems) {
          // @ts-ignore TODO why does TsScript fail here?
          if (item[key] === undefined) {
            throw new Error(`EIP-7702 authorization list invalid: ${key} is not defined`)
          }
        }
        const chainId = hexToBytes(item.chainId)
        const addressBytes = hexToBytes(item.address)
        const nonceList = []
        for (let j = 0; j < item.nonce.length; j++) {
          nonceList.push(hexToBytes(item.nonce[j]))
        }
        const yParity = hexToBytes(item.yParity)
        const r = hexToBytes(item.r)
        const s = hexToBytes(item.s)

        newAuthorizationList.push([chainId, addressBytes, nonceList, yParity, r, s])
      }
      bufferAuthorizationList = newAuthorizationList
    } else {
      bufferAuthorizationList = authorizationList ?? []
      // build the JSON
      const json: AuthorizationList = []
      for (let i = 0; i < bufferAuthorizationList.length; i++) {
        const data = bufferAuthorizationList[i]
        const chainId = bytesToHex(data[0])
        const address = bytesToHex(data[1])
        const nonces = data[2]
        const nonceList: PrefixedHexString[] = []
        for (let j = 0; j < nonces.length; j++) {
          nonceList.push(bytesToHex(nonces[j]))
        }
        const yParity = bytesToHex(data[3])
        const r = bytesToHex(data[4])
        const s = bytesToHex(data[5])
        const jsonItem: AuthorizationListItem = {
          chainId,
          address,
          nonce: nonceList,
          yParity,
          r,
          s,
        }
        json.push(jsonItem)
      }
      AuthorizationListJSON = json
    }

    return {
      AuthorizationListJSON,
      authorizationList: bufferAuthorizationList,
    }
  }

  public static verifyAuthorizationList(authorizationList: AuthorizationListBytes) {
    for (let key = 0; key < authorizationList.length; key++) {
      const authorizationListItem = authorizationList[key]
      const address = authorizationListItem[1]
      const nonceList = authorizationListItem[2]
      const yParity = authorizationListItem[3]
      const r = authorizationListItem[4]
      const s = authorizationListItem[5]
      validateNoLeadingZeroes({ yParity, r, s })
      if (address.length !== 20) {
        throw new Error('Invalid EIP-7702 transaction: address length should be 20 bytes')
      }
      if (nonceList.length > 1) {
        throw new Error('Invalid EIP-7702 transaction: nonce list should consist of at most 1 item')
      } else if (nonceList.length === 1) {
        validateNoLeadingZeroes({ nonce: nonceList[0] })
      }
    }
  }

  public static getDataGasEIP7702(authorityList: AuthorizationListBytes, common: Common): number {
    const perAuthBaseCost = common.param('perAuthBaseGas')
    return authorityList.length * Number(perAuthBaseCost)
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
        throw new Error(`${key} cannot be an array`)
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
