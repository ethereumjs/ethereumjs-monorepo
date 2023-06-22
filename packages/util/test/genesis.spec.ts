import { assert, describe, it } from 'vitest'

import { parseGethGenesisState } from '../src/genesis'

// kiln genesis with deposit contract storage set
import gethGenesisKilnJSON from './testdata/geth-genesis-kiln.json'

describe('[Util/genesis]', () => {
  it('should properly generate stateRoot from gethGenesis', () => {
    const genesisState = parseGethGenesisState(gethGenesisKilnJSON)
    // just check for deposit contract inclusion
    assert.equal(
      genesisState['0x4242424242424242424242424242424242424242'][1].includes(
        // sample data check
        '0x60806040526004361061003'
      ),
      true,
      'should have deposit contract'
    )
  })
})
