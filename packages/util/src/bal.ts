import { type Input, RLP } from '@ethereumjs/rlp'
import { keccak_256 } from '@noble/hashes/sha3.js'

type Address = string // bytes20
type StorageKey = string // uint256
type StorageValue = Uint8Array // uint256
type ByteCode = Uint8Array // bytes
type BlockAccessIndex = number // uint16
type Balance = bigint // uint256
type Nonce = bigint // uint64

type StorageChange = [BlockAccessIndex, StorageValue]
type BalanceChange = [BlockAccessIndex, Balance]
type NonceChange = [BlockAccessIndex, Nonce]
type CodeChange = [BlockAccessIndex, ByteCode]
type SlotChanges = [StorageKey, StorageChange[]]

type AccountChanges = [
  Address,
  SlotChanges[],
  StorageKey[],
  BalanceChange[],
  NonceChange[],
  CodeChange[],
]

type BlockAccessList = AccountChanges[]

type Accesses = Record<
  Address,
  {
    storageWrites: Record<StorageKey, [BlockAccessIndex, StorageValue][]>
    storageReads: Set<StorageKey>
    balanceChanges: [BlockAccessIndex, Balance][]
    nonceChanges: [BlockAccessIndex, Nonce][]
    codeChanges: [BlockAccessIndex, ByteCode][]
  }
>

/**
 * Structural helper class for block level access lists
 *
 * EXPERIMENTAL: DO NOT USE IN PRODUCTION!
 */
export class BlockLevelAccessList {
  public raw(): Uint8Array[] {
    return []
  }

  public serialize(): Uint8Array {
    return RLP.encode(this.raw())
  }

  /**
   * This hash is used in the block header
   *
   * @returns the hash of the serialized block level access list
   */
  public hash(): Uint8Array {
    return keccak_256(this.serialize())
  }
}

export function createBlockLevelAccessList(): BlockLevelAccessList {
  return new BlockLevelAccessList()
}
