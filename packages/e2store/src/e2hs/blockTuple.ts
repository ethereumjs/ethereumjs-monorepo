import { bytelist, container } from 'micro-eth-signer/ssz'
import { readEntry } from '../e2store.ts'
import { decompressData } from '../snappy.ts'

import { RLP } from '@ethereumjs/rlp'
import type { NestedUint8Array } from '@ethereumjs/util'
import type { e2StoreEntry } from '../types.ts'

export async function decompressE2HSTuple({
  headerWithProofEntry,
  bodyEntry,
  receiptsEntry,
}: {
  headerWithProofEntry: e2StoreEntry
  bodyEntry: e2StoreEntry
  receiptsEntry: e2StoreEntry
}): Promise<EncodedBlockTuple> {
  const headerWithProof = await decompressData(headerWithProofEntry.data)
  const body = await decompressData(bodyEntry.data)
  const receipts = await decompressData(receiptsEntry.data)
  return { headerWithProof, body, receipts }
}

export function readE2HSTupleAtOffset(bytes: Uint8Array, offset: number) {
  const headerWithProofEntry = readEntry(bytes.slice(offset))
  const headerWithProofLength = headerWithProofEntry.data.length + 8
  const bodyEntry = readEntry(bytes.slice(offset + headerWithProofLength))
  const bodyLength = bodyEntry.data.length + 8
  const receiptsEntry = readEntry(bytes.slice(offset + headerWithProofLength + bodyLength))
  return { headerWithProofEntry, bodyEntry, receiptsEntry }
}

const MAX_HEADER_LENGTH = 2048
const MAX_HEADER_PROOF_LENGTH = 1024

const sszHeader = bytelist(MAX_HEADER_LENGTH)
const sszProof = bytelist(MAX_HEADER_PROOF_LENGTH)

export const sszHeaderWithProof = container({
  header: sszHeader,
  proof: sszProof,
})

type HeaderWithProof = {
  header: Uint8Array
  proof: Uint8Array
}

type RawBlockTuple = {
  headerWithProof: HeaderWithProof
  body: Uint8Array | NestedUint8Array
  receipts: Uint8Array | NestedUint8Array
}

type EncodedBlockTuple = {
  headerWithProof: Uint8Array
  body: Uint8Array
  receipts: Uint8Array
}

export function parseEH2SBlockTuple(tuple: EncodedBlockTuple): RawBlockTuple {
  const headerWithProof = sszHeaderWithProof.decode(tuple.headerWithProof)
  const body = RLP.decode(tuple.body)
  const receipts = RLP.decode(tuple.receipts)
  return { headerWithProof, body, receipts }
}
