import { RLP } from '@ethereumjs/rlp'
import { keccak_256 } from '@noble/hashes/sha3.js'
import {
  bigIntToBytes,
  bigIntToHex,
  bytesToHex,
  bytesToInt,
  hexToBigInt,
  hexToBytes,
} from './bytes.ts'
import { padToEven } from './internal.ts'
import type { PrefixedHexString } from './types.ts'

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
export type Accesses = Record<
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
export type BALJSONBlockAccessList = BALJSONAccountChanges[]

// Re-export JSON types for external use
export type {
  BALJSONAccountChanges,
  BALJSONStorageChange,
  BALJSONSlotChanges,
  BALJSONBalanceChange,
  BALJSONNonceChange,
  BALJSONCodeChange,
}

/**
 * Structural helper class for block level access lists
 *
 * EXPERIMENTAL: DO NOT USE IN PRODUCTION!
 */
export class BlockLevelAccessList {
  public accesses: Accesses
  public blockAccessIndex: number
  constructor(accesses: Accesses = {}) {
    this.accesses = accesses
    this.blockAccessIndex = 0
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
  public raw(): BALRawBlockAccessList {
    const bal: BALRawBlockAccessList = []

    for (const address of Object.keys(this.accesses)
      .sort()
      .filter((address) => address !== systemAddress)) {
      const data = this.accesses[address as BALAddressHex]

      // Format storage changes: [slot, [[index, value], ...]]
      // Normalize slot keys for canonical RLP encoding (0 -> empty bytes)
      const storageChanges = (
        Object.entries(data.storageChanges) as [BALStorageKeyHex, BALRawStorageChange[]][]
      )
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([slot, changes]) => [normalizeHexForRLP(slot), changes.sort((a, b) => a[0] - b[0])])

      // Normalize storage reads for canonical RLP encoding (0 -> empty bytes)
      const storageReads = Array.from(data.storageReads)
        .map(normalizeHexForRLP)
        .sort((a, b) => Number(hexToBigInt(a as `0x${string}`) - hexToBigInt(b as `0x${string}`)))

      const balanceChanges = Array.from(data.balanceChanges.entries()).map(([index, balance]) => [
        index,
        balance,
      ])
      const nonceChanges = Array.from(data.nonceChanges.entries()).map(([index, nonce]) => [
        index,
        nonce,
      ])
      bal.push([
        address as BALAddressHex,
        storageChanges,
        storageReads,
        balanceChanges,
        nonceChanges,
        data.codeChanges,
      ] as BALRawAccountChanges)
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
      balanceChanges: new Map(),
      nonceChanges: new Map(),
      codeChanges: [],
    }
  }

  public addStorageWrite(
    address: BALAddressHex,
    storageKey: BALStorageKeyBytes,
    value: BALStorageValueBytes,
    blockAccessIndex: BALAccessIndexNumber,
  ): void {
    const strippedKey = normalizeStorageKeyHex(bytesToHex(stripLeadingZeros(storageKey)))
    const strippedValue = stripLeadingZeros(value)
    if (strippedValue.length === 0) {
      this.addStorageRead(address, storageKey)
      return
    }
    if (this.accesses[address] === undefined) {
      this.addAddress(address)
    }
    if (this.accesses[address].storageChanges[strippedKey] === undefined) {
      this.accesses[address].storageChanges[strippedKey] = []
    }
    this.accesses[address].storageChanges[strippedKey].push([blockAccessIndex, strippedValue])
    // Per EIP-7928: A successful storage write subsumes any prior read of the same slot.
    // Remove the slot from storageReads since it's now in storageChanges.
    this.accesses[address].storageReads.delete(strippedKey)
  }

  public addStorageRead(address: BALAddressHex, storageKey: BALStorageKeyBytes): void {
    if (this.accesses[address] === undefined) {
      this.addAddress(address)
    }
    const strippedKey = normalizeStorageKeyHex(bytesToHex(stripLeadingZeros(storageKey)))
    // Per EIP-7928: Don't add to storageReads if the slot was already written.
    // A write subsumes any reads of the same slot.
    if (this.accesses[address].storageChanges[strippedKey] === undefined) {
      this.accesses[address].storageReads.add(strippedKey)
    }
  }

  public addBalanceChange(
    address: BALAddressHex,
    balance: BALBalanceBigInt,
    blockAccessIndex: BALAccessIndexNumber,
  ): void {
    if (this.accesses[address] === undefined) {
      this.addAddress(address)
    }
    this.accesses[address].balanceChanges.set(
      blockAccessIndex,
      padToEvenHex(bytesToHex(stripLeadingZeros(bigIntToBytes(balance)))),
    )
  }

  public addNonceChange(
    address: BALAddressHex,
    nonce: BALNonceBigInt,
    blockAccessIndex: BALAccessIndexNumber,
  ): void {
    if (this.accesses[address] === undefined) {
      this.addAddress(address)
    }
    this.accesses[address].nonceChanges.set(blockAccessIndex, padToEvenHex(bigIntToHex(nonce)))
  }

  public addCodeChange(
    address: BALAddressHex,
    code: BALByteCodeBytes,
    blockAccessIndex: BALAccessIndexNumber,
  ): void {
    if (this.accesses[address] === undefined) {
      this.addAddress(address)
    }
    this.accesses[address].codeChanges.push([blockAccessIndex, code])
  }
}

export function createBlockLevelAccessList(): BlockLevelAccessList {
  return new BlockLevelAccessList()
}

export function createBlockLevelAccessListFromJSON(
  json: BALJSONBlockAccessList,
): BlockLevelAccessList {
  const bal = new BlockLevelAccessList()

  for (const account of json) {
    bal.addAddress(account.address)
    const access = bal.accesses[account.address]

    for (const slotChange of account.storageChanges) {
      const normalizedSlot = normalizeStorageKeyHex(slotChange.slot)
      if (access.storageChanges[normalizedSlot] === undefined) {
        access.storageChanges[normalizedSlot] = []
      }
      for (const change of slotChange.slotChanges) {
        access.storageChanges[normalizedSlot].push([
          parseInt(change.blockAccessIndex, 16),
          hexToBytes(change.postValue),
        ])
      }
    }

    for (const slot of account.storageReads) {
      access.storageReads.add(normalizeStorageKeyHex(slot))
    }

    for (const change of account.balanceChanges) {
      access.balanceChanges.set(
        parseInt(change.blockAccessIndex, 16),
        padToEvenHex(change.postBalance),
      )
    }

    for (const change of account.nonceChanges) {
      access.nonceChanges.set(parseInt(change.blockAccessIndex, 16), padToEvenHex(change.postNonce))
    }

    for (const change of account.codeChanges) {
      access.codeChanges.push([parseInt(change.blockAccessIndex, 16), hexToBytes(change.newCode)])
    }
  }

  return bal
}

/**
 * Normalizes a hex string for canonical RLP encoding.
 * In RLP, the integer 0 must be encoded as empty bytes (0x80), not as a single zero byte (0x00).
 * This function converts hex strings representing zero to empty Uint8Array.
 */
function normalizeHexForRLP(hex: PrefixedHexString): PrefixedHexString | Uint8Array {
  // Strip 0x prefix and all leading zeros
  const stripped = hex.slice(2).replace(/^0+/, '')
  if (stripped === '') {
    // Value is zero - return empty array for canonical RLP encoding
    return Uint8Array.from([])
  }
  return hex
}

export function createBlockLevelAccessListFromRLP(rlp: Uint8Array): BlockLevelAccessList {
  const decoded = RLP.decode(rlp) as Array<
    [
      Uint8Array, // address
      Array<[Uint8Array, Array<[Uint8Array, Uint8Array]>]>, // storage changes
      Uint8Array[], // storage reads
      Array<[Uint8Array, Uint8Array]>, // balance changes
      Array<[Uint8Array, Uint8Array]>, // nonce changes
      Array<[Uint8Array, Uint8Array]>, // code changes
    ]
  >

  const bal = new BlockLevelAccessList()

  for (const account of decoded) {
    const [
      addressBytes,
      storageChangesRaw,
      storageReadsRaw,
      balanceChangesRaw,
      nonceChangesRaw,
      codeChangesRaw,
    ] = account
    const address = bytesToHex(addressBytes) as BALAddressHex
    bal.addAddress(address)
    const access = bal.accesses[address]

    for (const [slotBytes, slotChangesRaw] of storageChangesRaw) {
      const slot = normalizeStorageKeyHex(bytesToHex(slotBytes))
      if (access.storageChanges[slot] === undefined) {
        access.storageChanges[slot] = []
      }
      for (const [indexBytes, valueBytes] of slotChangesRaw) {
        access.storageChanges[slot].push([bytesToInt(indexBytes), valueBytes])
      }
    }

    for (const slotBytes of storageReadsRaw) {
      access.storageReads.add(normalizeStorageKeyHex(bytesToHex(slotBytes)))
    }

    for (const [indexBytes, balanceBytes] of balanceChangesRaw) {
      access.balanceChanges.set(
        bytesToInt(indexBytes),
        padToEvenHex(bytesToHex(balanceBytes)) as BALBalanceHex,
      )
    }

    for (const [indexBytes, nonceBytes] of nonceChangesRaw) {
      access.nonceChanges.set(
        bytesToInt(indexBytes),
        padToEvenHex(bytesToHex(nonceBytes)) as BALNonceHex,
      )
    }

    for (const [indexBytes, codeBytes] of codeChangesRaw) {
      access.codeChanges.push([bytesToInt(indexBytes), codeBytes])
    }
  }

  return bal
}

function stripLeadingZeros(bytes: Uint8Array): Uint8Array {
  let first = bytes[0]
  while (bytes.length > 0 && first.toString() === '0') {
    bytes = bytes.slice(1)
    first = bytes[0]
  }
  return bytes
}

function padToEvenHex(hex: PrefixedHexString): PrefixedHexString {
  return `0x${padToEven(hex.slice(2))}`
}

/**
 * Normalizes a storage key hex string to ensure consistent even-length representation.
 * - "0x" (empty bytes) is kept as is
 * - "0x0" becomes "0x00"
 * - Any odd-length hex is padded to even (e.g., "0x1" → "0x01")
 */
function normalizeStorageKeyHex(hex: PrefixedHexString): BALStorageKeyHex {
  const stripped = hex.slice(2)
  // Empty string "0x" stays as is
  if (stripped === '') {
    return '0x' as BALStorageKeyHex
  }
  // Pad to even length (handles "0x0" → "0x00", "0x1" → "0x01", etc.)
  return `0x${padToEven(stripped)}` as BALStorageKeyHex
}

// Address to ignore
const systemAddress = '0xfffffffffffffffffffffffffffffffffffffffe'
