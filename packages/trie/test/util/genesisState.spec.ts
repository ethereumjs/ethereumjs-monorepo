import { getGenesis } from '@ethereumjs/genesis'
import { bytesToHex, parseGethGenesisState } from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import { genesisStateRoot } from '../../src/util/genesisState.js'
// kiln genesis with deposit contract storage set
import gethGenesisKilnJSON from '../fixtures/geth-genesis-kiln.json'

import type { GenesisState } from '@ethereumjs/util'

describe('[Util/genesisStateRoot]', () => {
  it('should properly generate stateRoot from gethGenesis', async () => {
    const genesisState = parseGethGenesisState(gethGenesisKilnJSON)
    const stateRoot = await genesisStateRoot(genesisState)
    assert.equal(
      bytesToHex(stateRoot),
      '0x52e628c7f35996ba5a0402d02b34535993c89ff7fc4c430b2763ada8554bee62',
      'kiln stateRoot matches',
    )
  })
})

it('should correctly derive mainnet stateRoot from ethereumjs genesis', async () => {
  const stateRoot = await genesisStateRoot(getGenesis(1) as GenesisState)
  assert.equal(
    bytesToHex(stateRoot),
    '0xd7f8974fb5ac78d9ac099b9ad5018bedc2ce0a72dad1827a1709da30580f0544',
    'mainnet stateRoot matches',
  )
})
