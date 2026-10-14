import { createFeeMarket1559Tx, createFeeMarket1559TxFromRLP } from './1559/constructors.ts'
import { createAccessList2930Tx, createAccessList2930TxFromRLP } from './2930/constructors.ts'
import { createBlob4844Tx, createBlob4844TxFromRLP } from './4844/constructors.ts'
import { createEOACode7702Tx, createEOACode7702TxFromRLP } from './7702/constructors.ts'
import {
  createLegacyTx,
  createLegacyTxFromBytesArray,
  createLegacyTxFromRLP,
} from './legacy/constructors.ts'
import {
  TransactionType,
  isAccessList2930TxData,
  isBlob4844TxData,
  isEOACode7702TxData,
  isFeeMarket1559TxData,
  isLegacyTxData,
} from './types.ts'

import type {
  AccessList2930TxData,
  BlobEIP4844TxData,
  EOACode7702TxData,
  FeeMarketEIP1559TxData,
  LegacyTxData,
  Transaction,
  TxOptions,
  TypedTxData,
} from './types.ts'

export type TxTypeRegistryEntry = {
  isTxData: (data: TypedTxData) => boolean
  create: (data: TypedTxData, txOptions?: TxOptions) => Transaction[TransactionType]
  createFromRLP: (data: Uint8Array, txOptions?: TxOptions) => Transaction[TransactionType]
  createFromBytesArray?: (data: Uint8Array[], txOptions?: TxOptions) => Transaction[TransactionType]
}

export const TX_TYPE_REGISTRY = new Map<number, TxTypeRegistryEntry>([
  [
    TransactionType.Legacy,
    {
      isTxData: isLegacyTxData,
      create: (data, opts) => createLegacyTx(data as LegacyTxData, opts),
      createFromRLP: createLegacyTxFromRLP,
      createFromBytesArray: createLegacyTxFromBytesArray,
    },
  ],
  [
    TransactionType.AccessListEIP2930,
    {
      isTxData: isAccessList2930TxData,
      create: (data, opts) => createAccessList2930Tx(data as AccessList2930TxData, opts),
      createFromRLP: createAccessList2930TxFromRLP,
    },
  ],
  [
    TransactionType.FeeMarketEIP1559,
    {
      isTxData: isFeeMarket1559TxData,
      create: (data, opts) => createFeeMarket1559Tx(data as FeeMarketEIP1559TxData, opts),
      createFromRLP: createFeeMarket1559TxFromRLP,
    },
  ],
  [
    TransactionType.BlobEIP4844,
    {
      isTxData: isBlob4844TxData,
      create: (data, opts) => createBlob4844Tx(data as BlobEIP4844TxData, opts),
      createFromRLP: createBlob4844TxFromRLP,
    },
  ],
  [
    TransactionType.EOACodeEIP7702,
    {
      isTxData: isEOACode7702TxData,
      create: (data, opts) => createEOACode7702Tx(data as EOACode7702TxData, opts),
      createFromRLP: createEOACode7702TxFromRLP,
    },
  ],
])

export function registryEntryForTxData(txData: TypedTxData): TxTypeRegistryEntry | undefined {
  for (const entry of TX_TYPE_REGISTRY.values()) {
    if (entry.isTxData(txData)) {
      return entry
    }
  }
  return undefined
}

export function registryEntryForTypeByte(typeByte: number): TxTypeRegistryEntry | undefined {
  return TX_TYPE_REGISTRY.get(typeByte as TransactionType)
}
