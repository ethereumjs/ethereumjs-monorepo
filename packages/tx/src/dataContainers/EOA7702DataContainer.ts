import { RLP } from '@ethereumjs/rlp'
import { Address, bytesToBigInt, toBytes } from '@ethereumjs/util'

import { Feature } from '../dataContainerTypes.js'
import { TransactionType } from '../types.js'
import { AccessLists, AuthorizationLists } from '../util.js'

import type {
  AccessList2930Interface,
  AuthorizationListInterface,
  DefaultContainerInterface,
  ECDSAMaybeSignedInterface,
  ECDSASignedInterface,
  FeeMarketInterface,
  ToInterface,
  TxConstructorFields,
  TxContainerMethods,
} from '../dataContainerTypes.js'
import type { AccessListBytes, AuthorizationListBytes, TxOptions } from '../types.js'

type TxType = TransactionType.EOACodeEIP7702

const feeMarketFeatures = new Set<Feature>([
  Feature.ECDSASignable,
  Feature.FeeMarket,
  Feature.AccessLists,
  Feature.EOACode,
])

export class EOACode7702Container
  implements
    TxContainerMethods,
    DefaultContainerInterface,
    ToInterface,
    FeeMarketInterface,
    ECDSAMaybeSignedInterface,
    AccessList2930Interface,
    AuthorizationListInterface
{
  public type: number = TransactionType.EOACodeEIP7702 // Legacy tx type

  // Tx data part (part of the RLP)
  public readonly maxFeePerGas: bigint
  public readonly maxPriorityFeePerGas: bigint
  public readonly nonce: bigint
  public readonly gasLimit: bigint
  public readonly value: bigint
  public readonly data: Uint8Array
  public readonly to: Address
  public readonly accessList: AccessListBytes
  public readonly authorizationList: AuthorizationListBytes
  public readonly chainId: bigint

  // Props only for signed txs
  public readonly v?: bigint
  public readonly r?: bigint
  public readonly s?: bigint

  constructor(txData: TxConstructorFields[TxType], txOptions: TxOptions) {
    const { nonce, gasLimit, to, value, data, v, r, s, maxPriorityFeePerGas, maxFeePerGas } = txData

    // Set the tx properties
    const toB = toBytes(to)
    if (toB.length === 0) {
      // TODO: better check
      throw new Error('The to: field should be defined')
    }
    this.to = new Address(toB)

    this.nonce = bytesToBigInt(toBytes(nonce))
    this.gasLimit = bytesToBigInt(toBytes(gasLimit))
    this.value = bytesToBigInt(toBytes(value))
    this.data = toBytes(data === '' ? '0x' : data)
    this.maxFeePerGas = bytesToBigInt(toBytes(maxFeePerGas))
    this.maxPriorityFeePerGas = bytesToBigInt(toBytes(maxPriorityFeePerGas))

    // Set signature values (if the tx is signed)

    const vB = toBytes(v)
    const rB = toBytes(r)
    const sB = toBytes(s)
    this.v = vB.length > 0 ? bytesToBigInt(vB) : undefined
    this.r = rB.length > 0 ? bytesToBigInt(rB) : undefined
    this.s = sB.length > 0 ? bytesToBigInt(sB) : undefined

    const { chainId, accessList, authorizationList } = txData

    // NOTE: previously there was a check against common's chainId, this is not here
    // Common is not available in the tx container
    // Likely, we should now check this chain id when signing the tx (to prevent people signing on the wrong chain)
    this.chainId = bytesToBigInt(toBytes(chainId))

    const accessListData = AccessLists.getAccessListData(accessList ?? [])
    this.accessList = accessListData.accessList

    // Populate the authority list fields
    const authorizationListData = AuthorizationLists.getAuthorizationListData(
      authorizationList ?? [],
    )
    this.authorizationList = authorizationListData.authorizationList
  }

  raw() {
    // TODO
    return [new Uint8Array(), new Uint8Array()]
  }
  serialize() {
    return RLP.encode(this.raw())
  }

  supports(feature: Feature) {
    return feeMarketFeatures.has(feature)
  }

  toJSON() {
    return {}
  }

  // TODO likely add common here: should check against the chain id in this container to prevent
  // signing against the wrong chain id
  sign(privateKey: Uint8Array): EOACode7702Container & ECDSASignedInterface {
    // TODO
    return this as EOACode7702Container & ECDSASignedInterface // Type return value to have v/r/s set
  }
}
