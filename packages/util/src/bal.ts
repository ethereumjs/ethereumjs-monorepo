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
import { SYSTEM_ADDRESS } from './constants.ts'
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
  private checkpoints: { accesses: Accesses; blockAccessIndex: number }[] = []
  // Track original (pre-transaction) balances for net-zero detection
  private originalBalances: Map<BALAddressHex, bigint> = new Map()
  // Track original code at the start of each blockAccessIndex for each address
  // Key format: `${address}-${blockAccessIndex}`
  private originalCodesAtIndex: Map<string, Uint8Array> = new Map()
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

  public checkpoint(): void {
    this.checkpoints.push({
      accesses: this.cloneAccesses(this.accesses),
      blockAccessIndex: this.blockAccessIndex,
    })
  }

  public commit(): void {
    if (this.checkpoints.length > 0) {
      this.checkpoints.pop()
    }
  }

  public revert(): void {
    const snapshot = this.checkpoints.pop()
    if (!snapshot) {
      return
    }
    const current = this.accesses
    this.accesses = snapshot.accesses
    this.blockAccessIndex = snapshot.blockAccessIndex

    // Preserve address touches and storage reads across reverts.
    // EIP-7928: When storage writes are reverted, the slot keys MUST still
    // appear in storageReads since the slots were accessed (SSTORE reads
    // the current value for gas calculation).
    for (const [address, access] of Object.entries(current)) {
      if (this.accesses[address as BALAddressHex] === undefined) {
        // Collect both explicit reads and slots that were written (but will be reverted)
        const allReads = new Set(access.storageReads)
        for (const slot of Object.keys(access.storageChanges)) {
          allReads.add(slot as BALStorageKeyHex)
        }
        this.accesses[address as BALAddressHex] = {
          nonceChanges: new Map(),
          balanceChanges: new Map(),
          codeChanges: [],
          storageChanges: {},
          storageReads: allReads,
        }
        continue
      }
      const target = this.accesses[address as BALAddressHex]
      // Preserve explicit storageReads
      for (const slot of access.storageReads) {
        target.storageReads.add(slot)
      }
      // EIP-7928: Convert reverted storageChanges to storageReads
      for (const slot of Object.keys(access.storageChanges)) {
        // Only add to reads if not already in the target's storageChanges
        // (a successful write subsumes a read)
        if (target.storageChanges[slot as BALStorageKeyHex] === undefined) {
          target.storageReads.add(slot as BALStorageKeyHex)
        }
      }
    }
  }

  private cloneAccesses(accesses: Accesses): Accesses {
    const cloned: Accesses = {}
    for (const [address, access] of Object.entries(accesses)) {
      const storageChanges: Record<BALStorageKeyHex, BALRawStorageChange[]> = {}
      for (const [slot, changes] of Object.entries(access.storageChanges)) {
        storageChanges[slot as BALStorageKeyHex] = changes.map(
          ([index, value]) => [index, value] as BALRawStorageChange,
        )
      }
      cloned[address as BALAddressHex] = {
        nonceChanges: new Map(access.nonceChanges),
        balanceChanges: new Map(access.balanceChanges),
        codeChanges: access.codeChanges.map(([index, code]) => [index, code] as BALRawCodeChange),
        storageChanges,
        storageReads: new Set(access.storageReads),
      }
    }
    return cloned
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
    originalValue?: BALStorageValueBytes,
  ): void {
    const strippedKey = normalizeStorageKeyHex(bytesToHex(stripLeadingZeros(storageKey)))
    const strippedValue = stripLeadingZeros(value)
    const strippedOriginal = originalValue ? stripLeadingZeros(originalValue) : undefined
    const isZeroWrite = strippedValue.length === 0

    // EIP-7928: Check if this is a no-op write (value equals pre-transaction value)
    // No-op writes should be recorded as reads, not changes.
    // Note: Both empty arrays (zero values) compare equal via bytesToHex
    let isNoOp = false
    if (strippedOriginal !== undefined) {
      // We have original value - compare properly
      isNoOp = bytesToHex(strippedValue) === bytesToHex(strippedOriginal)
    } else if (isZeroWrite) {
      // No original value provided and writing zero - likely a no-op for system contracts
      // reading empty slots. Treat as read for safety.
      isNoOp = true
    }

    // Only no-op writes (writing same value as original) are treated as reads
    // EIP-7928: Zeroing a slot (pre-value exists, post-value is zero) IS a write
    if (isNoOp) {
      // EIP-7928: If a slot is written back to its original value (net-zero change),
      // it should appear in storageReads, not storageChanges.
      // This handles nested calls where intermediate frames write different values
      // but the final value equals the original.
      if (this.accesses[address] !== undefined) {
        // Remove any existing storageChanges for this slot since final == original
        delete this.accesses[address].storageChanges[strippedKey]
      }
      this.addStorageRead(address, storageKey)
      return
    }
    if (this.accesses[address] === undefined) {
      this.addAddress(address)
    }
    if (this.accesses[address].storageChanges[strippedKey] === undefined) {
      this.accesses[address].storageChanges[strippedKey] = []
    }
    // For zero values, strippedValue is empty - this is correct for RLP encoding
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
    originalBalance?: BALBalanceBigInt,
  ): void {
    if (this.accesses[address] === undefined) {
      this.addAddress(address)
    }
    // EIP-7928: Track the original (pre-transaction) balance for net-zero detection
    // Only set if not already tracked (first call wins)
    if (originalBalance !== undefined && !this.originalBalances.has(address)) {
      this.originalBalances.set(address, originalBalance)
    }
    this.accesses[address].balanceChanges.set(
      blockAccessIndex,
      padToEvenHex(bytesToHex(stripLeadingZeros(bigIntToBytes(balance)))),
    )
  }

  /**
   * EIP-7928: Remove balance changes for addresses where final balance equals first balance.
   * Call this at the end of each transaction to clean up net-zero balance changes.
   */
  public cleanupNetZeroBalanceChanges(): void {
    for (const [address, originalBalance] of this.originalBalances.entries()) {
      const access = this.accesses[address]
      if (access === undefined || access.balanceChanges.size === 0) {
        continue
      }
      // Get the final balance (last entry in the balanceChanges map)
      const entries = Array.from(access.balanceChanges.values())
      const finalBalanceHex = entries[entries.length - 1]
      const finalBalance =
        finalBalanceHex === '0x' ? BigInt(0) : BigInt(`0x${finalBalanceHex.replace(/^0x/, '')}`)

      // EIP-7928: If final balance == original balance, remove all balanceChanges
      // but keep the address in the BAL
      if (finalBalance === originalBalance) {
        access.balanceChanges.clear()
      }
    }
    // Clear the tracking map for the next transaction
    this.originalBalances.clear()
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
    originalCode?: BALByteCodeBytes,
  ): void {
    if (this.accesses[address] === undefined) {
      this.addAddress(address)
    }
    const codeChanges = this.accesses[address].codeChanges

    // Track the original code at the start of this blockAccessIndex
    const trackingKey = `${address}-${blockAccessIndex}`
    if (!this.originalCodesAtIndex.has(trackingKey) && originalCode !== undefined) {
      this.originalCodesAtIndex.set(trackingKey, originalCode)
    }

    // Get the original code at the start of this blockAccessIndex
    const originalCodeAtIndex = this.originalCodesAtIndex.get(trackingKey)

    // Check if there's already a code change at this blockAccessIndex
    const existingIndex = codeChanges.findIndex(([idx]) => idx === blockAccessIndex)
    if (existingIndex !== -1) {
      // Check if the new code equals the original code at start of this blockAccessIndex
      // If so, remove the entry (net-zero change within this blockAccessIndex)
      if (
        originalCodeAtIndex !== undefined &&
        bytesToHex(code) === bytesToHex(originalCodeAtIndex)
      ) {
        codeChanges.splice(existingIndex, 1)
      } else {
        // Update the existing entry with the new code
        codeChanges[existingIndex] = [blockAccessIndex, code]
      }
    } else {
      // Add new entry, but only if code is actually different from originalCode
      if (originalCode !== undefined && bytesToHex(code) === bytesToHex(originalCode)) {
        // No actual change, don't record
        return
      }
      codeChanges.push([blockAccessIndex, code])
    }
  }

  /**
   * EIP-7928: For selfdestructed accounts, drop all state changes while
   * preserving read footprints. Any storageChanges are converted to storageReads.
   *
   * Per EIP-7928: "if the account had a positive balance pre-transaction,
   * the balance change to zero MUST be recorded."
   */
  /**
   * Converts the internal representation to the JSON format (BALJSONBlockAccessList).
   * Inverse of createBlockLevelAccessListFromJSON().
   */
  public toJSON(): BALJSONBlockAccessList {
    const result: BALJSONBlockAccessList = []

    for (const [address, access] of Object.entries(this.accesses)
      .sort(([a], [b]) => a.localeCompare(b))
      .filter(([addr]) => addr !== systemAddress)) {
      const storageChanges: BALJSONSlotChanges[] = (
        Object.entries(access.storageChanges) as [BALStorageKeyHex, BALRawStorageChange[]][]
      )
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([slot, changes]) => ({
          slot,
          slotChanges: changes
            .sort((a, b) => a[0] - b[0])
            .map(([index, value]) => ({
              blockAccessIndex: indexToHex(index),
              postValue: padToEvenHex(bytesToHex(value)),
            })),
        }))

      const storageReads: BALStorageKeyHex[] = Array.from(access.storageReads).sort((a, b) =>
        Number(
          (a === '0x' ? 0n : hexToBigInt(a as `0x${string}`)) -
            (b === '0x' ? 0n : hexToBigInt(b as `0x${string}`)),
        ),
      )

      const balanceChanges: BALJSONBalanceChange[] = Array.from(access.balanceChanges.entries())
        .sort(([a], [b]) => a - b)
        .map(([index, balance]) => ({
          blockAccessIndex: indexToHex(index),
          postBalance: balance,
        }))

      const nonceChanges: BALJSONNonceChange[] = Array.from(access.nonceChanges.entries())
        .sort(([a], [b]) => a - b)
        .map(([index, nonce]) => ({
          blockAccessIndex: indexToHex(index),
          postNonce: nonce,
        }))

      const codeChanges: BALJSONCodeChange[] = access.codeChanges.map(([index, code]) => ({
        blockAccessIndex: indexToHex(index),
        newCode: bytesToHex(code),
      }))

      result.push({
        address: address as BALAddressHex,
        nonceChanges,
        balanceChanges,
        codeChanges,
        storageChanges,
        storageReads,
      })
    }

    return result
  }

  public cleanupSelfdestructed(addresses: Array<BALAddressHex>): void {
    for (const address of addresses) {
      const access = this.accesses[address]
      if (access === undefined) {
        continue
      }

      // Convert any storageChanges into storageReads
      for (const slot of Object.keys(access.storageChanges)) {
        access.storageReads.add(slot as BALStorageKeyHex)
      }

      access.storageChanges = {}
      access.nonceChanges.clear()
      access.codeChanges = []

      // EIP-7928: If the account had a positive pre-transaction balance,
      // the balance change to zero MUST be recorded.
      // The balance change to 0 is already added during SELFDESTRUCT execution.
      // We only clear balance changes if pre-transaction balance was 0 (no actual change).
      const originalBalance = this.originalBalances.get(address)
      if (originalBalance === undefined || originalBalance === BigInt(0)) {
        // Pre-transaction balance was 0 or unknown - clear balance changes
        // (0 -> 0 is no change, so nothing to record)
        access.balanceChanges.clear()
      }
      // If originalBalance > 0, keep the balance changes (which should show balance = 0)
    }
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

// Address to ignore (canonical system address used by EIP-2935, EIP-7002, EIP-7251, EIP-7708, etc.)
const systemAddress = SYSTEM_ADDRESS

function indexToHex(index: BALAccessIndexNumber): BALAccessIndexHex {
  return padToEvenHex(`0x${index.toString(16)}`) as BALAccessIndexHex
}
