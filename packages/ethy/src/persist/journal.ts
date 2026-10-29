import { Account, createAccountFromRLP } from '@ethereumjs/util'

import { incrementKey32 } from '../sync/syntheticPeer.ts'

/** One verified account row in a bucket journal file. */
export type AccountJournalRecord = {
  accountHash: Uint8Array
  accountRlp: Uint8Array
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
