// https://github.com/eth-clients/e2store-format-specs/blob/main/formats/e2hs.md

import { concatBytes } from '@ethereumjs/util'
import { createBlockIndex, getBlockIndex, readBlockIndex } from '../blockIndex.ts'
import { formatEntry } from '../e2store.ts'
import { E2HSTypes, VERSION } from '../types.ts'
import { readE2HSTupleAtOffset } from './blockTuple.ts'

// e2hs := Version | block-tuple* | other-entries* | BlockIndex
// block-tuple :=  CompressedHeaderWithProof | CompressedBody | CompressedReceipts

/**
 * Format E2HS
 * @param data array of block tuples
 * @param epoch epoch index
 * @returns serialized E2HS
 */
export const formatE2HS = async (
  data: Array<{
    headerWithProof: Uint8Array
    body: Uint8Array
    receipts: Uint8Array
  }>,
  epoch: number,
) => {
  const version = await formatEntry(VERSION)
  const blockTuples = []
  for (const { headerWithProof, body, receipts } of data) {
    const compressedHeaderWithProof = await formatEntry({
      type: E2HSTypes.CompressedHeaderWithProof,
      data: headerWithProof,
    })
    const compressedBody = await formatEntry({
      type: E2HSTypes.CompressedBody,
      data: body,
    })
    const compressedReceipts = await formatEntry({
      type: E2HSTypes.CompressedReceipts,
      data: receipts,
    })
    const entry = concatBytes(compressedHeaderWithProof, compressedBody, compressedReceipts)
    blockTuples.push(entry)
  }
  const startingNumber = BigInt(epoch * 8192)
  const blockIndex = await createBlockIndex(blockTuples, startingNumber)
  const e2hs = concatBytes(version, ...blockTuples, blockIndex)
  return e2hs
}

export async function* readTuplesFromE2HS(bytes: Uint8Array) {
  const { data, count } = getBlockIndex(bytes)
  const { offsets } = readBlockIndex(data, count)
  for (let x = 0; x < count; x++) {
    try {
      yield readE2HSTupleAtOffset(bytes, offsets[x])
    } catch {
      // noop - we skip empty slots
    }
  }
}

export async function readE2HSTupleAtIndex(bytes: Uint8Array, index: number) {
  const { data, count } = getBlockIndex(bytes)
  const { offsets } = readBlockIndex(data, count)
  return readE2HSTupleAtOffset(bytes, offsets[index])
}
