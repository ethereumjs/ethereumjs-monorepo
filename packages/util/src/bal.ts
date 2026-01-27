import { RLP } from '@ethereumjs/rlp'
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
    nonceChanges: [BlockAccessIndex, Nonce][]
    balanceChanges: [BlockAccessIndex, Balance][]
    codeChanges: [BlockAccessIndex, ByteCode][]
    storageChanges: Record<StorageKey, [BlockAccessIndex, StorageValue][]>
    storageReads: Set<StorageKey>
  }
>

/**
 * Structural helper class for block level access lists
 *
 * EXPERIMENTAL: DO NOT USE IN PRODUCTION!
 */
export class BlockLevelAccessList {
  public accesses: Accesses

  constructor() {
    this.accesses = {}
  }

  /**
   * Serializes the block level access list to RLP.
   *
   * @returns the RLP encoded block level access list
   */
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

  /**
   * Returns the raw block level access list with values
   * correctly sorted.
   *
   * @returns the raw block level access list
   */
  public raw(): BlockAccessList {
    const bal: BlockAccessList = []

    for (const address in Object.keys(this.accesses).sort()) {
      const data = this.accesses[address]

      // Format storage changes: [slot, [[index, value], ...]]
      //  storage_changes = [[slot, sorted(changes)]
      //  for slot, changes in sorted(data['storage_writes'].items())]
      const storageChanges: SlotChanges[] = Object.entries(data.storageChanges)
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([slot, changes]) => [slot, changes.sort((a, b) => a[0] - b[0])])

      bal.push([
        address,
        storageChanges,
        Array.from(data.storageReads),
        data.balanceChanges,
        data.nonceChanges,
        data.codeChanges,
      ])
    }

    return bal
  }

  public addAddress(address: Address): void {
    if (this.accesses[address] !== undefined) {
      return
    }
    this.accesses[address] = {
      storageChanges: {},
      storageReads: new Set(),
      balanceChanges: [],
      nonceChanges: [],
      codeChanges: [],
    }
  }

  public addStorageWrite(
    address: Address,
    storageKey: StorageKey,
    value: StorageValue,
    blockAccessIndex: BlockAccessIndex,
  ): void {
    this.accesses[address].storageChanges[storageKey].push([blockAccessIndex, value])
  }

  public addStorageRead(address: Address, storageKey: StorageKey): void {
    this.accesses[address].storageReads.add(storageKey)
  }

  public addBalanceChange(
    address: Address,
    balance: Balance,
    blockAccessIndex: BlockAccessIndex,
  ): void {
    this.accesses[address].balanceChanges.push([blockAccessIndex, balance])
  }

  public addNonceChange(address: Address, nonce: Nonce, blockAccessIndex: BlockAccessIndex): void {
    this.accesses[address].nonceChanges.push([blockAccessIndex, nonce])
  }

  public addCodeChange(address: Address, code: ByteCode, blockAccessIndex: BlockAccessIndex): void {
    this.accesses[address].codeChanges.push([blockAccessIndex, code])
  }
}

export function createBlockLevelAccessList(): BlockLevelAccessList {
  return new BlockLevelAccessList()
}
