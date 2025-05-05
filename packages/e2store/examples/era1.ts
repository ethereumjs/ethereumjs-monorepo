import { readFileSync } from 'fs'
import { bytesToHex } from '@ethereumjs/util'

import {
  EpochAccumulator,
  blockFromTuple,
  getBlockIndex,
  getHeaderRecords,
  parseBlockTuple,
  readBlockIndex,
  readBlockTupleAtOffset,
  readERA1,
  readOtherEntries,
  validateERA1,
} from '../src/index.ts'

// Reference file downloaded from era1.ethportal.net
const PATH_TO_ERA1_FILE = './test/mainnet-00000-5ec1ffb8.era1'
const era1File = new Uint8Array(readFileSync(PATH_TO_ERA1_FILE))

const blockIndex = getBlockIndex(era1File)
console.log('blockIndex', {
  type: blockIndex.type,
  count: blockIndex.count,
  recordStart: blockIndex.recordStart,
  data: blockIndex.data.length + ' bytes',
})

const { startingNumber, offsets } = readBlockIndex(blockIndex.data, blockIndex.count)
console.log('startingNumber', startingNumber)
console.log('offsets', offsets.length)

const { accumulatorRoot, otherEntries } = await readOtherEntries(era1File)
console.log('accumulatorRoot', bytesToHex(accumulatorRoot))
console.log('otherEntries', otherEntries.length)

const headerRecords = await getHeaderRecords(era1File)
const epochAccumulator = EpochAccumulator.encode(headerRecords)
const epochAccumulatorRoot = EpochAccumulator.merkleRoot(headerRecords)

console.log('epochAccumulator', epochAccumulator.length + ' bytes')
console.log('epochAccumulatorRoot', bytesToHex(epochAccumulatorRoot))
console.log(
  'Reconstructed root matches encoded root',
  bytesToHex(epochAccumulatorRoot) === bytesToHex(accumulatorRoot),
)

const tuples = await readERA1(era1File)
const tupleEntry = await tuples.next()
console.log('tupleEntry', tupleEntry.value!)

const tuple = await parseBlockTuple(tupleEntry.value!)
console.log('parsed tuple', tuple)

const block = blockFromTuple(tuple)
console.log('block', block)

const valid = await validateERA1(era1File)
console.log('valid', valid)
