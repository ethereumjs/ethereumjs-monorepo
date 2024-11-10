import { Address, bytesToBigInt, toBytes } from '@ethereumjs/util'

import { Feature } from '../dataContainerTypes.js'

import type { AccessListInterface } from '../dataContainerTypes.js'

const accessListFeatures = new Set<Feature>([
  Feature.ECDSASignable,
  Feature.LegacyGasMarket,
  Feature.AccessLists,
])

export class AccessList2930Container implements AccessListInterface {}
