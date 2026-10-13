import { readFileSync } from 'fs'
import { createBlockHeaderFromBytesArray } from '@ethereumjs/block'
import { bytesToHex } from '@ethereumjs/util'
import { assert, beforeAll, describe, it } from 'vitest'

import {
  CommonTypes,
  getBlockIndex,
  parseBlockTuple,
  readBlockIndex,
  readBlockTupleAtOffset,
  readOtherEntries,
  validateERA1,
} from '../src/index.ts'

const filePath = './test/mainnet-00000-5ec1ffb8.era1'
const expectedLength = 3891337

function readBinaryFile(path: string): Uint8Array {
  const buffer = readFileSync(path)
  return new Uint8Array(buffer)
}

describe('[E2Store/ERA1]: read mainnet fixture', () => {
  let era1File: Uint8Array

  beforeAll(() => {
    era1File = readBinaryFile(filePath)
  })

  it('fixture byte length matches pinned expectedLength', () => {
    assert.strictEqual(era1File.length, expectedLength)
  })

  it('getBlockIndex() returns BlockIndex with 8192 records', () => {
    const blockIndex = getBlockIndex(era1File)
    assert.deepEqual(blockIndex.type, CommonTypes.BlockIndex)
    assert.strictEqual(blockIndex.count, 8192)
    const { startingNumber, offsets } = readBlockIndex(blockIndex.data, blockIndex.count)
    assert.strictEqual(startingNumber, 0)
    assert.strictEqual(offsets.length, 8192)
  })

  it('readOtherEntries() returns accumulator root and no other entries', async () => {
    const { accumulatorRoot, otherEntries } = await readOtherEntries(era1File)
    assert.strictEqual(
      bytesToHex(accumulatorRoot),
      '0x5ec1ffb8c3b146f42606c74ced973dc16ec5a107c0345858c343fc94780b4218',
    )
    assert.strictEqual(otherEntries.length, 0)
  })

  it('readBlockTupleAtOffset() reads genesis block header and TD', async () => {
    const blockIndex = getBlockIndex(era1File)
    const { offsets } = readBlockIndex(blockIndex.data, blockIndex.count)
    const tupleEntry = readBlockTupleAtOffset(era1File, blockIndex.recordStart, offsets[0])
    const { header, totalDifficulty } = await parseBlockTuple(tupleEntry)
    const blockHeader = createBlockHeaderFromBytesArray(header.data, { setHardfork: true })
    assert.strictEqual(blockHeader.number, 0n)
    assert.deepEqual(totalDifficulty.data, blockHeader.difficulty)
  })

  it('validateERA1() returns true for fixture', async () => {
    assert.strictEqual(await validateERA1(era1File), true)
  })
})
