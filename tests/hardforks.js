const tape = require('tape')
const hfParams = require('./../hardforks/index.js')

tape('Hardfork parameter access', function (t) {
  t.test('Accessor/utility functions should work', function (st) {
    st.equal(hfParams.gasConfig('minGasLimit', 'chainstart'), 5000, 'Fork-specifc access, topic: gasConfig')
    st.equal(hfParams.latestGasConfig('minGasLimit'), 5000, 'Latest fork access, topic: gasConfig')

    let error = null
    try {
      hfParams.gasPrices('ecAddGas', 'chainstart')
    } catch (err) {
      error = err
    }
    st.notEqual(error, null, 'Fork-specifc access, not available, topic: gasPrices')
    st.equal(hfParams.gasPrices('ecAddGas', 'byzantium'), 500, 'Fork-specifc access, available, topic: gasPrices')

    st.equal(hfParams.gasPrices('sload', 'homestead'), 50, 'Fork-specifc access, before value changed')
    st.equal(hfParams.gasPrices('sload', 'tangerineWhistle'), 200, 'Fork-specifc access, after value changed')

    st.end()
  })
})
