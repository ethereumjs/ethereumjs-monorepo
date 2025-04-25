import { EthereumJSErrorWithoutCode } from '@ethereumjs/rlp'
import { bigInt64ToBytes, bytesToBigInt64, concatBytes, equalsBytes } from '@ethereumjs/util'
import { formatEntry, readEntry } from './e2store.ts'
import { CommonTypes, VERSION } from './types.ts'

export function getBlockIndex(bytes: Uint8Array) {
  const count = Number(bytesToBigInt64(bytes.slice(-8), true))
  const recordLength = 8 * count + 24
  const recordEnd = bytes.length
  const recordStart = recordEnd - recordLength
  const { data, type } = readEntry(bytes.subarray(recordStart, recordEnd))
  if (!equalsBytes(type, CommonTypes.BlockIndex)) {
    throw EthereumJSErrorWithoutCode(
      `Expected block index (type: ${CommonTypes.BlockIndex}) but got ${type}`,
    )
  }
  return { data, type, count, recordStart }
}

export function readBlockIndex(data: Uint8Array, count: number) {
  const startingNumber = Number(bytesToBigInt64(data.slice(0, 8), true))
  const offsets: number[] = []
  for (let i = 0; i < count; i++) {
    const slotEntry = data.subarray((i + 1) * 8, (i + 2) * 8)
    const offset = Number(new DataView(slotEntry.slice(0, 8).buffer).getBigInt64(0, true))
    offsets.push(offset)
  }
  return {
    startingNumber,
    offsets,
  }
}

export async function createBlockIndex(blockTuples: Uint8Array[], startingNumber: bigint) {
  const version = await formatEntry(VERSION)
  const tuplesLength = blockTuples.reduce((acc, b) => acc + b.length, 0)
  const count = bigInt64ToBytes(BigInt(blockTuples.length), true)
  const blockIndexLength = 8 * blockTuples.length + 24
  const e2hsLength = version.length + tuplesLength + count.length + blockIndexLength
  const recordStart = e2hsLength - blockIndexLength
  const offsetBigInt: bigint[] = []
  for (let i = 0; i < blockTuples.length; i++) {
    if (i === 0) {
      const offset = 8 - recordStart
      offsetBigInt.push(BigInt(offset))
    } else {
      const offset = offsetBigInt[i - 1] + BigInt(blockTuples[i - 1].length)
      offsetBigInt.push(offset)
    }
  }
  const offsets: Uint8Array[] = offsetBigInt.map((o) => bigInt64ToBytes(o, true))
  const blockIndex = await formatEntry({
    type: CommonTypes.BlockIndex,
    data: concatBytes(bigInt64ToBytes(startingNumber, true), ...offsets, count),
  })
  return blockIndex
}
