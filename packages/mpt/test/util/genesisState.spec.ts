import { type GenesisState, parseGethGenesisState } from '@ethereumjs/common'
import { getGenesis } from '@ethereumjs/genesis'
// kiln genesis with deposit contract storage set
import { kilnGethGenesis } from '@ethereumjs/testdata'
import { assert, describe, it } from 'vitest'

import { genesisMPTStateRoot } from '../../src/util/genesisState.ts'

import { bytesToHex } from '@ethereumjs/util'

describe('[Util/genesisStateRoot]', () => {
  it('should properly generate stateRoot from gethGenesis', async () => {
    const genesisState = parseGethGenesisState(kilnGethGenesis)
    const stateRoot = await genesisMPTStateRoot(genesisState)
    assert.strictEqual(
      bytesToHex(stateRoot),
      '0x52e628c7f35996ba5a0402d02b34535993c89ff7fc4c430b2763ada8554bee62',
      'kiln stateRoot matches',
    )
  })
})

it('should correctly derive mainnet stateRoot from ethereumjs genesis', async () => {
  const stateRoot = await genesisMPTStateRoot(getGenesis(1) as GenesisState)
  assert.strictEqual(
    bytesToHex(stateRoot),
    '0xd7f8974fb5ac78d9ac099b9ad5018bedc2ce0a72dad1827a1709da30580f0544',
    'mainnet stateRoot matches',
  )
}, 40_000)
