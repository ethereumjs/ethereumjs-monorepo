import { RLP } from '@ethereumjs/rlp'
import { keccak_256 } from '@noble/hashes/sha3.js'
import type { PrefixedHexString } from './types.ts'

// Base types which can be used for JSON, internal representation and raw format.
type BALAddressHex = PrefixedHexString // bytes20
type BALStorageKeyHex = PrefixedHexString // uint256
type BALStorageValueBytes = Uint8Array // uint256
type BALByteCodeBytes = Uint8Array // bytes
type BALAccessIndexNumber = number // uint16
type BALBalanceBigInt = bigint // uint256
type BALNonceBigInt = bigint // uint64

// Change types which can be used for internal representation and raw format.
type BALRawStorageChange = [BALAccessIndexNumber, BALStorageValueBytes]
type BALRawBalanceChange = [BALAccessIndexNumber, BALBalanceBigInt]
type BALRawNonceChange = [BALAccessIndexNumber, BALNonceBigInt]
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
type BlockAccessList = BALRawAccountChanges[]

// Internal representation of the access list.
type Accesses = Record<
  BALAddressHex,
  {
    nonceChanges: BALRawNonceChange[]
    balanceChanges: BALRawBalanceChange[]
    codeChanges: BALRawCodeChange[]
    storageChanges: Record<BALStorageKeyHex, BALRawStorageChange[]>
    storageReads: Set<BALStorageKeyHex>
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
      const data = this.accesses[address as BALAddressHex]

      // Format storage changes: [slot, [[index, value], ...]]
      //  storage_changes = [[slot, sorted(changes)]
      //  for slot, changes in sorted(data['storage_writes'].items())]
      const storageChanges: BALRawSlotChanges[] = (
        Object.entries(data.storageChanges) as [BALStorageKeyHex, BALRawStorageChange[]][]
      )
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([slot, changes]) => [slot, changes.sort((a, b) => a[0] - b[0])])

      bal.push([
        address as BALAddressHex,
        storageChanges,
        Array.from(data.storageReads),
        data.balanceChanges,
        data.nonceChanges,
        data.codeChanges,
      ])
    }

    return bal
  }

  public addAddress(address: BALAddressHex): void {
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
    address: BALAddressHex,
    storageKey: BALStorageKeyHex,
    value: BALStorageValueBytes,
    blockAccessIndex: BALAccessIndexNumber,
  ): void {
    this.accesses[address].storageChanges[storageKey].push([blockAccessIndex, value])
  }

  public addStorageRead(address: BALAddressHex, storageKey: BALStorageKeyHex): void {
    this.accesses[address].storageReads.add(storageKey)
  }

  public addBalanceChange(
    address: BALAddressHex,
    balance: BALBalanceBigInt,
    blockAccessIndex: BALAccessIndexNumber,
  ): void {
    this.accesses[address].balanceChanges.push([blockAccessIndex, balance])
  }

  public addNonceChange(
    address: BALAddressHex,
    nonce: BALNonceBigInt,
    blockAccessIndex: BALAccessIndexNumber,
  ): void {
    this.accesses[address].nonceChanges.push([blockAccessIndex, nonce])
  }

  public addCodeChange(
    address: BALAddressHex,
    code: BALByteCodeBytes,
    blockAccessIndex: BALAccessIndexNumber,
  ): void {
    this.accesses[address].codeChanges.push([blockAccessIndex, code])
  }
}

export function createBlockLevelAccessList(): BlockLevelAccessList {
  return new BlockLevelAccessList()
}
