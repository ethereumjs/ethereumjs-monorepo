import * as fs from 'node:fs'

import { binaryAccountToRLP } from '@ethereumjs/util'

import { isBinaryAccountJournalFile, readBinaryAccountJournalFile } from '../persist/journal.ts'
import type { SnapPivotStore } from '../persist/snapStore.ts'

export type SubtreeSlabRow = { key: Uint8Array; value: Uint8Array }

/** Yield sorted account hash + account RLP rows from flat custody slabs. */
export function* iterateSubtreeSlabRows(
  store: SnapPivotStore,
  bucket: number,
): Generator<SubtreeSlabRow> {
  for (const file of store.accountJournalPathsForBucket(bucket)) {
    if (!fs.existsSync(file)) continue
    const raw = new Uint8Array(fs.readFileSync(file))
    if (!isBinaryAccountJournalFile(raw)) continue
    const { records } = readBinaryAccountJournalFile(raw)
    for (const row of records) {
      if (row.accountHash[0]! >> 4 !== bucket) continue
      yield {
        key: new Uint8Array(row.accountHash),
        value: binaryAccountToRLP(row.binaryAccount),
      }
    }
  }
}
