import { readFileSync } from 'fs'
import { createBlockHeaderFromRLP } from '@ethereumjs/block'
import { describe, expect, it } from 'vitest'
import {
  CommonTypes,
  decompressE2HSTuple,
  getBlockIndex,
  parseEH2SBlockTuple,
  readBlockIndex,
  readE2HSTupleAtIndex,
  readTuplesFromE2HS,
} from '../src/index.ts'

// Reference file downloaded from era1.ethportal.net
const filePath = './test/mainnet-00000-a6860fef.e2hs'
const expectedLength = 7356608

function readBinaryFile(filePath: string): Uint8Array {
  const buffer = readFileSync(filePath)
  return new Uint8Array(buffer)
}

describe('Read E2HS', async () => {
  const e2hsFile = readBinaryFile(filePath)
  it('file should not have changed', () => {
    expect(e2hsFile.length).toEqual(expectedLength)
  })

  const blockIndex = getBlockIndex(e2hsFile)

  it('should read the block index', () => {
    expect(blockIndex.type).toEqual(CommonTypes.BlockIndex)
    expect(blockIndex.count).toEqual(8192)
  })

  const { startingNumber, offsets } = readBlockIndex(blockIndex.data, blockIndex.count)
  it('should read block Index', () => {
    expect(blockIndex.recordStart).toEqual(e2hsFile.length - blockIndex.data.length - 8)
    expect(startingNumber).toEqual(0)
    expect(offsets.length).toEqual(8192)
  })

  // Test reading tuples from E2HS using the iterator
  const tuples = readTuplesFromE2HS(e2hsFile)
  for (let i = 0; i < 10; i++) {
    const tuple = await tuples.next()
    it('should read the block', () => {
      expect(tuple.value).toBeDefined()
    })
    const { headerWithProof, body, receipts } = parseEH2SBlockTuple(
      await decompressE2HSTuple(tuple.value!),
    )

    it(`should read block ${i} body`, () => {
      expect(body).toBeDefined()
    })
    it(`should read block ${i} receipts`, () => {
      expect(receipts).toBeDefined()
    })

    const blockHeader = createBlockHeaderFromRLP(headerWithProof.header, { setHardfork: true })

    it(`should find block ${i} header`, () => {
      expect(blockHeader.number).toEqual(BigInt(i))
    })
  }

  // Test reading tuples from E2HS using the index
  for (let i = 0; i < 10; i++) {
    const index = Math.floor(Math.random() * 8192)
    const tuple = await readE2HSTupleAtIndex(e2hsFile, index)
    it('should read the tuple', () => {
      expect(tuple).toBeDefined()
    })
    const { headerWithProof, body, receipts } = parseEH2SBlockTuple(
      await decompressE2HSTuple(tuple),
    )
    it(`should read block ${index} body`, () => {
      expect(body).toBeDefined()
    })
    it(`should read block ${index} receipts`, () => {
      expect(receipts).toBeDefined()
    })

    const blockHeader = createBlockHeaderFromRLP(headerWithProof.header, { setHardfork: true })

    it(`should find block ${index} header`, () => {
      expect(blockHeader.number).toEqual(BigInt(index))
    })
  }
})
