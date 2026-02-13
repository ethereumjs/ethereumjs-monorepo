import type { PrefixedHexString } from '../types.ts'

// Base types which can be used for JSON, internal representation and raw format.
type BALAddressHex = PrefixedHexString // bytes20
type BALStorageKeyBytes = Uint8Array // uint256
type BALStorageKeyHex = PrefixedHexString // uint256
type BALStorageValueBytes = Uint8Array // uint256
type BALStorageValueHex = PrefixedHexString // uint256 as hex
type BALAccessIndexNumber = number // uint16
type BALAccessIndexHex = PrefixedHexString // uint16 as hex d
type BALBalanceBigInt = bigint // uint256 as bigint
type BALBalanceHex = PrefixedHexString // uint256 as hex
type BALNonceBigInt = bigint // uint64 as bigint
type BALNonceHex = PrefixedHexString // uint64 as hex
type BALByteCodeBytes = Uint8Array // bytes
type BALByteCodeHex = PrefixedHexString // bytes as hex

// Change types which can be used for internal representation and raw format.
type BALRawStorageChange = [BALAccessIndexNumber, BALStorageValueBytes]
type BALRawBalanceChange = [BALAccessIndexNumber, BALBalanceHex]
type BALRawNonceChange = [BALAccessIndexNumber, BALNonceHex]
type BALRawCodeChange = [BALAccessIndexNumber, BALByteCodeBytes]
type BALRawSlotChanges = [BALStorageKeyHex, BALRawStorageChange[]]

// Core data format for the raw format.
type BALRawAccountChanges = [
  BALAddressHex,
  BALRawSlotChanges[],
  BALStorageKeyHex[],
  BALRawBalanceChange[],
  BALRawNonceChange[],
  BALRawCodeChange[],
]
type BALRawBlockAccessList = BALRawAccountChanges[]

// Internal representation of the access list.
type Accesses = Record<
  BALAddressHex,
  {
    nonceChanges: Map<BALAccessIndexNumber, BALNonceHex>
    balanceChanges: Map<BALAccessIndexNumber, BALBalanceHex>
    codeChanges: BALRawCodeChange[]
    storageChanges: Record<BALStorageKeyHex, BALRawStorageChange[]>
    storageReads: Set<BALStorageKeyHex>
  }
>

// JSON representation types (all numeric values as hex strings for JSON serialization)
// JSON change types
interface BALJSONBalanceChange {
  blockAccessIndex: BALAccessIndexHex
  postBalance: BALBalanceHex
}

interface BALJSONNonceChange {
  blockAccessIndex: BALAccessIndexHex
  postNonce: BALNonceHex
}

interface BALJSONCodeChange {
  blockAccessIndex: BALAccessIndexHex
  newCode: BALByteCodeHex
}

interface BALJSONStorageChange {
  blockAccessIndex: BALAccessIndexHex
  postValue: BALStorageValueHex
}

interface BALJSONSlotChanges {
  slot: BALStorageKeyHex
  slotChanges: BALJSONStorageChange[]
}

// JSON representation of account changes
interface BALJSONAccountChanges {
  address: BALAddressHex
  balanceChanges: BALJSONBalanceChange[]
  nonceChanges: BALJSONNonceChange[]
  codeChanges: BALJSONCodeChange[]
  storageChanges: BALJSONSlotChanges[]
  storageReads: BALStorageKeyHex[]
}

// Top level JSON type
type BALJSONBlockAccessList = BALJSONAccountChanges[]

// Address to ignore
export const SYSTEM_ADDRESS = '0xfffffffffffffffffffffffffffffffffffffffe' as BALAddressHex

// Re-export JSON types for external use
export type {
  Accesses,
  BALAccessIndexNumber,
  BALAddressHex,
  BALBalanceBigInt,
  BALBalanceHex,
  BALByteCodeBytes,
  BALJSONAccountChanges,
  BALJSONBalanceChange,
  BALJSONBlockAccessList,
  BALJSONCodeChange,
  BALJSONNonceChange,
  BALJSONSlotChanges,
  BALJSONStorageChange,
  BALNonceBigInt,
  BALNonceHex,
  BALRawAccountChanges,
  BALRawBalanceChange,
  BALRawBlockAccessList,
  BALRawCodeChange,
  BALRawNonceChange,
  BALRawSlotChanges,
  BALRawStorageChange,
  BALStorageKeyBytes,
  BALStorageKeyHex,
  BALStorageValueBytes,
}
