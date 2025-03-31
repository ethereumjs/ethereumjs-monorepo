import { EthereumJSErrorWithoutCode } from '@ethereumjs/rlp'
import { bytesToBigInt64, equalsBytes } from '@ethereumjs/util'
import { readEntry } from './e2store.ts'
import { CommonTypes } from './types.ts'

export function getBlockIndex(bytes: Uint8Array) {
  const count = Number(bytesToBigInt64(bytes.slice(-8), true))
  const recordLength = 8 * count + 24
  const recordEnd = bytes.length
  const recordStart = recordEnd - recordLength
  const { data, type } = readEntry(bytes.subarray(recordStart, recordEnd))
  if (!equalsBytes(type, CommonTypes.BlockIndex)) {
    throw EthereumJSErrorWithoutCode('not a valid block index')
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
