import * as tape from 'tape'
import { genesisStateById, genesisStateByName } from '../src/genesisStates/'

tape('[genesisStates]: Genesis state access', function(t: tape.Test) {
  t.test('Should be able to access by ID and name', function(st: tape.Test) {
    let genesisState = genesisStateById(6284)
    st.equal(
      genesisState['0x0000000000000000000000000000000000000008'],
      '0x1',
      'Access by id (goerli)',
    )

    genesisState = genesisStateByName('goerli')
    st.equal(
      genesisState['0x0000000000000000000000000000000000000008'],
      '0x1',
      'Access by name (goerli)',
    )

    st.comment('-----------------------------------------------------------------')
    st.end()
  })
})
