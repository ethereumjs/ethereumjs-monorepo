const tape = require('tape')
const Common = require('../index.js')

tape('[Common]: Parameter access', function (t) {
  t.test('Basic usage', function (st) {
    let c = new Common('mainnet')
    st.equal(c.param('gasPrices', 'ecAdd', 'byzantium'), 500, 'Should return correct value when HF directly provided')

    c.setHardfork('byzantium')
    st.equal(c.param('gasPrices', 'ecAdd'), 500, 'Should return correct value for HF set in class')

    st.end()
  })

  t.test('Error cases', function (st) {
    let c = new Common('mainnet')
    st.throws(function () { c.param('gasPrices', 'ecAdd') }, /neither a hardfork set nor provided by param$/, 'Should throw when no hardfork set or provided')
    st.throws(function () { c.param('gasPrizes', 'ecAdd', 'byzantium') }, /Topic gasPrizes not defined$/, 'Should throw when called with non-existing topic')
    st.throws(function () { c.param('gasPrices', 'notexistingvalue', 'byzantium') }, /value for notexistingvalue not found$/, 'Should throw when called with non-existing value')

    c.setHardfork('byzantium')
    st.equal(c.param('gasPrices', 'ecAdd'), 500, 'Should return correct value for HF set in class')

    c = new Common('mainnet', 'byzantium', ['byzantium', 'constantinople'])
    st.throws(function () { c.param('gasPrices', 'expByte', 'spuriousDragon') }, /supportedHardforks$/, 'Should throw when calling param() with an unsupported hardfork')
    st.throws(function () { c.paramByBlock('gasPrices', 'expByte', 0) }, /supportedHardforks$/, 'Should throw when calling paramByBlock() with an unsupported hardfork')

    st.end()
  })

  t.test('Parameter updates', function (st) {
    let c = new Common('mainnet')
    st.throws(function () { c.param('gasPrices', 'ecAdd', 'spuriousDragon') }, /value for ecAdd not found$/, 'Should throw for a value set on a later HF')

    st.equal(c.param('pow', 'minerReward', 'chainstart'), '5000000000000000000', 'Should return correct value for chain start')
    st.equal(c.param('pow', 'minerReward', 'byzantium'), '3000000000000000000', 'Should reflect HF update changes')
    st.equal(c.param('gasPrices', 'netSstoreNoopGas', 'constantinople'), 200, 'Should return updated sstore gas prices for constantinople')

    st.end()
  })

  t.test('Access by block number, paramByBlock()', function (st) {
    let c = new Common('mainnet', 'byzantium')

    st.equal(c.paramByBlock('pow', 'minerReward', 4370000), '3000000000000000000', 'Should correctly translate block numbers into HF states (updated value)')
    st.equal(c.paramByBlock('pow', 'minerReward', 4369999), '5000000000000000000', 'Should correctly translate block numbers into HF states (original value)')

    st.end()
  })
})
