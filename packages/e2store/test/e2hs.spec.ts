import { readFileSync } from 'fs'
import { createBlockHeaderFromRLP } from '@ethereumjs/block'
import { assert, beforeAll, describe, it } from 'vitest'
import {
  CommonTypes,
  decompressE2HSTuple,
  getBlockIndex,
  parseEH2SBlockTuple,
  readBlockIndex,
  readE2HSTupleAtIndex,
  readTuplesFromE2HS,
} from '../src/index.ts'

const filePath = './test/mainnet-00000-a6860fef.e2hs'
const expectedLength = 7356608

function readBinaryFile(path: string): Uint8Array {
  const buffer = readFileSync(path)
  return new Uint8Array(buffer)
}

describe('[E2Store/E2HS]: read mainnet fixture', () => {
  let e2hsFile: Uint8Array

  beforeAll(() => {
    e2hsFile = readBinaryFile(filePath)
  })

  it('fixture byte length matches pinned expectedLength', () => {
    assert.strictEqual(e2hsFile.length, expectedLength)
  })

  it('getBlockIndex() returns BlockIndex with 8192 records', () => {
    const blockIndex = getBlockIndex(e2hsFile)
    assert.deepEqual(blockIndex.type, CommonTypes.BlockIndex)
    assert.strictEqual(blockIndex.count, 8192)
    const { startingNumber, offsets } = readBlockIndex(blockIndex.data, blockIndex.count)
    assert.strictEqual(blockIndex.recordStart, e2hsFile.length - blockIndex.data.length - 8)
    assert.strictEqual(startingNumber, 0)
    assert.strictEqual(offsets.length, 8192)
  })

  for (let i = 0; i < 10; i++) {
    it(`iterator yields block ${i} header, body, and receipts`, async () => {
      const e2hsFile = readBinaryFile(filePath)
      const tuples = readTuplesFromE2HS(e2hsFile)
      let tuple
      for (let j = 0; j <= i; j++) {
        tuple = await tuples.next()
      }
      assert.isDefined(tuple!.value)
      const { headerWithProof, body, receipts } = parseEH2SBlockTuple(
        await decompressE2HSTuple(tuple!.value!),
      )
      assert.isDefined(body)
      assert.isDefined(receipts)
      const blockHeader = createBlockHeaderFromRLP(headerWithProof.header, { setHardfork: true })
      assert.strictEqual(blockHeader.number, BigInt(i))
    })
  }

  for (let trial = 0; trial < 10; trial++) {
    it(`readE2HSTupleAtIndex() reads random index trial ${trial}`, async () => {
      const e2hsFile = readBinaryFile(filePath)
      const index = Math.floor(Math.random() * 8192)
      const tuple = await readE2HSTupleAtIndex(e2hsFile, index)
      assert.isDefined(tuple)
      const { headerWithProof, body, receipts } = parseEH2SBlockTuple(
        await decompressE2HSTuple(tuple),
      )
      assert.isDefined(body)
      assert.isDefined(receipts)
      const blockHeader = createBlockHeaderFromRLP(headerWithProof.header, { setHardfork: true })
      assert.strictEqual(blockHeader.number, BigInt(index))
    })
  }
})
