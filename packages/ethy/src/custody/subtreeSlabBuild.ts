import * as fs from 'node:fs/promises'

import { binaryAccountToRLP, bytesToUnprefixedHex } from '@ethereumjs/util'

import { isBinaryAccountJournalFile, readBinaryAccountJournalFile } from '../persist/journal.ts'
import type { SnapPivotStore } from '../persist/snapStore.ts'

export type SubtreeSlabRow = { key: Uint8Array; value: Uint8Array }

function compareBytes32(a: Uint8Array, b: Uint8Array): number {
  const len = Math.min(a.length, b.length)
  for (let i = 0; i < len; i++) {
    if (a[i]! !== b[i]!) return a[i]! - b[i]!
  }
  return a.length - b.length
}

/**
 * Read, deduplicate (last-write-wins across base + segment journals), and sort
 * account rows for one custody bucket without blocking the event loop (WP-16f).
 */
export async function loadSortedSubtreeSlabRows(
  store: SnapPivotStore,
  bucket: number,
): Promise<SubtreeSlabRow[]> {
  const dedup = new Map<string, SubtreeSlabRow>()
  for (const file of store.accountJournalPathsForBucket(bucket)) {
    let rawBuf: Buffer
    try {
      rawBuf = await fs.readFile(file)
    } catch {
      continue
    }
    const raw = new Uint8Array(rawBuf.buffer, rawBuf.byteOffset, rawBuf.byteLength)
    if (!isBinaryAccountJournalFile(raw)) continue
    const { records } = readBinaryAccountJournalFile(raw)
    for (const row of records) {
      if (row.accountHash[0]! >> 4 !== bucket) continue
      const key = new Uint8Array(row.accountHash)
      const value = binaryAccountToRLP(row.binaryAccount)
      dedup.set(bytesToUnprefixedHex(key), { key, value })
    }
  }
  const rows = [...dedup.values()]
  rows.sort((a, b) => compareBytes32(a.key, b.key))
  return rows
}
