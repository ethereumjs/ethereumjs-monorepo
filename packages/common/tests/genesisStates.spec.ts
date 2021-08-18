import tape from 'tape'
import { genesisStateById, genesisStateByName } from '../src/genesisStates/'

// This testfile is deprecated and can be removed along with the removal of the
// two genesis functions called in the tests
tape('[genesisStates]: Genesis state access [DEPRECATED]', function (t: tape.Test) {
  t.test('Should be able to access by ID and name', function (st: tape.Test) {
    let genesisState = genesisStateById(5)
    st.equal(
      genesisState['0x0000000000000000000000000000000000000008'],
      '0x1',
      'Access by id (goerli)'
    )

    genesisState = genesisStateByName('goerli')
    st.equal(
      genesisState['0x0000000000000000000000000000000000000008'],
      '0x1',
      'Access by name (goerli)'
    )

    st.comment('-----------------------------------------------------------------')
    st.end()
  })
})
