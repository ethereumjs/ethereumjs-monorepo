import { parseEntry, readEntry } from './e2store.js'

import type { e2StoreEntry } from './types.js'

export async function parseBlockTuple({
  headerEntry,
  bodyEntry,
  receiptsEntry,
  totalDifficultyEntry,
}: {
  headerEntry: e2StoreEntry
  bodyEntry: e2StoreEntry
  receiptsEntry: e2StoreEntry
  totalDifficultyEntry: e2StoreEntry
}): Promise<{ header: any; body: any; receipts: any; totalDifficulty: any }> {
  const header = await parseEntry(headerEntry)
  const body = await parseEntry(bodyEntry)
  const receipts = await parseEntry(receiptsEntry)
  const totalDifficulty = await parseEntry(totalDifficultyEntry)
  return { header, body, receipts, totalDifficulty }
}

export function readBlockTupleAtOffset(bytes: Uint8Array, recordStart: number, offset: number) {
  const headerEntry = readEntry(bytes.slice(recordStart + offset))
  const headerLength = headerEntry.data.length + 8
  const bodyEntry = readEntry(bytes.slice(recordStart + offset + headerLength))
  const bodyLength = bodyEntry.data.length + 8
  const receiptsEntry = readEntry(bytes.slice(recordStart + offset + headerLength + bodyLength))
  const receiptsLength = receiptsEntry.data.length + 8
  const totalDifficultyEntry = readEntry(
    bytes.slice(recordStart + offset + headerLength + bodyLength + receiptsEntry.data.length + 8),
  )
  const totalDifficultyLength = totalDifficultyEntry.data.length + 8
  const totalLength = headerLength + bodyLength + receiptsLength + totalDifficultyLength
  return { headerEntry, bodyEntry, receiptsEntry, totalDifficultyEntry, length: totalLength }
}
