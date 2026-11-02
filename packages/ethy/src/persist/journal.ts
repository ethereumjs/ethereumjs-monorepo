import { Account, BINARY_ACCOUNT_SIZE, createAccountFromRLP } from '@ethereumjs/util'

import { incrementKey32 } from '../sync/syntheticPeer.ts'

/** Magic prefix for fixed 136-byte account journal rows (schema 2). */
export const BINARY_ACCOUNT_JOURNAL_MAGIC = new Uint8Array([0xe3, 0x4a, 0x00, 0x03])

export const BINARY_ACCOUNT_JOURNAL_RECORD_SIZE = 32 + BINARY_ACCOUNT_SIZE

/** One verified account row in a bucket journal file. */
export type AccountJournalRecord = {
  accountHash: Uint8Array
  accountRlp: Uint8Array
}

export type BinaryAccountJournalRecord = {
  accountHash: Uint8Array
  binaryAccount: Uint8Array
}

const RECORD_HEADER = 4 + 32

export function encodeAccountJournalRecord(record: AccountJournalRecord): Uint8Array {
  const bodyLen = record.accountRlp.length
  const out = new Uint8Array(RECORD_HEADER + bodyLen)
  const view = new DataView(out.buffer, out.byteOffset, out.byteLength)
  view.setUint32(0, bodyLen, false)
  out.set(record.accountHash, 4)
  out.set(record.accountRlp, RECORD_HEADER)
  return out
}

/** Count intact records. A torn tail is ignored, same as a full read. */
export function countAccountJournalRecords(bytes: Uint8Array): number {
  if (isBinaryAccountJournalFile(bytes)) {
    const payload = bytes.length - BINARY_ACCOUNT_JOURNAL_MAGIC.length
    return Math.floor(payload / BINARY_ACCOUNT_JOURNAL_RECORD_SIZE)
  }
  let offset = 0
  let count = 0
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength)
  while (offset + RECORD_HEADER <= bytes.length) {
    const bodyLen = view.getUint32(offset, false)
    const recordEnd = offset + RECORD_HEADER + bodyLen
    if (recordEnd > bytes.length) break
    count++
    offset = recordEnd
  }
  return count
}

export function readAccountJournalFile(bytes: Uint8Array): {
  records: AccountJournalRecord[]
  lastHash?: Uint8Array
} {
  const records: AccountJournalRecord[] = []
  let offset = 0
  let lastHash: Uint8Array | undefined
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength)
  while (offset + RECORD_HEADER <= bytes.length) {
    const bodyLen = view.getUint32(offset, false)
    const recordEnd = offset + RECORD_HEADER + bodyLen
    if (recordEnd > bytes.length) break
    const accountHash = bytes.subarray(offset + 4, offset + 4 + 32)
    const accountRlp = bytes.subarray(offset + RECORD_HEADER, recordEnd)
    records.push({ accountHash, accountRlp })
    lastHash = accountHash
    offset = recordEnd
  }
  return { records, lastHash }
}

export function journalCursorAfterRecords(
  bucketIndex: number,
  recordCount: number,
  lastHash: Uint8Array | undefined,
  startHash: Uint8Array,
): { accountsLoaded: number; currentLastHash: Uint8Array } {
  if (recordCount === 0 || lastHash === undefined) {
    return { accountsLoaded: 0, currentLastHash: new Uint8Array(startHash) }
  }
  return {
    accountsLoaded: recordCount,
    currentLastHash: incrementKey32(lastHash),
  }
}

export function accountFromJournalRlp(rlp: Uint8Array): Account {
  return createAccountFromRLP(rlp)
}

export function isBinaryAccountJournalFile(bytes: Uint8Array): boolean {
  if (bytes.length < BINARY_ACCOUNT_JOURNAL_MAGIC.length) return false
  for (let i = 0; i < BINARY_ACCOUNT_JOURNAL_MAGIC.length; i++) {
    if (bytes[i] !== BINARY_ACCOUNT_JOURNAL_MAGIC[i]) return false
  }
  return true
}

/** Concatenate binary journal rows for one batched disk write. */
export function encodeBinaryAccountJournalBatch(records: BinaryAccountJournalRecord[]): Uint8Array {
  const body = new Uint8Array(records.length * BINARY_ACCOUNT_JOURNAL_RECORD_SIZE)
  let offset = 0
  for (const row of records) {
    body.set(row.accountHash.subarray(0, 32), offset)
    body.set(row.binaryAccount.subarray(0, BINARY_ACCOUNT_SIZE), offset + 32)
    offset += BINARY_ACCOUNT_JOURNAL_RECORD_SIZE
  }
  if (records.length === 0) return new Uint8Array(0)
  const out = new Uint8Array(BINARY_ACCOUNT_JOURNAL_MAGIC.length + body.length)
  out.set(BINARY_ACCOUNT_JOURNAL_MAGIC, 0)
  out.set(body, BINARY_ACCOUNT_JOURNAL_MAGIC.length)
  return out
}

export function encodeBinaryAccountJournalAppendBatch(
  records: BinaryAccountJournalRecord[],
): Uint8Array {
  const body = new Uint8Array(records.length * BINARY_ACCOUNT_JOURNAL_RECORD_SIZE)
  let offset = 0
  for (const row of records) {
    body.set(row.accountHash.subarray(0, 32), offset)
    body.set(row.binaryAccount.subarray(0, BINARY_ACCOUNT_SIZE), offset + 32)
    offset += BINARY_ACCOUNT_JOURNAL_RECORD_SIZE
  }
  return body
}

export function readBinaryAccountJournalFile(bytes: Uint8Array): {
  records: BinaryAccountJournalRecord[]
  lastHash?: Uint8Array
} {
  const records: BinaryAccountJournalRecord[] = []
  let offset = BINARY_ACCOUNT_JOURNAL_MAGIC.length
  let lastHash: Uint8Array | undefined
  while (offset + BINARY_ACCOUNT_JOURNAL_RECORD_SIZE <= bytes.length) {
    const accountHash = bytes.subarray(offset, offset + 32)
    const binaryAccount = bytes.subarray(offset + 32, offset + BINARY_ACCOUNT_JOURNAL_RECORD_SIZE)
    records.push({ accountHash, binaryAccount })
    lastHash = accountHash
    offset += BINARY_ACCOUNT_JOURNAL_RECORD_SIZE
  }
  return { records, lastHash }
}

const DEFAULT_BINARY_JOURNAL_BATCH_ROWS = 4000

/**
 * Walk a binary account journal in fixed-size slabs without per-row `.slice()` copies.
 */
export async function forEachBinaryJournalBatch(
  bytes: Uint8Array,
  batchRows: number,
  visit: (slab: Uint8Array, lastHashInBatch: Uint8Array) => void | Promise<void>,
): Promise<{ recordCount: number; lastHash?: Uint8Array }> {
  if (!isBinaryAccountJournalFile(bytes)) {
    return { recordCount: 0 }
  }
  const rowSize = BINARY_ACCOUNT_JOURNAL_RECORD_SIZE
  const payloadStart = BINARY_ACCOUNT_JOURNAL_MAGIC.length
  const payloadLen = bytes.length - payloadStart
  const totalRows = Math.floor(payloadLen / rowSize)
  let recordCount = 0
  let lastHash: Uint8Array | undefined
  const rows = batchRows > 0 ? batchRows : DEFAULT_BINARY_JOURNAL_BATCH_ROWS
  for (let rowStart = 0; rowStart < totalRows; rowStart += rows) {
    const batchCount = Math.min(rows, totalRows - rowStart)
    const byteStart = payloadStart + rowStart * rowSize
    const slab = bytes.subarray(byteStart, byteStart + batchCount * rowSize)
    const lastRowOffset = byteStart + (batchCount - 1) * rowSize
    const lastHashInBatch = bytes.subarray(lastRowOffset, lastRowOffset + 32)
    await visit(slab, lastHashInBatch)
    recordCount += batchCount
    lastHash = lastHashInBatch
  }
  return { recordCount, lastHash }
}
