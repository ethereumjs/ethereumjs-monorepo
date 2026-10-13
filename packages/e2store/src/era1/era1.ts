import { concatBytes, equalsBytes } from '@ethereumjs/util'
import * as ssz from 'micro-eth-signer/ssz.js'

import {
  EpochAccumulator,
  Era1Types,
  VERSION,
  createBlockIndex,
  formatEntry,
  getBlockIndex,
  readBlockIndex,
  readEntry,
} from '../index.ts'
import { blockFromTuple, parseBlockTuple, readBlockTupleAtOffset } from './blockTuple.ts'

/**
 * Serializes an era1 file from compressed block tuples and epoch metadata.
 *
 * @param epoch Epoch index (starting block number is `epoch * 8192`).
 */
export const formatEra1 = async (
  blockTuples: {
    header: Uint8Array
    body: Uint8Array
    receipts: Uint8Array
    totalDifficulty: bigint
  }[],
  headerRecords: {
    blockHash: Uint8Array
    totalDifficulty: bigint
  }[],
  epoch: number,
) => {
  const version = await formatEntry(VERSION)
  const blocks = []
  for (const { header, body, receipts, totalDifficulty } of blockTuples) {
    const compressedHeader = await formatEntry({
      type: Era1Types.CompressedHeader,
      data: header,
    })
    const compressedBody = await formatEntry({
      type: Era1Types.CompressedBody,
      data: body,
    })
    const compressedReceipts = await formatEntry({
      type: Era1Types.CompressedReceipts,
      data: receipts,
    })
    const compressedTotalDifficulty = await formatEntry({
      type: Era1Types.TotalDifficulty,
      data: ssz.uint256.encode(totalDifficulty),
    })
    const entry = concatBytes(
      compressedHeader,
      compressedBody,
      compressedReceipts,
      compressedTotalDifficulty,
    )
    blocks.push(entry)
  }

  const epochAccumulatorRoot = EpochAccumulator.merkleRoot(headerRecords)

  const accumulatorEntry = await formatEntry({
    type: Era1Types.AccumulatorRoot,
    data: epochAccumulatorRoot,
  })

  const startingNumber = BigInt(epoch * 8192)

  // startingNumber | index | index | index ... | count
  const blockIndex = await createBlockIndex(blocks, startingNumber)

  // version | block-tuple* | other-entries | Accumulator | BLockIndex
  const era1 = concatBytes(version, ...blocks, accumulatorEntry, blockIndex)
  return era1
}

/** Yields raw block tuple entries at each non-empty slot offset in an era1 file. */
export async function* readBlockTuplesFromERA1(
  bytes: Uint8Array,
  count: number,
  offsets: number[],
  recordStart: number,
) {
  for (let x = 0; x < count; x++) {
    try {
      const { headerEntry, bodyEntry, receiptsEntry, totalDifficultyEntry } =
        readBlockTupleAtOffset(bytes, recordStart, offsets[x])
      yield { headerEntry, bodyEntry, receiptsEntry, totalDifficultyEntry }
    } catch {
      // noop - we skip empty slots
    }
  }
}

/** Reads trailing entries between the last block tuple and the accumulator root. */
export async function readOtherEntries(bytes: Uint8Array) {
  const { data, count, recordStart } = getBlockIndex(bytes)
  const { offsets } = readBlockIndex(data, count)
  const lastTuple = readBlockTupleAtOffset(bytes, recordStart, offsets[count - 1])
  const otherEntries = []
  let next = recordStart + offsets[count - 1] + lastTuple.length
  let nextEntry = readEntry(bytes.slice(next))
  while (!equalsBytes(nextEntry.type, Era1Types.AccumulatorRoot)) {
    otherEntries.push(nextEntry)
    next = next + nextEntry.data.length + 8
    nextEntry = readEntry(bytes.slice(next))
  }
  return { accumulatorRoot: nextEntry.data, otherEntries }
}

/** Returns the SSZ epoch accumulator root bytes from an era1 file. */
export async function readAccumulatorRoot(bytes: Uint8Array) {
  const { accumulatorRoot } = await readOtherEntries(bytes)
  return accumulatorRoot
}

/** Async generator over decompressed block tuples in an era1 file. */
export async function readERA1(bytes: Uint8Array) {
  const { data, count, recordStart } = getBlockIndex(bytes)
  const { offsets } = readBlockIndex(data, count)
  return readBlockTuplesFromERA1(bytes, count, offsets, recordStart)
}

/** Builds header records (block hash + total difficulty) from all block tuples in an era1 file. */
export async function getHeaderRecords(bytes: Uint8Array) {
  const blockTuples = await readERA1(bytes)
  const headerRecords = []
  for await (const tuple of blockTuples) {
    const { header, body, totalDifficulty } = await parseBlockTuple(tuple)
    const block = blockFromTuple({ header, body })
    const headerRecord = {
      blockHash: block.header.hash(),
      totalDifficulty: totalDifficulty.data,
    }
    headerRecords.push(headerRecord)
  }
  return headerRecords
}

/** Verifies that the era1 accumulator root matches the merkle root of parsed header records. */
export async function validateERA1(bytes: Uint8Array) {
  const accumulatorRoot = await readAccumulatorRoot(bytes)
  const headerRecords = await getHeaderRecords(bytes)
  const epochAccumulatorRoot = EpochAccumulator.merkleRoot(headerRecords)
  return equalsBytes(epochAccumulatorRoot, accumulatorRoot)
}
