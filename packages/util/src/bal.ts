import { RLP } from '@ethereumjs/rlp'
import { keccak_256 } from '@noble/hashes/sha3.js'
import { bigIntToBytes, bigIntToHex, bytesToHex, bytesToInt, hexToBytes } from './bytes.ts'
import { padToEven } from './internal.ts'
import type { PrefixedHexString } from './types.ts'

// ============================================================
// Proposal 2c: Decoupled Access Map + State Diff
//
// BlockAccessList = [
//   List[TxAccessSet],    # per-phase access sets (keys only)
//   List[AccountDiff]     # per-block state diffs (final values)
// ]
//
// TxAccessSet = [
//   List[Address],
//   List[[Address, List[StorageKey]]]
// ]
//
// AccountDiff = [
//   Address,
//   List[[StorageKey, StorageValue]],
//   List[Balance],    # [final] or []
//   List[Nonce],      # [final] or []
//   List[Bytecode]    # [final] or []
// ]
// ============================================================

// --- Base types ---
type BALAddressHex = PrefixedHexString
type BALStorageKeyHex = PrefixedHexString
type BALBalanceHex = PrefixedHexString
type BALNonceHex = PrefixedHexString
type BALByteCodeHex = PrefixedHexString

// --- Internal representation ---

export interface PhaseAccessSet {
  addresses: Set<BALAddressHex>
  storageSlots: Map<BALAddressHex, Set<BALStorageKeyHex>>
}

export interface AccountStateDiff {
  storageDiffs: Map<BALStorageKeyHex, Uint8Array>
  balance?: BALBalanceHex
  nonce?: BALNonceHex
  code?: Uint8Array
}

// --- JSON types ---

export interface BALJSONStorageAccess {
  address: BALAddressHex
  slots: BALStorageKeyHex[]
}

export interface BALJSONTxAccessSet {
  addresses: BALAddressHex[]
  storageSlots: BALJSONStorageAccess[]
}

export interface BALJSONStorageDiff {
  slot: BALStorageKeyHex
  value: PrefixedHexString
}

export interface BALJSONAccountDiff {
  address: BALAddressHex
  storageDiffs: BALJSONStorageDiff[]
  balance?: BALBalanceHex
  nonce?: BALNonceHex
  code?: BALByteCodeHex
}

export interface BALJSONBlockAccessList {
  accessMap: BALJSONTxAccessSet[]
  stateDiff: BALJSONAccountDiff[]
}

/**
 * Block-Level Access List (Proposal 2c: Decoupled Access Map + State Diff)
 *
 * Two orthogonal components in a single structure:
 *   - Access Map: per-phase append-only tracking of which addresses/slots were accessed
 *   - State Diff: per-block final values for fields that changed vs pre-block state
 *
 * EXPERIMENTAL: DO NOT USE IN PRODUCTION!
 */
export class BlockLevelAccessList {
  private _accessMap: PhaseAccessSet[]
  private _stateDiff: Map<BALAddressHex, AccountStateDiff>
  private _currentPhase: number

  constructor() {
    this._accessMap = []
    this._stateDiff = new Map()
    this._currentPhase = 0
  }

  get accessMap(): PhaseAccessSet[] {
    return this._accessMap
  }
  get stateDiff(): Map<BALAddressHex, AccountStateDiff> {
    return this._stateDiff
  }
  get currentPhase(): number {
    return this._currentPhase
  }

  // --- Phase management ---

  setPhase(phase: number): void {
    this._currentPhase = phase
    this.ensurePhase(phase)
  }

  private ensurePhase(phase: number): void {
    while (this._accessMap.length <= phase) {
      this._accessMap.push({ addresses: new Set(), storageSlots: new Map() })
    }
  }

  // --- Rule 1: Access tracking (append-only during execution) ---

  trackAddress(address: BALAddressHex): void {
    if (address === SYSTEM_ADDRESS) return
    this.ensurePhase(this._currentPhase)
    this._accessMap[this._currentPhase].addresses.add(address)
  }

  trackStorageSlot(address: BALAddressHex, storageKey: Uint8Array | BALStorageKeyHex): void {
    this.trackAddress(address)
    const key =
      typeof storageKey === 'string'
        ? normalizeStorageKeyHex(storageKey)
        : normalizeStorageKeyHex(bytesToHex(stripLeadingZeros(storageKey)))
    const phase = this._accessMap[this._currentPhase]
    if (!phase.storageSlots.has(address)) {
      phase.storageSlots.set(address, new Set())
    }
    phase.storageSlots.get(address)!.add(key)
  }

  // --- Rule 2: State diff (post-block comparison) ---

  private ensureAccountDiff(address: BALAddressHex): AccountStateDiff {
    if (!this._stateDiff.has(address)) {
      this._stateDiff.set(address, { storageDiffs: new Map() })
    }
    return this._stateDiff.get(address)!
  }

  setStorageDiff(
    address: BALAddressHex,
    slot: Uint8Array | BALStorageKeyHex,
    finalValue: Uint8Array,
  ): void {
    const key =
      typeof slot === 'string'
        ? normalizeStorageKeyHex(slot)
        : normalizeStorageKeyHex(bytesToHex(stripLeadingZeros(slot)))
    this.ensureAccountDiff(address).storageDiffs.set(key, stripLeadingZeros(finalValue))
  }

  setBalanceDiff(address: BALAddressHex, finalBalance: bigint): void {
    this.ensureAccountDiff(address).balance = padToEvenHex(
      bytesToHex(stripLeadingZeros(bigIntToBytes(finalBalance))),
    )
  }

  setNonceDiff(address: BALAddressHex, finalNonce: bigint): void {
    this.ensureAccountDiff(address).nonce = padToEvenHex(bigIntToHex(finalNonce))
  }

  setCodeDiff(address: BALAddressHex, finalCode: Uint8Array): void {
    this.ensureAccountDiff(address).code = finalCode
  }

  // --- Serialization ---

  /**
   * Returns the raw nested-array representation suitable for RLP encoding.
   * Structure: [accessMap, stateDiff]
   */
  public raw(): [unknown[], unknown[]] {
    // Build access map: List[TxAccessSet]
    const rawAccessMap: unknown[] = []
    for (const phase of this._accessMap) {
      const addresses = Array.from(phase.addresses)
        .filter((a) => a !== SYSTEM_ADDRESS)
        .sort()
      const storageSlots = Array.from(phase.storageSlots.entries())
        .filter(([a]) => a !== SYSTEM_ADDRESS)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([addr, slots]) => [addr, Array.from(slots).sort().map(normalizeHexForRLP)])
      rawAccessMap.push([addresses, storageSlots])
    }

    // Build state diff: List[AccountDiff]
    const rawStateDiff: unknown[] = []
    for (const [address, diff] of Array.from(this._stateDiff.entries())
      .filter(([a]) => a !== SYSTEM_ADDRESS)
      .sort(([a], [b]) => a.localeCompare(b))) {
      const storageDiffs = Array.from(diff.storageDiffs.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([slot, value]) => [normalizeHexForRLP(slot), value])
      const balance = diff.balance !== undefined ? [diff.balance] : []
      const nonce = diff.nonce !== undefined ? [diff.nonce] : []
      const code = diff.code !== undefined ? [diff.code] : []
      rawStateDiff.push([address, storageDiffs, balance, nonce, code])
    }

    return [rawAccessMap, rawStateDiff]
  }

  public serialize(): Uint8Array {
    return RLP.encode(this.raw() as never)
  }

  public hash(): Uint8Array {
    return keccak_256(this.serialize())
  }

  // --- JSON ---

  public toJSON(): BALJSONBlockAccessList {
    const accessMap: BALJSONTxAccessSet[] = []
    for (const phase of this._accessMap) {
      const addresses = Array.from(phase.addresses)
        .filter((a) => a !== SYSTEM_ADDRESS)
        .sort()
      const storageSlots: BALJSONStorageAccess[] = Array.from(phase.storageSlots.entries())
        .filter(([a]) => a !== SYSTEM_ADDRESS)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([addr, slots]) => ({
          address: addr,
          slots: Array.from(slots).sort(),
        }))
      accessMap.push({ addresses, storageSlots })
    }

    const stateDiff: BALJSONAccountDiff[] = []
    for (const [address, diff] of Array.from(this._stateDiff.entries())
      .filter(([a]) => a !== SYSTEM_ADDRESS)
      .sort(([a], [b]) => a.localeCompare(b))) {
      const entry: BALJSONAccountDiff = {
        address,
        storageDiffs: Array.from(diff.storageDiffs.entries())
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([slot, value]) => ({
            slot,
            value: padToEvenHex(bytesToHex(value)),
          })),
      }
      if (diff.balance !== undefined) entry.balance = diff.balance
      if (diff.nonce !== undefined) entry.nonce = diff.nonce
      if (diff.code !== undefined) entry.code = bytesToHex(diff.code)
      stateDiff.push(entry)
    }

    return { accessMap, stateDiff }
  }

  // --- Factory methods ---

  static fromJSON(json: BALJSONBlockAccessList): BlockLevelAccessList {
    const bal = new BlockLevelAccessList()

    for (let i = 0; i < json.accessMap.length; i++) {
      const phase = json.accessMap[i]
      bal.setPhase(i)
      for (const addr of phase.addresses) {
        bal.trackAddress(addr)
      }
      for (const access of phase.storageSlots) {
        for (const slot of access.slots) {
          bal.trackStorageSlot(access.address, normalizeStorageKeyHex(slot))
        }
      }
    }

    for (const account of json.stateDiff) {
      for (const sd of account.storageDiffs) {
        bal.setStorageDiff(account.address, normalizeStorageKeyHex(sd.slot), hexToBytes(sd.value))
      }
      if (account.balance !== undefined) {
        const v = account.balance === '0x' ? BigInt(0) : BigInt(account.balance)
        bal.setBalanceDiff(account.address, v)
      }
      if (account.nonce !== undefined) {
        const v = account.nonce === '0x' ? BigInt(0) : BigInt(account.nonce)
        bal.setNonceDiff(account.address, v)
      }
      if (account.code !== undefined) {
        bal.setCodeDiff(account.address, hexToBytes(account.code))
      }
    }

    return bal
  }

  static fromRLP(rlpBytes: Uint8Array): BlockLevelAccessList {
    const decoded = RLP.decode(rlpBytes) as [unknown[], unknown[]]
    const [rawAccessMap, rawStateDiff] = decoded
    const bal = new BlockLevelAccessList()

    // Decode access map phases
    for (let i = 0; i < rawAccessMap.length; i++) {
      const [addresses, storageSlots] = rawAccessMap[i] as [
        Uint8Array[],
        [Uint8Array, Uint8Array[]][],
      ]
      bal.setPhase(i)
      for (const addrBytes of addresses) {
        bal.trackAddress(bytesToHex(addrBytes) as BALAddressHex)
      }
      for (const [addrBytes, slots] of storageSlots) {
        const addr = bytesToHex(addrBytes) as BALAddressHex
        for (const slotBytes of slots) {
          bal.trackStorageSlot(addr, normalizeStorageKeyHex(bytesToHex(slotBytes)))
        }
      }
    }

    // Decode state diff accounts
    for (const account of rawStateDiff as unknown[][]) {
      const [addrBytes, storageDiffs, balanceList, nonceList, codeList] = account as [
        Uint8Array,
        [Uint8Array, Uint8Array][],
        Uint8Array[],
        Uint8Array[],
        Uint8Array[],
      ]
      const address = bytesToHex(addrBytes) as BALAddressHex

      for (const [slotBytes, valueBytes] of storageDiffs) {
        bal.setStorageDiff(address, normalizeStorageKeyHex(bytesToHex(slotBytes)), valueBytes)
      }
      if (balanceList.length > 0) {
        const b = balanceList[0]
        bal.setBalanceDiff(address, b.length === 0 ? 0n : BigInt(bytesToHex(b)))
      }
      if (nonceList.length > 0) {
        const n = nonceList[0]
        bal.setNonceDiff(address, n.length === 0 ? 0n : BigInt(bytesToHex(n)))
      }
      if (codeList.length > 0) {
        bal.setCodeDiff(address, codeList[0])
      }
    }

    return bal
  }
}

// --- Convenience factory functions ---

export function createBlockLevelAccessList(): BlockLevelAccessList {
  return new BlockLevelAccessList()
}

export function createBlockLevelAccessListFromJSON(
  json: BALJSONBlockAccessList,
): BlockLevelAccessList {
  return BlockLevelAccessList.fromJSON(json)
}

export function createBlockLevelAccessListFromRLP(rlp: Uint8Array): BlockLevelAccessList {
  return BlockLevelAccessList.fromRLP(rlp)
}

// --- Helper functions ---

function normalizeHexForRLP(hex: PrefixedHexString): PrefixedHexString | Uint8Array {
  const stripped = hex.slice(2).replace(/^0+/, '')
  if (stripped === '') {
    return Uint8Array.from([])
  }
  return hex
}

function stripLeadingZeros(bytes: Uint8Array): Uint8Array {
  let first = bytes[0]
  while (bytes.length > 0 && first?.toString() === '0') {
    bytes = bytes.slice(1)
    first = bytes[0]
  }
  return bytes
}

function padToEvenHex(hex: PrefixedHexString): PrefixedHexString {
  return `0x${padToEven(hex.slice(2))}`
}

function normalizeStorageKeyHex(hex: PrefixedHexString): BALStorageKeyHex {
  const stripped = hex.slice(2).replace(/^0+/, '')
  if (stripped === '') {
    return '0x' as BALStorageKeyHex
  }
  return `0x${padToEven(stripped)}` as BALStorageKeyHex
}

const SYSTEM_ADDRESS = '0xfffffffffffffffffffffffffffffffffffffffe'
