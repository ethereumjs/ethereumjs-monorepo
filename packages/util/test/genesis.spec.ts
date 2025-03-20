import { assert, describe, it } from 'vitest'

import { parseGethGenesisState } from '../src/genesis.ts'

// kiln genesis with deposit contract storage set
import { gethGenesisKilnData } from './testdata/gethGenesisKiln.ts'

describe('[Util/genesis]', () => {
  it('should properly generate stateRoot from gethGenesis', () => {
    const genesisState = parseGethGenesisState(gethGenesisKilnData)
    // just check for deposit contract inclusion
    assert.equal(
      genesisState['0x4242424242424242424242424242424242424242'][1].includes(
        // sample data check
        '0x60806040526004361061003',
      ),
      true,
      'should have deposit contract',
    )
  })
})
