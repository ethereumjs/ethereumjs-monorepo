const tape = require('tape')
const Common = require('../index.js')

tape('[Common]: Hardfork logic', function (t) {
  t.test('Hardfork access', function (st) {
    let supportedHardforks = [
      'chainstart',
      'homestead',
      'dao',
      'tangerineWhistle',
      'spuriousDragon',
      'byzantium',
      'constantinople',
      'hybridCasper'
    ]
    let c

    for (let hardfork of supportedHardforks) {
      c = new Common('mainnet', hardfork)
      st.equal(c.hardfork(), hardfork, hardfork)
    }

    st.end()
  })

  t.test('hardforkBlock()', function (st) {
    let c = new Common('ropsten')
    st.equal(c.hardforkBlock('byzantium'), 1700000, 'should return the correct HF change block for byzantium (provided)')

    c = new Common('ropsten', 'byzantium')
    st.equal(c.hardforkBlock(), 1700000, 'should return the correct HF change block for byzantium (set)')

    st.end()
  })

  t.test('isHardforkBlock()', function (st) {
    let c = new Common('ropsten')
    st.equal(c.isHardforkBlock(1700000, 'byzantium'), true, 'should return true for HF change block for byzantium (provided)')
    st.equal(c.isHardforkBlock(1700001, 'byzantium'), false, 'should return false for another block for byzantium (provided)')

    c = new Common('ropsten', 'byzantium')
    st.equal(c.isHardforkBlock(1700000), true, 'should return true for HF change block for byzantium (set)')
    st.equal(c.isHardforkBlock(1700001), false, 'should return false for another block for byzantium (set)')

    st.end()
  })

  t.test('activeHardforks()', function (st) {
    let c = new Common('ropsten')
    st.equal(c.activeHardforks().length, 5, 'should return 5 active hardforks for Ropsten')
    st.equal(c.activeHardforks()[3]['name'], 'spuriousDragon', 'should return the correct HF data for Ropsten')
    st.equal(c.activeHardforks(9).length, 3, 'should return 3 active hardforks for Ropsten up to block 9')
    st.equal(c.activeHardforks(10).length, 4, 'should return 4 active hardforks for Ropsten up to block 10')

    c = new Common('ropsten', null, ['spuriousDragon', 'byzantium', 'constantinople'])
    st.equal(c.activeHardforks(null, { onlySupported: true }).length, 2, 'should return 2 active HFs when restricted to supported HFs')

    st.end()
  })

  t.test('activeHardfork()', function (st) {
    let c = new Common('ropsten')
    st.equal(c.activeHardfork(), 'byzantium', 'should return byzantium as latest active HF for Ropsten')
    st.equal(c.activeHardfork(10), 'spuriousDragon', 'should return spuriousDragon as latest active HF for Ropsten for block 10')

    c = new Common('ropsten', null, ['tangerineWhistle', 'spuriousDragon'])
    st.equal(c.activeHardfork(null, { onlySupported: true }), 'spuriousDragon', 'should return spuriousDragon as latest active HF for Ropsten with limited supported hardforks')

    st.end()
  })

  t.test('hardforkIsActiveOnBlock() / activeOnBlock()', function (st) {
    let c = new Common('ropsten')
    st.equal(c.hardforkIsActiveOnBlock('byzantium', 1700000), true, 'Ropsten, byzantium (provided), 1700000 -> true')
    st.equal(c.hardforkIsActiveOnBlock('byzantium', 1700005), true, 'Ropsten, byzantium (provided), 1700005 -> true')
    st.equal(c.hardforkIsActiveOnBlock('byzantium', 1699999), false, 'Ropsten, byzantium (provided), 1699999 -> false')

    c = new Common('ropsten', 'byzantium')
    st.equal(c.hardforkIsActiveOnBlock(null, 1700000), true, 'Ropsten, byzantium (set), 1700000 -> true')
    st.equal(c.activeOnBlock(1700000), true, 'Ropsten, byzantium (set), 1700000 -> true (alias function)')
    st.equal(c.hardforkIsActiveOnBlock(null, 1700005), true, 'Ropsten, byzantium (set), 1700005 -> true')
    st.equal(c.hardforkIsActiveOnBlock(null, 1699999), false, 'Ropsten, byzantium (set), 1699999 -> false')

    st.end()
  })

  t.test('hardforkGteHardfork()', function (st) {
    let c = new Common('ropsten')
    st.equal(c.hardforkGteHardfork('hybridCasper', 'byzantium'), true, 'Ropsten, hybridCasper >= byzantium (provided) -> true')
    st.equal(c.hardforkGteHardfork('hybridCasper', 'byzantium', { onlyActive: true }), false, 'Ropsten, hybridCasper >= byzantium (provided), onlyActive -> fale')
    st.equal(c.hardforkGteHardfork('byzantium', 'byzantium'), true, 'Ropsten, byzantium >= byzantium (provided) -> true')
    st.equal(c.hardforkGteHardfork('spuriousDragon', 'byzantium'), false, 'Ropsten, spuriousDragon >= byzantium (provided) -> false')

    c = new Common('ropsten', 'byzantium')
    st.equal(c.hardforkGteHardfork(null, 'spuriousDragon'), true, 'Ropsten, byzantium (set) >= spuriousDragon -> true')
    st.equal(c.gteHardfork('spuriousDragon'), true, 'Ropsten, byzantium (set) >= spuriousDragon -> true (alias function)')
    st.equal(c.hardforkGteHardfork(null, 'spuriousDragon', { onlyActive: true }), true, 'Ropsten, byzantium (set) >= spuriousDragon, onlyActive -> true')
    st.equal(c.hardforkGteHardfork(null, 'byzantium'), true, 'Ropsten, byzantium (set) >= byzantium -> true')
    st.equal(c.hardforkGteHardfork(null, 'hybridCasper'), false, 'Ropsten, byzantium (set) >= hybridCasper -> false')

    st.end()
  })

  t.test('hardforkIsActiveOnChain()', function (st) {
    let c = new Common('ropsten')
    st.equal(c.hardforkIsActiveOnChain('byzantium'), true, 'should return true for byzantium (provided) on Ropsten')
    st.equal(c.hardforkIsActiveOnChain('dao'), false, 'should return false for dao (provided) on Ropsten')
    st.equal(c.hardforkIsActiveOnChain('hybridCasper'), false, 'should return false for hybridCasper (provided) on Ropsten')
    st.equal(c.hardforkIsActiveOnChain('notexistinghardfork'), false, 'should return false for a non-existing HF (provided) on Ropsten')
    st.doesNotThrow(function () { c.hardforkIsActiveOnChain('spuriousDragon', { onlySupported: true }) }, /unsupported hardfork$/, 'should not throw with unsupported Hf (provided) and onlySupported set to false') // eslint-disable-line no-new

    c = new Common('ropsten', 'byzantium')
    st.equal(c.hardforkIsActiveOnChain(), true, 'should return true for byzantium (set) on Ropsten')

    c = new Common('ropsten', null, ['byzantium', 'constantinople'])
    st.throws(function () { c.hardforkIsActiveOnChain('spuriousDragon', { onlySupported: true }) }, /not set as supported in supportedHardforks$/, 'should throw with unsupported Hf and onlySupported set to true') // eslint-disable-line no-new

    st.end()
  })

  t.test('consensus()/finality()', function (st) {
    let c = new Common('mainnet')
    st.equal(c.consensus('byzantium'), 'pow', 'should return pow for byzantium consensus')
    st.equal(c.consensus('hybridCasper'), 'pow', 'should return pow for hybridCasper consensus')
    st.equal(c.finality('byzantium'), null, 'should return null for byzantium finality')
    st.equal(c.finality('hybridCasper'), 'pos', 'should return pos for hybridCasper finality')

    st.end()
  })
})
