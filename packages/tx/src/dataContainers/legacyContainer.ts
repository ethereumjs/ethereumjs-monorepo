import { RLP } from '@ethereumjs/rlp'
import { Address, bytesToBigInt, toBytes } from '@ethereumjs/util'

import { Feature } from '../dataContainerTypes.js'
import { TransactionType } from '../types.js'

import type {
  ContractCreationContainerInterface,
  DefaultContainerInterface,
  ECDSAContainerInterface,
  LegacyContainerDataFields,
  LegacyGasMarketInterface,
  TxDataContainer,
} from '../dataContainerTypes.js'
import type { TxOptions } from '../types.js'

const legacyFeatures = new Set<Feature>([Feature.ECDSASignable, Feature.LegacyGasMarket])

export class LegacyDataContainer
  implements
    TxDataContainer,
    DefaultContainerInterface,
    ContractCreationContainerInterface,
    ECDSAContainerInterface,
    LegacyGasMarketInterface
{
  public type: number = TransactionType.Legacy // Legacy tx type

  // Tx data part (part of the RLP)
  public readonly gasPrice: bigint
  public readonly nonce: bigint
  public readonly gasLimit: bigint
  public readonly value: bigint
  public readonly data: Uint8Array
  // TODO fix type (how to do this? need to somehow override the interface)
  public readonly to: Address | null

  // Props only for signed txs
  public readonly v?: bigint
  public readonly r?: bigint
  public readonly s?: bigint

  // TODO: verify if txOptions is necessary
  // TODO (optimizing): for reach tx we auto-convert the input values to the target values (mostly bigints)
  // Is this necessary? What if we need the unconverted values? Convert it on the fly?
  constructor(txData: LegacyContainerDataFields, txOptions: TxOptions) {
    const { nonce, gasLimit, to, value, data, v, r, s } = txData

    // Set the tx properties
    const toB = toBytes(to === '' ? '0x' : to)
    this.to = toB.length > 0 ? new Address(toB) : null

    this.nonce = bytesToBigInt(toBytes(nonce))
    this.gasLimit = bytesToBigInt(toBytes(gasLimit))
    this.value = bytesToBigInt(toBytes(value))
    this.data = toBytes(data === '' ? '0x' : data)
    this.gasPrice = bytesToBigInt(toBytes(txData.gasPrice))

    // Set signature values (if the tx is signed)

    const vB = toBytes(v)
    const rB = toBytes(r)
    const sB = toBytes(s)
    this.v = vB.length > 0 ? bytesToBigInt(vB) : undefined
    this.r = rB.length > 0 ? bytesToBigInt(rB) : undefined
    this.s = sB.length > 0 ? bytesToBigInt(sB) : undefined
  }

  raw() {
    // TODO
    return []
  }
  serialize() {
    return RLP.encode(this.raw())
  }

  supports(feature: Feature) {
    return legacyFeatures.has(feature)
  }

  toJSON() {
    return {}
  }
}
