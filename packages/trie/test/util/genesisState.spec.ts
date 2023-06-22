import { bytesToHex, parseGethGenesisState } from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import { genesisStateRoot } from '../../src/util/genesisState'

describe('[Util/genesisStateRoot]', () => {
  it('should properly generate stateRoot from gethGenesis', async () => {
    // kiln genesis with deposit contract storage set
    const json = require(`../../../blockchain/test/testdata/geth-genesis-kiln.json`)
    const genesisState = parseGethGenesisState(json)
    const stateRoot = await genesisStateRoot(genesisState)
    assert.equal(
      bytesToHex(stateRoot),
      '52e628c7f35996ba5a0402d02b34535993c89ff7fc4c430b2763ada8554bee62',
      'kiln stateRoot matches'
    )
  })
})
