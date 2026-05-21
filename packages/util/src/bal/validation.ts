import { RLP } from '@ethereumjs/rlp'
import { keccak_256 } from '@noble/hashes/sha3.js'

import { bytesToHex, equalsBytes, hexToBytes } from '../bytes.ts'
import { SYSTEM_ADDRESS } from '../constants.ts'
import { EthereumJSErrorWithoutCode } from '../errors.ts'
import type { PrefixedHexString } from '../types.ts'
import {
  type BALJSONAccountChanges,
  type BALJSONBlockAccessList,
  type BlockLevelAccessList,
  createBlockLevelAccessListFromJSON,
} from './index.ts'

/** EIP-7928: gas cost attributed to each BAL item (address or storage key). */
export const BLOCK_ACCESS_LIST_ITEM_COST = 2000

/**
 * Counts BAL items per EIP-7928: `addresses + storage_keys`.
 * Uses the canonical {@link BlockLevelAccessList.raw()} view.
 */
export function countBlockAccessListItems(bal: BlockLevelAccessList): number {
  let items = 0
  for (const [, storageChanges, storageReads] of bal.raw()) {
    items += 1 + storageChanges.length + storageReads.length
  }
  return items
}

/**
 * Ensures `bal_items <= block_gas_limit // ITEM_COST` (EIP-7928).
 */
export function validateBlockAccessListGasLimit(
  bal: BlockLevelAccessList,
  blockGasLimit: bigint,
): void {
  const maxItems = blockGasLimit / BigInt(BLOCK_ACCESS_LIST_ITEM_COST)
  const items = BigInt(countBlockAccessListItems(bal))
  if (items > maxItems) {
    throwBlockAccessListGasLimitExceeded()
  }
}

/**
 * Validates canonical BAL structure and, when provided, the header hash commitment.
 */
export function validateBlockAccessList(
  bal: BlockLevelAccessList,
  blockAccessListHash?: Uint8Array,
): void {
  validateBlockAccessListStructure(bal)
  if (blockAccessListHash !== undefined) {
    validateBlockAccessListHash(bal, blockAccessListHash)
  }
}

/**
 * Validates lexicographic ordering, uniqueness, and field constraints of a
 * block access list in JSON fixture / Engine API form.
 *
 * Use before {@link createBlockLevelAccessListFromJSON} so out-of-order or
 * duplicate accounts are not silently merged.
 */
export function validateBlockAccessListJSONStructure(json: BALJSONBlockAccessList): void {
  const seenAddresses = new Set<PrefixedHexString>()

  for (const account of json) {
    validateBlockAccessListJSONAccount(account)

    if (seenAddresses.has(account.address)) {
      throwIncorrectBlockFormat('duplicate account in block access list')
    }
    seenAddresses.add(account.address)
  }
}

/**
 * True when accounts are out of lexicographic order in a way that indicates a full reorder
 * (e.g. `reverse_accounts()`), as opposed to a single appended account breaking sort at the end.
 */
export function isAccountOrderOnlyViolation(json: BALJSONBlockAccessList): boolean {
  return countAccountOrderInversions(json) >= 2
}

/**
 * `keccak256(rlp(bal))` using the JSON account order (not re-sorted), matching Engine API bytes.
 */
export function hashBlockAccessListFromJSON(json: BALJSONBlockAccessList): Uint8Array {
  const accounts: BALRawBlockAccessList = []
  for (const account of json) {
    const entry = encodeAccountRawFromJSON(account)
    if (entry !== undefined) {
      accounts.push(entry)
    }
  }
  return keccak_256(RLP.encode(accounts))
}

/**
 * Verifies the header hash against the JSON-ordered RLP encoding.
 */
export function validateBlockAccessListHashFromJSON(
  json: BALJSONBlockAccessList,
  expectedHash: Uint8Array,
): void {
  validateBlockAccessListHashBytes(hashBlockAccessListFromJSON(json), expectedHash)
}

/**
 * Validates the canonical RLP-oriented structure of a {@link BlockLevelAccessList}.
 */
export function validateBlockAccessListStructure(bal: BlockLevelAccessList): void {
  validateBlockAccessListRaw(bal.raw())
}

/**
 * Verifies `keccak256(rlp(bal))` matches the committed header hash.
 */
export function validateBlockAccessListHash(
  bal: BlockLevelAccessList,
  expectedHash: Uint8Array,
): void {
  validateBlockAccessListHashBytes(bal.hash(), expectedHash)
}

/**
 * Returns true when two access lists produce identical canonical RLP.
 */
export function equalsBlockAccessList(a: BlockLevelAccessList, b: BlockLevelAccessList): boolean {
  return equalsBytes(a.serialize(), b.serialize())
}

type BALRawAccountChanges = ReturnType<BlockLevelAccessList['raw']>[number]
type BALRawBlockAccessList = ReturnType<BlockLevelAccessList['raw']>

function countAccountOrderInversions(json: BALJSONBlockAccessList): number {
  let inversions = 0
  for (let i = 0; i < json.length - 1; i++) {
    if (compareLexicographicHex(json[i].address, json[i + 1].address) > 0) {
      inversions++
    }
  }
  return inversions
}

function validateBlockAccessListHashBytes(computed: Uint8Array, expectedHash: Uint8Array): void {
  if (expectedHash.length !== 32) {
    throwInvalidBalHash(`expected 32-byte hash, received ${expectedHash.length} bytes`)
  }
  if (!equalsBytes(computed, expectedHash)) {
    throwInvalidBalHash(`received=${bytesToHex(expectedHash)} expected=${bytesToHex(computed)}`)
  }
}

function encodeAccountRawFromJSON(
  account: BALJSONAccountChanges,
): BALRawAccountChanges | undefined {
  const bal = createBlockLevelAccessListFromJSON([account])
  return bal.raw()[0]
}

function validateBlockAccessListRaw(raw: BALRawBlockAccessList): void {
  let prevAddress: PrefixedHexString | undefined

  for (const account of raw) {
    const [address, storageChanges, storageReads, balanceChanges, nonceChanges, codeChanges] =
      account

    if (prevAddress === address) {
      throwIncorrectBlockFormat('duplicate account in block access list')
    }
    if (prevAddress !== undefined && compareLexicographicHex(prevAddress, address) > 0) {
      throwIncorrectBlockFormat('block access list accounts are not sorted')
    }
    prevAddress = address

    if (address === SYSTEM_ADDRESS && !rawAccountHasChanges(account)) {
      throwInvalidBlockAccessList('system address must not be included without state changes')
    }

    validateStorageChanges(storageChanges)
    validateStorageReads(storageReads, storageChanges)
    validateSortedUniqueIndices(
      balanceChanges.map(([index]) => index),
      'balance',
    )
    validateSortedUniqueIndices(
      nonceChanges.map(([index]) => index),
      'nonce',
    )
    validateSortedUniqueIndices(
      codeChanges.map(([index]) => index),
      'code',
    )
  }
}

function validateBlockAccessListJSONAccount(account: BALJSONAccountChanges): void {
  validateAddress(account.address)

  if (account.address === SYSTEM_ADDRESS && !accountHasChanges(account)) {
    throwInvalidBlockAccessList('system address must not be included without state changes')
  }

  let prevSlot: PrefixedHexString | undefined
  for (const slotChange of account.storageChanges) {
    if (prevSlot !== undefined && compareLexicographicHex(prevSlot, slotChange.slot) >= 0) {
      throwInvalidBlockAccessList('storage slots are not sorted')
    }
    prevSlot = slotChange.slot
    validateSortedUniqueIndices(
      slotChange.slotChanges.map((change) => Number.parseInt(change.blockAccessIndex, 16)),
      'storage',
    )
    if (account.storageReads.includes(slotChange.slot)) {
      throwInvalidBlockAccessList('storage slot appears in both storageChanges and storageReads')
    }
  }

  let prevRead: PrefixedHexString | undefined
  const seenReads = new Set<PrefixedHexString>()
  for (const slot of account.storageReads) {
    if (prevRead !== undefined && compareLexicographicHex(prevRead, slot) >= 0) {
      throwInvalidBlockAccessList('storage reads are not sorted')
    }
    if (seenReads.has(slot)) {
      throwInvalidBlockAccessList('duplicate storage read')
    }
    seenReads.add(slot)
    prevRead = slot
  }

  validateSortedUniqueIndices(
    account.balanceChanges.map((change) => Number.parseInt(change.blockAccessIndex, 16)),
    'balance',
  )
  validateSortedUniqueIndices(
    account.nonceChanges.map((change) => Number.parseInt(change.blockAccessIndex, 16)),
    'nonce',
  )
  validateSortedUniqueIndices(
    account.codeChanges.map((change) => Number.parseInt(change.blockAccessIndex, 16)),
    'code',
  )
}

function validateStorageChanges(storageChanges: BALRawAccountChanges[1]): void {
  let prevSlot: PrefixedHexString | undefined
  for (const [slot, changes] of storageChanges) {
    if (prevSlot !== undefined && compareLexicographicHex(prevSlot, slot) >= 0) {
      throwInvalidBlockAccessList('storage slots are not sorted')
    }
    prevSlot = slot
    validateSortedUniqueIndices(
      changes.map(([index]) => index),
      'storage',
    )
  }
}

function validateStorageReads(
  storageReads: BALRawAccountChanges[2],
  storageChanges: BALRawAccountChanges[1],
): void {
  const changeSlots = new Set(storageChanges.map(([slot]) => slot))
  let prevRead: PrefixedHexString | undefined
  const seenReads = new Set<PrefixedHexString>()

  for (const slot of storageReads) {
    const slotHex = typeof slot === 'string' ? slot : bytesToHex(slot)
    if (prevRead !== undefined && compareLexicographicHex(prevRead, slotHex) >= 0) {
      throwInvalidBlockAccessList('storage reads are not sorted')
    }
    if (seenReads.has(slotHex)) {
      throwInvalidBlockAccessList('duplicate storage read')
    }
    if (changeSlots.has(slotHex)) {
      throwInvalidBlockAccessList('storage slot appears in both storageChanges and storageReads')
    }
    seenReads.add(slotHex)
    prevRead = slotHex
  }
}

function validateSortedUniqueIndices(indices: number[], field: string): void {
  let prevIndex: number | undefined
  const seen = new Set<number>()
  for (const index of indices) {
    if (prevIndex !== undefined && index <= prevIndex) {
      throwInvalidBlockAccessList(`${field} changes are not sorted by block access index`)
    }
    if (seen.has(index)) {
      throwInvalidBlockAccessList(`duplicate block access index in ${field} changes`)
    }
    seen.add(index)
    prevIndex = index
  }
}

function rawAccountHasChanges(account: BALRawAccountChanges): boolean {
  const [, storageChanges, storageReads, balanceChanges, nonceChanges, codeChanges] = account
  return (
    storageChanges.length > 0 ||
    storageReads.length > 0 ||
    balanceChanges.length > 0 ||
    nonceChanges.length > 0 ||
    codeChanges.length > 0
  )
}

function accountHasChanges(account: BALJSONAccountChanges): boolean {
  return (
    account.storageChanges.length > 0 ||
    account.storageReads.length > 0 ||
    account.balanceChanges.length > 0 ||
    account.nonceChanges.length > 0 ||
    account.codeChanges.length > 0
  )
}

function validateAddress(address: PrefixedHexString): void {
  if (address.length !== 42) {
    throwInvalidBlockAccessList(`invalid address length: ${address}`)
  }
  hexToBytes(address)
}

// Accepts both hex strings and raw bytes because BlockLevelAccessList.raw()
// runs slot/read keys through normalizeHexForRLP, which returns Uint8Array
// for the canonical zero-slot case (an empty bytes encoding). The validator
// sees both shapes when comparing slots that have been normalized for RLP.
function compareLexicographicHex(
  a: PrefixedHexString | Uint8Array,
  b: PrefixedHexString | Uint8Array,
): number {
  const aBytes = a instanceof Uint8Array ? a : hexToBytes(a)
  const bBytes = b instanceof Uint8Array ? b : hexToBytes(b)
  const minLength = Math.min(aBytes.length, bBytes.length)
  for (let i = 0; i < minLength; i++) {
    if (aBytes[i] < bBytes[i]) return -1
    if (aBytes[i] > bBytes[i]) return 1
  }
  if (aBytes.length < bBytes.length) return -1
  if (aBytes.length > bBytes.length) return 1
  return 0
}

function throwIncorrectBlockFormat(detail: string): never {
  throw EthereumJSErrorWithoutCode(`invalid header: ${detail}`)
}

function throwInvalidBlockAccessList(detail: string): never {
  throw EthereumJSErrorWithoutCode(`invalid block access list: ${detail}`)
}

function throwInvalidBalHash(detail: string): never {
  throw EthereumJSErrorWithoutCode(`invalid block access list hash: ${detail}`)
}

function throwBlockAccessListGasLimitExceeded(): never {
  throw EthereumJSErrorWithoutCode('block access list gas limit exceeded')
}
