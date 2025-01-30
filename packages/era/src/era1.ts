import { ByteVectorType, ContainerType, ListCompositeType, UintBigintType } from '@chainsafe/ssz'
import { bigInt64ToBytes, concatBytes, equalsBytes } from '@ethereumjs/util'
import { SnappyStream } from 'snappystream'
import { Writable } from 'stream'

const Era1Types = {
  Version: new Uint8Array([0x65, 0x32]),
  CompressedHeader: new Uint8Array([0x03, 0x00]),
  CompressedBody: new Uint8Array([0x04, 0x00]),
  CompressedReceipts: new Uint8Array([0x05, 0x00]),
  TotalDifficulty: new Uint8Array([0x06, 0x00]),
  AccumulatorRoot: new Uint8Array([0x07, 0x00]),
  BlockIndex: new Uint8Array([0x66, 0x32]),
} as const

const VERSION = {
  type: Era1Types.Version,
  data: new Uint8Array([]),
}

const HeaderRecord = new ContainerType({
  blockHash: new ByteVectorType(32),
  totalDifficulty: new UintBigintType(32),
})
const EpochAccumulator = new ListCompositeType(HeaderRecord, 8192)

// Helper functions for export history > era1

/**
 * Compress data using snappy
 * @param uncompressedData
 * @returns compressed data
 */
export async function compressData(uncompressedData: Uint8Array): Promise<Uint8Array> {
  return new Promise((resolve, reject) => {
    const compressedChunks: Uint8Array[] = []
    const writableStream = new Writable({
      write(chunk: Uint8Array, encoding: string, callback: () => void) {
        compressedChunks.push(new Uint8Array(chunk))
        callback()
      },
    })

    const compress = new SnappyStream()

    compress.on('error', reject)
    writableStream.on('error', reject)
    writableStream.on('finish', () => {
      const totalLength = compressedChunks.reduce((sum, chunk) => sum + chunk.length, 0)
      const result = new Uint8Array(totalLength)
      let offset = 0
      for (const chunk of compressedChunks) {
        result.set(chunk, offset)
        offset += chunk.length
      }
      resolve(result)
    })

    compress.pipe(writableStream)

    compress.end(uncompressedData)
  })
}

/**
 * Format e2store entry
 * @param entry { type: entry type, data: uncompressed data }
 * @returns serialized entry
 */
export const formatEntry = async ({
  type,
  data,
}: {
  type: Uint8Array
  data: Uint8Array
}) => {
  const compressed = equalsBytes(type, Era1Types.TotalDifficulty)
    ? data
    : equalsBytes(type, Era1Types.AccumulatorRoot)
      ? data
      : equalsBytes(type, Era1Types.Version)
        ? data
        : equalsBytes(type, Era1Types.BlockIndex)
          ? data
          : await compressData(data)
  const length = compressed.length
  const lengthBytes = bigInt64ToBytes(BigInt(length), true).slice(0, 6)
  return concatBytes(type, lengthBytes, compressed)
}

/**
 * Format era1
 * @param blockTuples header, body, receipts, totalDifficulty
 * @param headerRecords array of Header Records { blockHash: Uint8Array, totalDifficulty: bigint }
 * @param epoch epoch index
 * @returns serialized era1 file
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
      data: new UintBigintType(32).serialize(totalDifficulty),
    })
    const entry = concatBytes(
      compressedHeader,
      compressedBody,
      compressedReceipts,
      compressedTotalDifficulty,
    )
    blocks.push(entry)
  }
  const blocksLength = blocks.reduce((acc, b) => acc + b.length, 0)

  const epochAccumulatorRoot = EpochAccumulator.hashTreeRoot(headerRecords)

  const accumulatorEntry = await formatEntry({
    type: Era1Types.AccumulatorRoot,
    data: epochAccumulatorRoot,
  })

  const startingNumber = bigInt64ToBytes(BigInt(epoch * 8192), true)
  const count = bigInt64ToBytes(BigInt(blocks.length), true)

  const blockIndexLength = 8 * blocks.length + 24

  const eraLength = version.length + blocksLength + accumulatorEntry.length + blockIndexLength

  const recordStart = eraLength - blockIndexLength
  const offsetBigInt: bigint[] = []
  for (let i = 0; i < blocks.length; i++) {
    if (i === 0) {
      const offset = 8 - recordStart
      offsetBigInt.push(BigInt(offset))
    } else {
      const offset = offsetBigInt[i - 1] + BigInt(blocks[i - 1].length)
      offsetBigInt.push(offset)
    }
  }

  const offsets: Uint8Array[] = offsetBigInt.map((o) => bigInt64ToBytes(o, true))

  // startingNumber | index | index | index ... | count
  const blockIndex = await formatEntry({
    type: Era1Types.BlockIndex,
    data: concatBytes(startingNumber, ...offsets, count),
  })

  // version | block-tuple* | other-entries | Accumulator | BLockIndex
  const era1 = concatBytes(version, ...blocks, accumulatorEntry, blockIndex)
  return era1
}
