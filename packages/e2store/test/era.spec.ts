import { readFileSync } from 'fs'
import { assert, beforeAll, describe, it } from 'vitest'

import {
  readBeaconBlock,
  readBeaconState,
  readBlocksFromEra,
  readSlotIndex,
} from '../src/era/index.ts'
import { readBinaryFile } from '../src/index.ts'

// To test this, download mainnet-01339-75d1c621.era from https://mainnet.era.nimbus.team/mainnet-01339-75d1c621.era
// This era file is around 500mb in size so don't commit it to the repo
describe.skip('it should be able to extract beacon objects from an era file', () => {
  let data: Uint8Array
  beforeAll(() => {
    data = readBinaryFile(__dirname + '/mainnet-01339-75d1c621.era')
  })
  it('should read a slot index from the era file', async () => {
    const slotIndex = readSlotIndex(data)
    assert.strictEqual(slotIndex.startSlot, 10969088)
  })
  it('should extract the beacon state', async () => {
    const state = await readBeaconState(data)
    assert.strictEqual(Number(state.slot), 10969088)
  }, 30000)
  it('should read a block from the era file and decompress it', async () => {
    const block = await readBeaconBlock(data, 0)
    assert.strictEqual(Number(block.message.slot), 10960896)
  })
  it('read blocks from an era file', async () => {
    let count = 0
    for await (const block of readBlocksFromEra(data)) {
      assert.isDefined(block.message.slot)
      count++
      if (count > 10) break
    }
  }, 30000)
  it('reads no blocks from the genesis era file', async () => {
    // https://mainnet.era.nimbus.team/mainnet-00000-4b363db9.era
    const data = new Uint8Array(readFileSync(__dirname + '/mainnet-00000-4b363db9.era'))
    for await (const block of readBlocksFromEra(data)) {
      assert.strictEqual(block, undefined)
    }
  })
})

describe.skip('it should be able to extract beacon objects from an era file', () => {
  it('should extract the beacon state for Phase0 state', async () => {
    // https://mainnet.era.nimbus.team/mainnet-00265-1468e348.era
    const data = readBinaryFile(__dirname + '/mainnet-00265-1468e348.era')
    const state = await readBeaconState(data)
    assert.strictEqual(Number(state.slot), 2170880)
  }, 30000)
  it('should extract the beacon state for Altair state', async () => {
    // https://mainnet.era.nimbus.team/mainnet-00291-5cffd097.era
    const data = readBinaryFile(__dirname + '/mainnet-00291-5cffd097.era')
    const state = await readBeaconState(data)
    assert.strictEqual(Number(state.slot), 2383872)
  }, 30000)
  it('should extract the beacon state for Bellatrix state', async () => {
    // https://mainnet.era.nimbus.team/mainnet-00600-e031a37d.era
    const data = readBinaryFile(__dirname + '/mainnet-00600-e031a37d.era')
    const state = await readBeaconState(data)
    assert.strictEqual(Number(state.slot), 4915200)
  }, 30000)
  it('should extract the beacon state and blocks for Capella state', async () => {
    // https://mainnet.era.nimbus.team/mainnet-00780-bb546fec.era
    const data = readBinaryFile(__dirname + '/mainnet-00780-bb546fec.era')
    const state = await readBeaconState(data)
    assert.strictEqual(Number(state.slot), 6389760)

    let count = 0

    for await (const _block of readBlocksFromEra(data)) {
      count++
      if (count > 10) break
    }
  }, 30000)
})
