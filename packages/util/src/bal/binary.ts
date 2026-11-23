import { RLP } from '@ethereumjs/rlp'

import { bytesToHex, hexToBytes } from '../bytes.ts'
import type { PrefixedHexString } from '../types.ts'
import type {
  BALJSONAccountChanges,
  BALJSONBlockAccessList,
  BlockLevelAccessList,
} from './index.ts'

function stripLeadingZeros(bytes: Uint8Array): Uint8Array {
  let i = 0
  while (i < bytes.length && bytes[i] === 0) i++
  if (i === 0) return bytes
  if (i === bytes.length) return new Uint8Array(0)
  return bytes.subarray(i)
}

/**
 * Wire, in-memory, or JSON block access list input accepted by BAL helpers.
 *
 * @remarks Experimental (Amsterdam): may change on patch releases.
 */
export type BALInput = BALJSONBlockAccessList | BlockLevelAccessList | Uint8Array

/**
 * One account diff in minimal big-endian binary (no hex round-trips).
 *
 * @remarks Experimental (Amsterdam): may change on patch releases.
 */
export interface CompactBinaryBALAccount {
  address: Uint8Array
  balance?: Uint8Array
  nonce?: Uint8Array
  code?: Uint8Array
  storageChanges: Array<[slot: Uint8Array, value: Uint8Array]>
}

/**
 * Block access list as compact binary account rows (mutated accounts only).
 *
 * @remarks Experimental (Amsterdam): may change on patch releases.
 */
export type CompactBinaryBAL = CompactBinaryBALAccount[]

type MergeBinAcc = {
  address: Uint8Array
  balance?: Uint8Array
  nonce?: Uint8Array
  code?: Uint8Array
  slots: Map<string, Uint8Array>
}

function mergeRowTriggersEip161EmptyBin(acc: MergeBinAcc, row: CompactBinaryBALAccount): boolean {
  if (row.balance === undefined && row.nonce === undefined) return false
  const balZero = acc.balance === undefined || acc.balance.length === 0
  const nonceZero = acc.nonce === undefined || acc.nonce.length === 0
  if (!balZero || !nonceZero) return false
  const hasCode = acc.code !== undefined && acc.code.length > 0
  return !hasCode && row.storageChanges.length === 0
}

function accountHasMutation(
  balanceChanges: unknown[],
  nonceChanges: unknown[],
  codeChanges: unknown[],
  storageChanges: unknown[],
): boolean {
  return (
    balanceChanges.length > 0 ||
    nonceChanges.length > 0 ||
    codeChanges.length > 0 ||
    storageChanges.length > 0
  )
}

function decodeRlpAccountRow(
  account: [
    Uint8Array,
    Array<[Uint8Array, Array<[Uint8Array, Uint8Array]>]>,
    Uint8Array[],
    Array<[Uint8Array, Uint8Array]>,
    Array<[Uint8Array, Uint8Array]>,
    Array<[Uint8Array, Uint8Array]>,
  ],
): CompactBinaryBALAccount | undefined {
  const [
    addressBytes,
    storageChangesRaw,
    _storageReadsRaw,
    balanceChangesRaw,
    nonceChangesRaw,
    codeChangesRaw,
  ] = account
  if (!accountHasMutation(balanceChangesRaw, nonceChangesRaw, codeChangesRaw, storageChangesRaw)) {
    return undefined
  }
  const row: CompactBinaryBALAccount = {
    address: addressBytes.length === 20 ? addressBytes : addressBytes.subarray(0, 20),
    storageChanges: [],
  }
  const lastBal = balanceChangesRaw.at(-1)?.[1]
  if (lastBal !== undefined) row.balance = stripLeadingZeros(lastBal)
  const lastNonce = nonceChangesRaw.at(-1)?.[1]
  if (lastNonce !== undefined) row.nonce = stripLeadingZeros(lastNonce)
  const lastCode = codeChangesRaw.at(-1)?.[1]
  if (lastCode !== undefined && lastCode.length > 0) row.code = lastCode
  for (const [slotBytes, slotChangesRaw] of storageChangesRaw) {
    const lastVal = slotChangesRaw.at(-1)?.[1]
    if (lastVal !== undefined) {
      row.storageChanges.push([stripLeadingZeros(slotBytes), stripLeadingZeros(lastVal)])
    }
  }
  return row
}

function decodeBALToBinaryFromRLP(rlp: Uint8Array): CompactBinaryBAL {
  const decoded = RLP.decode(rlp) as Array<
    [
      Uint8Array,
      Array<[Uint8Array, Array<[Uint8Array, Uint8Array]>]>,
      Uint8Array[],
      Array<[Uint8Array, Uint8Array]>,
      Array<[Uint8Array, Uint8Array]>,
      Array<[Uint8Array, Uint8Array]>,
    ]
  >
  const out: CompactBinaryBAL = []
  for (const account of decoded) {
    const row = decodeRlpAccountRow(account)
    if (row !== undefined) out.push(row)
  }
  return out
}

function compactFromJSONRow(row: BALJSONAccountChanges): CompactBinaryBALAccount | undefined {
  if (
    row.balanceChanges.length === 0 &&
    row.nonceChanges.length === 0 &&
    row.codeChanges.length === 0 &&
    row.storageChanges.length === 0
  ) {
    return undefined
  }
  const addr = hexToBytes(row.address)
  const entry: CompactBinaryBALAccount = {
    address: addr.length === 20 ? addr : addr.subarray(0, 20),
    storageChanges: [],
  }
  const lastBal = row.balanceChanges.at(-1)?.postBalance
  if (lastBal !== undefined) {
    entry.balance = stripLeadingZeros(hexToBytes(lastBal))
  }
  const lastNonce = row.nonceChanges.at(-1)?.postNonce
  if (lastNonce !== undefined) {
    entry.nonce = stripLeadingZeros(hexToBytes(lastNonce))
  }
  const lastCode = row.codeChanges.at(-1)?.newCode
  if (lastCode !== undefined && lastCode !== '0x' && lastCode.length > 2) {
    entry.code = hexToBytes(lastCode)
  }
  for (const sc of row.storageChanges) {
    const last = sc.slotChanges.at(-1)
    if (last === undefined) continue
    entry.storageChanges.push([
      stripLeadingZeros(hexToBytes(sc.slot)),
      stripLeadingZeros(hexToBytes(last.postValue)),
    ])
  }
  return entry
}

function decodeBALToBinaryFromJSON(json: BALJSONBlockAccessList): CompactBinaryBAL {
  const out: CompactBinaryBAL = []
  for (const row of json) {
    const bin = compactFromJSONRow(row)
    if (bin !== undefined) out.push(bin)
  }
  return out
}

function decodeBALToBinaryFromObject(bal: BlockLevelAccessList): CompactBinaryBAL {
  return decodeBALToBinaryFromJSON(bal.toJSON())
}

/**
 * Decode any {@link BALInput} into a compact binary diff (mutated accounts only).
 *
 * @remarks Experimental (Amsterdam): may change on patch releases.
 */
export function decodeBALToBinary(input: BALInput): CompactBinaryBAL {
  if (input instanceof Uint8Array) return decodeBALToBinaryFromRLP(input)
  if (Array.isArray(input)) return decodeBALToBinaryFromJSON(input)
  return decodeBALToBinaryFromObject(input as BlockLevelAccessList)
}

function addrKey(addr: Uint8Array): string {
  return bytesToHex(addr)
}

/**
 * Merge consecutive {@link BALInput} lists into one compact binary diff (EIP-161 semantics match {@link mergeBALs}).
 *
 * @remarks Experimental (Amsterdam): may change on patch releases.
 */
export function mergeBALsBinary(inputs: BALInput[]): CompactBinaryBAL {
  const byAddr = new Map<string, MergeBinAcc>()

  for (const input of inputs) {
    const list = decodeBALToBinary(input)
    for (const row of list) {
      const key = addrKey(row.address)
      let acc = byAddr.get(key)
      if (acc === undefined) {
        acc = {
          address: row.address,
          slots: new Map(),
        }
        byAddr.set(key, acc)
      }
      if (row.balance !== undefined) acc.balance = row.balance
      if (row.nonce !== undefined) acc.nonce = row.nonce
      if (row.code !== undefined) acc.code = row.code
      for (const [slot, val] of row.storageChanges) {
        acc.slots.set(addrKey(slot), val)
      }
      if (mergeRowTriggersEip161EmptyBin(acc, row)) {
        acc.slots.clear()
      }
    }
  }

  const out: CompactBinaryBAL = []
  for (const acc of byAddr.values()) {
    out.push({
      address: acc.address,
      balance: acc.balance,
      nonce: acc.nonce,
      code: acc.code,
      storageChanges: [...acc.slots.entries()].map(([slotHex, val]) => [
        hexToBytes(slotHex as PrefixedHexString),
        val,
      ]),
    })
  }
  return out
}

/**
 * Deduplicated 20-byte addresses with at least one mutation across the input(s).
 *
 * @remarks Experimental (Amsterdam): may change on patch releases.
 */
const MERGED_IDX = '0x00' as PrefixedHexString

/**
 * Convert compact binary rows back to JSON block access list form (merged batch index).
 *
 * @remarks Experimental (Amsterdam): may change on patch releases.
 */
export function compactBinaryToJSON(compact: CompactBinaryBAL): BALJSONBlockAccessList {
  const out: BALJSONBlockAccessList = []
  for (const row of compact) {
    out.push({
      address: bytesToHex(row.address) as PrefixedHexString,
      balanceChanges:
        row.balance !== undefined
          ? [{ blockAccessIndex: MERGED_IDX, postBalance: bytesToHex(row.balance) }]
          : [],
      nonceChanges:
        row.nonce !== undefined
          ? [{ blockAccessIndex: MERGED_IDX, postNonce: bytesToHex(row.nonce) }]
          : [],
      codeChanges:
        row.code !== undefined && row.code.length > 0
          ? [{ blockAccessIndex: MERGED_IDX, newCode: bytesToHex(row.code) }]
          : [],
      storageChanges: row.storageChanges.map(([slot, value]) => ({
        slot: bytesToHex(slot) as PrefixedHexString,
        slotChanges: [{ blockAccessIndex: MERGED_IDX, postValue: bytesToHex(value) }],
      })),
      storageReads: [],
    })
  }
  return out
}

function isJsonBlockAccessList(input: BALInput): input is BALJSONBlockAccessList {
  if (!Array.isArray(input)) return false
  if (input.length === 0) return true
  const first = input[0]
  return typeof first === 'object' && first !== null && 'address' in first
}

/**
 * Normalize any {@link BALInput} to JSON block access list form.
 *
 * @remarks Experimental (Amsterdam): may change on patch releases.
 */
export function balInputToJSON(input: BALInput): BALJSONBlockAccessList {
  if (isJsonBlockAccessList(input)) return input
  return compactBinaryToJSON(decodeBALToBinary(input))
}

export function extractBALMutatedAddresses(inputs: BALInput[]): Uint8Array[] {
  const seen = new Set<string>()
  const out: Uint8Array[] = []
  for (const item of inputs) {
    for (const row of decodeBALToBinary(item)) {
      const key = addrKey(row.address)
      if (seen.has(key)) continue
      seen.add(key)
      out.push(row.address)
    }
  }
  return out
}
