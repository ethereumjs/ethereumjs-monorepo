import { readFileSync } from 'fs'
import { createBlockHeaderFromBytesArray } from '@ethereumjs/block'
import { bytesToHex } from '@ethereumjs/util'
import { assert, describe, expect, it } from 'vitest'

import {
  CommonTypes,
  getBlockIndex,
  parseBlockTuple,
  readBlockIndex,
  readBlockTupleAtOffset,
  readOtherEntries,
  validateERA1,
} from '../src/index.ts'

// Reference file downloaded from era1.ethportal.net
const filePath = './test/mainnet-00000-5ec1ffb8.era1'
const expectedLength = 3891337

function readBinaryFile(filePath: string): Uint8Array {
  const buffer = readFileSync(filePath)
  return new Uint8Array(buffer)
}

describe('Read Era1', async () => {
  const era1File = readBinaryFile(filePath)
  it('should read the file', () => {
    expect(era1File.length).toEqual(expectedLength)
  })
  const blockIndex = getBlockIndex(era1File)
  it('should have block index type', () => {
    assert.deepEqual(blockIndex.type, CommonTypes.BlockIndex)
  })
  it('should have correct count', () => {
    expect(blockIndex.count).toEqual(8192)
  })
  const { startingNumber, offsets } = readBlockIndex(blockIndex.data, blockIndex.count)
  it('should read block index', () => {
    expect(startingNumber).toEqual(0)
    expect(offsets.length).toEqual(8192)
  })
  const { accumulatorRoot, otherEntries } = await readOtherEntries(era1File)
  it('should read accumulator root', () => {
    assert.strictEqual(
      bytesToHex(accumulatorRoot),
      '0x5ec1ffb8c3b146f42606c74ced973dc16ec5a107c0345858c343fc94780b4218',
    )
  })
  it('should read other entries', () => {
    expect(otherEntries.length).toEqual(0)
  })
  it('should read first block tuple', async () => {
    const tupleEntry = readBlockTupleAtOffset(era1File, blockIndex.recordStart, offsets[0])
    const { header, totalDifficulty } = await parseBlockTuple(tupleEntry)
    const blockHeader = createBlockHeaderFromBytesArray(header.data, { setHardfork: true })
    expect(blockHeader.number).toEqual(0n)
    expect(totalDifficulty.data).toEqual(blockHeader.difficulty)
  })
  const valid = await validateERA1(era1File)
  it('should validate era1 file', () => {
    expect(valid).toEqual(true)
  })
})
