import { readEntry } from '../e2store.ts'
import { decompressData } from '../snappy.ts'

import type { e2StoreEntry } from '../types.ts'

export async function parseE2HSTuple({
  headerWithProofEntry,
  bodyEntry,
  receiptsEntry,
}: {
  headerWithProofEntry: e2StoreEntry
  bodyEntry: e2StoreEntry
  receiptsEntry: e2StoreEntry
}): Promise<{ headerWithProof: Uint8Array; body: Uint8Array; receipts: Uint8Array }> {
  const headerWithProof = await decompressData(headerWithProofEntry.data)
  const body = await decompressData(bodyEntry.data)
  const receipts = await decompressData(receiptsEntry.data)
  return { headerWithProof, body, receipts }
}

export function readE2HSTupleAtOffset(bytes: Uint8Array, recordStart: number, offset: number) {
  const headerWithProofEntry = readEntry(bytes.slice(recordStart + offset))
  const headerWithProofLength = headerWithProofEntry.data.length + 8
  const bodyEntry = readEntry(bytes.slice(recordStart + offset + headerWithProofLength))
  const bodyLength = bodyEntry.data.length + 8
  const receiptsEntry = readEntry(
    bytes.slice(recordStart + offset + headerWithProofLength + bodyLength),
  )
  return parseE2HSTuple({ headerWithProofEntry, bodyEntry, receiptsEntry })
}
