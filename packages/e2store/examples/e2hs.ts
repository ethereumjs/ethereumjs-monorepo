// Reference file downloaded from era1.ethportal.net
import { readFileSync } from 'fs'
import type { BlockBytes } from '@ethereumjs/block'
import { createBlockFromBytesArray } from '@ethereumjs/block'
import { RLP } from '@ethereumjs/rlp'
import {
  decompressE2HSTuple,
  getBlockIndex,
  parseEH2SBlockTuple,
  readBlockIndex,
  readE2HSTupleAtIndex,
  readTuplesFromE2HS,
} from '../src/index.ts'

const PATH_TO_E2HS_FILE = './test/mainnet-00000-a6860fef.e2hs'
const e2hsFile = new Uint8Array(readFileSync(PATH_TO_E2HS_FILE))

const blockIndex = getBlockIndex(e2hsFile)
console.log('blockIndex', {
  type: blockIndex.type,
  count: blockIndex.count,
  recordStart: blockIndex.recordStart,
  data: blockIndex.data.length + ' bytes',
})

const { startingNumber, offsets } = readBlockIndex(blockIndex.data, blockIndex.count)
console.log('startingNumber', startingNumber)
console.log('offsets', offsets.length)

const tuples = readTuplesFromE2HS(e2hsFile)

const tuple = (await tuples.next()).value
console.log('Tuple', tuple)

const decompressedTuple = await decompressE2HSTuple(tuple!)
console.log('decompressedTuple', decompressedTuple)

const parsedTuple = parseEH2SBlockTuple(decompressedTuple)
console.log('parsedTuple', parsedTuple)

const block = createBlockFromBytesArray(
  [RLP.decode(parsedTuple.headerWithProof.header), ...parsedTuple.body] as BlockBytes,
  { setHardfork: true },
)
console.log('block', block)

const targetIndex = 1234
const tupleAtIndex = await readE2HSTupleAtIndex(e2hsFile, targetIndex)
console.log('tuple at index 1234', tupleAtIndex)
