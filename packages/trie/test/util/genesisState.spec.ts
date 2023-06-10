import { bytesToHex, parseGethGenesisState } from '@ethereumjs/util'
import * as tape from 'tape'

import { genesisStateRoot } from '../../src/util/genesisState'

tape('[Util/genesisStateRoot]', (t) => {
  t.test('should properly generate stateRoot from gethGenesis', async (st) => {
    // kiln genesis with deposit contract storage set
    const json = require(`../../../blockchain/test/testdata/geth-genesis-kiln.json`)
    const genesisState = parseGethGenesisState(json)
    const stateRoot = await genesisStateRoot(genesisState)
    st.equal(
      bytesToHex(stateRoot),
      '52e628c7f35996ba5a0402d02b34535993c89ff7fc4c430b2763ada8554bee62',
      'kiln stateRoot matches'
    )
    st.end()
  })

  t.test('should correctly derive ropsten stateRoot from ethereumjs genesis', async (st) => {
    const json = require(`../../../genesis/src/genesisStates/ropsten.json`)
    const stateRoot = await genesisStateRoot(json)
    st.equal(
      bytesToHex(stateRoot),
      '217b0bbcfb72e2d57e28f33cb361b9983513177755dc3f33ce3e7022ed62b77b',
      'ropsten stateRoot matches'
    )
    st.end()
  })
})
