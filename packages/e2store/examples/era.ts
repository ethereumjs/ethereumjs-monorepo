import { readFileSync } from 'fs'
import { bytesToHex } from '@ethereumjs/util'

import { readBeaconBlock, readBeaconState, readBlocksFromEra, readSlotIndex } from '../src/index.ts'

// Reference file downloaded from era.nimbus.team
const PATH_TO_ERA_FILE = './test/mainnet-00001-40cf2f3c.era'
const eraFile = new Uint8Array(readFileSync(PATH_TO_ERA_FILE))

// Read slot index from era file
const slotIndex = readSlotIndex(eraFile)
console.log('slotIndex', {
  startSlot: slotIndex.startSlot,
  recordStart: slotIndex.recordStart,
  slotOffsets: slotIndex.slotOffsets.length + ' slots',
})

// Read beacon state from era file
const state = await readBeaconState(eraFile)
console.log('beaconState', {
  slot: state.slot,
  validators: state.validators.length,
})

// Read a specific beacon block
const block = await readBeaconBlock(eraFile, 0)
console.log('beaconBlock', {
  slot: block.message.slot,
  proposer_index: block.message.proposer_index,
})

// Read blocks from era file
const blocks = readBlocksFromEra(eraFile)

const firstBlock = (await blocks.next()).value!

console.log(`Block`, firstBlock)
