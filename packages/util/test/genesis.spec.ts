import * as tape from 'tape'

import { parseGethGenesisState } from '../src/genesis'

tape('[Util/genesis]', (t) => {
  t.test('should properly generate stateRoot from gethGenesis', async (st) => {
    // kiln genesis with deposit contract storage set
    const json = require(`../../blockchain/test/testdata/geth-genesis-kiln.json`)
    const genesisState = parseGethGenesisState(json)
    // just check for deposit contract inclusion
    st.ok(
      genesisState['0x4242424242424242424242424242424242424242'][1].includes(
        // sample data check
        '0x60806040526004361061003'
      ),
      'should have deposit contract'
    )
    st.end()
  })
})
